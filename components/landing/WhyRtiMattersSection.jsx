"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight as IcArrowRight,
  BriefcaseMedical as IcMedical,
  Clock as IcClock,
  Gavel as IcGavel,
  GraduationCap as IcGraduationCap,
  Hammer as IcHammer,
  Landmark as IcLandmark,
  Archive as IcArchive,
  Quote as IcQuote,
  ShieldCheck as IcShieldCheck,
} from "lucide-react";

// Stitch screen 3 "Why Every Citizen Needs RTI": dark petrol quote panel beside a 2x2 grid of
// white domain cards, each with an icon tile, a department chip and a tracked statute footer.
const TONE = {
  forest: "text-[#2a473e] bg-[#c9eadd]/40 dark:text-emerald-300 dark:bg-emerald-500/10",
  clay: "text-cyan-700 bg-cyan-100 dark:text-cyan-300 dark:bg-cyan-500/10",
};

export default function WhyRtiMattersSection() {
  const pillars = [
    {
      title: "Roads & Public Infrastructure",
      hindiTitle: "सड़क एवं सरकारी निर्माण कार्य",
      description:
        "Gaon ya mohalle ki sadak saalon se tooti hai? RTI ke zariye aap jaan sakte hain: Kitna budget sanction hua, kis thekedar ko tender mila, aur contractual deadline kya thi.",
      statute: "Section 6(1) Public Works Requisition",
      dept: "PWD • Urban Local Body",
      tone: "forest",
      Icon: IcHammer,
    },
    {
      title: "Education & School Grants",
      hindiTitle: "शिक्षा, स्कूल एवं मिड-डे मील",
      description:
        "Sarkari school me smart classes, computer lab ya infrastructure ke liye aayi sarkari grant kahan kharch hui? Certified voucher aur stock registers access karein.",
      statute: "Samagra Shiksha & RTE Transparency",
      dept: "Education Dept",
      tone: "clay",
      Icon: IcGraduationCap,
    },
    {
      title: "PDS Ration & Welfare Schemes",
      hindiTitle: "राशन, खाद्य सुरक्षा एवं जन कल्याण",
      description:
        "Ration card apply karne ke baad bhi quota nahi mil raha? Ration godown dispatch records aur Fair Price Shop distribution log check karein bina kisi dar ke.",
      statute: "National Food Security Act (NFSA)",
      dept: "Food & Civil Supplies",
      tone: "forest",
      Icon: IcArchive,
    },
    {
      title: "Clean Water & Healthcare",
      hindiTitle: "शुद्ध पेयजल एवं अस्पताल सुविधाएं",
      description:
        "Nal se ganda paani aa raha hai ya hospital me dawa nahi mil rahi? Weekly water potability laboratory reports aur government hospital medicine stock ki certified copies paayein.",
      statute: "Public Health Standards & Municipal Accountability",
      dept: "Health & Sanitation",
      tone: "forest",
      Icon: IcMedical,
    },
  ];

  return (
    <section id="why-rti" className="w-full py-16 lg:py-24 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="max-w-4xl space-y-3 text-left">
          <span className="label-caps inline-flex items-center gap-2 px-2 py-1 rounded-sm bg-[#c9eadd]/40 text-[#2a473e] dark:bg-emerald-500/10 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
            RTI Act 2005 • सूचना का अधिकार
          </span>

          <h2 className="text-[32px] leading-10 sm:text-[44px] sm:leading-[54px] font-semibold text-purple-900 dark:text-white tracking-[-0.02em]">
            Why Does Every Citizen Need RTI?
          </h2>

          <p className="text-[17px] leading-7 text-slate-600 dark:text-slate-300 max-w-3xl">
            RTI sirf kanoon nahi, balke har aam nagrik ki taqat hai. Indian Constitution ke{" "}
            <strong className="font-semibold text-purple-900 dark:text-white">Article 19(1)(a)</strong> ke tahat, janta ke diye gaye tax ke har ek rupaye ka hisaab maangna aapka loktantrik adhikar hai.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-[13px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <IcShieldCheck className="w-4 h-4 text-[#2a473e] dark:text-emerald-300" strokeWidth={1.75} aria-hidden="true" />
              Guaranteed transparency framework
            </span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5">
              <IcClock className="w-4 h-4 text-cyan-600" strokeWidth={1.75} aria-hidden="true" />
              Mandatory 30-day response
            </span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5">
              <IcGavel className="w-4 h-4 text-purple-900 dark:text-purple-200" strokeWidth={1.75} aria-hidden="true" />
              CIC &amp; SIC oversight
            </span>
          </div>
        </div>

        {/* Dark quote panel + 2x2 domain cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <figure className="lg:col-span-5 relative overflow-hidden rounded-xl bg-purple-600 dark:bg-[#1c2e36] text-white p-8 sm:p-10 flex flex-col justify-between gap-8 min-h-[360px] shadow-lg">
            <IcLandmark className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 pointer-events-none" strokeWidth={1} aria-hidden="true" />
            <div className="relative space-y-6">
              <span className="w-12 h-12 rounded-sm bg-white/10 flex items-center justify-center text-purple-200">
                <IcQuote className="w-6 h-6" strokeWidth={1.75} fill="currentColor" aria-hidden="true" />
              </span>
              <blockquote className="font-display text-2xl sm:text-[30px] sm:leading-[38px] font-medium tracking-[-0.01em]">
                “Jab nagrik sawal poochte hain, tabhi sadak banti hai aur corruption par lagam lagti hai.”
              </blockquote>
            </div>
            <figcaption className="relative space-y-2">
              <span className="block w-12 h-0.5 bg-cyan-400" aria-hidden="true" />
              <span className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-100">Article 19(1)(a) • Right to know</span>
                <span className="label-caps text-cyan-300">Constitution of India</span>
              </span>
              <span className="block text-xs text-slate-200/70">
                Community accountability under Article 19(1)(a) of the Constitution
              </span>
            </figcaption>
          </figure>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            {pillars.map(({ Icon, ...pillar }, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 rounded-xl bg-white dark:bg-[#16262d] border border-slate-300/40 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="w-9 h-9 rounded-sm bg-slate-100 dark:bg-white/10 flex items-center justify-center text-purple-900 dark:text-purple-200">
                      <Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${TONE[pillar.tone]}`}>
                      {pillar.dept}
                    </span>
                  </div>
                  <div className="pt-1">
                    <h3 className="font-sans text-base font-semibold tracking-[0.01em] text-purple-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                      {pillar.title}
                    </h3>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 block">
                      {pillar.hindiTitle}
                    </span>
                  </div>
                  <p className="text-[13px] leading-5 text-slate-600 dark:text-slate-300 pt-1">
                    {pillar.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-400">
                  <span className="label-caps">{pillar.statute}</span>
                  <IcArrowRight className="shrink-0 w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.75} aria-hidden="true" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Link to Full About Page */}
        <div className="pt-2 text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white dark:bg-white/5 border border-slate-300/60 dark:border-white/10 text-sm font-semibold text-purple-900 dark:text-purple-200 hover:bg-slate-100 dark:hover:bg-white/10 shadow-sm transition-colors"
          >
            <span>Learn more about SARAL Mission &amp; DPDP compliance</span>
            <IcArrowRight className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
