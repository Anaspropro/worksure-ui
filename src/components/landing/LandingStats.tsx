"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = target;
    const duration = 1600;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const stats = [
  { value: 12500, suffix: "+", label: "Clients served" },
  { value: 450, suffix: "M+", label: "Escrow processed (₦)" },
  { value: 3400, suffix: "+", label: "Verified professionals" },
  { value: 99, suffix: "%", label: "Dispute-free rate" },
];

export default function LandingStats() {
  return (
    <section className="py-20 bg-background text-foreground relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-96 h-96 rounded-full bg-primary/5 -top-32 -right-32" />
        <div className="absolute w-72 h-72 rounded-full bg-primary/5 -bottom-20 -left-20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            Building Trust,{" "}
            <span className="text-primary">
              Together
            </span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Real numbers from real people using WorkSure every day.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center rounded-2xl bg-card border border-border shadow-[0_10px_30px_rgba(0,0,0,0.3)] py-8 px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <p className="text-4xl font-bold text-foreground">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
