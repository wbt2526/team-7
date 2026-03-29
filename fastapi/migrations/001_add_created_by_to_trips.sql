ALTER TABLE trips
ADD COLUMN created_by INT NULL;

ALTER TABLE trips
ADD CONSTRAINT fk_trips_created_by_users
FOREIGN KEY (created_by) REFERENCES users(id);
