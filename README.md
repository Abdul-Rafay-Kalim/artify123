## Artify123 MVP

This document defines the minimum viable product (MVP) for the full Artify123 website.

The goal is simple: launch a reliable art marketplace where users can discover art, view details, add to cart, submit payment proof, and admins can verify payments and manage inventory.

## 1) MVP Goal

Ship a usable marketplace in one release with:
- Browsing and discovery
- Artwork detail viewing
- Cart and checkout flow
- Manual bank transfer proof submission
- Basic artist listing and profile visibility
- Admin verification and stock handling

Success metric for MVP:
- A buyer can complete an end-to-end purchase intent flow in under 5 minutes.

## 2) MVP Users

- Buyer: browses artworks, likes items, places order via manual payment proof.
- Seller/Artist: lists artworks and edits their listings.
- Admin: verifies payment claims and marks inventory state.

## 3) MVP Feature Scope

### 3.1 Public Pages (must-have)

- Home page with curated sections and calls to action.
- Explore page with:
	- Search query support
	- Filters (price, genre, medium)
	- Sorting
- Artwork detail page with image, title, artist, price, and add-to-cart.
- Artists list and artist profile page.
- Contact + legal pages (Terms, Privacy, Returns, Delivery Terms).

### 3.2 Buyer Flow (must-have)

- Add/remove items in cart.
- View cart total.
- Checkout requires login.
- Checkout supports manual bank transfer instructions.
- Buyer uploads screenshot proof + submits claim.
- Cart clears after successful proof submission.

### 3.3 Auth (must-have)

- Login page and callback handling.
- Route guard for checkout when unauthenticated.

### 3.4 Seller Flow (must-have)

- Sell Art page for authenticated users.
- Create and edit listed artworks.
- Upload artwork image(s).
- Seller can see own listings.

### 3.5 Admin Flow (must-have)

- Admin login route.
- Protected admin dashboard route.
- View incoming payment claims.
- Verify/reject claims and update stock/payment status.

## 4) Non-MVP (defer)

These are intentionally out of MVP scope:
- Automated payment gateway integration.
- Real-time chat/messaging guarantees.
- Advanced recommendation engine personalization.
- Multi-currency and international tax logic.
- Complex analytics dashboards.
- Native mobile apps.

## 5) Data & Backend MVP Rules

- Source of artworks:
	- Static seed artworks + listed_artworks from database.
- Inventory:
	- Must prevent purchase when sold out/booked.
- Payment claims:
	- Must store claim details (reference, buyer details, amount, screenshot, items).
- Artist profiles:
	- Must support basic profile fields and avatar.

## 6) Quality Bar for MVP

- No TypeScript compile errors.
- No blocking route crashes in core flow.
- Responsive layout for mobile and desktop on core pages.
- Basic accessibility:
	- All actionable buttons are keyboard reachable.
	- Images have alt text where meaningful.

## 7) MVP Acceptance Checklist

Release is MVP-ready when all checks pass:

1. User can open home, explore, art detail, cart, and checkout without runtime crash.
2. Unauthenticated user is redirected/gated before payment step.
3. Authenticated user can submit payment proof from checkout.
4. Admin can see and process submitted claim.
5. Stock state reflects booked/sold behavior after claim processing.
6. Seller can add at least one listing and it appears on explore.
7. `npm run build` succeeds.
8. Core pages render correctly on small screen and desktop.

## 8) Suggested MVP Milestones

### Milestone A: Stable Buyer Journey
- Finalize Explore -> Detail -> Cart -> Checkout flow.
- Confirm payment-claim creation and UI states.

### Milestone B: Seller + Admin Basics
- Finalize listing creation/edit.
- Finalize admin claim verification workflow.

### Milestone C: Launch Hardening
- Fix high-priority bugs.
- Verify legal/footer/contact content.
- Build and smoke-test before release.

## 9) Local Development

Install and run:

```bash
npm install
npm run dev
```

Production build check:

```bash
npm run build
```

## 10) MVP Definition in One Line

Artify123 MVP is a production-usable art marketplace where buyers can discover and reserve artworks through manual bank transfer proof, while sellers list art and admins verify orders.

