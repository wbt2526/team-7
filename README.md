# Wanderlust

Wanderlust is a full-stack travel booking web application developed for the Web Technologies course at Universidad de Jaén. The application lets visitors browse trips, registered users book and pay for trips through an academic payment simulation, and administrators manage the trip catalog and review platform records.

## Main Features

- Public trip catalog with search by title, description, and location.
- Real destination/location field stored in the backend database.
- Trip details page with seat availability and passenger selection.
- User signup and login with hashed passwords.
- JWT bearer authentication for protected API routes.
- Role-based authorization for normal users and administrators.
- Booking flow for registered users.
- Simulated payment flow for academic testing.
- User booking history with pending booking cancellation.
- Admin dashboard for trips, users, and bookings.
- Admin create/edit trip workflow.

## Tech Stack

- Backend: FastAPI, SQLAlchemy, Pydantic, JWT authentication.
- Database: MariaDB/MySQL, intended for local XAMPP and phpMyAdmin.
- Frontend: React, Vite, React Router, Tailwind CSS.
- API communication: frontend service module in `frontend/src/lib/api.js`.

This project uses Vite with React Router as a standard React single page application implementation. It is not a Next.js project.

## User Roles

- Visitor: can browse the catalog, view trip details, explore locations, and see best value trips.
- Normal user: can register, log in, create bookings, complete simulated payments, view personal bookings, and cancel pending bookings.
- Admin: can create and edit trips, view all users, and view all bookings.

## Project Structure

```text
.
+-- fastapi/                Backend application
|   +-- main.py             FastAPI route definitions
|   +-- auth.py             JWT login and authorization helpers
|   +-- config.py           Environment-based configuration
|   +-- database.py         SQLAlchemy engine/session
|   +-- user/               User model, schemas, CRUD
|   +-- trip/               Trip model, schemas, CRUD
|   +-- booking/            Booking model, schemas, CRUD
|   +-- payment/            Payment model, schemas, CRUD
|   +-- migrations/         Incremental SQL references
+-- frontend/               React/Vite frontend
|   +-- src/pages/          Route pages
|   +-- src/components/     Shared UI components
|   +-- src/lib/            API, auth, and presentation helpers
+-- doc/                    Submission documentation and SQL files
    +-- webapp_final.sql    Official database import for final testing
```

## Database Overview

The final database contains four main tables:

- `users`: registered accounts with numeric roles, where `0` is a normal user and `1` is an admin.
- `trips`: travel products with title, location, description, date, prices, capacity, status, and creator.
- `bookings`: user-owned booking records with traveler counts, total price, status, and creation time.
- `payments`: simulated payment records linked to bookings.

The official database setup file is:

```text
doc/webapp_final.sql
```

It includes the current schema, two demo users, and five demo trips. Older SQL files are not the recommended final setup path.

## Authentication and Authorization

Passwords are hashed before storage. Login returns a JWT bearer token. Protected backend endpoints validate the token and enforce permissions server-side:

- Trip browsing is public.
- Booking and payment require an authenticated user.
- Personal booking access is limited to the current user.
- Trip management, user listing, and all-booking review are admin-only.

Frontend route guards are used for navigation, but security is enforced by the FastAPI backend.

## Payment Simulation

Payment is simulated for this academic demo. No real payment is processed and no real payment provider is integrated.

The payment form accepts card-like data for testing. The backend validates format and stores only the last four digits in `payments.card_last4`. Full card numbers are not stored.

## Setup

Detailed installation and run instructions are in the root `INSTALL` file.

Summary:

1. Start XAMPP Apache/MySQL.
2. Create a MariaDB/MySQL database, for example `webapp`.
3. Import `doc/webapp_final.sql` with phpMyAdmin.
4. Start the FastAPI backend with a matching `DATABASE_URL`.
5. Start the Vite frontend.

## Demo Accounts

- Admin: `admin@wanderlust.test` / `admin123`
- User: `user@wanderlust.test` / `user123`

These accounts are inserted by `doc/webapp_final.sql`.
