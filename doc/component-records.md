# Component Records

| Component/Page | Responsibility | Main state | Data source/API | Main interactions |
|---|---|---|---|---|
| `App` | Defines routes and shared layout. | Stored user parsed from localStorage. | localStorage. | Guards admin route navigation. |
| `Navbar` | Main navigation and session controls. | Current stored user. | localStorage. | Login navigation, logout, admin links, My Bookings link. |
| `Footer` | Project footer with real route links. | None. | Static content. | Navigates to real frontend routes. |
| `HomePage` | Main catalog landing page. | Trips, loading, error, search, status filter, sort, page. | `GET /trips/`. | Search, filter, sort, pagination, open trip cards. |
| `HeroSection` | Catalog hero search area. | Receives search props. | Parent state. | Updates catalog search query. |
| `HomeFilters` | Shared catalog filtering controls. | Receives filter props. | Parent state. | Updates search, status filter, and sort mode. |
| `HomeResultsToolbar` | Shows catalog result count. | Receives counts. | Parent state. | Display only. |
| `HomePagination` | Catalog pagination controls. | Receives current page and total pages. | Parent state. | Changes current catalog page. |
| `TripCard` | Displays a trip summary. | None. | Trip prop from backend. | Opens details; shows edit action for admin. |
| `ToursPage` | Full trip catalog page. | Trips, loading, error, search/filter/sort. | `GET /trips/`. | Search and browse all trips. |
| `DestinationsPage` | Groups trips by real backend location. | Trips, loading, error, search, selected location. | `GET /trips/`. | Select location and view its trips. |
| `DealsPage` | Shows lowest-priced available trips. | Trips, loading, error. | `GET /trips/`. | Opens trip cards sorted by real price. |
| `AboutPage` | Explains the project and current catalog count. | Trips count. | `GET /trips/`. | Informational page. |
| `AuthPage` | Login and signup form. | Mode, form fields, loading, error. | `POST /login`, `POST /user/`. | Create account, log in, store JWT session. |
| `TripDetailsPage` | Main booking decision page. | Trip, loading, error, traveler counts. | `GET /trips/{trip_id}`. | Select passengers and continue to checkout. |
| `CheckoutPage` | Booking creation and simulated payment. | Payment fields, pending booking id, loading, errors, success. | `POST /trips/{trip_id}/book`, `POST /bookings/{booking_id}/pay`. | Validate payment form, create pending booking, confirm payment. |
| `MyBookingsPage` | User-owned booking history. | Bookings, related trips, loading, error. | `GET /bookings/me`, `GET /trips/`. | Cancel pending booking. |
| `AdminPage` | Admin dashboard. | Users, trips, bookings, loading, error. | `GET /admin/bookings`, `GET /users/`, `GET /trips/`. | Review platform records and navigate to trip forms. |
| `AddTripPage` | Admin trip creation form. | Form fields, validation, loading, status messages. | `POST /trips/`. | Create trip with location, capacity, prices, and status. |
| `EditTripPage` | Admin trip edit form. | Form fields, validation, loading, status messages. | `GET /trips/{trip_id}`, `PUT /trips/{trip_id}`. | Update trip details. |
