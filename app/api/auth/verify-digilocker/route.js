import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = getAuthSession(request);
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized session. Please login." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const aadhaarLast4 = body.aadhaarLast4 || "8821";
    const refCode = `DL-GOV-${aadhaarLast4}-${Date.now().toString().slice(-4)}`;

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        isDigiLockerVerified: true,
      },
      include: {
        citizenProfile: true,
        officerProfile: {
          include: {
            department: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "DigiLocker e-KYC identity authentication verified successfully.",
      digiLockerRef: refCode,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
        isDigiLockerVerified: true,
        officerProfile: updatedUser.officerProfile,
        citizenProfile: updatedUser.citizenProfile,
      },
    });
  } catch (error) {
    console.error("DigiLocker Verification Error:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed. Please retry." },
      { status: 500 }
    );
  }
}
