const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const precedentsData = [
  {
    decisionNumber: "CIC/WB/A/2006/0012",
    title: "Mandatory Disclosure of Public Works Measurement Books (MB) & Bills",
    citation: "Full Bench, Central Information Commission (2006)",
    category: "PUBLIC_WORKS",
    statuteSection: "Section 2(j) & Section 6(1)",
    rulingSummary:
      "Held that all entries in Measurement Books (MB), Running Account (RA) bills, and contractor completion certificates funded from public revenues are strictly public documents and cannot be classified as confidential.",
    keyLegalTakeaway:
      "Citizen has absolute right under Section 2(j)(i) to inspect primary measurement books and obtain certified extracts without proving locus standi.",
    disclosableHeld: true,
    keywords: "road, tender, contractor, measurement book, mb, pwd, budget, bitumen, bills, public works",
  },
  {
    decisionNumber: "CIC/SA/A/2015/000281",
    title: "Primary Health Center Duty Rosters & Medicine Stock Transparency",
    citation: "Central Information Commission (2015)",
    category: "HEALTH",
    statuteSection: "Section 4(1)(b) & Section 7(1)",
    rulingSummary:
      "Held that doctor attendance registers, biometric logs, and stock levels of life-saving medicines at government health centers directly affect the right to life of citizens and must be proactively published.",
    keyLegalTakeaway:
      "Non-availability of medicine registers constitutes gross violation of Section 4 proactive disclosure. Information must be provided free of cost under Section 7(6).",
    disclosableHeld: true,
    keywords: "doctor, medicine, hospital, phc, chc, health, attendance, duty roster, dawa, ilaaj, patient",
  },
  {
    decisionNumber: "CIC/OK/A/2008/00860",
    title: "Mid-Day Meal (PM POSHAN) Food Grain & Fund Inspection",
    citation: "Central Information Commission (2008)",
    category: "EDUCATION",
    statuteSection: "Section 2(j)(iii) & Section 6(1)",
    rulingSummary:
      "Held that food grain delivery challans, muster rolls of cooks, and monthly expenditure vouchers for mid-day meals in government schools are open to citizen inspection and certified sample collection under Section 2(j)(iii).",
    keyLegalTakeaway:
      "Citizens have the statutory right to take certified samples of food grains and mid-day meal ingredients supplied to schools.",
    disclosableHeld: true,
    keywords: "school, education, mid day meal, teacher, grains, poshan, students, primary school, shiksha",
  },
  {
    decisionNumber: "CIC/AD/A/2012/001568",
    title: "Enforcement of 48-Hour Emergency Turnaround under Section 7(1) Proviso",
    citation: "Central Information Commission (2012)",
    category: "LIFE_LIBERTY",
    statuteSection: "Section 7(1) Proviso",
    rulingSummary:
      "Held that when an applicant establishes that denial of information concerning hospital treatment or unlawful custody will cause irreversible harm to life or liberty, the PIO is bound to respond within 48 hours without exception.",
    keyLegalTakeaway:
      "Failure to provide records within 48 hours under Section 7(1) proviso makes the PIO liable for daily statutory penalties under Section 20.",
    disclosableHeld: true,
    keywords: "life, liberty, 48 hours, emergency, custody, hospital, medical emergency, arrest, detention",
  },
  {
    decisionNumber: "Supreme Court (2013) 1 SCC 212",
    title: "Girish Ramchandra Deshpande v. CIC: Privacy Boundaries under Section 8(1)(j)",
    citation: "Supreme Court of India (2013)",
    category: "EXEMPTIONS",
    statuteSection: "Section 8(1)(j)",
    rulingSummary:
      "Held that personal income tax returns, private family details, and medical files of government servants are exempt under Section 8(1)(j) unless a larger public interest is authoritatively demonstrated.",
    keyLegalTakeaway:
      "Distinguishes between official administrative conduct (disclosable) and purely personal biometrics/assets (exempt unless Section 8(2) applies).",
    disclosableHeld: false,
    keywords: "privacy, personal information, 8(1)(j), income tax, aadhaar, pan card, salary deduction, private assets",
  },
  {
    decisionNumber: "CIC/BS/A/2014/000123",
    title: "MGNREGA Muster Rolls & Job Card Disbursement Transparency",
    citation: "Central Information Commission (2014)",
    category: "RURAL_DEV",
    statuteSection: "Section 4(1)(b) & Section 6(1)",
    rulingSummary:
      "Held that job card numbers, attendance logs, and bank account credit advice sheets for rural wage workers cannot be denied under privacy exemptions because public wage distribution requires total social audit.",
    keyLegalTakeaway:
      "Gram Panchayat authorities cannot withhold muster rolls or wage payment sheets from any member of the public.",
    disclosableHeld: true,
    keywords: "panchayat, sarpanch, mgnrega, nrega, muster roll, job card, gram sabha, wage, rural development",
  },
  {
    decisionNumber: "CIC/SG/A/2009/001452",
    title: "PDS Fair Price Shop Ration Stock & Sales Register Inspection",
    citation: "Central Information Commission (2009)",
    category: "CIVIL_SUP",
    statuteSection: "Section 2(j)(i) & Section 4",
    rulingSummary:
      "Held that ration card distribution registers, e-PoS device transaction data, and monthly food grain allocation tallies are public documents that must be kept open for public inspection on the 1st of every month.",
    keyLegalTakeaway:
      "Citizens have the right to inspect stock register and daily sales book of any ration dealer/kotedar under Section 2(j)(i).",
    disclosableHeld: true,
    keywords: "ration, pds, fair price shop, fps, kotedar, gehun, chawal, food grains, civil supplies, ration card",
  },
  {
    decisionNumber: "CIC/MA/A/2006/00456",
    title: "Strict 5-Day Statutory Limit for Departmental Transfers under Section 6(3)",
    citation: "Central Information Commission (2006)",
    category: "PROCEDURE",
    statuteSection: "Section 6(3)",
    rulingSummary:
      "Held that a Public Information Officer who receives an application pertaining to another public authority must transfer it within exactly 5 days. Holding an application and rejecting it for lack of jurisdiction is unlawful.",
    keyLegalTakeaway:
      "If a PIO delays transferring an application beyond 5 days, the period of delay is attributable to that PIO for penalty calculation under Section 20.",
    disclosableHeld: true,
    keywords: "transfer, section 6(3), jurisdiction, 5 days, delay, public authority, wrong department",
  },
];

async function seedPrecedents() {
  console.log("🏛️ Seeding Landmark CIC & Supreme Court Precedents into Supabase...");
  for (const item of precedentsData) {
    await prisma.cicPrecedent.upsert({
      where: { decisionNumber: item.decisionNumber },
      update: item,
      create: item,
    });
  }
  console.log(`✅ Seeded ${precedentsData.length} landmark precedents successfully!`);
}

seedPrecedents()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
