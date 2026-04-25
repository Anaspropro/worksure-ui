"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AnimatedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="min-h-full"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
