import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';

// Configuration du comportement des notifications quand l'app est au premier plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Demander la permission (utile sur mobile)
export async function registerForPushNotifications() {
  if (Platform.OS === 'web') {
    return null; // Les notifications web nécessitent un certificat VAPID, on ignore
  }
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Notifications', 'Vous ne recevrez pas de rappels.');
    return null;
  }
  return 'granted';
}

// Afficher une notification immédiate
export async function showLocalNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null, // immédiat
  });
}

// Planifier une notification pour une date future
export async function scheduleNotification(title, body, date) {
  if (Platform.OS === 'web') return; // Non fiable sur web
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { date },
  });
}

// Annuler toutes les notifications programmées (utile à la déconnexion)
export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}