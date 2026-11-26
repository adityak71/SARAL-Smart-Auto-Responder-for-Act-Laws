"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { officerProfileData } from "@/data/profileData";
import { KeyRound as IcKeyRound, Landmark as IcLandmark, LockKeyhole as IcLockKeyhole, RefreshCw as IcRefreshCw, Scale as IcScale, Shield as IcShield, Star as IcStar, Timer as IcTimer } from "lucide-react";

export default function OfficerProfileView({ user, isEditing }) {
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadOfficerStats() {
      try {
        const res = await fetch("/api/dashboard/stats?role=OFFICER");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.stats && isMounted) {
            setLiveStats(data.stats);
          }
        }
      } catch (err) {
        console.warn("Officer stats fetch error:", err);
      }
    }
    loadOfficerStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalAssigned = liveStats?.assignedApplications ?? officerProfileData.performanceMetrics.totalAssigned;
  const dispatchedCount = liveStats?.dispatchedToday ?? officerProfileData.performanceMetrics.disposedOnTime;
  const complianceScore = liveStats?.complianceRatio || officerProfileData.performanceMetrics.complianceScore;

  const stats = [
    {
      label: "Total RTIs Assigned",
      val: totalAssigned,
      sub: user?.officerProfile?.divisionLocation || "Departmental Jurisdiction",
      icon: <IcScale className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Disposed / Dispatched",
      val: dispatchedCount,
      sub: "Digitally certified responses",
      icon: <IcShield className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Average Turnaround",
      val: officerProfileData.performanceMetrics.avgDisposalDays,
      sub: "Statutory ceiling: 30 Days",
      icon: <IcTimer className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      label: "Compliance Rating",
      val: complianceScore,
      sub: "State Information Commission Score",
      icon: <IcStar className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-2xl p-4 sm:p-5 border  bg-white/70 dark:bg-[#1d2733]/70 shadow-sm ${stat.bg}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl">{stat.icon}</span>
              <span className={`text-2xl sm:text-3xl font-black ${stat.color}`}>{stat.val}</span>
            </div>
            <h4 className="mt-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">{stat.label}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Official Gazetted Dossier */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Official Cadre & Public Authority */}
          <div className="rounded-3xl bg-white/80 dark:bg-[#1d2733]/80 border border-slate-200 dark:border-white/10 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600/15 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-sm">
                  <IcLandmark className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Public Authority & Service Cadre</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Designated gazetted authority under Section 5(1)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                Class-I Gazetted
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Officer Name</label>
                <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                  {user?.fullName || officerProfileData.official.fullName}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Government Employee Code</label>
                <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-purple-700 dark:text-purple-300 font-mono font-bold">
                  {user?.officerProfile?.employeeId || officerProfileData.official.employeeId}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Designated Role</label>
                <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                  {user?.officerProfile?.designation || officerProfileData.official.designation}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Public Authority / Department</label>
                <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                  {user?.officerProfile?.department?.name || officerProfileData.statutoryRole.publicAuthority}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Administrative Ministry</label>
                <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                  {officerProfileData.statutoryRole.ministry}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Nodal Office Location</label>
                <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                  {user?.officerProfile?.officeLocation || officerProfileData.statutoryRole.officeLocation}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Jurisdiction & Section 19(1) Appellate Hierarchy */}
          <div className="rounded-3xl bg-white/80 dark:bg-[#1d2733]/80 border border-slate-200 dark:border-white/10 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-600/15 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 flex items-center justify-center font-bold text-sm">
                  <IcScale className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Statutory Powers & Appellate Channel</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Jurisdictional coverage under RTI Act Section 5(1) & 6(3)</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Assigned Works & Territorial Jurisdiction</label>
                <div className="space-y-1.5">
                  {officerProfileData.jurisdictionWards.map((w, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span className="text-purple-600 dark:text-purple-400 font-bold">✓</span>
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">First Appellate Authority (FAA)</label>
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/30 flex items-center justify-between">
                  <div>
                    <strong className="block text-purple-900 dark:text-purple-200 font-bold">{officerProfileData.statutoryRole.firstAppellateAuthority}</strong>
                    <span className="text-xs text-purple-700 dark:text-purple-300/80">{officerProfileData.statutoryRole.faaContact}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-600 text-white">
                    Section 19(1)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: DSC Security & Quick Workbench */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 3: Digital Signature Certificate (DSC) Token */}
          <div className="rounded-3xl bg-indigo-500/10 dark:bg-indigo-950/30 dark:via-[#1d2733]/80 border border-indigo-500/30 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-indigo-500/20 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl"><IcLockKeyhole className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
                <div>
                  <h3 className="text-sm font-extrabold text-indigo-900 dark:text-indigo-300 tracking-wider">
                    Digital Signature (DSC)
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Class-3 Signing Authority</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-500 text-white shadow-sm">
                Token Active
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">DSC Certificate ID:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{officerProfileData.credentials.dscTokenId}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">Validation Status:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{officerProfileData.credentials.dscStatus}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">Validity Expiration:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{officerProfileData.credentials.dscExpiry}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">Govt Intranet Subnet:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{officerProfileData.credentials.govIntranetIp}</span>
              </div>

              <div className="pt-2">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-300 leading-relaxed">
                  ✓ Official PIO response memos and Section 6(3) transfer orders are digitally sealed with cryptographic verification.
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Quick Officer Actions */}
          <div className="rounded-3xl bg-white/80 dark:bg-[#1d2733]/80 border border-slate-200 dark:border-white/10 p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-3">PIO Quick Actions</h3>

            <div className="space-y-2.5">
              <Link
                href="/dashboard"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition shadow-md"
              >
                <span>Go to PIO Review Queue</span>
                <span>→</span>
              </Link>

              <button
                type="button"
                onClick={() => alert("Connecting to MP-SWAN e-Office Server...")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer"
              >
                <span>Synchronize e-Office Records</span>
                <span><IcRefreshCw className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
              </button>

              <button
                type="button"
                onClick={() => alert("Testing DSC hardware token... Status: Valid & Connected.")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer"
              >
                <span>Test DSC Hardware Key</span>
                <span><IcKeyRound className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
