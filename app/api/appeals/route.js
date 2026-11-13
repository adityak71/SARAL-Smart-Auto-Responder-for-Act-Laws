import { NextResponse } from "next/server";
import { getAuthSession, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const session = getAuthSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const where = {};
    if (session.role === "CITIZEN") {
      const citizen = await prisma.citizenProfile.findUnique({
        where: { userId: session.userId },
      });
      if (!citizen) return NextResponse.json({ success: true, appeals: [] });
      where.citizenId = citizen.id;
    }

    const appeals = await prisma.firstAppeal.findMany({
      where,
      include: {
        application: {
          include: { department: true },
        },
        citizen: {
          include: { user: true },
        },
      },
      orderBy: { appealDate: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: appeals.length,
      appeals,
    });
  } catch (error) {
    console.error("Get Appeals Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve appeals." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { user, response } = requireRole(request, ["CITIZEN", "ADMIN"]);
    if (response) return response;

    const body = await request.json();
    const { applicationId, groundsOfAppeal } = body;

    if (!applicationId || !groundsOfAppeal) {
      return NextResponse.json(
        { success: false, error: "Application ID and grounds of appeal are required." },
        { status: 400 }
      );
    }

    const app = await prisma.rtiApplication.findUnique({
      where: { id: applicationId },
      include: { citizen: true, department: true },
    });

    if (!app) {
      return NextResponse.json(
        { success: false, error: "Application not found." },
        { status: 404 }
      );
    }

    const appealDeadline = new Date();
    appealDeadline.setDate(appealDeadline.getDate() + 30); // 30-day disposal deadline

    const appealCount = await prisma.firstAppeal.count();
    const appealNumber = `SARAL-APP-${new Date().getFullYear()}-${String(
      appealCount + 1
    ).padStart(5, "0")}`;

    const appeal = await prisma.firstAppeal.create({
      data: {
        appealNumber,
        applicationId: app.id,
        citizenId: app.citizenId,
        groundsOfAppeal: groundsOfAppeal.trim(),
        appealDeadline,
        status: "PENDING",
      },
    });

    // Update application status
    await prisma.rtiApplication.update({
      where: { id: app.id },
      data: { status: "FIRST_APPEAL_PENDING" },
    });

    // Notify citizen
    await prisma.notification.create({
      data: {
        userId: user.userId,
        title: "Section 19(1) First Appeal Admitted",
        message: `Your appeal ${appealNumber} against application ${app.applicationNumber} has been recorded. Statutory appellate order expected within 30 days.`,
        type: "CLOCK_WARNING",
        link: `/tracking?id=${app.applicationNumber}`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "First appeal registered successfully.",
        appeal,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Appeal Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to file first appeal." },
      { status: 400 }
    );
  }
}
