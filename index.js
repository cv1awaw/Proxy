// index.js

const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Environment Variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MANYBOT_API_URL = process.env.MANYBOT_API_URL; // Optional: Replace if ManyBot provides an API
const CUSTOM_APP_URL = process.env.CUSTOM_APP_URL; // Your Custom App's webhook URL

// Telegram Webhook Endpoint
app.post('/webhook', async (req, res) => {
  const update = req.body;

  try {
    // Forward the update to ManyBot (if API URL is provided)
    if (MANYBOT_API_URL) {
      await axios.post(MANYBOT_API_URL, update, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization headers if required by ManyBot
        },
      });
    }

    // Forward the update to the Custom Application
    if (CUSTOM_APP_URL) {
      await axios.post(CUSTOM_APP_URL, update, {
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary headers
        },
      });
    }

    // Respond to Telegram to acknowledge receipt
    res.sendStatus(200);
  } catch (error) {
    console.error('Error forwarding update:', error);
    res.sendStatus(500);
  }
});

// Health Check Endpoint
app.get('/', (req, res) => {
  res.send('Telegram Proxy Server is running.');
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
