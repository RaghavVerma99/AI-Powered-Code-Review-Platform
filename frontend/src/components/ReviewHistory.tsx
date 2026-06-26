'use client';

import { useState, useEffect } from "react";
import { api, ReviewListItem } from "@/lib/api";

export default function ReviewHistory() {
  const [reviews, setReviews] = useState<ReviewListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listReviews()
      .then(setReviews)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-5 w-32 bg-surface-200 dark:bg-surface-700 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-surface-200 dark:bg-surface-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
        Recent Reviews
      </h3>
      {reviews.length === 0 ? (
        <p className="text-sm text-surface-400">No reviews yet. Submit code to get started!</p>
      ) : (
        <div className="space-y-2">
          {reviews.map((r) => (
            <a
              key={r.id}
              href={`/reviews/${r.id}`}
              className="flex items-center justify-between rounded-lg border border-surface-200 dark:border-surface-700 px-4 py-3 transition-colors hover:bg-surface-50 dark:hover:bg-surface-800"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-surface-700 dark:text-surface-200 truncate">
                  {r.title}
                </p>
                <p className="text-xs text-surface-400 mt-0.5">
                  {r.language} &middot; {r.issue_count} issues
                </p>
              </div>
              <div className="flex items-center gap-3 ml-3">
                <span
                  className={`text-sm font-bold ${
                    r.overall_score >= 80
                      ? "text-green-500"
                      : r.overall_score >= 60
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {r.overall_score}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-surface-300">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </a>
          ))}
          {reviews.length >= 20 && (
            <p className="text-xs text-surface-400 text-center pt-2">
              Showing last 20 reviews
            </p>
          )}
        </div>
      )}
    </div>
  );
}
