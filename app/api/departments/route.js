import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { code: { contains: search } },
            { ministry: { contains: search } },
          ],
        }
      : {};

    const departments = await prisma.department.findMany({
      where,
      include: {
        officers: {
          select: {
            id: true,
            employeeId: true,
            designation: true,
            officeLocation: true,
            isPio: true,
            isFaa: true,
            user: {
              select: {
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        _count: {
          select: {
            applications: true,
            officers: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    console.error("Get Departments Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve departments." },
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
      code,
      name,
      ministry,
      stateOrCentral,
      nodalOffice,
      contactEmail,
      contactPhone,
      avgResponseDays,
    } = body;

    if (!code || !name || !ministry || !nodalOffice || !contactEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required departmental fields." },
        { status: 400 }
      );
    }

    const dept = await prisma.department.create({
      data: {
        code: code.toUpperCase().trim(),
        name: name.trim(),
        ministry: ministry.trim(),
        stateOrCentral: stateOrCentral || "Central",
        nodalOffice: nodalOffice.trim(),
        contactEmail: contactEmail.toLowerCase().trim(),
        contactPhone: contactPhone || null,
        avgResponseDays: Number(avgResponseDays || 20),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Department created successfully.",
        department: dept,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Department Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create department." },
      { status: 400 }
    );
  }
}
