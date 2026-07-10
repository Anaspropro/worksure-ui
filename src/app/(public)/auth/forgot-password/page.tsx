"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, KeyRound, Loader2, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";
import apiClient from "@/shared/api/client";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const { error: apiError } = await apiClient.POST("/auth/forgot-password", {
        body: { email: email.trim().toLowerCase() } as any,
      });
      if (apiError) throw apiError;
      setStatus("success");
      toast.success("Password reset request sent!");
    } catch (err) {
      const error = err as { message?: string };
      setStatus("error");
      setErrorMessage(error.message || "Failed to submit password reset request. Please try again.");
      toast.error(error.message || "Request failed");
    }
  };

  return (
    <main className="min-h-[100dvh] flex items-center justify-center bg-background p-4 relative overflow-hidden">
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

      <motion.div
        className="w-full max-w-md bg-card border border-border shadow-lg rounded-2xl p-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
                <h1 className="text-2xl font-bold text-foreground">Check your inbox</h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  If an account exists for <strong className="text-foreground">{email}</strong>, a password reset link has been sent. Please follow the instructions in the email.
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <Button asChild className="w-full h-11 font-semibold">
                  <Link href="/auth/login">Back to login</Link>
                </Button>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  Didn&apos;t receive email? Try again
                </button>
              </div>
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
                <h1 className="text-2xl font-bold text-foreground">Forgot password?</h1>
                <p className="text-muted-foreground text-sm">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === "submitting"}
                    />
                  </InputGroup>
                </div>

                {status === "error" && (
                  <div className="bg-destructive/5 border border-destructive/20 text-destructive text-xs p-3 rounded-lg">
                    {errorMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={status === "submitting" || !email.trim()}
                  className="w-full h-11 font-semibold"
                >
                  {status === "submitting" ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" /> Requesting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      Send reset link <ArrowRight className="size-4 ml-1" />
                    </span>
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
      </motion.div>
    </main>
  );
}
