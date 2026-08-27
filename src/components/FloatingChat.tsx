import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, X, Minimize2, Maximize2, ChevronDown, Cpu, Grip, Mic, MicOff } from "lucide-react";
import { fetchWithFallback } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const MODELS = [
  { id: "openrouter/free", name: "Auto (Free)", description: "Best available free model" },
  { id: "openai/gpt-oss-20b:free", name: "GPT-OSS 20B", description: "OpenAI open-weight" },
  { id: "nvidia/nemotron-nano-9b-v2:free", name: "Nemotron Nano", description: "NVIDIA efficient" },
];

interface FloatingChatProps {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const FloatingChat: React.FC<FloatingChatProps> = ({ isOpen, onClose }) => {
  const { user, player } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Greetings, Operative. I am **Eli-v0.1**, your cyber companion. Ask me anything about Python coding.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState({ x: 80, y: 60 });
  const [size, setSize] = useState({ width: 380, height: 520 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [userSkills, setUserSkills] = useState<Array<{ skill_name: string; proficiency_level: number; skill_category: string }>>([]);
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchSkills = async () => {
      if (!user || !isOpen) return;
      try {
        const { data, error } = await supabase
          .from('ai_skills')
          .select('skill_name, proficiency_level, skill_category')
          .eq('user_id', user.id)
          .order('proficiency_level', { ascending: false })
          .limit(20);
        
        if (!error && data) {
          setUserSkills(data);
        }
      } catch (err) {
        console.warn('Failed to fetch skills:', err);
      }
    };
    
    fetchSkills();
  }, [user, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
        setShowModelMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".no-drag")) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  }, [position]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragOffset.x)),
          y: Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragOffset.y)),
        });
      }
      if (isResizing) {
        const newWidth = Math.max(300, Math.min(600, e.clientX - position.x));
        const newHeight = Math.max(300, Math.min(700, e.clientY - position.y));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, position, size.width]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed, timestamp: Date.now() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    let authHeader = "";
    try {
      const { data: { session } } = await supabase.auth.getSession();
      authHeader = session?.access_token ? `Bearer ${session.access_token}` : "";
    } catch {}

    try {
      const { data, error } = await fetchWithFallback(
        "/api/ai/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...newMessages].map((m) => ({ role: m.role, content: m.content })),
            model: selectedModel,
            auth: authHeader,
            user_data: user ? {
              display_name: player.name,
              level: player.level,
              xp: player.xp,
              rank: player.rank,
              streak: player.streak,
              completed_missions: player.completedMissions,
              unlocked_skills: player.unlockedSkills,
              defeated_bosses: player.defeatedBosses,
              completed_projects: player.completedProjects,
              stats: player.stats,
              skills: userSkills.map(s => ({
                name: s.skill_name,
                level: s.proficiency_level,
                category: s.skill_category
              })),
            } : null,
          }),
        },
        null
      );

      if (!error && data?.success && data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message, timestamp: Date.now() }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: error || data?.error || "Connection failed.", timestamp: Date.now() },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Neural link disrupted.", timestamp: Date.now() },
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

  const formatContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const code = part.replace(/```\w*\n?/, "").replace(/```$/, "");
        return (
          <pre key={i} className="mt-2 p-2 bg-slate-900/80 border border-slate-700 rounded-lg overflow-x-auto">
            <code className="text-[11px] font-mono text-cyan-300">{code}</code>
          </pre>
        );
      }
      return (
        <span key={i} className="whitespace-pre-wrap">
          {part.split(/(\*\*.*?\*\*)/g).map((seg, j) =>
            seg.startsWith("**") && seg.endsWith("**") ? (
              <strong key={j} className="text-cyan-200 font-semibold">{seg.slice(2, -2)}</strong>
            ) : (
              <span key={j}>{seg}</span>
            )
          )}
        </span>
      );
    });
  };

  const currentModel = MODELS.find((m) => m.id === selectedModel);

  if (!isOpen) return null;

  return (
    <div
      ref={chatRef}
      className="fixed z-50 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 border border-slate-700/50"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: isMinimized ? 56 : size.height,
        cursor: isDragging ? "grabbing" : "default",
      }}
    >
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" />

      <div className="relative flex flex-col h-full">
        <div
          onMouseDown={handleMouseDown}
          className="flex items-center justify-between px-3 py-2.5 border-b border-slate-800/50 cursor-grab active:cursor-grabbing select-none"
        >
          <div className="flex items-center gap-2.5">
            <Grip className="w-3.5 h-3.5 text-slate-600" />
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-cyan-400/20 blur-md" />
              <Bot className="relative w-4 h-4 text-cyan-300" />
            </div>
            <span className="text-xs font-bold font-mono text-white">Eli-v0.1</span>
            <span className="px-1.5 py-0.5 text-[8px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">ONLINE</span>
          </div>
          <div className="flex items-center gap-1 no-drag">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${
                      msg.role === "assistant"
                        ? "bg-cyan-500/20 border border-cyan-500/30"
                        : "bg-purple-500/20 border border-purple-500/30"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <Bot className="w-3 h-3 text-cyan-400" />
                    ) : (
                      <User className="w-3 h-3 text-purple-400" />
                    )}
                  </div>
                  <div className={`max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                    <div
                      className={`px-3 py-2 rounded-xl text-xs font-mono leading-relaxed ${
                        msg.role === "assistant"
                          ? "bg-white/[0.06] border border-white/10 text-slate-200 rounded-tl-sm"
                          : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-100 rounded-tr-sm"
                      }`}
                    >
                      {msg.role === "assistant" ? formatContent(msg.content) : msg.content}
                    </div>
                    <span className="text-[8px] font-mono text-slate-600 mt-0.5 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center bg-cyan-500/20 border border-cyan-500/30">
                    <Bot className="w-3 h-3 text-cyan-400" />
                  </div>
                  <div className="px-3 py-2 rounded-xl rounded-tl-sm bg-white/[0.06] border border-white/10">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-3 py-2.5 border-t border-slate-800/50 bg-slate-900/30">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="relative no-drag" ref={modelMenuRef}>
                  <button
                    onClick={() => setShowModelMenu(!showModelMenu)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700/50 text-[9px] font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-all cursor-pointer"
                  >
                    <Cpu className="w-2.5 h-2.5" />
                    <span>{currentModel?.name}</span>
                    <ChevronDown className="w-2.5 h-2.5" />
                  </button>
                  {showModelMenu && (
                    <div className="absolute bottom-full left-0 mb-1 w-48 rounded-lg bg-slate-900 border border-slate-700 shadow-xl overflow-hidden z-50">
                      {MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => { setSelectedModel(model.id); setShowModelMenu(false); }}
                          className={`w-full px-2.5 py-2 text-left hover:bg-slate-800/50 transition-colors ${
                            selectedModel === model.id ? "bg-cyan-500/10 border-l-2 border-cyan-400" : "border-l-2 border-transparent"
                          }`}
                        >
                          <div className="text-[10px] font-mono text-white">{model.name}</div>
                          <div className="text-[8px] font-mono text-slate-400">{model.description}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {speechSupported && (
                  <button
                    onClick={toggleListening}
                    className={`p-2 rounded-lg border transition-all cursor-pointer no-drag ${
                      isListening
                        ? "bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse"
                        : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30"
                    }`}
                    title={isListening ? "Stop recording" : "Voice input"}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? "Listening..." : "Ask Eli-v0.1..."}
                  disabled={loading}
                  className="flex-1 px-3 py-2 bg-white/[0.04] border border-white/15 rounded-lg text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all disabled:opacity-50 no-drag"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 disabled:bg-slate-800 border border-cyan-400/30 disabled:border-slate-700 text-cyan-300 disabled:text-slate-500 rounded-lg flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed no-drag"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}

        {!isMinimized && (
          <div
            onMouseDown={handleResizeMouseDown}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize no-drag"
            style={{ background: "linear-gradient(135deg, transparent 50%, rgba(6,182,212,0.3) 50%)" }}
          />
        )}
      </div>
    </div>
  );
};
