"use client";

import HeroIntroSection from "@/components/landing/HeroIntroSection";
import WhyRtiMattersSection from "@/components/landing/WhyRtiMattersSection";
import HowSaralWorksSection from "@/components/landing/HowSaralWorksSection";
import CivicFooter from "@/components/common/CivicFooter";

export default function HomePage() {
  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-[#08031d] text-slate-800 dark:text-slate-100 flex flex-col antialiased selection:bg-purple-600 selection:text-white transition-colors">
      <main className="flex-1 w-full">
        {/* 1. What is SARAL? Clean, Inspiring Hero with AI Artwork */}
        <HeroIntroSection />

        {/* 2. Why RTI is Needed? Constitutional Right & Concrete Real-Life Pillars with AI Artwork */}
        <WhyRtiMattersSection />

        {/* 3. How SARAL AI Bridges the Gap? Plain Language, Auto-Dept Mapping & 30-Day Shield */}
        <HowSaralWorksSection />
      </main>

      {/* 4. Comprehensive Big Civic Footer (Exclusive to Homepage) */}
      <CivicFooter />
    </div>
  );
}
