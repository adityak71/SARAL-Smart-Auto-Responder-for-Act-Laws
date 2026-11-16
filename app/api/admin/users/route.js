import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { user, response } = requireRole(request, ["ADMIN"]);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all"; // "all" | "verified" | "unverified" | "suspended"
    const search = searchParams.get("search")?.trim().toLowerCase();

    const where = {};
    if (filter === "verified") where.isDigiLockerVerified = true;
    if (filter === "unverified") where.isDigiLockerVerified = false;
    if (filter === "suspended") where.isActive = false;

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        avatarUrl: true,
        isDigiLockerVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        citizenProfile: {
          select: {
            id: true,
            state: true,
            district: true,
            digiLockerId: true,
            _count: { select: { applications: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mappedUsers = users.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      phone: u.phone || "—",
      role: u.role,
      avatarUrl: u.avatarUrl,
      isDigiLockerVerified: u.isDigiLockerVerified,
      isActive: u.isActive,
      createdAt: u.createdAt,
      state: u.citizenProfile?.state || "National",
      district: u.citizenProfile?.district || "—",
      digiLockerId: u.citizenProfile?.digiLockerId || (u.isDigiLockerVerified ? `DL-VERIFIED-${u.id.slice(0, 8).toUpperCase()}` : null),
      totalApplications: u.citizenProfile?._count?.applications || 0,
      firebaseUid: `usr_${u.id.replace(/-/g, "").slice(0, 16)}`,
    }));

    return NextResponse.json({
      success: true,
      count: mappedUsers.length,
      users: mappedUsers,
    });
  } catch (error) {
    console.error("Admin Users API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load users list." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { user, response } = requireRole(request, ["ADMIN"]);
    if (response) return response;

    const body = await request.json();
    const { userId, isActive, reason } = body;

    if (!userId || typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, error: "userId and isActive status are required." },
        { status: 400 }
      );
    }

    // Safety check: Prevent Admin from suspending themselves
    if (userId === user.userId) {
      return NextResponse.json(
        { success: false, error: "Admin cannot suspend their own primary master account." },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: { id: true, email: true, fullName: true, role: true, isActive: true },
    });

    // Record Immutable Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: isActive ? "USER_REACTIVATED" : "USER_SUSPENDED",
        entityName: "User",
        entityId: userId,
        ipAddress: "127.0.0.1",
        userAgent: "SARAL Administrator Console",
      },
    });

    return NextResponse.json({
      success: true,
      message: isActive ? `User ${updated.fullName} reactivated.` : `User ${updated.fullName} suspended.`,
      user: updated,
    });
  } catch (error) {
    console.error("Admin User Status Update Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update user status." },
      { status: 500 }
    );
  }
}
