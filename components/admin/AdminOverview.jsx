"use client";

import { motion } from "framer-motion";
import { FileText as IcFileText, Shield as IcShield, Timer as IcTimer, Users as IcUsers } from "lucide-react";

export default function AdminOverview({ stats, isLoading }) {
  const currentStats = stats || {
    totalUsers: 0,
    totalRtis: 0,
    verifiedUsers: 0,
    pendingRequests: 0,
    statusBreakdown: {
      submitted: 0,
      inProgress: 0,
      responded: 0,
    },
    monthlyApplications: [
      { month: "Jan", count: 0 },
      { month: "Feb", count: 0 },
      { month: "Mar", count: 0 },
      { month: "Apr", count: 0 },
      { month: "May", count: 0 },
      { month: "Jun", count: 0 },
    ],
  };

  const highestMonthly = Math.max(...(currentStats.monthlyApplications?.map((item) => item.count) || [0]), 5);
  const maxMonthly = Math.ceil(highestMonthly / 5) * 5;

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* 1. Main Admin Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#16262d] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm dark:shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              SARAL Admin Dashboard
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Centralized administrative statistics & platform synchronization
            </p>
          </div>
          <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            Admin
          </span>
        </div>

        {/* 4 Stat Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* Total Users */}
          <div className="space-y-2">
            <div className="text-slate-400 text-lg"><IcUsers className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
              {currentStats.totalUsers.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Users</div>
          </div>

          {/* Total RTI Applications */}
          <div className="space-y-2">
            <div className="text-slate-400 text-lg"><IcFileText className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
              {currentStats.totalRtis.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total RTI Applications</div>
          </div>

          {/* Verified Users */}
          <div className="space-y-2">
            <div className="text-slate-400 text-lg"><IcShield className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
              {currentStats.verifiedUsers.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified Users</div>
          </div>

          {/* Pending Requests */}
          <div className="space-y-2">
            <div className="text-slate-400 text-lg"><IcTimer className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400 font-mono">
              {currentStats.pendingRequests.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Requests</div>
          </div>
        </div>

        {/* RTI Application Status Progress Bars */}
        <div className="pt-6 border-t border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
            RTI Application Status
          </h3>

          {/* Submitted */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Submitted</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {currentStats.statusBreakdown.submitted}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentStats.totalRtis > 0 ? Math.min(100, (currentStats.statusBreakdown.submitted / currentStats.totalRtis) * 100) : 0}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
          </div>

          {/* In Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">In Progress</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {currentStats.statusBreakdown.inProgress}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentStats.totalRtis > 0 ? Math.min(100, (currentStats.statusBreakdown.inProgress / currentStats.totalRtis) * 100) : 0}%` }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="h-full bg-amber-500 rounded-full"
              />
            </div>
          </div>

          {/* Responded / Closed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Responded / Closed</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {currentStats.statusBreakdown.responded}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentStats.totalRtis > 0 ? Math.min(100, (currentStats.statusBreakdown.responded / currentStats.totalRtis) * 100) : 0}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 pt-2">
            Live metrics synchronized with PostgreSQL central database.
          </p>
        </div>
      </div>

      {/* 2. Monthly RTI Applications Bar Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#16262d] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm dark:shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Monthly RTI Applications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Filing trends across statutory periods
            </p>
          </div>
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
            <span className="px-2 py-0.5 text-slate-700 dark:text-slate-300 text-xs font-semibold">Live 2026</span>
          </div>
        </div>

        {/* CSS Flex Bar Chart */}
        <div className="pt-4">
          <div className="relative h-64 w-full flex items-end gap-3 sm:gap-6 border-b border-slate-200 dark:border-white/10 pb-2">
            {/* Y-Axis Guide Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-xs text-slate-400 dark:text-slate-500 font-mono pr-2">
              <div className="border-b border-slate-100 dark:border-white/5 w-full flex justify-between"><span>{maxMonthly}</span></div>
              <div className="border-b border-slate-100 dark:border-white/5 w-full flex justify-between"><span>{Math.round(maxMonthly * 0.75)}</span></div>
              <div className="border-b border-slate-100 dark:border-white/5 w-full flex justify-between"><span>{Math.round(maxMonthly * 0.5)}</span></div>
              <div className="border-b border-slate-100 dark:border-white/5 w-full flex justify-between"><span>{Math.round(maxMonthly * 0.25)}</span></div>
              <div className="border-b border-slate-200 dark:border-white/10 w-full flex justify-between"><span>0</span></div>
            </div>

            {/* Bars for Months */}
            <div className="w-full h-full flex items-end justify-around gap-2 sm:gap-6 z-10 pl-6">
              {currentStats.monthlyApplications.map((item, index) => {
                const heightPercentage = maxMonthly > 0 ? Math.round((item.count / maxMonthly) * 100) : 0;
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Hover Count Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono font-bold text-blue-600 dark:text-cyan-300 bg-blue-50 dark:bg-cyan-950/80 px-2 py-0.5 rounded border border-blue-200 dark:border-cyan-500/30 shadow-sm">
                      {item.count}
                    </div>

                    {/* Blue Pill Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(item.count > 0 ? 8 : 2, heightPercentage)}%` }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="w-full max-w-[56px] bg-blue-600 dark:bg-[#1e4e8c] hover:bg-blue-700 dark:hover:bg-[#2563eb] rounded-xl transition-colors cursor-pointer"
                    />

                    {/* Month Label */}
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
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
