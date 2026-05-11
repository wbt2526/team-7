# Storyboard

## User Journey

1. A visitor opens Wanderlust and sees the public trip catalog.
2. The visitor searches by a location such as `Paris` or `Spain`.
3. The visitor opens a trip details page and reviews the date, duration, price, availability, and status.
4. The visitor chooses to book and is prompted to log in.
5. The visitor logs in or creates an account.
6. The user selects the number of adult and child travelers.
7. The user reaches checkout and reads that payment is simulated for the academic demo.
8. The user submits card-like payment data.
9. The backend creates a pending booking, records a simulated payment, confirms the booking, and reduces remaining trip places.
10. The user opens My Bookings and sees the confirmed booking.

## Pending Booking Journey

1. A logged-in user starts checkout.
2. If a pending booking exists before payment confirmation, it is visible in My Bookings.
3. The user can cancel a pending booking.
4. Confirmed bookings are shown as completed records and are not cancelled from this flow.

## Admin Journey

1. An admin logs in with the admin demo account.
2. The admin opens the dashboard.
3. The dashboard shows summary counts for trips, users, bookings, and pending bookings.
4. The admin reviews booking records and user accounts.
5. The admin creates a new trip with title, location, description, date, duration, image, prices, capacity, and status.
6. The admin edits an existing trip when catalog data needs to change.
