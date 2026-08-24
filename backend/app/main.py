from fastapi import FastAPI, Query
from fastapi.encoders import jsonable_encoder
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict
from .ingestion.processor import process_review
from .database import reviews_collection
from .schemas import ReviewRequest, ReviewPrediction

import pandas as pd


app = FastAPI(
    title="E-Taxi IQ Albania API",
    description="ML-powered electric taxi review intelligence API",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://e-taxi-iq-albania.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# ROOT
# ==========================================

@app.get("/")
def root():
    return {
        "message": "E-Taxi IQ Albania API is running"
    }


# ==========================================
# HEALTH
# ==========================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ==========================================
# CREATE REVIEW
# ==========================================

@app.post("/reviews", response_model=ReviewPrediction)
def create_review(review: ReviewRequest):

    result = process_review(review)

    return ReviewPrediction(**result)


# ==========================================
# GET REVIEWS
# ==========================================

@app.get("/reviews")
def get_reviews(
    company_id: Optional[str] = None,
    city: Optional[str] = None,
    rating: Optional[int] = Query(None, ge=1, le=5),
    sentiment: Optional[str] = None,
    is_anomaly: Optional[bool] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
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

    if search:
        filters["review_text"] = {
            "$regex": search,
            "$options": "i"
        }


    # ==========================================
    # PAGINATION
    # ==========================================

    skip = (page - 1) * limit

    total = reviews_collection.count_documents(filters)


    # ==========================================
    # FETCH REVIEWS
    # ==========================================

    reviews = list(
        reviews_collection.find(
            filters,
            {"_id": 0}
        )
        .sort("review_date", -1)
        .skip(skip)
        .limit(limit)
    )


    # ==========================================
    # RETURN REVIEWS
    # ==========================================

    return {
        "count": len(reviews),
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
        "reviews": jsonable_encoder(reviews)
    }


# ==========================================
# ANALYTICS
# ==========================================

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
    # RATING DISTRIBUTION
    # ==========================================

    rating_distribution_pipeline = [
        {
            "$group": {
                "_id": "$rating",
                "count": {"$sum": 1}
            }
        },
        {
            "$sort": {
                "_id": 1
            }
        }
    ]

    rating_distribution_result = list(
        reviews_collection.aggregate(
            rating_distribution_pipeline
        )
    )

    rating_distribution = {
        str(item["_id"]): item["count"]
        for item in rating_distribution_result
        if item["_id"] is not None
    }


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
                "_id": {
                    "company_id": "$company_id",
                    "company_name": "$company_name"
                },
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

    company_distribution = [
        {
            "company_id": item["_id"]["company_id"],
            "company_name": item["_id"]["company_name"],
            "count": item["count"]
        }
        for item in company_result
    ]


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
        "rating_distribution": rating_distribution,
        "sentiment_distribution": sentiment_distribution,
        "aspect_distribution": aspect_distribution,
        "anomalies": {
            "total": total_anomalies,
            "normal": normal_reviews
        },
        "company_distribution": company_distribution,
        "city_distribution": city_distribution
    }



# ==========================================
# COMPANY INTELLIGENCE
# ==========================================

@app.get("/companies/{company_id}/intelligence")
def get_company_intelligence(company_id: str):

    # ==========================================
    # FIND COMPANY REVIEWS
    # ==========================================

    company_reviews = list(
        reviews_collection.find(
            {
                "company_id": company_id
            },
            {
                "_id": 0
            }
        )
    )

    # ==========================================
    # COMPANY NOT FOUND
    # ==========================================

    if not company_reviews:

        return {
            "company_id": company_id,
            "total_reviews": 0,
            "message": "No reviews found for this company."
        }

    # ==========================================
    # BASIC STATISTICS
    # ==========================================

    total_reviews = len(company_reviews)

    average_rating = sum(
        review.get("rating", 0)
        for review in company_reviews
    ) / total_reviews

    # ==========================================
    # SENTIMENT DISTRIBUTION
    # ==========================================

    sentiment_distribution = {
        "positive": 0,
        "neutral": 0,
        "negative": 0
    }

    for review in company_reviews:

        sentiment = review.get(
            "overall_sentiment"
        )

        if sentiment in sentiment_distribution:

            sentiment_distribution[sentiment] += 1

    # ==========================================
    # SENTIMENT PERCENTAGES
    # ==========================================

    sentiment_percentages = {
        sentiment: round(
            (count / total_reviews) * 100,
            2
        )
        for sentiment, count
        in sentiment_distribution.items()
    }

    # ==========================================
    # ANOMALIES
    # ==========================================

    anomaly_count = sum(
        1
        for review in company_reviews
        if review.get("is_anomaly", False)
    )

    normal_count = total_reviews - anomaly_count

    anomaly_percentage = round(
        (anomaly_count / total_reviews) * 100,
        2
    )

    # ==========================================
    # ASPECT DISTRIBUTION
    # ==========================================

    aspect_distribution = {}

    for review in company_reviews:

        aspect = review.get(
            "primary_aspect"
        )

        if aspect:

            aspect_distribution[aspect] = (
                aspect_distribution.get(aspect, 0) + 1
            )

    # ==========================================
    # RATING DISTRIBUTION
    # ==========================================

    rating_distribution = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0
    }

    for review in company_reviews:

        rating_value = review.get("rating")

        if rating_value is not None:

            rating_distribution[
                str(rating_value)
            ] += 1

    # ==========================================
    # NEGATIVE REVIEWS
    # ==========================================

    negative_reviews = [
        review
        for review in company_reviews
        if review.get("overall_sentiment") == "negative"
    ]

    negative_review_count = len(
        negative_reviews
    )

    negative_review_percentage = round(
        (
            negative_review_count
            / total_reviews
        ) * 100,
        2
    )

    # ==========================================
    # COMPANY NAME
    # ==========================================

    company_name = company_reviews[0].get(
        "company_name",
        company_id
    )

    # ==========================================
    # RETURN INTELLIGENCE
    # ==========================================

    return {

        "company_id": company_id,

        "company_name": company_name,

        "total_reviews": total_reviews,

        "average_rating": round(
            average_rating,
            2
        ),

        "sentiment_distribution":
            sentiment_distribution,

        "sentiment_percentages":
            sentiment_percentages,

        "anomalies": {

            "total": anomaly_count,

            "normal": normal_count,

            "percentage":
                anomaly_percentage
        },

        "negative_reviews": {

            "total":
                negative_review_count,

            "percentage":
                negative_review_percentage
        },

        "aspect_distribution":
            aspect_distribution,

        "rating_distribution":
            rating_distribution
    }




