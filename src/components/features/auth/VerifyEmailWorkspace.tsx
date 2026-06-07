"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Mail, ShieldCheck, XCircle, ArrowRight, Edit2 } from "lucide-react";
import Link from "next/link";
import { proxyFetch } from "@/api-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyEmailWorkspace() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryEmail = searchParams.get("email") || "";
  const queryToken = searchParams.get("token") || "";

  const [email, setEmail] = useState(queryEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(!queryEmail);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Autofill code if token is passed in query string (fallback support for links)
  useEffect(() => {
    if (queryToken && queryToken.length === 6 && /^\d+$/.test(queryToken)) {
      setOtp(queryToken);
      // Auto verify if we have email and token from URL
      if (queryEmail) {
        verifyCode(queryToken, queryEmail);
      }
    }
  }, [queryToken, queryEmail]);

  // Handle countdown timer
  useEffect(() => {
    if (resendCooldown === 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const verifyCode = async (code: string, emailAddress: string) => {
    if (!emailAddress) {
      toast.error("Please enter a valid email address first");
      setIsEditingEmail(true);
      return;
    }

    setStatus("verifying");
    setErrorMessage("");

    try {
      await proxyFetch("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({
          token: code,
          email: emailAddress.trim().toLowerCase(),
        }),
      });
      setStatus("success");
      toast.success("Email verified successfully!");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to verify email. The code may be invalid or expired.");
      toast.error(err.message || "Verification failed");
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code");
      return;
    }
    verifyCode(otp, email);
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter a valid email address");
      setIsEditingEmail(true);
      return;
    }

    setIsResending(true);
    try {
      await proxyFetch("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      toast.success("A new verification code has been sent to your email!");
      setResendCooldown(60); // 60 seconds cooldown
      setOtp("");
      if (status === "error") {
        setStatus("idle");
        setErrorMessage("");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to resend verification code");
    } finally {
      setIsResending(false);
    }
  };

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
                <h1 className="text-2xl font-bold text-foreground">Email Verified!</h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your email has been successfully verified. You can now log in to your account.
                </p>
              </div>
              <Button asChild className="w-full h-11 font-semibold">
                <Link href="/auth/login" className="flex items-center justify-center gap-2">
                  Go to Login <ArrowRight className="size-4" />
                </Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="verify-form"
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center space-y-2">
                <div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Verify your email</h1>
                <p className="text-muted-foreground text-sm">
                  Enter the 6-digit code we sent to verify your account
                </p>
              </div>

              {/* Email Address Section */}
              <div className="bg-muted/40 border border-border/50 rounded-xl p-4 flex items-center justify-between gap-4">
                {isEditingEmail ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (email && email.includes("@")) {
                          setIsEditingEmail(false);
                        } else {
                          toast.error("Please enter a valid email address");
                        }
                      }}
                      className="px-3"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground font-medium">VERIFICATION EMAIL</p>
                      <p className="text-sm font-semibold text-foreground truncate mt-0.5">{email}</p>
                    </div>
                    <button
                      onClick={() => setIsEditingEmail(true)}
                      className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit email"
                    >
                      <Edit2 className="size-4" />
                    </button>
                  </>
                )}
              </div>

              {/* OTP Form */}
              <form onSubmit={handleManualSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase block text-center">
                    Security Code
                  </label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(val) => {
                        // Accept only numeric characters
                        const cleanVal = val.replace(/\D/g, "");
                        setOtp(cleanVal);
                        if (cleanVal.length === 6) {
                          verifyCode(cleanVal, email);
                        }
                      }}
                      disabled={status === "verifying"}
                    >
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot index={0} className="sm:size-12 size-10 sm:text-xl text-lg font-bold rounded-xl border border-border focus:ring-2 focus:ring-primary" />
                        <InputOTPSlot index={1} className="sm:size-12 size-10 sm:text-xl text-lg font-bold rounded-xl border border-border focus:ring-2 focus:ring-primary" />
                        <InputOTPSlot index={2} className="sm:size-12 size-10 sm:text-xl text-lg font-bold rounded-xl border border-border focus:ring-2 focus:ring-primary" />
                        <InputOTPSlot index={3} className="sm:size-12 size-10 sm:text-xl text-lg font-bold rounded-xl border border-border focus:ring-2 focus:ring-primary" />
                        <InputOTPSlot index={4} className="sm:size-12 size-10 sm:text-xl text-lg font-bold rounded-xl border border-border focus:ring-2 focus:ring-primary" />
                        <InputOTPSlot index={5} className="sm:size-12 size-10 sm:text-xl text-lg font-bold rounded-xl border border-border focus:ring-2 focus:ring-primary" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                {errorMessage && (
                  <motion.div
                    className="flex gap-2 items-start bg-destructive/5 border border-destructive/20 text-destructive text-xs p-3 rounded-lg"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <XCircle className="size-4 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{errorMessage}</p>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={status === "verifying" || otp.length !== 6}
                  className="w-full h-11 font-semibold transition-all relative overflow-hidden"
                >
                  {status === "verifying" ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" /> Verifying...
                    </span>
                  ) : (
                    "Verify Account"
                  )}
                </Button>
              </form>

              {/* Cooldown/Resend */}
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  Didn&apos;t receive the code?{" "}
                  {resendCooldown > 0 ? (
                    <span className="text-primary font-medium">
                      Resend in {resendCooldown}s
                    </span>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={isResending}
                      className="text-primary hover:text-primary/80 font-semibold underline-offset-4 hover:underline disabled:opacity-50 inline-flex items-center gap-1"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" /> Sending...
                        </>
                      ) : (
                        "Resend code"
                      )}
                    </button>
                  )}
                </p>
              </div>

              <div className="pt-4 border-t border-border/50 text-center">
                <Link
                  href="/auth/login"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Back to login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
