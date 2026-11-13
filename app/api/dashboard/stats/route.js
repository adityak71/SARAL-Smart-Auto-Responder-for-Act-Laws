import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import {
  getCitizenDashboardStats,
  getOfficerDashboardStats,
  getAdminDashboardStats,
} from "@/lib/services/dashboardService";

export async function GET(request) {
  try {
    const session = getAuthSession(request);
    const { searchParams } = new URL(request.url);
    const requestedRole = searchParams.get("role") || session?.role || "CITIZEN";

    let stats = {};

    if (requestedRole === "OFFICER") {
      let userId = session?.userId;
      if (!userId) {
        const demoOfficer = await prisma.user.findFirst({ where: { role: "OFFICER" } });
        userId = demoOfficer?.id;
      }
      stats = await getOfficerDashboardStats(userId);
    } else if (requestedRole === "ADMIN") {
      stats = await getAdminDashboardStats();
    } else {
      let userId = session?.userId;
      if (!userId) {
        const demoCitizen = await prisma.user.findFirst({ where: { role: "CITIZEN" } });
        userId = demoCitizen?.id;
      }
      stats = await getCitizenDashboardStats(userId);
    }

    return NextResponse.json({
      success: true,
      role: requestedRole,
      stats,
    });
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to calculate dashboard statistics." },
      { status: 500 }
    );
  }
}