@app.get("/companies/comparison")
def compare_companies():

    companies = reviews_collection.distinct("company_id")

    results = []

    for company_id in companies:

        reviews = list(
            reviews_collection.find(
                {"company_id": company_id},
                {"_id": 0}
            )
        )

        if not reviews:
            continue

        company_name = reviews[0].get(
            "company_name",
            company_id
        )

        total_reviews = len(reviews)

        # ==============================
        # AVERAGE RATING
        # ==============================

        average_rating = round(
            sum(
                review.get("rating", 0)
                for review in reviews
            ) / total_reviews,
            2
        )

        # ==============================
        # SENTIMENT
        # ==============================

        positive = sum(
            1 for review in reviews
            if review.get("overall_sentiment") == "positive"
        )

        neutral = sum(
            1 for review in reviews
            if review.get("overall_sentiment") == "neutral"
        )

        negative = sum(
            1 for review in reviews
            if review.get("overall_sentiment") == "negative"
        )

        positive_percentage = round(
            (positive / total_reviews) * 100,
            1
        )

        negative_percentage = round(
            (negative / total_reviews) * 100,
            1
        )

        # ==============================
        # ANOMALIES
        # ==============================

        anomalies = sum(
            1 for review in reviews
            if review.get("is_anomaly") is True
        )

        anomaly_percentage = round(
            (anomalies / total_reviews) * 100,
            1
        )

        # ==============================
        # ASPECTS
        # ==============================

        aspect_distribution = {}

        for review in reviews:

            aspect = review.get("primary_aspect")

            if aspect:

                aspect_distribution[aspect] = (
                    aspect_distribution.get(aspect, 0) + 1
                )

        top_aspect = None

        if aspect_distribution:

            top_aspect = max(
                aspect_distribution,
                key=aspect_distribution.get
            )

        # ==============================
        # BUILD RESULT
        # ==============================

        results.append({

            "company_id": company_id,

            "company_name": company_name,

            "total_reviews": total_reviews,

            "average_rating": average_rating,

            "positive_reviews": positive,

            "neutral_reviews": neutral,

            "negative_reviews": negative,

            "positive_percentage":
                positive_percentage,

            "negative_percentage":
                negative_percentage,

            "anomalies": anomalies,

            "anomaly_percentage":
                anomaly_percentage,

            "top_aspect": top_aspect

        })

    # Highest-rated companies first

    results.sort(
        key=lambda company:
            company["average_rating"],
        reverse=True
    )

    return {
        "companies": results
    }




@app.get("/analytics/trends")
def get_review_trends():

    reviews = list(
        reviews_collection.find(
            {},
            {
                "_id": 0,
                "review_date": 1,
                "rating": 1,
                "overall_sentiment": 1,
                "is_anomaly": 1
            }
        )
    )

    monthly_data = defaultdict(
        lambda: {
            "reviews": 0,
            "rating_sum": 0,
            "positive": 0,
            "neutral": 0,
            "negative": 0,
            "anomalies": 0
        }
    )

    for review in reviews:

        review_date = review.get("review_date")

        if not review_date:
            continue

        # Handle MongoDB datetime or string
        if hasattr(review_date, "strftime"):

            month = review_date.strftime("%Y-%m")

        else:

            month = str(review_date)[:7]

        data = monthly_data[month]

        data["reviews"] += 1

        data["rating_sum"] += review.get(
            "rating",
            0
        )

        sentiment = review.get(
            "overall_sentiment"
        )

        if sentiment == "positive":

            data["positive"] += 1

        elif sentiment == "neutral":

            data["neutral"] += 1

        elif sentiment == "negative":

            data["negative"] += 1

        if review.get("is_anomaly") is True:

            data["anomalies"] += 1


    # ==========================================
    # BUILD RESPONSE
    # ==========================================

    trends = []

    for month in sorted(monthly_data.keys()):

        data = monthly_data[month]

        total = data["reviews"]

        if total == 0:
            continue

        trends.append({

            "month": month,

            "reviews": total,

            "average_rating": round(
                data["rating_sum"] / total,
                2
            ),

            "positive": data["positive"],

            "neutral": data["neutral"],

            "negative": data["negative"],

            "anomalies": data["anomalies"],

            "anomaly_percentage": round(
                (data["anomalies"] / total) * 100,
                1
            )

        })


    return {
        "trends": trends
    }