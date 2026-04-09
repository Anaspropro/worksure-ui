"use client";

import { FormEvent, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User2,
  Wallet,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { useLogin, useRegister, useUser } from "@/hooks/useAuth";
import { getDashboardPathForRole } from "@/proxy";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import type { UserRole } from "@/types";

type AuthMode = "login" | "register";

const trustNotes = [
  {
    title: "Escrow clarity",
    description: "Track funding, progress, and payment release in one visible workflow.",
    icon: Wallet,
  },
  {
    title: "Safer collaboration",
    description: "Clients and artisans move through role-aware actions with fewer blind spots.",
    icon: ShieldCheck,
  },
  {
    title: "Built for real jobs",
    description: "Create, propose, contract, and complete work without losing context.",
    icon: Wrench,
  },
];

const roleCards: Array<{
  value: UserRole;
  label: string;
  description: string;
}> = [
  {
    value: "CLIENT",
    label: "Client",
    description: "Post jobs, review proposals, and fund escrow with confidence.",
  },
  {
    value: "ARTISAN",
    label: "Artisan",
    description: "Bid on real work, manage contracts, and track payout progress.",
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
    if (!hasHydrated) {
      return;
    }

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
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(145deg,#f2fff7_0%,#f7faf8_44%,#eef6ff_100%)] px-5 py-8 md:px-8 md:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-stretch gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[2rem] border border-emerald-200/80 bg-[linear-gradient(160deg,#0f3d2f_0%,#14523d_35%,#173f63_100%)] p-6 text-white shadow-[0_32px_90px_-50px_rgba(15,23,42,0.7)] md:p-8 xl:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1),transparent_24%)]" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="space-y-5">
              <Badge className="w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white">
                {mode === "login" ? "Secure workspace access" : "Create your WorkSure profile"}
              </Badge>
              <div className="space-y-3">
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  {mode === "login"
                    ? "Welcome back to a cleaner way to manage jobs and payments."
                    : "Open your account and move every service job through a clearer workflow."}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-emerald-50/90">
                  WorkSure keeps job discovery, proposal review, escrow funding, and release actions
                  visible from the same workspace so both sides always know what happens next.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {trustNotes.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-[1.5rem] border border-white/12 bg-white/10 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/14">
                      <Icon className="size-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-white">{title}</p>
                      <p className="text-sm leading-6 text-emerald-50/85">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Card className="flex items-center border border-border/80 bg-white/95 px-0 shadow-[0_28px_80px_-42px_rgba(15,23,42,0.3)] backdrop-blur">
          <div className="w-full px-6 py-7 md:px-8 md:py-9">
            <CardHeader className="px-0 pb-6 pt-0 text-left">
              <CardTitle className="text-3xl font-semibold tracking-tight text-slate-950">
                {mode === "login" ? "Sign in" : "Create account"}
              </CardTitle>
              <CardDescription className="max-w-md text-base leading-7">
                {mode === "login"
                  ? "Use your account details to continue into the dashboard that matches your role."
                  : "Set up your details once and we'll take you straight into your role-specific workspace."}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {mode === "register" ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="full-name">
                      Full name
                    </label>
                    <InputGroup className="h-12 rounded-2xl border-border bg-background">
                      <InputGroupAddon>
                        <InputGroupText>
                          <User2 className="size-4" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="full-name"
                        placeholder="Enter your full name"
                        autoComplete="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      />
                    </InputGroup>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="email">
                    Email address
                  </label>
                  <InputGroup className="h-12 rounded-2xl border-border bg-background">
                    <InputGroupAddon>
                      <InputGroupText>
                        <Mail className="size-4" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="email"
                      placeholder="you@example.com"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </InputGroup>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="password">
                    Password
                  </label>
                  <InputGroup className="h-12 rounded-2xl border-border bg-background">
                    <InputGroupAddon>
                      <InputGroupText>
                        <LockKeyhole className="size-4" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="password"
                      placeholder={mode === "login" ? "Enter your password" : "Create a strong password"}
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                {mode === "register" ? (
                  <fieldset className="space-y-3">
                    <legend className="text-sm font-medium text-foreground">Choose your role</legend>
                    <div className="grid gap-3">
                      {roleCards.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setRole(option.value)}
                          className={`rounded-[1.25rem] border p-4 text-left transition ${
                            role === option.value
                              ? "border-primary bg-primary-soft ring-2 ring-primary/15"
                              : "border-border bg-background hover:border-primary/35 hover:bg-primary-soft/30"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-foreground">{option.label}</p>
                              <p className="mt-1 text-sm leading-6 text-text-secondary">
                                {option.description}
                              </p>
                            </div>
                            <div
                              className={`mt-1 h-4 w-4 rounded-full border ${
                                role === option.value
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/40"
                              }`}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ) : null}

                {authError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {authError}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  className="h-12 w-full rounded-2xl"
                  disabled={isBusy || !email.trim() || !password || (mode === "register" && !name.trim())}
                >
                  {isBusy
                    ? mode === "login"
                      ? "Signing in..."
                      : "Creating account..."
                    : mode === "login"
                      ? "Continue to dashboard"
                      : "Create account and continue"}
                  <ArrowRight className="size-4" />
                </Button>

                <div className="rounded-[1.35rem] bg-slate-50 px-4 py-3 text-sm leading-6 text-text-secondary">
                  {mode === "login"
                    ? "Use the same email and password you registered with. We'll route you to the correct workspace automatically."
                    : "Your account is created with role-aware access, so clients and artisans land in the right workspace immediately."}
                </div>

                <p className="text-sm text-text-secondary">
                  {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
                  <Link
                    href={mode === "login" ? "/auth/register" : "/auth/login"}
                    className="font-medium text-secondary underline-offset-4 hover:underline"
                  >
                    {mode === "login" ? "Create one here" : "Sign in here"}
                  </Link>
                </p>
              </form>
            </CardContent>
          </div>
        </Card>
      </div>
    </main>
  );
}
