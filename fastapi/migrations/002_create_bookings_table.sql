CREATE TABLE bookings (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    user_id INT NOT NULL,
    adults INT NOT NULL,
    children INT NOT NULL,
    total_seats INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookings_trip_id
        FOREIGN KEY (trip_id) REFERENCES trips(id),
    CONSTRAINT fk_bookings_user_id
        FOREIGN KEY (user_id) REFERENCES users(id)
);
