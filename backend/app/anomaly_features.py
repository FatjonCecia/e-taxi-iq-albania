from datetime import datetime


def calculate_anomaly_features(
    reviews_collection,
    company_id: str,
    rating: int,
    review_date: str,
    review_text: str
):
    # ==========================================
    # CONVERT REVIEW DATE
    # ==========================================

    review_datetime = datetime.fromisoformat(review_date)

    day = review_datetime.strftime("%Y-%m-%d")

    # String boundaries for the selected day
    day_start = f"{day} 00:00:00"
    day_end = f"{day} 23:59:59"

    # ==========================================
    # REVIEWS ON SAME DAY
    # ==========================================

    reviews_same_day = reviews_collection.count_documents({
        "review_date": {
            "$gte": day_start,
            "$lte": day_end
        }
    })

    # ==========================================
    # COMPANY REVIEWS ON SAME DAY
    # ==========================================

    company_reviews_same_day = reviews_collection.count_documents({
        "company_id": company_id,
        "review_date": {
            "$gte": day_start,
            "$lte": day_end
        }
    })

    # ==========================================
    # SAME RATING ON SAME DAY
    # ==========================================

    rating_reviews_same_day = reviews_collection.count_documents({
        "rating": rating,
        "review_date": {
            "$gte": day_start,
            "$lte": day_end
        }
    })

    # ==========================================
    # TEXT LENGTH
    # ==========================================

    text_length = len(review_text)

    # ==========================================
    # RETURN FEATURES
    # ==========================================

    return {
        "reviews_same_day": reviews_same_day,
        "company_reviews_same_day": company_reviews_same_day,
        "rating_reviews_same_day": rating_reviews_same_day,
        "rating": rating,
        "text_length": text_length
    }