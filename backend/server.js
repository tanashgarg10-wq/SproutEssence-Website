import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UNIT_PRICE = 199;
const DELIVERY_DISCLAIMER =
  "Delivery charges may apply according to distance. Final delivery charges will be discussed over phone.";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/orders", async (req, res) => {
  const { name, phone, email, address, itemName, quantity, notes } = req.body || {};

  const cleanedQuantity = Number.parseInt(quantity, 10);
  if (!name || !phone || !email || !address || !itemName || Number.isNaN(cleanedQuantity) || cleanedQuantity < 1) {
    return res.status(400).json({ error: "Missing or invalid order fields." });
  }

  const totalPrice = UNIT_PRICE * cleanedQuantity;
  const items = `${itemName} x ${cleanedQuantity}`;

  const messageBody = [
    "🛒 *New Sprout Essence Order*",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Address: ${address}`,
    `Order: ${items}`,
    `Total Price: ₹${totalPrice}`,
    `Notes: ${notes || "N/A"}`,
    "",
    `Disclaimer: ${DELIVERY_DISCLAIMER}`,
  ].join("\n");

  try {
    await sendWhatsAppMessage(messageBody);
    return res.status(201).json({ success: true, totalPrice });
  } catch (error) {
    return res.status(500).json({ error: "Failed to send WhatsApp notification.", details: error.message });
  }
});

async function sendWhatsAppMessage(bodyText) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const toNumber = process.env.WHATSAPP_TO_NUMBER || "918130377588";

  if (!phoneNumberId || !accessToken || !toNumber) {
    throw new Error("Missing WhatsApp Cloud API environment variables.");
  }

  const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: toNumber,
      type: "text",
      text: { body: bodyText },
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`WhatsApp API error: ${response.status} ${responseText}`);
  }
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
