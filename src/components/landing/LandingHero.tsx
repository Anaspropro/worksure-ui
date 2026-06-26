"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Star,
  Users,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-border">
      
      {/* Background Mesh Glow spots */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-[10%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.08),transparent_60%)] blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[30%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.06),transparent_60%)] blur-3xl"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          
          {/* Left Column: Title & Main Text */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            <motion.div
              className="flex items-center gap-2 w-fit rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 backdrop-blur-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="size-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Trusted by thousands across Nigeria
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl font-extrabold leading-[1.12] sm:text-5xl lg:text-6xl text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              Find Vetted Artisans.
              <br />
              <span className="text-primary">
                Pay Only
              </span>{" "}
              When the Job is{" "}
              <span className="text-primary">
                Done Right.
              </span>
            </motion.h1>

            <motion.p
              className="max-w-xl text-md sm:text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              WorkSure connects you with verified local professionals and locks your payments securely in escrow until you approve the completed work. Zero risk, instant payouts.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap items-center gap-4" 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl px-8 text-base shadow-lg shadow-primary/20 font-semibold"
              >
                <Link href="/auth/register">
                  Get Started <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl px-8 text-base bg-card/45 border-border/80 text-foreground hover:bg-accent backdrop-blur-sm"
              >
                <Link href="#how-it-works">How it Works</Link>
              </Button>
            </motion.div>

            {/* Social Proof Trust row */}
            <motion.div
              className="flex items-center gap-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="size-9 rounded-full bg-slate-800 border-2 border-background flex items-center justify-center"
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

          {/* Right Column: High-Fidelity Dashboard Mockup */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            
            {/* Visual background gradient circle */}
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl filter pointer-events-none" />

            <motion.div
              className="relative w-full max-w-[420px] bg-card/60 backdrop-blur-lg border border-border/60 rounded-3xl p-6 shadow-2xl shadow-black/15"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border/80">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider">Escrow Project</p>
                  <h4 className="font-bold text-sm text-foreground">Inverter Installation</h4>
                </div>
                <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold">
                  ACTIVE
                </Badge>
              </div>

              {/* Card Body */}
              <div className="py-4 space-y-4">
                
                {/* Value row */}
                <div className="flex justify-between items-center bg-muted/30 border border-border/40 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <Wallet className="size-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Escrow Balance</span>
                  </div>
                  <p className="font-extrabold text-md text-foreground">₦120,000</p>
                </div>

                {/* Milestone Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Milestone Progress</span>
                    <span className="text-primary font-bold">1 of 2 Complete</span>
                  </div>
                  <div className="h-2 w-full bg-muted border border-border/40 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "50%" }} />
                  </div>
                </div>

                {/* Artisan detail row */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="size-9 rounded-full bg-primary/10 border border-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    SO
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">Sunday Okon</p>
                    <p className="text-[10px] text-muted-foreground">Electrical Specialist</p>
                  </div>
                  <div className="flex items-center gap-1 bg-success/5 border border-success/15 rounded-full px-2 py-0.5">
                    <ShieldCheck className="size-3 text-success" />
                    <span className="text-[10px] text-success font-semibold">Verified</span>
                  </div>
                </div>

              </div>

              {/* Floating indicators */}
              <motion.div
                className="absolute -top-6 -right-6 bg-card/80 border border-border/80 shadow-lg rounded-2xl p-3 flex items-center gap-2.5 backdrop-blur-md"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <div className="size-8 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center">
                  <Lock className="size-4 text-warning" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium leading-none">Security Status</p>
                  <p className="text-[11px] font-bold text-warning mt-1 leading-none">Escrow Guaranteed</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 bg-card/80 border border-border/80 shadow-lg rounded-2xl p-3 flex items-center gap-2.5 backdrop-blur-md"
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 2, ease: "easeInOut" }}
              >
                <div className="size-8 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
                  <CheckCircle2 className="size-4 text-success" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium leading-none">Job Verification</p>
                  <p className="text-[11px] font-bold text-success mt-1 leading-none">KYC Vetted</p>
                </div>
              </motion.div>

            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
