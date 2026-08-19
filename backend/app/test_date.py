from .database import reviews_collection


review = reviews_collection.find_one(
    {},
    {
        "_id": 0,
        "review_date": 1,
        "company_id": 1,
        "rating": 1
    }
)

print(review)