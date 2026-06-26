import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, default=generate_uuid)
    code = Column(Text, nullable=False)
    language = Column(String(50), nullable=False)
    title = Column(String(200), default="")
    overall_score = Column(Integer, default=0)
    issues = Column(JSON, default=list)
    summary = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    comments = relationship("Comment", back_populates="review", cascade="all, delete-orphan")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(String, primary_key=True, default=generate_uuid)
    review_id = Column(String, ForeignKey("reviews.id", ondelete="CASCADE"), nullable=False)
    author = Column(String(100), default="Anonymous")
    body = Column(Text, nullable=False)
    line_number = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    review = relationship("Review", back_populates="comments")
