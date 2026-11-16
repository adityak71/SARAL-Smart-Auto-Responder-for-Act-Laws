import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { user, response } = requireRole(request, ["ADMIN"]);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || 50);
    const action = searchParams.get("action");

    const where = {};
    if (action && action !== "ALL") {
      where.action = action;
    }

    const logs = await prisma.auditLog.findMany({
      where,
      take: limit,
      orderBy: { timestamp: "desc" },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    const mappedLogs = logs.map((log) => ({
      id: log.id,
      action: log.action,
      entityName: log.entityName,
      entityId: log.entityId,
      user: log.user ? `${log.user.fullName} (${log.user.role})` : "System / Webhook",
      userEmail: log.user?.email || "—",
      ip: log.ipAddress || "127.0.0.1",
      userAgent: log.userAgent || "SARAL Central Gateway",
      timestamp: log.timestamp,
      status: "Success",
    }));

    return NextResponse.json({
      success: true,
      count: mappedLogs.length,
      logs: mappedLogs,
    });
  } catch (error) {
    console.error("Admin Audit GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load audit logs." },
      { status: 500 }
    );
  }
}
