import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { normalizeStructuredClauses } from "@/lib/services/applicationService";

export async function GET(request) {
  try {
    const { user, response } = requireRole(request, ["ADMIN"]);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const departmentId = searchParams.get("departmentId");
    const search = searchParams.get("search")?.trim();

    const where = {};

    if (status && status !== "ALL") {
      where.status = status.toUpperCase();
    }

    if (departmentId && departmentId !== "ALL") {
      where.departmentId = departmentId;
    }

    if (search) {
      where.OR = [
        { applicationNumber: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { targetAuthority: { contains: search, mode: "insensitive" } },
        {
          citizen: {
            user: {
              fullName: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    const applications = await prisma.rtiApplication.findMany({
      where,
      include: {
        department: {
          select: { id: true, name: true, code: true, ministry: true },
        },
        citizen: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                isDigiLockerVerified: true,
              },
            },
          },
        },
        assignedOfficer: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        timeline: {
          orderBy: { stage: "asc" },
        },
        documents: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    const mapped = applications.map((app) => {
      const deadline = new Date(app.statutoryDeadline);
      const diffMs = deadline - now;
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      return {
        id: app.id,
        applicationNumber: app.applicationNumber,
        title: app.title,
        subject: app.subject,
        rawCitizenPrompt: app.rawCitizenPrompt,
        structuredClauses: normalizeStructuredClauses(app.structuredClauses),
        targetAuthority: app.targetAuthority,
        isLifeOrLiberty: app.isLifeOrLiberty,
        status: app.status,
        feeStatus: app.feeStatus,
        paymentTxnId: app.paymentTxnId,
        filingDate: app.createdAt,
        statutoryDeadline: app.statutoryDeadline,
        daysLeft: Math.max(0, daysLeft),
        isOverdue: daysLeft < 0 && app.status !== "RESPONDED" && app.status !== "CLOSED",
        department: app.department,
        citizen: {
          name: app.citizen?.user?.fullName || "Verified Citizen",
          email: app.citizen?.user?.email || "—",
          phone: app.citizen?.user?.phone || "—",
          isVerified: app.citizen?.user?.isDigiLockerVerified || false,
          digiLockerId: app.citizen?.digiLockerId,
        },
        assignedOfficer: app.assignedOfficer
          ? {
              id: app.assignedOfficer.id,
              name: app.assignedOfficer.user?.fullName,
              designation: app.assignedOfficer.designation,
              email: app.assignedOfficer.user?.email,
            }
          : null,
        timeline: app.timeline,
        documentsCount: app.documents?.length || 0,
        isFlagged: false, // Administrative flag
      };
    });

    return NextResponse.json({
      success: true,
      count: mapped.length,
      applications: mapped,
    });
  } catch (error) {
    console.error("Admin RTI GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load RTI applications." },
      { status: 500 }
    );
  }
}

/**
 * Strict Zero-Tampering Enforcement:
 * Admin CANNOT edit applicant's RTI content, delete submitted RTIs, or submit on behalf.
 */
export async function PATCH(request) {
  try {
    const { user, response } = requireRole(request, ["ADMIN"]);
    if (response) return response;

    const body = await request.json();
    const { action, applicationId, note } = body;

    // Strict boundary enforcement:
    if (body.structuredClauses || body.rawCitizenPrompt || body.title || body.subject) {
      return NextResponse.json(
        {
          success: false,
          error:
            "PROHIBITED_ACTION: Section 6(1) RTI Act 2005 strictly forbids platform administrators from modifying petitioner content.",
        },
        { status: 403 }
      );
    }

    if (action === "FLAG_SUSPICIOUS") {
      // Record administrative compliance flag in AuditLog without altering petition
      await prisma.auditLog.create({
        data: {
          userId: user.userId,
          action: "RTI_FLAGGED_FOR_AUDIT",
          entityName: "RtiApplication",
          entityId: applicationId,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Application flagged for PIO statutory compliance review.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Operation completed.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process RTI action." },
      { status: 500 }
    );
  }
}

/**
 * Explicit rejection of DELETE:
 * Deleting submitted RTIs is strictly forbidden by law.
 */
export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      error:
        "PROHIBITED_ACTION: Right to Information petitions are permanent public records. Administrators cannot delete submitted RTI applications.",
    },
    { status: 403 }
  );
}
