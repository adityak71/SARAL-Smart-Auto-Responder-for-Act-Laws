"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function WhyRtiMattersSection() {
  const pillars = [
    {
      icon: "🛣️",
      title: "Roads & Public Infrastructure",
      hindiTitle: "सड़क एवं सरकारी निर्माण कार्य",
      description:
        "Gaon ya mohalle ki sadak saalon se tooti hai? RTI ke zariye aap jaan sakte hain: Kitna budget sanction hua, kis thekedar ko tender mila, aur contractual deadline kya thi.",
      statute: "Section 6(1) Public Works Requisition",
    },
    {
      icon: "🎓",
      title: "Education & School Grants",
      hindiTitle: "शिक्षा, स्कूल एवं मिड-डे मील",
      description:
        "Sarkari school me smart classes, computer lab ya infrastructure ke liye aayi sarkari grant kahan kharch hui? Certified voucher aur stock registers access karein.",
      statute: "Samagra Shiksha & RTE Transparency",
    },
    {
      icon: "🌾",
      title: "PDS Ration & Welfare Schemes",
      hindiTitle: "राशन, खाद्य सुरक्षा एवं जन कल्याण",
      description:
        "Ration card apply karne ke baad bhi quota nahi mil raha? Ration godown dispatch records aur Fair Price Shop distribution log check karein bina kisi dar ke.",
      statute: "National Food Security Act (NFSA)",
    },
    {
      icon: "💧",
      title: "Clean Water & Healthcare",
      hindiTitle: "शुद्ध पेयजल एवं अस्पताल सुविधाएं",
      description:
        "Nal se ganda paani aa raha hai ya hospital me dawa nahi mil rahi? Weekly water potability laboratory reports aur government hospital medicine stock ki certified copies paayein.",
      statute: "Public Health Standards & Municipal Accountability",
    },
  ];

  return (
    <section id="why-rti" className="w-full py-16 lg:py-24 bg-slate-100/60 dark:bg-white/[0.02] border-y border-slate-200 dark:border-white/10 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <span>RTI ACT 2005 • सूचना का अधिकार</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Why Does Every Citizen Need RTI?
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            RTI sirf kanoon nahi, balke har aam nagrik ki taqat hai. Indian Constitution ke <strong>Article 19(1)(a)</strong> ke tahat, janta ke diye gaye tax ke har ek rupaye ka hisaab maangna aapka loktantrik adhikar hai.
          </p>
        </div>

        {/* 2-Column Showcase: AI Image + 4 Core Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Presentation Artwork (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/15 shadow-2xl bg-white dark:bg-[#110830]"
            >
              <img
                src="/images/why-rti-matters.png"
                alt="Citizens inspecting local road project with digital RTI transparency"
                className="w-full h-auto object-cover max-h-[480px]"
              />

              <div className="p-4 bg-slate-900/85 dark:bg-[#0c0529]/95 text-white">
                <span className="text-xs font-bold text-emerald-400 block uppercase">
                  Community Accountability
                </span>
                <p className="text-xs text-slate-200 mt-0.5 leading-snug">
                  Jab nagrik sawal poochte hain, tabhi sadak banti hai aur corruption par lagam lagti hai.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right 4 Concrete Civic Pillars (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-5 rounded-2xl bg-white dark:bg-[#0d062e] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="space-y-2">
                  <span className="text-2xl block">{pillar.icon}</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                      {pillar.title}
                    </h3>
                    <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-300 block mt-0.5">
                      {pillar.hindiTitle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold block uppercase">
                    {pillar.statute}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Link to Full About Page */}
        <div className="pt-2 text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300 hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm transition-all"
          >
            <span>Learn more about SARAL Mission &amp; DPDP compliance →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
