import OpenAI from "openai";
import { config } from "../config.js";
import { IIssue } from "../models/index.js";

const openai = config.openaiApiKey ? new OpenAI({ apiKey: config.openaiApiKey }) : null;

type LintPattern = [RegExp, IIssue["severity"], string, string];

const LINT_PATTERNS: Record<string, LintPattern[]> = {
  python: [
    [/^\s*print\(/, "info", "style", "Use logging instead of print() for production code"],
    [/except\s*:/, "warning", "best-practice", "Bare except clause — catch specific exceptions"],
    [/^\s*pass\s*$/, "info", "style", "Unimplemented block — remove or implement pass"],
    [/from\s+\w+\s+import\s+\*/, "error", "linting", "Wildcard imports pollute namespace — import explicitly"],
    [/\t+/, "warning", "style", "Tabs used for indentation — use spaces (PEP 8)"],
  ],
  javascript: [
    [/console\.log\(/, "info", "style", "Remove console.log in production code"],
    [/\bvar\s+/, "warning", "style", "Use let/const instead of var"],
    [/==\s[^=]/, "warning", "best-practice", "Use === instead of =="],
    [/\beval\s*\(/, "error", "security", "eval() is dangerous — never use it"],
    [/document\.write\(/, "warning", "security", "Avoid document.write() — use DOM methods"],
  ],
  typescript: [
    [/console\.log\(/, "info", "style", "Remove console.log in production code"],
    [/: any\b/, "warning", "style", "Avoid 'any' — use proper types"],
    [/@ts-ignore/, "warning", "best-practice", "Use @ts-expect-error instead of @ts-ignore"],
    [/\beval\s*\(/, "error", "security", "eval() is dangerous — never use it"],
  ],
  go: [
    [/error\.New\(fmt\.Sprintf/, "info", "style", "Use fmt.Errorf() instead of error.New(fmt.Sprintf())"],
    [/\bpanic\(/, "warning", "best-practice", "Avoid panic outside init/main — return errors"],
    [/defer\s+os\.Remove/, "info", "linting", "Consider checking Remove error even when deferred"],
  ],
  rust: [
    [/\.unwrap\(\)/, "warning", "best-practice", "Avoid unwrap() — handle errors with match or ?"],
    [/\/\/\s*TODO/, "info", "style", "Incomplete TODO — address before release"],
    [/unsafe\s*\{/, "warning", "security", "Unsafe block — verify memory safety"],
  ],
  java: [
    [/System\.out\.print(ln)?\(/, "info", "style", "Use a logger instead of System.out"],
    [/catch\s*\(Exception\s+\w+\)/, "warning", "best-practice", "Catching generic Exception — be more specific"],
    [/public\s+static\s+void\s+main/, "info", "linting", "Verify main method placement"],
  ],
};

export const LANGUAGE_OPTIONS = [
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
  { id: "java", label: "Java" },
];

function runLocalLint(code: string, language: string): IIssue[] {
  const issues: IIssue[] = [];
  const patterns = LINT_PATTERNS[language] || [];
  const lines = code.split("\n");

  for (let i = 0; i < lines.length; i++) {
    for (const [regex, severity, category, message] of patterns) {
      if (regex.test(lines[i])) {
        issues.push({ line: i + 1, severity, category, message });
      }
    }
  }
  return issues;
}

function buildPrompt(code: string, language: string, lintIssues: IIssue[]): string {
  const lintSection = lintIssues.length
    ? lintIssues.map((i) => `- Line ${i.line} [${i.severity}] [${i.category}]: ${i.message}`).join("\n")
    : "No basic lint issues detected.";

  return `You are a senior code reviewer. Analyze the following ${language} code and provide:

1. **Summary** — 2-3 sentence overview of the code quality
2. **Overall Score** — integer from 0 to 100
3. **Additional Issues** — any issues NOT already listed (security, performance, bugs, design, edge cases)

Existing lint issues found:
${lintSection}

Code to review:
\`\`\`${language}
${code}
\`\`\`

Respond with valid JSON ONLY (no markdown, no code fences):
{
  "summary": "...",
  "overall_score": 0-100,
  "additional_issues": [
    {"line": <int or null>, "severity": "error|warning|info", "category": "security|performance|bug|design|best-practice", "message": "...", "suggestion": "..."}
  ]
}`;
}

async function callLLM(prompt: string): Promise<any | null> {
  if (!openai) return null;
  try {
    const response = await openai.chat.completions.create({
      model: config.openaiModel,
      messages: [
        { role: "system", content: "You are a JSON-only code reviewer." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 2000,
    });
    const text = response.choices[0]?.message?.content || "";
    const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function computeScore(lintIssues: IIssue[], aiIssues: IIssue[]): number {
  let base = 100;
  for (const issue of [...lintIssues, ...aiIssues]) {
    if (issue.severity === "error") base -= 15;
    else if (issue.severity === "warning") base -= 8;
    else base -= 3;
  }
  return Math.max(base, 0);
}

export async function reviewCode(code: string, language: string): Promise<{
  issues: IIssue[];
  summary: string;
  score: number;
}> {
  const lintIssues = runLocalLint(code, language);
  const allIssues = [...lintIssues];
  let summary = "";
  let score = computeScore(lintIssues, []);

  const aiResult = await callLLM(buildPrompt(code, language, lintIssues));

  if (aiResult) {
    summary = aiResult.summary || "";
    const additional: any[] = aiResult.additional_issues || [];
    for (const iss of additional) {
      allIssues.push({
        line: iss.line || 0,
        severity: iss.severity || "info",
        category: iss.category || "best-practice",
        message: iss.message || "",
        suggestion: iss.suggestion || null,
      });
    }
    score = aiResult.overall_score ?? computeScore(lintIssues, additional);
  } else {
    summary = `Reviewed ${lintIssues.length} issue(s) via static analysis. Set OPENAI_API_KEY for AI-powered review.`;
  }

  return { issues: allIssues, summary, score };
}
