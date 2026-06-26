'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, Review } from "@/lib/api";
import ReviewResults from "@/components/ReviewResults";
import CommentSection from "@/components/CommentSection";

export default function ReviewDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getReview(id)
      .then(setReview)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <div className="card animate-pulse space-y-4">
          <div className="h-8 w-48 bg-surface-200 dark:bg-surface-700 rounded" />
          <div className="h-32 bg-surface-200 dark:bg-surface-700 rounded" />
          <div className="h-20 bg-surface-200 dark:bg-surface-700 rounded" />
        </div>
      </main>
    );
  }

  if (error || !review) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
          Review Not Found
        </h1>
        <p className="text-surface-500 mb-6">{error || "This review doesn't exist."}</p>
        <a href="/" className="btn-primary">
          &larr; Back to Home
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <a href="/" className="btn-secondary text-sm mb-6 inline-flex">
        &larr; Back to Home
      </a>

      <div className="mb-4">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          {review.title}
        </h1>
        <p className="text-sm text-surface-400">
          {review.language} &middot;{" "}
          {new Date(review.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="space-y-8">
        <ReviewResults
          score={review.overall_score}
          summary={review.summary}
          issues={review.issues}
          onBack={() => {}}
        />

        <div className="card">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
            Submitted Code
          </h3>
          <pre className="rounded-lg bg-surface-900 p-4 overflow-x-auto text-sm text-surface-100 font-mono leading-relaxed">
            <code>{review.code}</code>
          </pre>
        </div>

        <div className="card">
          <CommentSection reviewId={review.id} />
        </div>
      </div>
    </main>
  );
}
