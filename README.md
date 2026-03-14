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
cd /Users/omarbarra/Documents/Erasmus/Web\ Base\ Technology/Project/team-7
```

2. Create/activate virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

If `requirements.txt` is missing, install at least:

```bash
pip install fastapi uvicorn sqlalchemy pymysql bcrypt
```

4. Update DB URL in `fastapi/database.py` if needed:

```py
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://webapp:pristiniAI12@localhost/webapp"
```

5. Run migrations / create tables (if not automated):

```bash
python -c "from fastapi.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

6. Start dev server:

```bash
fastapi dev main.py
```

## Notes

- If `bcrypt` install fails on macOS, ensure build tools are installed (e.g., OpenSSL via Homebrew) and retry.
- Adjust database credentials and host as needed.