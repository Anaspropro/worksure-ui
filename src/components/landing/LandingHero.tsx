"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
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
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          {/* Main content */}
          <div className="space-y-8 flex flex-col items-center">
            <motion.div
              className="flex items-center gap-2 w-fit mx-auto rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 backdrop-blur-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="size-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Africa's leading escrow marketplace
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold leading-[1.15] sm:text-5xl lg:text-6xl text-foreground max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              Hire Artisans with{" "}<span className="text-primary">Confidence,</span>
              <br />
              Pay with{" "}<span className="text-primary">Total Security</span>
            </motion.h1>

            <motion.p
              className="max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              WorkSure is the premier digital escrow platform. We protect your funds until the job is done perfectly, connecting businesses with top-tier, verified professionals.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-4" 
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
              className="flex items-center justify-center gap-6 pt-4"
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
              <div className="text-left">
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
        </div>
      </div>
    </section>
  );
}
