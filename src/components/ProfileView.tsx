import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { RANKS, MISSIONS } from "../data/missions";
import {
  User,
  Award,
  Flame,
  CheckCircle2,
  Settings,
  Sparkles,
  Zap,
  RotateCcw,
} from "lucide-react";
import { sound } from "../utils/audio";

export const ProfileView: React.FC = () => {
  const {
    player,
    dailyQuests,
    updateCustomization,
    resetGameProgress,
  } = useGame();

  const [activeTab, setActiveTab] = useState<"stats" | "certificate" | "customizer">("stats");
  const [nameInput, setNameInput] = useState(player.customization.name);

  const currentRankInfo = RANKS.find((r) => r.id === player.rank) || RANKS[0];
  const completionPercentage = Math.round((player.completedMissions.length / MISSIONS.length) * 100);

  const handleSaveName = () => {
    sound.playKeyClick();
    updateCustomization({ name: nameInput });
  };

  return (
    <div className="w-full px-3 sm:px-6 py-4 pb-24 space-y-6">
      <div className="p-5 sm:p-7 rounded-3xl bg-slate-900 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center"
            style={{
              borderColor: player.customization.suitColor,
              backgroundColor: `${player.customization.suitColor}20`,
            }}
          >
            <User className="w-9 h-9" style={{ color: player.customization.suitColor }} />
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-[10px] font-mono text-cyan-300 font-bold">
              {currentRankInfo.numericRank}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white font-mono">
                {player.customization.name}
              </h2>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-cyan-300 font-bold">
                {player.customization.badgeTitle}
              </span>
            </div>

            <p className="text-xs font-mono font-bold mt-0.5" style={{ color: currentRankInfo.color }}>
              RANK: {currentRankInfo.title} PYTHON CODER
            </p>
            <span className="text-[11px] font-mono text-slate-400">
              Level {player.level} • {player.xp} Total XP • {player.coins} Coins
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 font-mono text-amber-300">
          <Flame className="w-5 h-5 fill-current text-amber-400" />
          <div className="text-right">
            <span className="text-sm font-bold block">{player.streak} DAY STREAK</span>
            <span className="text-[9px] text-amber-300/90 font-medium">Active Protocol</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => {
            setActiveTab("stats");
            sound.playKeyClick();
          }}
          className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold cursor-pointer ${
            activeTab === "stats"
              ? "bg-slate-900 text-cyan-300 border border-slate-700"
              : "text-slate-400"
          }`}
        >
          Daily Quests & Stats
        </button>

        <button
          onClick={() => {
            setActiveTab("certificate");
            sound.playKeyClick();
          }}
          className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold cursor-pointer ${
            activeTab === "certificate"
              ? "bg-slate-900 text-cyan-300 border border-slate-700"
              : "text-slate-400"
          }`}
        >
          Rank Certificate
        </button>
      </div>

      {activeTab === "stats" && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-slate-300 font-bold border-b border-slate-800 pb-2.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                ACTIVE DAILY PROTOCOLS
              </span>
              <span className="text-amber-400 bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-700">STREAK: {player.streak} DAYS</span>
            </div>

            <div className="space-y-2.5">
              {dailyQuests.map((q) => (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-2xl border font-mono text-xs flex items-center justify-between ${
                    q.completed
                      ? "bg-slate-900 border-emerald-500/40 text-emerald-300"
                      : "bg-slate-950 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${q.completed ? "bg-slate-800 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>
                      {q.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Zap className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100">{q.title}</h4>
                      <p className="text-[11px] text-slate-400">{q.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-amber-300 font-bold block">
                      +{q.xpReward} XP / +{q.coinsReward} C
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {q.currentCount} / {q.targetCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono">
              <span className="text-[10px] text-slate-400 block font-semibold">MISSIONS SOLVED</span>
              <span className="text-xl font-bold text-cyan-400 mt-1 block">
                {player.completedMissions.length} / {MISSIONS.length}
              </span>
              <span className="text-[10px] text-violet-400 font-semibold">{completionPercentage}% Mastered</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono">
              <span className="text-[10px] text-slate-400 block font-semibold">BOSS ANOMALIES</span>
              <span className="text-xl font-bold text-rose-400 mt-1 block">
                {player.defeatedBosses.length} Defeated
              </span>
              <span className="text-[10px] text-rose-400/80 font-semibold">Sector Guardians</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono">
              <span className="text-[10px] text-slate-400 block font-semibold">PROJECTS BUILT</span>
              <span className="text-xl font-bold text-emerald-400 mt-1 block">
                {player.completedProjects.length} Systems
              </span>
              <span className="text-[10px] text-emerald-400/80 font-semibold">Real-World Code</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono">
              <span className="text-[10px] text-slate-400 block font-semibold">SKILL NODES</span>
              <span className="text-xl font-bold text-amber-400 mt-1 block">
                {player.unlockedSkills.length} Unlocked
              </span>
              <span className="text-[10px] text-amber-400/80 font-semibold">Constellation Tree</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-300 font-bold block">Reset Local Game Progress</span>
              <span className="text-[10px] text-slate-500">
                Wipes all completed missions, XP, and returns to Rank 1.
              </span>
            </div>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all game progress?")) {
                  resetGameProgress();
                }
              }}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/40 rounded-xl cursor-pointer"
            >
              Reset Data
            </button>
          </div>
        </div>
      )}

      {activeTab === "certificate" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700 text-center space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 text-cyan-300 font-mono text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-4 h-4 text-slate-400" />
              <span>OFFICIAL PYTHON MASTERY CREDENTIAL</span>
              <Sparkles className="w-4 h-4 text-slate-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              DE SUPER — PYTHON CODER
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              DEVELOPED BY <strong className="text-cyan-300">s6ft</strong>
            </p>
          </div>

          <div className="py-4 border-y border-slate-700 space-y-2">
            <span className="text-xs font-mono text-slate-400">THIS CERTIFIES THAT OPERATIVE</span>
            <h2 className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
              {player.customization.name.toUpperCase()}
            </h2>
            <span className="text-xs font-mono text-slate-400">
              HAS ATTAINED OFFICIAL COMPETENCY AND RANK:
            </span>

            <div className="inline-block px-6 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 mt-2">
              <span className="text-lg sm:text-xl font-black font-mono tracking-wider text-white">
                {currentRankInfo.title} PYTHON DEVELOPER
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-400">
            <div>
              <span className="text-[10px] block">TOTAL XP</span>
              <strong className="text-cyan-300">{player.xp} XP</strong>
            </div>
            <div>
              <span className="text-[10px] block">COMPLETION</span>
              <strong className="text-emerald-300">{completionPercentage}%</strong>
            </div>
            <div>
              <span className="text-[10px] block">SECURITY CLEARANCE</span>
              <strong className="text-amber-300">TIER {currentRankInfo.numericRank} / 9</strong>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
            Verified by DeSuper Quantum Core • Cryptographic Seal #DS-{player.xp}-S6FT
          </div>
        </div>
      )}
    </div>
  );
};
