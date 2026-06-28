"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingCTA() {
  return (
    <section className="py-20 bg-background text-foreground relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-150 h-150 rounded-full bg-primary/5 -top-60 -right-40" />
        <div className="absolute w-96 h-96 rounded-full bg-primary/5 -bottom-40 -left-20" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto mb-6 size-16 rounded-2xl bg-card border border-border shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center justify-center">
            <Mail className="size-7 text-primary" />
          </div>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Work with Confidence?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
            Join thousands of clients and artisans who trust WorkSure for
            secure, transparent work.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl px-8 text-base shadow-sm font-semibold"
            >
              <Link href="/auth/register">
                Create Free Account <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl px-8 text-base bg-transparent border-border text-foreground hover:bg-accent"
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
    <footer className="bg-card border-t border-border text-foreground pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex bg-primary rounded-lg p-1.5">
                <ShieldCheck className="size-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Work<span className="text-primary">Sure</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
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
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} WorkSure. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
