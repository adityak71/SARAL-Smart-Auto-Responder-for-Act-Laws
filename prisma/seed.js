const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding SARAL Database...");

  // Clean existing data in reverse order of foreign keys
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.applicationDocument.deleteMany();
  await prisma.applicationTimeline.deleteMany();
  await prisma.firstAppeal.deleteMany();
  await prisma.rtiApplication.deleteMany();
  await prisma.officerProfile.deleteMany();
  await prisma.citizenProfile.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash("Password@123", 10);

  // 1. Departments
  const pwdDept = await prisma.department.create({
    data: {
      code: "PWD_MP",
      name: "Public Works Department (PWD)",
      ministry: "Ministry of Road Transport & State Highways",
      stateOrCentral: "Madhya Pradesh",
      nodalOffice: "Divisional Works Office, PWD Division II, Pipariya",
      contactEmail: "pwd.pipariya@mp.gov.in",
      contactPhone: "+91 7574-254190",
      avgResponseDays: 18,
    },
  });

  const ruralDept = await prisma.department.create({
    data: {
      code: "RURAL_DEV",
      name: "Rural Development & Panchayati Raj",
      ministry: "Ministry of Rural Development",
      stateOrCentral: "Central & State Joint",
      nodalOffice: "Zila Panchayat Bhavan, Hoshangabad",
      contactEmail: "zp.hoshangabad@mp.gov.in",
      contactPhone: "+91 7574-252110",
      avgResponseDays: 16,
    },
  });

  await prisma.department.createMany({
    data: [
      {
        code: "EDU_DEPT",
        name: "School Education & Literacy",
        ministry: "Ministry of Education",
        stateOrCentral: "Central",
        nodalOffice: "District Education Directorate",
        contactEmail: "education.nodal@gov.in",
        avgResponseDays: 14,
      },
      {
        code: "WATER_SAN",
        name: "Urban Water Supply & Sanitation",
        ministry: "Ministry of Jal Shakti",
        stateOrCentral: "State",
        nodalOffice: "Municipal Water Works Division",
        contactEmail: "waterworks@gov.in",
        avgResponseDays: 20,
      },
      {
        code: "HEALTH_FW",
        name: "Health & Family Welfare",
        ministry: "Ministry of Health & Family Welfare",
        stateOrCentral: "Central",
        nodalOffice: "Chief Medical Officer Directorate",
        contactEmail: "cmo.health@gov.in",
        avgResponseDays: 12,
      },
      {
        code: "CIVIL_SUP",
        name: "Food, Civil Supplies & Consumer Affairs",
        ministry: "Ministry of Consumer Affairs",
        stateOrCentral: "State",
        nodalOffice: "Civil Supplies Bhavan",
        contactEmail: "pds.support@gov.in",
        avgResponseDays: 15,
      },
    ],
  });

  // 2. Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@saral-rti.in",
      passwordHash: defaultPassword,
      fullName: "SARAL Central Administrator",
      phone: "+91 11-23381000",
      role: "ADMIN",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
      isDigiLockerVerified: true,
    },
  });

  // 3. Officer User (Er. Rameshwar Verma, PIO)
  const officerUser = await prisma.user.create({
    data: {
      email: "er.rameshwar@mp.gov.in",
      passwordHash: defaultPassword,
      fullName: "Er. Rameshwar Verma",
      phone: "+91 7574-254190",
      role: "OFFICER",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
      isDigiLockerVerified: true,
    },
  });

  const officerProfile = await prisma.officerProfile.create({
    data: {
      userId: officerUser.id,
      departmentId: pwdDept.id,
      employeeId: "EMP-MP-PWD-4091",
      designation: "Executive Engineer & Designated PIO",
      officeLocation: "Divisional Works Office, PWD Division II, Pipariya",
      isPio: true,
      isFaa: false,
    },
  });

  // 4. Citizen User (Rahul Sharma)
  const citizenUser = await prisma.user.create({
    data: {
      email: "rahul.sharma@citizen.in",
      passwordHash: defaultPassword,
      fullName: "Rahul Sharma",
      phone: "+91 98260-12345",
      role: "CITIZEN",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
      isDigiLockerVerified: true,
    },
  });

  const citizenProfile = await prisma.citizenProfile.create({
    data: {
      userId: citizenUser.id,
      addressLine: "Ward No. 4, Village Pipariya",
      district: "Hoshangabad",
      state: "Madhya Pradesh",
      pincode: "461775",
      digiLockerId: "DL-IND-90218821",
    },
  });

  // 5. Sample RTI Application 1: SARAL-2026-00124 (Under Review)
  const dateFiled1 = new Date();
  dateFiled1.setDate(dateFiled1.getDate() - 18); // 18 days ago
  const deadline1 = new Date(dateFiled1);
  deadline1.setDate(deadline1.getDate() + 30); // 30-day statutory window

  const rtiApp = await prisma.rtiApplication.create({
    data: {
      applicationNumber: "SARAL-2026-00124",
      citizenId: citizenProfile.id,
      departmentId: pwdDept.id,
      assignedOfficerId: officerProfile.id,
      title: "Gram Panchayat Road Construction & Contractor Budget Allocation",
      subject: "Pothole & Road Budget Audit",
      rawCitizenPrompt:
        "Mere gaon ke road banne ka kitna budget pass hua tha aur kis thekedar ko tender mila? Kaam kab khatam hona tha aur abhi tak kitne paise release hue?",
      structuredClauses: JSON.stringify([
        "Certified copy of Sanctioned Administrative & Financial Approval (A&F Order) for 3.8 km bitumen road stretch in Gram Panchayat Pipariya.",
        "Name, GST Registration ID, and vendor details of the awarded contractor along with original completion milestone date.",
        "Itemized copy of Measurement Book (MB) recordings and Running Account (RA) bills cleared by the Sub-Divisional Officer as of September 2026.",
        "Reasons recorded in official file notes for the 8-month delay beyond the statutory contract period under General Financial Rules (GFR).",
      ]),
      targetAuthority: "Public Works Department (PWD) Division II",
      dateFiled: dateFiled1,
      statutoryDeadline: deadline1,
      isLifeOrLiberty: false,
      currentStage: 4, // In Review
      status: "UNDER_REVIEW",
      feeStatus: "PAID",
      feeAmount: 10.0,
      paymentTxnId: "TXN-BHARATKOSH-98218731",
      aiDraftSummary:
        "Administrative Approval of ₹42,50,000 was sanctioned under Mukhya Mantri Gram Sadak Yojana. Three Running Account (RA) bills amounting to ₹28,40,000 have been disbursed as per measurement book entries. Work was delayed due to monsoon; revised completion date is 30 Nov 2026.",
      suggestedSources: JSON.stringify([
        "PWD_Pipariya_Works_Register_2025_26.pdf",
        "Measurement_Book_Vol_IV_P38.pdf",
        "Contractor_Agreement_ShreeRam_Infra.pdf",
      ]),
    },
  });

  // Sample RTI Application 2: SARAL-2026-00089 (Resolved / Response Dispatched)
  const dateFiled2 = new Date();
  dateFiled2.setDate(dateFiled2.getDate() - 25);
  const deadline2 = new Date(dateFiled2);
  deadline2.setDate(deadline2.getDate() + 30);
  const dispatchedAt2 = new Date();
  dispatchedAt2.setDate(dispatchedAt2.getDate() - 3);

  const rtiApp2 = await prisma.rtiApplication.create({
    data: {
      applicationNumber: "SARAL-2026-00089",
      citizenId: citizenProfile.id,
      departmentId: pwdDept.id,
      assignedOfficerId: officerProfile.id,
      title: "Government Primary School Drinking Water Pipeline Sanction",
      subject: "Safe Drinking Water Infrastructure",
      rawCitizenPrompt:
        "School mein safe drinking water facility kab lagai jayegi aur budget kitna allocated tha?",
      structuredClauses: JSON.stringify([
        "Copy of sanction order for RO water filtration unit at Government Primary School Pipariya.",
        "Expenditure voucher details and vendor inspection certificate.",
      ]),
      targetAuthority: "Public Works Department (Water Works Section)",
      dateFiled: dateFiled2,
      statutoryDeadline: deadline2,
      responseDispatchedAt: dispatchedAt2,
      isLifeOrLiberty: false,
      currentStage: 5,
      status: "RESPONSE_DISPATCHED",
      feeStatus: "PAID",
      feeAmount: 10.0,
      paymentTxnId: "TXN-BHARATKOSH-87123491",
      officialResponse:
        "Certified copy of Work Completion Certificate No. WCC/2026/89 along with water quality test report (BIS 10500:2012 certified) enclosed. Project completed on 15 Oct 2026 with total outlay of ₹3,45,000.",
      aiDraftSummary:
        "Project completed and inspected. Total sanctioned outlay ₹3,45,000 fully verified.",
      suggestedSources: JSON.stringify(["Water_Unit_Completion_Cert.pdf"]),
    },
  });

  // Sample RTI Application 3: SARAL-2026-00042 (Section 19 First Appeal Pending)
  const dateFiled3 = new Date();
  dateFiled3.setDate(dateFiled3.getDate() - 35); // 35 days ago (Overdue 30 days)
  const deadline3 = new Date(dateFiled3);
  deadline3.setDate(deadline3.getDate() + 30);

  const rtiApp3 = await prisma.rtiApplication.create({
    data: {
      applicationNumber: "SARAL-2026-00042",
      citizenId: citizenProfile.id,
      departmentId: ruralDept.id,
      title: "Community Health Center Medicine Stock & Doctor Duty Rosters",
      subject: "Public Healthcare Accountability",
      rawCitizenPrompt:
        "CHC Pipariya mein essential medicines available kyun nahi hain aur doctor roster details di jayein.",
      structuredClauses: JSON.stringify([
        "Certified stock ledger copy for essential life-saving drugs at CHC Pipariya for June-August 2026.",
        "Biometric attendance log of designated Medical Officers.",
      ]),
      targetAuthority: "Chief Medical Officer Directorate",
      dateFiled: dateFiled3,
      statutoryDeadline: deadline3,
      isLifeOrLiberty: false,
      currentStage: 4,
      status: "FIRST_APPEAL_PENDING",
      feeStatus: "PAID",
      feeAmount: 10.0,
      paymentTxnId: "TXN-BHARATKOSH-65129840",
    },
  });

  // First Appeal for Application 3
  const appealDeadline = new Date();
  appealDeadline.setDate(appealDeadline.getDate() + 30); // 30-day first appeal disposal clock

  await prisma.firstAppeal.create({
    data: {
      appealNumber: "APPEAL-2026-00019",
      applicationId: rtiApp3.id,
      citizenId: citizenProfile.id,
      groundsOfAppeal:
        "The 30-day statutory period mandated under Section 7(1) of the RTI Act 2005 expired without any formal response or disclosure from the designated Public Information Officer.",
      appealDeadline: appealDeadline,
      status: "PENDING",
      orderSummary:
        "First Appellate Authority notice issued to PIO to produce records within 15 days.",
    },
  });

  // 6. Application Timeline
  await prisma.applicationTimeline.createMany({
    data: [
      {
        applicationId: rtiApp.id,
        stage: 1,
        title: "Application Drafted & AI-Structured",
        description: "Citizen input processed by SARAL NLP Copilot into Section 6(1) compliant clauses.",
        completed: true,
        active: false,
      },
      {
        applicationId: rtiApp.id,
        stage: 2,
        title: "Treasury Fee Paid & Submitted",
        description: "Statutory fee ₹10 verified via treasury gateway. Acknowledgement receipt generated.",
        completed: true,
        active: false,
      },
      {
        applicationId: rtiApp.id,
        stage: 3,
        title: "Assigned to Public Information Officer (PIO)",
        description: "Forwarded to Er. Rameshwar Verma, Executive Engineer, PWD Division II.",
        completed: true,
        active: false,
      },
      {
        applicationId: rtiApp.id,
        stage: 4,
        title: "Records Retrieval & Departmental Review",
        description: "Measurement books and contractor muster rolls requisitioned from field assistant engineer.",
        completed: true,
        active: true,
      },
      {
        applicationId: rtiApp.id,
        stage: 5,
        title: "Official Response & Certified Documents",
        description: "Official certified ledger copies and approved response memorandum to be dispatched.",
        completed: false,
        active: false,
      },
    ],
  });

  // 7. Attached Documents
  await prisma.applicationDocument.createMany({
    data: [
      {
        applicationId: rtiApp.id,
        name: "Application_Acknowledgement_Receipt_SARAL-00124.pdf",
        fileUrl: "/docs/receipt_00124.pdf",
        fileSize: "348 KB",
        fileType: "pdf",
        category: "TREASURY_RECEIPT",
        isCertified: true,
      },
      {
        applicationId: rtiApp.id,
        name: "Section_6_1_Statutory_Petition_Draft.pdf",
        fileUrl: "/docs/petition_00124.pdf",
        fileSize: "512 KB",
        fileType: "pdf",
        category: "PETITION",
        isCertified: true,
      },
    ],
  });

  // 8. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: citizenUser.id,
        title: "Statutory Review Active",
        message: "Your RTI SARAL-2026-00124 is currently in departmental review. 12 days remain in the 30-day statutory window.",
        type: "CLOCK_WARNING",
        link: "/tracking?id=SARAL-2026-00124",
      },
      {
        userId: officerUser.id,
        title: "New RTI Assigned to Division II",
        message: "SARAL-2026-00124 (Gram Panchayat Pipariya Road) pending review. AI memorandum generated.",
        type: "ASSIGNMENT",
        link: "/dashboard",
      },
    ],
  });

  // 9. Initial Audit Log
  await prisma.auditLog.create({
    data: {
      userId: citizenUser.id,
      action: "RTI_SUBMITTED",
      entityName: "RtiApplication",
      entityId: rtiApp.id,
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
  });

  console.log("✅ SARAL Database Seeded Successfully!");
  console.log(`👤 Admin: admin@saral-rti.in (Password: Password@123)`);
  console.log(`👷 Officer: er.rameshwar@mp.gov.in (Password: Password@123)`);
  console.log(`🧑 Citizen: rahul.sharma@citizen.in (Password: Password@123)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
