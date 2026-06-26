import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileCode2 } from "lucide-react";
import { api, Review } from "@/lib/api";
import ReviewResults from "@/components/ReviewResults";
import CommentSection from "@/components/CommentSection";

export default function ReviewDetail() {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api
      .getReview(id)
      .then(setReview)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-primary-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-surface-400">Loading review...</p>
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card text-center max-w-md">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
            <FileCode2 size={28} className="text-red-400" />
          </div>
          <h1 className="text-lg font-bold text-surface-200 mb-1">Review Not Found</h1>
          <p className="text-sm text-surface-400 mb-5">{error || "This review doesn't exist or has been removed."}</p>
          <Link to="/" className="btn-glass">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="noise" />
      <div className="mx-auto max-w-4xl px-4 py-8 pt-24">
        <Link to="/" className="btn-ghost text-sm mb-6 inline-flex group">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Home
        </Link>

        <div className="glass-card mb-6">
          <h1 className="text-xl font-bold text-surface-100">{review.title}</h1>
          <div className="flex items-center gap-3 mt-2 text-xs text-surface-500">
            <span className="font-mono bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
              {review.language}
            </span>
            <span>
              {new Date(review.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <ReviewResults
            score={review.overall_score}
            summary={review.summary}
            issues={review.issues}
            onBack={() => {}}
          />

          <div className="glass-card">
            <div className="flex items-center gap-2 mb-4">
              <FileCode2 size={18} className="text-primary-400" />
              <h3 className="text-sm font-semibold text-surface-200">Submitted Code</h3>
            </div>
            <pre className="glass rounded-xl p-4 overflow-x-auto text-sm text-surface-200 font-mono leading-relaxed border border-white/[0.04]">
              <code>{review.code}</code>
            </pre>
          </div>

          <CommentSection reviewId={review.id} />
        </div>
      </div>
    </div>
  );
}
