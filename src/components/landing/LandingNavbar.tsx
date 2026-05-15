"use client";

import Link from "next/link";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Benefits", href: "#benefits" },
  { label: "FAQ", href: "#faq" },
];

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10 pt-4"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <header
        className={`mx-auto max-w-7xl rounded-2xl border transition-all duration-300 ${
          scrolled
            ? "bg-white border-white/10 shadow-2xl shadow-black/30 backdrop-blur-sm opacity-80"
            : "bg-muted border-white/8 backdrop-blur-md"
        // bg-[#0c1a42] bg-[#0f1c4d]/80
        }`}
      >
        <div className="px-5 sm:px-6">
          <div className="flex h-18 items-center justify-between">
            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="h-auto">
                <Image src="/logo.png" alt="Logo" width={100} height={100} className="w-auto h-auto max-h-18" priority />              
              </div>
            </Link>

            {/* ── Desktop nav links ── */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="relative px-4 py-2 text-md font-medium text-[#050852] hover:text-accent rounded-lg hover:bg-white/6 transition-colors"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            {/* ── Desktop CTAs ── */}
            <div className="hidden md:flex items-center gap-2.5 shrink-0">
              <Button
                asChild
                size="sm"
                className="text-[14px] text-white hover:text-primary bg-primary hover:bg-white hover:shadow-xl h-9 px-4 rounded-lg"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="h-9 px-5 rounded-lg bg-white text-(--brand-hero-via) hover:bg-muted font-semibold text-[13px] shadow-lg shadow-black/15"
              >
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>

            {/* ── Mobile menu button ── */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10 size-9 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>

        {/* ── Mobile dropdown ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-white/8 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-primary-foreground/80 hover:bg-white/6 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-2 border-t border-white/8 flex gap-2 mt-1">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-primary-foreground/80 hover:text-white hover:bg-white/6 h-9 rounded-lg"
                  >
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 bg-white text-[#1a3178] hover:bg-muted font-semibold h-9 rounded-lg"
                  >
                    <Link href="/auth/register">Get Started</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </motion.div>
  );
}
