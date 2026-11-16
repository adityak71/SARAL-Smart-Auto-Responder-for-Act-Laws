"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Landmark,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Flag,
  Plus,
  RefreshCw,
  XCircle,
  Lock,
} from "lucide-react";

function safeParseClauses(raw) {
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {}
    }
    const lines = trimmed
      .split(/\n+/)
      .map((l) => l.replace(/^\d+[\.\)]\s*/, "").trim())
      .filter(Boolean);
    if (lines.length > 0) return lines;
  }
  return [];
}

export default function RtiManagement({ initialSubTab = "rtis" }) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);
  const [applications, setApplications] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchRti, setSearchRti] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [selectedRti, setSelectedRti] = useState(null);
  const [toast, setToast] = useState(null);

  // Add Department Modal
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [deptSubmitting, setDeptSubmitting] = useState(false);
  const [newDeptForm, setNewDeptForm] = useState({
    code: "",
    name: "",
    ministry: "",
    nodalOffice: "",
    contactEmail: "",
    contactPhone: "",
    avgResponseDays: 20,
  });

  const fetchRtis = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter !== "ALL") queryParams.append("status", statusFilter);
      if (deptFilter !== "ALL") queryParams.append("departmentId", deptFilter);
      if (searchRti) queryParams.append("search", searchRti);

      const res = await fetch(`/api/admin/rtis?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error("Failed to load RTIs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      if (data.success) {
        setDepartments(data.departments);
      }
    } catch (err) {
      console.error("Failed to load departments:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();
        if (isMounted && data.success) {
          setDepartments(data.departments);
        }
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const queryParams = new URLSearchParams();
        if (statusFilter !== "ALL") queryParams.append("status", statusFilter);
        if (deptFilter !== "ALL") queryParams.append("departmentId", deptFilter);
        if (searchRti) queryParams.append("search", searchRti);

        const res = await fetch(`/api/admin/rtis?${queryParams.toString()}`);
        const data = await res.json();
        if (isMounted && data.success) {
          setApplications(data.applications);
        }
      } catch (err) {
        console.error("Failed to load RTIs:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [statusFilter, deptFilter, searchRti]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFlagRti = async (appId) => {
    try {
      const res = await fetch("/api/admin/rtis", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, action: "FLAG_SUSPICIOUS" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Application flagged for designated PIO compliance audit.", "success");
      } else {
        showToast(data.error || "Failed to flag application.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    }
  };

  const handleCreateDept = async (e) => {
    e.preventDefault();
    setDeptSubmitting(true);
    try {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDeptForm),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Department "${newDeptForm.name}" created successfully!`, "success");
        setShowAddDeptModal(false);
        setNewDeptForm({
          code: "",
          name: "",
          ministry: "",
          nodalOffice: "",
          contactEmail: "",
          contactPhone: "",
          avgResponseDays: 20,
        });
        fetchDepartments();
      } else {
        showToast(data.error || "Failed to create department.", "error");
      }
    } catch {
      showToast("Network error creating department.", "error");
    } finally {
      setDeptSubmitting(false);
    }
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
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-semibold flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 backdrop-blur-md"
                : "bg-rose-500/10 text-rose-400 border-rose-500/30 backdrop-blur-md"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtab Navigation Pills */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("rtis")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === "rtis"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>All RTI Applications</span>
            <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] ${
              activeSubTab === "rtis" ? "bg-purple-700 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}>
              {applications.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab("departments")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === "departments"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Departments Directory</span>
            <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] ${
              activeSubTab === "departments" ? "bg-purple-700 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}>
              {departments.length}
            </span>
          </button>
        </div>

        <button
          onClick={fetchRtis}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          title="Refresh RTIs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* VIEW 1: ALL RTI APPLICATIONS */}
      {activeSubTab === "rtis" && (
        <div className="space-y-6">
          {/* Statutory Zero-Tampering Notice Banner */}
          <div className="p-5 rounded-3xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 text-slate-900 dark:text-white shadow-sm dark:shadow-2xl flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="space-y-1">
              <span className="font-bold text-amber-800 dark:text-amber-300 text-sm">
                Statutory Compliance Rule — Section 6(1) RTI Act 2005 (Zero-Tampering Boundary):
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Administrative personnel have NO permission to edit citizen petition text, delete submitted petitions, or submit applications on behalf of citizens. All applications are immutable legal instruments.
              </p>
            </div>
          </div>

          {/* Search, Filter & RTI Table Container */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0524] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm dark:shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchRtis();
                }}
                className="relative w-full sm:w-96"
              >
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by ID (e.g. SARAL-2026-00085) or Subject..."
                  value={searchRti}
                  onChange={(e) => setSearchRti(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
              </form>

              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs w-full sm:w-auto overflow-x-auto">
                {[
                  { id: "ALL", label: "All Statuses" },
                  { id: "SUBMITTED", label: "Submitted" },
                  { id: "IN_REVIEW", label: "In Review" },
                  { id: "RESPONDED", label: "Responded" },
                  { id: "CLOSED", label: "Closed" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStatusFilter(s.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                      statusFilter === s.id
                        ? "bg-white dark:bg-purple-600 text-purple-700 dark:text-white font-bold shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 dark:bg-white/5 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Reference ID</th>
                    <th className="px-5 py-3.5 font-bold">Subject & Authority</th>
                    <th className="px-5 py-3.5 font-bold">Citizen Petitioner</th>
                    <th className="px-5 py-3.5 font-bold">Date Filed</th>
                    <th className="px-5 py-3.5 font-bold">Statutory Clock</th>
                    <th className="px-5 py-3.5 font-bold">Current Status</th>
                    <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-400" />
                        Fetching applications repository...
                      </td>
                    </tr>
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-slate-400">
                        No RTI applications found.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr
                        key={app.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-5 py-3.5 font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 whitespace-nowrap">
                          {app.applicationNumber}
                        </td>

                        <td className="px-5 py-3.5 max-w-xs">
                          <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {app.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {app.department?.name || app.targetAuthority || "Public Authority"}
                          </p>
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900 dark:text-white text-xs">
                              {app.citizen?.name}
                            </span>
                            {app.citizen?.isVerified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" title="DigiLocker Verified" />
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {new Date(app.filingDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs font-semibold">
                            <Clock className={`w-3.5 h-3.5 ${app.daysLeft <= 5 ? "text-rose-500 dark:text-rose-400" : "text-slate-400"}`} />
                            <span
                              className={
                                app.daysLeft <= 5
                                  ? "text-rose-600 dark:text-rose-400 font-bold"
                                  : "text-slate-600 dark:text-slate-300"
                              }
                            >
                              {app.daysLeft}d left
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              app.status === "RESPONDED" || app.status === "CLOSED"
                                ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                                : app.status === "IN_REVIEW"
                                ? "bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                                : "bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                            }`}
                          >
                            {app.status.replace("_", " ")}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedRti(app)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Dossier
                            </button>
                            <button
                              onClick={() => handleFlagRti(app.id)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                              title="Flag for Compliance Review"
                            >
                              <Flag className="w-3.5 h-3.5" />
                            </button>
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

      {/* VIEW 2: DEPARTMENTS DIRECTORY */}
      {activeSubTab === "departments" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0524] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm dark:shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Department Directory & Public Authorities
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Official ministerial catalog, designated PIO allocations, and statutory turnaround baselines
              </p>
            </div>
            <button
              onClick={() => setShowAddDeptModal(true)}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-md shadow-purple-600/20"
            >
              <Plus className="w-4 h-4" /> Add Department
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#0c0524] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm dark:shadow-2xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-200 dark:border-cyan-500/20">
                      {dept.code}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      TAT: ~{dept.avgResponseDays || 20} Days
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {dept.name}
                  </h4>
                  <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold">{dept.ministry}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Nodal Officers</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {dept._count?.officers || dept.officers?.length || 0} Designated
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Active RTI Petitions</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {dept._count?.applications || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 truncate">
                    <span>Official Email</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{dept.contactEmail}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* READ-ONLY RTI DOSSIER MODAL */}
      <AnimatePresence>
        {selectedRti && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0f0728] border border-slate-200 dark:border-white/20 p-6 shadow-2xl space-y-6 text-slate-900 dark:text-white"
            >
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 mb-2">
                    <Lock className="w-3.5 h-3.5" /> Read-Only Statutory Dossier
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white text-xl">
                    {selectedRti.applicationNumber}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedRti.title}</p>
                </div>
                <button
                  onClick={() => setSelectedRti(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Citizen Prompt */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Original Citizen Prompt
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed">
                  &ldquo;{selectedRti.rawCitizenPrompt || "N/A"}&rdquo;
                </div>
              </div>

              {/* AI-Structured Clauses */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Section 6(1) Structured Clauses (Immutable)
                </h4>
                <div className="space-y-2">
                  {(() => {
                    const clauses = safeParseClauses(selectedRti.structuredClauses);
                    return clauses.length > 0 ? (
                      clauses.map((clause, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                        >
                          <span className="font-bold text-purple-600 dark:text-purple-400 shrink-0">{idx + 1}.</span>
                          <p className="leading-relaxed">{clause}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic">No clauses available.</p>
                    );
                  })()}
                </div>
              </div>

              {/* Metadata Breakdown */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-200 dark:border-white/10">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Petitioner:</span>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {selectedRti.citizen?.name || "Verified Citizen"} ({selectedRti.citizen?.email || "N/A"})
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Target Department:</span>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {selectedRti.department?.name || selectedRti.targetAuthority || "Public Authority"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Statutory Deadline:</span>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {selectedRti.statutoryDeadline
                      ? new Date(selectedRti.statutoryDeadline).toLocaleDateString("en-IN", {
                          dateStyle: "medium",
                        })
                      : "30-Day Window Active"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Treasury Fee:</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedRti.feeStatus === "EXEMPTED_BPL"
                      ? "BPL Exempted"
                      : `₹10 Paid (${selectedRti.paymentTxnId || "Bharatkosh"})`}
                  </p>
                </div>
              </div>

              {/* Zero-Tampering Enforcement Bar */}
              <div className="p-3.5 rounded-xl bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/30 text-xs text-purple-800 dark:text-purple-200 flex items-center justify-between">
                <span>🔒 Content modification & deletion disabled by Section 6(1) of RTI Act 2005.</span>
                <button
                  onClick={() => setSelectedRti(null)}
                  className="px-4 py-2 rounded-full bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white font-bold hover:bg-slate-300 dark:hover:bg-white/20 transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD DEPARTMENT MODAL */}
      <AnimatePresence>
        {showAddDeptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0f0728] border border-slate-200 dark:border-white/20 p-6 shadow-2xl space-y-6 text-slate-900 dark:text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                  Add Public Authority / Department
                </h3>
                <button
                  onClick={() => setShowAddDeptModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDept} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Department Code (e.g. MHRD, PWD, RAIL)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MHRD"
                    value={newDeptForm.code}
                    onChange={(e) =>
                      setNewDeptForm({ ...newDeptForm, code: e.target.value.toUpperCase() })
                    }
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Department / Authority Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Department of School Education & Literacy"
                    value={newDeptForm.name}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Ministry / Hierarchy
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ministry of Education"
                    value={newDeptForm.ministry}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, ministry: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Nodal Office
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Shastri Bhawan, New Delhi"
                      value={newDeptForm.nodalOffice}
                      onChange={(e) =>
                        setNewDeptForm({ ...newDeptForm, nodalOffice: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Official Contact Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rti.cell@nic.in"
                      value={newDeptForm.contactEmail}
                      onChange={(e) =>
                        setNewDeptForm({ ...newDeptForm, contactEmail: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddDeptModal(false)}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={deptSubmitting}
                    className="px-6 py-2.5 rounded-full text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all cursor-pointer shadow-md shadow-purple-600/20"
                  >
                    {deptSubmitting ? "Creating..." : "Save Department"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
