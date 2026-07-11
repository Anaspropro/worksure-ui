"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-background px-6 py-10">
      
      {/* Background Mesh Glow spots (from LandingHero) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-emerald-500/5 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-emerald-600/5 blur-3xl"
        />
      </div>

      {/* Huge subtle 404 background text */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[30vw] font-black text-foreground/5 tracking-tighter mix-blend-overlay">
          404
        </span>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-surface shadow-xl ring-1 ring-border/50"
        >
          <SearchX className="size-10 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Page not found
          </h1>
          <p className="mx-auto max-w-lg text-lg text-muted-foreground mb-10 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's get you back to the marketplace.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Button asChild size="lg" className="w-full sm:w-auto rounded-full h-12 px-8 shadow-md">
            <Link href="/">
              <Home className="mr-2 size-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full h-12 px-8 bg-surface hover:bg-muted/50 border-border/50">
            <button onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 size-4" />
              Go Back
            </button>
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
