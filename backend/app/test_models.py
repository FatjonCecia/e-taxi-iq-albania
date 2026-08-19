from .models import sentiment_model, aspect_model


# ==========================================
# TEST REVIEW
# ==========================================

review_text = """
The taxi was very clean and comfortable.
The driver was professional and friendly.
"""


# ==========================================
# SENTIMENT
# ==========================================

sentiment_prediction = sentiment_model.predict(
    [review_text]
)

print("\n===== SENTIMENT =====")
print(sentiment_prediction)


# ==========================================
# ASPECT
# ==========================================

aspect_prediction = aspect_model.predict(
    [review_text]
)

print("\n===== ASPECT =====")
print(aspect_prediction)