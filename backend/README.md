# NOAH Backend

Express + Postgres API for the NOAH real-estate prototype.

## Setup

1. Create a Postgres database named `addis_rent`.
2. Copy `.env.example` to `.env`.
3. Update `DATABASE_URL` in `.env` with your local Postgres username and password.
4. Run:

```bash
npm install
npm run db:seed
npm run dev
```

The API runs on `http://localhost:4000` by default.

## Data Modes

The frontend defaults to demo mode, so it can still be deployed as a visual showcase without a backend.

Use the floating data-source switch in the UI to connect to Postgres mode. Postgres mode calls the backend API and uses the same property, agent, profile, search, filter, and CRUD screens.

## Auth

Postgres mode uses backend auth endpoints:

- `POST /api/auth/signup` creates a user with `name`, `username`, `email`, `phone`, `preferredArea`, `password`, and `confirmPassword`.
- `POST /api/auth/signin` checks `username` or `email` plus `password`.

Passwords are hashed with Node's built-in `crypto.scrypt` before they are stored in `users.password_hash`.

## Table Coordination

- `users` stores visitors/owners with unique username/email and a hashed password.
- `agents` stores seeded brokers. The site reads them, but the current UI does not manage them.
- `properties` stores homes. Each property can point to one `agent_id` and one `listed_by_user_id`.
- `property_images` stores a one-to-many gallery for each property.
- `inquiries` stores contact/recommendation messages and can connect a user, property, and agent.

Foreign keys use `ON DELETE SET NULL` where the history should survive, and `ON DELETE CASCADE` for `property_images` because gallery rows belong completely to their property.
