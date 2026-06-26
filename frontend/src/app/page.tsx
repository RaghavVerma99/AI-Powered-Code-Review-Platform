'use client';

import { useState } from "react";
import ReviewForm from "@/components/ReviewForm";
import ReviewResults from "@/components/ReviewResults";
import ReviewHistory from "@/components/ReviewHistory";
import { api, Review } from "@/lib/api";

export default function Home() {
  const [activeReview, setActiveReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReviewCreated = async (id: string) => {
    setLoading(true);
    try {
      const review = await api.getReview(id);
      setActiveReview(review);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white text-sm font-bold">
              CR
            </div>
            <span className="text-lg font-bold text-surface-900 dark:text-white">
              CodeReview <span className="text-primary-500">AI</span>
            </span>
          </a>
          <nav className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-surface-500 hover:text-surface-700 dark:hover:text-surface-200 transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-surface-900 dark:text-white">
            AI-Powered{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-500">
              Code Review
            </span>
          </h1>
          <p className="mt-4 text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
            Paste your code and get instant feedback on linting, security, performance, and style.
            Powered by AI + static analysis.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {activeReview && !loading ? (
              <ReviewResults
                score={activeReview.overall_score}
                summary={activeReview.summary}
                issues={activeReview.issues}
                onBack={() => setActiveReview(null)}
              />
            ) : (
              <div className="card">
                <ReviewForm onReviewCreated={handleReviewCreated} />
              </div>
            )}

            {loading && (
              <div className="card flex items-center justify-center py-16">
                <div className="text-center">
                  <svg className="animate-spin h-10 w-10 text-primary-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-surface-500 dark:text-surface-400 text-sm">
                    Analyzing your code...
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <ReviewHistory />
          </div>
        </div>
      </main>

      <footer className="border-t border-surface-200 dark:border-surface-800 mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-surface-400">
          Built with Next.js, FastAPI &amp; OpenAI &middot; Final Year Project
        </div>
      </footer>
    </div>
  );
}
