import { useState } from "react";
import { Sparkles } from "lucide-react";
import Header from "@/components/Header";
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
      <div className="noise" />
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-5 border-white/[0.06]">
            <Sparkles size={14} className="text-primary-400" />
            <span className="text-xs font-medium text-surface-300">
              AI-Powered Static Analysis
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-balance">
            Smart Code Reviews,{" "}
            <span className="gradient-text">Instant Feedback</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-surface-400 max-w-2xl mx-auto text-balance">
            Paste your code and get comprehensive analysis — linting, security,
            performance, and style suggestions powered by AI.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="glass-card flex items-center justify-center py-20">
                <div className="text-center">
                  <svg className="animate-spin h-10 w-10 text-primary-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-sm text-surface-400">Running analysis...</p>
                </div>
              </div>
            ) : activeReview ? (
              <ReviewResults
                score={activeReview.overall_score}
                summary={activeReview.summary}
                issues={activeReview.issues}
                onBack={() => setActiveReview(null)}
              />
            ) : (
              <div className="glass-card">
                <ReviewForm onReviewCreated={handleReviewCreated} />
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <ReviewHistory />
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.04] mt-8">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-surface-600">
          Built with React + FastAPI + OpenAI &middot; Final Year Project
        </div>
      </footer>
    </div>
  );
}
