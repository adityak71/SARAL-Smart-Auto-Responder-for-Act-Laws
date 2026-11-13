import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { addApplicationDocument } from "@/lib/services/applicationService";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const documents = await prisma.applicationDocument.findMany({
      where: {
        OR: [{ applicationId: id }, { application: { applicationNumber: id } }],
      },
      orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error("Get Documents Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load documents." },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { user, response } = requireRole(request, ["OFFICER", "ADMIN", "CITIZEN"]);
    if (response) return response;

    const { id } = await params;
    const body = await request.json();
    const { name, fileUrl, fileSize, fileType, category, isCertified } = body;

    if (!name || !fileUrl) {
      return NextResponse.json(
        { success: false, error: "Document name and fileUrl are required." },
        { status: 400 }
      );
    }

    // Resolve application by UUID or application number
    const app = await prisma.rtiApplication.findFirst({
      where: {
        OR: [{ id }, { applicationNumber: id }],
      },
    });

    if (!app) {
      return NextResponse.json(
        { success: false, error: "Application not found." },
        { status: 404 }
      );
    }

    const doc = await addApplicationDocument(app.id, {
      name,
      fileUrl,
      fileSize,
      fileType,
      category,
      isCertified: user.role === "OFFICER" ? true : Boolean(isCertified),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Document attached successfully.",
        document: doc,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add Document Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to attach document." },
      { status: 400 }
    );
  }
}
