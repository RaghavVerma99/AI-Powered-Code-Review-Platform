const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function apiFetch(path, options) {
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
  getLanguages: () => apiFetch("/reviews/languages"),
  createReview: (body) =>
    apiFetch("/reviews", { method: "POST", body: JSON.stringify(body) }),
  listReviews: (skip = 0, limit = 20) =>
    apiFetch(`/reviews?skip=${skip}&limit=${limit}`),
  getReview: (id) => apiFetch(`/reviews/${id}`),
  getComments: (reviewId) => apiFetch(`/reviews/${reviewId}/comments`),
  createComment: (reviewId, body) =>
    apiFetch(`/reviews/${reviewId}/comments`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
