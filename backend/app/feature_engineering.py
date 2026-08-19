# ==========================================
# FEATURE ENGINEERING FOR ANOMALY MODEL
# ==========================================

import pandas as pd


def create_anomaly_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create the features required by the anomaly model.

    Required model features:
        - reviews_same_day
        - company_reviews_same_day
        - rating_reviews_same_day
        - rating
        - text_length
    """

    df = df.copy()

    # Make sure review_date is datetime
    df["review_date"] = pd.to_datetime(
        df["review_date"],
        errors="coerce"
    )

    # Create day-level feature
    df["review_day"] = df["review_date"].dt.date

    # ------------------------------------------
    # 1. Total reviews on the same day
    # ------------------------------------------

    df["reviews_same_day"] = (
        df.groupby("review_day")["review_id"]
        .transform("count")
    )

    # ------------------------------------------
    # 2. Reviews for same company on same day
    # ------------------------------------------

    df["company_reviews_same_day"] = (
        df.groupby(
            ["company_id", "review_day"]
        )["review_id"]
        .transform("count")
    )

    # ------------------------------------------
    # 3. Same company + same rating + same day
    # ------------------------------------------

    df["rating_reviews_same_day"] = (
        df.groupby(
            [
                "company_id",
                "review_day",
                "rating"
            ]
        )["review_id"]
        .transform("count")
    )

    # ------------------------------------------
    # 4. Review text length
    # ------------------------------------------

    df["text_length"] = (
        df["review_text"]
        .fillna("")
        .astype(str)
        .str.len()
    )

    return df


def get_anomaly_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Return only the features expected by the anomaly model.
    """

    features = [
        "reviews_same_day",
        "company_reviews_same_day",
        "rating_reviews_same_day",
        "rating",
        "text_length"
    ]

    return df[features]



def create_single_anomaly_features(
    review: dict,
    historical_reviews: pd.DataFrame
) -> pd.DataFrame:

    """
    Create anomaly features for one new review
    using historical reviews from the database.
    """

    review_date = pd.to_datetime(
        review["review_date"],
        errors="coerce"
    )

    review_day = review_date.date()

    company_id = review["company_id"]
    rating = review["rating"]

    # Make sure historical dates are datetime
    historical_reviews = historical_reviews.copy()

    historical_reviews["review_date"] = pd.to_datetime(
        historical_reviews["review_date"],
        errors="coerce"
    )

    historical_reviews["review_day"] = (
        historical_reviews["review_date"].dt.date
    )

    # ------------------------------------------
    # 1. Total reviews on the same day
    # ------------------------------------------

    reviews_same_day = (
        historical_reviews["review_day"] == review_day
    ).sum()

    # ------------------------------------------
    # 2. Same company on same day
    # ------------------------------------------

    company_reviews_same_day = (
        (
            historical_reviews["company_id"] == company_id
        )
        &
        (
            historical_reviews["review_day"] == review_day
        )
    ).sum()

    # ------------------------------------------
    # 3. Same company + rating + same day
    # ------------------------------------------

    rating_reviews_same_day = (
        (
            historical_reviews["company_id"] == company_id
        )
        &
        (
            historical_reviews["review_day"] == review_day
        )
        &
        (
            historical_reviews["rating"] == rating
        )
    ).sum()

    # ------------------------------------------
    # 4. Text length
    # ------------------------------------------

    text_length = len(
        str(review.get("review_text", ""))
    )

    # ------------------------------------------
    # Create model input
    # ------------------------------------------

    features = pd.DataFrame([{
        "reviews_same_day": reviews_same_day,
        "company_reviews_same_day": company_reviews_same_day,
        "rating_reviews_same_day": rating_reviews_same_day,
        "rating": rating,
        "text_length": text_length
    }])

    return features