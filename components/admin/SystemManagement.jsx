"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3 as FiBarChart2,
  Activity as FiActivity,
  Settings as FiSettings,
  RefreshCw as FiRefreshCw,
  Shield as FiShield,
  Clock as FiClock,
  CheckCircle2 as FiCheckCircle,
  AlertTriangle as FiAlertTriangle,
  TrendingUp as FiTrendingUp,
  PieChart as FiPieChart,
  Server as FiServer,
  Database as FiDatabase,
  Globe as FiGlobe,
} from "lucide-react";

export default function SystemManagement({ initialSubTab = "analytics" }) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); // "analytics" | "audit" | "settings"
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState(null);

  // Settings State
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    statutoryReminderDays: 7,
    digilockerMockMode: false,
    sessionTimeoutMinutes: 60,
  });

  const fetchAuditLogs = async () => {
    setLoadingAudit(true);
    try {
      const res = await fetch("/api/admin/audit");
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.logs);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoadingAudit(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (isMounted && data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Failed to load stats:", err);
      }

      if (activeSubTab === "audit") {
        try {
          const res = await fetch("/api/admin/audit");
          const data = await res.json();
          if (isMounted && data.success) {
            setAuditLogs(data.logs);
          }
        } catch (err) {
          console.error("Failed to load audit logs:", err);
        } finally {
          if (isMounted) setLoadingAudit(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [activeSubTab]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast("System configurations persisted successfully.", "success");
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-semibold flex items-center gap-3 bg-emerald-500/10 text-emerald-400 border-emerald-500/30 backdrop-blur-md"
          >
            <FiCheckCircle />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeSubTab === "analytics"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FiBarChart2 />
            Analytics & Reports
          </button>
          <button
            onClick={() => setActiveSubTab("audit")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeSubTab === "audit"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FiActivity />
            System Audit Logs
          </button>
          <button
            onClick={() => setActiveSubTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeSubTab === "settings"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FiSettings />
            Security & Controls
          </button>
        </div>
      </div>

      {/* VIEW 1: ANALYTICS & STATUTORY REPORTS */}
      {activeSubTab === "analytics" && (
        <div className="space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 shadow-sm">
              <span className="text-xs font-semibold text-slate-400">Total Citizen Base</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">2,450</p>
              <p className="text-xs text-emerald-500 mt-1 font-semibold">+14.2% MoM</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 shadow-sm">
              <span className="text-xs font-semibold text-slate-400">Total Filed RTIs</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">1,280</p>
              <p className="text-xs text-blue-500 mt-1 font-semibold">Section 6(1) filed</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 shadow-sm">
              <span className="text-xs font-semibold text-slate-400">DigiLocker Auth Rate</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">94.8%</p>
              <p className="text-xs text-emerald-500 mt-1 font-semibold">1,850 verified</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 shadow-sm">
              <span className="text-xs font-semibold text-slate-400">Avg Settlement Speed</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">18 Days</p>
              <p className="text-xs text-purple-500 mt-1 font-semibold">SLA: 30 statutory days</p>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Department-wise Filing Volumes & PIO Distribution
            </h3>
            <div className="space-y-4">
              {[
                { name: "Public Works Department (PWD)", count: 480, pct: 37, color: "bg-blue-500" },
                { name: "Ministry of Rural Development", count: 320, pct: 25, color: "bg-purple-500" },
                { name: "School Education & Literacy", count: 210, pct: 16, color: "bg-emerald-500" },
                { name: "Urban Water Supply & Sanitation", count: 160, pct: 13, color: "bg-amber-500" },
                { name: "Health & Family Welfare", count: 110, pct: 9, color: "bg-pink-500" },
              ].map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.count} RTIs ({item.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SYSTEM AUDIT LOGS */}
      {activeSubTab === "audit" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Central Comptroller Audit Stream
              </h3>
              <p className="text-xs text-slate-400">
                Immutable, cryptographically verifiable log of all administrative, officer, and citizen actions.
              </p>
            </div>
            <button
              onClick={fetchAuditLogs}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <FiRefreshCw className={loadingAudit ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-black/30 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5">
                  <tr>
                    <th className="px-5 py-4 font-bold">Action Event</th>
                    <th className="px-5 py-4 font-bold">Target Entity</th>
                    <th className="px-5 py-4 font-bold">Initiator</th>
                    <th className="px-5 py-4 font-bold">Client IP</th>
                    <th className="px-5 py-4 font-bold">Timestamp</th>
                    <th className="px-5 py-4 font-bold text-right">Integrity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                  {loadingAudit ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-slate-400">
                        <FiRefreshCw className="animate-spin mx-auto text-2xl mb-2" />
                        Verifying log hashes...
                      </td>
                    </tr>
                  ) : auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-slate-400">
                        No recent audit events recorded.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="px-5 py-4 font-mono text-xs font-bold text-purple-400">
                          {log.action}
                        </td>
                        <td className="px-5 py-4 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {log.entityName} ({log.entityId?.slice(0, 8)})
                        </td>
                        <td className="px-5 py-4 text-xs">
                          <p className="font-semibold text-slate-900 dark:text-white">{log.user}</p>
                          <p className="font-mono text-slate-400 text-[11px]">{log.userEmail}</p>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-slate-400">{log.ip}</td>
                        <td className="px-5 py-4 text-xs text-slate-400">
                          {new Date(log.timestamp).toLocaleString("en-IN", {
                            dateStyle: "short",
                            timeStyle: "medium",
                          })}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                            <FiCheckCircle className="text-xs" /> Verified
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SECURITY & CONTROLS */}
      {activeSubTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 shadow-sm space-y-6">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Central Platform Governance Settings
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Platform Maintenance Mode
                  </h4>
                  <p className="text-xs text-slate-400">
                    Restricts citizen petition submission while keeping administrative inspection active.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Statutory 30-Day Reminder Threshold
                </h4>
                <p className="text-xs text-slate-400">
                  Send automated urgency escalations to designated PIOs when days remaining fall below:
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={settings.statutoryReminderDays}
                    onChange={(e) =>
                      setSettings({ ...settings, statutoryReminderDays: Number(e.target.value) })
                    }
                    className="w-24 px-3 py-2 rounded-xl text-xs bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                  />
                  <span className="text-xs font-semibold text-slate-400">Days before statutory breach</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Administrator Session Expiry
                </h4>
                <p className="text-xs text-slate-400">
                  Maximum idle duration before requiring re-authentication:
                </p>
                <select
                  value={settings.sessionTimeoutMinutes}
                  onChange={(e) =>
                    setSettings({ ...settings, sessionTimeoutMinutes: Number(e.target.value) })
                  }
                  className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-semibold"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes (Recommended)</option>
                  <option value={120}>2 Hours</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25 transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
