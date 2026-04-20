ALTER TABLE bookings
ADD COLUMN adults INT NULL,
ADD COLUMN children INT NULL,
ADD COLUMN total_seats INT NULL;

UPDATE bookings
SET
    adults = COALESCE(adults, 0),
    children = COALESCE(children, 0),
    total_seats = COALESCE(total_seats, COALESCE(adults, 0) + COALESCE(children, 0));
