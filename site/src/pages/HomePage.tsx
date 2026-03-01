import { HeroSection } from "../components/home/HeroSection";
import { FeaturesSection } from "../components/home/FeaturesSection";
import { PackagesSection } from "../components/home/PackagesSection";
import { ProtocolSection } from "../components/home/ProtocolSection";
import { QuickStartSection } from "../components/home/QuickStartSection";

export function HomePage() {
    return (
        <>
            <HeroSection />
            <FeaturesSection />
            <PackagesSection />
            <ProtocolSection />
            <QuickStartSection />
        </>
    );
}
