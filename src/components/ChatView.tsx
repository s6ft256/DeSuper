import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Trash2, Sparkles } from "lucide-react";
import { fetchWithFallback } from "../utils/api";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Greetings, Operative. I am Eli-v0.1, your cyber companion and Python mentor. Ask me anything about coding, debug your logic, or request mission guidance. I'm here to help you ascend from Zero to Supreme.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await fetchWithFallback(
        "/api/ai/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...newMessages].map((m) => ({ role: m.role, content: m.content })),
          }),
        },
        null
      );

      if (!error && data?.success && data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: error || data?.error || "Connection to the mainframe failed. Please try again.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Neural link disrupted. Ensure the backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Memory banks cleared. I am Eli-v0.1, ready to assist. What would you like to learn?",
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-cyan-400/30 blur-md" />
            <Bot className="relative w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-mono text-white tracking-wide">Eli-v0.1</h2>
            <p className="text-[10px] font-mono text-cyan-400">Eli-v0.1 — Local AI Companion</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-300 hover:border-rose-500/30 transition-colors cursor-pointer"
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                msg.role === "assistant"
                  ? "bg-cyan-500/10 border border-cyan-500/20"
                  : "bg-purple-500/10 border border-purple-500/20"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot className="w-4 h-4 text-cyan-400" />
              ) : (
                <User className="w-4 h-4 text-purple-400" />
              )}
            </div>
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-mono leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-white/[0.06] border border-white/10 text-slate-200 rounded-tl-sm"
                  : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-100 rounded-tr-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.06] border border-white/10">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-3 border-t border-slate-800">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Eli-v0.1 about Python..."
              disabled={loading}
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/15 rounded-xl text-white text-sm font-mono placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.06] transition-all disabled:opacity-50"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 disabled:bg-slate-800 border border-cyan-400/30 disabled:border-slate-700 text-cyan-300 disabled:text-slate-500 rounded-xl flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] font-mono text-slate-500 text-center mt-2 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" />
          Powered by Qwen2.5-Coder-0.5B — Running locally
        </p>
      </div>
    </div>
  );
};
