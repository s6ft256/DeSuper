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
  Flame,
  ArrowRight,
} from "lucide-react";
import { sound } from "../utils/audio";

export const MiniGamesView: React.FC = () => {
  const { addXpAndCoins, progressDailyQuest, setActiveTab } = useGame();
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
    <div className="w-full px-3 sm:px-6 py-4 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-300 font-mono text-xs font-bold">
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <span className="bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-md text-slate-200">PYTHON ARCADE SYSTEM</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono mt-1.5">
            Cyber Mini-Games
          </h1>
        </div>

        <div className="px-3.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl font-mono text-xs text-amber-300 font-bold">
          Score: {score} Correct
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-700 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white font-mono flex items-center gap-2">
              CYBER TRIVIA CHALLENGE
              <span className="text-[9px] px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-amber-300">LIVE MODE</span>
            </h2>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Test your Python knowledge across multiple categories.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playWarp();
            setActiveTab("arcade");
          }}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2 border border-slate-700"
        >
          <span>OPEN MAP</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

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
              className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 font-mono text-xs font-bold cursor-pointer ${
                isActive
                  ? "bg-slate-900 border-slate-500 text-cyan-300"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-100"
              }`}
            >
              <span className={isActive ? "text-cyan-400" : "text-slate-400"}>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {currentQ && (
        <div className="p-5 sm:p-7 rounded-3xl bg-slate-900 border border-slate-700 space-y-5">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span className="text-slate-300 font-bold uppercase bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-md">{currentQ.title}</span>
            <span className="text-cyan-400 font-semibold">
              Question {currentQuestionIndex + 1} / {categoryQuestions.length}
            </span>
          </div>

          <h3 className="text-base font-bold text-white font-mono">{currentQ.question}</h3>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
            <pre>{currentQ.codeSnippet}</pre>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isChosen = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnClass = "bg-slate-950 border-slate-800 text-slate-300";
              if (hasAnswered) {
                if (isCorrect) {
                  btnClass = "bg-slate-900 border-emerald-500 text-emerald-300";
                } else if (isChosen) {
                  btnClass = "bg-slate-900 border-rose-500 text-rose-300";
                } else {
                  btnClass = "bg-slate-950 border-slate-800 text-slate-600";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`p-4 rounded-2xl border font-mono text-xs text-left flex items-start gap-3 cursor-pointer ${btnClass}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-violet-300 border border-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 pt-0.5">{opt}</span>
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div className="p-4.5 rounded-2xl bg-slate-950 border border-slate-700 space-y-3">
              <div className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                ANALYSIS:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentQ.explanation}
              </p>

              <button
                onClick={handleNextQuestion}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-black font-mono text-xs rounded-xl cursor-pointer border border-slate-700"
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
