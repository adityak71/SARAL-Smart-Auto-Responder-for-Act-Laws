"use client";

import { useEffect, useState } from "react";
import { citizenDashboardStats } from "@/data/dashboardData";
import { Hourglass as IcHourglass, CheckCheck as IcCheckCheck, TriangleAlert as IcAlert, Zap as IcZap } from "lucide-react";

// Stitch screen 2 stat cards: label, a 32px icon tile at top right, a serif figure and a caption
const ICON = { amber: IcHourglass, emerald: IcCheckCheck, rose: IcAlert, purple: IcZap };
const TILE = {
  amber: "bg-slate-100 text-purple-900 dark:bg-white/10 dark:text-purple-200",
  emerald: "bg-slate-100 text-purple-900 dark:bg-white/10 dark:text-purple-200",
  rose: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300",
  purple: "bg-slate-100 text-cyan-700 dark:bg-white/10 dark:text-cyan-300",
};

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
        {stats.map((stat) => {
          const Icon = ICON[stat.color];
          return (
          <div
            key={stat.label}
            className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#16262d] border border-slate-300/40 dark:border-white/10 shadow-sm flex flex-col gap-3 text-slate-800 dark:text-slate-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300">
                {stat.label}
              </span>
              <span className={`shrink-0 w-8 h-8 rounded-sm flex items-center justify-center ${TILE[stat.color]}`}>
                <Icon className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              </span>
            </div>
            <div className="font-display text-[28px] leading-9 sm:text-4xl sm:leading-10 font-black text-purple-900 dark:text-white flex items-center gap-2">
              {isLoading ? (
                <div className="h-8 w-12 bg-slate-200 dark:bg-white/10 rounded" />
              ) : (
                stat.value
              )}
            </div>
            <p className="text-[13px] leading-5 text-slate-600 dark:text-slate-400">
              {stat.subtext}
            </p>
          </div>
          );
        })}
      </div>
    </div>
  );
}
