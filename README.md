# 3D Hat Studio MVP

Launch-ready MVP for custom and ready-made hats.

## Stack
- React + TypeScript + Vite
- Three.js + React Three Fiber + Drei
- Tailwind CSS + Zustand
- Express API + session auth
- Prisma ORM + PostgreSQL (Replit DB compatible)

## Core Features
- Customer auth (signup/login), customer account route protection
- Admin role + protected admin dashboard
- Product split:
  - `customizable=true` blank hats for `/custom-studio`
  - `customizable=false` ready-made hats for `/shop`
- 3D customizer with placement, upload/logo library, text, transform controls, auto-rotate, screenshot export
- Save custom design and add customized product to cart
- Cart supports standard and custom design items
- Checkout placeholder creates order from cart
- Admin products CRUD, order status updates, low-stock snapshot, saved designs view

## Required Routes Implemented
Customer: `/`, `/shop`, `/custom-studio`, `/product/:id`, `/customize/:id`, `/cart`, `/checkout`, `/account`, `/login`, `/signup`

Admin: `/admin/login`, `/admin/dashboard`, `/admin/products`, `/admin/products/new`, `/admin/products/:id/edit`, `/admin/orders`, `/admin/designs`

## Replit Setup
1. Create a Replit PostgreSQL DB and set `DATABASE_URL` in Secrets.
2. Add `SESSION_SECRET` and optional `PORT`.
3. Install packages:
   ```bash
   npm install
   ```
4. Generate Prisma client and migrate:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run db:seed
   ```
5. Start app:
   ```bash
   npm run dev
   ```

## Seeded Accounts
- Admin: `admin@hatstudio.com` / `Admin123!`
- Customer: `customer@hatstudio.com` / `Customer123!`

## 3D Model Replacement
Current customizer uses a procedural cap placeholder but code is prepared for model path data. Replace/add model at:
`/public/models/hat.glb`

Then wire GLB loading in `HatCanvas.tsx` if desired.

## Deployment Notes
- Build: `npm run build`
- Start server: `npm start`
- Ensure reverse proxy sends cookies correctly and set secure cookie in production.
