'use client';

import { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";
import { api, LanguageOption } from "@/lib/api";

const DEFAULT_CODE: Record<string, string> = {
  python: `def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint(fibonacci(10))`,
  javascript: `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10));`,
  go: `package main\n\nimport "fmt"\n\nfunc fibonacci(n int) int {\n\tif n <= 1 {\n\t\treturn n\n\t}\n\treturn fibonacci(n-1) + fibonacci(n-2)\n}\n\nfunc main() {\n\tfmt.Println(fibonacci(10))\n}`,
  typescript: `function fibonacci(n: number): number {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10));`,
  rust: `fn fibonacci(n: u32) -> u32 {\n    match n {\n        0 | 1 => n,\n        _ => fibonacci(n - 1) + fibonacci(n - 2),\n    }\n}\n\nfn main() {\n    println!("{}", fibonacci(10));\n}`,
};

interface ReviewFormProps {
  onReviewCreated: (id: string) => void;
  initialCode?: string;
  initialLanguage?: string;
}

export default function ReviewForm({ onReviewCreated, initialCode, initialLanguage }: ReviewFormProps) {
  const [code, setCode] = useState(initialCode || DEFAULT_CODE.python);
  const [language, setLanguage] = useState(initialLanguage || "python");
  const [title, setTitle] = useState("");
  const [languages, setLanguages] = useState<LanguageOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getLanguages().then(setLanguages).catch(() => {});
  }, []);

  useEffect(() => {
    if (!initialCode && DEFAULT_CODE[language]) {
      setCode(DEFAULT_CODE[language]);
    }
  }, [language, initialCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    try {
      const review = await api.createReview({ code, language, title });
      onReviewCreated(review.id);
    } catch (err: any) {
      setError(err.message || "Failed to create review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Review title (optional)"
            className="input-field"
          />
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="input-field sm:w-44"
        >
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <CodeEditor value={code} onChange={setCode} language={language} />

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-surface-400">
          {code.length} characters &middot; {code.split("\n").length} lines
        </p>
        <button type="submit" disabled={loading || !code.trim()} className="btn-primary">
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Reviewing...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Review Code
            </>
          )}
        </button>
      </div>
    </form>
  );
}
