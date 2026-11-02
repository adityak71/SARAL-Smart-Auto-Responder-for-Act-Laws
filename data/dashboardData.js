/**
 * Dashboard metrics, analytics, and departmental information for Citizen and Officer workspaces.
 */
export const citizenDashboardStats = {
  activeFilings: 3,
  resolvedFilings: 9,
  appealsPending: 1,
  averageResponseDays: 19,
  statutorySuccessRate: "94.8%",
  totalExpenditureDisclosed: "₹1.42 Cr",
};

export const officerDashboardStats = {
  assignedApplications: 7,
  pendingExamination: 3,
  aiDraftsGenerated: 4,
  dispatchedToday: 2,
  averageReviewHours: "38h",
  complianceRatio: "98.1%",
};

export const departmentCatalog = [
  { id: "pwd", name: "Public Works Department (PWD)", nodalOfficers: 42, avgDays: 18 },
  { id: "rural", name: "Rural Development & Panchayati Raj", nodalOfficers: 68, avgDays: 16 },
  { id: "education", name: "School Education & Literacy", nodalOfficers: 54, avgDays: 14 },
  { id: "water", name: "Urban Water Supply & Sanitation", nodalOfficers: 36, avgDays: 20 },
  { id: "health", name: "Health & Family Welfare", nodalOfficers: 48, avgDays: 12 },
  { id: "pds", name: "Food, Civil Supplies & Consumer Affairs", nodalOfficers: 39, avgDays: 15 },
];

export const officerReviewQueue = [
  {
    id: "SARAL-2026-00124",
    subject: "Gram Panchayat Pipariya Bitumen Road Fund Audit",
    citizen: "Rahul Sharma",
    dateReceived: "15 Oct 2026",
    daysRemaining: 12,
    urgency: "Normal",
    suggestedDepartment: "PWD Division II",
    aiMatchScore: "99.1% Confidence",
    suggestedSources: [
      "PWD_Pipariya_Works_Register_2025_26.pdf",
      "Measurement_Book_Vol_IV_P38.pdf",
      "Contractor_Agreement_ShreeRam_Infra.pdf",
    ],
    draftSummary:
      "Administrative Approval of ₹42,50,000 was sanctioned under Mukhya Mantri Gram Sadak Yojana. Three Running Account (RA) bills amounting to ₹28,40,000 have been disbursed as per measurement book entries. Work was delayed due to monsoon; revised completion date is 30 Nov 2026.",
  },
  {
    id: "SARAL-2026-00155",
    subject: "Drinking Water Pipeline Leakage & Lab Reports",
    citizen: "Arvind Patel",
    dateReceived: "04 Oct 2026",
    daysRemaining: 1,
    urgency: "Critical - Day 29 Reached",
    suggestedDepartment: "VMC Water Works South Zone",
    aiMatchScore: "97.8% Confidence",
    suggestedSources: ["VMC_Potability_Lab_Results_AugSep26.pdf"],
    draftSummary:
      "Water potability testing was conducted on 12 Sep 2026 and 26 Sep 2026. Secondary distribution line was found compromised and replacement of 120-meter ductile iron pipeline is currently 80% complete.",
  },
];
