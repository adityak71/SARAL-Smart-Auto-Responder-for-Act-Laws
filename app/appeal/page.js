"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Hourglass as IcHourglass, RefreshCw as IcRefreshCw, Scale as IcScale, Shield as IcShield, TriangleAlert as IcTriangleAlert } from "lucide-react";

const APPEAL_GROUNDS = [
  {
    id: "NO_RESPONSE_WITHIN_30_DAYS",
    title: "No Response within 30 Days (Deemed Refusal)",
    section: "Section 7(1) & 19(1)",
    description:
      "Statutory 30-day mandate elapsed without any formal response, interim communication, or fee demand from the PIO.",
    icon: <IcHourglass className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    id: "INCOMPLETE_OR_MISLEADING",
    title: "Incomplete, Misleading, or Distorted Information",
    section: "Section 19(1)(b)",
    description:
      "The information furnished by the PIO was partial, evasive, factually incorrect, or did not answer specific queries.",
    icon: <IcTriangleAlert className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    id: "UNREASONABLE_FEE_DEMAND",
    title: "Exorbitant / Unreasonable Additional Fee Demand",
    section: "Section 7(3)",
    description:
      "The PIO demanded excessive computation fees without statutory justification or calculation basis.",
    icon: "₹",
  },
  {
    id: "WRONGFUL_REJECTION_SEC8",
    title: "Wrongful Rejection under Section 8 Exemptions",
    section: "Section 8(1) & 8(2)",
    description:
      "The application was denied citing exemptions without demonstrating harm to state interest or considering larger public interest.",
    icon: <IcShield className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    id: "TRANSFER_DELAY_SEC6",
    title: "Failure to Transfer under Section 6(3) within 5 Days",
    section: "Section 6(3)",
    description:
      "The public authority failed to forward the application to the competent department within the statutory 5-day limit.",
    icon: <IcRefreshCw className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
  },
];

const STANDARD_RELIEFS = [
  "Direct the PIO to furnish complete certified copies of all requested records without delay.",
  "Direct that information be provided free of cost under Section 7(6) due to PIO delay beyond 30 days.",
  "Allow physical inspection of primary files, measurement books, and register records under Section 2(j)(i).",
  "Recommend departmental disciplinary inquiry against the defaulting PIO under Section 20.",
];

function AppealForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledAppId = searchParams.get("id") || searchParams.get("applicationNumber") || "";

  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(prefilledAppId);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedGround, setSelectedGround] = useState(APPEAL_GROUNDS[0].id);
  const [statementOfFacts, setStatementOfFacts] = useState("");
  const [selectedReliefs, setSelectedReliefs] = useState([STANDARD_RELIEFS[0], STANDARD_RELIEFS[1]]);
  const [customRelief, setCustomRelief] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppeal, setSubmittedAppeal] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Fetch citizen applications to select from
  useEffect(() => {
    async function loadApps() {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.applications)) {
            setApplications(data.applications);
            if (prefilledAppId) {
              const matched = data.applications.find(
                (a) => a.applicationNumber === prefilledAppId || a.id === prefilledAppId
              );
              if (matched) {
                setSelectedApp(matched);
                setSelectedAppId(matched.id);
              }
            } else if (data.applications.length > 0) {
              setSelectedApp(data.applications[0]);
              setSelectedAppId(data.applications[0].id);
            }
          }
        }
      } catch (err) {
        console.warn("Could not load applications for appeal:", err);
      }
    }
    loadApps();
  }, [prefilledAppId]);

  // Update selected application object when dropdown/id changes
  const handleSelectApp = (id) => {
    setSelectedAppId(id);
    const found = applications.find((a) => a.id === id || a.applicationNumber === id);
    setSelectedApp(found || null);
  };

  // Generate automated statement of facts based on selected ground and application
  const handleGenerateStatement = () => {
    const appRef = selectedApp?.applicationNumber || selectedAppId || "the original petition";
    const dept = selectedApp?.department?.name || selectedApp?.targetAuthority || "Public Authority";
    const filedDate = selectedApp?.dateFiled
      ? new Date(selectedApp.dateFiled).toLocaleDateString("en-IN")
      : "the date of filing";

    const groundObj = APPEAL_GROUNDS.find((g) => g.id === selectedGround);
    const draft = `1. The Appellant filed an application under Section 6(1) of the RTI Act 2005 bearing Reference No. ${appRef} before the Public Information Officer (PIO), ${dept} on ${filedDate}.\n\n2. The statutory period of 30 days mandated under Section 7(1) of the Act expired without compliance. The Appellant has not received any formal response, nor was any communication regarding additional fees or transfer issued within the statutory timeframe.\n\n3. Consequently, under Section 7(2) of the Act, the PIO is deemed to have refused the request for information.\n\n4. Being aggrieved by the deemed refusal and failure of the PIO, the Appellant respectfully files this First Appeal under Section 19(1) of the Act before the First Appellate Authority (FAA).`;
    setStatementOfFacts(draft);
  };

  const toggleRelief = (relief) => {
    if (selectedReliefs.includes(relief)) {
      setSelectedReliefs(selectedReliefs.filter((r) => r !== relief));
    } else {
      setSelectedReliefs([...selectedReliefs, relief]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedAppId) {
      setErrorMsg("Please select or enter the RTI application reference.");
      return;
    }

    const groundObj = APPEAL_GROUNDS.find((g) => g.id === selectedGround);
    const finalGrounds = `${groundObj?.title || selectedGround} (${groundObj?.section || "Section 19(1)"})`;
    const fullRelief = [...selectedReliefs];
    if (customRelief.trim()) fullRelief.push(customRelief.trim());

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/appeals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedAppId,
          groundsOfAppeal: finalGrounds,
          statementOfFacts: statementOfFacts || "Appeal filed under Section 19(1) due to non-response.",
          reliefSought: fullRelief.join(" | "),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedAppeal(data.appeal);
      } else {
        setErrorMsg(data.error || "Failed to submit appeal. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error occurred while submitting appeal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If appeal successfully registered, show receipt view
  if (submittedAppeal) {
    const deadlineDate = new Date(submittedAppeal.appealDeadline).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1a2330] border border-purple-500/30 shadow-2xl text-slate-800 dark:text-slate-100 space-y-6 animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto">
          ✓
        </div>

        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Section 19(1) Statutory Appeal Admitted
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            First Appeal Successfully Registered
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Assigned to First Appellate Authority (FAA) Directorate under the RTI Act, 2005
          </p>
        </div>

        {/* Appeal Receipt Card */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
            <span className="text-slate-500">Appeal Dossier No:</span>
            <span className="font-bold text-purple-700 dark:text-purple-300 text-sm">
              {submittedAppeal.appealNumber}
            </span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
            <span className="text-slate-500">Original Petition Ref:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {selectedApp?.applicationNumber || selectedAppId}
            </span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
            <span className="text-slate-500">Statutory Disposal Clock:</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">
              30 Days (Due: {deadlineDate})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Statutory Fee:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              ₹0 (Free under RTI Rules)
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-200 leading-relaxed">
          <IcScale className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /> <strong>Section 19(6) Mandate:</strong> An appeal under subsection (1) shall be disposed of within thirty days of receipt, or within extended period not exceeding forty-five days for reasons to be recorded in writing.
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={`/tracking?id=${selectedApp?.applicationNumber || selectedAppId}`}
            className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs text-center shadow-md transition"
          >
            Track in Live Dossier →
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 font-semibold text-xs text-center transition"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center justify-between">
          <span>{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg("")} className="text-rose-500 hover:text-rose-700 ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Step 1: Target Application */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1a2330] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Select Aggrieved RTI Petition
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select from your filed petitions or enter reference number
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Your Filed Petitions:
            </label>
            <select
              value={selectedAppId}
              onChange={(e) => handleSelectApp(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/10 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">-- Choose RTI Petition --</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">
                  {app.applicationNumber || app.id} — {app.title?.substring(0, 40)}...
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Or Enter Reference ID Manually:
            </label>
            <input
              type="text"
              value={selectedAppId}
              onChange={(e) => handleSelectApp(e.target.value)}
              placeholder="e.g. SARAL-2026-00124"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/10 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>
        </div>

        {selectedApp && (
          <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 text-xs space-y-1">
            <span className="font-mono font-bold text-purple-700 dark:text-purple-300">
              {selectedApp.applicationNumber || selectedApp.id}
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white">{selectedApp.title}</h4>
            <p className="text-slate-500 dark:text-slate-400">
              Authority: {selectedApp.department?.name || selectedApp.targetAuthority || "Public Authority"} • Status: {selectedApp.status}
            </p>
          </div>
        )}
      </div>

      {/* Step 2: Grounds of Appeal */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1a2330] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Statutory Grounds of First Appeal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select the legal grievance under Section 19(1) of RTI Act 2005
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {APPEAL_GROUNDS.map((ground) => {
            const isSelected = selectedGround === ground.id;
            return (
              <div
                key={ground.id}
                onClick={() => setSelectedGround(ground.id)}
                className={`p-4 rounded-2xl border transition-colors cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? "bg-purple-50 dark:bg-purple-950/50 border-purple-500 shadow-md ring-1 ring-purple-500"
                    : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 hover:border-purple-400"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{ground.icon}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {ground.title}
                    </h4>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 shrink-0 font-bold">
                    {ground.section}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {ground.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 3: Statement of Facts */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1a2330] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Statement of Facts & Grievance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed timeline and chronology of the citizen petition
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateStatement}
            className="px-4 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition"
          >
            <span>SARAL AI Auto-Draft</span>
          </button>
        </div>

        <textarea
          rows={6}
          value={statementOfFacts}
          onChange={(e) => setStatementOfFacts(e.target.value)}
          placeholder="State the chronology of events: date of filing, lack of response or defect in the response, and grounds for appeal..."
          required
          className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:border-purple-500 resize-none font-sans"
        />
      </div>

      {/* Step 4: Reliefs Sought from FAA */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1a2330] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-sm">
            4
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Prayer / Relief Sought from FAA
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Check all statutory remedies you request the First Appellate Authority to order
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {STANDARD_RELIEFS.map((relief) => {
            const isChecked = selectedReliefs.includes(relief);
            return (
              <label
                key={relief}
                onClick={() => toggleRelief(relief)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${
                  isChecked
                    ? "bg-purple-50/70 dark:bg-purple-950/40 border-purple-500/60 text-slate-900 dark:text-white"
                    : "bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="mt-0.5 accent-purple-600 rounded"
                />
                <span>{relief}</span>
              </label>
            );
          })}

          <div className="pt-2">
            <input
              type="text"
              value={customRelief}
              onChange={(e) => setCustomRelief(e.target.value)}
              placeholder="Any additional specific relief or prayer to the First Appellate Authority..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/10 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Submission Bar */}
      <div className="p-6 rounded-3xl bg-purple-950/60 border border-purple-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-300 space-y-0.5">
          <p className="font-semibold text-white">Zero Filing Fee for Section 19(1) Appeals</p>
          <p className="text-slate-400">Statutory 30-day disposal clock begins immediately upon submission.</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Registering Appeal...</span>
            </>
          ) : (
            <span>Submit Section 19(1) First Appeal →</span>
          )}
        </button>
      </div>
    </form>
  );
}

export default function AppealPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121821] py-12 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-rose-700 dark:text-rose-300">
            <span>Right to Information Act, 2005 • Section 19(1)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            File Statutory First Appeal
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            If the Public Information Officer has failed to respond within 30 days, or provided incomplete or misleading records, file your statutory appeal before the First Appellate Authority (FAA).
          </p>
        </div>

        <Suspense
          fallback={
            <div className="p-12 text-center text-slate-500">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs">Loading appeal interface...</p>
            </div>
          }
        >
          <AppealForm />
        </Suspense>
      </div>
    </div>
  );
}
