"use client";

import { motion } from "framer-motion";

export default function AdminOverview({ stats, isLoading }) {
  const currentStats = stats || {
    totalUsers: 2450,
    totalRtis: 1280,
    verifiedUsers: 1850,
    pendingRequests: 125,
    statusBreakdown: {
      submitted: 780,
      inProgress: 320,
      responded: 180,
    },
    monthlyApplications: [
      { month: "Jan", count: 120 },
      { month: "Feb", count: 180 },
      { month: "Mar", count: 150 },
      { month: "Apr", count: 240 },
      { month: "May", count: 210 },
      { month: "Jun", count: 295 },
    ],
  };

  const maxMonthly = 320;

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* 1. Main Admin Overview Card matching Screenshot 1 */}
      <div className="p-6 sm:p-8 rounded-3xl bg-black/90 dark:bg-[#0b0422] border border-white/10 text-white shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              SARAL Admin Dashboard
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Illustrative dashboard layout
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            Admin
          </span>
        </div>

        {/* 4 Stat Metric Cards matching Screenshot 1 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* Total Users */}
          <div className="space-y-2">
            <div className="text-slate-400 text-lg">👥</div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
              {currentStats.totalUsers.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 font-medium">Total Users</div>
          </div>

          {/* Total RTI Applications */}
          <div className="space-y-2">
            <div className="text-slate-400 text-lg">📄</div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
              {currentStats.totalRtis.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 font-medium">Total RTI Applications</div>
          </div>

          {/* Verified Users */}
          <div className="space-y-2">
            <div className="text-slate-400 text-lg">🛡️</div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
              {currentStats.verifiedUsers.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 font-medium">Verified Users</div>
          </div>

          {/* Pending Requests */}
          <div className="space-y-2">
            <div className="text-slate-400 text-lg">⏱️</div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
              {currentStats.pendingRequests.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 font-medium">Pending Requests</div>
          </div>
        </div>

        {/* RTI Application Status Progress Bars matching Screenshot 1 */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-wide">
            RTI Application Status
          </h3>

          {/* Submitted */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Submitted</span>
              <span className="font-mono font-bold text-white">
                {currentStats.statusBreakdown.submitted}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (currentStats.statusBreakdown.submitted / currentStats.totalRtis) * 100)}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
          </div>

          {/* In Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">In Progress</span>
              <span className="font-mono font-bold text-white">
                {currentStats.statusBreakdown.inProgress}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (currentStats.statusBreakdown.inProgress / currentStats.totalRtis) * 100)}%` }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="h-full bg-amber-500 rounded-full"
              />
            </div>
          </div>

          {/* Responded / Closed */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Responded / Closed</span>
              <span className="font-mono font-bold text-white">
                {currentStats.statusBreakdown.responded}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (currentStats.statusBreakdown.responded / currentStats.totalRtis) * 100)}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-2 italic">
            All figures are sample data, not live SARAL statistics. Admin ko login karte hi ye information milni chahiye.
          </p>
        </div>
      </div>

      {/* 2. Monthly RTI Applications Bar Chart matching Screenshot 2 */}
      <div className="p-6 sm:p-8 rounded-3xl bg-black/90 dark:bg-[#0b0422] border border-white/10 text-white shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
              Illustrative monthly RTI applications
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Sample figures to demonstrate admin analytics.
            </p>
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <span className="px-2 py-0.5 text-slate-300 text-[11px]">H1 2026</span>
          </div>
        </div>

        {/* CSS Flex Bar Chart */}
        <div className="pt-4">
          <div className="relative h-64 w-full flex items-end gap-3 sm:gap-6 border-b border-white/10 pb-2">
            {/* Y-Axis Guide Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-500 font-mono pr-2">
              <div className="border-b border-white/5 w-full flex justify-between"><span>320</span></div>
              <div className="border-b border-white/5 w-full flex justify-between"><span>240</span></div>
              <div className="border-b border-white/5 w-full flex justify-between"><span>160</span></div>
              <div className="border-b border-white/5 w-full flex justify-between"><span>80</span></div>
              <div className="border-b border-white/10 w-full flex justify-between"><span>0</span></div>
            </div>

            {/* Bars for Jan - Jun matching Screenshot 2 */}
            <div className="w-full h-full flex items-end justify-around gap-2 sm:gap-6 z-10 pl-6">
              {currentStats.monthlyApplications.map((item, index) => {
                const heightPercentage = Math.round((item.count / maxMonthly) * 100);
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Hover Count Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                      {item.count}
                    </div>

                    {/* Blue Pill Bar matching Screenshot 2 */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercentage}%` }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="w-full max-w-[56px] bg-[#1e4e8c] hover:bg-[#2563eb] rounded-xl transition-colors cursor-pointer"
                    />

                    {/* Month Label */}
                    <span className="text-xs text-slate-400 font-medium mt-1">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
