"use client";

import { FormEvent, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User2,
  Wallet,
  Wrench,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useLogin, useRegister, useUser } from "@/hooks/useAuth";
import { getDashboardPathForRole } from "@/api-client";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import type { UserRole } from "@/types";
import Image from "next/image";

type AuthMode = "login" | "register";

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: "Escrow Protection",
    description: "Funds are held securely until both parties confirm completion.",
  },
  {
    icon: Wallet,
    title: "Transparent Payments",
    description: "Track funding, escrow state, and release in one workspace.",
  },
  {
    icon: Wrench,
    title: "Built for Real Work",
    description: "Post jobs, submit proposals, and contract artisans end-to-end.",
  },
];

const stats = [
  { value: "2,400+", label: "Artisans" },
  { value: "98%", label: "Completion rate" },
  { value: "₦0", label: "Hidden fees" },
];

const roleOptions: Array<{
  value: UserRole;
  label: string;
  description: string;
  icon: typeof Briefcase;
}> = [
  {
    value: "CLIENT",
    label: "Client",
    description: "Post jobs & hire verified artisans",
    icon: Briefcase,
  },
  {
    value: "ARTISAN",
    label: "Artisan",
    description: "Find work & get paid securely",
    icon: Wrench,
  },
];

const formFieldVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: "easeOut" as const },
  }),
};

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const userQuery = useUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("CLIENT");
  const hasHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const activeMutation = mode === "login" ? loginMutation : registerMutation;
  const isBusy = activeMutation.status === "pending";

  useEffect(() => {
    if (!hasHydrated) return;
    // Don't redirect while a mutation is in flight — prevents race condition
    if (isBusy) return;
    if (userQuery.data?.role) {
      router.replace(getDashboardPathForRole(userQuery.data.role));
    }
  }, [hasHydrated, router, userQuery.data?.role, isBusy]);

  // Clear form error when user starts typing (Removed)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (mode === "login") {
      const toastId = toast.loading("Signing you in...");
      loginMutation.mutate(
        { email: normalizedEmail, password },
        {
          onSuccess: ({ user }) => {
            toast.success("Login successful.", { id: toastId });
            setPassword("");
            window.location.replace(getDashboardPathForRole(user.role));
          },
          onError: (error) => {
            toast.error(error.message || "Login failed.", { id: toastId });
          },
        },
      );
      return;
    }

    const toastId = toast.loading("Creating your account...");
    registerMutation.mutate(
      { name: trimmedName, email: normalizedEmail, password, role },
      {
        onSuccess: ({ user }) => {
          toast.success("Account created! Redirecting to verification...", { id: toastId });
          setName("");
          setEmail("");
          setPassword("");
          setRole("CLIENT");
          window.location.replace(`/auth/verify-email?email=${encodeURIComponent(user.email)}`);
        },
        onError: (error) => {
          toast.error(error.message || "Registration failed.", { id: toastId });
        },
      },
    );
  };

  // Stagger index offset for register vs login (register has extra name field)
  const emailIdx = mode === "register" ? 1 : 0;
  const passwordIdx = emailIdx + 1;
  const roleIdx = passwordIdx + 1;
  const submitIdx = roleIdx + 1;

  return (
    <main className="min-h-screen flex">
      {/* ── Brand side panel ───────────────────────────────────── */}
      <aside className="hidden lg:flex lg:w-[45%] relative border-r border-border overflow-hidden flex-col justify-between p-12 bg-sidebar">
        {/* Floating decorative orbs */}
        <motion.div
          className="absolute top-20 right-16 size-40 rounded-full bg-primary/5 blur-2xl"
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 left-10 size-56 rounded-full bg-primary/5 blur-3xl"
          animate={{ y: [0, 15, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex flex-col h-full gap-8">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="flex bg-primary/10 backdrop-blur-sm rounded-lg p-1.5 border border-primary/20">
              <ShieldCheck className="size-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Work<span className="text-primary">Sure</span>
            </span>
          </Link>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-sidebar-foreground">
              {mode === "login" ? "Welcome back!" : "Create your account"}
            </h1>
            <p className="text-base text-muted-foreground flex max-w-[280px]">
               {mode === "login" ? "Log in to your account to continue." : "Join WorkSure and start connecting today."}
            </p>
          </motion.div>

          <motion.div
            className="flex-1 flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Trust features */}
            <div className="space-y-4 w-full max-w-xs">
              {trustFeatures.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-3 rounded-xl bg-card backdrop-blur-sm border border-border p-4 shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
                >
                  <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
                    <feature.icon className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex gap-6 mt-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }}
                >
                  <p className="text-lg font-bold text-sidebar-foreground">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </aside>

      {/* ──────────── Form side ──────────────────────────────────────────── */}
      <section className="flex flex-1 flex-col items-center justify-center bg-background px-5 py-10 sm:px-8">
        <div className="w-full max-w-105 space-y-8">
          {/* Mobile logo */}
          <motion.div
            className="flex items-center gap-2.5 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Zap className="size-4 text-primary" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              WorkSure
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            className="space-y-1.5 pt-12 lg:pt-0"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {mode === "login" ? "Sign in" : "Create account"}
            </h2>
          </motion.div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name — register only */}
            {mode === "register" && (
              <motion.div
                className="space-y-1.5"
                custom={0}
                variants={formFieldVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="text-sm font-medium text-foreground" htmlFor="full-name">
                  Full name
                </label>
                <InputGroup className="h-11 rounded-lg border-border bg-input">
                  <InputGroupAddon>
                    <InputGroupText>
                      <User2 className="size-4 text-muted-foreground" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="full-name"
                    placeholder="John Adeyemi"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </InputGroup>
              </motion.div>
            )}

            {/* Email */}
            <motion.div
              className="space-y-1.5"
              custom={emailIdx}
              variants={formFieldVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="text-sm font-medium text-foreground" htmlFor="email">
                Email address
              </label>
              <InputGroup className="h-11 rounded-lg border-border bg-input">
                <InputGroupAddon>
                  <InputGroupText>
                    <Mail className="size-4 text-muted-foreground" />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </motion.div>

            {/* Password */}
            <motion.div
              className="space-y-1.5"
              custom={passwordIdx}
              variants={formFieldVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground" htmlFor="password">
                  Password
                </label>
                {mode === "login" && (
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <InputGroup className="h-11 rounded-lg border-border bg-input">
                <InputGroupAddon>
                  <InputGroupText>
                    <LockKeyhole className="size-4 text-muted-foreground" />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="password"
                  placeholder={mode === "login" ? "Enter your password" : "Create a strong password"}
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </motion.div>

            {/* Role selector — register only */}
            {mode === "register" && (
              <motion.fieldset
                className="space-y-2"
                custom={roleIdx}
                variants={formFieldVariants}
                initial="hidden"
                animate="visible"
              >
                <legend className="text-sm font-medium text-foreground">I want to</legend>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map(({ value, label, description, icon: Icon }) => {
                    const selected = role === value;
                    return (
                      <motion.button
                        key={value}
                        type="button"
                        onClick={() => setRole(value)}
                        whileTap={{ scale: 0.97 }}
                        className={`group relative flex flex-col gap-2 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                          selected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                            : "border-border bg-input hover:border-primary/40 hover:bg-primary/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                              selected ? "bg-primary/15" : "bg-muted group-hover:bg-primary/10"
                            }`}
                          >
                            <Icon
                              className={`size-4 transition-colors ${
                                selected ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                              }`}
                            />
                          </div>
                          <div
                            className={`h-4 w-4 rounded-full border-2 transition-all ${
                              selected ? "border-primary bg-primary scale-110" : "border-muted-foreground/30"
                            }`}
                          />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${selected ? "text-primary" : "text-foreground"}`}>
                            {label}
                          </p>
                          <p className="mt-0.5 text-xs leading-4 text-muted-foreground">{description}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.fieldset>
            )}



            {/* Submit */}
            <motion.div
              custom={submitIdx}
              variants={formFieldVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                type="submit"
                className="h-11 w-full rounded-lg font-semibold shadow-sm"
                disabled={
                  isBusy ||
                  !email.trim() ||
                  !password ||
                  (mode === "register" && !name.trim())
                }
                asChild={false}
              >
                <motion.span
                  className="inline-flex items-center"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {isBusy
                    ? mode === "login"
                      ? "Signing in…"
                      : "Creating account…"
                    : mode === "login"
                      ? "Continue to dashboard"
                      : "Create account"}
                  {!isBusy && <ArrowRight className="ml-1 size-4" />}
                </motion.span>
              </Button>
            </motion.div>
          </form>

            <p className="text-center text-sm text-foreground mt-6">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link href={mode === "login" ? "/auth/register" : "/auth/login"} className="font-semibold text-primary hover:text-primary-dark">
                 {mode === "login" ? "Sign up" : "Sign in"}
              </Link>
            </p>

          {/* Footer note */}
          <p className="text-center text-xs leading-5 text-muted-foreground">
            By continuing, you agree to WorkSure&apos;s{" "}
            <span className="font-medium text-foreground/70 cursor-pointer hover:text-foreground transition-colors">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="font-medium text-foreground/70 cursor-pointer hover:text-foreground transition-colors">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
