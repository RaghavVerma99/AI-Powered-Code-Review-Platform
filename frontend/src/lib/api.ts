export interface Issue {
  line: number;
  column?: number | null;
  severity: "error" | "warning" | "info";
  category: string;
  message: string;
  suggestion?: string | null;
}

export interface Review {
  id: string;
  code: string;
  language: string;
  title: string;
  overall_score: number;
  issues: Issue[];
  summary: string;
  created_at: string;
}

export interface ReviewListItem {
  id: string;
  title: string;
  language: string;
  overall_score: number;
  issue_count: number;
  created_at: string;
}

export interface Comment {
  id: string;
  review_id: string;
  author: string;
  body: string;
  line_number?: number | null;
  created_at: string;
}

export interface LanguageOption {
  id: string;
  label: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  getLanguages: () => apiFetch<LanguageOption[]>("/reviews/languages"),

  createReview: (body: { code: string; language: string; title?: string }) =>
    apiFetch<Review>("/reviews", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  listReviews: (skip = 0, limit = 20) =>
    apiFetch<ReviewListItem[]>(`/reviews?skip=${skip}&limit=${limit}`),

  getReview: (id: string) => apiFetch<Review>(`/reviews/${id}`),

  getComments: (reviewId: string) =>
    apiFetch<Comment[]>(`/reviews/${reviewId}/comments`),

  createComment: (reviewId: string, body: { author?: string; body: string; line_number?: number | null }) =>
    apiFetch<Comment>(`/reviews/${reviewId}/comments`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
