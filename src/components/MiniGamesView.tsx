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
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
            <Gamepad2 className="w-4 h-4" />
            <span>PYTHON ARCADE SYSTEM</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
            Cyber Mini-Games
          </h1>
        </div>

        <div className="px-3 py-1 bg-cyan-950/80 border border-cyan-500/40 rounded-xl font-mono text-xs text-cyan-300 font-bold">
          Score: {score} Correct
        </div>
      </div>

      {/* Mode Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-mono text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-slate-900 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="p-5 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span className="text-cyan-400 font-bold uppercase">{currentQ.title}</span>
            <span>
              Question {currentQuestionIndex + 1} / {categoryQuestions.length}
            </span>
          </div>

          <h3 className="text-base font-bold text-white font-mono">{currentQ.question}</h3>

          {/* Code Snippet Box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/20 font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto">
            <pre>{currentQ.codeSnippet}</pre>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isChosen = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnClass = "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700";
              if (hasAnswered) {
                if (isCorrect) {
                  btnClass = "bg-emerald-950 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
                } else if (isChosen) {
                  btnClass = "bg-rose-950 border-rose-500 text-rose-300";
                } else {
                  btnClass = "bg-slate-950/40 border-slate-900 text-slate-600";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`p-3.5 rounded-xl border font-mono text-xs text-left transition-all flex items-start gap-2.5 cursor-pointer ${btnClass}`}
                >
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation & Next */}
          {hasAnswered && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-fade-in">
              <div className="text-xs font-mono text-cyan-400 font-bold">ANALYSIS:</div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentQ.explanation}
              </p>

              <button
                onClick={handleNextQuestion}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black font-mono text-xs rounded-xl shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
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
