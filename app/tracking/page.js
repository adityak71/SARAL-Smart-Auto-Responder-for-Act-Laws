"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import TrackingSearchBar from "@/components/tracking/TrackingSearchBar";
import TrackingDetailCard from "@/components/tracking/TrackingDetailCard";
import ApplicationTimeline from "@/components/tracking/ApplicationTimeline";
import StatutoryClock from "@/components/tracking/StatutoryClock";
import OfficerDetailsCard from "@/components/tracking/OfficerDetailsCard";
import { fetchApplication } from "@/redux/slices/trackingSlice";

function TrackingContent() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { selectedApplication, searchStatus } = useSelector((state) => state.tracking);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      dispatch(fetchApplication(id));
    }
  }, [searchParams, dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      {/* Search Header Banner */}
      <TrackingSearchBar />

      {/* Main Grid or Clean State */}
      {selectedApplication ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Dossier Details & Timeline (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            <TrackingDetailCard application={selectedApplication} />
            <ApplicationTimeline application={selectedApplication} />
          </div>

          {/* Right Column: Statutory Clock & Officer Information (5 Cols) */}
          <div className="lg:col-span-5 space-y-8 sticky top-24">
            <StatutoryClock application={selectedApplication} />
            <OfficerDetailsCard application={selectedApplication} />
          </div>
        </div>
      ) : (
        <div className="w-full py-16 px-6 text-center rounded-3xl bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-3xl mb-4 text-purple-600 dark:text-purple-400">
            🔍
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Enter Application Reference ID
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mt-1.5 leading-relaxed">
            Apna RTI application reference number upar enter karein (jaise <code className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 font-mono text-purple-700 dark:text-purple-300">SARAL-2026-00000</code>) aur &ldquo;Track Status&rdquo; par click karein.
          </p>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-[#08031d] text-slate-800 dark:text-slate-100 flex flex-col antialiased transition-colors">
      <main className="flex-1">
        <Suspense fallback={<div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading Tracking Dossier...</div>}>
          <TrackingContent />
        </Suspense>
      </main>
    </div>
  );
}
