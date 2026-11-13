import { NextResponse } from "next/server";
import { getAuthSession, requireRole } from "@/lib/auth";
import {
  getApplications,
  createRtiApplication,
} from "@/lib/services/applicationService";

export async function GET(request) {
  try {
    const session = getAuthSession(request);
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = Number(searchParams.get("limit") || 50);
    const offset = Number(searchParams.get("offset") || 0);

    // If user is authenticated, filter by role; otherwise, return public sample applications
    const applications = await getApplications({
      userId: session?.userId || null,
      role: session?.role || "CITIZEN",
      status,
      search,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get Applications Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve applications." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Only logged in citizens or admins can file a petition
    const { user, response } = requireRole(request, ["CITIZEN", "ADMIN"]);
    if (response) return response;

    const body = await request.json();
    const {
      departmentId,
      title,
      subject,
      rawCitizenPrompt,
      structuredClauses,
      targetAuthority,
      isLifeOrLiberty,
      feeStatus,
      paymentTxnId,
    } = body;

    if (!departmentId || !title) {
      return NextResponse.json(
        { success: false, error: "Department and application title are required." },
        { status: 400 }
      );
    }

    const application = await createRtiApplication({
      citizenUserId: user.userId,
      departmentId,
      title,
      subject,
      rawCitizenPrompt,
      structuredClauses: structuredClauses || [],
      targetAuthority,
      isLifeOrLiberty: Boolean(isLifeOrLiberty),
      feeStatus: feeStatus || "PAID",
      paymentTxnId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "RTI petition filed successfully.",
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Application Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create application." },
      { status: 400 }
    );
  }
}
