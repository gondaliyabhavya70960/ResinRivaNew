# WHATSAPP_ORDER_GUIDE.md — WhatsApp Ordering System

> Status: outline (Phase 1 stub). Implemented in Phase 7.

## Why WhatsApp
ResinRiva has **no checkout and no payment gateway**. Every order is finalized over WhatsApp. The website's job is to capture a complete, structured enquiry and hand it to WhatsApp pre-filled.

## Order flow (exact order of operations)
On **Place Order** click:
1. **Validate** the form with Zod.
2. **Client-upload** reference images to Vercel Blob (`@vercel/blob/client` → `handleUpload` at `app/api/upload/route.ts`). Get back public URLs.
3. **Server Action saves an `Inquiry`** to the database, including the final `whatsappMessage` text. This powers the admin "WhatsApp Orders" screen.
4. **Redirect** to the `wa.me` URL (`window.open` / location change). WhatsApp opens pre-filled.

A **live preview** of the exact message is shown before the customer clicks Place Order. A fallback **WhatsApp Order page** shows the summary + an "Open WhatsApp" button if auto-redirect is blocked.

## Message format (example)
```
Hello ResinRiva,

I would like to order:

*Product:* Custom Resin Nameplate
*Size:* 24 Inches
*Color:* Black & Gold
*Material:* Premium Resin
*Custom Text:* Bhavya Gondaliya
*Reference Images:*
https://xxxx.public.blob.vercel-storage.com/refs/ref1.jpg
https://xxxx.public.blob.vercel-storage.com/refs/ref2.jpg
*Additional Notes:* Please create luxury finish.

*Customer Details:*
Name: …
Phone: …
Email: …

(Sent from shop.bhavyagondaliya.co.in)
```

## Link rules
- Format: `https://wa.me/917096036250?text=${encodeURIComponent(message)}`.
- Phone in international format with **NO** `+`, spaces, or dashes.
- Exactly **one** `?text=` parameter. Newlines become `%0A` automatically via `encodeURIComponent`.
- `wa.me` **cannot attach files** → reference images live on Vercel Blob; their public URLs are embedded in the message. The owner opens the links from WhatsApp.

## Testing
- Verify on **iPhone**, **Android**, and **desktop WhatsApp Web**.

> To be expanded with the helper (`src/lib/whatsapp.ts`) and Server Action references in Phase 7.
