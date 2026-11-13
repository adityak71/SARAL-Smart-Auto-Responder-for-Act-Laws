import { NextResponse } from "next/server";
import { registerUser } from "@/lib/services/userService";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, fullName, phone, role, profileData } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: "Email, password, and full name are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const { user, token } = await registerUser({
      email,
      password,
      fullName,
      phone,
      role: role || "CITIZEN",
      profileData: profileData || {},
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Registration successful.",
        user,
        token,
      },
      { status: 201 }
    );

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
    console.error("Register Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Registration failed." },
      { status: 400 }
    );
  }
}
