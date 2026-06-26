import { ArrowLeft, Award, AlertTriangle, Info, AlertOctagon } from "lucide-react";
import type { Issue } from "@/lib/api";
import IssueCard from "./IssueCard";

interface ReviewResultsProps {
  score: number;
  summary: string;
  issues: Issue[];
  onBack: () => void;
}

function getScoreMeta(score: number) {
  if (score >= 80) return { color: "text-emerald-400", ring: "ring-emerald-500/30", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Excellent" };
  if (score >= 60) return { color: "text-amber-400", ring: "ring-amber-500/30", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Needs Work" };
  return { color: "text-red-400", ring: "ring-red-500/30", bg: "bg-red-500/10", border: "border-red-500/20", label: "Critical" };
}

export default function ReviewResults({ score, summary, issues, onBack }: ReviewResultsProps) {
  const meta = getScoreMeta(score);

  const bySeverity = {
    error: issues.filter((i) => i.severity === "error").length,
    warning: issues.filter((i) => i.severity === "warning").length,
    info: issues.filter((i) => i.severity === "info").length,
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="btn-ghost text-sm group">
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
        Back to Editor
      </button>

      <div className={`glass rounded-2xl p-6 border ${meta.border}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex items-center gap-4">
            <div className={`relative flex h-20 w-20 items-center justify-center rounded-2xl ${meta.bg} border ${meta.border} ring-2 ${meta.ring}`}>
              <Award size={32} className={meta.color} />
              <span className={`absolute -bottom-1 -right-1 text-xs font-bold ${meta.color} bg-surface-950 rounded-full px-1.5 py-0.5 border ${meta.border}`}>
                {score}
              </span>
            </div>
            <div>
              <p className={`text-lg font-bold ${meta.color}`}>{meta.label}</p>
              <p className="text-xs text-surface-400 mt-0.5">Overall Score: {score}/100</p>
              <div className="flex gap-3 mt-2">
                {bySeverity.error > 0 && (
                  <span className="flex items-center gap-1 text-xs text-red-400">
                    <AlertOctagon size={12} /> {bySeverity.error}
                  </span>
                )}
                {bySeverity.warning > 0 && (
                  <span className="flex items-center gap-1 text-xs text-amber-400">
                    <AlertTriangle size={12} /> {bySeverity.warning}
                  </span>
                )}
                {bySeverity.info > 0 && (
                  <span className="flex items-center gap-1 text-xs text-blue-400">
                    <Info size={12} /> {bySeverity.info}
                  </span>
                )}
              </div>
            </div>
          </div>
          {summary && (
            <div className="flex-1 min-w-0 border-t sm:border-t-0 sm:border-l border-white/[0.06] pt-4 sm:pt-0 sm:pl-5">
              <p className="text-sm text-surface-300 leading-relaxed">{summary}</p>
            </div>
          )}
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <Award size={32} className="text-emerald-400" />
          </div>
          <p className="text-lg font-semibold text-surface-200">Clean Code!</p>
          <p className="text-sm text-surface-400 mt-1">No issues found — great work.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-surface-200">
              Found {issues.length} Issue{issues.length !== 1 ? "s" : ""}
            </h3>
            <span className="text-xs text-surface-500">
              Sorted by severity
            </span>
          </div>
          {issues.map((issue, i) => (
            <IssueCard key={i} issue={issue} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
