import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { routePublicAuthority } from "@/lib/services/aiService";

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, location, stateOrCentral } = body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { success: false, error: "Query prompt is required for authority routing." },
        { status: 400 }
      );
    }

    const routingInfo = await routePublicAuthority(prompt, location, stateOrCentral);

    // Fetch matching department from Supabase
    const allDepartments = await prisma.department.findMany({
      include: {
        officers: {
          where: { isPio: true },
          include: { user: true },
          take: 1,
        },
      },
    });

    const primaryDept =
      allDepartments.find((d) => d.code === routingInfo.primaryDepartmentCode) ||
      allDepartments[0];

    const secondaryDept =
      allDepartments.find((d) => d.code === routingInfo.secondaryDepartmentCode) ||
      allDepartments[1] ||
      null;

    return NextResponse.json({
      success: true,
      routing: {
        primary: primaryDept
          ? {
              id: primaryDept.id,
              name: primaryDept.name,
              code: primaryDept.code,
              ministry: primaryDept.ministry,
              stateOrCentral: primaryDept.stateOrCentral,
              nodalOffice: primaryDept.nodalOffice,
              contactEmail: primaryDept.contactEmail,
              contactPhone: primaryDept.contactPhone,
              avgResponseDays: primaryDept.avgResponseDays,
              pioName: primaryDept.officers[0]?.user?.fullName || "Section 5(1) Designated PIO",
              confidence: routingInfo.matchConfidence,
            }
          : null,
        secondary: secondaryDept
          ? {
              id: secondaryDept.id,
              name: secondaryDept.name,
              code: secondaryDept.code,
              ministry: secondaryDept.ministry,
              confidence: routingInfo.secondaryConfidence,
            }
          : null,
        transferAdvisory: routingInfo.transferAdvisory,
      },
    });
  } catch (error) {
    console.error("Route Authority Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to route authority." },
      { status: 500 }
    );
  }
}
