import { Code2, Github } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass mt-3 rounded-2xl px-5 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 text-white shadow-glow transition-transform group-hover:scale-105">
              <Code2 size={18} />
            </div>
            <span className="text-base font-bold tracking-tight">
              CodeReview <span className="gradient-text">AI</span>
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-ghost px-3 py-2 text-xs">
              <Github size={16} /> GitHub
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
