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
  Palette,
  Shield,
  Car,
  Terminal,
  Trophy,
  Gauge,
  Cpu,
} from "lucide-react";
import { sound } from "../utils/audio";

const SUIT_COLORS = [
  { name: "Cyan Matrix", hex: "#06b6d4" },
  { name: "Emerald Cyber", hex: "#10b981" },
  { name: "Amber Overclock", hex: "#f59e0b" },
  { name: "Neon Violet", hex: "#8b5cf6" },
  { name: "Rose Laser", hex: "#ec4899" },
];

const VEHICLE_MODELS = [
  { id: "visor_alpha", label: "CYBER-GT 100", speed: "280 km/h", desc: "Balanced Aero Cyber Coupe" },
  { id: "visor_spectre", label: "NEO-DRIFT R2", speed: "310 km/h", desc: "Twin-Turbo Quantum Racer" },
  { id: "visor_supreme", label: "VIPER QUANTUM", speed: "340 km/h", desc: "Supreme High-Downforce Hypercar" },
];

const NEON_GLOW_PROFILES = [
  { id: "aura_cyan", label: "Cyan Photon Underglow", glow: "#06b6d4" },
  { id: "aura_gold", label: "Solar Gold Overdrive", glow: "#f59e0b" },
  { id: "aura_violet", label: "Plasma Violet Singularity", glow: "#a855f7" },
];

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
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-24 space-y-6">
      {/* Header Profile Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-violet-950/40 border border-violet-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center shadow-lg relative"
            style={{
              borderColor: player.customization.suitColor,
              backgroundColor: `${player.customization.suitColor}20`,
            }}
          >
            <Car className="w-9 h-9" style={{ color: player.customization.suitColor }} />
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-[10px] font-mono text-cyan-300 font-bold shadow-sm">
              {currentRankInfo.numericRank}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white font-mono">
                {player.customization.name}
              </h2>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-violet-950/80 border border-violet-500/40 text-cyan-300 font-bold shadow-sm">
                {player.customization.badgeTitle}
              </span>
            </div>

            <p
              className="text-xs font-mono font-bold mt-0.5"
              style={{ color: currentRankInfo.color }}
            >
              RANK: {currentRankInfo.title} PYTHON CODER
            </p>
            <span className="text-[11px] font-mono text-slate-400">
              Level {player.level} • {player.xp} Total XP • {player.coins} Coins
            </span>
          </div>
        </div>

        {/* Streak Flame */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 font-mono text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <Flame className="w-5 h-5 fill-current animate-pulse text-amber-400" />
          <div className="text-right">
            <span className="text-sm font-bold block">{player.streak} DAY STREAK</span>
            <span className="text-[9px] text-amber-300/90 font-medium">Active Protocol</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => {
            setActiveTab("stats");
            sound.playKeyClick();
          }}
          className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
            activeTab === "stats"
              ? "bg-slate-900 text-cyan-300 border border-violet-400/70 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Daily Quests & Stats
        </button>

        <button
          onClick={() => {
            setActiveTab("certificate");
            sound.playKeyClick();
          }}
          className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
            activeTab === "certificate"
              ? "bg-slate-900 text-cyan-300 border border-violet-400/70 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Rank Certificate
        </button>

        <button
          onClick={() => {
            setActiveTab("customizer");
            sound.playKeyClick();
          }}
          className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
            activeTab === "customizer"
              ? "bg-slate-900 text-cyan-300 border border-violet-400/70 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Cyber Garage & Vehicle
        </button>
      </div>

      {/* Stats & Quests Tab */}
      {activeTab === "stats" && (
        <div className="space-y-6">
          {/* Daily Quests Matrix */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/95 border border-slate-800/90 space-y-4 shadow-xl">
            <div className="flex items-center justify-between font-mono text-xs text-violet-300 font-bold border-b border-slate-800 pb-2.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                ACTIVE DAILY PROTOCOLS
              </span>
              <span className="text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-500/30">STREAK: {player.streak} DAYS</span>
            </div>

            <div className="space-y-2.5">
              {dailyQuests.map((q) => (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-2xl border font-mono text-xs flex items-center justify-between shadow-sm ${
                    q.completed
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                      : "bg-slate-950 border-slate-800/80 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        q.completed ? "bg-emerald-900 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-slate-800 text-slate-400"
                      }`}
                    >
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

          {/* Player Mastery Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-center font-mono shadow-sm">
              <span className="text-[10px] text-slate-400 block font-semibold">MISSIONS SOLVED</span>
              <span className="text-xl font-bold text-cyan-400 mt-1 block">
                {player.completedMissions.length} / {MISSIONS.length}
              </span>
              <span className="text-[10px] text-violet-400 font-semibold">{completionPercentage}% Mastered</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-center font-mono shadow-sm">
              <span className="text-[10px] text-slate-400 block font-semibold">BOSS ANOMALIES</span>
              <span className="text-xl font-bold text-rose-400 mt-1 block">
                {player.defeatedBosses.length} Defeated
              </span>
              <span className="text-[10px] text-rose-400/80 font-semibold">Sector Guardians</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-center font-mono shadow-sm">
              <span className="text-[10px] text-slate-400 block font-semibold">PROJECTS BUILT</span>
              <span className="text-xl font-bold text-emerald-400 mt-1 block">
                {player.completedProjects.length} Systems
              </span>
              <span className="text-[10px] text-emerald-400/80 font-semibold">Real-World Code</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-center font-mono shadow-sm">
              <span className="text-[10px] text-slate-400 block font-semibold">SKILL NODES</span>
              <span className="text-xl font-bold text-amber-400 mt-1 block">
                {player.unlockedSkills.length} Unlocked
              </span>
              <span className="text-[10px] text-amber-400/80 font-semibold">Constellation Tree</span>
            </div>
          </div>

          {/* Reset Progress Section */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-mono shadow-inner">
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
              className="px-3.5 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              Reset Data
            </button>
          </div>
        </div>
      )}

      {/* Rank Certificate Tab */}
      {activeTab === "certificate" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-violet-400 shadow-[0_0_50px_rgba(139,92,246,0.25)] text-center space-y-6 relative overflow-hidden">
          {/* Watermark / Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <span className="font-mono font-black text-8xl text-violet-400">DESUPER</span>
          </div>

          <div className="space-y-1 relative z-10">
            <div className="flex items-center justify-center gap-2 text-cyan-300 font-mono text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>OFFICIAL PYTHON MASTERY CREDENTIAL</span>
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-transparent">
              DE SUPER — PYTHON CODER
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              DEVELOPED BY <strong className="text-cyan-300">s6ft</strong>
            </p>
          </div>

          <div className="py-4 border-y border-violet-500/30 space-y-2 relative z-10">
            <span className="text-xs font-mono text-slate-400">THIS CERTIFIES THAT OPERATIVE</span>
            <h2 className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
              {player.customization.name.toUpperCase()}
            </h2>
            <span className="text-xs font-mono text-slate-400">
              HAS ATTAINED OFFICIAL COMPETENCY AND RANK:
            </span>

            <div className="inline-block px-6 py-2.5 rounded-2xl bg-gradient-to-r from-violet-950 via-slate-900 to-violet-950 border-2 border-violet-400 shadow-[0_0_25px_rgba(139,92,246,0.4)] mt-2">
              <span className="text-lg sm:text-xl font-black font-mono tracking-wider text-white">
                {currentRankInfo.title} PYTHON DEVELOPER
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-400 relative z-10">
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

          <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800 relative z-10">
            Verified by DeSuper Quantum Core • Cryptographic Seal #DS-{player.xp}-S6FT
          </div>
        </div>
      )}

      {/* Customizer Tab */}
      {activeTab === "customizer" && (
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/95 border border-slate-800/90 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 text-violet-300 font-mono text-xs font-bold">
            <Palette className="w-4 h-4 text-cyan-400" />
            <span className="bg-violet-950/70 border border-violet-500/30 px-2.5 py-0.5 rounded-md">
              CYBER CAR GARAGE & VEHICLE CUSTOMIZER
            </span>
          </div>

          {/* Name Customizer */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 font-bold">OPERATIVE RACER CODENAME</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={18}
                className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-violet-400 rounded-xl font-mono text-xs text-white focus:outline-none shadow-inner"
              />
              <button
                onClick={handleSaveName}
                className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold font-mono text-xs rounded-xl cursor-pointer shadow-sm transition-all"
              >
                Save
              </button>
            </div>
          </div>

          {/* Vehicle Paint Color Picker */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 font-bold">VEHICLE BODY COATING</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {SUIT_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => {
                    sound.playKeyClick();
                    updateCustomization({ suitColor: c.hex });
                  }}
                  className={`p-3.5 rounded-2xl border font-mono text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
                    player.customization.suitColor === c.hex
                      ? "bg-slate-950 border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.4)] text-white"
                      : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Chassis Models */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 font-bold">VEHICLE CHASSIS SPECIFICATION</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {VEHICLE_MODELS.map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    sound.playKeyClick();
                    updateCustomization({ helmetStyle: h.id });
                  }}
                  className={`p-3.5 rounded-2xl border font-mono text-xs text-left transition-all cursor-pointer ${
                    player.customization.helmetStyle === h.id
                      ? "bg-slate-950 border-violet-400 text-cyan-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                      : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="font-bold">{h.label}</div>
                  <div className="text-[10px] text-amber-300 mt-0.5">{h.speed} • {h.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Neon Underglow Profile */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 font-bold">
              NEON UNDERGLOW & PLASMA PROFILE
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {NEON_GLOW_PROFILES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    sound.playKeyClick();
                    updateCustomization({ companionSkin: s.id });
                  }}
                  className={`p-3.5 rounded-2xl border font-mono text-xs text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    player.customization.companionSkin === s.id
                      ? "bg-slate-950 border-violet-400 text-cyan-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                      : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: s.glow, color: s.glow }}
                  />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
