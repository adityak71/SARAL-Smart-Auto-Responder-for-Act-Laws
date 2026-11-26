"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList as IcClipboardList, Landmark as IcLandmark, Scale as IcScale, Shield as IcShield } from "lucide-react";

export default function ProfileHero({ user, role, onEditToggle, isEditing }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const normalizedRole = (role || user?.role || "CITIZEN").toUpperCase();

  const roleConfig = {
    CITIZEN: {
      badge: "DigiLocker Verified Citizen",
      badgeColor: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/30",
      icon: <IcShield className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
      refLabel: "SARAL Citizen ID",
      refId: user?.citizenProfile?.digiLockerId || "DL-IND-90218821",
      subtitle: "Rural Panchayat Jurisdiction • Hoshangabad, MP",
      dossierName: "SARAL_Citizen_Dossier.pdf",
    },
    OFFICER: {
      badge: "Section 5(1) Designated PIO",
      badgeColor: "bg-purple-500/15 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border-purple-500/30",
      icon: <IcScale className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
      refLabel: "Officer Service ID",
      refId: user?.officerProfile?.employeeId || "EMP-MP-PWD-4091",
      subtitle: "Public Works Department • Division II, Pipariya",
      dossierName: "PIO_Statutory_Credentials.pdf",
    },
    ADMIN: {
      badge: "Central Comptroller & Superadmin",
      badgeColor: "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/30",
      icon: <IcLandmark className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
      refLabel: "Admin Clearance Node",
      refId: "ADM-CENTRAL-001",
      subtitle: "National Transparency Innovation Hub • New Delhi",
      dossierName: "System_Comptroller_Audit.pdf",
    },
  }[normalizedRole] || {
    badge: "Verified Member",
    badgeColor: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
    icon: "✓",
    refLabel: "User ID",
    refId: user?.id?.slice(0, 8) || "SARAL-USER",
    subtitle: "SARAL RTI Platform",
    dossierName: "User_Profile.pdf",
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(roleConfig.refId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Downloaded official dossier: ${roleConfig.dossierName}`);
    }, 1200);
  };

  return (
    <div className="relative rounded-3xl bg-white/90 dark:bg-[#1d2733]/90 border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xl overflow-hidden">

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Avatar + Identity Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative group shrink-0">
            <img
              src={
                user?.avatarUrl ||
                (normalizedRole === "OFFICER"
                  ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256"
                  : normalizedRole === "ADMIN"
                  ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256"
                  : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256")
              }
              alt={user?.fullName || "User Avatar"}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-purple-500/40 shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#1d2733] flex items-center justify-center text-xs text-white font-bold">
              ✓
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {user?.fullName || (normalizedRole === "OFFICER" ? "Er. Rameshwar Verma" : normalizedRole === "ADMIN" ? "Central Administrator" : "Rahul Sharma")}
              </h1>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${roleConfig.badgeColor}`}>
                <span>{roleConfig.icon}</span>
                <span>{roleConfig.badge}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {roleConfig.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {user?.email || (normalizedRole === "OFFICER" ? "er.rameshwar@mp.gov.in" : normalizedRole === "ADMIN" ? "admin@saral.gov.in" : "rahul.sharma@citizen.in")}
              </span>

              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {user?.phone || "+91 98260-12345"}
              </span>

              {/* Reference ID Pill */}
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-mono text-xs transition cursor-pointer"
                title="Click to copy identifier"
              >
                <span className="text-slate-400 font-sans">{roleConfig.refLabel}:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{roleConfig.refId}</span>
                <span className="text-xs text-slate-400">{copied ? "✓ Copied" : <IcClipboardList className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onEditToggle}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              isEditing
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md "
                : "bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10"
            }`}
          >
            <span>{isEditing ? "Save Profile" : "Edit Details"}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{downloading ? "Generating..." : "Export Dossier"}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
