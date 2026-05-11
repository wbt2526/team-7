-- Wanderlust final database candidate
-- Target: MariaDB/MySQL via XAMPP/phpMyAdmin
-- Demo credentials for professor testing:
--   Admin: admin@wanderlust.test / admin123
--   User:  user@wanderlust.test / user123

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(256) NOT NULL,
    role SMALLINT NOT NULL DEFAULT 0,
    INDEX ix_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE trips (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(120) NOT NULL,
    date DATETIME NOT NULL,
    duration INT NOT NULL,
    image VARCHAR(255) NULL,
    price DECIMAL(10, 2) NOT NULL,
    child_price DECIMAL(10, 2) NOT NULL,
    total_places INT NOT NULL,
    remaining_places INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    created_by INT NOT NULL,
    CONSTRAINT fk_trips_created_by_users
        FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE bookings (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    user_id INT NOT NULL,
    adults INT NOT NULL,
    children INT NOT NULL,
    total_seats INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    booking_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookings_trip_id
        FOREIGN KEY (trip_id) REFERENCES trips(id),
    CONSTRAINT fk_bookings_user_id
        FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE payments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    idempotency_key VARCHAR(64) NOT NULL,
    provider_reference VARCHAR(64) NOT NULL,
    card_last4 VARCHAR(4) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_payments_booking_idempotency (booking_id, idempotency_key),
    CONSTRAINT fk_payments_booking_id
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO users (id, first_name, last_name, email, password, role) VALUES
(1, 'Wanderlust', 'Admin', 'admin@wanderlust.test', '$pbkdf2-sha256$29000$VKq1lhLC.J.Tsra2NobQug$r3Sy6Bwbu6MWvSYTWavL9f1G9P52Gd/8EZpselNMaHg', 1),
(2, 'Demo', 'Traveler', 'user@wanderlust.test', '$pbkdf2-sha256$29000$6T1H6N2b8z5nTEmpVWqt9Q$kuIM.WPRplYUXRIi3xKbEDy.ow8q7zNWL/RJHXUPWs4', 0);

INSERT INTO trips (
    id,
    title,
    description,
    location,
    date,
    duration,
    image,
    price,
    child_price,
    total_places,
    remaining_places,
    status,
    created_by
) VALUES
(
    1,
    'Paris Cultural Escape',
    'Discover Paris through landmark walks, neighborhood cafes, museum visits, and a balanced itinerary designed for first-time travelers.',
    'Paris, France',
    '2026-07-15 10:00:00',
    7,
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    999.00,
    499.00,
    20,
    20,
    'available',
    1
),
(
    2,
    'Madrid Weekend Highlights',
    'Enjoy a compact Madrid itinerary with historic plazas, local food stops, art collections, and guided time in the city center.',
    'Madrid, Spain',
    '2026-08-07 09:30:00',
    4,
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80',
    549.00,
    279.00,
    18,
    18,
    'available',
    1
),
(
    3,
    'Barcelona Coast and Modernism',
    'Explore Barcelona with a mix of coastal time, modernist architecture, market visits, and relaxed evening walks.',
    'Barcelona, Spain',
    '2026-09-05 11:00:00',
    5,
    'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    699.00,
    349.00,
    16,
    16,
    'available',
    1
),
(
    4,
    'Tokyo City Discovery',
    'Experience Tokyo through modern districts, traditional temples, food markets, and carefully guided city exploration.',
    'Tokyo, Japan',
    '2026-10-12 10:00:00',
    8,
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    1299.00,
    699.00,
    14,
    14,
    'available',
    1
),
(
    5,
    'Rome History Walk',
    'Walk through Rome with guided visits to ancient landmarks, historic streets, local dining areas, and cultural highlights.',
    'Rome, Italy',
    '2026-11-03 09:00:00',
    6,
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    849.00,
    429.00,
    12,
    12,
    'available',
    1
);
