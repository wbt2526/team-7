from datetime import datetime
import re

from pydantic import BaseModel, Field, field_validator, model_validator


class PaymentCreate(BaseModel):
    card_number: str = Field(min_length=1, max_length=32)
    expiry: str
    cvv: str = Field(min_length=3, max_length=4)
    idempotency_key: str = Field(min_length=8, max_length=64)

    @field_validator("card_number")
    @classmethod
    def validate_card_number(cls, value: str) -> str:
        digits = re.sub(r"\s+", "", value)
        if not digits.isdigit():
            raise ValueError("Card number must contain only digits")
        if len(digits) < 13 or len(digits) > 19:
            raise ValueError("Card number must contain 13 to 19 digits")
        return digits

    @field_validator("cvv")
    @classmethod
    def validate_cvv(cls, value: str) -> str:
        if not value.isdigit():
            raise ValueError("Security code must contain only digits")
        if len(value) not in (3, 4):
            raise ValueError("Security code must contain 3 or 4 digits")
        return value

    @field_validator("expiry")
    @classmethod
    def validate_expiry_format(cls, value: str) -> str:
        if not re.fullmatch(r"(0[1-9]|1[0-2])/\d{2}", value):
            raise ValueError("Expiry date must be in MM/YY format")
        return value

    @field_validator("idempotency_key")
    @classmethod
    def validate_idempotency_key(cls, value: str) -> str:
        normalized = value.strip()
        if not re.fullmatch(r"[A-Za-z0-9._:-]{8,64}", normalized):
            raise ValueError("Idempotency key contains invalid characters")
        return normalized

    @model_validator(mode="after")
    def validate_expiry_not_past(self):
        month_str, year_str = self.expiry.split("/")
        month = int(month_str)
        year = int(year_str)
        if year < 100:
            year += 2000

        now = datetime.utcnow()
        if (year, month) < (now.year, now.month):
            raise ValueError("Card expiry date is in the past")
        return self


class PaymentConfirmation(BaseModel):
    payment_id: int
    booking_id: int
    provider_reference: str
    payment_status: str
    payment_date: datetime
    booking_status: str
    remaining_places: int
    trip_status: str
    message: str

    class Config:
        from_attributes = True
