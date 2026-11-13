/**
 * SARAL Profile Data - Role-Based Schemas (Citizen, Officer, Admin)
 * Structured with statutory compliance indicators under RTI Act 2005 & DPDP Act 2023.
 */

export const citizenProfileData = {
  personal: {
    fullName: "Rahul Sharma",
    careOf: "Shri Kailash Sharma",
    email: "rahul.sharma@citizen.in",
    phone: "+91 98260-12345",
    gender: "Male",
    dob: "14 Aug 1996",
    preferredLanguage: "Hindi & Hinglish (हिंदी / हिंग्लिश)",
    bplStatus: "Non-BPL (General Category • ₹10 Statutory Fee)",
  },
  verification: {
    digiLockerId: "DL-IND-90218821",
    verificationStatus: "Verified",
    verifiedOn: "12 Jan 2026, 14:32 IST",
    aadhaarMasked: "XXXX-XXXX-4912",
    voterId: "MP/38/219/098124",
    kycLevel: "Level 3 (Sovereign Digital Identity)",
  },
  address: {
    addressLine: "Ward No. 4, Village Pipariya",
    panchayat: "Gram Panchayat Pipariya",
    block: "Pipariya Sub-Division",
    district: "Hoshangabad (Narmadapuram)",
    state: "Madhya Pradesh",
    pincode: "461775",
    type: "Rural Jurisdiction",
  },
  activityStats: {
    totalFiled: 3,
    underReview: 1,
    disposed: 2,
    firstAppeals: 0,
    complianceRate: "100%",
    avgTurnaroundDays: 21,
  },
  recentApplications: [
    {
      id: "SARAL-2026-00124",
      subject: "Pothole & Road Budget Audit",
      department: "Rural Development & Panchayati Raj",
      dateFiled: "18 Oct 2026",
      status: "UNDER_REVIEW",
      stage: 4,
      daysLeft: 12,
    },
    {
      id: "SARAL-2026-00089",
      subject: "Community Health Center Medicine Stock Register",
      department: "Health & Family Welfare",
      dateFiled: "04 Aug 2026",
      status: "DISPOSED",
      stage: 5,
      responseDoc: "Certified_Stock_Audit_Report.pdf",
    },
    {
      id: "SARAL-2026-00042",
      subject: "Panchayat Solar Streetlight Tender Inspection",
      department: "Public Works Department (PWD)",
      dateFiled: "15 May 2026",
      status: "DISPOSED",
      stage: 5,
      responseDoc: "Tender_Award_Agreement_Copy.pdf",
    },
  ],
  privacySettings: {
    dpdpConsent: "Active (Digital Personal Data Protection Act 2023)",
    dataEncryption: "256-bit AES End-to-End Vault",
    smsNotifications: true,
    emailNotifications: true,
    shareWithPublicAudits: false,
  },
};

export const officerProfileData = {
  official: {
    fullName: "Er. Rameshwar Verma",
    designation: "Executive Engineer & Designated PIO",
    employeeId: "EMP-MP-PWD-4091",
    email: "er.rameshwar@mp.gov.in",
    phone: "+91 7574-254190",
    serviceCadre: "MP State Engineering Service (Class I Gazetted)",
    joiningDate: "05 Jul 2012",
  },
  statutoryRole: {
    jurisdiction: "Section 5(1) Designated Public Information Officer (PIO)",
    actStatute: "Right to Information Act, 2005",
    publicAuthority: "Public Works Department (PWD)",
    ministry: "Ministry of Road Transport & State Highways",
    officeLocation: "Divisional Works Office, PWD Division II, Pipariya",
    firstAppellateAuthority: "Chief Engineer (Zonal Works Directorate, Bhopal)",
    faaContact: "faa.pwd.bhopal@mp.gov.in",
  },
  credentials: {
    dscTokenId: "NIC-CA-2026-9812-RSA",
    dscStatus: "Active & Hardware Validated",
    dscExpiry: "28 Nov 2028",
    govIntranetIp: "10.142.68.91 (MP-SWAN Gateway)",
    clearanceLevel: "Level 2 (Statutory Information Officer)",
  },
  performanceMetrics: {
    totalAssigned: 52,
    disposedOnTime: 49,
    currentlyActive: 3,
    avgDisposalDays: "18.2 Days",
    statutoryCeiling: "30 Days",
    complianceScore: "94.2%",
    transfersSec6_3: 4,
    appealsReceived: 1,
  },
  jurisdictionWards: [
    "Division II - Bitumen Road Maintenance & Tenders",
    "Sub-Division Pipariya - Rural Connectivity Bridges",
    "Zila Parishad Highway Link Works (Km 12 to 58)",
  ],
};

export const adminProfileData = {
  system: {
    fullName: "SARAL Central Administrator",
    designation: "Central Comptroller & System Superadmin",
    employeeId: "ADM-CENTRAL-001",
    email: "admin@saral-rti.in",
    phone: "+91 11-23381000",
    officeLocation: "National Transparency Innovation Hub, CGO Complex, New Delhi",
    authority: "Central Information Commission (CIC) Data Directorate",
  },
  security: {
    clearance: "Tier-1 Sovereign Master Access",
    twoFactorAuth: "Hardware Security Key (FIDO2 / YubiKey Active)",
    lastSecurityAudit: "03 Nov 2026, 03:00 AM IST (Zero Vulnerabilities)",
    ipRestriction: "Whitelisted Government Subnet (NIC / National Cloud)",
    sessionEncryption: "TLS 1.3 / ChaCha20-Poly1305",
  },
  platformStats: {
    totalCitizens: "12,480+",
    activeOfficers: "894 PIOs",
    connectedAuthorities: "342 Public Authorities",
    auditLogCount: "14,820 Events",
    systemUptime: "99.98%",
    databaseEngine: "Supabase PostgreSQL with pgvector (v0.8.2)",
  },
};
