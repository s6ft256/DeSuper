import React, { useEffect, useCallback, type RefObject } from "react";
import { sound } from "./audio";

export interface ShortcutOptions {
  onRun?: () => void;
  targetTextareaRef?: RefObject<HTMLTextAreaElement | null>;
  code?: string;
  setCode?: (newCode: string | ((prev: string) => string)) => void;
}

export const SHORTCUT_DEFINITIONS = [
  { key: "Ctrl + R / Cmd + R", desc: "Run Python Code (No Reload)" },
  { key: "Ctrl + Enter", desc: "Quick Execute / Test" },
  { key: "Alt + ( or Alt + 9", desc: "Insert ( ) Parentheses pair" },
  { key: "Alt + [", desc: "Insert [ ] Square brackets pair" },
  { key: "Alt + {", desc: "Insert { } Curly braces pair" },
  { key: 'Alt + "', desc: 'Insert " " Double quotes pair' },
  { key: "Alt + '", desc: "Insert ' ' Single quotes pair" },
  { key: "Tab", desc: "Indent 4 spaces" },
  { key: "Shift + Tab", desc: "Unindent line" },
];

/**
 * Universal helper to insert paired characters or wrap selected text in a textarea
 */
export function insertPairedChars(
  textarea: HTMLTextAreaElement,
  openChar: string,
  closeChar: string,
  code: string,
  setCode: (val: string) => void
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = code.substring(start, end);

  const newCode =
    code.substring(0, start) +
    openChar +
    selectedText +
    closeChar +
    code.substring(end);

  setCode(newCode);

  setTimeout(() => {
    textarea.focus();
    textarea.setSelectionRange(start + openChar.length, end + openChar.length);
  }, 0);
}

export function useKeyboardShortcuts({
  onRun,
  targetTextareaRef,
  code,
  setCode,
}: ShortcutOptions = {}) {
  // Global Event Listener for Ctrl+R and editor shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Intercept Ctrl+R / Cmd+R to Run Code and prevent default browser page reload
      if ((e.ctrlKey || e.metaKey) && (e.key === "r" || e.key === "R")) {
        e.preventDefault();
        e.stopPropagation();

        if (onRun) {
          onRun();
        } else {
          // Broadcast custom event so active mission view or playground can execute
          window.dispatchEvent(new CustomEvent("desuper:run_code"));
        }
        return;
      }

      // Also support Ctrl+Enter / Cmd+Enter
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();

        if (onRun) {
          onRun();
        } else {
          window.dispatchEvent(new CustomEvent("desuper:run_code"));
        }
        return;
      }

      // 2. Shortcut Keys for inserting bracket/quote pairs (Alt + combinations or Ctrl+Shift combinations)
      const textarea = targetTextareaRef?.current;
      if (textarea && code !== undefined && setCode) {
        // Alt + 9 or Alt + ( -> insert ()
        if (e.altKey && (e.key === "9" || e.key === "(")) {
          e.preventDefault();
          sound.playKeyClick();
          insertPairedChars(textarea, "(", ")", code, setCode);
          return;
        }

        // Alt + [ -> insert []
        if (e.altKey && (e.key === "[" || e.key === "]")) {
          e.preventDefault();
          sound.playKeyClick();
          insertPairedChars(textarea, "[", "]", code, setCode);
          return;
        }

        // Alt + { or Alt + Shift + [ -> insert {}
        if (e.altKey && (e.key === "{" || e.key === "}" || (e.shiftKey && e.key === "["))) {
          e.preventDefault();
          sound.playKeyClick();
          insertPairedChars(textarea, "{", "}", code, setCode);
          return;
        }

        // Alt + " or Alt + Shift + ' -> insert ""
        if (e.altKey && (e.key === '"' || (e.shiftKey && e.key === "'"))) {
          e.preventDefault();
          sound.playKeyClick();
          insertPairedChars(textarea, '"', '"', code, setCode);
          return;
        }

        // Alt + ' -> insert ''
        if (e.altKey && e.key === "'") {
          e.preventDefault();
          sound.playKeyClick();
          insertPairedChars(textarea, "'", "'", code, setCode);
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [onRun, targetTextareaRef, code, setCode]);
}
