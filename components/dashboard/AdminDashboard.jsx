"use client";

import { useState } from "react";
import Link from "next/link";
import { departmentCatalog } from "@/data/dashboardData";

const INITIAL_OFFICERS = [
  {
    id: "off-1",
    name: "Er. Rameshwar Verma",
    email: "er.rameshwar@mp.gov.in",
    employeeId: "EMP-MP-PWD-4091",
    department: "Public Works Department (PWD)",
    designation: "Executive Engineer & Designated PIO",
    isVerified: true,
    activeCases: 7,
  },
  {
    id: "off-2",
    name: "Smt. Vandana Trivedi",
    email: "vandana.trivedi@gov.in",
    employeeId: "EMP-RD-7821",
    department: "Rural Development & Panchayati Raj",
    designation: "Assistant Director (Panchayati Raj)",
    isVerified: true,
    activeCases: 12,
  },
  {
    id: "off-3",
    name: "Dr. Alok Kumar Jha",
    email: "alok.jha@nic.in",
    employeeId: "EMP-EDU-3190",
    department: "School Education & Literacy",
    designation: "Chief Educational Officer (PIO)",
    isVerified: true,
    activeCases: 4,
  },
  {
    id: "off-4",
    name: "Shri K. S. Murthy",
    email: "murthy.water@gov.in",
    employeeId: "EMP-JAL-9021",
    department: "Urban Water Supply & Sanitation",
    designation: "Superintending Engineer",
    isVerified: false,
    activeCases: 2,
  },
];

const AUDIT_LOG_FEED = [
  {
    id: "log-1",
    action: "RTI_FILED",
    entity: "SARAL-2026-00124",
    user: "Rahul Sharma (Citizen)",
    ip: "103.21.144.12",
    time: "2 mins ago",
    status: "Success",
  },
  {
    id: "log-2",
    action: "RESPONSE_MEMO_DRAFTED",
    entity: "SARAL-2026-00124",
    user: "Er. Rameshwar Verma (PIO)",
    ip: "14.139.221.80",
    time: "18 mins ago",
    status: "Success",
  },
  {
    id: "log-3",
    action: "TREASURY_FEE_VERIFIED",
    entity: "TXN-BHARATKOSH-98218731",
    user: "Gateway Webhook",
    ip: "164.100.128.5",
    time: "42 mins ago",
    status: "Success",
  },
  {
    id: "log-4",
    action: "OFFICER_LOGIN",
    entity: "User Session",
    user: "er.rameshwar@mp.gov.in",
    ip: "14.139.221.80",
    time: "1 hour ago",
    status: "Success",
  },
  {
    id: "log-5",
    action: "ADMIN_LOGIN",
    entity: "Central Comptroller Console",
    user: "admin@saral-rti.in",
    ip: "127.0.0.1",
    time: "Just now",
    status: "Success",
  },
];

