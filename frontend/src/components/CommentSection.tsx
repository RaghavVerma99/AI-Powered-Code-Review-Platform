import { useState, useEffect } from "react";
import { MessageSquare, User, Send } from "lucide-react";
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
    <div className="glass-card">
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare size={18} className="text-primary-400" />
        <h3 className="text-sm font-semibold text-surface-200">
          Comments ({comments.length})
        </h3>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1 mb-5">
        {comments.length === 0 ? (
          <p className="text-sm text-surface-500 py-4 text-center">
            No comments yet. Start the conversation.
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="glass rounded-xl p-3 border-white/[0.04] animate-fade-in"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500/15 border border-primary-500/20">
                  <User size={12} className="text-primary-300" />
                </div>
                <span className="text-sm font-medium text-surface-200">{c.author}</span>
                {c.line_number && (
                  <span className="text-[11px] font-mono text-surface-500">
                    L{c.line_number}
                  </span>
                )}
                <span className="text-[11px] text-surface-500 ml-auto">
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-surface-300 ml-8">{c.body}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name (optional)"
            className="glass-input pl-10"
          />
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment..."
          rows={2}
          className="glass-input resize-none"
        />
        <button
          type="submit"
          disabled={loading || !body.trim()}
          className="btn-glass w-full"
        >
          <Send size={14} />
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}
