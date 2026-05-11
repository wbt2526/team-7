# Backend Operations

This document lists the current FastAPI operations used by Wanderlust. Access control is enforced by the backend, not only by frontend route guards.

## Access Levels

- Public: available without login.
- Authenticated user: requires a valid JWT bearer token.
- Owner-only: requires a valid token and the resource must belong to the current user.
- Owner-or-admin: the current user owns the resource, or the current user has admin role.
- Admin-only: requires a valid token for a user with role `1`.

## Operations Table

| Entity | Operation | Method | Endpoint | Access level | Description |
|---|---|---:|---|---|---|
| User | Register user | POST | `/user/` | Public | Creates a normal user account. Public signup always creates role `0`. |
| Auth | Login | POST | `/login` | Public | Validates credentials and returns a JWT bearer token. |
| Auth | Refresh login | PUT | `/login` | Public with token parameter | Reissues a JWT from an existing token if valid. |
| Trip | List trips | GET | `/trips/` | Public | Returns the public trip catalog. |
| Trip | Read trip | GET | `/trips/{trip_id}` | Public | Returns one trip by id. |
| Trip | Create trip | POST | `/trips/` | Admin-only | Creates a new trip and assigns the admin as creator. |
| Trip | Update trip | PUT | `/trips/{trip_id}` | Admin-only | Updates the main trip fields. |
| Trip | Update trip status | PATCH | `/trips/{trip_id}/status` | Admin-only | Updates trip status to an allowed value. |
| Trip | Delete trip | DELETE | `/trips/{trip_id}` | Admin-only | Deletes a trip record. |
| Booking | Create booking | POST | `/trips/{trip_id}/book` | Authenticated user | Creates a pending booking for the current user. The client does not provide `user_id`. |
| Booking | My bookings | GET | `/bookings/me` | Authenticated user | Returns bookings belonging to the current user. |
| Booking | Cancel pending booking | PATCH | `/bookings/{booking_id}/cancel` | Owner-only, pending-only | Cancels a pending booking owned by the current user. Confirmed bookings are not cancelled here. |
| Booking | Admin booking list | GET | `/admin/bookings` | Admin-only | Returns all booking records for administration. |
| Payment | Pay booking | POST | `/bookings/{booking_id}/pay` | Owner-only, pending booking | Creates a simulated payment for the owner's pending booking and confirms the booking on success. |
| User | List users | GET | `/users/` | Admin-only | Returns all users. |
| User | Read user | GET | `/users/{user_id}` | Owner-or-admin | Returns a single user. |
| User | Read user by email | GET | `/users/email/{email}` | Admin-only | Returns a user by email for administration. |
| User | Update user | PUT | `/users/{user_id}` | Owner-or-admin | Updates user data. Only admins can change roles. |
| User | Delete user | DELETE | `/users/{user_id}` | Admin-only | Deletes a user account. |

## Authorization Notes

- JWT authentication is implemented in `fastapi/auth.py`.
- Admin checks require numeric role `1`.
- Normal users use numeric role `0`.
- Booking and payment operations use the current JWT user. They do not trust a `user_id` from the frontend.
- Frontend route guards improve navigation, but backend dependencies enforce the real authorization rules.
