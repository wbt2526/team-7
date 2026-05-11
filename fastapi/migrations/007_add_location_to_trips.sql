ALTER TABLE trips
ADD COLUMN location VARCHAR(120) NULL AFTER description;

UPDATE trips
SET location = 'Paris, France'
WHERE title LIKE '%Paris%';

UPDATE trips
SET location = 'Destination to confirm'
WHERE location IS NULL OR location = '';

ALTER TABLE trips
MODIFY COLUMN location VARCHAR(120) NOT NULL;
