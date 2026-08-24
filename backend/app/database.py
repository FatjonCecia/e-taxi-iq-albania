import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient

# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

BASE_DIR = Path(__file__).resolve().parents[2]

# Local development: load .env if it exists
load_dotenv(BASE_DIR / ".env")

MONGODB_URL = os.getenv("MONGODB_URL")

if not MONGODB_URL:
    raise RuntimeError(
        "MONGODB_URL environment variable is not set."
    )


# ==========================================
# MONGODB CONNECTION
# ==========================================

client = MongoClient(
    MONGODB_URL,
    serverSelectionTimeoutMS=5000
)


# ==========================================
# DATABASE
# ==========================================

db = client["etaxi_iq"]

reviews_collection = db["reviews"]


# ==========================================
# TEST CONNECTION
# ==========================================

try:

    client.admin.command("ping")

    print("MongoDB connected successfully!")

except Exception as e:

    print("MongoDB connection failed:", e)