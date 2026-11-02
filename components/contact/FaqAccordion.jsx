"use client";

import { useState } from "react";
import { statutoryFaqs } from "@/data/contactData";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="w-full bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-xl flex flex-col gap-6 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="border-b border-slate-200 dark:border-white/10 pb-4">
        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
          Citizen Legal Knowledge Base
        </span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
          Right to Information Act, 2005 — Frequently Asked Questions
        </h3>
      </div>

      <div className="space-y-3">
        {statutoryFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className="rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-300 transition cursor-pointer"
              >
                <span>{faq.question}</span>
                <span className="text-purple-600 dark:text-purple-400 text-base font-bold shrink-0">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-white/5">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
