import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

// Initial sample platform complaints (Spec E)
let COMPLAINTS = [
  {
    id: "CMP-2026-0041",
    citizenName: "Rahul Sharma",
    citizenEmail: "rahul.sharma@citizen.in",
    category: "DigiLocker Verification",
    subject: "Aadhaar OTP timed out during DigiLocker auth",
    description: "DigiLocker portal took over 60 seconds to respond, resulting in session timeout on Step 5.",
    status: "In Progress", // "Open" | "Assigned" | "In Progress" | "Resolved" | "Closed"
    priority: "HIGH",
    assignedTo: "Tech Support Team B",
    createdAt: "2026-11-15T18:30:00Z",
    internalNotes: "Investigated UIDAI rate limit during peak evening hours.",
  },
  {
    id: "CMP-2026-0038",
    citizenName: "Pooja Patel",
    citizenEmail: "pooja.patel@gmail.com",
    category: "Payment Gateway",
    subject: "₹10 debited from UPI but challan pending",
    description: "Bharatkosh transaction completed via PhonePe, but application remained at fee unpaid stage.",
    status: "Resolved",
    priority: "MEDIUM",
    assignedTo: "Finance Desk",
    createdAt: "2026-11-14T11:20:00Z",
    internalNotes: "Payment reconciled via Bharatkosh reference ID BK-2026-99214. Receipt issued.",
  },
  {
    id: "CMP-2026-0029",
    citizenName: "Aditya Kumar",
    citizenEmail: "aditya@saral.gov.in",
    category: "Department Routing",
    subject: "Confusion between PWD and Rural Development for village road",
    description: "Wanted clarification whether village link road comes under Gram Panchayat or PWD division.",
    status: "Open",
    priority: "NORMAL",
    assignedTo: "Unassigned",
    createdAt: "2026-11-15T22:15:00Z",
    internalNotes: "",
  },
];

export async function GET(request) {
  try {
    const { user, response } = requireRole(request, ["ADMIN"]);
    if (response) return response;

    return NextResponse.json({
      success: true,
      count: COMPLAINTS.length,
      complaints: COMPLAINTS,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load complaints." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { user, response } = requireRole(request, ["ADMIN"]);
    if (response) return response;

    const body = await request.json();
    const { complaintId, status, assignedTo, internalNotes } = body;

    const target = COMPLAINTS.find((c) => c.id === complaintId);
    if (!target) {
      return NextResponse.json({ success: false, error: "Complaint not found." }, { status: 404 });
    }

    if (status) target.status = status;
    if (assignedTo) target.assignedTo = assignedTo;
    if (internalNotes) target.internalNotes = internalNotes;

    return NextResponse.json({
      success: true,
      message: `Complaint ${complaintId} updated successfully.`,
      complaint: target,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update complaint." },
      { status: 500 }
    );
  }
}
