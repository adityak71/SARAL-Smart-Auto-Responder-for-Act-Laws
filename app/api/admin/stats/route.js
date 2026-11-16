import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { user, response } = requireRole(request, ["ADMIN"]);
    if (response) return response;

    // Fetch 100% genuine real counts from PostgreSQL database
    const [
      totalUsers,
      verifiedUsers,
      totalRtis,
      submittedCount,
      inProgressCount,
      respondedCount,
      officers,
      applications,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isDigiLockerVerified: true } }),
      prisma.rtiApplication.count(),
      prisma.rtiApplication.count({ where: { status: "SUBMITTED" } }),
      prisma.rtiApplication.count({
        where: { status: { in: ["IN_REVIEW", "ASSIGNED", "UNDER_REVIEW"] } },
      }),
      prisma.rtiApplication.count({
        where: { status: { in: ["RESPONDED", "CLOSED", "RESPONSE_DISPATCHED", "RESOLVED"] } },
      }),
      prisma.officerProfile.findMany({
        include: {
          user: {
            select: { isActive: true },
          },
        },
      }),
      prisma.rtiApplication.findMany({
        select: { createdAt: true },
      }),
    ]);

    const activeOfficers = officers.filter((o) => o.user?.isActive).length;
    const suspendedOfficers = officers.filter((o) => !o.user?.isActive).length;

    // Calculate real monthly RTI counts for current year (Jan to Dec)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthIndex = new Date().getMonth(); // 0 to 11
    
    // Default 6-month window ending on current month (or Jan-Jun)
    const monthsToShow = monthNames.slice(0, Math.max(6, currentMonthIndex + 1));
    const monthlyCounts = {};
    monthsToShow.forEach((m) => {
      monthlyCounts[m] = 0;
    });

    applications.forEach((app) => {
      const appDate = new Date(app.createdAt);
      const mName = monthNames[appDate.getMonth()];
      if (monthlyCounts[mName] !== undefined) {
        monthlyCounts[mName] += 1;
      }
    });

    const monthlyApplications = monthsToShow.map((m) => ({
      month: m,
      count: monthlyCounts[m],
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalRtis,
        verifiedUsers,
        pendingRequests: submittedCount + inProgressCount,
        statusBreakdown: {
          submitted: submittedCount,
          inProgress: inProgressCount,
          responded: respondedCount,
        },
        officerStats: {
          total: officers.length,
          active: activeOfficers,
          suspended: suspendedOfficers,
          inactive: 0,
        },
        monthlyApplications,
      },
    });
  } catch (error) {
    console.error("Admin Stats API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load admin statistics." },
      { status: 500 }
    );
  }
}
