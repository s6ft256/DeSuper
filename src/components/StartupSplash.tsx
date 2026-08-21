import React from "react";
import { Play, Sparkles, Terminal, Bot } from "lucide-react";
import { sound } from "../utils/audio";

interface StartupSplashProps {
  onStart: () => void;
}

export const StartupSplash: React.FC<StartupSplashProps> = ({ onStart }) => {
  const handleStart = () => {
    sound.playLevelUp();
    onStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-slate-950 text-center select-none overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Cyber Glowing Core Animation */}
      <div className="relative z-10 space-y-8 max-w-md w-full animate-fade-in">
        {/* Developer Identity */}
        <div className="space-y-1">
          <span className="text-sm font-mono text-cyan-400 font-bold tracking-[0.4em] uppercase">
            s6ft
          </span>
          <p className="text-[11px] font-mono text-slate-500 tracking-widest uppercase">
            PRESENTS
          </p>
        </div>

        {/* Game Title & Hologram */}
        <div className="space-y-3">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-600 to-indigo-600 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.5)]">
            <Bot className="w-11 h-11 text-white animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-200 to-indigo-400 font-mono tracking-tight">
            DE SUPER
          </h1>

          <p className="text-xs sm:text-sm font-mono text-cyan-300 tracking-widest uppercase font-bold">
            PYTHON CODING ADVENTURE
          </p>
        </div>

        {/* Narrative Hook */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-slate-300 leading-relaxed shadow-lg">
          <div className="text-cyan-400 font-bold flex items-center justify-center gap-1.5 mb-1.5">
            <Terminal className="w-3.5 h-3.5" />
            <span>CORE STATUS: ANOMALOUS</span>
          </div>
          <p>
            The digital universe is corrupt. Learn Python programming from{" "}
            <strong className="text-cyan-300">ZERO</strong> to{" "}
            <strong className="text-amber-400">SUPREME</strong> to repair the Core.
          </p>
        </div>

        {/* Launch Button */}
        <button
          onClick={handleStart}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-black font-mono text-base rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>[ START ADVENTURE ]</span>
        </button>

        <p className="text-[10px] font-mono text-slate-500">
          Mobile-First • Safe Python Sandbox • Developed by s6ft
        </p>
      </div>
    </div>
  );
};
