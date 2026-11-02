"use client";

import { useState } from "react";

export default function TrackingDetailCard({ application }) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!application) return null;

  const handleDownload = (docName) => {
    setDownloadSuccess(docName);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 3500);
  };

  return (
    <div className="w-full bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 rounded-3xl p-6 shadow-sm dark:shadow-xl flex flex-col gap-6 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono text-purple-700 dark:text-purple-300 font-bold block">
            {application.id}
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            {application.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Applicant: <strong className="text-slate-800 dark:text-slate-200">{application.citizenName}</strong> • {application.citizenLocation}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold w-fit shrink-0 ${
            application.status === "completed"
              ? "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30"
              : application.status === "appeal_open"
              ? "bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-500/30"
              : "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/30"
          }`}
        >
          {application.statusLabel}
        </span>
      </div>

      {/* Citizen Raw Speech / Inquiry */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5 space-y-1.5 text-xs">
        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">
          Original Citizen Inquiry (Vernacular Input):
        </span>
        <blockquote className="italic text-slate-700 dark:text-slate-200 leading-relaxed">
          &ldquo;{application.rawPrompt}&rdquo;
        </blockquote>
      </div>

      {/* Structured Section 6(1) Statutory Clauses */}
      <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/20 space-y-2.5 text-xs">
        <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-500/20 pb-1.5">
          <span className="font-bold text-purple-900 dark:text-purple-200 text-xs">
            Formulated Legal Clauses under Section 6(1) of RTI Act, 2005:
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Zero Legal Ambiguity
          </span>
        </div>

        <div className="space-y-1.5">
          {application.structuredClauses.map((clause, index) => (
            <div key={index} className="flex items-start gap-2 text-slate-700 dark:text-slate-200 text-xs leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-purple-600/15 dark:bg-purple-600/30 text-purple-700 dark:text-purple-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span>{clause}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Certified Records & Documents Vault */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Official Certified Documents & Receipts
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {application.documents.map((doc) => (
            <div
              key={doc.name}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:border-purple-400/50 transition-colors flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="text-slate-900 dark:text-white font-medium truncate block">
                    {doc.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {doc.size} • <strong className="text-emerald-600 dark:text-emerald-400">{doc.status}</strong>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDownload(doc.name)}
                className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-600 text-purple-700 hover:text-white dark:bg-purple-600/20 dark:hover:bg-purple-600 dark:text-purple-300 dark:hover:text-white border border-purple-300 dark:border-purple-500/30 text-xs font-semibold transition shrink-0 cursor-pointer"
              >
                Download
              </button>
            </div>
          ))}
        </div>

        {downloadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <span>✓</span>
            <span>Downloading <strong>{downloadSuccess}</strong> (Certified Digital Copy with SHA-256 seal)</span>
          </div>
        )}
      </div>
    </div>
  );
}
