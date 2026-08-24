import pandas as pd

from ..database import reviews_collection
from ..models import (
    sentiment_model,
    aspect_model,
    anomaly_model
)
from ..anomaly_features import calculate_anomaly_features


def process_review(review):
    """
    Run a raw review through the ML pipeline
    and save the result to MongoDB.
    """

    # ==========================================
    # SENTIMENT
    # ==========================================

    sentiment_prediction = sentiment_model.predict(
        [review.review_text]
    )[0]

    sentiment_probabilities = sentiment_model.predict_proba(
        [review.review_text]
    )[0]

    sentiment_confidence = float(
        max(sentiment_probabilities)
    )


    # ==========================================
    # ASPECT
    # ==========================================

    aspect_prediction = aspect_model.predict(
        [review.review_text]
    )[0]

    aspect_probabilities = aspect_model.predict_proba(
        [review.review_text]
    )[0]

    aspect_confidence = float(
        max(aspect_probabilities)
    )


    # ==========================================
    # ANOMALY FEATURES
    # ==========================================

    features = calculate_anomaly_features(
        reviews_collection=reviews_collection,
        company_id=review.company_id,
        rating=review.rating,
        review_date=review.review_date,
        review_text=review.review_text
    )


    # ==========================================
    # ANOMALY MODEL INPUT
    # ==========================================

    anomaly_input = pd.DataFrame([{

        "reviews_same_day":
            features["reviews_same_day"],

        "company_reviews_same_day":
            features["company_reviews_same_day"],

        "rating_reviews_same_day":
            features["rating_reviews_same_day"],

        "rating":
            features["rating"],

        "text_length":
            features["text_length"]

    }])


    # ==========================================
    # ANOMALY PREDICTION
    # ==========================================

    anomaly_prediction = anomaly_model.predict(
        anomaly_input
    )[0]

    anomaly_probabilities = anomaly_model.predict_proba(
        anomaly_input
    )[0]

    anomaly_confidence = float(
        max(anomaly_probabilities)
    )


    # ==========================================
    # ANOMALY REASON
    # ==========================================

    if anomaly_prediction == 1:

        anomaly_reason = (
            "Potential review anomaly detected"
        )

    else:

        anomaly_reason = None


    # ==========================================
    # MODEL INSIGHTS
    # ==========================================

    insights = []


    # ------------------------------------------
    # SENTIMENT INSIGHT
    # ------------------------------------------

    sentiment_name = str(
        sentiment_prediction
    ).lower()


    if sentiment_name == "negative":

        if sentiment_confidence >= 0.80:

            insights.append(
                "Strong negative sentiment detected."
            )

        else:

            insights.append(
                "Negative sentiment detected, "
                "but the model has lower confidence."
            )


    elif sentiment_name == "positive":

        if sentiment_confidence >= 0.80:

            insights.append(
                "Strong positive sentiment detected."
            )

        else:

            insights.append(
                "Positive sentiment detected, "
                "but the model has lower confidence."
            )


    else:

        insights.append(
            "Neutral sentiment detected."
        )


    # ------------------------------------------
    # ASPECT INSIGHT
    # ------------------------------------------

    aspect_name = str(
        aspect_prediction
    ).replace("_", " ")


    if aspect_confidence >= 0.80:

        insights.append(
            f"The review primarily concerns "
            f"{aspect_name}."
        )

    else:

        insights.append(
            f"The model identified {aspect_name} "
            "as the primary aspect, but with "
            "lower confidence."
        )


    # ------------------------------------------
    # ANOMALY INSIGHT
    # ------------------------------------------

    if anomaly_prediction == 1:

        if anomaly_confidence >= 0.80:

            insights.append(
                "A potential review anomaly was "
                "detected with high confidence."
            )

        else:

            insights.append(
                "A potential review anomaly was "
                "detected, but the model has "
                "lower confidence."
            )

    else:

        if anomaly_confidence >= 0.80:

            insights.append(
                "No significant anomaly detected."
            )

        else:

            insights.append(
                "The review was classified as normal, "
                "but the anomaly model has lower "
                "confidence."
            )


    # ==========================================
    # BUILD DOCUMENT
    # ==========================================

    review_data = {

        "review_id":
            review.review_id,

        "company_id":
            review.company_id,

        "company_name":
            review.company_name,

        "city":
            review.city,

        "rating":
            review.rating,

        "review_date":
            review.review_date,

        "review_text":
            review.review_text,

        "source_type":
            review.source_type,

        "overall_sentiment":
            str(sentiment_prediction),

        "sentiment_confidence":
            sentiment_confidence,

        "primary_aspect":
            str(aspect_prediction),

        "aspect_confidence":
            aspect_confidence,

        "is_anomaly":
            bool(anomaly_prediction),

        "anomaly_confidence":
            anomaly_confidence,

        "anomaly_reason":
            anomaly_reason,

        "mentioned_driver":
            None,

        "text_length":
            features["text_length"],

        "insights":
            insights
    }


    # ==========================================
    # SAVE TO MONGODB
    # ==========================================

    reviews_collection.insert_one(
        review_data
    )


    # ==========================================
    # RETURN RESULT
    # ==========================================

    return {

        "review_id":
            review.review_id,

        "company_id":
            review.company_id,

        "rating":
            review.rating,

        "overall_sentiment":
            str(sentiment_prediction),

        "sentiment_confidence":
            sentiment_confidence,

        "primary_aspect":
            str(aspect_prediction),

        "aspect_confidence":
            aspect_confidence,

        "is_anomaly":
            bool(anomaly_prediction),

        "anomaly_confidence":
            anomaly_confidence,

        "anomaly_reason":
            anomaly_reason,

        "mentioned_driver":
            None,

        "insights":
            insights
    }