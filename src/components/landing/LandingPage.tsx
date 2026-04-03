import {
  LandingAudienceSection,
  LandingCtaSection,
  LandingFooter,
  LandingHeroSection,
  LandingHowItWorksSection,
  LandingPromiseSection,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <main className="min-h-screen  text-foreground">
      <LandingHeroSection />
      <LandingPromiseSection />
      <LandingHowItWorksSection />
      <LandingAudienceSection />
      <LandingCtaSection />
      <LandingFooter />
    </main>
  );
}
