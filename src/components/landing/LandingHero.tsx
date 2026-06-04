"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-background text-foreground border-b border-border">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(79,70,229,0.08),transparent_50%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <div className="space-y-8">
            <motion.div
              className="flex items-center gap-2 w-fit rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 backdrop-blur-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="size-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Trusted escrow marketplace
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold leading-[1.15] sm:text-5xl lg:text-6xl text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              Hire Artisans with{" "}
              <span className="text-primary">
                Confidence,
              </span>
              <br />
              Pay with{" "}
              <span className="text-primary">
                Security
              </span>
            </motion.h1>

            <motion.p
              className="max-w-lg text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              WorkSure connects you with verified artisans. Your money is held
              safely in escrow and only released when the job is done right.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl px-8 text-base shadow-sm font-semibold"
              >
                <Link href="/auth/register">
                  Get Started <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl px-8 text-base bg-transparent border-border text-foreground hover:bg-accent"
              >
                <Link href="#how-it-works">How it Works</Link>
              </Button>
            </motion.div>

            {/* Trust row */}
            <motion.div
              className="flex items-center gap-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="size-9 rounded-full bg-surface-muted border-2 border-background flex items-center justify-center"
                  >
                    <Users className="size-4 text-primary" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-3.5 fill-warning text-warning"
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Trusted by 8,500+ clients across Nigeria
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right side — floating cards */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {/* Main image placeholder */}
            <div className="relative w-full h-140 rounded-3xl bg-surface-muted overflow-hidden border border-border">
              <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent z-10" />
              <Image
                src="/hero.png"
                alt="Abstract Security Visual"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="eager"
                className="object-cover opacity-60 mix-blend-overlay"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <p className="text-lg font-semibold text-foreground">
                  Real artisans. Real escrow. Real results.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Every payment secured by WorkSure
                </p>
              </div>
            </div>

            {/* Floating card — Escrow */}
            <motion.div
              className="absolute -left-10 top-12 z-30 rounded-2xl bg-card text-card-foreground shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 w-56 border border-border"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Lock className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Escrow Secured
                  </p>
                  <p className="text-lg font-bold">₦250,000</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 w-fit px-2 py-1 rounded-md">
                <ShieldCheck className="size-3" /> Funds are safe
              </div>
            </motion.div>

            {/* Floating card — Progress */}
            <motion.div
              className="absolute -right-6 bottom-20 z-30 rounded-2xl bg-card text-card-foreground shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 w-52 border border-border"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <p className="text-sm font-semibold mb-2">Contract Progress</p>
              {["Job Posted", "Funded", "In Progress", "Completed"].map(
                (step, i) => (
                  <div key={step} className="flex items-center gap-2 py-1">
                    <CheckCircle2
                      className={`size-4 ${i < 3 ? "text-success" : "text-muted-foreground"}`}
                    />
                    <span
                      className={`text-xs ${i < 3 ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step}
                    </span>
                  </div>
                ),
              )}
            </motion.div>

            {/* Floating card — Verified */}
            <motion.div
              className="absolute right-20 top-6 z-30 rounded-xl bg-card text-card-foreground shadow-[0_10px_30px_rgba(0,0,0,0.5)] px-3 py-2 border border-border"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-primary" />
                <span className="text-xs font-semibold">Verified Artisan</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
