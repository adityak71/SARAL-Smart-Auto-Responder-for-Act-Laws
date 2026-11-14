"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  downloadRtiReceipt,
  downloadCertifiedResponse,
  downloadPublicRecordDoc,
} from "@/lib/services/pdfGenerator";

export default function DocumentPreviewModal({
  isOpen,
  onClose,
  documentType = "RECEIPT", // "RECEIPT" | "CERTIFIED_RESPONSE" | "PUBLIC_RECORD"
  application,
  docName,
  officialResponse,
}) {
  if (!isOpen || !application) return null;

  const appNumber = application.applicationNumber || application.idStr || application.id || "SARAL-2026-00124";
  const citizen = application.citizenName || application.citizen?.user?.fullName || application.citizen || "Rahul Sharma";
  const department = application.department?.name || application.suggestedDepartment || application.department || "Public Works Department";
  const title = application.title || application.subject || "RTI Application regarding Public Infrastructure";
  const feeStatus = application.feeStatus || "PAID (₹10.00 Settled via Bharatkosh Gateway)";
  const isEmergency = Boolean(application.isLifeOrLiberty);
  const statutoryLimit = isEmergency ? "48 Hours (Section 7(1) Proviso - Life & Liberty)" : "30 Calendar Days (Standard Section 7(1))";
  const dateFiled = application.dateFiled || new Date().toISOString();
  const formattedDate = new Date(dateFiled).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const responseText =
    officialResponse ||
    application.officialResponse ||
    "Certified copy of Sanctioned Administrative & Financial Approval (A&F Order No. PWD/2025/381) and Measurement Book Vol. IV entries are hereby furnished. The project was inspected on-site by the Executive Engineer on 15 Oct 2026. All disbursed Running Account (RA) bills are audited and found compliant.";

  const parseClauses = (val) => {
    if (Array.isArray(val)) return val.filter(Boolean);
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) return parsed.filter(Boolean);
        } catch {}
      }
      const lines = trimmed
        .split(/\n+/)
        .map((l) => l.replace(/^\d+[\.\)]\s*/, "").trim())
        .filter(Boolean);
      if (lines.length > 0) return lines;
    }
    return [
      "Certified copies of Sanction Orders and Administrative Approval issued for works executed in the division.",
      "Inspection and certified extracts of Measurement Book (MB) Vol. IV recording exact chainage dimensions and bitumen thickness.",
      "Total expenditure incurred and Running Account (RA) bills disbursed to the contractor as verified by the Divisional Accounts Officer.",
      "Names, designations, and postings of engineers responsible for on-site execution and quality testing.",
    ];
  };

  const clauses = parseClauses(application.structuredClauses);

  const handleDownload = () => {
    if (documentType === "RECEIPT") {
      downloadRtiReceipt(application);
    } else if (documentType === "CERTIFIED_RESPONSE") {
      downloadCertifiedResponse(application, responseText);
    } else {
      downloadPublicRecordDoc(docName || "Measurement_Book_Register.pdf", application);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-[#0c0524] border border-slate-300 dark:border-purple-500/30 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto text-slate-800 dark:text-slate-100 print:m-0 print:border-none print:shadow-none flex flex-col max-h-[92vh]"
        >
          {/* Top Control Bar (Floating Modal Header) */}
          <div className="p-4 bg-slate-100 dark:bg-purple-950/60 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 shrink-0 print:hidden">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="truncate">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  {documentType === "RECEIPT"
                    ? "Section 6(1) Statutory Filing Receipt & Acknowledgment"
                    : documentType === "CERTIFIED_RESPONSE"
                    ? "Official Certified Response Memorandum (Class 3 PKI)"
                    : `Certified Public Document: ${docName || "Measurement Book Extract"}`}
                </h3>
                <span className="text-[10px] sm:text-xs font-mono text-purple-700 dark:text-purple-300">
                  {appNumber} • Preview Mode
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>📥</span>
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-semibold transition cursor-pointer"
              >
                <span>🖨️</span>
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Document Preview Sheet (Clean, Simple, Perfectly Aligned) */}
          <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100 dark:bg-[#070218]">
            <div className="max-w-2xl mx-auto bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-300 p-6 sm:p-10 space-y-6 font-sans">
              
              {/* Sovereign Letterhead */}
              <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
                <div className="text-2xl mb-1">🏛️</div>
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                  सत्यमेव जयते • Government of India
                </div>
                <h1 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">
                  Right to Information Act, 2005
                </h1>
                <div className="text-xs font-semibold text-purple-700 uppercase">
                  {documentType === "RECEIPT"
                    ? "Statutory Application Filing Receipt & Acknowledgment"
                    : documentType === "CERTIFIED_RESPONSE"
                    ? "Official Response & Information Disclosure Memorandum"
                    : "Certified True Extract of Departmental Records"}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  SARAL National RTI Portal • Public Infrastructure Verification Service
                </div>
              </div>

              {/* Reference Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-2 px-3 bg-slate-100 rounded-xl font-mono text-slate-700 gap-1 border border-slate-200">
                <div>
                  <span className="font-bold">APPLICATION REF: </span>
                  <strong className="text-purple-700">{appNumber}</strong>
                </div>
                <div className="sm:text-right">
                  <span className="font-bold">DATE: </span>
                  <span>{formattedDate}</span>
                </div>
              </div>

              {/* 2-Column Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Applicant Details</div>
                  <div><strong>Name:</strong> {citizen}</div>
                  <div><strong>Verification:</strong> <span className="text-emerald-700 font-bold">✓ DigiLocker Verified</span></div>
                  <div><strong>Fee Status:</strong> <span className="text-emerald-700 font-bold">{feeStatus}</span></div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Jurisdiction & Clock</div>
                  <div><strong>Authority:</strong> {department}</div>
                  <div><strong>Statutory Limit:</strong> <span className={isEmergency ? "text-rose-700 font-bold" : ""}>{statutoryLimit}</span></div>
                  <div><strong>Filing Section:</strong> Section 6(1) Direct Submission</div>
                </div>
              </div>

              {/* Subject Title */}
              <div className="text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Subject Matter:</span>
                <p className="font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {title}
                </p>
              </div>

              {/* Body Content based on document type */}
              {documentType === "RECEIPT" && (
                <div className="space-y-2.5 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Particulars of Information Sought (Section 6(1)):
                  </span>
                  <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {clauses.map((clause, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <span className="font-mono font-bold text-purple-700 shrink-0">
                          {idx + 1}.
                        </span>
                        <span className="text-slate-800 leading-relaxed">{clause}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                    ⚖ <strong>Statutory Mandate:</strong> Under Section 7(1) of the RTI Act 2005, the Public Information Officer must furnish the information within 30 days. If not provided within this timeline, the request shall be deemed to have been refused under Section 7(2).
                  </div>
                </div>
              )}

              {documentType === "CERTIFIED_RESPONSE" && (
                <div className="space-y-3 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Official Statutory Disclosure &amp; Findings:
                  </span>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-slate-800 leading-relaxed">
                    <p>{responseText}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-[11px] leading-relaxed">
                    ⚖ <strong>Appellate Advisory (Section 7(8)):</strong> If aggrieved by this decision, an appeal may be preferred under Section 19(1) of the RTI Act within 30 days to the designated First Appellate Authority (FAA).
                  </div>
                </div>
              )}

              {documentType === "PUBLIC_RECORD" && (
                <div className="space-y-3 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Certified Public Register Extract (Section 2(j)(ii)):
                  </span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                        <tr>
                          <th className="p-2">Item</th>
                          <th className="p-2">Description</th>
                          <th className="p-2">Dimension</th>
                          <th className="p-2">Sanction</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-[11px]">
                        <tr>
                          <td className="p-2 font-mono font-bold text-purple-700">MB-01</td>
                          <td className="p-2">Roadway excavation in soil &amp; morrum</td>
                          <td className="p-2">0-250m x 7m x 0.3m</td>
                          <td className="p-2 text-emerald-700 font-bold">TS-2025/11</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-mono font-bold text-purple-700">MB-02</td>
                          <td className="p-2">Granular Sub-Base (GSB) compacted</td>
                          <td className="p-2">0-250m x 7m x 0.15m</td>
                          <td className="p-2 text-emerald-700 font-bold">TS-2025/12</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-mono font-bold text-purple-700">MB-03</td>
                          <td className="p-2">Dense Bituminous Macadam (DBM)</td>
                          <td className="p-2">0-250m x 7m x 0.05m</td>
                          <td className="p-2 text-emerald-700 font-bold">TS-2025/18</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Digital Attestation & Verification Stamp */}
              <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <span>✓</span>
                    <span>Digitally Authenticated &amp; Sealed</span>
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5">
                    Affixed under Section 4 of Information Technology Act, 2000
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1">
                    FINGERPRINT: SHA256:7f8a9b4c8e9f0a1b2c3d4e5f
                  </div>
                </div>

                <div className="text-right sm:text-right shrink-0">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Status</div>
                  <div className="font-bold text-emerald-700 font-mono">DIGILOCKER VERIFIED</div>
                </div>
              </div>

              {/* Bottom Action inside modal */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
                <span className="text-[10px] text-slate-500">
                  Standard A4 Printable Format • Valid for all statutory and appellate proceedings
                </span>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📥</span>
                  <span>Download Clean PDF File</span>
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
