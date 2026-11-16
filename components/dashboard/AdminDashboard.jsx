"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/redux/slices/authSlice";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminOverview from "@/components/admin/AdminOverview";
import OfficerManagement from "@/components/admin/OfficerManagement";
import UserManagement from "@/components/admin/UserManagement";
import RtiManagement from "@/components/admin/RtiManagement";
import SupportManagement from "@/components/admin/SupportManagement";
import SystemManagement from "@/components/admin/SystemManagement";

import {
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const TAB_BREADCRUMBS = {
  dashboard: { group: "Overview", label: "Dashboard" },
  users: { group: "USER MANAGEMENT", label: "Users" },
  "identity-verification": { group: "USER MANAGEMENT", label: "Identity Verification" },
  "all-officers": { group: "OFFICER MANAGEMENT", label: "All Officers" },
  "create-officer": { group: "OFFICER MANAGEMENT", label: "Create Officer" },
  "all-rtis": { group: "RTI MANAGEMENT", label: "All RTI Applications" },
  departments: { group: "RTI MANAGEMENT", label: "Departments" },
  complaints: { group: "SUPPORT MANAGEMENT", label: "Complaints" },
  notifications: { group: "SUPPORT MANAGEMENT", label: "Notifications" },
  "content-faqs": { group: "SUPPORT MANAGEMENT", label: "Content & FAQs" },
  analytics: { group: "SYSTEM MANAGEMENT", label: "Analytics" },
  "audit-logs": { group: "SYSTEM MANAGEMENT", label: "Audit Logs" },
  settings: { group: "SYSTEM MANAGEMENT", label: "Settings" },
};

export default function AdminDashboard({ user }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Load stats from API
  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.warn("Failed to fetch admin stats:", err);
      } finally {
        setLoadingStats(false);
      }
    }
    loadStats();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.warn("Logout error:", err);
    }
    dispatch(logout());
    router.push("/login");
    router.refresh();
  };

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const breadcrumb = TAB_BREADCRUMBS[activeTab] || { group: "ADMIN", label: activeTab };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 items-start animate-fadeIn">
      {/* Mobile Sidebar Drawer Toggle */}
      <div className="w-full lg:hidden flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#0c0524] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">SARAL Admin Panel</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition text-slate-700 dark:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full lg:hidden overflow-hidden z-40"
          >
            <AdminSidebar
              activeTab={activeTab}
              onSelectTab={handleSelectTab}
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Persistent Sidebar (matching Screenshot 3 & 7) */}
      <div className="hidden lg:block lg:sticky lg:top-24 shrink-0 self-start">
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Administrative Workspace */}
      <div className="flex-1 w-full space-y-6 min-w-0">
        {/* Top Control Header */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0c0524] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="uppercase tracking-wider">{breadcrumb.group}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span className="text-slate-900 dark:text-white font-bold">{breadcrumb.label}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span>{breadcrumb.label}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                Admin
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/30 text-xs font-medium text-purple-700 dark:text-purple-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Section 6(1) RTI Act 2005 Enforced</span>
            </div>
            <div className="text-xs text-right hidden sm:block">
              <p className="font-bold text-slate-900 dark:text-white">
                {user?.fullName || "SARAL Superadmin"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">admin@saral.gov.in</p>
            </div>
          </div>
        </div>

        {/* Dynamic Content Views with key for fresh subtab sync */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="w-full"
          >
            {/* Tab: Dashboard Overview */}
            {activeTab === "dashboard" && (
              <AdminOverview stats={stats} isLoading={loadingStats} />
            )}

            {/* Tab: Users */}
            {activeTab === "users" && (
              <UserManagement key="users-tab" initialSubTab="users" />
            )}

            {/* Tab: Identity Verification */}
            {activeTab === "identity-verification" && (
              <UserManagement key="verification-tab" initialSubTab="verification" />
            )}

            {/* Tab: All Officers */}
            {activeTab === "all-officers" && (
              <OfficerManagement
                key="officers-list-tab"
                openCreateDirectly={false}
                onNavigateToCreate={() => setActiveTab("create-officer")}
              />
            )}

            {/* Tab: Create Officer */}
            {activeTab === "create-officer" && (
              <OfficerManagement
                key="officers-create-tab"
                openCreateDirectly={true}
                onNavigateToCreate={() => setActiveTab("create-officer")}
              />
            )}

            {/* Tab: All RTIs */}
            {activeTab === "all-rtis" && (
              <RtiManagement key="rtis-tab" initialSubTab="rtis" />
            )}

            {/* Tab: Departments */}
            {activeTab === "departments" && (
              <RtiManagement key="departments-tab" initialSubTab="departments" />
            )}

            {/* Tab: Complaints */}
            {activeTab === "complaints" && (
              <SupportManagement key="complaints-tab" initialSubTab="complaints" />
            )}

            {/* Tab: Notifications */}
            {activeTab === "notifications" && (
              <SupportManagement key="notifications-tab" initialSubTab="notifications" />
            )}

            {/* Tab: Content & FAQs */}
            {activeTab === "content-faqs" && (
              <SupportManagement key="content-tab" initialSubTab="content" />
            )}

            {/* Tab: Analytics */}
            {activeTab === "analytics" && (
              <SystemManagement key="analytics-tab" initialSubTab="analytics" />
            )}

            {/* Tab: Audit Logs */}
            {activeTab === "audit-logs" && (
              <SystemManagement key="audit-tab" initialSubTab="audit" />
            )}

            {/* Tab: Settings */}
            {activeTab === "settings" && (
              <SystemManagement key="settings-tab" initialSubTab="settings" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
