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

    const user = await getUserById(session.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, authenticated: false, user: null },
        { status: 404 }
      );
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
