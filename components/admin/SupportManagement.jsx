"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LifeBuoy as FiLifeBuoy,
  Bell as FiBell,
  BookOpen as FiBookOpen,
  Search as FiSearch,
  CheckCircle2 as FiCheckCircle,
  Clock as FiClock,
  AlertCircle as FiAlertCircle,
  Send as FiSend,
  Plus as FiPlus,
  RefreshCw as FiRefreshCw,
  XCircle as FiXCircle,
  MessageSquare as FiMessageSquare,
  UserCheck as FiUserCheck,
  Filter as FiFilter,
  Mail as FiMail,
} from "lucide-react";

const INITIAL_FAQS = [
  {
    id: "faq-1",
    question: "What is the statutory deadline for an RTI reply under Section 7(1)?",
    category: "Legal Timing",
    answer:
      "Under Section 7(1) of the RTI Act 2005, the designated Public Information Officer (PIO) must provide information within 30 calendar days. If information concerns life or liberty, it must be provided within 48 hours.",
    published: true,
  },
  {
    id: "faq-2",
    question: "Can an applicant apply without paying the ₹10 fee?",
    category: "Fee & Exemption",
    answer:
      "Yes. Citizens belonging to the Below Poverty Line (BPL) category are completely exempt from the ₹10 statutory application fee upon providing their BPL/Antyodaya Ration Card number.",
    published: true,
  },
  {
    id: "faq-3",
    question: "How does SARAL verify petitioner identity via DigiLocker?",
    category: "Digital Verification",
    answer:
      "SARAL interfaces with MeitY's official DigiLocker OAuth2 API to authenticate petitioner identity via Aadhaar OTP in a zero-knowledge architecture. No biometric or raw Aadhaar numbers are stored.",
    published: true,
  },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Scheduled Maintenance Notification",
    audience: "All Citizens & Officers",
    channel: "In-App Banner",
    status: "Delivered",
    sentAt: "15 Nov 2026, 02:00 AM",
    recipientsCount: 2450,
  },
  {
    id: "notif-2",
    title: "Reminder: Complete DigiLocker Verification",
    audience: "Unverified Citizens Only",
    channel: "In-App & Email",
    status: "Delivered",
    sentAt: "14 Nov 2026, 11:30 AM",
    recipientsCount: 125,
  },
];

