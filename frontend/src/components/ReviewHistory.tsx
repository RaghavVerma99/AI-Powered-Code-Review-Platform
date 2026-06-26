import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, ChevronRight, FileCode2 } from "lucide-react";
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

  return (
    <div className="glass-card">
      <div className="flex items-center gap-2 mb-5">
        <Clock size={18} className="text-primary-400" />
        <h3 className="text-sm font-semibold text-surface-200">Recent Reviews</h3>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="glass rounded-xl p-3 border-white/[0.03] animate-pulse"
            >
              <div className="h-3 w-24 bg-white/[0.05] rounded mb-2" />
              <div className="h-3 w-16 bg-white/[0.03] rounded" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <FileCode2 size={28} className="mx-auto text-surface-500 mb-2" />
          <p className="text-sm text-surface-500">No reviews yet</p>
          <p className="text-xs text-surface-600 mt-1">
            Submit code above to get started
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {reviews.map((r) => (
            <Link
              key={r.id}
              to={`/reviews/${r.id}`}
              className="glass-hover rounded-xl p-3 flex items-center justify-between group"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-surface-200 truncate group-hover:text-primary-300 transition-colors">
                  {r.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-mono text-surface-500 bg-white/[0.03] px-1.5 py-0.5 rounded">
                    {r.language}
                  </span>
                  <span className="text-[11px] text-surface-600">
                    {r.issue_count} issues
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-3 shrink-0">
                <span className={`text-xs font-bold ${
                  r.overall_score >= 80 ? "text-emerald-400" :
                  r.overall_score >= 60 ? "text-amber-400" : "text-red-400"
                }`}>
                  {r.overall_score}
                </span>
                <ChevronRight size={14} className="text-surface-600 group-hover:text-surface-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
