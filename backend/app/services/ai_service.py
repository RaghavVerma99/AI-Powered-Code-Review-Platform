import json
import re

from openai import OpenAI

from app.config import settings
from app.schemas import Issue


client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None


LINTING_PATTERNS: dict[str, list[tuple[str, str, str, str]]] = {
    "python": [
        (r"^\s*print\(", "info", "style", "Use logging instead of print() for production code"),
        (r"except\s*:", "warning", "best-practice", "Bare except clause — catch specific exceptions"),
        (r"^\s*pass\s*$", "info", "style", "Unimplemented block — remove or implement pass"),
        (r"from\s+\w+\s+import\s+\*", "error", "linting", "Wildcard imports pollute namespace — import explicitly"),
        (r"\t+", "warning", "style", "Tabs used for indentation — use spaces (PEP 8)"),
        (r"if\s+.*:\s*$", "info", "linting", "Missing space after comma" if False else None),
    ],
    "javascript": [
        (r"console\.log\(", "info", "style", "Remove console.log in production code"),
        (r"var\s+", "warning", "style", "Use let/const instead of var"),
        (r"==\s", "warning", "best-practice", "Use === instead of =="),
        (r"eval\s*\(", "error", "security", "eval() is dangerous and should never be used"),
        (r"document\.write\(", "warning", "security", "Avoid document.write() — use DOM methods"),
    ],
    "go": [
        (r"error\.New\(fmt\.Sprintf", "info", "style", "Use fmt.Errorf() instead of error.New(fmt.Sprintf())"),
        (r"panic\(", "warning", "best-practice", "Avoid panic outside of init/main — return errors"),
        (r"defer\s+os\.Remove", "info", "linting", "Consider checking Remove error even when deferred"),
    ],
}


def is_ai_available() -> bool:
    return client is not None


def run_local_lint(code: str, language: str) -> list[Issue]:
    issues: list[Issue] = []
    patterns = LINTING_PATTERNS.get(language, [])
    lines = code.split("\n")

    for line_idx, line in enumerate(lines, start=1):
        for pattern, severity, category, message in patterns:
            if re.search(pattern, line):
                issues.append(Issue(
                    line=line_idx, severity=severity, category=category, message=message
                ))

    return issues


def build_review_prompt(code: str, language: str, lint_issues: list[Issue]) -> str:
    lint_section = "\n".join(
        f"- Line {i.line} [{i.severity}] [{i.category}]: {i.message}"
        for i in lint_issues
    ) if lint_issues else "No basic lint issues detected."

    return f"""You are a senior code reviewer. Analyze the following {language} code and provide:

1. **Summary** — 2-3 sentence overview of the code quality
2. **Overall Score** — integer from 0 to 100
3. **Additional Issues** — any issues NOT already listed below (security, performance, bugs, design patterns, edge cases)

Existing lint issues found:
{lint_section}

Code to review:
```{language}
{code}
```

Respond with valid JSON ONLY (no markdown fences):
{{
  "summary": "...",
  "overall_score": 0-100,
  "additional_issues": [
    {{"line": <int or null>, "severity": "error|warning|info", "category": "security|performance|bug|design|best-practice", "message": "...", "suggestion": "..."}}
  ]
}}"""


def call_llm(prompt: str) -> dict | None:
    if not client:
        return None
    try:
        resp = client.chat.completions.create(
            model=settings.openai_model,
            messages=[{"role": "system", "content": "You are a JSON-only code reviewer."}, {"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=2000,
        )
        text = resp.choices[0].message.content or ""
        text = text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        return json.loads(text)
    except Exception:
        return None


def compute_score(lint_issues: list[Issue], ai_issues: list[Issue]) -> int:
    base = 100
    for i in lint_issues + ai_issues:
        if i.severity == "error":
            base -= 15
        elif i.severity == "warning":
            base -= 8
        else:
            base -= 3
    return max(base, 0)


def review_code(code: str, language: str) -> tuple[list[Issue], str, int]:
    lint_issues = run_local_lint(code, language)
    all_issues = list(lint_issues)
    summary = ""

    ai_result = None
    if is_ai_available():
        prompt = build_review_prompt(code, language, lint_issues)
        ai_result = call_llm(prompt)

    if ai_result:
        summary = ai_result.get("summary", "")
        additional = ai_result.get("additional_issues", [])
        for iss in additional:
            all_issues.append(Issue(
                line=iss.get("line") or 0,
                severity=iss.get("severity", "info"),
                category=iss.get("category", "best-practice"),
                message=iss.get("message", ""),
                suggestion=iss.get("suggestion"),
            ))
        score = ai_result.get("overall_score", compute_score(lint_issues, all_issues[len(lint_issues):]))
    else:
        summary = f"Reviewed {len(lint_issues)} issue(s) via static analysis. Set OPENAI_API_KEY for AI-powered review."
        score = compute_score(lint_issues, [])

    return all_issues, summary, score


LANGUAGE_OPTIONS = [
    {"id": "python", "label": "Python"},
    {"id": "javascript", "label": "JavaScript"},
    {"id": "typescript", "label": "TypeScript"},
    {"id": "go", "label": "Go"},
    {"id": "rust", "label": "Rust"},
    {"id": "java", "label": "Java"},
    {"id": "cpp", "label": "C++"},
    {"id": "ruby", "label": "Ruby"},
]
