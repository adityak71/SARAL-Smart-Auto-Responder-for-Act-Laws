/**
 * Realistic notification feed data for the SARAL Citizen & Officer portal.
 * Matches reference designs from reference/saral_citizen_notifications_light_mode.
 */
export const initialNotifications = [
  {
    id: "notif-1",
    title: "First Appeal Window Opening in 48 Hours",
    message:
      "PWD Road Audit (#SARAL-2026-00124): PIO has not furnished certified ledger entries by Day 28. SARAL AI Copilot has auto-structured your statutory First Appeal memorandum under Section 19(1).",
    category: "Urgent • Sec 19(1)",
    type: "urgent",
    appId: "SARAL-2026-00124",
    timeAgo: "18m ago",
    timestamp: "2026-10-31T15:45:00Z",
    unread: true,
    actionLabel: "Review & Dispatch Appeal",
    actionLink: "/tracking?id=SARAL-2026-00124",
  },
  {
    id: "notif-2",
    title: "Certified Response Uploaded & Digitally Sealed",
    message:
      "Primary School Laboratory Grant (#SARAL-2026-00089): Department of School Education has released the certified expenditure voucher (32 pages) and vendor work orders.",
    category: "Milestone Response",
    type: "milestone",
    appId: "SARAL-2026-00089",
    timeAgo: "2h ago",
    timestamp: "2026-10-31T14:00:00Z",
    unread: true,
    actionLabel: "Download Certified PDF",
    actionLink: "/tracking?id=SARAL-2026-00089",
  },
  {
    id: "notif-3",
    title: "Application Assigned to Public Information Officer (PIO)",
    message:
      "Drinking Water Pipeline Audit (#SARAL-2026-00155): Successfully transferred to Municipal Corporation PIO, Engineering Works Division. Statutory 30-day response clock initiated.",
    category: "Department Assignment",
    type: "info",
    appId: "SARAL-2026-00155",
    timeAgo: "1d ago",
    timestamp: "2026-10-30T10:30:00Z",
    unread: true,
    actionLabel: "View Timeline",
    actionLink: "/tracking?id=SARAL-2026-00155",
  },
  {
    id: "notif-4",
    title: "Treasury Fee Verified via Bharatkosh",
    message:
      "Statutory application fee of ₹10 for Application #SARAL-2026-00201 has been settled directly to the Consolidated Fund of India receipt head.",
    category: "Payment Confirmed",
    type: "success",
    appId: "SARAL-2026-00201",
    timeAgo: "2d ago",
    timestamp: "2026-10-29T09:15:00Z",
    unread: false,
    actionLabel: "View Treasury Receipt",
    actionLink: "/tracking?id=SARAL-2026-00201",
  },
];
