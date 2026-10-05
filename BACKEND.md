# Backend handoff: accounts, checkout (SSLCOMMERZ), WhatsApp chat

The site is static (`node site/build.mjs` -> `dist/`). Everything below already works as a **front-end demo**:
data lives in the visitor's browser (`localStorage`), sign-in and payment are simulated. Each piece has one place
in the code where the real backend plugs in. Search for `ponytail:` comments to find them.

## 1. Accounts (sign-in)
- Demo: `site/static/js/site.js`, the `acct` object (`get`, `save`, `signedIn`, `signIn`, `signOut`, `kept`).
  `/account` (`site/static/js/account.js`) shows a simulated "Continue with Google" chooser.
- Build: Google Identity Services on `/account`, server verifies the ID token and starts a session (HTTP-only
  cookie). Replace the five `acct` functions with API calls; the pages only use them.
- Return after sign-in: `/account?next=/checkout#details`. Keep honouring `next` (same-site paths only).

## 2. Basket and orders
- Basket line: `{ id, qty, note }`. `id` is `shop:<slug>` (RX Gear) or `bike:<slug>` (RX bike booking);
  `note` is the bike colour. Catalogue (names, images, prices) is built in `site/pages/account.mjs` (`CATALOG`).
- Prices: RX Gear from `site/data/shop.mjs`. Bikes are sold online as a **booking advance**,
  `SITE.bikeBooking` in `site/data/site.mjs` (Tk 10,000, default to confirm); the balance is paid at the showroom.
  Delivery is shown as free. **The server must recompute every amount from its own price list**; never trust totals
  sent by the browser.
- Delivery details: `{ name, phone, how: "home" | "showroom", address, showroom, note }`. A basket with a bike is
  always "showroom" (handover after registration).
- Order: `{ no, date, status: "processing" | "delivered", paid, pay (method), ship, items: [{ id, qty, note }] }`.
  The account dashboard lists orders and shows the basket ("Basket" card).

## 3. Payment: SSLCOMMERZ
Demo: `site/static/js/checkout.js`. "Pay" opens a simulated SSLCOMMERZ page; "Pay" there creates the order.
Live flow (check field names against SSLCOMMERZ's current developer docs; use the sandbox first):
1. Browser `POST /api/checkout` with the basket and delivery details.
2. Server validates stock and prices, creates the order as `pending`, and calls the **Session API**
   (`https://sandbox.sslcommerz.com/gwprocess/v4/api.php`, live `https://securepay.sslcommerz.com/...`) with
   `store_id`, `store_passwd` (server only), `total_amount`, `currency=BDT`, a unique `tran_id` (= order no),
   `success_url`, `fail_url`, `cancel_url`, `ipn_url`, and the customer and shipping fields.
3. Server returns `GatewayPageURL`; the browser redirects there (replacing the demo dialog).
4. SSLCOMMERZ calls the **IPN** URL. The server checks the amount and `tran_id`, calls the **Validation API** with
   the `val_id`, and only then marks the order `paid`. Do not trust the redirect alone.
5. `success_url` / `fail_url` / `cancel_url` land on `/checkout#done` (or back on `#pay` with a message). The page
   then reads the order status from the server. On success the basket is emptied server-side.

## 4. WhatsApp chat (corner button, every page)
- Demo: `helpSheet()` in `site/lib/layout.mjs` (markup) and the `waForm` block in `site/static/js/site.js`.
  Messages stay in the window; the reply offers "Continue on WhatsApp" (`wa.me/8801332832892?text=...`).
- Live with the **WhatsApp Business (Cloud) API**:
  - `send()` posts the visitor's message to your server (`POST /api/whatsapp/messages`), which forwards it to the
    agent inbox. Visitors need a phone number to be reached on WhatsApp: ask for it in the window (or use the
    signed-in profile's mobile) before the first send.
  - Replies arrive on your webhook from Meta; push them to the open window (polling or SSE) and keep the
    "Continue on WhatsApp" hand-off for visitors who prefer the app.
  - Business-initiated messages outside the 24-hour customer service window need approved templates.

## 5. Not built (front end only)
Order emails/SMS, stock levels, invoices, refunds, delivery tracking, and an admin view. The account "Messages" card
uses canned replies too (`account.js`, `reply()`); it can share the WhatsApp backend.
