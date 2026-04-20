# Frontend Design - Travel Agency

## 1. Component Tree
Based on our UI mockups, the application is divided into the following component hierarchy:

```text
App (Main Container & Router)
 │
 ├── Navbar (Logo, Navigation Links, Profile/Auth status)
 │
 ├── HomePage (Trip Catalog)
 │    ├── HeroSection (Main banner)
 │    ├── SearchBar (Filters)
 │    └── TripList (Container for trips)
 │         └── TripCard (Individual trip component)
 │
 ├── TripDetailsPage 
 │    ├── TripInfo (Description, Images, Remaining places)
 │    └── BookingForm (Form to select adults/children)
 │
 ├── AuthPage (Login & Registration)
 │    └── AuthForm (Email/Password inputs)
 │
 ├── PaymentPage 
 │    ├── OrderSummary (Total price calculation)
 │    └── CreditCardForm (Card details input)
 │
 ├── UserDashboardPage
 │    └── BookingList (User's reservations)
 │         └── BookingItem (Reservation details + Cancel button)
 │
 └── AdminDashboardPage
      ├── DashboardStats (Overview metrics)
      ├── AdminTripTable (List of all trips)
      │    └── AdminTripRow (Edit/Delete actions)
      └── TripFormModal (Popup for Create/Update trip)


## 2. Component Specifications

### 2.1. TripCard
* **Props:** `trip` (object containing title, image, price, remaining_places), `onBook` (function).
* **States:** `isHovered` (boolean - for UI effects).
* **Behavior:** Displays trip summary. If `remaining_places == 0`, the card is visually disabled and the button changes to "Full". Clicking the button triggers navigation to `TripDetailsPage`.

### 2.2. BookingForm
* **Props:** `tripId` (integer), `pricePerPerson` (float), `availableSeats` (integer).
* **States:** `adults` (integer, default 1), `children` (integer, default 0), `totalPrice` (float).
* **Behavior:** Calculates `totalPrice` dynamically `((adults + children) * pricePerPerson)`. Prevents incrementing if `adults + children >= availableSeats`. On submit, sends a POST request to `/bookings/`.

### 2.3. AdminTripRow
* **Props:** `trip` (object), `onEdit` (function), `onDelete` (function), `onChangeStatus` (function).
* **States:** `isDeleting` (boolean - to show a loading spinner).
* **Behavior:** Displays a table row with trip data. Contains buttons for Edit, Delete, and Status toggle. Clicking Delete prompts a confirmation dialogue before calling the API.