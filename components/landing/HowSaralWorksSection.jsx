"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HowSaralWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Vernacular Voice & Plain Language",
      hindi: "अपनी सरल भाषा में बोलें या लिखें",
      desc: "Kisi kanooni shabd ya vakeel ki zaroorat nahi. Hindi, English ya Hinglish me voice ya text se apna mudda batayein. SARAL AI ise Section 6(1) format me badal deta hai.",
    },
    {
      num: "02",
      title: "Automatic Department Suggestion",
      hindi: "सटीक सरकारी विभाग एवं PIO का चयन",
      desc: "Central, State ya Gram Panchayat ke saikdo vibhagon me se sahi Public Authority aur Public Information Officer (PIO) ko AI automatic suggest karta hai taaki petition reject na ho.",
    },
    {
      num: "03",
      title: "30-Day Mandatory Tracking Clock",
      hindi: "30 दिन की समय-सीमा एवं ऑटो-अपील",
      desc: "RTI Act 2005 ke tahat 30 din me jawab dena kanoonan zaroori hai. Agar officer 30 din me jawab na de, toh SARAL turant Section 19(1) First Appeal memorandum tayyar kar deta hai.",
    },
    {
      num: "04",
      title: "Human-in-the-Loop Official Seal",
      hindi: "अधिकृत अधिकारी द्वारा डिजिटल सत्यापन",
      desc: "SARAL AI khud se sarkari jawab invent nahi karta. Har RTI response ko designated sarkari officer official records se check karke digitally sign aur verify karta hai.",
    },
  ];

  return (
    <section id="how-it-works" className="ground-sand w-full py-16 lg:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold tracking-wider">
            <span>How SARAL works • डिजिटल पारदर्शी सेतु</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            How SARAL Helps You File and Track an RTI
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Traditional RTI me aam citizen ko dar aur bureaucratic confusion rehta hai. SARAL AI is process ko simple, dignified aur transparent banata hai.
          </p>
        </div>

        {/* 2-Column Split: 4 Steps + AI Bridge Artwork */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: 4 Clear Steps (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-5 rounded-2xl bg-white dark:bg-[#1a2330] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md">
                  {step.num}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-300">
                      • {step.hindi}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: AI Bridge Artwork (5 Cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            <figure className="w-full rounded-3xl bg-white dark:bg-[#1d2733] border border-slate-300 dark:border-white/15 p-8 sm:p-10 flex flex-col gap-6">
              <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">Who signs the reply</span>
              <blockquote className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-semibold leading-snug text-slate-900 dark:text-white">
                AI sirf drafting aur department suggestion me help karta hai. Response hamesha official authorized officer dwara sign hota hai.
              </blockquote>
            </figure>

            {/* Quick Action Link below image */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all"
              >
                <span>Explore Full 4-Step Architecture →</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                <span>File your first petition</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
