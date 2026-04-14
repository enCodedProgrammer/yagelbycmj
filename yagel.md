## 🧠 YAGEL WEBSITE PLAN (AI-READY)

### 🎯 Goal

Build a premium perfume e-commerce website for **Yagel** that:

* Feels luxurious, minimal, and modern
* Converts visitors into buyers
* Works seamlessly across UK, US, and Nigeria

---

## 🧠 SYSTEM INSTRUCTION

You are a senior product designer and full-stack engineer.

Your task is to:

* Convert this plan into UI components and pages
* Generate production-ready code using the defined stack
* Suggest improvements where necessary
* Maintain a premium luxury design aesthetic
* Ensure responsiveness across all devices

---

## ⚙️ TECH STACK

* Framework: Next.js
* Deployment: Vercel
* Styling: Tailwind CSS
* UI Components: shadcn/ui
* Backend & Database: Supabase
* Payments: Stripe
* Emails: Resend

---

## 🎨 BRAND TONE & STYLE

* Elegant, warm, premium
* Minimal layout with strong visual hierarchy
* Use whitespace generously
* Smooth animations and transitions
* Neutral or dark luxury color palette
* Typography should feel refined and modern

---

## 🏠 HOME PAGE STRUCTURE

### 1. HERO SECTION

**Goal:** Capture attention instantly and communicate luxury

**Content:**

* 3D animated product-style video (rotating perfume bottles using product images)
* Overlay text:

  * “Yagel”
  * “A signature of elegance and presence”

**CTA Buttons:**

* Buy Now
* Explore Collection

**UI Behavior:**

* Smooth fade-in animations
* Subtle motion (not overwhelming)
* Center-focused layout

---

### 2. ABOUT SECTION

**Goal:** Build emotional connection

**Content:**

Yagel was created with one purpose — to capture identity through scent.

We believe fragrance is more than something you wear. It is presence. It is memory. It is how you are remembered long after you’ve gone.

Each Yagel fragrance is carefully crafted to balance elegance, warmth, and depth, creating scents that feel personal, confident, and unforgettable.

Designed for both him and her, our fragrances are made to complement individuality, not define it.

Yagel is not just perfume.
It is a signature of elegance and presence.

**UI Behavior:**

* Centered layout
* Soft scroll-based fade-in
* Optional textured or gradient background

---

### 3. PRODUCTS SECTION

#### Product 1: Yagel (For Her)

* Type: Extrait de Parfum

**Description:**
A vibrant opening of citrus, orange, and soft fruity notes is elevated by a touch of saffron. The heart unfolds into a luxurious blend of rose, jasmine, and creamy white florals, wrapped in indulgent hints of chocolate and caramel. It settles into a warm, lasting base of vanilla, oud, amber, and musk, leaving a soft yet powerful trail of elegance.

**Signature Feel:**
Sweet. Warm. Elegant.

---

#### Product 2: Yagel (For Him)

* Type: Extrait de Parfum

**Description:**
A bold opening of mango and citrus is sharpened by ginger and warm spices. The heart reveals a refined blend of woods, patchouli, soft florals, and resin, adding depth and character. It settles into a rich, smoky base of ambergris, amberwood, oud, musk, incense, and vanilla leaving a powerful, lasting impression.

**Signature Feel:**
Bold. Warm. Commanding.

---

### 🛒 PRODUCT ACTIONS

Each product must include:

* Add to Cart
* Buy Now

---

## ⭐ REVIEWS SYSTEM

### Goal

Build trust and increase conversion through social proof.

### Features

* Customers can leave reviews after purchase
* Rating system (1–5 stars)
* Text review
* Display reviewer name (or anonymized)

### UI

* Star rating display
* Review cards under each product
* Average rating summary at top

### Backend (Supabase)

* Table: reviews

  * id
  * product_id
  * user_name
  * rating (1–5)
  * comment
  * created_at

### Logic

* Only allow review submission after successful purchase (optional validation via Stripe session)
* Fetch and display reviews per product

---

## 📦 ORDER STATUS SYSTEM

### Goal

Allow users to track their order after purchase.

### Features

* Order confirmation page after checkout
* Order tracking page (via email link)
* Status updates:

  * Processing
  * Shipped
  * Out for Delivery
  * Delivered

### UI

* Progress tracker (step indicator)
* Order summary (items, price, address)

### Backend (Supabase)

Table: orders

* id
* customer_name
* email
* address
* country
* status (processing, shipped, delivered)
* created_at

Table: order_items

* id
* order_id
* product_name
* quantity
* price

---

### Email Integration (Resend)

* Send order confirmation email
* Include:

  * Order summary
  * Estimated delivery time
  * Tracking link (to order status page)

---

## ⚙️ FUNCTIONAL REQUIREMENTS

### Cart System

* Add/remove items
* Update quantity
* Persist cart state (local storage or Supabase)

---

### Checkout Flow

* Collect user details (name, email, address, country)
* Integrate Stripe for payments
* Show order summary before payment

---

## 🚚 SHIPPING POLICY

At Yagel, we are committed to delivering your order efficiently and securely.

### SHIPPING DESTINATIONS

We currently ship within:

* United Kingdom
* United States
* Canada
* Nigeria

---

### SHIPPING COST

Shipping is **free for all orders**, regardless of location.

---

### SHIPPING TIMES

* United Kingdom: 2–5 Business Days
* United States: 3–10 Business Days
* Nigeria: 3–7 Business Days

Delivery times are estimates and may vary due to unforeseen circumstances.

---

### ORDER PROCESSING

* Orders are processed within 1–3 business days
* Orders placed on weekends or public holidays will be processed on the next business day

We ensure every order is packaged carefully and delivered in perfect condition.

---

## 🌍 TARGET USERS

* Young professionals
* Luxury-conscious buyers
* Customers in UK, US, and Nigeria

---

## 🎯 CONVERSION STRATEGY

* Strong hero visuals
* Clear CTAs above the fold
* Emotional storytelling
* Reviews for social proof
* Order tracking for trust
* Minimal checkout friction
* Mobile-first experience

---

## 🚀 EXPECTED OUTPUT FROM AI

* Full homepage UI (React components)
* Product components with reviews
* Cart + checkout logic
* Stripe integration
* Supabase schema (orders + reviews)
* Order tracking page
* Email system using Resend
* Clean, responsive design using Tailwind + shadcn

---
