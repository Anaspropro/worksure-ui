"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck, Wallet } from "lucide-react";
import { useLogin, useRegister, useUser } from "@/hooks/useAuth";
import { getDashboardPathForRole } from "@/proxy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/types";

type AuthMode = "login" | "register";

const trustNotes = [
  "Clear transaction status at every stage",
  "Escrow-backed payment workflow",
  "Role-aware access for clients, artisans, and admins",
];

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const userQuery = useUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CLIENT");

  const activeMutation = mode === "login" ? loginMutation : registerMutation;
  const isBusy = activeMutation.status === "pending" || userQuery.isLoading;

  useEffect(() => {
    if (userQuery.data?.role) {
      router.replace(getDashboardPathForRole(userQuery.data.role));
    }
  }, [router, userQuery.data?.role]);

  const authError =
    activeMutation.error instanceof Error ? activeMutation.error.message : null;

  const handleSubmit = () => {
    if (mode === "login") {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: ({ user }) => {
            router.push(getDashboardPathForRole(user.role));
          },
        },
      );

      return;
    }

    registerMutation.mutate(
      { name, email, password, role },
      {
        onSuccess: ({ user }) => {
          router.push(getDashboardPathForRole(user.role));
        },
      },
    );
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_22%),linear-gradient(180deg,#f0fdf4_0%,#f9fafb_100%)] px-6 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 lg:flex-row">
        <div className="flex-1 space-y-6 pt-6">
          <Button asChild variant="ghost" className="w-fit">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back to home
            </Link>
          </Button>

          <div className="space-y-4">
            <Badge className="rounded-full px-3 py-1">
              {mode === "login"
                ? "Return to your secure workspace"
                : "Start your trusted WorkSure account"}
            </Badge>
            <h1 className="max-w-xl text-slate-950">
              {mode === "login"
                ? "Sign in to manage jobs, escrow, and payment release with clarity."
                : "Create your account and enter a safer workflow for real service contracts."}
            </h1>
            <p className="max-w-xl text-base leading-7 text-text-secondary">
              WorkSure is structured around role-aware flows for clients, artisans, and platform
              administration. Every key action is designed to keep money, status, and trust visible.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {trustNotes.map((note, index) => (
              <div key={note} className="flex items-start gap-3 rounded-2xl border border-border bg-white/80 p-4">
                {index === 1 ? (
                  <Wallet className="mt-0.5 size-5 text-primary-dark" />
                ) : (
                  <ShieldCheck className="mt-0.5 size-5 text-secondary" />
                )}
                <p className="text-sm leading-6 text-text-secondary">{note}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="w-full max-w-xl border border-border/90 bg-white/95 shadow-[0_22px_70px_-36px_rgba(15,23,42,0.22)]">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">{mode === "login" ? "Login" : "Register"}</CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Use your existing credentials to access the correct dashboard."
                : "Choose the account type that matches how you will use WorkSure."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mode === "register" && (
              <Input
                placeholder="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            )}

            <Input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {mode === "register" && (
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-foreground">Account role</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(["CLIENT", "ARTISAN"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRole(option)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        role === option
                          ? "border-primary bg-primary-soft text-foreground ring-2 ring-primary/15"
                          : "border-border bg-surface text-foreground hover:border-primary/40 hover:bg-primary-soft/35"
                      }`}
                    >
                      <p className="font-medium">{option === "CLIENT" ? "Client" : "Artisan"}</p>
                      <p className="mt-1 text-sm text-text-secondary">
                        {option === "CLIENT"
                          ? "Post jobs, review proposals, and fund escrow."
                          : "Browse jobs, bid for work, and complete funded contracts."}
                      </p>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {authError ? <p className="text-sm text-destructive">{authError}</p> : null}

            <Button
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={isBusy || !email || !password || (mode === "register" && !name.trim())}
            >
              {mode === "login" ? "Login" : "Create account"}
              <ArrowRight className="size-4" />
            </Button>

            <p className="text-sm text-text-secondary">
              {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
              <Link
                href={mode === "login" ? "/auth/register" : "/auth/login"}
                className="font-medium text-secondary underline-offset-4 hover:underline"
              >
                {mode === "login" ? "Register here" : "Login here"}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
