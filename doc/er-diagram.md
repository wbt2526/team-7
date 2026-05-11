# Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ TRIPS : creates
    USERS ||--o{ BOOKINGS : makes
    TRIPS ||--o{ BOOKINGS : receives
    BOOKINGS ||--o{ PAYMENTS : has

    USERS {
        int id PK
        string first_name
        string last_name
        string email
        string password
        int role
    }

    TRIPS {
        int id PK
        string title
        string location
        text description
        datetime date
        int duration
        string image
        decimal price
        decimal child_price
        int total_places
        int remaining_places
        string status
        int created_by FK
    }

    BOOKINGS {
        int id PK
        int trip_id FK
        int user_id FK
        int adults
        int children
        int total_seats
        decimal total_price
        string booking_status
        datetime created_at
    }

    PAYMENTS {
        int id PK
        int booking_id FK
        string idempotency_key
        string provider_reference
        string card_last4
        string payment_status
        datetime payment_date
    }
```

## Relationship Summary

- One user can create many trips through `trips.created_by`.
- One user can make many bookings through `bookings.user_id`.
- One trip can receive many bookings through `bookings.trip_id`.
- One booking can have payment records through `payments.booking_id`.
