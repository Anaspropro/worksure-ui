"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCheck,
  CreditCard,
  Landmark,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const statCards = [
  { value: "100+", label: "secured payments", icon: Wallet },
  { value: "50+", label: "active jobs", icon: BriefcaseBusiness },
  { value: "Safe", label: "escrow protection", icon: ShieldCheck },
];

const featureCards = [
  {
    title: "Clear escrow steps",
    description:
      "Every contract moves through visible stages so both client and artisan know what happens next.",
    icon: CheckCheck,
  },
  {
    title: "Protected payments",
    description:
      "Funds are held before work begins and only released when the right confirmations happen.",
    icon: CreditCard,
  },
  {
    title: "Reliable oversight",
    description:
      "Verification, reviews, and dispute support keep trust built into the platform instead of added later.",
    icon: Landmark,
  },
];

const trustCards = [
  {
    title: "For clients",
    description: "Post jobs confidently, compare proposals, and release money only when work is complete.",
  },
  {
    title: "For artisans",
    description: "Take on real funded work and track payout progress without guesswork.",
  },
];

const footerLinks = [
  { href: "/auth/login", label: "Login" },
  { href: "/auth/register", label: "Create account" },
  { href: "/dashboard", label: "Workspace" },
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-emerald-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-sm shadow-lg">
            WS
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">
              WorkSure
            </p>
            <p className="text-xs text-gray-500">Secure • Simple • Trusted</p>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="hidden md:inline-flex text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="hidden md:inline-flex text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <Link href="/about">How it Works</Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button 
              asChild 
              size="sm" 
              className="bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-md"
            >
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function LandingHeroSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
      className="relative overflow-hidden bg-[#064e3b]"
    >
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-emerald-900/20 to-transparent" />
      <motion.div
        className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8 lg:py-8"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <LandingHeader />

        <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <Badge className="rounded-full bg-emerald-100 text-emerald-800 border-emerald-200 px-4 py-1.5">
              Simple trust for real-world service payments
            </Badge>

            <div className="space-y-4">
              <h1 className="max-w-xl text-balance text-4xl font-bold leading-tight text-white sm:text-5xl">
              Secure hiring and escrow made easier for <span className="text-emerald-300">everyday work.</span>
            </h1>
            <p className="max-w-lg text-base leading-7 text-emerald-100">
              WorkSure helps clients hire with confidence and gives artisans better visibility
              into funded work, progress, and safe payment release.
            </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href="/auth/register">
                  Create an account
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-white/90 px-6">
                <Link href="/auth/login">Explore workspace</Link>
              </Button>
            </div>
          </div>

          {/* <Card className="border-emerald-200/80 bg-white/90 py-0 shadow-[0_24px_70px_-34px_rgba(16,185,129,0.28)]">
            <CardContent className="p-4 sm:p-5">
              <div className="rounded-[28px] bg-[linear-gradient(135deg,#0f172a_0%,#065f46_45%,#10b981_100%)] p-5 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/80">
                      WorkSure Flow
                    </p>
                    <p className="mt-2 text-2xl font-semibold leading-tight">
                      Fund work first. Release only when the job is done.
                    </p>
                  </div>
                  <div className="rounded-md bg-white/12 p-3">
                    <Sparkles className="size-5 text-emerald-100" />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="rounded-md bg-white/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/75">Stage 1</p>
                    <p className="mt-1 text-sm font-medium">Client funds escrow</p>
                  </div>
                  <div className="rounded-md bg-white/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/75">Stage 2</p>
                    <p className="mt-1 text-sm font-medium">Artisan completes the work</p>
                  </div>
                  <div className="rounded-md bg-white/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/75">Stage 3</p>
                    <p className="mt-1 text-sm font-medium">Payment is released with confirmation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        <motion.div
          className="grid gap-3 sm:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {statCards.map(({ value, label, icon: Icon }) => (
            <motion.div key={label} variants={fadeInUp}>
              <Card className="border-emerald-600/30 bg-emerald-700/50 py-0 shadow-sm">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-600/30 border border-emerald-500/30">
                    <Icon className="size-5 text-emerald-200" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{value}</p>
                    <p className="text-xs text-emerald-200">{label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export function LandingPromiseSection() {
  return (
    <section id="about" className="bg-slate-50 py-18">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            About WorkSure
          </p>
          <h2 className="mt-3 text-emerald-950">A calmer way to handle trust, work, and payments</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            WorkSure is designed for local services where trust matters most. Instead of leaving
            payment expectations unclear, the platform makes funding, delivery, confirmation, and
            release visible from the start.
          </p>
        </div>

        <Card className="border-emerald-100 bg-emerald-50 py-0">
          <CardContent className="p-6">
            <p className="text-sm leading-7 text-slate-600">
              The goal is simple: clients should feel their money is protected, artisans should feel
              funded work is real, and admins should have clearer oversight when something needs
              attention.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {featureCards.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="border-emerald-100 bg-white py-0 text-center shadow-sm">
              <CardContent className="flex flex-col items-center p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
                  <Icon className="size-5 text-emerald-700" />
                </div>
                <p className="mt-4 font-semibold text-foreground">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingAudienceSection() {
  return (
    <section
      id="trust"
      className="bg-slate-100 py-24"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center lg:px-8">
        <h2 className="text-emerald-950">Loved by customers and artisans</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          The experience is built to feel approachable and reliable, even for
          users who are not deeply technical.
        </p>

        <div className="mt-12 grid w-full gap-5 md:grid-cols-2">
          {trustCards.map((item) => (
            <Card
              key={item.title}
              className="border-emerald-100 bg-white py-0 text-left shadow-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-100 border border-emerald-200">
                    <BadgeCheck className="size-5 text-emerald-700" />
                  </div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingHowItWorksSection() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto w-full max-w-5xl px-6 lg:px-8">
        <div className="rounded-[36px] border border-emerald-200 bg-slate-100 p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.88fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Why it works
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950">
                A marketplace layout that keeps money information visible
              </h3>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                WorkSure should never make payment actions feel hidden or confusing. The landing
                page now introduces the product with the same clarity the app should keep inside the
                dashboard.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-3xl bg-emerald-100 border border-emerald-200 px-5 py-4">
                <p className="text-sm font-semibold text-emerald-800">Fund Escrow</p>
                <p className="mt-1 text-sm text-slate-600">The client secures the job before work starts.</p>
              </div>
              <div className="rounded-3xl bg-white border border-emerald-200 px-5 py-4">
                <p className="text-sm font-semibold text-emerald-800">Track Progress</p>
                <p className="mt-1 text-sm text-slate-600">Both sides can follow the contract state clearly.</p>
              </div>
              <div className="rounded-3xl bg-white border border-emerald-200 px-5 py-4">
                <p className="text-sm font-semibold text-emerald-800">Release Payment</p>
                <p className="mt-1 text-sm text-slate-600">Funds move only after completion is confirmed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingCtaSection() {
  return (
    <section id="community" className="bg-slate-100 py-22">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Join Our Community
        </p>
        <h2 className="mt-3 text-emerald-950">Start using WorkSure with a safer payment flow</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Create an account as a client or artisan and move into a workspace where job status,
          escrow, and payout actions are easier to understand.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full px-6">
            <Link href="/auth/register">Create account</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full bg-white px-6">
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-emerald-200 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 text-sm text-text-secondary md:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <p className="font-semibold text-foreground">WorkSure</p>
          <p className="mt-2 max-w-md">
            Safer payments, clearer job flow, and better trust for service work.
          </p>
        </div>
        <div className="flex flex-wrap items-start gap-4 md:justify-end">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-primary-dark">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
