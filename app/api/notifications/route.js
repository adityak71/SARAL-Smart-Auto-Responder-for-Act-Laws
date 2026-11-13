import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/services/notificationService";

async function getTargetUserId(request) {
  const session = getAuthSession(request);
  if (session?.userId) return session.userId;
  // Fallback demo user if unauthenticated in preview
  const demoUser = await prisma.user.findFirst({ where: { role: "CITIZEN" } });
  return demoUser?.id || null;
}

export async function GET(request) {
  try {
    const userId = await getTargetUserId(request);
    if (!userId) {
      return NextResponse.json({ success: true, count: 0, notifications: [] });
    }

    const notifications = await getUserNotifications(userId);

    return NextResponse.json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve notifications." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const userId = await getTargetUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      await markAllNotificationsAsRead(userId);
      return NextResponse.json({
        success: true,
        message: "All notifications marked as read.",
      });
    }

    if (notificationId) {
      await markNotificationAsRead(notificationId, userId);
      return NextResponse.json({
        success: true,
        message: "Notification marked as read.",
      });
    }

    return NextResponse.json(
      { success: false, error: "Specify notificationId or markAll: true." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Update Notification Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update notification." },
      { status: 500 }
    );
  }
}
