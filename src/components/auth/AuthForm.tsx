"use client";

import { FormEvent, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
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
import { getDashboardPathForRole } from "@/proxy";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import type { UserRole } from "@/types";

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
    if (userQuery.data?.role) {
      router.replace(getDashboardPathForRole(userQuery.data.role));
    }
  }, [hasHydrated, router, userQuery.data?.role]);

  const authError =
    activeMutation.error instanceof Error ? activeMutation.error.message : null;

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
          toast.success("Account created. You're signed in now.", { id: toastId });
          setName("");
          setEmail("");
          setPassword("");
          setRole("CLIENT");
          window.location.replace(getDashboardPathForRole(user.role));
        },
        onError: (error) => {
          toast.error(error.message || "Registration failed.", { id: toastId });
        },
      },
    );
  };

  return (
    <main className="min-h-screen flex">
      {/* ── Brand side panel ───────────────────────────────────── */}
      <aside className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden flex-col justify-between p-8 xl:p-14">
        {/* Background */}
        <div className="absolute inset-0 bg-[#064e3b]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/20 ring-1 ring-emerald-400/30">
              <Zap className="size-4 text-emerald-300" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              WorkSure
            </span>
          </Link>

          {/* Hero text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-300" />
              <span className="text-xs font-medium text-emerald-200 tracking-wide">
                Trusted by artisans across Nigeria
              </span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold leading-[1.12] tracking-tight text-white">
              {mode === "login" ? (
                <>
                  Welcome back to
                  <br />
                  <span className="text-emerald-300">your workspace.</span>
                </>
              ) : (
                <>
                  The smarter way to
                  <br />
                  <span className="text-emerald-300">hire & get hired.</span>
                </>
              )}
            </h1>

            <p className="max-w-md text-base leading-7 text-slate-300/90">
              WorkSure brings clients and skilled artisans together through
              escrow-protected contracts, transparent payments, and a shared
              workspace from start to finish.
            </p>
          </div>

          {/* Trust features */}
          <div className="space-y-3">
            {trustFeatures.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex items-start gap-3.5 rounded-lg border border-white/8 bg-white/5 px-4 py-3.5 backdrop-blur-sm"
              >
                <div>
                  <div className="flex gap-4">
                    <Icon className="size-5 text-emerald-300" />
                    <p className="text-sm font-semibold text-white">{title}</p>
                  </div>
                  <p className="text-sm leading-5 text-slate-400 mt-0.5">{description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-4 rounded-md border border-white/10 bg-white/5 p-5">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="mt-0.5 text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ──────────── Form side ──────────────────────────────────────────── */}
      <section className="flex flex-1 flex-col items-center justify-center bg-background px-5 py-10 sm:px-8">
        <div className="w-full max-w-[420px] space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Zap className="size-4 text-primary" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              WorkSure
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {mode === "login" ? "Sign in to your account" : "Create your account"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === "login"
                ? "Enter your credentials to access your dashboard."
                : "Set up your profile and jump into your workspace."}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name — register only */}
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground" htmlFor="full-name">
                  Full name
                </label>
                <InputGroup className="h-11 rounded-lg border-border bg-white dark:bg-input/30">
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
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="email">
                Email address
              </label>
              <InputGroup className="h-11 rounded-lg border-border bg-white dark:bg-input/30">
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
            </div>

            {/* Password */}
            <div className="space-y-1.5">
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
              <InputGroup className="h-11 rounded-lg border-border bg-white dark:bg-input/30">
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
            </div>

            {/* Role selector — register only */}
            {mode === "register" && (
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-foreground">I want to</legend>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map(({ value, label, description, icon: Icon }) => {
                    const selected = role === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRole(value)}
                        className={`group relative flex flex-col gap-2 rounded-lg border p-3.5 text-left transition-all duration-200 ${
                          selected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                            : "border-border bg-white dark:bg-input/20 hover:border-primary/40 hover:bg-primary/3"
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
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* Error */}
            {authError && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 dark:border-red-400/20 dark:bg-red-400/8 px-4 py-3">
                <span className="mt-0.5 shrink-0 text-red-500">
                  <svg className="size-4" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.5a.75.75 0 0 1 1.5 0v3.25a.75.75 0 0 1-1.5 0V4.5zm.75 7a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
                  </svg>
                </span>
                <p className="text-sm text-red-700 dark:text-red-400">{authError}</p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="h-11 w-full rounded-lg font-semibold"
              disabled={
                isBusy ||
                !email.trim() ||
                !password ||
                (mode === "register" && !name.trim())
              }
            >
              {isBusy
                ? mode === "login"
                  ? "Signing in…"
                  : "Creating account…"
                : mode === "login"
                  ? "Continue to dashboard"
                  : "Create account"}
              {!isBusy && <ArrowRight className="ml-1 size-4" />}
            </Button>
          </form>

          {/* Divider + switch link */}
          <div className="space-y-5">
            <div className="relative flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Link
              href={mode === "login" ? "/auth/register" : "/auth/login"}
              className="flex h-11 w-full items-center justify-center rounded-lg border border-border bg-white dark:bg-muted/40 text-sm font-medium text-foreground transition-colors hover:bg-muted/60 hover:border-border/80"
            >
              {mode === "login" ? "Create a new account" : "Sign in instead"}
            </Link>
          </div>

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
