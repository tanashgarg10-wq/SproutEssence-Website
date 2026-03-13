# SproutEssence-Website

Sprout Essence uses a cart + checkout flow that opens a prefilled WhatsApp message for order confirmation.

## User flow

1. Customer opens a product page and clicks **Add to cart**.
2. Customer reviews/edits quantities on `cart.html`.
3. Customer goes to `checkout.html`, fills personal details, and clicks **Send order on WhatsApp**.
4. Site opens WhatsApp with a prefilled order message to your business number.

## Where to upload the logo file

Upload your exact logo image into the repo folder:

- `assets/sproutessence.png` (preferred)
- or `assets/sproutessence.jpg` (fallback)

### Steps

1. Put your logo file in the `assets/` folder.
2. Name it exactly `sproutessence.png` (or `sproutessence.jpg`).
3. Deploy/publish your site.

The website already references these paths in header/footer logo markup, so no further code changes are needed.

## Run locally (static preview)

```bash
python -m http.server 4173 --bind 0.0.0.0
```

Open: `http://localhost:4173/products.html`

## Notes

- Unit price is fixed at `₹199`.
- If both files exist, `.png` is used first and `.jpg` is used as fallback.
