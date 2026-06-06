"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does the digital escrow system work?",
    a: "When a client funds a contract, the capital is held securely in WorkSure's digital escrow vault. The artisan is notified that funds are guaranteed, providing confidence to begin work. Payment is only disbursed when both parties approve the completed milestone.",
  },
  {
    q: "How are artisans and freelancers verified?",
    a: "Every professional undergoes a rigorous KYC protocol, which includes government ID verification (NIN/BVN), skill assessments, and portfolio reviews. We ensure you only collaborate with legitimate, top-tier talent.",
  },
  {
    q: "What happens in the event of a dispute?",
    a: "WorkSure provides an impartial arbitration service. If a disagreement arises, our dedicated team reviews all contract terms, communications, and deliverables to issue a fair, binding resolution. Funds remain locked in escrow until the dispute is settled.",
  },
  {
    q: "What is WorkSure's fee structure?",
    a: "WorkSure charges a transparent platform fee (5%) on successfully completed contracts. There are absolutely no hidden charges—all costs are explicitly detailed before you fund the escrow.",
  },
  {
    q: "How quickly are payouts processed?",
    a: "The moment a client approves a milestone, the funds are automatically disbursed to the artisan's verified local bank account. Payouts are instantaneous, completely eliminating invoice chasing.",
  },
  {
    q: "Is my capital truly safe?",
    a: "Absolutely. All escrow funds are maintained in strictly segregated accounts managed by our licensed financial partners. Client funds are never commingled with WorkSure's operational capital, ensuring 100% safety.",
  },
];

export default function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28 bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Frequently Asked{" "}
            <span className="text-primary">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-border bg-card overflow-hidden"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <button
                className="flex w-full items-center justify-between p-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm font-semibold text-foreground pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`size-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" as const }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
