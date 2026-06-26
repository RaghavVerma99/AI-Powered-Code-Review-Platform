import { useRef } from "react";
import Editor from "@monaco-editor/react";
import { Terminal } from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export default function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  const handleMount = (editor: any) => {
    editorRef.current = editor;
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      lineNumbers: "on",
      scrollBeyondLastLine: false,
      padding: { top: 16, bottom: 16 },
      renderLineHighlight: "line",
      cursorStyle: "line",
      automaticLayout: true,
      bracketPairColorization: { enabled: true },
      lineNumbersMinChars: 3,
    });
  };

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-surface-400">
          <Terminal size={12} />
          <span className="text-[11px] font-medium uppercase tracking-wider">{language}</span>
        </div>
      </div>
      <Editor
        height="420px"
        language={language === "cpp" ? "cpp" : language}
        value={value}
        onChange={(val) => onChange(val || "")}
        onMount={handleMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          lineNumbersMinChars: 3,
          readOnly: false,
          cursorBlinking: "smooth",
          smoothScrolling: true,
        }}
      />
    </div>
  );
}
