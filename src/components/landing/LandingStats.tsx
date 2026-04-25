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
  { value: 8500, suffix: "+", label: "Clients served" },
  { value: 15, suffix: "M+", label: "Escrow processed (₦)" },
  { value: 220, suffix: "+", label: "Verified artisans" },
  { value: 98, suffix: "%", label: "Completion rate" },
];

export default function LandingStats() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#0f1c4d] via-[#1a3178] to-[#2d5ae0] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute w-96 h-96 rounded-full bg-white/20 -top-32 -right-32 blur-3xl" />
        <div className="absolute w-72 h-72 rounded-full bg-blue-300/20 -bottom-20 -left-20 blur-3xl" />
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
              Together
            </span>
          </h2>
          <p className="mt-3 text-blue-100/70 max-w-lg mx-auto">
            Real numbers from real people using WorkSure every day.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm py-8 px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <p className="text-4xl font-bold text-white">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-blue-200/70">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
