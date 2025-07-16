const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

// 🔐 Yoco Test Secret Key
const secretKey = 'sk_test_...'; // Replace with your Yoco test key

app.use(cors());
app.use(bodyParser.json());

app.post('/pay', async (req, res) => {
  const { amount, currency, description } = req.body;

  try {
    const response = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amountInCents: amount,
        currency: currency,
        card: {
          number: "4242424242424242", // Yoco test card
          expiry_month: "01",
          expiry_year: "2026",
          cvc: "123",
          name: "Test User"
        },
        description: description,
      }),
    });

    const data = await response.json();

    if (data.id) {
      res.json({
        success: true,
        reference: data.id,
      });
    } else {
      res.json({
        success: false,
        message: data.message || "Payment failed",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Yoco backend running on port ${port}`);
});
