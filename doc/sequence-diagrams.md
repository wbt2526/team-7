# Sequence Diagrams – Travel Agency Application

## 1. User Registration

```mermaid
sequenceDiagram
actor User
participant Frontend
participant API
participant DB as Database

User->>Frontend: Fill registration form
Frontend->>API: POST /users
API->>DB: Insert user
DB-->>API: user_id
API-->>Frontend: Registration success
Frontend-->>User: Show login page

## 2. Book a Trip
sequenceDiagram
actor User
participant Frontend
participant API
participant DB as Database

User->>Frontend: Select trip and passengers
Frontend->>API: POST /bookings
API->>DB: Check remaining seats
DB-->>API: Seats available
API->>DB: Insert booking
DB-->>API: booking_id
API-->>Frontend: Booking created
Frontend-->>User: Show confirmation
## 3.Payment Process
sequenceDiagram
actor User
participant Frontend
participant API
participant DB as Database

User->>Frontend: Enter credit card
Frontend->>API: POST /payments
API->>DB: Store payment
DB-->>API: Payment success
API->>DB: Update booking status
API-->>Frontend: Payment confirmed
Frontend-->>User: Show success message
