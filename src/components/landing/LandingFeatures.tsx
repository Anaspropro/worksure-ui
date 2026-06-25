"use client";

import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  FileCheck2,
  Lock,
  ShieldCheck,
  UserCheck,
  Wallet,
} from "lucide-react";

const features = [
  {
    icon: BriefcaseBusiness,
    title: "Frictionless Contracting",
    desc: "Create detailed job scopes, set milestones, and receive competitive bids from identity-verified professionals in minutes.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Lock,
    title: "Bank-Grade Escrow",
    desc: "Your funds are securely locked in our digital vault. Payment is only released to the artisan when you approve the completed work.",
    color: "bg-success/10 text-success",
  },
  {
    icon: UserCheck,
    title: "Rigorous Verification",
    desc: "Every artisan undergoes strict identity, biometric, and portfolio verification to ensure you only work with trusted experts.",
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: FileCheck2,
    title: "Automated Milestones",
    desc: "Break complex projects into manageable phases. Our smart system tracks progress and handles payouts automatically upon approval.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: Wallet,
    title: "Lightning-Fast Payouts",
    desc: "Once a milestone is approved, funds are disbursed to the artisan's local bank account instantly. No delays, no manual processing.",
    color: "bg-cyan-500/10 text-cyan-500",
  },
  {
    icon: ShieldCheck,
    title: "Impartial Arbitration",
    desc: "In the rare event of a disagreement, our dedicated arbitration team steps in to ensure a fair resolution based on contract terms.",
    color: "bg-rose-500/10 text-rose-500",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function LandingFeatures() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Why WorkSure
          </span>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Everything You Need to{" "}
            <span className="text-primary">Work with Confidence</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            From posting jobs to releasing payment, every step is designed to
            protect both clients and artisans.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="group rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div
                className={`size-12 rounded-xl ${f.color.split(" ")[0]} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
              >
                <f.icon className={`size-6 ${f.color.split(" ")[1]}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
