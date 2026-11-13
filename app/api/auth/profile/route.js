import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { updateUserProfile, deleteCitizenAccount } from "@/lib/services/userService";

export async function PUT(request) {
  try {
    const session = getAuthSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized session." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const updatedUser = await updateUserProfile(session.userId, body);

    return NextResponse.json({
      success: true,
      message: "Profile details updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile details." },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = getAuthSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized session." },
        { status: 401 }
      );
    }

    const result = await deleteCitizenAccount(session.userId);

    const response = NextResponse.json({
      success: true,
      message: result.message,
    });

    // Clear auth token cookie
    response.cookies.delete("saral_session");

    return response;
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete account." },
      { status: 400 }
    );
  }
}
