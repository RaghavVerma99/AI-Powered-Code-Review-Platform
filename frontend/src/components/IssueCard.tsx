'use client';

import { Issue } from "@/lib/api";

const severityConfig = {
  error: { bg: "bg-red-50 dark:bg-red-950", border: "border-red-200 dark:border-red-800", dot: "bg-red-500", label: "tag-error" },
  warning: { bg: "bg-amber-50 dark:bg-amber-950", border: "border-amber-200 dark:border-amber-800", dot: "bg-amber-500", label: "tag-warning" },
  info: { bg: "bg-blue-50 dark:bg-blue-950", border: "border-blue-200 dark:border-blue-800", dot: "bg-blue-500", label: "tag-info" },
};

const categoryIcons: Record<string, string> = {
  linting: "🔍",
  security: "🔒",
  style: "🎨",
  performance: "⚡",
  "best-practice": "✅",
  bug: "🐛",
  design: "🏗️",
};

export default function IssueCard({ issue }: { issue: Issue }) {
  const cfg = severityConfig[issue.severity] || severityConfig.info;

  return (
    <div className={`rounded-lg border ${cfg.border} ${cfg.bg} p-4`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-lg" role="img" aria-label={issue.category}>
          {categoryIcons[issue.category] || "📋"}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={cfg.label}>{issue.severity}</span>
            <span className="rounded bg-surface-200 dark:bg-surface-700 px-1.5 py-0.5 text-[11px] font-mono text-surface-600 dark:text-surface-300">
              {issue.category}
            </span>
            {issue.line > 0 && (
              <span className="text-xs font-mono text-surface-400">
                Line {issue.line}{issue.column ? `:${issue.column}` : ""}
              </span>
            )}
          </div>
          <p className="text-sm text-surface-700 dark:text-surface-200">{issue.message}</p>
          {issue.suggestion && (
            <p className="mt-1.5 text-xs text-surface-500 dark:text-surface-400 italic">
              💡 {issue.suggestion}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
