"use client";

import { useState } from "react";
import DocumentPreviewModal from "@/components/common/DocumentPreviewModal";

export default function TrackingDetailCard({ application }) {
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    documentType: "RECEIPT",
    docName: "",
  });

  if (!application) return null;

  const handleOpenPreview = (documentType, docName = "") => {
    setPreviewModal({
      isOpen: true,
      documentType,
      docName,
    });
  };

  return (
    <div className="w-full bg-white dark:bg-[#16262d] border border-slate-300/40 dark:border-white/10 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono text-purple-700 dark:text-purple-300 font-bold block">
            {application.id}
          </span>
          <h2 className="font-display text-2xl leading-8 font-semibold text-purple-900 dark:text-white mt-0.5">
            {application.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Applicant: <strong className="text-slate-800 dark:text-slate-200">{application.citizenName}</strong> • {application.citizenLocation}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => handleOpenPreview("RECEIPT", "Statutory Filing Receipt")}
            className="px-4 py-2 rounded-xl bg-purple-600/15 hover:bg-purple-600 text-purple-700 hover:text-white dark:bg-purple-600/25 dark:hover:bg-purple-600 dark:text-purple-300 dark:hover:text-white text-xs font-semibold border border-purple-500/30 transition flex items-center gap-2 cursor-pointer"
          >
            <span>View Receipt</span>
          </button>

          {(application.status === "completed" || application.officialResponse) && (
            <button
              type="button"
              onClick={() => handleOpenPreview("CERTIFIED_RESPONSE", "Official Response Memorandum")}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>View Certified Response</span>
            </button>
          )}

          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold w-fit ${
              application.status === "completed"
                ? "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30"
                : application.status === "appeal_open"
                ? "bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-500/30"
                : "bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/30"
            }`}
          >
            {application.statusLabel}
          </span>
        </div>
      </div>

      {/* Citizen Raw Speech / Inquiry */}
      <div className="p-4 rounded-xl bg-[#eaf5fd] dark:bg-white/[0.04] border border-slate-300/40 dark:border-white/5 space-y-2 text-[13px]">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wider block">
          Original Citizen Inquiry (Vernacular Input):
        </span>
        <blockquote className="font-display italic text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed">
          &ldquo;{application.rawPrompt}&rdquo;
        </blockquote>
      </div>

      {/* Structured Section 6(1) Statutory Clauses */}
      <div className="p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-300/40 dark:border-white/10 space-y-3 text-[13px]">
        <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-500/20 pb-2">
          <span className="font-bold text-purple-900 dark:text-purple-200 text-xs">
            Formulated Legal Clauses under Section 6(1) of RTI Act, 2005:
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            Zero Legal Ambiguity
          </span>
        </div>

        <div className="space-y-2">
          {(() => {
            const raw = application.structuredClauses;
            let clauses = [];
            if (Array.isArray(raw)) {
              clauses = raw.filter(Boolean);
            } else if (typeof raw === "string") {
              const trimmed = raw.trim();
              if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                try {
                  const parsed = JSON.parse(trimmed);
                  if (Array.isArray(parsed)) clauses = parsed.filter(Boolean);
                } catch {}
              }
              if (clauses.length === 0) {
                clauses = trimmed
                  .split(/\n+/)
                  .map((l) => l.replace(/^\d+[\.\)]\s*/, "").trim())
                  .filter(Boolean);
              }
            }
            return clauses.map((clause, index) => (
              <div key={index} className="flex items-start gap-2 text-slate-700 dark:text-slate-200 text-xs leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-purple-600/15 dark:bg-purple-600/30 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{clause}</span>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Certified Records & Documents Vault */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-wider">
          Official Certified Documents & Receipts
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {application.documents.map((doc) => (
            <div
              key={doc.name}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:border-purple-400/50 transition-colors flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="text-slate-900 dark:text-white font-medium truncate block">
                    {doc.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {doc.size} • <strong className="text-emerald-600 dark:text-emerald-400">{doc.status}</strong>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenPreview("PUBLIC_RECORD", doc.name)}
                className="px-3 py-2 rounded-xl bg-purple-100 hover:bg-purple-600 text-purple-700 hover:text-white dark:bg-purple-600/20 dark:hover:bg-purple-600 dark:text-purple-300 dark:hover:text-white border border-purple-300 dark:border-purple-500/30 text-xs font-semibold transition shrink-0 cursor-pointer"
              >
                View &amp; Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Document Preview & Download Modal */}
      <DocumentPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ ...previewModal, isOpen: false })}
        documentType={previewModal.documentType}
        docName={previewModal.docName}
        application={application}
        officialResponse={application.officialResponse}
      />
    </div>
  );
}
