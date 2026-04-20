ALTER TABLE payments
ADD COLUMN idempotency_key VARCHAR(64) NULL,
ADD COLUMN provider_reference VARCHAR(64) NULL;

UPDATE payments
SET
    idempotency_key = COALESCE(idempotency_key, CONCAT('legacy_', id)),
    provider_reference = COALESCE(provider_reference, CONCAT('legacy_pay_', id));

ALTER TABLE payments
MODIFY COLUMN idempotency_key VARCHAR(64) NOT NULL,
MODIFY COLUMN provider_reference VARCHAR(64) NOT NULL,
ADD CONSTRAINT uq_payments_booking_idempotency UNIQUE (booking_id, idempotency_key);
