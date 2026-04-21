# team-7 FastAPI Project

TEAM MEMBERS
1- Omar Barra
2- Ikram Kalkoul
3- Alex 

## Overview

A FastAPI-based backend for a travel booking system with:

- Users, trips, bookings, payments
- SQLAlchemy ORM models
- MySQL (via `pymysql`) database
- Authentication/password hashing using `bcrypt`
- FastAPI endpoints (in `main.py`)

## Requirements

- Python 3.14 (or compatible)
- MySQL server running locally
- `.venv` (recommended)

## Setup

1. Clone repo and enter folder:

```bash
git clone git@github.com:wbt2526/team-7.git
cd team-7
```

2. Create/activate virtual environment:

```bash
Windows
python -m venv .venv
.venv\Scripts\activate

macOS / Linux
python3 -m venv .venv
source .venv/bin/activate

```

3. Install dependencies:

```bash
pip install -r fastapi/requirements.txt
```

If `requirements.txt` is missing, install at least:

```bash
pip install fastapi uvicorn sqlalchemy pymysql bcrypt
```

4. Update DB URL in `fastapi/database.py` if needed:

```py
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://webapp:your_database_password@localhost/webapp"
```

5. Run Alembic migrations:

```bash
cd fastapi
alembic upgrade head
```

If you already have an existing database that matches the current schema and you just want Alembic to start tracking it:

```bash
cd fastapi
alembic stamp head
```

6. Start dev server:

```bash
../.venv/bin/fastapi dev main.py
```

The API will usually be available at `http://127.0.0.1:8000/docs`.

## Notes

- If `bcrypt` install fails on macOS, ensure build tools are installed (e.g., OpenSSL via Homebrew) and retry.
- Adjust database credentials and host as needed.
- The app imports successfully without a database connection, but any endpoint that touches MySQL will fail until your local MySQL server is running and `SQLALCHEMY_DATABASE_URL` is correct.
- Set `DATABASE_URL` and `JWT_SECRET_KEY` as environment variables for local development instead of relying on defaults.
