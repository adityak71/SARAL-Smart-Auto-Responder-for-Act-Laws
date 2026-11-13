import { NextResponse } from "next/server";
import { getAuthSession, requireRole } from "@/lib/auth";
import {
  getApplicationById,
  updateApplicationStatus,
} from "@/lib/services/applicationService";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const session = getAuthSession(request);

    const application = await getApplicationById(id, session);

    if (!application) {
      return NextResponse.json(
        { success: false, error: "RTI Application not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Get Application Detail Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load application." },
      { status: 403 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    // Only Officers or Admins can advance stages or dispatch responses
    const { user, response } = requireRole(request, ["OFFICER", "ADMIN"]);
    if (response) return response;

    const { id } = await params;
    const body = await request.json();

    const updated = await updateApplicationStatus(id, body, user.userId);

    return NextResponse.json({
      success: true,
      message: "Application status updated successfully.",
      application: updated,
    });
  } catch (error) {
    console.error("Update Status Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update status." },
      { status: 400 }
    );
  }
}
