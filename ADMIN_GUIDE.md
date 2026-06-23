# ADMIN_GUIDE.md — Owner's Guide to /studio

> Status: outline (Phase 1 stub). Written in plain, non-developer language across Phases 4–5.
> The admin panel is for **you (the owner) only**. Customers never log in.

## Logging in
1. Go to **https://shop.bhavyagondaliya.co.in/studio**.
2. Enter your admin email and password.
3. You land on the **Dashboard**.

## Where your password lives (and how to recover it)
> Your admin email + password are **never** stored in the website code or on GitHub. They live as **environment variables in Vercel**, which only you can see.

- **To look up the current password:** Vercel → your project → **Settings → Environment Variables** → reveal **`ADMIN_PASSWORD`**. The email is **`ADMIN_EMAIL`**.
- **If you forgot it / are locked out — reset it (safe, keeps all content):**
  1. Vercel → **Settings → Environment Variables**: set **`ADMIN_PASSWORD`** to a new password (Production) and add **`RESET_ADMIN`** = **`1`**.
  2. **Deployments → newest → ⋯ → Redeploy** and wait for it to finish.
  3. Sign in at **/studio/login** with the new password.
  4. **Delete `RESET_ADMIN`** and redeploy once more.
- The login page's **"Forgot password?"** link shows these same steps.
- ⚠️ Never paste the password into chat, code, commits, or GitHub. Keep it in Vercel and/or a password manager.


## Dashboard
- See counts: products, inquiries this week, blog posts.
- See recent WhatsApp orders / inquiries.
- Quick links to common tasks.

## Adding a product (with customization options)
1. **Products → Add Product**.
2. Fill in title, tagline, description, materials, dimensions, timeline.
3. Set price range (or turn off "show price" to display "Enquire").
4. Upload gallery images, an optional video, and an optional 3D model (GLB/USDZ).
5. Use the **Custom Form Builder** to add the questions customers answer (size, colour, theme, engraving text, LED on/off, metallic finish, photo-upload note…). Each field has a label, type, options, required toggle, and help text.
6. Assign a category, fill SEO fields, then **Publish**.
7. These fields automatically appear on the product page and flow into the WhatsApp order message.

## Managing WhatsApp orders / inquiries
1. **Inquiries / WhatsApp Orders** shows every submitted order with customer details, selections, and reference-image links.
2. Move each order through statuses: **New → Contacted → Confirmed → Delivered**.

## Writing a blog post
1. **Blog → Add Post**.
2. Write with the rich editor, add a cover image, pick a category and tags.
3. Fill SEO title/description, set publish date, then **Publish**.

## Portfolio case studies
- **Portfolio → Add** — title, story, before/after images, gallery, video, and result metadata (Type, Material, Size, Timeline).

## Site settings
- **Settings** — brand info, hero video, announcement bar, social links, contact details. These update the live site.

## Other sections
- **Categories, Testimonials, FAQs, Media Library, SEO defaults, Users (admin/editor), Activity Logs.**

> Each section will be documented step-by-step with screenshots in Phases 4–5.
