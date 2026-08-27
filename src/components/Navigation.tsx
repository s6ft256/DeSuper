import React from "react";
import { useGame } from "../context/GameContext";
import { useAuth } from "../context/AuthContext";
import { ViewTab } from "../types";
import {
  Compass,
  GitFork,
  Gamepad2,
  User,
  Volume2,
  VolumeX,
  LogOut,
  Coins,
  MessageSquare,
  Settings,
  Trophy,
  ShoppingBag,
  Award,
  Star,
  Users,
  Gem,
  Bell,
  Shield,
} from "lucide-react";
import { RANKS } from "../data/missions";

interface NavigationProps {
  onToggleChat: () => void;
  onToggleSettings?: () => void;
  onToggleAchievements?: () => void;
  onToggleLeaderboard?: () => void;
  onToggleShop?: () => void;
  onToggleBattlePass?: () => void;
  onToggleFriends?: () => void;
  onToggleNotifications?: () => void;
  onToggleGuilds?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onToggleChat,
  onToggleSettings,
  onToggleAchievements,
  onToggleLeaderboard,
  onToggleShop,
  onToggleBattlePass,
  onToggleFriends,
  onToggleNotifications,
  onToggleGuilds,
}) => {
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
    { id: "missions", label: "Missions", icon: <Compass className="w-4 h-4" /> },
    { id: "skills", label: "Skill Tree", icon: <GitFork className="w-4 h-4" /> },
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

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex flex-col items-end min-w-[140px]">
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

          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-amber-300 text-xs font-mono font-bold">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>{player.coins}</span>
          </div>

          {"gems" in player && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-purple-300 text-xs font-mono font-bold">
              <Gem className="w-3.5 h-3.5 text-purple-400" />
              <span>{(player as any).gems}</span>
            </div>
          )}

          {onToggleBattlePass && (
            <button
              onClick={onToggleBattlePass}
              title="Battle Pass"
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-purple-300 cursor-pointer relative"
            >
              <Star className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse" />
            </button>
          )}

          {onToggleFriends && (
            <button
              onClick={onToggleFriends}
              title="Friends"
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-green-300 cursor-pointer"
            >
              <Users className="w-4 h-4" />
            </button>
          )}

          {onToggleNotifications && (
            <button
              onClick={onToggleNotifications}
              title="Notifications"
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-300 cursor-pointer relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            </button>
          )}

          {onToggleGuilds && (
            <button
              onClick={onToggleGuilds}
              title="Guilds"
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-yellow-300 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}

          {onToggleShop && (
            <button
              onClick={onToggleShop}
              title="Shop"
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-300 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}

          {onToggleAchievements && (
            <button
              onClick={onToggleAchievements}
              title="Achievements"
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-300 cursor-pointer"
            >
              <Award className="w-4 h-4" />
            </button>
          )}

          {onToggleLeaderboard && (
            <button
              onClick={onToggleLeaderboard}
              title="Leaderboard"
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-300 cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
            </button>
          )}

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

          <button
            onClick={onToggleChat}
            title="Chat with Eli-v0.1"
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
          </button>

          {onToggleSettings && (
            <button
              onClick={onToggleSettings}
              title="Settings"
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

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
