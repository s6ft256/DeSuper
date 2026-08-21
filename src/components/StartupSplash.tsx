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
      <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-violet-600/15 via-fuchsia-600/15 to-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Cyber Glowing Core Animation */}
      <div className="relative z-10 space-y-8 max-w-md w-full animate-fade-in">
        {/* Developer Identity */}
        <div className="space-y-1">
          <span className="text-sm font-mono text-cyan-300 font-bold tracking-[0.4em] uppercase bg-violet-950/80 px-4 py-1 rounded-full border border-violet-500/40 shadow-sm inline-block">
            s6ft
          </span>
          <p className="text-[11px] font-mono text-slate-400 tracking-widest uppercase font-semibold mt-1">
            PRESENTS
          </p>
        </div>

        {/* Game Title & Hologram */}
        <div className="space-y-3">
          <div className="w-22 h-22 mx-auto rounded-3xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-cyan-500 border-2 border-violet-300 flex items-center justify-center shadow-[0_0_45px_rgba(168,85,247,0.5)]">
            <Bot className="w-12 h-12 text-slate-950 animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-100 to-cyan-200 font-mono tracking-tight">
            DE SUPER
          </h1>

          <p className="text-xs sm:text-sm font-mono text-cyan-300 tracking-widest uppercase font-bold">
            PYTHON CODING ADVENTURE
          </p>
        </div>

        {/* Narrative Hook */}
        <div className="p-4.5 rounded-2xl bg-slate-900/90 border border-violet-500/30 text-xs font-mono text-slate-200 leading-relaxed shadow-xl">
          <div className="text-violet-300 font-bold flex items-center justify-center gap-1.5 mb-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>CORE STATUS: ANOMALOUS</span>
          </div>
          <p>
            The digital universe is corrupt. Learn Python programming from{" "}
            <strong className="text-cyan-300">ZERO</strong> to{" "}
            <strong className="text-amber-300">SUPREME</strong> to repair the Core.
          </p>
        </div>

        {/* Launch Button */}
        <button
          onClick={handleStart}
          className="w-full py-4.5 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:from-violet-500 hover:via-fuchsia-500 hover:to-cyan-400 text-white font-black font-mono text-base rounded-2xl shadow-[0_0_35px_rgba(168,85,247,0.5)] transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current text-cyan-300" />
          <span>[ START ADVENTURE ]</span>
        </button>

        <p className="text-[10px] font-mono text-slate-400 font-medium">
          Mobile-First • Safe Python Sandbox • Developed by s6ft
        </p>
      </div>
    </div>
  );
};
