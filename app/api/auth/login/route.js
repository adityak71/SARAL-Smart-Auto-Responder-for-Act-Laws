import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/services/userService";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const { user, token } = await authenticateUser({
      email,
      password,
      role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful.",
      user,
      token,
    });

    // Set secure HTTP-only cookie
    response.cookies.set("saral_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Invalid credentials." },
      { status: 401 }
    );
  }
}
