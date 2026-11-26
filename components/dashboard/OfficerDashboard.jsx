"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  XCircle,
  FileText,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import { setCredentials } from "@/redux/slices/authSlice";
import OfficerWorkspace from "@/components/dashboard/OfficerWorkspace";
import { Info as IcInfo, Lock as IcLock } from "lucide-react";

export default function OfficerDashboard({ user }) {
  const dispatch = useDispatch();
  const [isVerified, setIsVerified] = useState(Boolean(user?.isDigiLockerVerified));
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyStep, setVerifyStep] = useState(1); // 1: Info & Request OTP, 2: Enter OTP, 3: Success
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const officerName = user?.name || user?.fullName || "Designated Public Information Officer";
  const deptName = user?.officerProfile?.department?.name || "Public Works Department (PWD Division II)";
  const empId = user?.officerProfile?.employeeId || "EMP-MP-PWD-4091";

  const handleSendOtp = () => {
    setVerifyStep(2);
    setOtp("482910"); // Simulated secure OTP for officer convenience
    setErrorMsg("");
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setErrorMsg("Please enter the complete 6-digit verification OTP.");
      return;
    }
    setVerifying(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/verify-digilocker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaarLast4: "8821" }),
      });
      const data = await res.json();

      if (data.success) {
        setIsVerified(true);
        setVerifyStep(3);
        if (data.user) {
          dispatch(setCredentials(data.user));
        }
        setTimeout(() => {
          setShowVerifyModal(false);
          setVerifyStep(1);
        }, 1500);
      } else {
        setErrorMsg(data.error || "DigiLocker authentication failed. Please try again.");
      }
    } catch {
      setErrorMsg("Network error connecting to MeitY DigiLocker Gateway.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Officer Bio & Department Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-purple-700 dark:bg-purple-950/80 border border-purple-400/40 dark:border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden transition-all">

        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/15 text-purple-200 border border-purple-500/30 text-xs font-bold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Public Information Officer (PIO) Portal • Section 5(1) Designated
            </div>
            {isVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> DigiLocker Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5" /> e-KYC Pending
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {officerName}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
            <span><strong>Department:</strong> {deptName}</span>
            <span>•</span>
            <span><strong>Jurisdiction:</strong> Pipariya & Hoshangabad Circle</span>
            <span>•</span>
            <span><strong>Employee ID:</strong> {empId}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Review citizen Section 6(1) petitions, verify pre-retrieved AI measurement books and voucher registers, and dispatch certified administrative orders before the 30-day statutory expiry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 z-10">
          <Link
            href="/general-info"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm shadow-md transition"
          >
            Statutory Rules Catalog
          </Link>
          {isVerified ? (
            <a
              href="#examination-queue"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 font-semibold text-xs sm:text-sm transition"
            >
              Scroll to Queue ↓
            </a>
          ) : (
            <button
              onClick={() => setShowVerifyModal(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" /> Verify with DigiLocker
            </button>
          )}
        </div>
      </div>

      {/* MANDATORY DIGILOCKER VERIFICATION GATE FOR UNVERIFIED OFFICERS */}
      {!isVerified && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 dark:bg-amber-500/5 border-2 border-amber-500/40 text-slate-900 dark:text-white shadow-xl space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-amber-900 dark:text-amber-300">
                  Mandatory Officer e-KYC Verification Required
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Central Information Commission (CIC) Compliance & Section 5(1) RTI Act 2005 Protocol
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowVerifyModal(true)}
              className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
            >
              <KeyRound className="w-4 h-4" /> Authenticate via DigiLocker
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1a2330] border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-rose-500"><IcLock className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span> Section 6(1) Dossiers Locked
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Citizen petition inspection and confidential public works records cannot be accessed prior to officer e-KYC.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1a2330] border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-rose-500"><IcLock className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span> AI Evidence Matching Blocked
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Automated measurement books and municipal voucher cross-referencing tools remain secured.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1a2330] border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-rose-500"><IcLock className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span> Disposal Order Issuance
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Official certified Section 7(1) disposal memorandums require authenticated Aadhaar e-Sign validity.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Interactive Split Workstation */}
      <div id="examination-queue" className={`relative ${!isVerified ? "pointer-events-none select-none opacity-50 filter " : ""}`}>
        <OfficerWorkspace />
      </div>

      {/* Statutory Duty Advisory */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2.5">
          <span className="text-base"><IcInfo className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
          <span>
            <strong>Section 6(3) Transfer Rule:</strong> If requested records concern another public authority, the petition must be transferred within 5 statutory days with citizen intimation.
          </span>
        </div>
        <span className="font-mono text-purple-600 dark:text-purple-400 font-bold shrink-0">
          Act 22 of 2005
        </span>
      </div>

      {/* DIGILOCKER VERIFICATION MODAL */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1a2330] border border-slate-200 dark:border-white/20 p-6 shadow-2xl space-y-5 text-slate-900 dark:text-white"
            >
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      DigiLocker Officer e-KYC
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      MeitY Digital Identity Gateway • GOI
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowVerifyModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Step 1: Officer Identity Overview */}
              {verifyStep === 1 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Designated Officer:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{officerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Official Department:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{deptName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Service / Employee ID:</span>
                      <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{empId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Linked Aadhaar:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">XXXX-XXXX-8821</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    A secure 6-digit one-time password (OTP) will be simulated and sent to your registered Aadhaar mobile number to authenticate Section 5(1) public officer credentials.
                  </p>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowVerifyModal(false)}
                      className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-6 py-2.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Send Aadhaar OTP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Enter OTP */}
              {verifyStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-800 dark:text-purple-300">
                    OTP sent to Aadhaar-linked mobile (<strong>+91 •••••••821</strong>). For development sandbox verification, enter <strong>482910</strong>.
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">
                      Enter 6-digit Aadhaar OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="482910"
                      className="w-full tracking-widest text-center text-lg font-mono font-black py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => setVerifyStep(1)}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={verifying}
                      className="px-6 py-2.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      {verifying ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying Identity...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm & Unlock Workstation</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Success Confirmation */}
              {verifyStep === 3 && (
                <div className="py-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    DigiLocker Verified Successfully!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your Section 5(1) Public Information Officer authorization is validated. Workstation unlocked.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
