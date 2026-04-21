"""create core tables

Revision ID: 0001_create_core_tables
Revises: None
Create Date: 2026-04-20 00:00:00
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "0001_create_core_tables"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("first_name", sa.String(length=50), nullable=False),
        sa.Column("last_name", sa.String(length=50), nullable=False),
        sa.Column("email", sa.String(length=100), nullable=False),
        sa.Column("password", sa.String(length=256), nullable=False),
        sa.Column("role", sa.SmallInteger(), nullable=False, server_default="0"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)

    op.create_table(
        "trips",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=100), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("date", sa.DateTime(), nullable=False),
        sa.Column("duration", sa.Integer(), nullable=False),
        sa.Column("image", sa.String(length=255), nullable=True),
        sa.Column("price", sa.DECIMAL(precision=10, scale=2), nullable=False),
        sa.Column("child_price", sa.DECIMAL(precision=10, scale=2), nullable=False),
        sa.Column("total_places", sa.Integer(), nullable=False),
        sa.Column("remaining_places", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="available"),
        sa.Column("created_by", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["created_by"], ["users.id"], name="fk_trips_created_by_users"),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "bookings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("trip_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("adults", sa.Integer(), nullable=False),
        sa.Column("children", sa.Integer(), nullable=False),
        sa.Column("total_seats", sa.Integer(), nullable=False),
        sa.Column("total_price", sa.DECIMAL(precision=10, scale=2), nullable=False),
        sa.Column("booking_status", sa.String(length=20), nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["trip_id"], ["trips.id"], name="fk_bookings_trip_id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="fk_bookings_user_id"),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "payments",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("booking_id", sa.Integer(), nullable=False),
        sa.Column("idempotency_key", sa.String(length=64), nullable=False),
        sa.Column("provider_reference", sa.String(length=64), nullable=False),
        sa.Column("card_last4", sa.String(length=4), nullable=False),
        sa.Column("payment_status", sa.String(length=20), nullable=False),
        sa.Column("payment_date", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"], name="fk_payments_booking_id"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("booking_id", "idempotency_key", name="uq_payments_booking_idempotency"),
    )


def downgrade() -> None:
    op.drop_table("payments")
    op.drop_table("bookings")
    op.drop_table("trips")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")
