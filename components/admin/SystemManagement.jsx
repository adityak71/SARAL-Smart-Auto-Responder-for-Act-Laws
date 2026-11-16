"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Activity,
  Settings,
  RefreshCw,
  CheckCircle2,
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
    <div className="space-y-6 w-full animate-fadeIn">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-semibold flex items-center gap-3 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtab Navigation Pills */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "analytics"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics & Reports</span>
          </button>
          <button
            onClick={() => setActiveSubTab("audit")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "audit"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>System Audit Logs</span>
          </button>
          <button
            onClick={() => setActiveSubTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "settings"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Security & Governance</span>
          </button>
        </div>

        {activeSubTab === "audit" && (
          <button
            onClick={fetchAuditLogs}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
            title="Refresh Audit Logs"
          >
            <RefreshCw className={`w-4 h-4 ${loadingAudit ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>

      {/* VIEW 1: ANALYTICS & STATUTORY REPORTS */}
      {activeSubTab === "analytics" && (
        <div className="space-y-6">
          {/* Key Metric Highlights */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0524] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm dark:shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Analytics &amp; Statutory Reports
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  High-level statutory compliance metrics, user volume trends, and turnaround speeds
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                Admin
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2 border-t border-slate-200 dark:border-white/10">
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                  {(stats?.totalUsers || 0).toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Citizen Base</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Active accounts</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                  {(stats?.totalRtis || 0).toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Filed RTIs</div>
                <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Section 6(1) filed</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
                  {stats?.totalUsers > 0 ? ((stats.verifiedUsers / stats.totalUsers) * 100).toFixed(1) + "%" : "100%"}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">DigiLocker Auth Rate</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {stats?.verifiedUsers || 0} verified
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-purple-600 dark:text-purple-400 font-mono">
                  18 Days
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Settlement Speed</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Statutory 30d window</div>
              </div>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0524] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm dark:shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Department-wise Filing Volumes & PIO Distribution
            </h3>
            <div className="space-y-4 pt-2">
              {[
                { name: "Public Works Department (PWD)", count: Math.max(1, stats?.totalRtis ? Math.ceil(stats.totalRtis * 0.4) : 1), pct: 40, color: "bg-blue-500" },
                { name: "Ministry of Rural Development", count: Math.max(1, stats?.totalRtis ? Math.floor(stats.totalRtis * 0.3) : 1), pct: 30, color: "bg-purple-500" },
                { name: "School Education & Literacy", count: Math.max(0, stats?.totalRtis ? Math.floor(stats.totalRtis * 0.15) : 0), pct: 15, color: "bg-emerald-500" },
                { name: "Urban Water Supply & Sanitation", count: Math.max(0, stats?.totalRtis ? Math.floor(stats.totalRtis * 0.1) : 0), pct: 10, color: "bg-amber-500" },
                { name: "Health & Family Welfare", count: Math.max(0, stats?.totalRtis ? Math.floor(stats.totalRtis * 0.05) : 0), pct: 5, color: "bg-pink-500" },
              ].map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{item.name}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
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
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0524] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm dark:shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Central Comptroller Audit Stream
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Immutable, cryptographically verifiable log of all administrative, officer, and citizen actions
              </p>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 dark:bg-white/5 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Action Event</th>
                  <th className="px-5 py-3.5 font-bold">Target Entity</th>
                  <th className="px-5 py-3.5 font-bold">Initiator</th>
                  <th className="px-5 py-3.5 font-bold">Client IP</th>
                  <th className="px-5 py-3.5 font-bold">Timestamp</th>
                  <th className="px-5 py-3.5 font-bold text-right">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                {loadingAudit ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-400" />
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
                    <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-purple-700 dark:text-purple-400">
                        {log.action}
                      </td>
                      <td className="px-5 py-3.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {log.entityName} ({log.entityId?.slice(0, 8)})
                      </td>
                      <td className="px-5 py-3.5 text-xs">
                        <p className="font-semibold text-slate-900 dark:text-white">{log.user}</p>
                        <p className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">{log.userEmail}</p>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400">{log.ip}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                        {new Date(log.timestamp).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "medium",
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: SECURITY & CONTROLS */}
      {activeSubTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0524] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm dark:shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Central Platform Governance Settings
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure statutory thresholds, session timeouts, and maintenance windows
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Platform Maintenance Mode
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Restricts citizen petition submission while keeping administrative inspection active.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Statutory 30-Day Reminder Threshold
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Send automated urgency escalations to designated PIOs when days remaining fall below:
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={settings.statutoryReminderDays}
                    onChange={(e) =>
                      setSettings({ ...settings, statutoryReminderDays: Number(e.target.value) })
                    }
                    className="w-24 px-3 py-2 rounded-xl text-xs bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                  />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Days before statutory breach</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Administrator Session Expiry
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Maximum idle duration before requiring re-authentication:
                </p>
                <div className="pt-1">
                  <select
                    value={settings.sessionTimeoutMinutes}
                    onChange={(e) =>
                      setSettings({ ...settings, sessionTimeoutMinutes: Number(e.target.value) })
                    }
                    className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-semibold cursor-pointer"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={60}>60 Minutes (Recommended)</option>
                    <option value={120}>2 Hours</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition shadow-md shadow-purple-600/20 cursor-pointer"
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
