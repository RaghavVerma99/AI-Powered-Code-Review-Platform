import { Router, Request, Response } from "express";
import { Review, Comment } from "../models/index.js";

const router = Router({ mergeParams: true });

router.get("/", async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.reviewId).lean();
    if (!review) {
      res.status(404).json({ detail: "Review not found" });
      return;
    }

    const comments = await Comment.find({ reviewId: req.params.reviewId })
      .sort({ createdAt: 1 })
      .lean();

    res.json(
      comments.map((c) => ({
        id: c._id,
        review_id: c.reviewId,
        author: c.author,
        body: c.body,
        line_number: c.lineNumber,
        created_at: c.createdAt,
      }))
    );
  } catch (err: any) {
    res.status(500).json({ detail: err.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      res.status(404).json({ detail: "Review not found" });
      return;
    }

    const { author, body, line_number } = req.body;
    if (!body || !body.trim()) {
      res.status(400).json({ detail: "Comment body cannot be empty" });
      return;
    }

    const comment = new Comment({
      reviewId: req.params.reviewId,
      author: author || "Anonymous",
      body,
      lineNumber: line_number ?? null,
    });
    await comment.save();

    res.status(201).json({
      id: comment._id,
      review_id: comment.reviewId,
      author: comment.author,
      body: comment.body,
      line_number: comment.lineNumber,
      created_at: comment.createdAt,
    });
  } catch (err: any) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
