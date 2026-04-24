"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Home, Zap, Droplet, Hammer, Paintbrush, Sparkles, Wrench,
  ChevronLeft, ChevronRight, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

/* ── Shared animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── Header ──────────────────────────────────────────────────────── */

// export function LandingHeader() {
//   return (
//     <header className="sticky top-0 z-50 bg-card/70 backdrop-blur-xl border-b border-border">
//       <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
//         <div className="flex items-center gap-2">
//           <div className="flex bg-primary rounded-lg p-1.5 shadow-sm">
//              <Shield className="size-6 text-white" />
//           </div>
//           <p className="text-xl font-bold text-foreground">
//             Work<span className="text-primary">Sure</span>
//           </p>
//         </div>

//         <nav className="hidden md:flex items-center gap-6">
//           <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">How it Works</Link>
//           <Link href="/jobs" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Find Jobs</Link>
//           <Link href="/artisans" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Find Artisans</Link>
//           <Link href="/pricing" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Pricing</Link>
//           <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">About Us</Link>
//           <Link href="/help" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Help</Link>
//         </nav>

//         <div className="flex items-center gap-4">
//           <Link href="/auth/login" className="text-sm font-semibold text-primary hover:text-primary-700 transition-colors">
//             Log in
//           </Link>
//           <Button asChild size="sm" className="rounded-lg">
//             <Link href="/auth/register">Get Started</Link>
//           </Button>
//         </div>
//       </div>
//     </header>
//   );
// }

/* ── Hero ─────────────────────────────────────────────────────────── */

