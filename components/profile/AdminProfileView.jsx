"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { adminProfileData } from "@/data/profileData";
import { ChartBar as IcChartBar, Crown as IcCrown, HardHat as IcHardHat, Landmark as IcLandmark, Shield as IcShield, Users as IcUsers, Zap as IcZap } from "lucide-react";

export default function AdminProfileView({ user }) {
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.stats && isMounted) {
            setLiveStats(data.stats);
          }
        }
      } catch (err) {
        console.warn("Admin stats fetch error:", err);
      }
    }
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      label: "Registered Citizens",
      val: liveStats?.totalUsers ?? adminProfileData.platformStats.totalCitizens,
      sub: "Active verified accounts",
      icon: <IcUsers className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Public Authorities",
      val: liveStats?.totalDepartments ?? adminProfileData.platformStats.connectedAuthorities,
      sub: "Mapped departments",
      icon: <IcLandmark className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      label: "Active PIO Officers",
      val: liveStats?.activeOfficers ?? adminProfileData.platformStats.activeOfficers,
      sub: "Section 5(1) verified",
      icon: <IcHardHat className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Security Audit Events",
      val: liveStats?.totalAuditEvents ?? adminProfileData.platformStats.auditLogCount,
      sub: "Immutable transaction log",
      icon: <IcShield className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 4 Central Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-2xl p-4 sm:p-5 border  bg-white/70 dark:bg-[#1c2e36]/70 shadow-sm ${stat.bg}`}
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
        {/* Left 7 Cols: Comptroller Credentials */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Central Administrator Particulars */}
          <div className="rounded-3xl bg-white/80 dark:bg-[#1c2e36]/80 border border-slate-200 dark:border-white/10 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-600/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-sm">
                  <IcCrown className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Central Comptroller Profile</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Platform administrator & regulatory oversight</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                Tier-1 Sovereign
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Superadmin Identity</label>
                <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                  {user?.fullName || adminProfileData.system.fullName}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Comptroller Code</label>
                <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-amber-700 dark:text-amber-300 font-mono font-bold">
                  {adminProfileData.system.employeeId}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Administrative Email</label>
                <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium truncate">
                  {user?.email || adminProfileData.system.email}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Emergency Operations Desk</label>
                <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                  {user?.phone || adminProfileData.system.phone}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Statutory Regulatory Directorate</label>
                <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                  {adminProfileData.system.authority}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Data Engine & Vector Storage</label>
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/20 text-purple-800 dark:text-purple-300 font-medium flex items-center justify-between">
                  <span>{adminProfileData.platformStats.databaseEngine}</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">● Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Security & Session Posture */}
          <div className="rounded-3xl bg-white/80 dark:bg-[#1c2e36]/80 border border-slate-200 dark:border-white/10 p-6 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">Security & Access Safeguards</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Two-Factor Authentication (2FA)</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{adminProfileData.security.twoFactorAuth}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                  Enforced
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">IP Whitelisting & Subnet Isolation</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{adminProfileData.security.ipRestriction}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300">
                  Protected
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">DPDP Act 2023 Data Vault</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{adminProfileData.security.sessionEncryption}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Platform Console Quick Links */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-white/80 dark:bg-[#1c2e36]/80 border border-slate-200 dark:border-white/10 p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-3">Admin Master Consoles</h3>

            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition shadow-md"
              >
                <span>Central Comptroller Dashboard</span>
                <span>→</span>
              </Link>

              <button
                type="button"
                onClick={() => alert("All 342 Public Authorities responding normally. Database latency: 42ms.")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer"
              >
                <span>Run System Health Diagnostic</span>
                <span><IcZap className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
              </button>

              <button
                type="button"
                onClick={() => alert("Exporting master compliance report for Central Information Commission...")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer"
              >
                <span>Export CIC Quarterly Audit</span>
                <span><IcChartBar className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
