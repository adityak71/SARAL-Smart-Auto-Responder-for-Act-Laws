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
          <span className="label-caps inline-flex items-center gap-2 px-2 py-1 rounded-sm bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
            How SARAL works • डिजिटल पारदर्शी सेतु
          </span>

          <h2 className="text-[32px] leading-10 sm:text-[44px] sm:leading-[54px] font-semibold text-purple-900 dark:text-white tracking-[-0.02em]">
            How SARAL Helps You File and Track an RTI
          </h2>

          <p className="text-[17px] leading-7 text-slate-600 dark:text-slate-300">
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
                className="p-6 rounded-xl bg-white dark:bg-[#16262d] border border-slate-300/40 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow flex items-start gap-5"
              >
                <div className="w-12 h-12 rounded-sm bg-purple-900 dark:bg-white/10 text-white font-display font-semibold text-lg flex items-center justify-center shrink-0">
                  {step.num}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl leading-7 font-semibold text-purple-900 dark:text-white">
                      {step.title}
                    </h3>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {step.hindi}
                    </span>
                  </div>

                  <p className="text-[13px] leading-5 sm:text-[15px] sm:leading-6 text-slate-600 dark:text-slate-300">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: AI Bridge Artwork (5 Cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            <figure className="w-full rounded-xl bg-purple-600 dark:bg-[#1c2e36] text-white p-8 sm:p-10 flex flex-col gap-6 shadow-lg">
              <span className="label-caps text-cyan-300">Who signs the reply</span>
              <blockquote className="font-display text-xl sm:text-2xl font-medium leading-snug text-white">
                AI sirf drafting aur department suggestion me help karta hai. Response hamesha official authorized officer dwara sign hota hai.
              </blockquote>
            </figure>

            {/* Quick Action Link below image */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-purple-900 hover:bg-purple-700 text-white dark:bg-white dark:text-purple-900 text-sm font-semibold shadow-sm transition-colors"
              >
                <span>Explore Full 4-Step Architecture →</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-white dark:bg-white/5 border border-slate-300/60 dark:border-white/10 text-sm font-semibold text-purple-900 dark:text-purple-200 hover:bg-slate-100 transition-colors"
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
