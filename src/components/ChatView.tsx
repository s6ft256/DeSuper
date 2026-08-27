import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Trash2, Sparkles, ChevronDown, Cpu, Zap } from "lucide-react";
import { fetchWithFallback } from "../utils/api";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const MODELS = [
  { id: "openrouter/free", name: "Auto (Free)", description: "Best available free model" },
  { id: "openai/gpt-oss-20b:free", name: "GPT-OSS 20B", description: "OpenAI open-weight" },
  { id: "nvidia/nemotron-nano-9b-v2:free", name: "Nemotron Nano 9B", description: "NVIDIA efficient model" },
  { id: "qwen/qwen3-30b-a3b-instruct-2507", name: "Qwen 3 30B", description: "Alibaba coding model" },
];

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Greetings, Operative. I am **Eli-v0.1**, your cyber companion and Python mentor. Ask me anything about coding, debug your logic, or request mission guidance.\n\nI'm here to help you ascend from Zero to Supreme.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
        setShowModelMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed, timestamp: Date.now() };
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
            model: selectedModel,
          }),
        },
        null
      );

      if (!error && data?.success && data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message, timestamp: Date.now() }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: error || data?.error || "Connection to the mainframe failed. Please try again.",
            timestamp: Date.now(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Neural link disrupted. Ensure the backend is running.",
          timestamp: Date.now(),
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
        content: "Memory banks cleared. I am Eli-v0.1, ready to assist. What would you like to learn?",
        timestamp: Date.now(),
      },
    ]);
  };

  const formatContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const code = part.replace(/```\w*\n?/, "").replace(/```$/, "");
        return (
          <pre key={i} className="mt-2 p-3 bg-slate-900/80 border border-slate-700 rounded-lg overflow-x-auto">
            <code className="text-xs font-mono text-cyan-300">{code}</code>
          </pre>
        );
      }
      return (
        <span key={i} className="whitespace-pre-wrap">
          {part.split(/(\*\*.*?\*\*)/g).map((seg, j) =>
            seg.startsWith("**") && seg.endsWith("**") ? (
              <strong key={j} className="text-cyan-200 font-semibold">
                {seg.slice(2, -2)}
              </strong>
            ) : (
              <span key={j}>{seg}</span>
            )
          )}
        </span>
      );
    });
  };

  const currentModel = MODELS.find((m) => m.id === selectedModel);

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-cyan-400/30 blur-lg" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold font-mono text-white tracking-wide flex items-center gap-2">
              Eli-v0.1
              <span className="px-1.5 py-0.5 text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">ONLINE</span>
            </h2>
            <p className="text-[10px] font-mono text-slate-400">Cyber Companion • Python Mentor</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-400 hover:text-rose-300 hover:border-rose-500/30 transition-all cursor-pointer"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/20"
                  : "bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot className="w-4 h-4 text-cyan-400" />
              ) : (
                <User className="w-4 h-4 text-purple-400" />
              )}
            </div>
            <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm font-mono leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-white/[0.06] border border-white/10 text-slate-200 rounded-tl-sm"
                    : "bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 text-cyan-100 rounded-tr-sm"
                }`}
              >
                {msg.role === "assistant" ? formatContent(msg.content) : msg.content}
              </div>
              <span className="text-[9px] font-mono text-slate-600 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 animate-in fade-in duration-300">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/20">
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

      <div className="px-4 py-3 border-t border-slate-800/50 bg-slate-900/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative" ref={modelMenuRef}>
            <button
              onClick={() => setShowModelMenu(!showModelMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-[10px] font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-all cursor-pointer"
            >
              <Cpu className="w-3 h-3" />
              <span>{currentModel?.name || "Select Model"}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showModelMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-xl overflow-hidden z-50">
                <div className="p-2 border-b border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Select AI Model</span>
                </div>
                {MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => { setSelectedModel(model.id); setShowModelMenu(false); }}
                    className={`w-full px-3 py-2.5 text-left hover:bg-slate-800/50 transition-colors ${
                      selectedModel === model.id ? "bg-cyan-500/10 border-l-2 border-cyan-400" : "border-l-2 border-transparent"
                    }`}
                  >
                    <div className="text-xs font-mono text-white">{model.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{model.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1" />
          <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            {messages.length - 1} messages
          </span>
        </div>
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
            className="px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 disabled:from-slate-800 disabled:to-slate-800 border border-cyan-400/30 disabled:border-slate-700 text-cyan-300 disabled:text-slate-500 rounded-xl flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
