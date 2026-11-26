"use client";

import Link from "next/link";
import Emblem from "@/components/common/Emblem";
import { footerCivicDirectory } from "@/data/navigationData";

export default function CivicFooter() {
  const {
    brand,
    quickLinks,
    statutoryResources,
    nationalPortals,
    citizenSupport,
    complianceBadges,
    disclaimer,
    copyright,
  } = footerCivicDirectory;

  return (
    <footer
      className="dark w-full bg-[#1d2530] border-t border-white/10 text-slate-300 relative overflow-hidden transition-colors"
      data-purpose="civic-grand-footer"
    >

      {/* Top Compliance Trust Badges Bar */}
      <div className="border-b border-slate-200 dark:border-white/5 bg-slate-50/80 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {complianceBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-none"
              >
                <div className="w-6 h-6 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-semibold truncate">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Directory Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Brand & National Emblem (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-600 p-0.5 shadow-lg">
                <div className="w-full h-full bg-[#1a2330] rounded-[14px] flex items-center justify-center">
                  <Emblem className="w-7 h-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                  {brand.title}
                </h3>
                <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold">
                  {brand.hindiTagline}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              {brand.description}
            </p>

            <div className="p-3 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs shadow-sm dark:shadow-none">
              <span className="text-purple-800 dark:text-purple-300 font-bold block mb-0.5">
                {brand.motto}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Department of Personnel and Training (DoPT) & Central Information Commission Guidelines.
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs font-bold tracking-wider text-slate-900 dark:text-white">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Statutory Resources (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-bold tracking-wider text-slate-900 dark:text-white">
              RTI Act, 2005 Statutory Links
            </h4>
            <ul className="space-y-2 text-xs">
              {statutoryResources.map((item) => (
                <li key={item.label}>
                  {item.isExternal ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      <span>{item.label}</span>
                      <svg className="w-3 h-3 text-slate-400 dark:text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Citizen Support & Helpline (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-bold tracking-wider text-slate-900 dark:text-white">
              Citizen Support & Helpline
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="p-3 rounded-xl bg-purple-100/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/20 text-slate-900 dark:text-white">
                <span className="text-xs text-purple-800 dark:text-purple-300 font-semibold block">
                  Toll-Free National Helpline
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
                  {citizenSupport.tollFree}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                  {citizenSupport.workingHours}
                </span>
              </div>

              <div className="pt-1">
                <strong className="text-slate-700 dark:text-slate-300 block">Citizen Support Email:</strong>
                <a
                  href={`mailto:${citizenSupport.email}`}
                  className="text-purple-700 dark:text-purple-300 hover:underline"
                >
                  {citizenSupport.email}
                </a>
              </div>

              <div>
                <strong className="text-slate-700 dark:text-slate-300 block">Physical Nodal Cell:</strong>
                <p className="text-xs leading-snug">{citizenSupport.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* National Portal Links Grid */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Government of India Digital Initiatives:
          </span>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {nationalPortals.map((portal) => (
              <a
                key={portal.label}
                href={portal.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {portal.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Legal Disclaimer & Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="max-w-3xl text-left leading-relaxed">{disclaimer}</p>
          <p className="shrink-0 font-medium text-slate-600 dark:text-slate-400">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
