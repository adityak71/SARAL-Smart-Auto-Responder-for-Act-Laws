"use client";

import { motion } from "framer-motion";
import { downloadCertifiedResponse } from "@/lib/services/pdfGenerator";
import { Landmark as IcLandmark } from "lucide-react";

export default function CertifiedResponseModal({ isOpen, onClose, application, officialResponse }) {
  if (!isOpen || !application) return null;

  const appNumber = application.applicationNumber || application.id || "SARAL-2026-00124";
  const citizenName = application.citizen?.user?.fullName || application.citizen || "Rahul Sharma";
  const deptName = application.department?.name || application.suggestedDepartment || "Public Works Department (PWD)";
  const responseText =
    officialResponse ||
    application.officialResponse ||
    "Certified copy of Sanctioned Administrative & Financial Approval (A&F Order No. PWD/2025/381) and Measurement Book Vol. IV entries are hereby furnished. The project was inspected on-site by the Executive Engineer on 15 Oct 2026. All disbursed Running Account (RA) bills are audited and found compliant.";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 animate-fadeIn overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#1a2330] border border-slate-300 dark:border-purple-500/40 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto text-slate-800 dark:text-slate-100 print:m-0 print:border-none print:shadow-none"
      >
        {/* Top Control Bar (Hidden in Print) */}
        <div className="p-4 bg-slate-100 dark:bg-purple-950/50 border-b border-slate-200 dark:border-white/10 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-bold text-xs tracking-wider text-slate-700 dark:text-purple-200">
              Class 3 PKI Digitally Signed Memorandum
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadCertifiedResponse(application, responseText)}
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Download Certified PDF</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Official Sovereign Document Sheet */}
        <div className="p-6 sm:p-10 space-y-6 bg-white dark:bg-[#1a2330] relative">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
            <span className="text-8xl sm:text-9xl font-extrabold tracking-widest text-slate-900 dark:text-white">
              SARAL RTI
            </span>
          </div>

          {/* Letterhead Header */}
          <div className="text-center pb-5 border-b-2 border-slate-900/80 dark:border-purple-400/80 space-y-1">
            <div className="text-2xl mb-1"><IcLandmark className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></div>
            <h2 className="text-xs tracking-widest font-bold text-slate-600 dark:text-slate-400">
              Government Public Authority • Right to Information Act, 2005
            </h2>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              {deptName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Office of the Designated Public Information Officer (Section 5(1))
            </p>
          </div>

          {/* Dispatch Metadata Row */}
          <div className="grid grid-cols-2 text-xs font-mono gap-4 py-2 border-b border-slate-200 dark:border-white/10">
            <div>
              <span className="text-slate-400 block text-xs">MEMORANDUM DISPATCH REF:</span>
              <strong className="text-purple-700 dark:text-purple-300">
                MEMO/{appNumber}/PIO-CERT
              </strong>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-xs">DISPATCH DATE:</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </strong>
            </div>
          </div>

          {/* Addressee */}
          <div className="text-xs space-y-1">
            <span className="text-slate-500 font-semibold block">To,</span>
            <div className="pl-3 border-l-2 border-purple-500/40">
              <strong className="text-slate-900 dark:text-white text-sm block">
                {citizenName}
              </strong>
              <p className="text-slate-500 dark:text-slate-400">
                DigiLocker Verified Citizen ID: DL-IND-90218821
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Application Reference No: <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{appNumber}</span>
              </p>
            </div>
          </div>

          {/* Subject Line */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
            <strong className="text-slate-900 dark:text-white">SUBJECT: </strong>
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Information furnished under Section 7(1) of the Right to Information Act, 2005 against petition ref: {appNumber}
            </span>
          </div>

          {/* Official Memorandum Text */}
          <div className="space-y-3 text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-serif">
            <p>Sir / Madam,</p>
            <p className="text-justify indent-6">
              With reference to your application filed under Section 6(1) of the Right to Information Act, 2005, the requested records and information have been examined by the undersigned Public Information Officer in accordance with the statutory provisions of the Act.
            </p>

            <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/20 font-sans text-xs space-y-2">
              <strong className="text-purple-900 dark:text-purple-200 block text-xs tracking-wider">
                Official Certified Findings & Disclosures:
              </strong>
              <p className="text-slate-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                {responseText}
              </p>
            </div>

            <p className="text-justify indent-6">
              Certified true copies of the official Measurement Book extracts, sanction letters, and technical approvals are enclosed herewith under the digital seal of this authority.
            </p>

            {/* Section 19(1) Appellate Right Notice */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-500/30 font-sans text-xs space-y-1">
              <strong className="text-amber-800 dark:text-amber-300 block">
                Statutory Appellate Remedy (Section 19(1)):
              </strong>
              <p className="text-slate-700 dark:text-slate-300">
                If you are aggrieved by this response or any partial determination, you may prefer an appeal under Section 19(1) within thirty (30) days from the receipt of this memorandum before the First Appellate Authority (FAA), Directorate of Works, Division II.
              </p>
            </div>
          </div>

          {/* Digital Signature & QR Verification Stamp */}
          <div className="pt-4 border-t-2 border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Class 3 PKI Stamp */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg shrink-0">
                ✓
              </div>
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-emerald-700 dark:text-emerald-300 block text-xs">
                  Digitally Certified by PIO
                </span>
                <span className="text-slate-600 dark:text-slate-300 block">
                  Er. Rameshwar Verma, Executive Engineer
                </span>
                <span className="text-slate-400 block font-mono">
                  CCA India Class 3 PKI • SHA-256 Verified
                </span>
              </div>
            </div>

            {/* Verification QR Code */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="w-14 h-14 bg-white p-1 rounded-xl border border-slate-300 shadow-sm flex items-center justify-center">
                {/* Visual SVG QR Representation */}
                <svg viewBox="0 0 24 24" className="w-full h-full text-slate-900 fill-current">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm8-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm10-2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm-2-2h2v2h-2v-2zm0 4h2v2h-2v-2z" />
                </svg>
              </div>
              <div className="text-xs text-slate-400 font-mono leading-tight max-w-[120px]">
                Scan to verify on National RTI Gateway
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
