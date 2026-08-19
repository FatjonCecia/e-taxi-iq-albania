from .database import reviews_collection
from .anomaly_features import calculate_anomaly_features


features = calculate_anomaly_features(
    reviews_collection=reviews_collection,
    company_id="C004",
    rating=3,
    review_date="2026-07-13 02:00:00",
    review_text="Great electric taxi service!"
)

print("\n===== ANOMALY FEATURES =====")

for key, value in features.items():
    print(f"{key}: {value}")