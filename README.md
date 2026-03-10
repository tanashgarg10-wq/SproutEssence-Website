# SproutEssence-Website

Sprout Essence now has a complete cart + checkout + backend WhatsApp order flow.

## User flow

1. Customer opens a product page and clicks **Add to cart**.
2. Customer reviews/edit quantities on `cart.html`.
3. Customer goes to `checkout.html`, fills personal details, and clicks **Place order**.
4. Backend sends the order directly to your WhatsApp Business destination number.
5. Customer sees `order-success.html`.

## Order details sent to WhatsApp

- Customer name
- Customer phone number
- Customer email
- Delivery address
- Order items with quantities
- Total price (server-calculated)
- Notes
- Disclaimer: delivery charges may apply according to distance and will be discussed over phone

## Run locally

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Open: `http://localhost:4000/products.html`

## Environment variables

```env
PORT=4000
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token
WHATSAPP_TO_NUMBER=918130377588
```

## Notes

- Unit price is fixed at `₹199`.
- Backend recomputes total using cart quantities to reduce client-side tampering.
- Keep WhatsApp token and credentials only in environment variables.
