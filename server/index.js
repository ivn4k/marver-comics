const path = require('path');
const express = require('express');
const webPush = require('web-push');

const app = express();
const PORT = 3000;

// Vapid keys
const publicKey =
  'BLXpdiyjXs1E2DBKahB1GaMh-rY-PKDQh3KoaNn1eMY4JCPSOd6K-1gaWYg-uw1UMRGia_y6drKyPFP3dilqUb8';
const privateKey = 'n5hr1uNnS34Vf0atsOtwuaILSXatmp9z7bqpYe_rsIs';

const subscriptions = [];

webPush.setVapidDetails(
  'mailto:konstantin.zelinsky@effective.band',
  publicKey,
  privateKey
);

app.use(express.json());

// Improved CORS handling
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Origin, Accept');
  res.set('Access-Control-Max-Age', '86400');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
});

app.use(express.static(path.join(__dirname, 'client')));

// Simple health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('Push notification server is running');
});

app.get('/subscriptions', (req, res) => {
  console.log('GET /subscriptions request received');
  res.status(200).json(subscriptions);
});

app.post('/subscribe', (req, res) => {
  console.log('POST /subscribe request received');
  const subscription = req.body;

  if (
    subscriptions.findIndex(
      (subscriber) =>
        subscriber.keys?.p256h === subscription.keys?.p256h &&
        subscriber.keys?.auth === subscription.keys?.auth
    ) === -1
  ) {
    console.log('Add subscription');
    subscriptions.push(subscription);
  }

  res.status(201).end();
});

app.post('/send-notification', async (req, res) => {
  console.log('POST /send-notification request received:', req.body);
  const payload = JSON.stringify(req.body);

  if (subscriptions.length === 0) {
    console.log('No subscriptions available');
    res.status(200).json({ message: 'No subscribers available' });
    return;
  }

  try {
    console.log(`Sending notifications to ${subscriptions.length} subscribers`);
    
    const sendPromises = subscriptions.map(async (subscription) => {
      try {
        return await webPush.sendNotification(subscription, payload);
      } catch (error) {
        console.error('Error sending notification to subscriber:', error);
        return null;
      }
    });
    
    await Promise.all(sendPromises);
    console.log('All notifications sent');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});

app.listen(PORT, () => {
  console.log(`Push notification server started on port ${PORT}`);
  console.log(`Server URL: http://localhost:${PORT}`);
});