import LandingHero from "./LandingHero";
import LandingFeatures from "./LandingFeatures";
import LandingStats from "./LandingStats";
import LandingHowItWorks from "./LandingHowItWorks";
import LandingBenefits from "./LandingBenefits";
import LandingFAQ from "./LandingFAQ";
import { LandingCTA, LandingFooter } from "./LandingCTAFooter";
import LandingNavbar from "./LandingNavbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingStats />
        <LandingHowItWorks />
        <LandingBenefits />
        <LandingFAQ />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
