"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function WhyRtiMattersSection() {
  const pillars = [
    {
      title: "Roads & Public Infrastructure",
      hindiTitle: "सड़क एवं सरकारी निर्माण कार्य",
      description:
        "Gaon ya mohalle ki sadak saalon se tooti hai? RTI ke zariye aap jaan sakte hain: Kitna budget sanction hua, kis thekedar ko tender mila, aur contractual deadline kya thi.",
      statute: "Section 6(1) Public Works Requisition",
    },
    {
      title: "Education & School Grants",
      hindiTitle: "शिक्षा, स्कूल एवं मिड-डे मील",
      description:
        "Sarkari school me smart classes, computer lab ya infrastructure ke liye aayi sarkari grant kahan kharch hui? Certified voucher aur stock registers access karein.",
      statute: "Samagra Shiksha & RTE Transparency",
    },
    {
      title: "PDS Ration & Welfare Schemes",
      hindiTitle: "राशन, खाद्य सुरक्षा एवं जन कल्याण",
      description:
        "Ration card apply karne ke baad bhi quota nahi mil raha? Ration godown dispatch records aur Fair Price Shop distribution log check karein bina kisi dar ke.",
      statute: "National Food Security Act (NFSA)",
    },
    {
      title: "Clean Water & Healthcare",
      hindiTitle: "शुद्ध पेयजल एवं अस्पताल सुविधाएं",
      description:
        "Nal se ganda paani aa raha hai ya hospital me dawa nahi mil rahi? Weekly water potability laboratory reports aur government hospital medicine stock ki certified copies paayein.",
      statute: "Public Health Standards & Municipal Accountability",
    },
  ];

  return (
    <section id="why-rti" className="w-full py-16 lg:py-24 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 text-left">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            <span>RTI Act 2005 • सूचना का अधिकार</span>
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
            <figure className="rounded-3xl bg-purple-800 dark:bg-[#1d2733] text-white p-8 sm:p-10 flex flex-col gap-6 min-h-[320px] justify-between">
              <blockquote className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-semibold leading-snug">
                Jab nagrik sawal poochte hain, tabhi sadak banti hai aur corruption par lagam lagti hai.
              </blockquote>
              <figcaption className="text-sm text-purple-100 border-t border-white/20 pt-4">
                Community accountability under Article 19(1)(a) of the Constitution
              </figcaption>
            </figure>
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
                className="p-5 rounded-2xl bg-white dark:bg-[#1a2330] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-colors flex flex-col justify-between gap-3 group"
              >
                <div className="space-y-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                      {pillar.title}
                    </h3>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-300 block mt-0.5">
                      {pillar.hindiTitle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-white/5">
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500 font-semibold block">
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
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300 hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm transition-colors"
          >
            <span>Learn more about SARAL Mission &amp; DPDP compliance →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
