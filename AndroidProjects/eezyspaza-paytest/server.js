const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config(); // If you use a .env file (optional)

const app = express();
const port = process.env.PORT || 3000;

// ✅ Insert your actual Yoco secret key here
const secretKey = 'sk_live_fdfd3a282z4oq6q142a4041841f9'; // <-- INSERT sk_test_... or sk_live_...

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Root route (for health check)
app.get('/', (req, res) => {
  res.send("✅ Eezy Spaza Payment Backend is running.");
});

// ✅ POST /pay
app.post('/pay', async (req, res) => {
  const { amount, token } = req.body;

  // Basic validation
  if (!amount || !token) {
    return res.status(400).json({
      success: false,
      message: "Missing amount or token"
    });
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
      res.json({
        success: true,
        reference: data.id
      });
    } else {
      console.error("❌ Payment failed:", data);
      res.status(400).json({
        success: false,
        message: data.message || "Payment request was not successful"
      });
    }
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Unexpected server error"
    });
  }
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Eezy Spaza backend running at http://localhost:${port}`);
});
