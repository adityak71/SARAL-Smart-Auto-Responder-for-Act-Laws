"use client";

import { useEffect, useState } from "react";
import { citizenDashboardStats } from "@/data/dashboardData";

export default function CitizenOverview() {
  const [liveStats, setLiveStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats?role=CITIZEN");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.stats && isMounted) {
            setLiveStats(data.stats);
          }
        }
      } catch (err) {
        console.warn("Using fallback dashboard metrics:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const statsSource = liveStats || {
    activeFilings: 0,
    resolvedFilings: 0,
    appealsPending: 0,
    averageResponseDays: 0,
  };

  const stats = [
    {
      label: "Active In-Review",
      value: statsSource.activeFilings ?? 0,
      subtext: "Currently under PIO examination",
      color: "amber",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    {
      label: "Completed Responses",
      value: statsSource.resolvedFilings ?? 0,
      subtext: "Certified documents available",
      color: "emerald",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      label: "First Appeals",
      value: statsSource.appealsPending ?? 0,
      subtext: "Section 19(1) window active",
      color: "rose",
      badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    },
    {
      label: "Average Turnaround",
      value: statsSource.averageResponseDays ? `${statsSource.averageResponseDays} Days` : "30-Day Mandate",
      subtext: "Statutory Section 7(1) clock",
      color: "purple",
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
  ];

  return (
    <div className="w-full">
      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-2xl bg-white dark:bg-[#1a2330] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-md flex flex-col gap-2 text-slate-800 dark:text-slate-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {stat.label}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              {isLoading ? (
                <div className="h-8 w-12 bg-slate-200 dark:bg-white/10 rounded" />
              ) : (
                stat.value
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {stat.subtext}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
