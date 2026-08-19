import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient
from fastapi.encoders import jsonable_encoder

# Project root: e-taxi-iq-albania/
BASE_DIR = Path(__file__).resolve().parents[2]

# Load root .env
load_dotenv(BASE_DIR / ".env")

MONGODB_URL = os.getenv("MONGODB_URL")

if not MONGODB_URL:
    raise ValueError("MONGODB_URL was not found in .env")

client = MongoClient(MONGODB_URL)

db = client["etaxi_iq"]

reviews_collection = db["reviews"]