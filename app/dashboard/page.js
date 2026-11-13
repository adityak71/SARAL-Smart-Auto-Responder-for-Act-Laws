"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import CitizenDashboard from "@/components/dashboard/CitizenDashboard";
import OfficerDashboard from "@/components/dashboard/OfficerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Determine user's actual authorized role
  const userRole = (user?.role || "CITIZEN").toUpperCase();

  // For Admin role: allows previewing Officer and Citizen views
  const [adminViewMode, setAdminViewMode] = useState("ADMIN"); // "ADMIN" | "OFFICER" | "CITIZEN"

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Sync admin view mode with logged in role
  useEffect(() => {
    if (userRole === "ADMIN") {
      setAdminViewMode("ADMIN");
    }
  }, [userRole]);

  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-slate-50 dark:bg-[#08031d] flex flex-col items-center justify-center p-6 text-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-300 text-xl font-bold mb-3 animate-spin">
          ⚡
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Verifying Identity & Role Permissions...
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Redirecting to Citizen, Officer, or Admin sign in...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-[#08031d] text-slate-800 dark:text-slate-100 flex flex-col antialiased transition-colors">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-6">
        {/* Admin Multi-Role Supervisory Switcher Bar (Visible only to ADMIN) */}
        {userRole === "ADMIN" && (
          <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 via-slate-900/50 to-indigo-900/30 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                Admin Role View Controller:
              </span>
              <span className="text-xs text-slate-400 hidden md:inline">
                (Logged in as Master Administrator)
              </span>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/10 w-fit">
              <button
                type="button"
                onClick={() => setAdminViewMode("ADMIN")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  adminViewMode === "ADMIN"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Superadmin Central
              </button>
              <button
                type="button"
                onClick={() => setAdminViewMode("OFFICER")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  adminViewMode === "OFFICER"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Preview Officer PIO Desk
              </button>
              <button
                type="button"
                onClick={() => setAdminViewMode("CITIZEN")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  adminViewMode === "CITIZEN"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Preview Citizen View
              </button>
            </div>
          </div>
        )}

        {/* Dynamic RBAC Dashboard Rendering */}
        {userRole === "ADMIN" ? (
          // Admin can switch between Admin Console, Officer Review, and Citizen View
          adminViewMode === "ADMIN" ? (
            <AdminDashboard user={user} />
          ) : adminViewMode === "OFFICER" ? (
            <OfficerDashboard user={user} />
          ) : (
            <CitizenDashboard user={user} />
          )
        ) : userRole === "OFFICER" ? (
          // Designated Officer strictly accesses Officer Workspace
          <OfficerDashboard user={user} />
        ) : (
          // Citizen strictly accesses Citizen Workspace
          <CitizenDashboard user={user} />
        )}
      </main>
    </div>
  );
}
