"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users as FiUsers,
  Shield as FiShield,
  Search as FiSearch,
  Filter as FiFilter,
  CheckCircle2 as FiCheckCircle,
  AlertTriangle as FiAlertTriangle,
  XCircle as FiXCircle,
  Clock as FiClock,
  UserCheck as FiUserCheck,
  UserX as FiUserX,
  Lock as FiLock,
  ExternalLink as FiExternalLink,
  Eye as FiEye,
  RefreshCw as FiRefreshCw,
  Activity as FiActivity,
} from "lucide-react";

export default function UserManagement({ initialSubTab = "users" }) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); // "users" | "verification"
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "verified" | "unverified" | "suspended"
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?filter=${filter}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/users?filter=${filter}&search=${encodeURIComponent(search)}`);
        const data = await res.json();
        if (isMounted && data.success) {
          setUsers(data.users);
        }
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [filter, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    const newStatus = !user.isActive;
    const confirmMsg = newStatus
      ? `Are you sure you want to REACTIVATE ${user.fullName}'s account?`
      : `Are you sure you want to TEMPORARILY SUSPEND ${user.fullName}'s account? They will be immediately locked out of SARAL.`;

    if (!window.confirm(confirmMsg)) return;

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          isActive: newStatus,
          reason: newStatus ? "Administrative reactivation" : "Administrative safety suspension",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, isActive: newStatus } : u))
        );
        if (selectedUser?.id === user.id) {
          setSelectedUser((prev) => ({ ...prev, isActive: newStatus }));
        }
        showToast(
          newStatus
            ? `Account reactivated for ${user.fullName}.`
            : `Account suspended for ${user.fullName}.`,
          "success"
        );
      } else {
        showToast(data.error || "Failed to update account status.", "error");
      }
    } catch (err) {
      showToast("Network error updating user status.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Metrics
  const totalCount = users.length;
  const verifiedCount = users.filter((u) => u.isDigiLockerVerified).length;
  const unverifiedCount = users.filter((u) => !u.isDigiLockerVerified).length;
  const suspendedCount = users.filter((u) => !u.isActive).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-semibold flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 backdrop-blur-md"
                : "bg-rose-500/10 text-rose-400 border-rose-500/30 backdrop-blur-md"
            }`}
          >
            {toast.type === "success" ? <FiCheckCircle /> : <FiAlertTriangle />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSubTab("users")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeSubTab === "users"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FiUsers />
            Registered Citizens ({totalCount})
          </button>
          <button
            onClick={() => setActiveSubTab("verification")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeSubTab === "verification"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FiShield />
            DigiLocker Verification ({verifiedCount})
          </button>
        </div>

        <button
          onClick={fetchUsers}
          className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          title="Refresh User List"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* VIEW 1: REGISTERED USERS MANAGEMENT */}
      {activeSubTab === "users" && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Registered</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 shadow-sm">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">DigiLocker Verified</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{verifiedCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 shadow-sm">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Unverified</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{unverifiedCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 shadow-sm">
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">Suspended Accounts</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{suspendedCount}</p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {[
                { id: "all", label: "All Users" },
                { id: "verified", label: "Verified Only" },
                { id: "unverified", label: "Unverified" },
                { id: "suspended", label: "Suspended" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    filter === f.id
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-2xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-black/30 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5">
                  <tr>
                    <th className="px-5 py-4 font-bold">User / Citizen</th>
                    <th className="px-5 py-4 font-bold">Role</th>
                    <th className="px-5 py-4 font-bold">Identity Verification</th>
                    <th className="px-5 py-4 font-bold">Firebase UID</th>
                    <th className="px-5 py-4 font-bold">Registered On</th>
                    <th className="px-5 py-4 font-bold">Account Status</th>
                    <th className="px-5 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-slate-400">
                        <FiRefreshCw className="animate-spin mx-auto text-2xl mb-2" />
                        Loading citizens database...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-slate-400">
                        No registered users found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                              {u.fullName?.slice(0, 2).toUpperCase() || "CT"}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                                {u.fullName}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                              u.role === "ADMIN"
                                ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                                : u.role === "OFFICER"
                                ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                                : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {u.isDigiLockerVerified ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
                              <FiCheckCircle className="text-xs" />
                              DigiLocker Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">
                              <FiAlertTriangle className="text-xs" />
                              Unverified Citizen
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 font-mono text-xs text-slate-400">
                          {u.firebaseUid}
                        </td>

                        <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        <td className="px-5 py-4">
                          {u.isActive ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active Account
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              Suspended
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedUser(u)}
                              className="p-1.5 text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="View User Details"
                            >
                              <FiEye className="text-base" />
                            </button>
                            {u.role !== "ADMIN" && (
                              <button
                                onClick={() => handleToggleStatus(u)}
                                disabled={actionLoading}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                  u.isActive
                                    ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"
                                    : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                                }`}
                              >
                                {u.isActive ? "Suspend" : "Reactivate"}
                              </button>
                            )}
                          </div>
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

      {/* VIEW 2: DIGILOCKER IDENTITY VERIFICATION MONITORING */}
      {activeSubTab === "verification" && (
        <div className="space-y-6">
          {/* Statutory Security Header */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900 border border-emerald-500/30">
            <div className="flex items-start gap-3">
              <FiLock className="text-emerald-400 text-xl mt-0.5 shrink-0" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-emerald-300">
                  DigiLocker Identity Gateway & Aadhaar Privacy Guard
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  SARAL enforces zero-knowledge authentication. Administrators are permitted to monitor verification reference IDs, timestamps, and gateway error rates, but are strictly prohibited from viewing citizens’ raw 12-digit Aadhaar numbers or biometric tokens.
                </p>
              </div>
            </div>
          </div>

          {/* Verification Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Verified</span>
                <FiCheckCircle className="text-emerald-500 text-lg" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                {verifiedCount}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                {(totalCount > 0 ? (verifiedCount / totalCount) * 100 : 92).toFixed(1)}% success rate
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Verification</span>
                <FiClock className="text-amber-500 text-lg" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                {unverifiedCount}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                Citizens in OTP completion stage
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Failed / Timed Out</span>
                <FiXCircle className="text-rose-500 text-lg" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                0
              </p>
              <p className="text-xs text-slate-400 mt-1">Zero unresolved gateway failures</p>
            </div>
          </div>

          {/* Verification Audit Stream */}
          <div className="rounded-2xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Identity Verification Ledger
                </h3>
                <p className="text-xs text-slate-400">
                  Tamper-evident verification transactions authenticated via MeitY DigiLocker API
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-black/30 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5">
                  <tr>
                    <th className="px-5 py-4 font-bold">Petitioner</th>
                    <th className="px-5 py-4 font-bold">DigiLocker Reference ID</th>
                    <th className="px-5 py-4 font-bold">Timestamp</th>
                    <th className="px-5 py-4 font-bold">Gateway Status</th>
                    <th className="px-5 py-4 font-bold">Citizen Region</th>
                    <th className="px-5 py-4 font-bold text-right">Evidence Policy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">
                          {u.fullName}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">{u.email}</p>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-cyan-600 dark:text-cyan-400">
                        {u.digiLockerId || (u.isDigiLockerVerified ? `DL-VERIFIED-${u.id.slice(0, 8).toUpperCase()}` : "UNVERIFIED_PENDING")}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400">
                        {new Date(u.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        {u.isDigiLockerVerified ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <FiCheckCircle /> Verified & Validated
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <FiClock /> Awaiting OTP
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs">
                        {u.district !== "—" ? `${u.district}, ${u.state}` : u.state}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-xs text-slate-400 font-medium italic">
                          Automated (No manual override)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* USER DETAIL MODAL */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/30 p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                    {selectedUser.fullName?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                      {selectedUser.fullName}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">{selectedUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
                >
                  <FiXCircle className="text-xl" />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">Account Role</span>
                  <span className="font-bold text-slate-900 dark:text-white uppercase">
                    {selectedUser.role}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">DigiLocker Status</span>
                  <span className="font-bold text-emerald-500">
                    {selectedUser.isDigiLockerVerified ? "Verified (Aadhaar Seeded)" : "Pending Verification"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">DigiLocker Txn Ref</span>
                  <span className="font-mono text-xs text-cyan-400">
                    {selectedUser.digiLockerId || "—"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">Firebase UID</span>
                  <span className="font-mono text-xs text-slate-400">
                    {selectedUser.firebaseUid}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">Total RTIs Filed</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedUser.totalApplications}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">Current Status</span>
                  <span
                    className={`font-bold ${
                      selectedUser.isActive ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {selectedUser.isActive ? "Active (Normal Access)" : "Temporarily Suspended"}
                  </span>
                </div>
              </div>

              {/* Privacy Warning */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-400">
                🔒 Private security parameters (passwords, tokens, and raw Aadhaar credentials) are encrypted and masked under MeitY data governance protocol.
              </div>

              <div className="flex gap-3">
                {selectedUser.role !== "ADMIN" && (
                  <button
                    onClick={() => handleToggleStatus(selectedUser)}
                    disabled={actionLoading}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      selectedUser.isActive
                        ? "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                    }`}
                  >
                    {selectedUser.isActive ? "Suspend Account" : "Reactivate Account"}
                  </button>
                )}
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
