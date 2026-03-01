import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HeroSection } from "../components/home/HeroSection";
import { FeaturesSection } from "../components/home/FeaturesSection";
import { PackagesSection } from "../components/home/PackagesSection";
import { ProtocolSection } from "../components/home/ProtocolSection";
import { QuickStartSection } from "../components/home/QuickStartSection";

export function HomePage() {
    const location = useLocation();

    useEffect(() => {
        // When arriving via "View the Demo" with scrollTo state, scroll to the demo section
        const scrollTo = (location.state as { scrollTo?: string } | null)
            ?.scrollTo;
        if (scrollTo) {
            // Small delay to let React finish rendering
            const timer = setTimeout(() => {
                const el = document.getElementById(scrollTo);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [location.state]);

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
