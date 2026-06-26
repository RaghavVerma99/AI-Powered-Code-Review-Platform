import { AlertTriangle, Bug, Shield, Lightbulb, Zap, Braces } from "lucide-react";

const severityStyles = {
  error: { border: "border-red-500/20", bg: "bg-red-500/5", icon: AlertTriangle, label: "tag-error" },
  warning: { border: "border-amber-500/20", bg: "bg-amber-500/5", icon: AlertTriangle, label: "tag-warning" },
  info: { border: "border-blue-500/20", bg: "bg-blue-500/5", icon: Lightbulb, label: "tag-info" },
};

const categoryIcons = { linting: Braces, security: Shield, style: Lightbulb, performance: Zap, "best-practice": Bug, bug: Bug, design: Braces };

export default function IssueCard({ issue, index }) {
  const cfg = severityStyles[issue.severity] || severityStyles.info;
  const CategoryIcon = categoryIcons[issue.category] || Bug;

  return (
    <div className={`glass rounded-xl border ${cfg.border} ${cfg.bg} p-4 animate-fade-in`} style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex items-start gap-3.5">
        <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${cfg.bg} border ${cfg.border}`}>
          <CategoryIcon size={16} className="text-surface-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className={cfg.label}>{issue.severity}</span>
            <span className="rounded-md bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[11px] font-mono text-surface-400">{issue.category}</span>
            {issue.line > 0 && <span className="text-[11px] font-mono text-surface-500">L{issue.line}{issue.column ? `:${issue.column}` : ""}</span>}
          </div>
          <p className="text-sm text-surface-200 leading-relaxed">{issue.message}</p>
          {issue.suggestion && (
            <div className="mt-2 flex items-start gap-2 rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-2">
              <Lightbulb size={12} className="mt-0.5 text-primary-400 shrink-0" />
              <p className="text-xs text-surface-400 italic">{issue.suggestion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
