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
      const fallbackRole = session.role || "CITIZEN";
      const fallbackName =
        session.fullName ||
        (fallbackRole === "ADMIN"
          ? "SARAL Central Administrator"
          : fallbackRole === "OFFICER"
          ? "Designated PIO"
          : "SARAL Citizen");

      user = {
        id: session.userId,
        email: session.email,
        fullName: fallbackName,
        name: fallbackName,
        role: fallbackRole,
        isDigiLockerVerified: fallbackRole !== "CITIZEN",
        citizenProfile:
          fallbackRole === "CITIZEN"
            ? {
                addressLine: "",
                district: "",
                state: "",
                pincode: "",
              }
            : null,
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
