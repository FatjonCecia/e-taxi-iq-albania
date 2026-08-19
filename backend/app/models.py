import joblib
from pathlib import Path


# ==========================================
# MODEL PATH
# ==========================================

MODEL_DIR = (
    Path(__file__).resolve().parents[2]
    / "ml"
    / "models"
)


# ==========================================
# LOAD MODELS
# ==========================================

sentiment_model = joblib.load(
    MODEL_DIR / "sentiment_model.pkl"
)

aspect_model = joblib.load(
    MODEL_DIR / "aspect_model.pkl"
)

anomaly_model = joblib.load(
    MODEL_DIR / "anomaly_model.pkl"
)


print("All ML models loaded successfully!")