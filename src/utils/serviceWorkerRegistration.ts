const publicVapidKey = 'BLXpdiyjXs1E2DBKahB1GaMh-rY-PKDQh3KoaNn1eMY4JCPSOd6K-1gaWYg-uw1UMRGia_y6drKyPFP3dilqUb8';

const SERVER_URL = 'http://localhost:3000';

export const testServerConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${SERVER_URL}/subscriptions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
    });
    console.log('Server connection test:', response);
    return true;
  } catch (error) {
    console.error('Server connection test failed:', error);
    return false;
  }
};

export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered successfully:', registration.scope);
      
      const isServerAvailable = await testServerConnection();
      if (isServerAvailable) {
        console.log('Server is available, proceeding with notification permission');
        await requestNotificationPermission();
      } else {
        console.warn('Push notification server is not available. Make sure to start the server with: cd server && npm run dev');
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  } else {
    console.log('Service Workers are not supported in this browser.');
  }
};

export const requestNotificationPermission = async (): Promise<void> => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      await subscribeToPushNotifications();
    } else {
      console.log('Notification permission denied.');
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
};

export const subscribeToPushNotifications = async (): Promise<void> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    const applicationServerKey = urlBase64ToUint8Array(publicVapidKey);
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
    
    console.log('Push subscription successful:', subscription);
    
    const isServerAvailable = await testServerConnection();
    if (!isServerAvailable) {
      console.error('Server not available. Cannot send subscription.');
      return;
    }
    
    await fetch(`${SERVER_URL}/subscribe`, {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Push subscription sent to server.');
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
  }
};

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

export const sendTestNotification = async (title: string, body: string, url: string = '/'): Promise<void> => {
  try {
    const isServerAvailable = await testServerConnection();
    if (!isServerAvailable) {
      alert('Server not available. Make sure to start the notification server (cd server && npm run dev)');
      return;
    }

    console.log('Sending notification to server:', { title, body, url });
    
    const response = await fetch(`${SERVER_URL}/send-notification`, {
      method: 'POST',
      body: JSON.stringify({ title, body, url }),
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
    });
    
    console.log('Test notification response:', response);
    console.log('Test notification sent to server.');
  } catch (error: unknown) {
    console.error('Error sending test notification:', error);
    if (error instanceof Error) {
      alert(`Failed to send notification: ${error.message}. Make sure the server is running.`);
    } else {
      alert('Failed to send notification. Make sure the server is running.');
    }
  }
};