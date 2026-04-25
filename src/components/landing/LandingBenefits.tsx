"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Banknote,
  BriefcaseBusiness,
  Clock,
  FileText,
  Lock,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
  UserCheck,
  Wallet,
} from "lucide-react";

const clientBenefits = [
  { icon: Search, text: "Access to verified, rated artisans" },
  { icon: Lock, text: "100% escrow-protected payments" },
  { icon: FileText, text: "Transparent contracts with milestones" },
  { icon: ShieldCheck, text: "Admin-mediated dispute resolution" },
  { icon: Star, text: "Post-completion reviews and ratings" },
];

const artisanBenefits = [
  { icon: BriefcaseBusiness, text: "Browse and bid on real jobs" },
  { icon: Wallet, text: "Guaranteed payment via escrow" },
  { icon: BadgeCheck, text: "Build a verified, trustworthy profile" },
  { icon: TrendingUp, text: "Grow your reputation with reviews" },
  { icon: Banknote, text: "Instant payout on completion" },
];

export default function LandingBenefits() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            For Everyone
          </span>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Benefits for <span className="text-primary">Clients</span> &{" "}
            <span className="text-primary">Artisans</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Client card */}
          <motion.div
            className="rounded-2xl border border-border bg-card p-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <UserCheck className="size-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">For Clients</h3>
            </div>
            <ul className="space-y-4">
              {clientBenefits.map((b) => (
                <li key={b.text} className="flex items-start gap-3">
                  <div className="mt-0.5 size-7 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <b.icon className="size-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {b.text}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Artisan card */}
          <motion.div
            className="rounded-2xl border border-border bg-card p-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Clock className="size-5 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                For Artisans
              </h3>
            </div>
            <ul className="space-y-4">
              {artisanBenefits.map((b) => (
                <li key={b.text} className="flex items-start gap-3">
                  <div className="mt-0.5 size-7 rounded-lg bg-success/5 flex items-center justify-center flex-shrink-0">
                    <b.icon className="size-4 text-success" />
                  </div>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {b.text}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
