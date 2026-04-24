import {
  LandingAudienceSection,
  LandingCtaSection,
  LandingFooter,
  LandingHeroSection,
  LandingHowItWorksSection,
  LandingPromiseSection,
} from "@/components/landing";
import LandingNavbar from "@/components/landing/LandingNavbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main>
        <LandingHeroSection />
        <LandingPromiseSection />
        <LandingHowItWorksSection />
        <LandingAudienceSection />
        <LandingCtaSection />
        <LandingFooter />
      </main>
    </div>
  );
}
