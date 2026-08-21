import React, { useState } from "react";
import { Sparkles, Bot, MessageSquare, ChevronRight, Volume2 } from "lucide-react";
import { Mission, MissionHint } from "../types";
import { sound } from "../utils/audio";

interface AICompanionProps {
  mission: Mission;
  currentHintLevel: number;
  onAdvanceHint: () => void;
  playerCode?: string;
  errorMessage?: string;
}

export const AICompanion: React.FC<AICompanionProps> = ({
  mission,
  currentHintLevel,
  onAdvanceHint,
  playerCode = "",
  errorMessage = "",
}) => {
  const [isConsultingAI, setIsConsultingAI] = useState(false);
  const [aiCustomAdvice, setAiCustomAdvice] = useState<string | null>(null);

  // Current active hint based on level
  const activeHint: MissionHint = mission.hints[Math.min(currentHintLevel - 1, mission.hints.length - 1)] || {
    level: 1,
    label: "Guidance",
    text: "Review the mission objectives and write standard Python commands.",
  };

  const handleAskMentor = async () => {
    sound.playKeyClick();
    setIsConsultingAI(true);
    try {
      const res = await fetch("/api/ai/companion-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionTitle: mission.title,
          concept: mission.concept,
          playerCode,
          errorMessage,
          hintLevel: currentHintLevel,
        }),
      });
      const data = await res.json();
      if (data && data.hint) {
        setAiCustomAdvice(data.hint);
        sound.playLaserAction();
      }
    } catch {
      setAiCustomAdvice(`[AURA-7]: Remember: ${mission.conceptExplanation}`);
    } finally {
      setIsConsultingAI(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 rounded-xl border border-cyan-500/30 p-3 sm:p-4 shadow-[0_0_20px_rgba(6,182,212,0.1)] relative overflow-hidden">
      {/* Background Cyber Ambient Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start gap-3">
        {/* Holographic Avatar */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-cyan-900 to-slate-950 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Bot className="w-7 h-7 text-cyan-300 animate-pulse" />
          </div>
          <span className="mt-1 text-[10px] font-mono text-cyan-400 font-bold tracking-wider">
            AURA-7
          </span>
          <span className="text-[8px] font-mono text-emerald-400">AI MENTOR</span>
        </div>

        {/* Dialogue Bubble */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="font-bold">TRANSMISSION // {activeHint.label.toUpperCase()}</span>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              Tier {currentHintLevel} / 4
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed">
            {aiCustomAdvice ? (
              <p className="text-cyan-200 font-mono">{aiCustomAdvice}</p>
            ) : (
              <p>{activeHint.text}</p>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleAskMentor}
              disabled={isConsultingAI}
              className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 px-2.5 py-1 rounded border border-cyan-500/40 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3" />
              <span>{isConsultingAI ? "Scanning Neural Core..." : "Deep AI Scan"}</span>
            </button>

            {currentHintLevel < 4 && (
              <button
                onClick={onAdvanceHint}
                className="flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 px-2.5 py-1 rounded border border-amber-500/40 transition-colors cursor-pointer"
              >
                <span>Stronger Hint</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
