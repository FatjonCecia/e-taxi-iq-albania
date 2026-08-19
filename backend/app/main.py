from fastapi import FastAPI, Query
from fastapi.encoders import jsonable_encoder
from typing import Optional

from .database import reviews_collection
from .schemas import ReviewRequest, ReviewPrediction
from .models import sentiment_model, aspect_model, anomaly_model
from .anomaly_features import calculate_anomaly_features

import pandas as pd

app = FastAPI(
    title="E-Taxi IQ Albania API",
    description="ML-powered electric taxi review intelligence API",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "E-Taxi IQ Albania API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/reviews", response_model=ReviewPrediction)
def create_review(review: ReviewRequest):

    # ==========================================
    # SENTIMENT PREDICTION
    # ==========================================

    sentiment_prediction = sentiment_model.predict(
        [review.review_text]
    )[0]


    # ==========================================
    # ASPECT PREDICTION
    # ==========================================

    aspect_prediction = aspect_model.predict(
        [review.review_text]
    )[0]


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
    # PREPARE ANOMALY MODEL INPUT
    # ==========================================

    anomaly_input = pd.DataFrame([{
        "reviews_same_day": features["reviews_same_day"],
        "company_reviews_same_day": features["company_reviews_same_day"],
        "rating_reviews_same_day": features["rating_reviews_same_day"],
        "rating": features["rating"],
        "text_length": features["text_length"]
    }])


    # ==========================================
    # ANOMALY PREDICTION
    # ==========================================

    anomaly_prediction = anomaly_model.predict(
        anomaly_input
    )[0]


    # ==========================================
    # ANOMALY REASON
    # ==========================================

    if anomaly_prediction == 1:
        anomaly_reason = "Potential review anomaly detected"
    else:
        anomaly_reason = None


    # ==========================================
    # BUILD REVIEW DOCUMENT
    # ==========================================

    review_data = {
        "review_id": review.review_id,
        "company_id": review.company_id,
        "company_name": review.company_name,
        "city": review.city,
        "rating": review.rating,
        "review_date": review.review_date,
        "review_text": review.review_text,
        "source_type": review.source_type,

        "overall_sentiment": str(sentiment_prediction),
        "primary_aspect": str(aspect_prediction),

        "is_anomaly": bool(anomaly_prediction),
        "anomaly_reason": anomaly_reason,

        "mentioned_driver": None,

        "text_length": features["text_length"]
    }


    # ==========================================
    # SAVE TO MONGODB
    # ==========================================

    reviews_collection.insert_one(review_data)


    # ==========================================
    # RETURN PREDICTION
    # ==========================================

    return ReviewPrediction(
        review_id=review.review_id,
        company_id=review.company_id,
        rating=review.rating,

        overall_sentiment=str(sentiment_prediction),
        primary_aspect=str(aspect_prediction),

        is_anomaly=bool(anomaly_prediction),
        anomaly_reason=anomaly_reason,

        mentioned_driver=None
    )


@app.get("/reviews")
def get_reviews(
    company_id: Optional[str] = None,
    city: Optional[str] = None,
    rating: Optional[int] = Query(None, ge=1, le=5),
    sentiment: Optional[str] = None,
    is_anomaly: Optional[bool] = None
):

    # ==========================================
    # BUILD FILTER
    # ==========================================

    filters = {}

    if company_id:
        filters["company_id"] = company_id

    if city:
        filters["city"] = city

    if rating is not None:
        filters["rating"] = rating

    if sentiment:
        filters["overall_sentiment"] = sentiment

    if is_anomaly is not None:
        filters["is_anomaly"] = is_anomaly


    # ==========================================
    # FETCH REVIEWS
    # ==========================================

    reviews = list(
        reviews_collection.find(
            filters,
            {"_id": 0}
        )
    )


    return {
        "count": len(reviews),
        "reviews": jsonable_encoder(reviews)
    }


@app.get("/analytics")
def get_analytics():

    # ==========================================
    # TOTAL REVIEWS
    # ==========================================

    total_reviews = reviews_collection.count_documents({})


    # ==========================================
    # AVERAGE RATING
    # ==========================================

    rating_pipeline = [
        {
            "$group": {
                "_id": None,
                "average_rating": {
                    "$avg": "$rating"
                }
            }
        }
    ]

    rating_result = list(
        reviews_collection.aggregate(rating_pipeline)
    )

    average_rating = (
        rating_result[0]["average_rating"]
        if rating_result
        else 0
    )


    # ==========================================
    # SENTIMENT DISTRIBUTION
    # ==========================================

    sentiment_pipeline = [
        {
            "$group": {
                "_id": "$overall_sentiment",
                "count": {"$sum": 1}
            }
        }
    ]

    sentiment_result = list(
        reviews_collection.aggregate(sentiment_pipeline)
    )

    sentiment_distribution = {
        item["_id"]: item["count"]
        for item in sentiment_result
        if item["_id"] is not None
    }


    # ==========================================
    # ASPECT DISTRIBUTION
    # ==========================================

    aspect_pipeline = [
        {
            "$group": {
                "_id": "$primary_aspect",
                "count": {"$sum": 1}
            }
        }
    ]

    aspect_result = list(
        reviews_collection.aggregate(aspect_pipeline)
    )

    aspect_distribution = {
        item["_id"]: item["count"]
        for item in aspect_result
        if item["_id"] is not None
    }


    # ==========================================
    # ANOMALY STATISTICS
    # ==========================================

    total_anomalies = reviews_collection.count_documents({
        "is_anomaly": True
    })

    normal_reviews = reviews_collection.count_documents({
        "is_anomaly": False
    })


    # ==========================================
    # COMPANY DISTRIBUTION
    # ==========================================

    company_pipeline = [
        {
            "$group": {
                "_id": "$company_name",
                "count": {"$sum": 1}
            }
        },
        {
            "$sort": {
                "count": -1
            }
        }
    ]

    company_result = list(
        reviews_collection.aggregate(company_pipeline)
    )

    company_distribution = {
        item["_id"]: item["count"]
        for item in company_result
        if item["_id"] is not None
    }


    # ==========================================
    # CITY DISTRIBUTION
    # ==========================================

    city_pipeline = [
        {
            "$group": {
                "_id": "$city",
                "count": {"$sum": 1}
            }
        },
        {
            "$sort": {
                "count": -1
            }
        }
    ]

    city_result = list(
        reviews_collection.aggregate(city_pipeline)
    )

    city_distribution = {
        item["_id"]: item["count"]
        for item in city_result
        if item["_id"] is not None
    }


    # ==========================================
    # RETURN ANALYTICS
    # ==========================================

    return {
        "total_reviews": total_reviews,
        "average_rating": round(average_rating, 2),
        "sentiment_distribution": sentiment_distribution,
        "aspect_distribution": aspect_distribution,
        "anomalies": {
            "total": total_anomalies,
            "normal": normal_reviews
        },
        "company_distribution": company_distribution,
        "city_distribution": city_distribution
    }