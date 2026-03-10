# SproutEssence-Website

This update provides a backend-powered checkout flow that sends a WhatsApp order message directly to your registered business number.

## What happens now

- Customer clicks **Order** on a product page.
- Customer fills checkout form (name, phone, email, address, product, quantity).
- On **Place order**, frontend calls `POST /api/orders`.
- Backend sends a WhatsApp message to your number (`918130377588` by default).
- Customer is redirected to `order-success.html`.

The WhatsApp message includes:
- Name
- Phone
- Email
- Address
- Order
- Total price
- Disclaimer: delivery charges may apply and are discussed over phone

## 1) Run locally

### Backend
```bash
cd backend
npm install
cp .env.example .env
```

Set `.env`:
```env
PORT=4000
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token
WHATSAPP_TO_NUMBER=918130377588
```

Start backend:
```bash
npm run dev
```

### Frontend
The frontend is served by the backend (`express.static`), so open:

`http://localhost:4000/products.html`

## 2) WhatsApp Cloud API setup (Meta)

1. Create a Meta Developer app.
2. Add the **WhatsApp** product.
3. Get these values:
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN` (prefer permanent token)
4. Use your business destination number as `WHATSAPP_TO_NUMBER`.
5. Ensure your destination number is allowed in your WhatsApp Cloud setup (especially in test mode).

## 3) Notes

- Unit price is currently fixed at `₹199`.
- Backend calculates total price as `quantity × 199` to avoid client-side tampering.
- Required fields are validated before sending WhatsApp.

## 4) Production hardening suggestions

- Add rate limiting and bot protection.
- Log orders to DB (MongoDB/Postgres) for audit.
- Add email notifications in parallel.
- Add payment gateway (Razorpay/Stripe) before final place-order call.
