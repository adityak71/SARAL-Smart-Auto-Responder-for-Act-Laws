import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { getUserById } from "@/lib/services/userService";

export async function GET(request) {
  try {
    const session = getAuthSession(request);

    if (!session) {
      return NextResponse.json(
        { success: false, authenticated: false, user: null },
        { status: 401 }
      );
    }

    let user = null;
    try {
      user = await getUserById(session.userId);
    } catch (e) {
      console.warn("getUserById error in /api/auth/me:", e.message);
    }

    if (!user) {
      // Fallback to verified JWT session details
      user = {
        id: session.userId,
        email: session.email,
        fullName: session.fullName || "SARAL Citizen",
        name: session.fullName || "SARAL Citizen",
        role: session.role || "CITIZEN",
        isDigiLockerVerified: false,
        citizenProfile: {
          addressLine: "",
          district: "",
          state: "",
          pincode: "",
        },
      };
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error("Auth Me Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve user session." },
      { status: 500 }
    );
  }
}
