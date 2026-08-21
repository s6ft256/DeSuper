import React from "react";
import { useGame } from "../context/GameContext";
import { ViewTab } from "../types";
import {
  Compass,
  Code,
  GitFork,
  Swords,
  FolderCode,
  Gamepad2,
  User,
  Volume2,
  VolumeX,
  Zap,
  Coins,
  Sparkles,
} from "lucide-react";
import { RANKS } from "../data/missions";

export const Navigation: React.FC = () => {
  const { player, activeTab, setActiveTab, toggleSound } = useGame();

  const currentRankInfo = RANKS.find((r) => r.id === player.rank) || RANKS[0];

  const nextRank = RANKS.find((r) => r.numericRank === currentRankInfo.numericRank + 1);
  const currentRankXp = currentRankInfo.minXp;
  const nextRankXp = nextRank ? nextRank.minXp : currentRankInfo.minXp + 1500;
  const xpProgress = Math.min(
    100,
    Math.max(0, ((player.xp - currentRankXp) / (nextRankXp - currentRankXp)) * 100)
  );

  const navItems: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    { id: "missions", label: "Missions", icon: <Compass className="w-4 h-4" /> },
    { id: "playground", label: "Sandbox", icon: <Code className="w-4 h-4" /> },
    { id: "skills", label: "Skill Tree", icon: <GitFork className="w-4 h-4" /> },
    { id: "bosses", label: "Boss Battles", icon: <Swords className="w-4 h-4" /> },
    { id: "projects", label: "Projects", icon: <FolderCode className="w-4 h-4" /> },
    { id: "minigames", label: "Arcade", icon: <Gamepad2 className="w-4 h-4" /> },
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Top Cybernetic Status Header */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-xl border-b border-violet-500/20 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-[0_4px_20px_rgba(139,92,246,0.08)]">
        {/* Brand & Dev Signature */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-cyan-400 border border-violet-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <span className="font-mono font-black text-white text-sm tracking-wider">DS</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-extrabold text-sm sm:text-base tracking-wider font-mono bg-gradient-to-r from-white via-slate-100 to-violet-200 bg-clip-text text-transparent">
                DE SUPER
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-violet-950/80 border border-violet-500/40 text-violet-300 font-bold shadow-[0_0_8px_rgba(139,92,246,0.3)]">
                s6ft
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Python Coding Adventure
            </p>
          </div>
        </div>

        {/* Player Rank & Stats */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* XP Progression Gauge */}
          <div className="flex flex-col items-end min-w-[110px] sm:min-w-[160px]">
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span
                className="font-bold text-[11px] px-2 py-0.5 rounded-md border shadow-sm"
                style={{
                  color: currentRankInfo.color,
                  borderColor: `${currentRankInfo.color}70`,
                  backgroundColor: `${currentRankInfo.color}18`,
                  boxShadow: `0 0 10px ${currentRankInfo.color}25`,
                }}
              >
                RANK {currentRankInfo.numericRank}: {currentRankInfo.title}
              </span>
              <span className="text-slate-400 text-[10px] font-bold">LVL {player.level}</span>
            </div>

            <div className="w-full h-1.5 bg-slate-800/80 rounded-full mt-1.5 overflow-hidden border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 transition-all duration-500 shadow-[0_0_8px_rgba(217,70,239,0.5)]"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <div className="flex justify-between w-full text-[9px] font-mono text-slate-400 mt-0.5">
              <span>{player.xp} XP</span>
              <span className="text-slate-500">{nextRank ? `${nextRank.minXp} XP` : "MAX"}</span>
            </div>
          </div>

          {/* Coins / Cyber Credits */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/40 border border-amber-500/50 rounded-lg text-amber-300 text-xs font-mono font-bold shadow-[0_0_10px_rgba(245,158,11,0.15)]">
            <Coins className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{player.coins}</span>
          </div>

          {/* Audio Toggle */}
          <button
            onClick={toggleSound}
            title={player.soundEnabled ? "Mute SFX" : "Enable SFX"}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-violet-500/40 transition-all cursor-pointer shadow-sm"
          >
            {player.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </header>

      {/* Bottom Floating Mobile/Desktop Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-violet-500/20 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_30px_rgba(0,0,0,0.7)]">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2.5 sm:px-4 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "text-cyan-300 bg-gradient-to-b from-violet-950/60 to-slate-900/80 border border-violet-500/50 shadow-[0_0_16px_rgba(139,92,246,0.3)] font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <div className={isActive ? "text-cyan-400" : ""}>{item.icon}</div>
              <span className="text-[10px] font-mono mt-0.5 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
