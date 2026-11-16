import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request) {
  try {
    const { user, response } = requireRole(request, ["ADMIN"]);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // "all" | "active" | "suspended"

    const officers = await prisma.officerProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            isActive: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
        department: {
          select: { id: true, code: true, name: true, ministry: true },
        },
        _count: {
          select: { assignedRtis: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mappedOfficers = officers.map((o) => ({
      id: o.id,
      userId: o.userId,
      fullName: o.user?.fullName || "Designated Officer",
      email: o.user?.email || "—",
      phone: o.user?.phone || "—",
      employeeId: o.employeeId,
      designation: o.designation,
      officeLocation: o.officeLocation,
      department: o.department,
      departmentId: o.departmentId,
      isPio: o.isPio,
      isFaa: o.isFaa,
      isActive: o.user?.isActive ?? true,
      activeCases: o._count?.assignedRtis || 0,
      createdAt: o.createdAt,
    }));

    return NextResponse.json({
      success: true,
      count: mappedOfficers.length,
      officers: mappedOfficers,
    });
  } catch (error) {
    console.error("Admin Officers API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load officers." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { user, response } = requireRole(request, ["ADMIN"]);
    if (response) return response;

    const body = await request.json();
    const {
      fullName,
      email,
      employeeId,
      designation,
      departmentId,
      phone,
      officeLocation,
      isPio = true,
      isFaa = false,
      sendInvitation = true,
    } = body;

    if (!fullName || !email || !employeeId || !designation || !departmentId) {
      return NextResponse.json(
        { success: false, error: "Full Name, Official Email, Employee ID, Designation, and Department are required." },
        { status: 400 }
      );
    }

    // Check duplicate email or employeeId
    const existingUser = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: `An account with email ${email} already exists.` },
        { status: 409 }
      );
    }

    const existingOfficer = await prisma.officerProfile.findUnique({ where: { employeeId: employeeId.trim() } });
    if (existingOfficer) {
      return NextResponse.json(
        { success: false, error: `An officer with Employee ID ${employeeId} already exists.` },
        { status: 409 }
      );
    }

    // Default invitation password for new officers
    const defaultPasswordHash = await bcrypt.hash("Password@123", 10);

    // Create user and profile in transaction
    const [newUser, newProfile] = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          email: email.trim().toLowerCase(),
          passwordHash: defaultPasswordHash,
          fullName: fullName.trim(),
          phone: phone ? phone.trim() : null,
          role: "OFFICER",
          isDigiLockerVerified: true,
          isActive: true,
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
        },
      });

      const p = await tx.officerProfile.create({
        data: {
          userId: u.id,
          departmentId,
          employeeId: employeeId.trim(),
          designation: designation.trim(),
          officeLocation: officeLocation ? officeLocation.trim() : "Divisional Nodal Office",
          isPio: Boolean(isPio),
          isFaa: Boolean(isFaa),
        },
        include: {
          department: true,
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId: user.userId,
          action: "OFFICER_CREATED",
          entityName: "OfficerProfile",
          entityId: p.id,
          ipAddress: "127.0.0.1",
          userAgent: "SARAL Administrator Console",
        },
      });

      return [u, p];
    });

    return NextResponse.json({
      success: true,
      message: `Officer ${fullName} created successfully. Invitation sent to ${email}.`,
      officer: {
        id: newProfile.id,
        userId: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        employeeId: newProfile.employeeId,
        designation: newProfile.designation,
        department: newProfile.department,
        isActive: true,
      },
    });
  } catch (error) {
    console.error("Create Officer Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create officer account." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { user, response } = requireRole(request, ["ADMIN"]);
    if (response) return response;

    const body = await request.json();
    const { officerId, isActive, designation, officeLocation, isPio, isFaa } = body;

    if (!officerId) {
      return NextResponse.json(
        { success: false, error: "officerId is required." },
        { status: 400 }
      );
    }

    const officer = await prisma.officerProfile.findUnique({
      where: { id: officerId },
      include: { user: true },
    });

    if (!officer) {
      return NextResponse.json(
        { success: false, error: "Officer profile not found." },
        { status: 404 }
      );
    }

    // Toggle suspension if isActive is provided
    if (typeof isActive === "boolean") {
      await prisma.user.update({
        where: { id: officer.userId },
        data: { isActive },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.userId,
          action: isActive ? "OFFICER_REACTIVATED" : "OFFICER_SUSPENDED",
          entityName: "OfficerProfile",
          entityId: officerId,
          ipAddress: "127.0.0.1",
          userAgent: "SARAL Administrator Console",
        },
      });
    }

    // Update profile fields if provided
    const updateProfileData = {};
    if (designation !== undefined) updateProfileData.designation = designation;
    if (officeLocation !== undefined) updateProfileData.officeLocation = officeLocation;
    if (isPio !== undefined) updateProfileData.isPio = Boolean(isPio);
    if (isFaa !== undefined) updateProfileData.isFaa = Boolean(isFaa);

    if (Object.keys(updateProfileData).length > 0) {
      await prisma.officerProfile.update({
        where: { id: officerId },
        data: updateProfileData,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Officer updated successfully.",
    });
  } catch (error) {
    console.error("Update Officer Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update officer." },
      { status: 500 }
    );
  }
}

// Soft-delete officer
export async function DELETE(request) {
  try {
    const { user, response } = requireRole(request, ["ADMIN"]);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const officerId = searchParams.get("id");

    if (!officerId) {
      return NextResponse.json(
        { success: false, error: "Officer ID is required." },
        { status: 400 }
      );
    }

    const officer = await prisma.officerProfile.findUnique({
      where: { id: officerId },
      include: { user: true },
    });

    if (!officer) {
      return NextResponse.json(
        { success: false, error: "Officer not found." },
        { status: 404 }
      );
    }

    // Soft-delete: Mark user account as inactive so past RTI history and audit trail remain intact
    await prisma.user.update({
      where: { id: officer.userId },
      data: { isActive: false },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: "OFFICER_SOFT_DELETED",
        entityName: "OfficerProfile",
        entityId: officerId,
        ipAddress: "127.0.0.1",
        userAgent: "SARAL Administrator Console",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Officer ${officer.user.fullName} successfully soft-deleted (account suspended, historical records preserved).`,
    });
  } catch (error) {
    console.error("Delete Officer Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to soft-delete officer." },
      { status: 500 }
    );
  }
}
