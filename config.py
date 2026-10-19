import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "finance.db"
UPLOAD_DIR = BASE_DIR / "uploads" / "audio"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

SECRET_KEY = os.getenv("SECRET_KEY", "finance_tracker_secret_key")
MONTHLY_BUDGET = float(os.getenv("MONTHLY_BUDGET", "40000"))
DEFAULT_CATEGORY_LIMITS = {
    "Food": 12000,
    "Shopping": 8000,
    "Travel": 5000,
    "Utilities": 3000,
    "Entertainment": 4000,
    "Health": 2000,
    "Miscellaneous": 3000,
}
