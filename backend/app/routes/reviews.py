from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Review
from app.schemas import ReviewCreate, ReviewResponse, ReviewListResponse, Issue
from app.services.ai_service import review_code, LANGUAGE_OPTIONS

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("/languages")
def get_languages():
    return LANGUAGE_OPTIONS


@router.post("", response_model=ReviewResponse, status_code=201)
def create_review(body: ReviewCreate, db: Session = Depends(get_db)):
    if not body.code.strip():
        raise HTTPException(400, "Code cannot be empty")

    issues, summary, score = review_code(body.code, body.language)

    review = Review(
        code=body.code,
        language=body.language,
        title=body.title or f"Review of {body.language} code",
        overall_score=score,
        issues=[i.model_dump() for i in issues],
        summary=summary,
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    return _format_review(review)


@router.get("", response_model=list[ReviewListResponse])
def list_reviews(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    reviews = (
        db.query(Review)
        .order_by(Review.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [
        ReviewListResponse(
            id=r.id,
            title=r.title,
            language=r.language,
            overall_score=r.overall_score,
            issue_count=len(r.issues or []),
            created_at=r.created_at,
        )
        for r in reviews
    ]


@router.get("/{review_id}", response_model=ReviewResponse)
def get_review(review_id: str, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(404, "Review not found")
    return _format_review(review)


def _format_review(r: Review) -> ReviewResponse:
    return ReviewResponse(
        id=r.id,
        code=r.code,
        language=r.language,
        title=r.title,
        overall_score=r.overall_score,
        issues=[Issue(**i) for i in (r.issues or [])],
        summary=r.summary,
        created_at=r.created_at,
    )
