"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#0f1c4d] via-[#1a3178] to-[#2d5ae0] text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-400/10 -top-60 -right-40 blur-3xl" />
        <div className="absolute w-96 h-96 rounded-full bg-white/5 -bottom-40 -left-20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto mb-6 size-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Mail className="size-7 text-blue-200" />
          </div>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Work with Confidence?
          </h2>
          <p className="mt-4 text-blue-100/70 max-w-xl mx-auto text-lg">
            Join thousands of clients and artisans who trust WorkSure for
            secure, transparent work.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl px-8 text-base bg-white text-[#1a3178] hover:bg-blue-50 shadow-xl shadow-black/20 font-semibold"
            >
              <Link href="/auth/register">
                Create Free Account <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl px-8 text-base bg-transparent border-white/30 text-white hover:bg-white/10"
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  const footerLinks = [
    {
      title: "Platform",
      links: [
        { label: "How it Works", href: "#how-it-works" },
        { label: "Post a Job", href: "/auth/register" },
        { label: "Browse Jobs", href: "/jobs" },
        { label: "Pricing", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Blog", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Escrow Policy", href: "#" },
        { label: "Dispute Policy", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-[#0a1333] text-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex bg-primary rounded-lg p-1.5">
                <ShieldCheck className="size-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Work<span className="text-blue-300">Sure</span>
              </span>
            </div>
            <p className="text-sm text-blue-200/60 leading-relaxed">
              The secure escrow marketplace that connects clients with verified
              artisans. Trust built in.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-semibold text-sm mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-blue-200/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-blue-200/40">
            © {new Date().getFullYear()} WorkSure. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-blue-200/40">
            <Link href="#" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
