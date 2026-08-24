from ..schemas import ReviewRequest
from .processor import process_review


test_review = ReviewRequest(
    review_id="TEST-001",
    company_id="C001",
    company_name="TEST Taxi",
    city="Tirana",
    rating=5,
    review_date="2026-08-23",
    review_text="The driver was very professional and the electric car was clean and comfortable.",
    source_type="test"
)


result = process_review(test_review)


print("\n================================")
print("PROCESSOR TEST RESULT")
print("================================")

print(result)