import { Router, Request, Response } from "express";
import { Review } from "../models/index.js";
import { reviewCode, LANGUAGE_OPTIONS } from "../services/aiService.js";

const router = Router();

router.get("/languages", (_req: Request, res: Response) => {
  res.json(LANGUAGE_OPTIONS);
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { code, language, title } = req.body;
    if (!code || !code.trim()) {
      res.status(400).json({ detail: "Code cannot be empty" });
      return;
    }

    const { issues, summary, score } = await reviewCode(code, language || "python");

    const review = new Review({
      code,
      language: language || "python",
      title: title || `Review of ${language || "python"} code`,
      overallScore: score,
      issues,
      summary,
    });
    await review.save();

    res.status(201).json({
      id: review._id,
      code: review.code,
      language: review.language,
      title: review.title,
      overall_score: review.overallScore,
      issues: review.issues,
      summary: review.summary,
      created_at: review.createdAt,
    });
  } catch (err: any) {
    res.status(500).json({ detail: err.message || "Internal server error" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 20;
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json(
      reviews.map((r) => ({
        id: r._id,
        title: r.title,
        language: r.language,
        overall_score: r.overallScore,
        issue_count: (r.issues || []).length,
        created_at: r.createdAt,
      }))
    );
  } catch (err: any) {
    res.status(500).json({ detail: err.message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id).lean();
    if (!review) {
      res.status(404).json({ detail: "Review not found" });
      return;
    }
    res.json({
      id: review._id,
      code: review.code,
      language: review.language,
      title: review.title,
      overall_score: review.overallScore,
      issues: review.issues,
      summary: review.summary,
      created_at: review.createdAt,
    });
  } catch (err: any) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
