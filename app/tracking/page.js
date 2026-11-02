"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import TrackingSearchBar from "@/components/tracking/TrackingSearchBar";
import TrackingDetailCard from "@/components/tracking/TrackingDetailCard";
import ApplicationTimeline from "@/components/tracking/ApplicationTimeline";
import StatutoryClock from "@/components/tracking/StatutoryClock";
import OfficerDetailsCard from "@/components/tracking/OfficerDetailsCard";
import { selectApplicationById } from "@/redux/slices/trackingSlice";

function TrackingContent() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const selectedApplication = useSelector((state) => state.tracking.selectedApplication);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      dispatch(selectApplicationById(id));
    }
  }, [searchParams, dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      {/* Search Header Banner */}
      <TrackingSearchBar />

      {/* Main Grid: Details & Timeline */}
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
