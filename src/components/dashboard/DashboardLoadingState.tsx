"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface DashboardLoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function DashboardLoadingState({
  message = "Preparing workspace",
  fullScreen = true,
  className,
}: DashboardLoadingStateProps = {}) {
  const containerContent = (
    <div className="relative flex flex-col items-center justify-center p-8">
      {/* Ambient Glow behind the logo */}
      <motion.div
        className="absolute inset-0 bg-primary/10 blur-2xl rounded-full pointer-events-none"
        animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative flex items-center justify-center size-20 rounded-2xl bg-primary/10 border border-primary/20 shadow-xl shadow-primary/10 backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            rotateY: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ShieldCheck className="size-10 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-6 text-center space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center justify-center gap-1">
          Work<span className="text-primary">Sure</span>
        </h2>
        <div className="flex items-center gap-1 justify-center text-sm font-medium text-muted-foreground h-5 overflow-hidden">
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {message}
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              delay: 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              delay: 0.65,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              delay: 0.9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            .
          </motion.span>
        </div>
      </motion.div>
    </div>
  );

  if (!fullScreen) {
    return (
      <div
        className={cn(
          "min-h-[300px] w-full flex items-center justify-center overflow-hidden",
          className,
        )}
      >
        {containerContent}
      </div>
    );
  }

  return (
    <main
      className={cn(
        "min-h-[100dvh] bg-background flex items-center justify-center overflow-hidden",
        className,
      )}
    >
      {containerContent}
    </main>
  );
}
