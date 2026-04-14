# Yagel — Architecture

## High-Level Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Browser    │────>│   Next.js    │────>│  Supabase   │
│  (Customer)  │<────│   (Vercel)   │<────│  (Postgres) │
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
                    ┌──────┴───────┐
                    │              │
              ┌─────▼─────┐ ┌─────▼─────┐
              │   Stripe   │ │  Resend   │
              │ (Payments) │ │ (Emails)  │
              └───────────┘ └───────────┘
```

## Frontend Architecture

### Framework
- **Next.js App Router** with Server Components by default
- Client Components only where interactivity is needed (cart, animations, forms)

### Pages

| Route | Purpose |
|-------|---------|
| `/` | Homepage (hero, about, products, reviews) |
| `/products/[slug]` | Individual product page |
| `/cart` | Shopping cart |
| `/checkout` | Checkout form + Stripe payment |
| `/checkout/success` | Post-payment confirmation |
| `/order/[id]` | Order tracking (accessed via email link with token) |
| `/review/[token]` | Review submission (accessed via email link) |
| `/shipping` | Shipping policy page |
| `/admin` | Admin dashboard (protected) |
| `/admin/orders` | Order management |
| `/admin/reviews` | Review moderation |

### Component Structure
```
components/
  layout/
    Header.tsx          # Navigation bar
    Footer.tsx          # Footer with links
  home/
    HeroSection.tsx     # Animated hero with Framer Motion
    AboutSection.tsx    # Brand story
    ProductsSection.tsx # Product cards
    ReviewsSection.tsx  # Featured reviews
  product/
    ProductCard.tsx     # Product display card
    ProductDetail.tsx   # Full product view
    ReviewList.tsx      # Reviews for a product
    ReviewForm.tsx      # Review submission form
  cart/
    CartItem.tsx        # Individual cart item
    CartSummary.tsx     # Cart totals
  checkout/
    CheckoutForm.tsx    # Customer details form
    OrderSummary.tsx    # Pre-payment summary
  order/
    OrderTracker.tsx    # Status progress indicator
  admin/
    OrderTable.tsx      # Orders list
    StatusUpdater.tsx   # Change order status
    ReviewModerator.tsx # Approve/remove reviews
  ui/                   # shadcn/ui components
```

## Backend Architecture

### Supabase Database Schema

#### `products`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| name | text | "Yagel (For Her)" / "Yagel (For Him)" |
| slug | text | URL-friendly name |
| type | text | "Extrait de Parfum" |
| description | text | Full fragrance description |
| signature_feel | text | "Sweet. Warm. Elegant." |
| price_gbp | decimal | Price in GBP (40.00) |
| price_usd | decimal | Price in USD (40.00) |
| price_ngn | decimal | Price in NGN (40,000.00) |
| image_url | text | Product image path |
| created_at | timestamptz | Auto-generated |

#### `orders`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| customer_name | text | |
| email | text | |
| address | text | Full shipping address |
| country | text | UK, US, or NG |
| status | text | processing / shipped / out_for_delivery / delivered |
| stripe_session_id | text | For payment verification |
| tracking_token | text | Unique token for order tracking URL |
| total_amount | decimal | |
| currency | text | GBP, USD, or NGN |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `order_items`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| order_id | uuid | FK to orders |
| product_id | uuid | FK to products |
| product_name | text | Denormalized for history |
| quantity | integer | |
| price | decimal | Price at time of purchase |

#### `reviews`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| product_id | uuid | FK to products |
| order_id | uuid | FK to orders (purchase verification) |
| reviewer_name | text | |
| rating | integer | 1-5 |
| comment | text | |
| review_token | text | Unique token sent via email |
| is_approved | boolean | Admin moderation flag |
| created_at | timestamptz | |

### Row Level Security (RLS)
- **Products:** Public read, admin write
- **Orders:** Read via tracking token only, admin full access
- **Reviews:** Public read (approved only), write via review token, admin full access

## Integration Flows

### Checkout Flow
```
1. Customer fills checkout form (name, email, address, country)
2. Frontend creates Stripe Checkout Session via API route
3. Customer redirected to Stripe payment page
4. On success: Stripe webhook fires
5. API route receives webhook:
   a. Creates order in Supabase (status: "processing")
   b. Creates order_items
   c. Generates tracking_token and review_token
   d. Sends confirmation email via Resend (includes tracking link)
6. Customer redirected to /checkout/success
```

### Order Tracking Flow
```
1. Customer clicks tracking link from email: /order/[id]?token=[tracking_token]
2. Page validates token against Supabase
3. Displays order details and status progress bar
```

### Review Flow
```
1. After delivery, admin triggers review request email (or auto-send after X days)
2. Email contains link: /review/[review_token]
3. Customer submits rating + comment
4. Review saved with is_approved = false
5. Admin approves review in admin panel
6. Approved reviews displayed on product page
```

### Admin Authentication
- Simple password-based protection (environment variable)
- Or Supabase Auth with a single admin account
- Admin routes check authentication before rendering

## Currency & Pricing
- Prices are region-based, NOT currency-converted. Each product has a fixed price per country:
  - Nigeria: NGN 40,000
  - UK: GBP 40
  - US: USD 40
- Customer selects their country (or auto-detected via IP) and sees prices in their local currency.
- Stripe Checkout session is created with the correct currency and amount for the selected country.

## Cart System
- **Storage:** localStorage (client-side)
- **State management:** React Context or Zustand
- **Persists:** across page navigation and browser refresh
- **Syncs:** cart state passed to checkout, then to Stripe

## Email Templates (Resend)
1. **Order Confirmation** — order summary, estimated delivery, tracking link
2. **Shipping Update** — status change notification
3. **Review Request** — post-delivery invitation to leave a review
