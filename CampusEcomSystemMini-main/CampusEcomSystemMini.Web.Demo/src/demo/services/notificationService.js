// Demo Notification Service
import { notificationRepository } from "../repositories";
import { delay } from "./authService";

export async function getNotifications() {
  await delay(100);
  return notificationRepository.getNotifications("demo-user-1");
}

export async function getUnreadNotifications() {
  await delay(100);
  return notificationRepository.getUnreadNotifications("demo-user-1");
}

export async function markNotificationAsRead(notificationId) {
  await delay(100);
  return notificationRepository.markAsRead(notificationId);
}

export async function markAllNotificationsAsRead() {
  await delay(100);
  return notificationRepository.markAllAsRead("demo-user-1");
}