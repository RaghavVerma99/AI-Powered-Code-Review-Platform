'use client';

import { Issue } from "@/lib/api";
import IssueCard from "./IssueCard";

interface ReviewResultsProps {
  score: number;
  summary: string;
  issues: Issue[];
  onBack: () => void;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800";
  if (score >= 60) return "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800";
  return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";
}

export default function ReviewResults({ score, summary, issues, onBack }: ReviewResultsProps) {
  const bySeverity = {
    error: issues.filter((i) => i.severity === "error").length,
    warning: issues.filter((i) => i.severity === "warning").length,
    info: issues.filter((i) => i.severity === "info").length,
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="btn-secondary text-sm">
        &larr; Review Another
      </button>

      <div className={`rounded-xl border ${getScoreBg(score)} p-6`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-4">
            <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <div>
              <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">
                Overall Score
              </p>
              <div className="flex gap-3 mt-1 text-xs text-surface-500">
                <span>{bySeverity.error} errors</span>
                <span>{bySeverity.warning} warnings</span>
                <span>{bySeverity.info} info</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed">
              {summary}
            </p>
          </div>
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-3xl mb-2">🎉</p>
          <p className="text-surface-600 dark:text-surface-300 font-medium">No issues found!</p>
          <p className="text-sm text-surface-400 mt-1">Clean code — great job.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
            Found {issues.length} Issue{issues.length !== 1 ? "s" : ""}
          </h3>
          {issues.map((issue, i) => (
            <IssueCard key={i} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
