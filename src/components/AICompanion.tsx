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
    <div className="w-full bg-slate-950/90 rounded-2xl border border-violet-500/30 p-3.5 sm:p-4.5 shadow-[0_0_25px_rgba(139,92,246,0.15)] relative overflow-hidden">
      {/* Background Cyber Ambient Glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start gap-3.5">
        {/* Holographic Avatar */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-900 via-fuchsia-900 to-slate-950 border border-violet-400/70 flex items-center justify-center shadow-[0_0_18px_rgba(168,85,247,0.4)]">
            <Bot className="w-7 h-7 text-cyan-300 animate-pulse" />
          </div>
          <span className="mt-1 text-[10px] font-mono text-violet-300 font-bold tracking-wider">
            AURA-7
          </span>
          <span className="text-[8px] font-mono text-emerald-400 font-semibold">AI MENTOR</span>
        </div>

        {/* Dialogue Bubble */}
        <div className="flex-1 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono text-violet-300">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold">TRANSMISSION // {activeHint.label.toUpperCase()}</span>
            </div>

            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-violet-950/80 border border-violet-500/40 text-cyan-300 font-semibold shadow-sm">
              Tier {currentHintLevel} / 4
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-violet-500/20 text-xs text-slate-200 font-sans leading-relaxed shadow-inner">
            {aiCustomAdvice ? (
              <p className="text-cyan-200 font-mono font-medium">{aiCustomAdvice}</p>
            ) : (
              <p>{activeHint.text}</p>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleAskMentor}
              disabled={isConsultingAI}
              className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 hover:text-white bg-violet-950/70 hover:bg-violet-900/70 px-3 py-1.5 rounded-xl border border-violet-500/50 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isConsultingAI ? "Scanning Neural Core..." : "Deep AI Scan"}</span>
            </button>

            {currentHintLevel < 4 && (
              <button
                onClick={onAdvanceHint}
                className="flex items-center gap-1 text-[11px] font-mono text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900/70 px-3 py-1.5 rounded-xl border border-amber-500/50 transition-all cursor-pointer shadow-sm"
              >
                <span>Stronger Hint</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
