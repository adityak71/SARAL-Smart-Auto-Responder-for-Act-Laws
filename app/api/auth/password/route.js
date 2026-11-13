import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { changeUserPassword } from "@/lib/services/userService";

export async function POST(request) {
  try {
    const session = getAuthSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized session." },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Both current and new password are required." },
        { status: 400 }
      );
    }

    const result = await changeUserPassword(session.userId, {
      currentPassword,
      newPassword,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to change password." },
      { status: 400 }
    );
  }
}
