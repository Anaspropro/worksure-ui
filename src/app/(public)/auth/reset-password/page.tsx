"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Lock, ShieldCheck, XCircle } from "lucide-react";
import { proxyFetch } from "@/api-client";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { toast } from "sonner";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const queryToken = searchParams.get("token") || "";

  const [token, setToken] = useState(queryToken);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Real-time validations
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password && password === confirmPassword;

  const isFormValid =
    token.trim() &&
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasDigit &&
    hasSpecial &&
    passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please ensure the form is valid and password requirements are met");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      await proxyFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token: token.trim(),
          newPassword: password,
        }),
      });
      setStatus("success");
      toast.success("Password reset successful!");
    } catch (err) {
      const error = err as { message?: string };
      setStatus("error");
      setErrorMessage(error.message || "Failed to reset password. The code/link might be invalid or expired.");
      toast.error(error.message || "Reset failed");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.div
          key="success"
          className="text-center space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="mx-auto size-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="size-8 text-green-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Password reset!</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your password has been successfully updated. You can now use your new password to sign in.
            </p>
          </div>
          <Button asChild className="w-full h-11 font-semibold">
            <Link href="/auth/login">Go to login</Link>
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center space-y-2">
            <div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <KeyRound className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Set new password</h1>
            <p className="text-muted-foreground text-sm">
              Please enter your verification token and choose a strong new password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Token */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="token">
                Reset Token / Code
              </label>
              <InputGroup className="h-11 rounded-lg border-border bg-input">
                <InputGroupAddon>
                  <InputGroupText>
                    <Lock className="size-4 text-muted-foreground" />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="token"
                  placeholder="Paste your reset token here"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  disabled={status === "submitting" || !!queryToken}
                />
              </InputGroup>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="password">
                New Password
              </label>
              <InputGroup className="h-11 rounded-lg border-border bg-input">
                <InputGroupAddon>
                  <InputGroupText>
                    <Lock className="size-4 text-muted-foreground" />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="password"
                  placeholder="Create a strong password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={status === "submitting"}
                />
                <InputGroupAddon align="inline-end">
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors mr-1"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </InputGroupAddon>
              </InputGroup>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <InputGroup className="h-11 rounded-lg border-border bg-input">
                <InputGroupAddon>
                  <InputGroupText>
                    <Lock className="size-4 text-muted-foreground" />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="confirm-password"
                  placeholder="Verify your password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={status === "submitting"}
                />
              </InputGroup>
            </div>

            {/* Password checklist */}
            <div className="rounded-xl border bg-muted/30 p-4 space-y-2 text-xs">
              <p className="font-semibold text-muted-foreground mb-1.5">Password requirements:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className={`flex size-4 items-center justify-center rounded-full border ${hasMinLength ? "border-green-500 bg-green-500/10 text-green-500" : "border-muted-foreground/30"}`}>
                    {hasMinLength && <Check className="size-2.5" />}
                  </span>
                  Min. 8 characters
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className={`flex size-4 items-center justify-center rounded-full border ${hasUppercase ? "border-green-500 bg-green-500/10 text-green-500" : "border-muted-foreground/30"}`}>
                    {hasUppercase && <Check className="size-2.5" />}
                  </span>
                  At least 1 uppercase
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className={`flex size-4 items-center justify-center rounded-full border ${hasLowercase ? "border-green-500 bg-green-500/10 text-green-500" : "border-muted-foreground/30"}`}>
                    {hasLowercase && <Check className="size-2.5" />}
                  </span>
                  At least 1 lowercase
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className={`flex size-4 items-center justify-center rounded-full border ${hasDigit ? "border-green-500 bg-green-500/10 text-green-500" : "border-muted-foreground/30"}`}>
                    {hasDigit && <Check className="size-2.5" />}
                  </span>
                  At least 1 number
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className={`flex size-4 items-center justify-center rounded-full border ${hasSpecial ? "border-green-500 bg-green-500/10 text-green-500" : "border-muted-foreground/30"}`}>
                    {hasSpecial && <Check className="size-2.5" />}
                  </span>
                  At least 1 special char
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className={`flex size-4 items-center justify-center rounded-full border ${passwordsMatch ? "border-green-500 bg-green-500/10 text-green-500" : "border-muted-foreground/30"}`}>
                    {passwordsMatch && <Check className="size-2.5" />}
                  </span>
                  Passwords match
                </div>
              </div>
            </div>

            {status === "error" && (
              <div className="flex gap-2 items-start bg-destructive/5 border border-destructive/20 text-destructive text-xs p-3 rounded-lg">
                <XCircle className="size-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={status === "submitting" || !isFormValid}
              className="w-full h-11 font-semibold"
            >
              {status === "submitting" ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" /> Resetting...
                </span>
              ) : (
                "Reset password"
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-border/50 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <ArrowLeft className="size-3.5" /> Back to login
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] size-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] size-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex bg-primary/10 rounded-lg p-1.5 border border-primary/20">
            <ShieldCheck className="size-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Work<span className="text-primary">Sure</span>
          </span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-card border border-border shadow-lg rounded-2xl p-8 relative z-10">
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
