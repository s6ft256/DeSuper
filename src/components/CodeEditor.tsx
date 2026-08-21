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

  const handleInsertKey = (keyText: string) => {
    sound.playKeyClick();
    const textarea = textareaRef.current;
    if (!textarea) {
      setCode((prev) => prev + keyText);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newCode = code.substring(0, start) + keyText + code.substring(end);
    setCode(newCode);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + keyText.length, start + keyText.length);
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    sound.playKeyClick();
    if (e.key === "Tab") {
      e.preventDefault();
      handleInsertKey("    ");
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRun();
    }
  };

  const lineCount = code.split("\n").length;

  return (
    <div className="flex flex-col w-full bg-slate-900/90 rounded-xl border border-slate-700/60 overflow-hidden shadow-xl">
      {/* Editor Header & Control Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider ml-1">
            main.py
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="editor-hint-btn"
            onClick={onRequestHint}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-amber-300 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hint ({currentHintLevel}/4)</span>
          </button>

          <button
            id="editor-reset-btn"
            onClick={() => {
              setCode(initialCode);
              onResetCode();
            }}
            title="Reset code"
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            id="editor-run-btn"
            onClick={handleRun}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold font-mono text-xs rounded-lg shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>RUN</span>
          </button>
        </div>
      </div>

      {/* Code Textarea with Line Numbers */}
      <div className="relative flex min-h-[160px] max-h-[260px] bg-slate-950 font-mono text-sm">
        {/* Line Numbers */}
        <div className="select-none py-3 px-2 text-right text-slate-600 bg-slate-950/70 border-r border-slate-800/80 text-xs w-9">
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
          className="flex-1 py-3 px-3 bg-transparent text-cyan-200 focus:outline-none resize-none leading-6 font-mono text-xs sm:text-sm selection:bg-cyan-500/30 overflow-auto"
        />
      </div>

      {/* Touch-Friendly Quick Symbol Keyboard Bar */}
      <div className="flex items-center gap-1 px-2 py-1.5 bg-slate-950 border-t border-slate-800 overflow-x-auto no-scrollbar select-none">
        <span className="text-[10px] font-mono text-slate-500 px-1 font-bold">KEYS</span>
        {QUICK_KEYS.map((k) => (
          <button
            key={k}
            onClick={() => handleInsertKey(k)}
            className="px-2 py-1 bg-slate-800/80 hover:bg-cyan-950/80 active:bg-cyan-500 active:text-black border border-slate-700/60 hover:border-cyan-500/50 text-cyan-300 rounded font-mono text-xs whitespace-nowrap transition-colors cursor-pointer"
          >
            {k}
          </button>
        ))}
      </div>

      {/* Output / Diagnostics Tabs */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-t border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("console")}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer ${
              activeTab === "console"
                ? "bg-slate-800 text-cyan-300 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>Terminal ({lastResult?.output.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("variables")}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer ${
              activeTab === "variables"
                ? "bg-slate-800 text-cyan-300 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Variables ({Object.keys(lastResult?.variables || {}).length})</span>
          </button>

          {lastResult?.error && (
            <button
              onClick={() => setActiveTab("error")}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer ${
                activeTab === "error"
                  ? "bg-rose-950/80 text-rose-300 font-bold border border-rose-500/40"
                  : "text-rose-400 hover:text-rose-300"
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Error Detected</span>
            </button>
          )}
        </div>

        {lastResult && (
          <span className="text-[10px] text-slate-500">
            {lastResult.executionTimeMs}ms
          </span>
        )}
      </div>

      {/* Output Console Box */}
      <div className="p-3 bg-slate-950/95 font-mono text-xs min-h-[90px] max-h-[140px] overflow-y-auto border-t border-slate-900">
        {activeTab === "console" && (
          <div>
            {!lastResult ? (
              <p className="text-slate-600 italic">Click [RUN] to execute Python protocol...</p>
            ) : lastResult.output.length === 0 && !lastResult.error ? (
              <p className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Program executed successfully (no stdout produced).</span>
              </p>
            ) : (
              <div className="space-y-1">
                {lastResult.output.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-cyan-300">
                    <ChevronRight className="w-3 h-3 text-cyan-500 shrink-0 mt-0.5" />
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
              <p className="text-slate-600 italic">No variables in memory scope.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {Object.entries(lastResult.variables).map(([k, v]) => (
                  <div
                    key={k}
                    className="p-1.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <span className="text-amber-400 font-bold">{k}:</span>
                    <span className="text-emerald-300 truncate max-w-[140px]">
                      {typeof v === "object" ? JSON.stringify(v) : String(v)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "error" && lastResult?.error && (
          <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/50 text-rose-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <span>{lastResult.error.type}</span>
            </div>
            <p className="text-xs text-rose-300">{lastResult.error.whatHappened}</p>
            <div className="text-[11px] text-amber-300/90 font-sans">
              <strong className="font-mono text-amber-400">Why: </strong>
              {lastResult.error.whyItHappened}
            </div>
            <div className="text-[11px] text-cyan-300/90 font-mono bg-slate-900/80 p-1.5 rounded border border-cyan-500/30">
              <strong className="text-cyan-400">Fix Guide: </strong>
              {lastResult.error.exampleFix}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