export function LandingHeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-12">
      {/* Decorative gradient blobs */}
      <motion.div
        className="absolute -top-32 -right-32 size-[500px] rounded-full bg-primary/8 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 size-[400px] rounded-full bg-primary/6 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary px-4 py-1.5 flex w-fit items-center gap-2 border border-primary/20">
                <Sparkles className="size-4" /> Trusted by thousands across Nigeria 🇳🇬
              </Badge>
            </motion.div>

            <div className="space-y-6">
              <motion.h1
                className="text-5xl font-bold leading-tight text-foreground md:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
              >
                Hire trusted artisans.<br />Work with <span className="text-primary">confidence.</span>
              </motion.h1>
              <motion.p
                className="max-w-lg text-lg text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                WorkSure is a secure escrow marketplace that connects clients with skilled artisans. Money is held safely in escrow and only released when the job is done.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <Button asChild size="lg" className="rounded-lg px-8 text-base h-12 shadow-lg shadow-primary/20">
                <Link href="/jobs/new">Post a Job</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-lg px-8 text-base h-12">
                <Link href="/auth/register">I&apos;m an Artisan</Link>
              </Button>
            </motion.div>

            <motion.div
              className="pt-4 grid grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {[
                { icon: ShieldCheck, title: "Secure Escrow", desc: "Your money is protected" },
                { icon: BadgeCheck, title: "Verified Professionals", desc: "Skilled & background-checked" },
                { icon: CheckCircle2, title: "On-time Delivery", desc: "Jobs done right, on time" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="space-y-2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <item.icon className="size-5 text-primary" /> {item.title}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="relative mx-auto w-full max-w-md hidden lg:block"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 to-transparent rounded-[40px] opacity-50 transform scale-105" />
             <img src="/placeholder-hero.webp" alt="Artisan" className="relative z-10 w-full h-[500px] object-cover rounded-[40px] shadow-sm bg-muted" />
             
             {/* Progress Card */}
             <motion.div
               initial={{ opacity: 0, x: -30, y: 10 }}
               animate={{ opacity: 1, x: 0, y: 0 }}
               transition={{ delay: 0.8, duration: 0.6 }}
             >
               <Card className="absolute top-10 -left-16 z-20 w-64 shadow-xl border-border bg-card">
                  <CardContent className="p-5">
                     <h4 className="font-semibold text-sm mb-4">Contract Progress</h4>
                     <div className="space-y-3">
                        {['Job Posted', 'Proposal Received', 'Work Confirmed', 'In Progress', 'Completed', 'Paid Out'].map((step, i) => (
                          <div key={step} className="flex items-center gap-3">
                             <div className={`flex rounded-full size-5 items-center justify-center ${i < 4 ? 'bg-success text-white' : 'bg-muted text-muted-foreground'}`}>
                               {i < 4 ? <CheckCircle2 className="size-3" /> : <div className="size-1.5 rounded-full bg-current" />}
                             </div>
                             <span className={`text-sm ${i < 4 ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</span>
                          </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>
             </motion.div>

             {/* Escrow Card */}
             <motion.div
               initial={{ opacity: 0, x: 30, y: -10 }}
               animate={{ opacity: 1, x: 0, y: 0 }}
               transition={{ delay: 1.0, duration: 0.6 }}
             >
               <Card className="absolute bottom-10 -right-8 z-20 shadow-xl border-border p-4 bg-card">
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Escrow Secured</p>
                      <p className="text-xl font-bold mt-1">₦250,000</p>
                      <div className="flex items-center gap-1.5 mt-2 text-success text-xs font-medium bg-success/10 w-fit px-2 py-0.5 rounded-md">
                         <ShieldCheck className="size-3" /> Funds are safe
                      </div>
                    </div>
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                       <Lock className="size-5 text-primary" />
                    </div>
                  </div>
               </Card>
             </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── How it works ──────────────────────────────────────────────── */

export function LandingHowItWorksSection() {
  const steps = [
    { title: "Post a Job", desc: "Tell us what you need done and set your budget.", icon: BriefcaseBusiness, bg: "bg-primary/10", color: "text-primary" },
    { title: "Receive Proposals", desc: "Skilled artisans send proposals for your job.", icon: BadgeCheck, bg: "bg-success/10", color: "text-success" },
    { title: "Fund Escrow", desc: "Pay securely. Your money is held in escrow.", icon: ShieldCheck, bg: "bg-violet-500/10", color: "text-violet-500" },
    { title: "Work Gets Done", desc: "Approve the work and funds are released to the artisan.", icon: CheckCircle2, bg: "bg-orange-500/10", color: "text-orange-500" }
  ];

  return (
    <section className="py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <motion.h2 variants={fadeUp} className="text-3xl font-bold">How <span className="text-primary">WorkSure</span> Works</motion.h2>
        </AnimatedSection>

        <AnimatedSection className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
             <div className="hidden md:block absolute top-[28px] left-[12%] right-[12%] h-[2px] border-t-2 border-dashed border-border z-0"></div>
             {steps.map((step, idx) => (
               <motion.div key={idx} variants={fadeUp} custom={idx} className="relative z-10 flex flex-col items-center">
                  <motion.div
                    className={`size-14 rounded-full ${step.bg} ${step.color} flex items-center justify-center mb-4`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                     <step.icon className="size-6" />
                  </motion.div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-[200px]">{step.desc}</p>
               </motion.div>
             ))}
          </div>
        </AnimatedSection>

        <AnimatedSection className="mt-24 text-left">
           <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Popular Categories</h3>
              <Link href="/categories" className="text-sm font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all">
                 Browse all categories <ArrowRight className="size-4" />
              </Link>
           </motion.div>
           <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              {[
                { name: 'Home Services', icon: Home },
                { name: 'Electrical', icon: Zap },
                { name: 'Plumbing', icon: Droplet },
                { name: 'Carpentry', icon: Hammer },
                { name: 'Painting', icon: Paintbrush },
                { name: 'Cleaning', icon: Sparkles },
                { name: 'Appliance Repair', icon: Wrench },
              ].map((cat, i) => (
                 <motion.div key={cat.name} variants={scaleIn} custom={i}>
                   <Card className="hover:border-primary hover:shadow-md cursor-pointer transition-all duration-200 group">
                      <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                         <cat.icon className="size-8 text-muted-foreground group-hover:text-primary transition-colors" />
                         <span className="text-xs font-semibold">{cat.name}</span>
                      </CardContent>
                   </Card>
                 </motion.div>
              ))}
           </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ── Audience / Stats ──────────────────────────────────────────── */

export function LandingAudienceSection() {
  return (
    <section className="bg-background py-16 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border">
            {[
              { value: "15,000+", label: "Jobs Completed" },
              { value: "8,500+", label: "Happy Clients" },
              { value: "6,200+", label: "Verified Artisans" },
              { value: "₦450M+", label: "Secured in Escrow" },
            ].map((stat, i) => (
              <motion.div key={stat.label} variants={fadeUp} custom={i}>
                <p className="text-4xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection className="mt-20 text-center max-w-2xl mx-auto">
           <motion.h3 variants={fadeUp} className="text-2xl font-bold mb-10">What our users say</motion.h3>
           <motion.div variants={fadeUp} custom={1} className="flex items-center justify-between gap-8">
              <Button variant="ghost" size="icon" className="rounded-full shadow-sm bg-card border border-border"><ChevronLeft className="size-5" /></Button>
              <div className="space-y-6">
                 <p className="text-lg font-medium italic">&quot;WorkSure made it so easy to find a reliable electrician.<br />The escrow system gives me peace of mind.&quot;</p>
                 <div className="flex items-center justify-center gap-3">
                    <div className="size-10 rounded-full bg-muted" />
                    <div className="text-left">
                       <p className="text-sm font-semibold">Chinedu O.</p>
                       <p className="text-xs text-muted-foreground">Homeowner</p>
                    </div>
                 </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full shadow-sm bg-card border border-border"><ChevronRight className="size-5" /></Button>
           </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ── CTA ───────────────────────────────────────────────────────── */

export function LandingCtaSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <AnimatedSection>
        <motion.div
          variants={fadeUp}
          className="mx-auto max-w-7xl bg-gradient-to-r from-[#2D5AE0] to-[#6C8FFA] rounded-2xl p-12 text-center md:flex items-center justify-between text-white shadow-xl shadow-primary/15"
        >
           <div className="text-left mb-8 md:mb-0">
              <h2 className="text-3xl font-bold">Ready to get your work done?</h2>
              <p className="mt-2 text-white/70">Join thousands of satisfied customers and skilled artisans on WorkSure.</p>
           </div>
           <div className="flex gap-4">
              <Button asChild className="bg-white text-primary hover:bg-white/90 h-12 px-6 shadow-lg">
                 <Link href="/jobs/new">Post a Job</Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10 h-12 px-6">
                 <Link href="/auth/register">Join as an Artisan</Link>
              </Button>
           </div>
        </motion.div>
      </AnimatedSection>
    </section>
  );
}

/* ── Promise (consolidated) ─────────────────────────────────────── */

export function LandingPromiseSection() { return null; }

/* ── Footer ────────────────────────────────────────────────────── */

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card pt-16 pb-8">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:px-8 md:grid-cols-5">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
             <div className="flex bg-primary rounded-lg p-1.5 shadow-sm">
                <Shield className="size-5 text-white" />
             </div>
             <p className="text-lg font-bold text-foreground">
               Work<span className="text-primary">Sure</span>
             </p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mt-4">
            Secure escrow marketplace connecting clients with trusted artisans.
          </p>
          <p className="text-xs text-muted-foreground mt-8">© 2024 WorkSure. All rights reserved.</p>
        </div>
        
        <div>
           <h4 className="font-semibold text-sm mb-4">Platform</h4>
           <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">How it Works</Link></li>
              <li><Link href="/jobs" className="hover:text-foreground transition-colors">Find Jobs</Link></li>
              <li><Link href="/artisans" className="hover:text-foreground transition-colors">Find Artisans</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
           </ul>
        </div>
        <div>
           <h4 className="font-semibold text-sm mb-4">Company</h4>
           <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
           </ul>
        </div>
        <div>
           <h4 className="font-semibold text-sm mb-4">Support</h4>
           <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="/safety" className="hover:text-foreground transition-colors">Safety</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
           </ul>
        </div>
        <div>
           <h4 className="font-semibold text-sm mb-4">Follow Us</h4>
           <div className="flex gap-4 text-muted-foreground">
              {/* Social icons placeholder */}
           </div>
           
           <div className="mt-8 flex items-center gap-2 bg-surface border border-border p-2 rounded-lg w-fit">
              <Lock className="size-4 text-success" />
              <div>
                 <p className="text-[10px] font-semibold">Secured by <span className="text-foreground">Paystack</span></p>
                 <p className="text-[9px] text-muted-foreground">Your payments are safe</p>
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
}
