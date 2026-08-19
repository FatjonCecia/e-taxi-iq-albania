from pydantic import BaseModel, Field


# ==========================================
# REVIEW SENT TO THE API
# ==========================================

class ReviewRequest(BaseModel):
    review_id: str
    company_id: str
    company_name: str
    city: str

    rating: int = Field(..., ge=1, le=5)

    review_date: str
    review_text: str
    source_type: str


# ==========================================
# ML PREDICTION
# ==========================================

class ReviewPrediction(BaseModel):
    review_id: str
    company_id: str
    rating: int

    overall_sentiment: str
    primary_aspect: str

    is_anomaly: bool
    anomaly_reason: str | None = None

    mentioned_driver: str | None = None