import React from "react";
import { useGame } from "../context/GameContext";
import { useAuth } from "../context/AuthContext";
import { ViewTab } from "../types";
import {
  Map,
  Compass,
  Code,
  GitFork,
  Swords,
  FolderCode,
  Gamepad2,
  User,
  Volume2,
  VolumeX,
  LogOut,
  Zap,
  Coins,
  Sparkles,
  Flame,
} from "lucide-react";
import { RANKS } from "../data/missions";

export const Navigation: React.FC = () => {
  const { player, activeTab, setActiveTab, toggleSound } = useGame();
  const { user, signOut } = useAuth();

  const currentRankInfo = RANKS.find((r) => r.id === player.rank) || RANKS[0];

  const nextRank = RANKS.find((r) => r.numericRank === currentRankInfo.numericRank + 1);
  const currentRankXp = currentRankInfo.minXp;
  const nextRankXp = nextRank ? nextRank.minXp : currentRankInfo.minXp + 1500;
  const xpProgress = Math.min(
    100,
    Math.max(0, ((player.xp - currentRankXp) / (nextRankXp - currentRankXp)) * 100)
  );

  const navItems: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    { id: "world", label: "World Map", icon: <Map className="w-4 h-4" /> },
    { id: "arcade", label: "Racing", icon: <Flame className="w-4 h-4 text-amber-400" /> },
    { id: "missions", label: "Missions", icon: <Compass className="w-4 h-4" /> },
    { id: "playground", label: "Sandbox", icon: <Code className="w-4 h-4" /> },
    { id: "skills", label: "Skill Tree", icon: <GitFork className="w-4 h-4" /> },
    { id: "bosses", label: "Boss Battles", icon: <Swords className="w-4 h-4" /> },
    { id: "projects", label: "Projects", icon: <FolderCode className="w-4 h-4" /> },
    { id: "minigames", label: "Trivia", icon: <Gamepad2 className="w-4 h-4" /> },
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-slate-950 border-b border-slate-800 px-3 sm:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            <span className="font-mono font-black text-white text-sm tracking-wider">DS</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-extrabold text-sm sm:text-base tracking-wider font-mono">
                DE SUPER
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-slate-900 border border-slate-700 text-slate-300 font-bold">
                s6ft
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Python Coding Adventure
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex flex-col items-end min-w-[110px] sm:min-w-[160px]">
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span
                className="font-bold text-[11px] px-2 py-0.5 rounded-md border border-slate-700 text-slate-200"
                style={{
                  color: currentRankInfo.color,
                  borderColor: `${currentRankInfo.color}60`,
                  backgroundColor: `${currentRankInfo.color}15`,
                }}
              >
                RANK {currentRankInfo.numericRank}: {currentRankInfo.title}
              </span>
              <span className="text-slate-400 text-[10px] font-bold">LVL {player.level}</span>
            </div>

            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden border border-slate-700/50">
              <div
                className="h-full bg-slate-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <div className="flex justify-between w-full text-[9px] font-mono text-slate-400 mt-0.5">
              <span>{player.xp} XP</span>
              <span className="text-slate-500">{nextRank ? `${nextRank.minXp} XP` : "MAX"}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-amber-300 text-xs font-mono font-bold">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>{player.coins}</span>
          </div>

          <button
            onClick={toggleSound}
            title={player.soundEnabled ? "Mute SFX" : "Enable SFX"}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 cursor-pointer"
          >
            {player.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {user && (
            <button
              onClick={signOut}
              title="Sign out"
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-rose-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950 border-t border-slate-800 px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2.5 sm:px-4 rounded-xl cursor-pointer ${
                isActive
                  ? "text-cyan-300 bg-slate-900 border border-slate-700 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
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