export default function SupportManagement({ initialSubTab = "complaints" }) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); // "complaints" | "notifications" | "content"
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintFilter, setComplaintFilter] = useState("ALL");
  const [internalNoteInput, setInternalNoteInput] = useState("");
  const [toast, setToast] = useState(null);

  // Content FAQs
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [showAddFaqModal, setShowAddFaqModal] = useState(false);
  const [newFaq, setNewFaq] = useState({ question: "", category: "General", answer: "" });

  // Notifications Composer
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [notifForm, setNotifForm] = useState({
    title: "",
    message: "",
    audience: "ALL_CITIZENS",
    channel: "IN_APP",
  });
  const [sendingNotif, setSendingNotif] = useState(false);

  const fetchComplaints = async () => {
    setLoadingComplaints(true);
    try {
      const res = await fetch("/api/admin/complaints");
      const data = await res.json();
      if (data.success) {
        setComplaints(data.complaints);
      }
    } catch (err) {
      console.error("Failed to load complaints:", err);
    } finally {
      setLoadingComplaints(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/complaints");
        const data = await res.json();
        if (isMounted && data.success) {
          setComplaints(data.complaints);
        }
      } catch (err) {
        console.error("Failed to load complaints:", err);
      } finally {
        if (isMounted) setLoadingComplaints(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleUpdateComplaintStatus = async (complaintId, nextStatus) => {
    try {
      const res = await fetch("/api/admin/complaints", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaintId,
          status: nextStatus,
          internalNotes: internalNoteInput || selectedComplaint?.internalNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComplaints((prev) =>
          prev.map((c) => (c.id === complaintId ? { ...c, status: nextStatus, internalNotes: internalNoteInput || c.internalNotes } : c))
        );
        if (selectedComplaint?.id === complaintId) {
          setSelectedComplaint((prev) => ({ ...prev, status: nextStatus, internalNotes: internalNoteInput || prev.internalNotes }));
        }
        showToast(`Complaint status advanced to ${nextStatus}.`, "success");
      }
    } catch (err) {
      showToast("Failed to update status.", "error");
    }
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!notifForm.title || !notifForm.message) return;
    setSendingNotif(true);

    setTimeout(() => {
      const newEntry = {
        id: `notif-${Date.now()}`,
        title: notifForm.title,
        audience:
          notifForm.audience === "ALL_CITIZENS"
            ? "All Citizens"
            : notifForm.audience === "UNVERIFIED"
            ? "Unverified Citizens"
            : "Officers",
        channel: notifForm.channel === "IN_APP" ? "In-App Banner" : "In-App & Email Alert",
        status: "Delivered",
        sentAt: "Just now",
        recipientsCount: notifForm.audience === "ALL_CITIZENS" ? 2450 : 125,
      };
      setNotifications([newEntry, ...notifications]);
      setNotifForm({ title: "", message: "", audience: "ALL_CITIZENS", channel: "IN_APP" });
      setSendingNotif(false);
      showToast("Broadcast notification dispatched successfully!", "success");
    }, 800);
  };

  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer) return;
    setFaqs([
      ...faqs,
      {
        id: `faq-${Date.now()}`,
        question: newFaq.question,
        category: newFaq.category,
        answer: newFaq.answer,
        published: true,
      },
    ]);
    setShowAddFaqModal(false);
    setNewFaq({ question: "", category: "General", answer: "" });
    showToast("New FAQ published to citizen portal.", "success");
  };

  const filteredComplaints =
    complaintFilter === "ALL"
      ? complaints
      : complaints.filter((c) => c.status.toUpperCase() === complaintFilter);

  return (
    <div className="space-y-6">
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
            {toast.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab("complaints")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeSubTab === "complaints"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FiLifeBuoy />
            Citizen Grievances ({complaints.length})
          </button>
          <button
            onClick={() => setActiveSubTab("notifications")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeSubTab === "notifications"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FiBell />
            Broadcast Notifications
          </button>
          <button
            onClick={() => setActiveSubTab("content")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeSubTab === "content"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FiBookOpen />
            Content & FAQs ({faqs.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: COMPLAINTS & GRIEVANCE MANAGEMENT */}
      {activeSubTab === "complaints" && (
        <div className="space-y-6">
          {/* Status Lifecycle Flow Indicator */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Grievance SLA Lifecycle:
            </div>
            <div className="flex items-center gap-2 text-xs font-bold overflow-x-auto">
              <span className="px-3 py-1 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
                1. Open
              </span>
              <span className="text-slate-400">→</span>
              <span className="px-3 py-1 rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/30">
                2. Assigned
              </span>
              <span className="text-slate-400">→</span>
              <span className="px-3 py-1 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                3. In Progress
              </span>
              <span className="text-slate-400">→</span>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                4. Resolved
              </span>
              <span className="text-slate-400">→</span>
              <span className="px-3 py-1 rounded-lg bg-slate-500/15 text-slate-400 border border-slate-500/30">
                5. Closed
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {["ALL", "OPEN", "IN PROGRESS", "RESOLVED", "CLOSED"].map((f) => (
              <button
                key={f}
                onClick={() => setComplaintFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  complaintFilter === f
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow"
                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Complaints Table */}
          <div className="rounded-2xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-black/30 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5">
                  <tr>
                    <th className="px-5 py-4 font-bold">Ticket ID</th>
                    <th className="px-5 py-4 font-bold">Citizen Petitioner</th>
                    <th className="px-5 py-4 font-bold">Grievance Category</th>
                    <th className="px-5 py-4 font-bold">Subject</th>
                    <th className="px-5 py-4 font-bold">Assigned To</th>
                    <th className="px-5 py-4 font-bold">Status</th>
                    <th className="px-5 py-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                  {filteredComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-cyan-500">
                        {c.id}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white text-xs">
                          {c.citizenName}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">{c.citizenEmail}</p>
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-purple-400">
                        {c.category}
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                        {c.subject}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400 font-medium">
                        {c.assignedTo}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            c.status === "Resolved" || c.status === "Closed"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : c.status === "In Progress"
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedComplaint(c);
                            setInternalNoteInput(c.internalNotes || "");
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: BROADCAST NOTIFICATIONS */}
      {activeSubTab === "notifications" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notification Composer */}
          <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FiSend className="text-purple-400" /> Dispatch Platform Broadcast
            </h3>
            <p className="text-xs text-slate-400">
              Send system announcements, scheduled maintenance notices, or targeted verification reminders.
            </p>

            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Target Audience
                </label>
                <select
                  value={notifForm.audience}
                  onChange={(e) => setNotifForm({ ...notifForm, audience: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                >
                  <option value="ALL_CITIZENS">All Registered Citizens (2,450)</option>
                  <option value="UNVERIFIED">Unverified Citizens Only (125)</option>
                  <option value="OFFICERS">Departmental PIO Officers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Channel</label>
                <select
                  value={notifForm.channel}
                  onChange={(e) => setNotifForm({ ...notifForm, channel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                >
                  <option value="IN_APP">In-App Notification Banner</option>
                  <option value="IN_APP_EMAIL">In-App + Official Email Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Notice Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Server Maintenance Window"
                  value={notifForm.title}
                  onChange={(e) => setNotifForm({ ...notifForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Announcement Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Official notice body..."
                  value={notifForm.message}
                  onChange={(e) => setNotifForm({ ...notifForm, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={sendingNotif}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 transition-all"
              >
                {sendingNotif ? "Broadcasting..." : "Dispatch Broadcast"}
              </button>
            </form>
          </div>

          {/* Broadcast History */}
          <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Dispatched Broadcast Log
            </h3>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{n.title}</h4>
                    <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {n.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Audience: {n.audience}</span>
                    <span>•</span>
                    <span>Channel: {n.channel}</span>
                    <span>•</span>
                    <span>Reach: {n.recipientsCount} users</span>
                    <span>•</span>
                    <span>{n.sentAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CONTENT & FAQS */}
      {activeSubTab === "content" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                RTI Knowledgebase & FAQs
              </h3>
              <p className="text-xs text-slate-400">
                Maintain public filing guidelines, statutory explanations, and citizen advice.
              </p>
            </div>
            <button
              onClick={() => setShowAddFaqModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <FiPlus /> Add Knowledge Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/20 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-md">
                    {faq.category}
                  </span>
                  <span className="text-xs text-slate-400">Published to Citizen Portal</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {faq.question}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPLAINT DETAIL & WORKFLOW MODAL */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/30 p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-white/10 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {selectedComplaint.id}
                  </span>
                  <h3 className="font-black text-slate-900 dark:text-white text-lg mt-0.5">
                    {selectedComplaint.subject}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Petitioner: {selectedComplaint.citizenName} ({selectedComplaint.citizenEmail})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <FiXCircle className="text-xl" />
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Citizen Grievance Description
                </h4>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-200">
                  {selectedComplaint.description}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Internal Administrative Notes & Resolution Memo
                </label>
                <textarea
                  rows={3}
                  value={internalNoteInput}
                  onChange={(e) => setInternalNoteInput(e.target.value)}
                  placeholder="Record internal troubleshooting actions..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Advance Workflow Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["In Progress", "Resolved", "Closed"].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleUpdateComplaintStatus(selectedComplaint.id, s)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedComplaint.status === s
                          ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                          : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD FAQ MODAL */}
      <AnimatePresence>
        {showAddFaqModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#11092a] border border-slate-200 dark:border-purple-500/30 p-6 shadow-2xl space-y-4"
            >
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                Add Knowledgebase FAQ
              </h3>
              <form onSubmit={handleAddFaq} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Statutory Deadlines"
                    value={newFaq.category}
                    onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Question</label>
                  <input
                    type="text"
                    required
                    placeholder="Question title"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Official Guidance Answer</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide clear legal guidance..."
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddFaqModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                  >
                    Publish FAQ
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
