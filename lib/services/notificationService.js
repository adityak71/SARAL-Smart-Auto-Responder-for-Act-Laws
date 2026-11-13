import prisma from "../prisma.js";

/**
 * Fetches notifications for a specific user
 */
export async function getUserNotifications(userId, limit = 20) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Marks a specific notification as read
 */
export async function markNotificationAsRead(notificationId, userId) {
  return await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  });
}

/**
 * Marks all notifications for a user as read
 */
export async function markAllNotificationsAsRead(userId) {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}
