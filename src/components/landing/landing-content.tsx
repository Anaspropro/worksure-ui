import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCheck,
  CreditCard,
  Landmark,
  ShieldCheck,
  Sparkles,
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
  {
    title: "For admins",
    description: "Keep marketplace trust visible with verification and dispute resolution tools.",
  },
];

const footerLinks = [
  { href: "/auth/login", label: "Login" },
  { href: "/auth/register", label: "Create account" },
  { href: "/dashboard", label: "Workspace" },
];

export function LandingHeader() {
  return (
    <header className="sticky top-0 rounded-[28px] border border-emerald-300 bg-white/85 px-6 py-4 shadow-[0_18px_40px_-30px_rgba(16,185,129,0.35)] backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#10b981,#059669)] text-xs font-bold text-white">
            WS
          </div>
          <div>
            <p className="text-xl font-italic font-semibold text-foreground">WorkSure</p>
          </div>
        </div>

        {/* <nav className="hidden items-center gap-5 text-xs font-medium text-text-secondary md:flex">
          <Link href="/" className="transition hover:text-primary-dark">
            Home
          </Link>
          <a href="#about" className="transition hover:text-primary-dark">
            About
          </a>
          <a href="#trust" className="transition hover:text-primary-dark">
            Trust
          </a>
          <a href="#community" className="transition hover:text-primary-dark">
            Community
          </a>
        </nav> */}

        <div className="flex items-center gap-2">
          <Button asChild size="lg" variant="ghost" className="hidden sm:inline-flex">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild size="lg" className="rounded-full px-4">
            <Link href="/auth/register">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function LandingHeroSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#eafcf3_0%,#f6fffa_46%,#ffffff_100%)]">
      <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_42%),radial-gradient(circle_at_top_right,rgba(110,231,183,0.18),transparent_36%)]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <LandingHeader />

        <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <Badge className="rounded-full bg-primary-soft px-4 py-1.5 text-primary-dark">
              Simple trust for real-world service payments
            </Badge>

            <div className="space-y-4">
              <h1 className="max-w-xl text-balance text-4xl font-bold leading-tight text-emerald-950 sm:text-5xl">
                Secure hiring and escrow made easier for everyday work.
              </h1>
              <p className="max-w-lg text-base leading-7 text-text-secondary">
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

          <Card className="border-emerald-200/80 bg-white/90 py-0 shadow-[0_24px_70px_-34px_rgba(16,185,129,0.28)]">
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
                  <div className="rounded-2xl bg-white/12 p-3">
                    <Sparkles className="size-5 text-emerald-100" />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl bg-white/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/75">Stage 1</p>
                    <p className="mt-1 text-sm font-medium">Client funds escrow</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/75">Stage 2</p>
                    <p className="mt-1 text-sm font-medium">Artisan completes the work</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/75">Stage 3</p>
                    <p className="mt-1 text-sm font-medium">Payment is released with confirmation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {statCards.map(({ value, label, icon: Icon }) => (
            <Card key={label} className="border-emerald-200/70 bg-white/88 py-0 shadow-[0_16px_36px_-28px_rgba(16,185,129,0.3)]">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft">
                  <Icon className="size-5 text-primary-dark" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">{value}</p>
                  <p className="text-xs text-text-secondary">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingPromiseSection() {
  return (
    <section id="about" className="bg-white py-18">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-dark">
            About WorkSure
          </p>
          <h2 className="mt-3 text-emerald-950">A calmer way to handle trust, work, and payments</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-text-secondary">
            WorkSure is designed for local services where trust matters most. Instead of leaving
            payment expectations unclear, the platform makes funding, delivery, confirmation, and
            release visible from the start.
          </p>
        </div>

        <Card className="border-emerald-200/70 bg-[linear-gradient(180deg,#f4fff8_0%,#ffffff_100%)] py-0 shadow-[0_18px_45px_-30px_rgba(16,185,129,0.18)]">
          <CardContent className="p-6">
            <p className="text-sm leading-7 text-text-secondary">
              The goal is simple: clients should feel their money is protected, artisans should feel
              funded work is real, and admins should have clearer oversight when something needs
              attention.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {featureCards.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="border-emerald-100 bg-white py-0 text-center shadow-[0_16px_40px_-34px_rgba(15,23,42,0.18)]">
              <CardContent className="flex flex-col items-center p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
                  <Icon className="size-5 text-primary-dark" />
                </div>
                <p className="mt-4 font-semibold text-foreground">{title}</p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
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
    <section id="trust" className="bg-[linear-gradient(180deg,#ebfdf4_0%,#dcfce7_100%)] py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center lg:px-8">
        <h2 className="text-emerald-950">Loved by families, clients, and skilled workers</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
          The experience is built to feel approachable and reliable, even for users who are not
          deeply technical.
        </p>

        <div className="mt-12 grid w-full gap-5 md:grid-cols-3">
          {trustCards.map((item) => (
            <Card key={item.title} className="border-emerald-200/70 bg-white/88 py-0 text-left shadow-[0_18px_40px_-30px_rgba(16,185,129,0.2)]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft">
                    <BadgeCheck className="size-5 text-primary-dark" />
                  </div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-text-secondary">{item.description}</p>
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
    <section className="bg-white py-24">
      <div className="mx-auto w-full max-w-5xl px-6 lg:px-8">
        <div className="rounded-[36px] border border-emerald-200/80 bg-[linear-gradient(180deg,#f6fffa_0%,#ffffff_100%)] p-8 shadow-[0_24px_60px_-38px_rgba(16,185,129,0.24)]">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.88fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-dark">
                Why it works
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950">
                A marketplace layout that keeps money information visible
              </h3>
              <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
                WorkSure should never make payment actions feel hidden or confusing. The landing
                page now introduces the product with the same clarity the app should keep inside the
                dashboard.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-3xl bg-primary-soft px-5 py-4">
                <p className="text-sm font-semibold text-primary-dark">Fund Escrow</p>
                <p className="mt-1 text-sm text-text-secondary">The client secures the job before work starts.</p>
              </div>
              <div className="rounded-3xl bg-white px-5 py-4 ring-1 ring-emerald-200">
                <p className="text-sm font-semibold text-primary-dark">Track Progress</p>
                <p className="mt-1 text-sm text-text-secondary">Both sides can follow the contract state clearly.</p>
              </div>
              <div className="rounded-3xl bg-white px-5 py-4 ring-1 ring-emerald-200">
                <p className="text-sm font-semibold text-primary-dark">Release Payment</p>
                <p className="mt-1 text-sm text-text-secondary">Funds move only after completion is confirmed.</p>
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
    <section id="community" className="bg-[linear-gradient(180deg,#ebfdf4_0%,#ffffff_100%)] py-22">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-dark">
          Join Our Community
        </p>
        <h2 className="mt-3 text-emerald-950">Start using WorkSure with a safer payment flow</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
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
    <footer className="border-t border-emerald-100 bg-[#eafcf3]">
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
