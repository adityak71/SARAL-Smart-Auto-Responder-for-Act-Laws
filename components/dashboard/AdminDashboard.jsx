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
  Menu as FiMenu,
  X as FiX,
  Shield as FiShield,
  UserCheck as FiUserCheck,
  FileText as FiFileText,
  Grid as FiGrid,
  ChevronRight as FiChevronRight,
} from "lucide-react";

const TAB_BREADCRUMBS = {
  dashboard: { group: "Overview", label: "Dashboard Analytics" },
  users: { group: "User Management", label: "Registered Citizens" },
  "identity-verification": { group: "User Management", label: "DigiLocker Identity Verification" },
  "all-officers": { group: "Officer Management", label: "Departmental Public Information Officers" },
  "create-officer": { group: "Officer Management", label: "Register New Officer" },
  "all-rtis": { group: "RTI Management", label: "All RTI Applications Ledger" },
  departments: { group: "RTI Management", label: "Ministries & Departments Directory" },
  complaints: { group: "Support Management", label: "Citizen Grievances & Resolution" },
  notifications: { group: "Support Management", label: "Broadcast Announcements" },
  "content-faqs": { group: "Support Management", label: "Knowledgebase & Filing FAQs" },
  analytics: { group: "System Management", label: "Analytics & Statutory Reports" },
  "audit-logs": { group: "System Management", label: "Central Audit Trail" },
  settings: { group: "System Management", label: "Platform Governance & Security" },
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

  const breadcrumb = TAB_BREADCRUMBS[activeTab] || { group: "Admin", label: activeTab };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 items-start animate-fadeIn">
      {/* Mobile Sidebar Drawer Toggle */}
      <div className="w-full lg:hidden flex items-center justify-between p-4 rounded-2xl bg-slate-900 text-white border border-white/10 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm tracking-tight">SARAL Admin Console</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition text-white"
        >
          {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
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
      <div className="hidden lg:block lg:sticky lg:top-24 shrink-0">
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Administrative Workspace */}
      <div className="flex-1 w-full space-y-6 min-w-0">
        {/* Top Control Header */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0c0424] border border-slate-200 dark:border-purple-500/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>{breadcrumb.group}</span>
              <FiChevronRight className="text-xs text-slate-400" />
              <span className="text-purple-600 dark:text-purple-400 font-bold">
                {breadcrumb.label}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span>{breadcrumb.label}</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
                Admin
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-700 dark:text-purple-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              CIC Section 6(1) Enforced
            </div>
            <div className="text-xs text-right hidden sm:block">
              <p className="font-bold text-slate-900 dark:text-white">
                {user?.fullName || "SARAL Superadmin"}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">admin@saral.gov.in</p>
            </div>
          </div>
        </div>

        {/* Dynamic Content Views */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {/* Tab: Dashboard Overview */}
            {activeTab === "dashboard" && (
              <AdminOverview stats={stats} isLoading={loadingStats} />
            )}

            {/* Tab: Users */}
            {activeTab === "users" && <UserManagement initialSubTab="users" />}

            {/* Tab: Identity Verification */}
            {activeTab === "identity-verification" && (
              <UserManagement initialSubTab="verification" />
            )}

            {/* Tab: All Officers */}
            {activeTab === "all-officers" && (
              <OfficerManagement
                openCreateDirectly={false}
                onNavigateToCreate={() => setActiveTab("create-officer")}
              />
            )}

            {/* Tab: Create Officer */}
            {activeTab === "create-officer" && (
              <OfficerManagement
                openCreateDirectly={true}
                onNavigateToCreate={() => setActiveTab("create-officer")}
              />
            )}

            {/* Tab: All RTIs */}
            {activeTab === "all-rtis" && <RtiManagement initialSubTab="rtis" />}

            {/* Tab: Departments */}
            {activeTab === "departments" && (
              <RtiManagement initialSubTab="departments" />
            )}

            {/* Tab: Complaints */}
            {activeTab === "complaints" && (
              <SupportManagement initialSubTab="complaints" />
            )}

            {/* Tab: Notifications */}
            {activeTab === "notifications" && (
              <SupportManagement initialSubTab="notifications" />
            )}

            {/* Tab: Content & FAQs */}
            {activeTab === "content-faqs" && (
              <SupportManagement initialSubTab="content" />
            )}

            {/* Tab: Analytics */}
            {activeTab === "analytics" && (
              <SystemManagement initialSubTab="analytics" />
            )}

            {/* Tab: Audit Logs */}
            {activeTab === "audit-logs" && (
              <SystemManagement initialSubTab="audit" />
            )}

            {/* Tab: Settings */}
            {activeTab === "settings" && (
              <SystemManagement initialSubTab="settings" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
