import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { structureOfficerReport } from "@/lib/services/officerAiService";
import { normalizeStructuredClauses } from "@/lib/services/applicationService";

export async function POST(request) {
  try {
    const { user, response } = requireRole(request, ["OFFICER", "ADMIN"]);
    if (response) return response;

    const body = await request.json();
    const { applicationId, officerNotes = "", customClauses = null } = body;

    let targetApplication = null;
    if (applicationId) {
      targetApplication = await prisma.rtiApplication.findFirst({
        where: {
          OR: [
            { id: applicationId },
            { applicationNumber: applicationId },
          ],
        },
        include: {
          department: true,
          citizen: { include: { user: true } },
          assignedOfficer: { include: { user: true } },
        },
      });
    }

    const petitionTitle = targetApplication?.title || "RTI Petition Examination";
    const petitionSubject = targetApplication?.subject || "Statutory Information Compliance Audit";
    const departmentName = targetApplication?.department?.name || "Public Works Department";

    // Extract clauses from database or custom input
    const citizenClauses =
      Array.isArray(customClauses) && customClauses.length > 0
        ? customClauses
        : targetApplication?.structuredClauses
        ? normalizeStructuredClauses(targetApplication.structuredClauses)
        : [
            "Certified copies of Sanction Orders and Administrative Approval issued for works executed in the division.",
            "Inspection and certified extracts of Measurement Book (MB) Vol. IV recording exact chainage dimensions and bitumen thickness.",
            "Total expenditure incurred and Running Account (RA) bills disbursed to the contractor as verified by the Divisional Accounts Officer.",
          ];

    const officerName = user.fullName || "Designated Public Information Officer";
    const designation =
      targetApplication?.assignedOfficer?.designation ||
      "Executive Engineer & Designated PIO";

    const report = await structureOfficerReport({
      petitionTitle,
      petitionSubject,
      citizenClauses,
      officerNotes,
      departmentName,
      officerName,
      designation,
    });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Officer AI Structure Report API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to structure officer report." },
      { status: 500 }
    );
  }
}
