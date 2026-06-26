import { useState, useEffect } from "react";
import { Sparkles, BookOpen, ChevronDown, FileCode2 } from "lucide-react";
import CodeEditor from "./CodeEditor";
import { api } from "@/lib/api";

const DEFAULT_CODE = {
  python: `def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint(fibonacci(10))`,
  javascript: `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10));`,
  typescript: `function fibonacci(n: number): number {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10));`,
  go: `package main\n\nimport "fmt"\n\nfunc fibonacci(n int) int {\n\tif n <= 1 {\n\t\treturn n\n\t}\n\treturn fibonacci(n-1) + fibonacci(n-2)\n}\n\nfunc main() {\n\tfmt.Println(fibonacci(10))\n}`,
  rust: `fn fibonacci(n: u32) -> u32 {\n    match n {\n        0 | 1 => n,\n        _ => fibonacci(n - 1) + fibonacci(n - 2),\n    }\n}\n\nfn main() {\n    println!("{}", fibonacci(10));\n}`,
  java: `public class Fibonacci {\n    public static int fibonacci(int n) {\n        if (n <= 1) return n;\n        return fibonacci(n - 1) + fibonacci(n - 2);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(fibonacci(10));\n    }\n}`,
};

export default function ReviewForm({ onReviewCreated }) {
  const [code, setCode] = useState(DEFAULT_CODE.python);
  const [language, setLanguage] = useState("python");
  const [title, setTitle] = useState("");
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getLanguages().then(setLanguages).catch(() => {});
  }, []);

  useEffect(() => {
    if (DEFAULT_CODE[language]) setCode(DEFAULT_CODE[language]);
  }, [language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    try {
      const review = await api.createReview({ code, language, title });
      onReviewCreated(review.id);
    } catch (err) {
      setError(err.message || "Failed to create review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <BookOpen size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Review title (optional)" className="glass-input pl-10" />
        </div>
        <div className="relative">
          <FileCode2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="glass-select pl-10 pr-10 sm:w-44">
            {languages.map((lang) => <option key={lang.id} value={lang.id}>{lang.label}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
        </div>
      </div>

      <CodeEditor value={code} onChange={setCode} language={language} />

      {error && (
        <div className="glass rounded-xl border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-surface-500">{code.length} chars &middot; {code.split("\n").length} lines</span>
        <button type="submit" disabled={loading || !code.trim()} className="btn-glass">
          {loading ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Analyzing...</>
          ) : (
            <><Sparkles size={16} /> Review Code</>
          )}
        </button>
      </div>
    </form>
  );
}
