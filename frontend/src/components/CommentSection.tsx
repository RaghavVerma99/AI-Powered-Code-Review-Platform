'use client';

import { useState, useEffect } from "react";
import { api, Comment as CommentType } from "@/lib/api";

interface CommentSectionProps {
  reviewId: string;
}

export default function CommentSection({ reviewId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getComments(reviewId).then(setComments).catch(() => {});
  }, [reviewId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    try {
      const comment = await api.createComment(reviewId, {
        author: author || "Anonymous",
        body,
        line_number: null,
      });
      setComments((prev) => [...prev, comment]);
      setBody("");
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
        Comments ({comments.length})
      </h3>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-sm text-surface-400">No comments yet. Be the first!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="rounded-lg bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-200">
                  {c.author}
                </span>
                {c.line_number && (
                  <span className="text-xs font-mono text-surface-400">Line {c.line_number}</span>
                )}
                <span className="text-xs text-surface-400 ml-auto">
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-surface-600 dark:text-surface-300">{c.body}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name (optional)"
          className="input-field"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment..."
          rows={2}
          className="input-field resize-none"
        />
        <button type="submit" disabled={loading || !body.trim()} className="btn-primary">
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}