export default function AdminDashboard({ user }) {
  const adminName = user?.name || user?.fullName || "SARAL Central Administrator";
  const [activeTab, setActiveTab] = useState("departments"); // "departments" | "officers" | "audit"
  const [officers, setOfficers] = useState(INITIAL_OFFICERS);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDept, setNewDept] = useState({
    name: "",
    ministry: "",
    nodalOffice: "",
    contactEmail: "",
    avgDays: 15,
  });

  const toggleOfficerVerification = (officerId) => {
    setOfficers(
      officers.map((off) =>
        off.id === officerId ? { ...off, isVerified: !off.isVerified } : off
      )
    );
  };

  const handleAddDept = (e) => {
    e.preventDefault();
    if (!newDept.name || !newDept.ministry) return;
    departmentCatalog.push({
      id: `dept-${Date.now().toString().slice(-4)}`,
      name: newDept.name,
      nodalOfficers: 1,
      avgDays: Number(newDept.avgDays) || 15,
    });
    setShowAddDeptModal(false);
    setNewDept({ name: "", ministry: "", nodalOffice: "", contactEmail: "", avgDays: 15 });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Comptroller Command Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#100638] to-purple-950/80 border border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Central Information Commission (CIC) Compliance Overseer • Superadmin
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {adminName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Central Command & Role-Based Access Control (RBAC) panel. Supervise all departmental Public Information Officers, audit statutory 30-day compliance, and ensure zero-friction citizen petition settlement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 z-10">
          <button
            type="button"
            onClick={() => setShowAddDeptModal(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm shadow-md transition cursor-pointer"
          >
            + Add Public Authority
          </button>
          <button
            type="button"
            onClick={() => alert("Statutory Section 25 Annual Return CSV report generated for download.")}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 font-semibold text-xs sm:text-sm transition cursor-pointer"
          >
            Export Annual Report
          </button>
        </div>
      </div>

      {/* 4 Executive Platform KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-md transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Total System RTIs</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 block">
            1,428
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">1,382 Resolved</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-md transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Public Authorities</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-purple-700 dark:text-purple-300 mt-1 block">
            {departmentCatalog.length}
          </span>
          <span className="text-[11px] text-purple-600 dark:text-purple-300">Central & State Bodies</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-md transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Treasury Fees Settled</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-cyan-700 dark:text-cyan-400 mt-1 block">
            ₹14,280
          </span>
          <span className="text-[11px] text-cyan-600 dark:text-cyan-300 font-semibold">100% Bharatkosh Reconciled</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-md transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Statutory Timely Ratio</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
            96.8%
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-300 font-semibold">Under Section 7(1) Mandate</span>
        </div>
      </div>

      {/* 3-Tab Operational Console */}
      <div className="bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 rounded-3xl p-5 sm:p-6 shadow-sm dark:shadow-xl transition-colors">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-4 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("departments")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "departments"
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            🏛 Public Authorities ({departmentCatalog.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("officers")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "officers"
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            👮 Officer Provisioning ({officers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "audit"
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            🔒 Security Audit Trail ({AUDIT_LOG_FEED.length})
          </button>
        </div>

        {/* Tab 1: Departments Directory */}
        {activeTab === "departments" && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="pb-3 px-3">Authority / Department</th>
                    <th className="pb-3 px-3">Nodal PIO Officers</th>
                    <th className="pb-3 px-3">Avg Turnaround</th>
                    <th className="pb-3 px-3">Compliance Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {departmentCatalog.map((dept) => (
                    <tr key={dept.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {dept.name}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {dept.nodalOfficers} Designated PIOs
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-purple-700 dark:text-purple-300">
                        {dept.avgDays} Days
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          Active Mandate
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href="/general-info"
                          className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          View Directory →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Officer Directory & Verification */}
        {activeTab === "officers" && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="pb-3 px-3">Officer Name</th>
                    <th className="pb-3 px-3">Department & Designation</th>
                    <th className="pb-3 px-3">Employee ID</th>
                    <th className="pb-3 px-3">Active Petitions</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Role Authorization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {officers.map((off) => (
                    <tr key={off.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 dark:text-white block">{off.name}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{off.email}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-800 dark:text-slate-200 block">{off.department}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{off.designation}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-xs text-slate-600 dark:text-slate-400">
                        {off.employeeId}
                      </td>
                      <td className="py-3 px-3 font-bold text-purple-600 dark:text-purple-300">
                        {off.activeCases} Cases
                      </td>
                      <td className="py-3 px-3">
                        {off.isVerified ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            Verified PIO
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => toggleOfficerVerification(off.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            off.isVerified
                              ? "bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white"
                          }`}
                        >
                          {off.isVerified ? "Revoke Access" : "Approve PIO"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Security & Audit Log Feed */}
        {activeTab === "audit" && (
          <div className="space-y-3">
            {AUDIT_LOG_FEED.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded font-mono font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                    {log.action}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white mr-2">
                      {log.entity}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      by {log.user} (IP: {log.ip})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-slate-500 dark:text-slate-400">
                  <span>{log.time}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title={log.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Department Modal */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-[#0d062e] border border-slate-200 dark:border-purple-500/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Register Public Authority
              </h3>
              <button
                type="button"
                onClick={() => setShowAddDeptModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDept} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  placeholder="e.g. Higher Education Directorate"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Parent Ministry
                </label>
                <input
                  type="text"
                  required
                  value={newDept.ministry}
                  onChange={(e) => setNewDept({ ...newDept, ministry: e.target.value })}
                  placeholder="e.g. Ministry of Education"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Avg Turnaround (Days)
                  </label>
                  <input
                    type="number"
                    value={newDept.avgDays}
                    onChange={(e) => setNewDept({ ...newDept, avgDays: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Jurisdiction
                  </label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white">
                    <option>Central</option>
                    <option>State</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md"
                >
                  Save Authority
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
