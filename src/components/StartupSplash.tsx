import React from "react";
import { Play, Terminal, Bot } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-slate-950 text-center select-none">
      <div className="relative z-10 space-y-8 max-w-md w-full">
        <div className="space-y-1">
          <span className="text-sm font-mono text-cyan-300 font-bold tracking-[0.4em] uppercase bg-slate-900 px-4 py-1 rounded-full border border-slate-700 inline-block">
            s6ft
          </span>
          <p className="text-[11px] font-mono text-slate-400 tracking-widest uppercase font-semibold mt-1">
            PRESENTS
          </p>
        </div>

        <div className="space-y-3">
          <div className="w-22 h-22 mx-auto rounded-3xl bg-slate-800 border-2 border-slate-600 flex items-center justify-center">
            <Bot className="w-12 h-12 text-slate-950" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
            DE SUPER
          </h1>

          <p className="text-xs sm:text-sm font-mono text-cyan-300 tracking-widest uppercase font-bold">
            PYTHON CODING ADVENTURE
          </p>
        </div>

        <div className="p-4.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 leading-relaxed">
          <div className="text-slate-300 font-bold flex items-center justify-center gap-1.5 mb-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>CORE STATUS: ANOMALOUS</span>
          </div>
          <p>
            The digital universe is corrupt. Learn Python programming from{" "}
            <strong className="text-cyan-300">ZERO</strong> to{" "}
            <strong className="text-amber-300">SUPREME</strong> to repair the Core.
          </p>
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4.5 bg-slate-800 hover:bg-slate-700 text-white font-black font-mono text-base rounded-2xl flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
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
