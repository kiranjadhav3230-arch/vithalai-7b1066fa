import { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { ChevronRight, FileCode } from 'lucide-react';

interface CodeEditorPaneProps {
  code: string;
  language: string;
  title: string;
  isEditing: boolean;
  onCodeChange: (code: string) => void;
  onSave: () => void;
}

const getMonacoLanguage = (language: string): string => {
  const languageMap: Record<string, string> = {
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
    java: 'java',
    html: 'html',
    css: 'css',
    react: 'javascript',
    jsx: 'javascript',
    tsx: 'typescript',
    cpp: 'cpp',
    'c++': 'cpp',
    c: 'c',
    go: 'go',
    rust: 'rust',
    ruby: 'ruby',
    php: 'php',
    swift: 'swift',
    kotlin: 'kotlin',
    bash: 'shell',
    shell: 'shell',
    sql: 'sql',
    json: 'json',
    xml: 'xml',
    yaml: 'yaml',
    markdown: 'markdown',
  };
  return languageMap[language.toLowerCase()] || 'plaintext';
};

export function CodeEditorPane({
  code,
  language,
  title,
  isEditing,
  onCodeChange,
  onSave,
}: CodeEditorPaneProps) {
  const editorRef = useRef<any>(null);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Add Ctrl+S save shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave();
    });
  };

  if (!title) {
    return (
      <div className="flex-1 bg-[#1e1e1e] flex flex-col items-center justify-center text-[#858585]">
        <FileCode className="h-16 w-16 mb-4 opacity-30" />
        <p className="text-lg">No snippet selected</p>
        <p className="text-sm mt-2">Select a snippet from the explorer to view its code</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
      {/* Breadcrumb */}
      <div className="h-6 px-3 flex items-center gap-1 text-xs text-[#858585] border-b border-[#3c3c3c] bg-[#1e1e1e]">
        <span className="text-[#cccccc]">{language.toUpperCase()}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[#cccccc]">{title}</span>
        {isEditing && (
          <>
            <span className="ml-2 text-[#007acc]">• Editing</span>
            <span className="ml-auto text-[#6a737d]">Ctrl+S to save</span>
          </>
        )}
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={code}
          onChange={(value) => onCodeChange(value || '')}
          theme="vs-dark"
          options={{
            readOnly: !isEditing,
            minimap: { enabled: true },
            fontSize: 14,
            fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            folding: true,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 8, bottom: 8 },
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
          }}
          onMount={handleEditorMount}
        />
      </div>
    </div>
  );
}
