import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Automatically calculates the next incremented sequential Employee / Service ID
 * Formatted as: EMP-[DEPT_CODE]-[0001, 0002, ...]
 */
export async function generateNextEmployeeId(departmentId) {
  let deptCode = "PIO";
  if (departmentId) {
    const dept = await prisma.department.findUnique({
      where: { id: departmentId },
      select: { code: true },
    });
    if (dept?.code) {
      deptCode = dept.code.toUpperCase().replace(/[^A-Z0-9_]/g, "");
    }
  }

  // Count existing officers in this department
  const existingInDept = await prisma.officerProfile.count({
    where: departmentId ? { departmentId } : {},
  });

  let nextNum = existingInDept + 1;
  let candidate = `EMP-${deptCode}-${String(nextNum).padStart(4, "0")}`;

  // Loop to guarantee zero collision in case of manual deletions/gaps
  while (await prisma.officerProfile.findUnique({ where: { employeeId: candidate } })) {
    nextNum++;
    candidate = `EMP-${deptCode}-${String(nextNum).padStart(4, "0")}`;
  }

  return candidate;
}

export async function GET(request) {
  try {
    const { user, response } = requireRole(request, ["ADMIN"]);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // Dynamic auto-increment generation endpoint
    if (action === "next-id") {
      const departmentId = searchParams.get("departmentId");
      const nextEmployeeId = await generateNextEmployeeId(departmentId);
      return NextResponse.json({ success: true, nextEmployeeId });
    }

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

    if (!fullName || !email || !designation || !departmentId) {
      return NextResponse.json(
        { success: false, error: "Full Name, Official Email, Designation, and Department are required." },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existingUser = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: `An account with email ${email} already exists.` },
        { status: 409 }
      );
    }

    // Auto-generate or sanitize unique sequential employeeId
    let finalEmployeeId = employeeId ? employeeId.trim() : "";
    if (!finalEmployeeId) {
      finalEmployeeId = await generateNextEmployeeId(departmentId);
    } else {
      const existingOfficer = await prisma.officerProfile.findUnique({ where: { employeeId: finalEmployeeId } });
      if (existingOfficer) {
        finalEmployeeId = await generateNextEmployeeId(departmentId);
      }
    }

    // Admin specifies initial password or auto-generate Officer@2026
    const temporaryPassword = (body.password || body.temporaryPassword || "Officer@2026").trim();
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);

    // Create user and profile in transaction
    // isDigiLockerVerified is explicitly false: Officer must authenticate via DigiLocker upon login
    const [newUser, newProfile] = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          email: email.trim().toLowerCase(),
          passwordHash,
          fullName: fullName.trim(),
          phone: phone ? phone.trim() : null,
          role: "OFFICER",
          isDigiLockerVerified: false,
          isActive: true,
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
        },
      });

      const p = await tx.officerProfile.create({
        data: {
          userId: u.id,
          departmentId,
          employeeId: finalEmployeeId,
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
      message: `Officer ${fullName} registered successfully. Credentials issued.`,
      officer: {
        id: newProfile.id,
        userId: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        employeeId: newProfile.employeeId,
        designation: newProfile.designation,
        department: newProfile.department,
        temporaryPassword,
        isDigiLockerVerified: false,
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
