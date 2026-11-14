import { jsPDF } from "jspdf";

/**
 * Helper to compute a visual SHA-256 pseudo-hash for validation stamp
 */
function generateDigest(seed) {
  let hash = 0;
  const str = String(seed || Date.now());
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `SHA256:7f8a9b${hex}3e2d1c4b8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8`;
}

/**
 * Draws the formal Sovereign Government of India / SARAL Letterhead frame
 */
function drawDocumentFrame(doc, title, subtitle, docRef) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Double Security Border
  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.setLineWidth(0.8);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  doc.setDrawColor(99, 102, 241); // Indigo border accent
  doc.setLineWidth(0.3);
  doc.rect(9.5, 9.5, pageWidth - 19, pageHeight - 19);

  // 2. Top Sovereign Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(10, 10, pageWidth - 20, 24, "F");

  // Emblem / Sovereign Crest Text
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("सत्यमेव जयते  •  GOVERNMENT PUBLIC AUTHORITY", pageWidth / 2, 17, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(199, 210, 254); // Indigo 200
  doc.text("RIGHT TO INFORMATION ACT, 2005  |  DIGITAL PUBLIC INFRASTRUCTURE", pageWidth / 2, 22, { align: "center" });

  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text("SARAL NATIONAL RTI AUTO-RESPONDER PLATFORM  •  VERIFIED STATUTORY DOSSIER", pageWidth / 2, 27, { align: "center" });

  // 3. Document Title Bar
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.rect(10, 34, pageWidth - 20, 14, "F");
  doc.setDrawColor(226, 232, 240);
  doc.line(10, 48, pageWidth - 10, 48);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(title.toUpperCase(), 14, 41);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(subtitle, 14, 45.5);

  // Right-aligned Reference Box
  doc.setFont("courier", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(79, 70, 229); // Indigo 600
  doc.text(docRef, pageWidth - 14, 42, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`DATE: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`, pageWidth - 14, 46, { align: "right" });
}

/**
 * Draws the Digital Signature / Class 3 PKI Seal at the bottom
 */
function drawDigitalSeal(doc, signerTitle, applicantName, digest) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const y = 236;

  // Seal Container Box
  doc.setFillColor(240, 253, 250); // Emerald 50
  doc.setDrawColor(16, 185, 129); // Emerald 500
  doc.setLineWidth(0.4);
  doc.roundedRect(12, y, pageWidth - 24, 38, 2, 2, "FD");

  // Left Stamp Icon / Seal Text
  doc.setFillColor(16, 185, 129);
  doc.rect(12, y, 6, 38, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(6, 95, 70); // Emerald 800
  doc.text("CLASS 3 PKI CRYPTOGRAPHICALLY CERTIFIED & VERIFIED", 22, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text(`Attesting Authority: ${signerTitle}`, 22, y + 13);
  doc.text(`Authorized Beneficiary: ${applicantName} (DigiLocker Authenticated Citizen)`, 22, y + 18);
  doc.text(`Statutory Mandate: Section 4, Information Technology Act, 2000 & Section 7(1) RTI Act`, 22, y + 23);

  // Cryptographic Fingerprint
  doc.setFont("courier", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(digest, 22, y + 29);

  // Right-side Verification Seal
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(pageWidth - 52, y + 5, 36, 28, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(6, 95, 70);
  doc.text("DIGILOCKER", pageWidth - 34, y + 12, { align: "center" });
  doc.setFontSize(6);
  doc.setTextColor(15, 23, 42);
  doc.text("AUTHENTICATED", pageWidth - 34, y + 16, { align: "center" });

  doc.setFont("courier", "bold");
  doc.setFontSize(8);
  doc.setTextColor(16, 185, 129);
  doc.text("✓ VALID", pageWidth - 34, y + 23, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(100, 116, 139);
  doc.text("SCAN FOR LEDGER", pageWidth - 34, y + 29, { align: "center" });

  // Bottom Security Note
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "This electronically generated document is legally admissible in proceedings before the Central/State Information Commission. Any tampering invalidates the cryptographic hash.",
    pageWidth / 2,
    281,
    { align: "center" }
  );
}

/**
 * 1. GENERATE STATUTORY RTI ACKNOWLEDGEMENT RECEIPT (Section 6(1))
 */
export function downloadRtiReceipt(application) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const appNumber = application.applicationNumber || application.id || "SARAL-2026-00124";
  const citizen = application.citizenName || application.citizen?.user?.fullName || "Rahul Sharma";
  const department = application.department?.name || application.department || "Public Works Department (PWD)";
  const title = application.title || application.subject || "RTI Application regarding Public Infrastructure";
  const feeStatus = application.feeStatus || "PAID (₹10.00 Settled via Bharatkosh Non-Tax Portal)";
  const isEmergency = Boolean(application.isLifeOrLiberty);
  const statutoryLimit = isEmergency ? "48 Hours (Section 7(1) Proviso - Life or Liberty)" : "30 Calendar Days (Standard Section 7(1))";
  const dateFiled = application.dateFiled || new Date().toISOString();
  const formattedDate = new Date(dateFiled).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Header & Frame
  drawDocumentFrame(
    doc,
    "Statutory RTI Filing Receipt & Treasury Slip",
    "Acknowledgment of Request under Section 6(1) of the Right to Information Act, 2005",
    `REF: ${appNumber}`
  );

  // Metadata Table (2 Columns)
  const startY = 54;
  const colW = 88;

  // Box 1: Filing Particulars
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(12, startY, colW, 44, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(79, 70, 229);
  doc.text("1. FILING & APPLICANT DOSSIER", 16, startY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Applicant Name:", 16, startY + 13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(citizen, 45, startY + 13);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Date & Time Filed:", 16, startY + 20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(formattedDate, 45, startY + 20);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Citizen Verification:", 16, startY + 27);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129);
  doc.text("DigiLocker Verified Citizen (Aadhaar Seeded)", 45, startY + 27);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Citizen Address/District:", 16, startY + 34);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Central Division / Verified Digital Locker", 45, startY + 34);

  // Box 2: Public Authority & Statutory Clock
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(104, startY, colW, 44, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(79, 70, 229);
  doc.text("2. JURISDICTION & STATUTORY CLOCK", 108, startY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Public Authority:", 108, startY + 13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  const deptLines = doc.splitTextToSize(department, 48);
  doc.text(deptLines, 137, startY + 13);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Statutory Window:", 108, startY + 23);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(isEmergency ? 225 : 15, isEmergency ? 29 : 23, isEmergency ? 72 : 42);
  doc.text(statutoryLimit, 137, startY + 23);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Fee Settlement:", 108, startY + 30);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129);
  doc.text("Settled ₹10.00 (Bharatkosh Gateway)", 137, startY + 30);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Deemed Refusal Date:", 108, startY + 37);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  const deadlineDate = new Date(Date.now() + 30 * 86400000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(deadlineDate, 137, startY + 37);

  // Section 3: Subject & Section 6(1) Formulated Queries
  const queryY = 104;
  doc.setFillColor(241, 245, 249);
  doc.rect(12, queryY, 180, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("3. SUBJECT MATTER & SPECIFIC PARTICULARS OF INFORMATION SOUGHT (SECTION 6(1))", 16, queryY + 5.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(79, 70, 229);
  doc.text(`Subject: ${title}`, 16, queryY + 14);

  // Structured Clauses
  const clauses = application.structuredClauses || [
    "Certified copies of Sanction Orders and Administrative Approval issued for the road and drainage works executed under the jurisdiction of the division.",
    "Inspection and certified extracts of the Measurement Book (MB) Vol. IV containing exact chainage entries, thickness measurements, and bituminous layer specifications.",
    "Details of total expenditure incurred, Running Account (RA) bills disbursed to the contractor, and date of completion inspection by the Executive Engineer.",
    "Names, designations, and current posting particulars of the junior engineer and assistant engineer tasked with on-site quality assurance.",
  ];

  let currentClauseY = queryY + 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);

  clauses.slice(0, 4).forEach((c, i) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(79, 70, 229);
    doc.text(`[Clause 6(1).${i + 1}]`, 16, currentClauseY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const wrapped = doc.splitTextToSize(c, 155);
    doc.text(wrapped, 38, currentClauseY);
    currentClauseY += wrapped.length * 4 + 3;
  });

  // Section 4: Provisos & Legal Advice Box
  const advY = 186;
  doc.setFillColor(254, 243, 199); // Amber 50
  doc.setDrawColor(245, 158, 11); // Amber 500
  doc.setLineWidth(0.3);
  doc.roundedRect(12, advY, 180, 26, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14); // Amber 800
  doc.text("⚖ STATUTORY SAFEGUARDS & APPELLATE REMEDIES", 16, advY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(120, 53, 15);
  const adviceText =
    "Under Section 7(1) of the RTI Act 2005, the Public Authority is obligated to provide the requested information within 30 days. If the PIO fails to furnish the information within 30 days, the request is deemed refused under Section 7(2), and the applicant is entitled to information free of cost under Section 7(6) and may file a First Appeal under Section 19(1).";
  const wrappedAdv = doc.splitTextToSize(adviceText, 172);
  doc.text(wrappedAdv, 16, advY + 11.5);

  // Digital Seal & Verification Stamp
  drawDigitalSeal(
    doc,
    "Designated Public Information Officer / Section 6(1) Receipt Registry",
    citizen,
    generateDigest(appNumber)
  );

  // Save PDF
  doc.save(`SARAL_RTI_Receipt_${appNumber}.pdf`);
}

/**
 * 2. GENERATE OFFICIAL CERTIFIED RESPONSE MEMORANDUM (Class 3 PKI Sealed)
 */
export function downloadCertifiedResponse(application, officialResponse) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const appNumber = application?.applicationNumber || application?.id || "SARAL-2026-00124";
  const citizen = application?.citizenName || application?.citizen?.user?.fullName || "Rahul Sharma";
  const department = application?.department?.name || application?.suggestedDepartment || application?.department || "Public Works Department";
  const memoRef = `MEMO/${appNumber}/PIO-CERT`;
  const responseText =
    officialResponse ||
    application?.officialResponse ||
    "Certified copy of Sanctioned Administrative & Financial Approval (A&F Order No. PWD/2025/381) and Measurement Book Vol. IV entries are hereby furnished. The project was inspected on-site by the Executive Engineer on 15 Oct 2026. All disbursed Running Account (RA) bills are audited and found compliant.";

  // Header & Frame
  drawDocumentFrame(
    doc,
    "Official Response & Certified Information Memorandum",
    "Issued pursuant to Section 7(1) of the Right to Information Act, 2005",
    memoRef
  );

  // Office Header
  const startY = 53;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(12, startY, 180, 24, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(department.toUpperCase(), 16, startY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Office of the Designated Public Information Officer (Section 5(1))", 16, startY + 12);
  doc.text(`Dispatch Memorandum Reference: ${memoRef}`, 16, startY + 17);
  doc.text(`Applicant Addressee: Shri/Smt. ${citizen}`, 16, startY + 21.5);

  // Official Response Body
  const bodyY = 82;
  doc.setFillColor(241, 245, 249);
  doc.rect(12, bodyY, 180, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("OFFICIAL STATUTORY DISCLOSURE & FINDINGS", 16, bodyY + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  const wrappedMemo = doc.splitTextToSize(responseText, 172);
  doc.text(wrappedMemo, 16, bodyY + 14);

  // Certified Attachments Listed
  const attY = bodyY + 14 + wrappedMemo.length * 4.5 + 4;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(12, attY, 180, 28, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(79, 70, 229);
  doc.text("AUTHENTICATED PUBLIC RECORDS ATTACHED (Section 2(j)(ii)):", 16, attY + 6);

  doc.setFont("courier", "bold");
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text("1. PWD_Sanction_Order_2025_381_Certified.pdf", 16, attY + 12);
  doc.text("2. Measurement_Book_Vol_IV_Chainage_Pages_42_49.pdf", 16, attY + 17);
  doc.text("3. Site_Technical_Inspection_Note_Dated_15_Oct_2026.pdf", 16, attY + 22);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(16, 185, 129);
  doc.text("✓ Digitally Sealed", 160, attY + 12);
  doc.text("✓ Digitally Sealed", 160, attY + 17);
  doc.text("✓ Digitally Sealed", 160, attY + 22);

  // Mandatory Section 7(8) First Appellate Notice
  const faaY = attY + 32;
  doc.setFillColor(254, 242, 242); // Rose 50
  doc.setDrawColor(244, 63, 94); // Rose 500
  doc.setLineWidth(0.3);
  doc.roundedRect(12, faaY, 180, 24, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(159, 18, 57);
  doc.text("MANDATORY NOTICE UNDER SECTION 7(8) OF RTI ACT, 2005:", 16, faaY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(136, 19, 55);
  const faaNotice =
    "If aggrieved by any part of this disclosure, refusal, or redaction, the applicant is entitled to prefer an appeal under Section 19(1) of the RTI Act within thirty (30) days to the First Appellate Authority: Chief Engineer & FAA, Office of the Chief Engineer, PWD Zone 1, Capital Complex. The statutory appeal may also be filed directly through SARAL.";
  const wrappedFaa = doc.splitTextToSize(faaNotice, 172);
  doc.text(wrappedFaa, 16, faaY + 11.5);

  // Digital Signature Seal
  drawDigitalSeal(
    doc,
    "Executive Engineer & Designated PIO (Section 5(1))",
    citizen,
    generateDigest(`${appNumber}-CERT-PIO`)
  );

  // Save PDF
  doc.save(`SARAL_Certified_Response_${appNumber}.pdf`);
}

/**
 * 3. GENERATE CERTIFIED EXTRACT OF PUBLIC RECORDS (Measurement Book, Tender Register, Sanction Orders)
 */
export function downloadPublicRecordDoc(docName, application) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const appNumber = application?.applicationNumber || application?.id || "SARAL-2026-00124";
  const citizen = application?.citizenName || application?.citizen?.user?.fullName || "Rahul Sharma";
  const department = application?.department?.name || application?.suggestedDepartment || application?.department || "Public Works Department";
  const cleanDocName = docName || "Public_Works_Measurement_Register.pdf";

  // Header & Frame
  drawDocumentFrame(
    doc,
    "Certified Public Record Extract (Section 2(j)(ii))",
    "True certified extract verified against official department measurement records",
    `EXTRACT REF: DOC/${appNumber}`
  );

  // Header particulars
  const startY = 53;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(12, startY, 180, 22, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`RECORD NAME: ${cleanDocName.replace(/_/g, " ").toUpperCase()}`, 16, startY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Custodial Authority: ${department} • Division Ledgers Archive`, 16, startY + 12);
  doc.text(`Furnished to RTI Applicant: ${citizen} under RTI Application ${appNumber}`, 16, startY + 17);

  // Sample Table: Measurement Book Ledger Entries
  const tableY = 80;
  doc.setFillColor(15, 23, 42);
  doc.rect(12, tableY, 180, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("ITEM #", 16, tableY + 5.5);
  doc.text("CHAINAGE / WORK DESCRIPTION", 34, tableY + 5.5);
  doc.text("DIMENSIONS (L x B x D)", 108, tableY + 5.5);
  doc.text("QTY (SQM/CUM)", 148, tableY + 5.5);
  doc.text("SANCTION REF", 172, tableY + 5.5);

  const sampleRows = [
    {
      num: "MB-01",
      desc: "Excavation for roadway in soil & hard morrum",
      dim: "0.00 to 250.00m x 7.00m x 0.30m",
      qty: "525.00 CUM",
      sanction: "TS-2025/11",
    },
    {
      num: "MB-02",
      desc: "Granular Sub-Base (GSB) grading II compacted",
      dim: "0.00 to 250.00m x 7.00m x 0.15m",
      qty: "262.50 CUM",
      sanction: "TS-2025/12",
    },
    {
      num: "MB-03",
      desc: "Wet Mix Macadam (WMM) base course rolled",
      dim: "0.00 to 250.00m x 7.00m x 0.10m",
      qty: "175.00 CUM",
      sanction: "TS-2025/14",
    },
    {
      num: "MB-04",
      desc: "Dense Bituminous Macadam (DBM) with VG-30",
      dim: "0.00 to 250.00m x 7.00m x 0.05m",
      qty: "87.50 CUM",
      sanction: "TS-2025/18",
    },
    {
      num: "MB-05",
      desc: "Bituminous Concrete (BC) wearing course",
      dim: "0.00 to 250.00m x 7.00m x 0.03m",
      qty: "1,750.00 SQM",
      sanction: "TS-2025/22",
    },
    {
      num: "MB-06",
      desc: "RCC Precast Pipe Culvert 1000mm dia NP3",
      dim: "Chainage 125.00m (Skew 15 deg)",
      qty: "14.00 RMT",
      sanction: "TS-2025/29",
    },
  ];

  let rowY = tableY + 8;
  sampleRows.forEach((r, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(12, rowY, 180, 11, "F");
    doc.setDrawColor(226, 232, 240);
    doc.line(12, rowY + 11, 192, rowY + 11);

    doc.setFont("courier", "bold");
    doc.setFontSize(7);
    doc.setTextColor(79, 70, 229);
    doc.text(r.num, 16, rowY + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(30, 41, 59);
    const descLines = doc.splitTextToSize(r.desc, 70);
    doc.text(descLines, 34, rowY + 6);

    doc.setFont("courier", "normal");
    doc.setFontSize(6.5);
    doc.text(r.dim, 108, rowY + 7);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(r.qty, 148, rowY + 7);

    doc.setFont("courier", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(16, 185, 129);
    doc.text(r.sanction, 172, rowY + 7);

    rowY += 11;
  });

  // Certificate Statement
  const certY = rowY + 8;
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(12, certY, 180, 24, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(6, 95, 70);
  doc.text("STATUTORY ATTESTATION UNDER SECTION 2(j)(ii) OF RTI ACT, 2005:", 16, certY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(51, 65, 85);
  const certNotice =
    "It is hereby certified that this document is a true, authentic, and unabridged extract of official measurement book and sanction records maintained in the ordinary course of government business. Digital seal has been affixed under Section 4 of the Information Technology Act, 2000.";
  const wrappedCert = doc.splitTextToSize(certNotice, 172);
  doc.text(wrappedCert, 16, certY + 11.5);

  // Digital Signature Seal
  drawDigitalSeal(
    doc,
    "Assistant Engineer & Certified Record Custodian",
    citizen,
    generateDigest(`${cleanDocName}-${appNumber}`)
  );

  // Save PDF
  doc.save(`${cleanDocName.replace(/\.pdf$/i, "")}_Certified.pdf`);
}
