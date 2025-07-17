// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ Replace with your Yoco TEST secret key (for development)
const secretKey = 'sk_test_15d3ce0d2z4oq6q9bee41e9aee4d'; // <- insert test key here

app.use(cors());
app.use(bodyParser.json());

// Health check route
app.get('/', (req, res) => {
  res.send("✅ Eezy Spaza Payment Backend is running.");
});

// Payment route
app.post('/pay', async (req, res) => {
  const { amount, token } = req.body;

  if (!amount || !token) {
    return res.status(400).json({ success: false, message: "Missing amount or token" });
  }

  try {
    const response = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amountInCents: amount,
        currency: 'ZAR',
        token: token
      })
    });

    const data = await response.json();

    if (response.ok && data.id) {
      console.log("✅ Payment success:", data);
      res.json({ success: true, reference: data.id });
    } else {
      console.error("❌ Payment failed:", data);
      res.status(400).json({ success: false, message: data.message || "Payment request failed" });
    }
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Eezy Spaza backend running at http://localhost:${port}`);
});
