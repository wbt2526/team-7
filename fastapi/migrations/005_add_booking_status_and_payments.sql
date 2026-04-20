ALTER TABLE bookings
ADD COLUMN booking_status VARCHAR(20) NULL DEFAULT 'pending';

UPDATE bookings
SET booking_status = 'pending'
WHERE booking_status IS NULL;

CREATE TABLE IF NOT EXISTS payments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    card_last4 VARCHAR(4) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_booking_id
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
