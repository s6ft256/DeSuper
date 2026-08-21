import React, { useState, useRef } from "react";
import { Play, RotateCcw, Sparkles, Terminal, AlertTriangle, CheckCircle2, ChevronRight, Eye } from "lucide-react";
import { ExecutionResult } from "../types";
import { sound } from "../utils/audio";

interface CodeEditorProps {
  initialCode: string;
  onRunCode: (code: string) => ExecutionResult;
  onResetCode: () => void;
  onRequestHint: () => void;
  currentHintLevel?: number;
  isExecuting?: boolean;
  isFailed?: boolean;
}

const QUICK_KEYS = [
  "(",
  ")",
  "[",
  "]",
  "{",
  "}",
  ":",
  "_",
  "=",
  "+",
  "-",
  "*",
  "/",
  '"',
  "'",
  "def ",
  "if ",
  "for ",
  "in ",
  "True",
  "False",
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  onRunCode,
  onResetCode,
  onRequestHint,
  currentHintLevel = 1,
  isExecuting = false,
  isFailed = false,
}) => {
  const [code, setCode] = useState(initialCode);
  const [lastResult, setLastResult] = useState<ExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<"console" | "variables" | "error">("console");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Sync initialCode if updated externally
  React.useEffect(() => {
    setCode(initialCode);
    setLastResult(null);
  }, [initialCode]);

  const handleRun = () => {
    sound.playRun();
    const result = onRunCode(code);
    setLastResult(result);
    if (result.success) {
      sound.playSuccess();
      setActiveTab("console");
    } else {
      sound.playError();
      setActiveTab("error");
    }
  };

  // Global shortcut handler for Ctrl+R / Cmd+R
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "r" || e.key === "R")) {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [code, onRunCode]);

  const handleInsertKey = (keyText: string) => {
    sound.playKeyClick();
    const textarea = textareaRef.current;
    if (!textarea) {
      setCode((prev) => prev + keyText);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = code.substring(start, end);

    // Auto-pair insertion for brackets and quotes
    const pairMap: Record<string, [string, string]> = {
      "(": ["(", ")"],
      '"': ['"', '"'],
      "'": ["'", "'"],
      "[": ["[", "]"],
      "{": ["{", "}"],
    };

    if (pairMap[keyText]) {
      const [open, close] = pairMap[keyText];
      const newCode = code.substring(0, start) + open + selectedText + close + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 1, end + 1);
      }, 0);
      return;
    }

    const newCode = code.substring(0, start) + keyText + code.substring(end);
    setCode(newCode);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + keyText.length, start + keyText.length);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    sound.playKeyClick();

    // 1. Run shortcuts: Ctrl+R / Cmd+R & Ctrl+Enter / Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && (e.key === "r" || e.key === "R" || e.key === "Enter")) {
      e.preventDefault();
      handleRun();
      return;
    }

    // 2. Tab key indentation
    if (e.key === "Tab") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 4, start + 4);
      }, 0);
      return;
    }

    // 3. Auto-Closing Pairs for '(', '"', '\'', '[', '{'
    const openPairs: Record<string, string> = {
      "(": ")",
      '"': '"',
      "'": "'",
      "[": "]",
      "{": "}",
    };

    if (openPairs[e.key]) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const openChar = e.key;
      const closeChar = openPairs[e.key];

      // Overtype if cursor is right before identical quote or parenthesis
      if (start === end && (openChar === '"' || openChar === "'") && code[start] === openChar) {
        e.preventDefault();
        textarea.setSelectionRange(start + 1, start + 1);
        return;
      }

      e.preventDefault();
      const selectedText = code.substring(start, end);
      const newCode = code.substring(0, start) + openChar + selectedText + closeChar + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 1, end + 1);
      }, 0);
      return;
    }

    // 4. Overtype closing characters ')', ']', '}'
    if (e.key === ")" || e.key === "]" || e.key === "}") {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start === end && code[start] === e.key) {
        e.preventDefault();
        textarea.setSelectionRange(start + 1, start + 1);
        return;
      }
    }

    // 5. Smart Backspace: delete matching pair if cursor is in between
    if (e.key === "Backspace") {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start === end && start > 0) {
        const prevChar = code[start - 1];
        const nextChar = code[start];
        const isPair =
          (prevChar === "(" && nextChar === ")") ||
          (prevChar === '"' && nextChar === '"') ||
          (prevChar === "'" && nextChar === "'") ||
          (prevChar === "[" && nextChar === "]") ||
          (prevChar === "{" && nextChar === "}");
        if (isPair) {
          e.preventDefault();
          const newCode = code.substring(0, start - 1) + code.substring(start + 1);
          setCode(newCode);
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start - 1, start - 1);
          }, 0);
          return;
        }
      }
    }
  };

  const lineCount = code.split("\n").length;

  return (
    <div className="flex flex-col w-full bg-slate-950/95 rounded-2xl border border-slate-800 hover:border-violet-500/40 transition-colors overflow-hidden shadow-2xl">
      {/* Editor Header & Control Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800/90">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          </div>
          <span className="text-xs font-mono text-cyan-300 font-bold tracking-wider ml-1.5 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-violet-400" />
            main.py
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="editor-hint-btn"
            onClick={onRequestHint}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-amber-300 bg-amber-950/60 hover:bg-amber-900/70 border border-amber-500/50 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(245,158,11,0.25)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Hint ({currentHintLevel}/4)</span>
          </button>

          <button
            id="editor-reset-btn"
            onClick={() => {
              setCode(initialCode);
              onResetCode();
            }}
            title="Reset code"
            className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            id="editor-run-btn"
            onClick={handleRun}
            disabled={isExecuting}
            title="Execute Python script (Ctrl+R / ⌘R)"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 font-black font-mono text-xs rounded-xl transition-all transform active:scale-95 cursor-pointer disabled:opacity-50 ${
              isFailed || (lastResult && !lastResult.success)
                ? "bg-gradient-to-r from-rose-600 via-fuchsia-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-[0_0_18px_rgba(244,63,94,0.4)] animate-pulse"
                : "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-400 hover:from-violet-500 hover:via-fuchsia-500 hover:to-cyan-300 text-white shadow-[0_0_16px_rgba(168,85,247,0.4)]"
            }`}
          >
            {isFailed || (lastResult && !lastResult.success) ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RETRY</span>
                <span className="text-[9px] px-1 py-0.2 bg-black/40 rounded text-cyan-200 font-normal hidden sm:inline">
                  Ctrl+R
                </span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>RUN</span>
                <span className="text-[9px] px-1 py-0.2 bg-black/40 rounded text-cyan-200 font-normal hidden sm:inline">
                  Ctrl+R
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Textarea with Line Numbers */}
      <div className="relative flex min-h-[160px] max-h-[260px] bg-slate-950 font-mono text-sm">
        {/* Line Numbers */}
        <div className="select-none py-3 px-2 text-right text-slate-500 bg-slate-950/90 border-r border-slate-800/80 text-xs w-9 font-semibold">
          {Array.from({ length: Math.max(lineCount, 6) }).map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          placeholder="# Write Python code here..."
          className="flex-1 py-3 px-3 bg-transparent text-cyan-200 focus:outline-none resize-none leading-6 font-mono text-xs sm:text-sm selection:bg-violet-500/40 selection:text-white overflow-auto"
        />
      </div>

      {/* Touch-Friendly Quick Symbol Keyboard Bar */}
      <div className="flex items-center gap-1.5 px-2.5 py-2 bg-slate-950/90 border-t border-slate-800/80 overflow-x-auto no-scrollbar select-none">
        <span className="text-[10px] font-mono text-violet-400 px-1 font-bold">KEYS</span>
        {QUICK_KEYS.map((k) => (
          <button
            key={k}
            onClick={() => handleInsertKey(k)}
            className="px-2.5 py-1 bg-slate-900/90 hover:bg-violet-950 active:bg-cyan-500 active:text-black border border-slate-800 hover:border-violet-500/60 text-cyan-300 rounded-lg font-mono text-xs whitespace-nowrap transition-all cursor-pointer shadow-sm"
          >
            {k}
          </button>
        ))}
      </div>

      {/* Output / Diagnostics Tabs */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-t border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("console")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === "console"
                ? "bg-violet-950/70 border border-violet-500/40 text-cyan-300 font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>Terminal ({lastResult?.output.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("variables")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === "variables"
                ? "bg-violet-950/70 border border-violet-500/40 text-cyan-300 font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Variables ({Object.keys(lastResult?.variables || {}).length})</span>
          </button>

          {lastResult?.error && (
            <button
              onClick={() => setActiveTab("error")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === "error"
                  ? "bg-rose-950/80 text-rose-300 font-bold border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.25)]"
                  : "text-rose-400 hover:text-rose-300"
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Error Detected</span>
            </button>
          )}
        </div>

        {lastResult && (
          <span className="text-[10px] text-slate-400 font-semibold">
            {lastResult.executionTimeMs}ms
          </span>
        )}
      </div>

      {/* Output Console Box */}
      <div className="p-3.5 bg-slate-950/95 font-mono text-xs min-h-[90px] max-h-[140px] overflow-y-auto border-t border-slate-900">
        {activeTab === "console" && (
          <div>
            {!lastResult ? (
              <p className="text-slate-500 italic">Click [RUN] to execute Python protocol...</p>
            ) : lastResult.output.length === 0 && !lastResult.error ? (
              <p className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Program executed successfully (no stdout produced).</span>
              </p>
            ) : (
              <div className="space-y-1">
                {lastResult.output.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-cyan-300">
                    <ChevronRight className="w-3 h-3 text-violet-400 shrink-0 mt-0.5" />
                    <span className="break-all whitespace-pre-wrap">{line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "variables" && (
          <div>
            {!lastResult || Object.keys(lastResult.variables).length === 0 ? (
              <p className="text-slate-500 italic">No variables in memory scope.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(lastResult.variables).map(([k, v]) => (
                  <div
                    key={k}
                    className="p-2 rounded-xl bg-slate-900/90 border border-violet-500/25 flex items-center justify-between shadow-sm"
                  >
                    <span className="text-amber-300 font-bold">{k}:</span>
                    <span className="text-emerald-300 truncate max-w-[140px] font-semibold">
                      {typeof v === "object" ? JSON.stringify(v) : String(v)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "error" && lastResult?.error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-200 space-y-1.5 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
            <div className="flex items-center gap-1.5 font-bold text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <span>{lastResult.error.type}</span>
            </div>
            <p className="text-xs text-rose-200">{lastResult.error.whatHappened}</p>
            <div className="text-[11px] text-amber-300 font-sans">
              <strong className="font-mono text-amber-400">Why: </strong>
              {lastResult.error.whyItHappened}
            </div>
            <div className="text-[11px] text-cyan-300 font-mono bg-slate-900/90 p-2 rounded-lg border border-violet-500/30">
              <strong className="text-cyan-400">Fix Guide: </strong>
              {lastResult.error.exampleFix}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
