from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Review, Comment
from app.schemas import CommentCreate, CommentResponse

router = APIRouter(prefix="/reviews/{review_id}/comments", tags=["comments"])


@router.get("", response_model=list[CommentResponse])
def list_comments(review_id: str, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(404, "Review not found")
    return [
        CommentResponse.model_validate(c)
        for c in sorted(review.comments, key=lambda c: c.created_at)
    ]


@router.post("", response_model=CommentResponse, status_code=201)
def create_comment(review_id: str, body: CommentCreate, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(404, "Review not found")
    if not body.body.strip():
        raise HTTPException(400, "Comment body cannot be empty")

    comment = Comment(
        review_id=review_id,
        author=body.author or "Anonymous",
        body=body.body,
        line_number=body.line_number,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return CommentResponse.model_validate(comment)
