# Real Estate PWA

Judah/noah Real Estate PWA is a TypeScript real-estate prototype for browsing homes, contacting agents, signing in, and managing property listings. The app supports two data modes: a static demo mode for presentation/deployment, and a Postgres mode for local backend/database testing.

## Screenshots

![Homepage](./screenshot1.png)
![Property Detail](./screenshot2.png)

## Features

- Responsive real-estate frontend based on the NOAH design theme.
- Property catalog with search, filters, sorting, detail pages, image preview, and similar listings.
- Agent directory with filterable brokers, detail pages, ratings, and brokered work.
- Contact/dashboard area for editing user details and managing user-created properties.
- Demo/Postgres data-source switch with confirmation dialogs.
- URL routes for normal app navigation:
  - `/`
  - `/properties`
  - `/properties/:id`
  - `/agents`
  - `/agents/:id`
  - `/contact`
  - `/login`
  - `/signup`
- Postgres-mode signup/signin with hashed passwords.
- Postgres-backed property create, edit, mark sold/available, and delete.

## Tech Stack

Frontend:
- React
- TypeScript
- Vite
- Lucide React icons
- CSS responsive layout

Backend:
- Node.js
- Express
- TypeScript
- `pg` for Postgres access
- `dotenv` for local environment variables
- Node `crypto.scrypt` for password hashing

Database:
- PostgreSQL
- pgAdmin for visual database inspection

## Data Modes

Demo mode is the default. It uses frontend static data, so the app can be deployed as a showcase without deploying the backend or database.

Postgres mode is activated from the floating data-source switch in the UI. When enabled, the frontend calls the backend API at `http://localhost:4000/api` and loads properties, agents, users, and CRUD changes from PostgreSQL.

Switching modes or refreshing Postgres data asks for confirmation before replacing the current UI data.

## Authentication

In Postgres mode:
- Signup asks for name, username, email, phone, preferred area, password, and confirm password.
- Signin asks for username/email and password only.
- The backend checks whether the user exists and returns clear errors for missing users, duplicate signup details, wrong passwords, and invalid form data.
- Passwords are hashed with `crypto.scrypt` and stored in `users.password_hash`.

In demo mode, signin/signup only controls the local presentation state.

## Database Schema

The database schema is stored here:

[backend/sql/schema.sql](./backend/sql/schema.sql)

A human-readable schema note is here:

[backend/DATABASE_SCHEMA.txt](./backend/DATABASE_SCHEMA.txt)

The schema includes:
- `users`
- `agents`
- `properties`
- `property_images`
- `inquiries`

Relationships:
- One user can list many properties through `properties.listed_by_user_id`.
- One agent can broker many properties through `properties.agent_id`.
- One property can have many images through `property_images.property_id`.
- Inquiries can connect users, agents, and properties.

## Local Setup

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Create or update backend `.env`:

```txt
PORT=4000
DATABASE_URL=postgres://postgres:password@localhost:5432/addis_rent
FRONTEND_ORIGIN=http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174
```

Create and seed the database:

```bash
cd backend
npm run db:seed
```

Run the backend:

```bash
cd backend
npm run dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

## Useful Commands

Backend:

```bash
npm run build
npm run db:seed
npm run devseed
npm run dev
```

Frontend:

```bash
npm run build
npm run dev
```

## Viewing Data in pgAdmin

Open pgAdmin and browse:

`Servers > PostgreSQL 17 > Databases > addis_rent > Schemas > public > Tables`

Right-click a table and choose:

`View/Edit Data > All Rows`

Detailed pgAdmin instructions are saved here:

[backend/PGADMIN_VIEW_DATA.txt](./backend/PGADMIN_VIEW_DATA.txt)
