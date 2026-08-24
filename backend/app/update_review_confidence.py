import pandas as pd

from .database import reviews_collection
from .models import (
    sentiment_model,
    aspect_model,
    anomaly_model
)
from .anomaly_features import calculate_anomaly_features


def update_review_confidence():

    # ==========================================
    # GET EXISTING REVIEWS
    # ==========================================

    reviews = list(
        reviews_collection.find({})
    )

    print(f"Found {len(reviews)} reviews.")

    updated = 0
    failed = 0


    # ==========================================
    # PROCESS EACH REVIEW
    # ==========================================

    for review in reviews:

        try:

            review_text = review.get("review_text", "")


            # ==========================================
            # SENTIMENT
            # ==========================================

            sentiment_prediction = sentiment_model.predict(
                [review_text]
            )[0]

            sentiment_probabilities = (
                sentiment_model.predict_proba(
                    [review_text]
                )[0]
            )

            sentiment_confidence = float(
                max(sentiment_probabilities)
            )


            # ==========================================
            # ASPECT
            # ==========================================

            aspect_prediction = aspect_model.predict(
                [review_text]
            )[0]

            aspect_probabilities = (
                aspect_model.predict_proba(
                    [review_text]
                )[0]
            )

            aspect_confidence = float(
                max(aspect_probabilities)
            )


            # ==========================================
            # ANOMALY FEATURES
            # ==========================================

            features = calculate_anomaly_features(
                reviews_collection=reviews_collection,
                company_id=review.get("company_id"),
                rating=review.get("rating"),
                review_date=review.get("review_date"),
                review_text=review_text
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
            # ANOMALY
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
            # UPDATE EXISTING DOCUMENT
            # ==========================================

            reviews_collection.update_one(

                {
                    "_id": review["_id"]
                },

                {
                    "$set": {

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

                        "text_length":
                            features["text_length"]

                    }
                }

            )


            updated += 1

            print(
                f"[{updated}/{len(reviews)}] "
                f"{review.get('review_id')} updated"
            )


        except Exception as error:

            failed += 1

            print(
                f"FAILED: {review.get('review_id')}"
            )

            print(error)


    # ==========================================
    # SUMMARY
    # ==========================================

    print()
    print("==========================================")
    print("UPDATE COMPLETE")
    print("==========================================")

    print(f"Total reviews: {len(reviews)}")
    print(f"Updated:       {updated}")
    print(f"Failed:        {failed}")


if __name__ == "__main__":

    update_review_confidence()