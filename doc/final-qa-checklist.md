# Final QA Checklist

Use this checklist before final submission.

## Fresh Setup

- [ ] Start XAMPP Apache and MySQL.
- [ ] Create a fresh database, for example `webapp`.
- [ ] Import `doc/webapp_final.sql` with phpMyAdmin.
- [ ] Set `DATABASE_URL=mysql+pymysql://root:@localhost/webapp`.
- [ ] Start backend with `python -m uvicorn main:app --reload` from `fastapi/`.
- [ ] Open `http://127.0.0.1:8000/docs`.
- [ ] Start frontend with `npm run dev` from `frontend/`.
- [ ] Open `http://localhost:5173`.

## Public Features

- [ ] Visitor can open the home page.
- [ ] Visitor can browse public trips.
- [ ] Visitor can open trip details.
- [ ] Search works by title.
- [ ] Search works by description.
- [ ] Search works by location.
- [ ] Explore page groups trips by real location.
- [ ] Best Value page sorts available trips by real price.

## User Flow

- [ ] Demo user login works: `user@wanderlust.test` / `user123`.
- [ ] User can select passengers on trip details.
- [ ] User can create a booking from checkout.
- [ ] Simulated payment confirms the booking.
- [ ] A payment row is created with only `card_last4`.
- [ ] Trip `remaining_places` decreases after confirmed payment.
- [ ] My Bookings displays confirmed bookings.
- [ ] Pending bookings can be cancelled.

## Admin Flow

- [ ] Demo admin login works: `admin@wanderlust.test` / `admin123`.
- [ ] Admin dashboard loads users, trips, and bookings.
- [ ] Admin can create a trip.
- [ ] Admin can edit a trip.
- [ ] Normal user cannot access admin-only API operations.

## Technical Checks

- [ ] `npm run build` passes in `frontend/`.
- [ ] Backend import sanity passes from `fastapi/`.
- [ ] Swagger route access levels match `doc/backend-operations.md`.
- [ ] README and INSTALL point to `doc/webapp_final.sql`.
- [ ] No final instructions recommend Alembic or old SQL files as the main setup path.
