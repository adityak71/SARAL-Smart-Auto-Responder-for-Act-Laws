"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { citizenProfileData } from "@/data/profileData";
import { Files as IcFiles, Hourglass as IcHourglass, MapPin as IcMapPin, Shield as IcShield, User as IcUser, Zap as IcZap } from "lucide-react";

export default function CitizenProfileView({ user, isEditing, onSaved }) {
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadCitizenStats() {
      try {
        const res = await fetch("/api/dashboard/stats?role=CITIZEN");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.stats && isMounted) {
            setLiveStats(data.stats);
          }
        }
      } catch (err) {
        console.warn("Citizen stats fetch error:", err);
      }
    }
    loadCitizenStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalFiled = liveStats
    ? (liveStats.activeFilings || 0) + (liveStats.resolvedFilings || 0)
    : citizenProfileData.activityStats.totalFiled;
  const underReview = liveStats ? liveStats.activeFilings || 0 : citizenProfileData.activityStats.underReview;
  const disposed = liveStats ? liveStats.resolvedFilings || 0 : citizenProfileData.activityStats.disposed;
  const complianceRate = liveStats ? "98.4%" : citizenProfileData.activityStats.complianceRate;

  const [formData, setFormData] = useState({
    phone: user?.phone || "",
    careOf: user?.citizenProfile?.careOf || (user?.fullName ? `Authorized Citizen: ${user.fullName}` : citizenProfileData.personal.careOf),
    preferredLanguage: user?.citizenProfile?.preferredLanguage || citizenProfileData.personal.preferredLanguage,
    addressLine: user?.citizenProfile?.addressLine || "",
    panchayat: user?.citizenProfile?.panchayat || "",
    district: user?.citizenProfile?.district || "",
    state: user?.citizenProfile?.state || "",
    pincode: user?.citizenProfile?.pincode || "",
    smsAlerts: citizenProfileData.privacySettings.smsNotifications,
    emailAlerts: citizenProfileData.privacySettings.emailNotifications,
  });

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="space-y-8">
      {/* 4 Quick Stat KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total RTIs Filed",
            val: totalFiled,
            sub: "All-time verified",
            icon: <IcFiles className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-500/10 border-purple-500/20",
          },
          {
            label: "Active In Review",
            val: underReview,
            sub: "Currently under review",
            icon: <IcHourglass className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/20",
          },
          {
            label: "Disposed & Received",
            val: disposed,
            sub: "Certified records provided",
            icon: "✓",
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10 border-emerald-500/20",
          },
          {
            label: "Compliance Track Record",
            val: complianceRate,
            sub: "Within 30 statutory days",
            icon: <IcZap className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />,
            color: "text-cyan-600 dark:text-cyan-400",
            bg: "bg-cyan-500/10 border-cyan-500/20",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-2xl p-4 sm:p-5 border  bg-white/70 dark:bg-[#1d2733]/70 shadow-sm ${stat.bg}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl">{stat.icon}</span>
              <span className={`text-2xl sm:text-3xl font-black ${stat.color}`}>{stat.val}</span>
            </div>
            <h4 className="mt-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">{stat.label}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Personal & Residential Dossier */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Citizen Particulars */}
          <div className="rounded-3xl bg-white/80 dark:bg-[#1d2733]/80 border border-slate-200 dark:border-white/10 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600/15 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-sm">
                  <IcUser className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Personal & Contact Details</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Citizen identification for Section 6(1) filing</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                DPDP Encrypted
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Full Legal Name</label>
                <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                  {user?.fullName || citizenProfileData.personal.fullName}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Care of / Father&apos;s Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.careOf}
                    onChange={(e) => handleChange("careOf", e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-black/30 border border-purple-500 text-slate-900 dark:text-white focus:outline-none"
                  />
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                    {formData.careOf}
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Official Email</label>
                <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium truncate">
                  {user?.email || citizenProfileData.personal.email}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Registered Phone</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-black/30 border border-purple-500 text-slate-900 dark:text-white focus:outline-none"
                  />
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                    {formData.phone}
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Preferred Language</label>
                {isEditing ? (
                  <select
                    value={formData.preferredLanguage}
                    onChange={(e) => handleChange("preferredLanguage", e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-[#1d2733] border border-purple-500 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Hindi & Hinglish (हिंदी / हिंग्लिश)">Hindi & Hinglish (हिंदी / हिंग्लिश)</option>
                    <option value="English (Standard Legal)">English (Standard Legal)</option>
                    <option value="Bilingual Hindi-English">Bilingual Hindi-English</option>
                  </select>
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                    {formData.preferredLanguage}
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Fee Exemption Category</label>
                <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                  {citizenProfileData.personal.bplStatus}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Jurisdiction & Postal Address */}
          <div className="rounded-3xl bg-white/80 dark:bg-[#1d2733]/80 border border-slate-200 dark:border-white/10 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-600/15 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 flex items-center justify-center font-bold text-sm">
                  <IcMapPin className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Statutory Postal Address</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Used for official speed-post responses from PIOs</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                {citizenProfileData.address.type}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Address Line / Street</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.addressLine}
                    onChange={(e) => handleChange("addressLine", e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-black/30 border border-purple-500 text-slate-900 dark:text-white focus:outline-none"
                  />
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                    {formData.addressLine}
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Gram Panchayat / Ward</label>
                <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                  {formData.panchayat}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">District</label>
                <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                  {formData.district}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">State</label>
                <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                  {formData.state}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">PIN Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleChange("pincode", e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-black/30 border border-purple-500 text-slate-900 dark:text-white focus:outline-none"
                  />
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                    {formData.pincode}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Sovereign Verification & Activity Stream */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 3: DigiLocker Sovereign Verification Card */}
          <div className="rounded-3xl bg-emerald-500/10 dark:bg-emerald-950/30 dark:via-[#1d2733]/80 border border-emerald-500/30 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl"><IcShield className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
                <div>
                  <h3 className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300 tracking-wider">
                    DigiLocker Verified
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">National Cloud Gateway</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-500 text-white shadow-sm">
                Active KYC
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">DigiLocker Reference:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{citizenProfileData.verification.digiLockerId}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">Aadhaar (Masked):</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{citizenProfileData.verification.aadhaarMasked}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">Voter Card Reference:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{citizenProfileData.verification.voterId}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">Verification Timestamp:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{citizenProfileData.verification.verifiedOn}</span>
              </div>

              <div className="pt-2">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  ✓ Verified identity allows 1-click filing without manual photo ID attachments under Section 6(1).
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Recent RTI Petitions */}
          <div className="rounded-3xl bg-white/80 dark:bg-[#1d2733]/80 border border-slate-200 dark:border-white/10 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Active & Past Petitions</h3>
              <Link href="/tracking" className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {citizenProfileData.recentApplications.map((app) => (
                <Link
                  key={app.id}
                  href={`/tracking?id=${app.id}`}
                  className="block p-3 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-purple-50 dark:hover:bg-purple-950/30 border border-slate-200 dark:border-white/5 transition group"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400 group-hover:underline">
                      {app.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                        app.status === "UNDER_REVIEW"
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {app.status === "UNDER_REVIEW" ? "In Review (Day 18)" : "Disposed"}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{app.subject}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{app.department}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
