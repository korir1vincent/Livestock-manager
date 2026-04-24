// src/utils/notifications.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// How notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});

// Request permissions
export async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

// Schedule a notification for a reminder
export async function scheduleReminderNotification({ id, description, type, date }) {
  const granted = await requestNotificationPermissions();
  if (!granted) {
    console.warn('Notification permission not granted');
    return null;
  }

  const triggerDate = new Date(date);

  // Don't schedule if date is in the past
  if (triggerDate <= new Date()) return null;

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `🐄 Reminder: ${type}`,
      body: description,
      data: { reminderId: id },
      sound: true
    },
    trigger: {
      date: triggerDate
    }
  });

  return notificationId;
}

// Cancel a scheduled notification
export async function cancelReminderNotification(notificationId) {
  if (!notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

// Cancel all notifications
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Get all scheduled notifications (for debugging)
export async function getScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}