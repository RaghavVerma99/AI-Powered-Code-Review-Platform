'use client';

import { useRef } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

const THEME = {
  base: "vs-dark",
  bg: "#0f172a",
  lineHighlight: "#1e293b",
};

export default function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  const handleMount = (editor: any) => {
    editorRef.current = editor;
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      lineNumbers: "on",
      scrollBeyondLastLine: false,
      padding: { top: 16 },
      renderLineHighlight: "line",
      cursorStyle: "line",
      automaticLayout: true,
      bracketPairColorization: { enabled: true },
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-surface-700">
      <div className="flex items-center justify-between bg-surface-900 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <span className="text-xs font-medium text-surface-400 uppercase">
          {language}
        </span>
      </div>
      <Editor
        height="400px"
        language={language === "cpp" ? "cpp" : language}
        value={value}
        onChange={(val) => onChange(val || "")}
        onMount={handleMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          scrollBeyondLastLine: false,
          padding: { top: 16 },
        }}
      />
    </div>
  );
}
