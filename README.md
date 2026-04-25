# 3D Hat Studio

A full-stack MVP ecommerce app for selling ready-made hats and custom-designed hats with a 3D customizer.

## What the app does

- **Custom Hat Studio**: pick a blank hat, upload/select a logo, add text, choose placement, preview in 3D, save design, add to cart.
- **Ready-Made Hat Shop**: browse branded pre-designed hats, filter, view details, add to cart.
- **Admin Dashboard**: manage products, view low stock, view/update orders, view saved custom designs.

## Tech stack

- Frontend: React + TypeScript + Vite + Tailwind + Zustand + React Three Fiber + Drei
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + Prisma ORM
- Auth: Email/password with bcrypt hashing + session cookies

## Required tools

- Node.js 18+
- npm 9+
- PostgreSQL (Replit built-in PostgreSQL supported)

## Project structure (portable ZIP-ready)

```
3d-hat-studio/
├── client/                # Frontend app
├── server/                # Backend API
├── prisma/                # DB schema + seed
├── public/models/         # 3D model placeholder docs
├── README.md
├── .env.example
├── .gitignore
├── package.json
└── vite.config.ts
```

## Installation

```bash
npm install
```

## Environment setup

1. Copy env template:
   ```bash
   cp .env.example .env
   ```
2. Set real values in `.env`, especially:
   - `DATABASE_URL`
   - `SESSION_SECRET`

## Database setup

```bash
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
```

## Run locally

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

## Admin login setup

After seeding, default admin account is:

- Email: `admin@hatstudio.com`
- Password: `Admin123!`

Admin login route: `/admin/login`

## How to add products

### Admin UI method

1. Login as admin.
2. Go to `/admin/products`.
3. Click **Add Product**.
4. Fill in product fields:
   - set `customizable=true` for blank custom hats
   - set `customizable=false` for ready-made hats
5. Save.

### Seed method

Edit `prisma/seed.ts` and run:

```bash
npm run db:seed
```

## How to replace the 3D hat model

Current customizer uses a procedural placeholder in `client/src/components/HatCanvas.tsx`.

To use a production GLB model:

1. Place model at:
   ```
   /public/models/hat.glb
   ```
2. Update `HatCanvas.tsx` to load GLB (e.g., with `useGLTF('/models/hat.glb')`).
3. Keep material/zone naming aligned with your production model as needed.

## Packaging as ZIP (for handoff)

Use this command from project root:

```bash
zip -r 3d-hat-studio.zip . -x "node_modules/*" ".env" "dist/*" "dist-server/*" "build/*" ".git/*"
```

## What is intentionally excluded from ZIP

- `node_modules/`
- `.env`
- build outputs (`dist/`, `dist-server/`, `build/`)
- `.git/`
- private keys/secrets

## Deploy later (high-level)

1. Provision PostgreSQL in target environment.
2. Set env vars (`DATABASE_URL`, `SESSION_SECRET`, `PORT`).
3. Install dependencies and run Prisma migrations.
4. Build and start app:
   ```bash
   npm run build
   npm start
   ```
5. Configure reverse proxy/hosting for frontend + API and secure cookies in production.
