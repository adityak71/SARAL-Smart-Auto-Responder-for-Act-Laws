import prisma from "../prisma.js";

/**
 * Statutory RTI Knowledge Base & FAQ Reference.
 * Contains authentic legal interpretations of Right to Information Act 2005.
 */
export const STATUTORY_RTI_KNOWLEDGE_BASE = [
  {
    id: "sec-6-1",
    section: "Section 6(1)",
    act: "Right to Information Act, 2005",
    title: "How to File a Valid RTI Application",
    summary:
      "A citizen can make a request in writing or through electronic means in English, Hindi, or the official language of the area. No citizen is required to state the reason for requesting information or personal details except contact address.",
    statutoryFee: "₹10 (Exempted for BPL Cardholders under Section 7(5))",
    timeLimit: "30 Days from date of receipt",
    keywords: ["file", "fee", "how to apply", "application", "format", "reason", "bpl", "cost"],
  },
  {
    id: "sec-7-1",
    section: "Section 7(1)",
    act: "Right to Information Act, 2005",
    title: "Statutory 30-Day Turnaround & 48-Hour Emergency Clause",
    summary:
      "The Public Information Officer (PIO) must provide the information or reject the request within 30 days. If the information sought concerns the life or liberty of a person, it MUST be provided within 48 hours of receipt.",
    statutoryFee: "Standard ₹10 application fee",
    timeLimit: "30 Days (Standard) / 48 Hours (Life or Liberty)",
    keywords: ["timeline", "deadline", "30 days", "48 hours", "life and liberty", "emergency", "time limit", "delay"],
  },
  {
    id: "sec-8",
    section: "Section 8",
    act: "Right to Information Act, 2005",
    title: "Exemptions from Public Disclosure",
    summary:
      "Information whose disclosure prejudicially affects sovereignty, national security, intellectual property, cabinet papers before decision, or unwarranted invasion of personal privacy is exempt. However, information which cannot be denied to Parliament or State Legislature cannot be denied to any citizen.",
    statutoryFee: "N/A",
    timeLimit: "Rejection order must specify reasons within 30 days",
    keywords: ["exemption", "rejected", "privacy", "cabinet papers", "national security", "section 8", "denied"],
  },
  {
    id: "sec-19-1",
    section: "Section 19(1)",
    act: "Right to Information Act, 2005",
    title: "First Appeal Procedure (Section 19)",
    summary:
      "Any person who does not receive a decision within 30 days or is aggrieved by a PIO decision may prefer an appeal within 30 days to the First Appellate Authority (FAA) senior in rank to the PIO.",
    statutoryFee: "Zero Fee for First Appeal in central departments",
    timeLimit: "Must be disposed within 30 days (extendable to 45 days for recorded reasons)",
    keywords: ["appeal", "first appeal", "faa", "rejected", "overdue", "no response", "section 19"],
  },
  {
    id: "sec-20",
    section: "Section 20",
    act: "Right to Information Act, 2005",
    title: "Penalties on Defaulting Officers",
    summary:
      "The Central or State Information Commission can impose a penalty of ₹250 per day up to a maximum of ₹25,000 on a PIO who without reasonable cause refuses to receive an application or delays furnishing information.",
    statutoryFee: "Penalty recoverable from officer's salary",
    timeLimit: "Adjudicated by Information Commission",
    keywords: ["penalty", "fine", "officer default", "action against pio", "section 20", "compensation"],
  },
  {
    id: "gram-panchayat-roads",
    section: "Gram Panchayat & Rural Schemes",
    act: "Panchayati Raj Act & RTI Section 4",
    title: "Roads, Tenders & Village Budget Disclosure",
    summary:
      "Citizens are entitled to inspect Measurement Books (MBs), muster rolls of MGNREGA workers, Sanction Orders under PMGSY, and voucher bills cleared for village bitumen and concrete roads.",
    statutoryFee: "₹10 + ₹2 per page for certified copies (A4/A3)",
    timeLimit: "30 Days from receipt",
    keywords: ["road", "panchayat", "village", "budget", "tender", "contractor", "mgnrega", "sarpanch", "pothole"],
  },
];

/**
 * Searches statutory knowledge base by keyword relevance.
 */
export function searchStatutoryKnowledge(query) {
  if (!query) return STATUTORY_RTI_KNOWLEDGE_BASE.slice(0, 3);

  const lowerQuery = query.toLowerCase();
  const tokens = lowerQuery.split(/\s+/).filter(Boolean);

  const scored = STATUTORY_RTI_KNOWLEDGE_BASE.map((item) => {
    let score = 0;
    const combinedText = `${item.title} ${item.summary} ${item.section} ${item.keywords.join(" ")}`.toLowerCase();

    tokens.forEach((token) => {
      if (item.keywords.some((kw) => kw.includes(token))) score += 4;
      if (combinedText.includes(token)) score += 2;
    });

    return { ...item, matchScore: score };
  });

  return scored
    .filter((item) => item.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}

/**
 * Searches government departments catalog from the database.
 */
export async function searchDepartments(query) {
  try {
    if (!query) {
      return await prisma.department.findMany({
        take: 3,
        include: {
          officers: {
            take: 1,
            select: { designation: true, officeLocation: true, isPio: true },
          },
        },
      });
    }

    const cleanQuery = query.trim().toLowerCase();

    const departments = await prisma.department.findMany({
      where: {
        OR: [
          { name: { contains: cleanQuery } },
          { ministry: { contains: cleanQuery } },
          { code: { contains: cleanQuery } },
          { nodalOffice: { contains: cleanQuery } },
        ],
      },
      include: {
        officers: {
          take: 2,
          select: { designation: true, officeLocation: true, isPio: true },
        },
      },
      take: 4,
    });

    return departments;
  } catch (error) {
    console.error("Error searching departments:", error);
    return [];
  }
}
