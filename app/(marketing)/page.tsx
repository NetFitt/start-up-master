import { HeroCarousel } from "@/components/sections/Home/HeroCarousel";
import DiscoverySection from "@/components/sections/Home/DiscoverySection";
import { WitnessesSection } from "@/components/sections/Home/WitnessesSection";
import { ContactSection } from "@/components/sections/Home/ContactSection";

export default function Home() {
  return (
    <div className="bg-white">
      <HeroCarousel />
      <DiscoverySection />
      <WitnessesSection />
      <ContactSection />
    </div>
  );
}