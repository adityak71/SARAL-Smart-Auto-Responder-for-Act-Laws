"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import CitizenOverview from "@/components/dashboard/CitizenOverview";
import ApplicationListTable from "@/components/dashboard/ApplicationListTable";
import OfficerWorkspace from "@/components/dashboard/OfficerWorkspace";

export default function DashboardPage() {
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [activeTab, setActiveTab] = useState("citizen"); // "citizen" | "officer"

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-slate-50 dark:bg-[#08031d] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Redirecting to Citizen & Officer Login...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-[#08031d] text-slate-800 dark:text-slate-100 flex flex-col antialiased transition-colors">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
        {/* Top View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {activeTab === "citizen" ? "Citizen RTI Dashboard" : "Public Information Officer (PIO) Desk"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activeTab === "citizen"
                ? "Manage your submitted inquiries, tracking milestones, and certified responses"
                : "Scrutinize incoming petitions, review AI archive drafts, and issue certified approvals"}
            </p>
          </div>

          {/* Segmented Switcher Pill */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 w-fit">
            <button
              type="button"
              onClick={() => setActiveTab("citizen")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === "citizen"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Citizen View
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("officer")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === "officer"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Officer Review Desk
            </button>
          </div>
        </div>

        {/* View Switch Rendering */}
        {activeTab === "citizen" ? (
          <div className="space-y-8">
            <CitizenOverview />
            <ApplicationListTable />
          </div>
        ) : (
          <OfficerWorkspace />
        )}
      </main>
    </div>
  );
}
