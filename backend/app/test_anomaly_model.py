from .database import reviews_collection
from .models import anomaly_model
from .anomaly_features import calculate_anomaly_features
import pandas as pd

# ==========================================
# TEST REVIEW
# ==========================================

company_id = "C004"
rating = 3
review_date = "2026-07-13 15:00:00"
review_text = "The taxi service was okay but the waiting time was long."


# ==========================================
# CALCULATE FEATURES
# ==========================================

features = calculate_anomaly_features(
    reviews_collection=reviews_collection,
    company_id=company_id,
    rating=rating,
    review_date=review_date,
    review_text=review_text
)

print("\n===== FEATURES =====")

for key, value in features.items():
    print(f"{key}: {value}")


# ==========================================
# PREPARE MODEL INPUT
# ==========================================

model_input = pd.DataFrame([{
    "reviews_same_day": features["reviews_same_day"],
    "company_reviews_same_day": features["company_reviews_same_day"],
    "rating_reviews_same_day": features["rating_reviews_same_day"],
    "rating": features["rating"],
    "text_length": features["text_length"]
}])

# ==========================================
# ANOMALY PREDICTION
# ==========================================

prediction = anomaly_model.predict(model_input)


print("\n===== ANOMALY PREDICTION =====")
print(prediction)


# ==========================================
# PROBABILITY
# ==========================================

if hasattr(anomaly_model, "predict_proba"):

    probability = anomaly_model.predict_proba(model_input)

    print("\n===== PROBABILITY =====")
    print(probability)