# Frontend Component Tree

The frontend is a React single page application built with Vite, React Router, and Tailwind CSS.

```text
App
+-- BrowserRouter
+-- Navbar
+-- Routes
|   +-- /                  HomePage
|   |   +-- HeroSection
|   |   +-- HomeResultsToolbar
|   |   +-- HomeFilters
|   |   +-- TripCard
|   |   +-- HomePagination
|   +-- /tours             ToursPage
|   |   +-- HomeFilters
|   |   +-- TripCard
|   +-- /destinations      DestinationsPage
|   |   +-- TripCard
|   +-- /deals             DealsPage
|   |   +-- TripCard
|   +-- /about             AboutPage
|   +-- /auth              AuthPage
|   +-- /trip/:id          TripDetailsPage
|   +-- /checkout          CheckoutPage
|   +-- /bookings          MyBookingsPage
|   +-- /admin             AdminPage
|   +-- /add-trip          AddTripPage
|   +-- /edit-trip/:id     EditTripPage
+-- Footer
```

## Shared Helpers

- `frontend/src/lib/api.js`: stores the API base URL, sends fetch requests, attaches bearer tokens, and formats API errors.
- `frontend/src/lib/auth.js`: handles login, JWT payload parsing, localStorage session storage, and session retrieval.
- `frontend/src/lib/tripPresentation.js`: formats trip dates and status labels for display.

## Routing Notes

- Public routes include the catalog, trip details, explore, best value, about, and authentication pages.
- The admin routes are guarded in the frontend for navigation convenience.
- Backend authorization remains the source of security for admin-only and owner-only operations.
