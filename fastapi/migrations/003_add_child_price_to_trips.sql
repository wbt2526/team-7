ALTER TABLE trips
ADD COLUMN child_price DECIMAL(10, 2) NULL AFTER price;

UPDATE trips
SET child_price = price * 0.50
WHERE child_price IS NULL;
