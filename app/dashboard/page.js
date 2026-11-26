"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import CitizenDashboard from "@/components/dashboard/CitizenDashboard";
import OfficerDashboard from "@/components/dashboard/OfficerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { Zap as IcZap } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Determine user's actual authorized role
  const userRole = (user?.role || "CITIZEN").toUpperCase();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-slate-50 dark:bg-[#0f1a1f] flex flex-col items-center justify-center p-6 text-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-300 text-xl font-bold mb-3 animate-spin">
          <IcZap className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />
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
    <div className="flex-1 w-full bg-slate-50 dark:bg-[#0f1a1f] text-slate-800 dark:text-slate-100 flex flex-col antialiased transition-colors">
      <main className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 ${userRole === "ADMIN" ? "max-w-[1580px]" : "max-w-7xl"}`}>
        {/* Dynamic RBAC Dashboard Rendering */}
        {userRole === "ADMIN" ? (
          <AdminDashboard user={user} />
        ) : userRole === "OFFICER" ? (
          <OfficerDashboard user={user} />
        ) : (
          <CitizenDashboard user={user} />
        )}
      </main>
    </div>
  );
}
