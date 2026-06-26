from datetime import datetime
from pydantic import BaseModel


class Issue(BaseModel):
    line: int
    column: int | None = None
    severity: str  # error, warning, info
    category: str  # linting, security, style, performance, best-practice
    message: str
    suggestion: str | None = None


class ReviewCreate(BaseModel):
    code: str
    language: str = "python"
    title: str = ""


class ReviewResponse(BaseModel):
    id: str
    code: str
    language: str
    title: str
    overall_score: int
    issues: list[Issue]
    summary: str
    created_at: datetime

    class Config:
        from_attributes = True


class CommentCreate(BaseModel):
    author: str = "Anonymous"
    body: str
    line_number: int | None = None


class CommentResponse(BaseModel):
    id: str
    review_id: str
    author: str
    body: str
    line_number: int | None
    created_at: datetime

    class Config:
        from_attributes = True


class ReviewListResponse(BaseModel):
    id: str
    title: str
    language: str
    overall_score: int
    issue_count: int
    created_at: datetime
