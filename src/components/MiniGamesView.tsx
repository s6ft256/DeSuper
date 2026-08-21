import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { MINI_GAME_QUESTIONS } from "../data/miniGames";
import { MiniGameQuestion } from "../types";
import {
  Gamepad2,
  Bug,
  Zap,
  Gauge,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { sound } from "../utils/audio";
import confetti from "canvas-confetti";

export const MiniGamesView: React.FC = () => {
  const { addXpAndCoins, progressDailyQuest } = useGame();
  const [activeCategory, setActiveCategory] = useState<MiniGameQuestion["type"]>("bug_hunter");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const categoryQuestions = MINI_GAME_QUESTIONS.filter((q) => q.type === activeCategory);
  const currentQ = categoryQuestions[currentQuestionIndex] || categoryQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      sound.playSuccess();
      setScore((prev) => prev + 1);
      addXpAndCoins(75, 40);
      progressDailyQuest("boss", 1);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#06b6d4", "#10b981"],
        });
      } catch {}
    } else {
      sound.playError();
    }
  };

  const handleNextQuestion = () => {
    sound.playKeyClick();
    setSelectedOption(null);
    setHasAnswered(false);
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentQuestionIndex(0);
    }
  };

  const categories = [
    { id: "bug_hunter", label: "Bug Hunter", icon: <Bug className="w-4 h-4" /> },
    { id: "code_runner", label: "Code Runner", icon: <Zap className="w-4 h-4" /> },
    { id: "algo_arena", label: "Algorithm Arena", icon: <Gauge className="w-4 h-4" /> },
    { id: "security_lab", label: "Security Lab", icon: <ShieldCheck className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-violet-400 font-mono text-xs font-bold">
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <span className="bg-violet-950/70 border border-violet-500/40 px-2.5 py-0.5 rounded-md">PYTHON ARCADE SYSTEM</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono mt-1.5 bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-transparent">
            Cyber Mini-Games
          </h1>
        </div>

        <div className="px-3.5 py-1.5 bg-violet-950/80 border border-violet-500/40 rounded-xl font-mono text-xs text-cyan-300 font-bold shadow-[0_0_15px_rgba(139,92,246,0.2)]">
          Score: {score} Correct
        </div>
      </div>

      {/* Mode Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setCurrentQuestionIndex(0);
                setSelectedOption(null);
                setHasAnswered(false);
                sound.playKeyClick();
              }}
              className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 font-mono text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-slate-900 border-violet-400 text-cyan-300 shadow-[0_0_18px_rgba(139,92,246,0.35)]"
                  : "bg-slate-950/80 border-slate-800/80 text-slate-400 hover:text-slate-100 hover:border-slate-700"
              }`}
            >
              <span className={isActive ? "text-cyan-400" : "text-slate-400"}>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/95 border border-slate-800/90 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span className="text-violet-300 font-bold uppercase bg-violet-950/70 border border-violet-500/30 px-2.5 py-0.5 rounded-md">{currentQ.title}</span>
            <span className="text-cyan-400 font-semibold">
              Question {currentQuestionIndex + 1} / {categoryQuestions.length}
            </span>
          </div>

          <h3 className="text-base font-bold text-white font-mono">{currentQ.question}</h3>

          {/* Code Snippet Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-violet-500/25 font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto shadow-inner">
            <pre>{currentQ.codeSnippet}</pre>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isChosen = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnClass = "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-violet-500/40 hover:bg-slate-900/60";
              if (hasAnswered) {
                if (isCorrect) {
                  btnClass = "bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.35)]";
                } else if (isChosen) {
                  btnClass = "bg-rose-950/90 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]";
                } else {
                  btnClass = "bg-slate-950/40 border-slate-900 text-slate-600";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`p-4 rounded-2xl border font-mono text-xs text-left transition-all flex items-start gap-3 cursor-pointer ${btnClass}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-800/80 text-violet-300 border border-violet-500/20 flex items-center justify-center font-bold text-[11px] shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 pt-0.5">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation & Next */}
          {hasAnswered && (
            <div className="p-4.5 rounded-2xl bg-slate-950 border border-violet-500/30 space-y-3 animate-fade-in shadow-inner">
              <div className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                ANALYSIS:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentQ.explanation}
              </p>

              <button
                onClick={handleNextQuestion}
                className="w-full py-3 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:from-violet-500 hover:via-fuchsia-500 hover:to-cyan-400 text-white font-black font-mono text-xs rounded-xl shadow-[0_0_18px_rgba(168,85,247,0.35)] cursor-pointer transition-all"
              >
                NEXT CHALLENGE
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
