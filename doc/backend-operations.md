# Backend Operations – Travel Agency Application

This document describes the CRUD operations required by the backend API.

| Entity | Operation | Input | Output | Description | User Story | Input View | Output View |
|------|------|------|------|------|------|------|------|
| user | create | first_name, last_name, email, password | id | Registers a new user | US-1 | Register Page | Login Page |
| user | read | email, password | user info | Authenticates user login | US-2 | Login Page | Trip Catalog |
| trip | create | title, description, date, duration, price, total_places, status | id | Admin creates a trip | US-9 | Admin Dashboard | Trip Catalog |
| trip | read | /all | trip list | Retrieves all trips | US-4 | Catalog Page | Catalog Page |
| trip | read | id | trip details | Shows detailed trip info | US-5 | Catalog Page | Trip Details |
| trip | update | id, description, date, price, status | updated trip | Admin edits trip information | US-10 | Admin Edit Page | Admin Dashboard |
| trip | delete | id | success message | Admin cancels or removes trip | US-11 | Admin Dashboard | Catalog Page |
| booking | create | user_id, trip_id, adults, children | booking id | User books a trip | US-6 | Booking Page | Confirmation Page |
| booking | read | user_id | booking list | Shows bookings of a user | US-13 | Profile Page | Booking List |
| booking | delete | booking_id | success message | User cancels booking | US-14 | Booking Page | Booking List |
| payment | create | booking_id, card_number, expiry, cvv | payment status | Processes trip payment | US-8 | Payment Page | Confirmation Page |


Add backend operations documentation
