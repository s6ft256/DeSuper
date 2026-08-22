import React from "react";
import { useGame } from "../context/GameContext";
import { ViewTab } from "../types";
import {
  Map, Flame, Compass, Code, GitFork, Swords, FolderCode,
  Gamepad2, User, Volume2, VolumeX, Coins,
} from "lucide-react";
import { RANKS } from "../data/missions";

export const Navigation: React.FC = () => {
  const { player, activeTab, setActiveTab, toggleSound } = useGame();
  const currentRankInfo = RANKS.find((rank) => rank.id === player.rank) ?? RANKS[0];
  const nextRank = RANKS.find((rank) => rank.numericRank === currentRankInfo.numericRank + 1);
  const nextRankXp = nextRank?.minXp ?? currentRankInfo.minXp + 1500;
  const xpProgress = Math.min(100, Math.max(0, ((player.xp - currentRankInfo.minXp) / (nextRankXp - currentRankInfo.minXp)) * 100));

  const navItems: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    { id: "world", label: "World", icon: <Map /> },
    { id: "arcade", label: "Arcade", icon: <Flame /> },
    { id: "missions", label: "Missions", icon: <Compass /> },
    { id: "playground", label: "Sandbox", icon: <Code /> },
    { id: "skills", label: "Skills", icon: <GitFork /> },
    { id: "bosses", label: "Bosses", icon: <Swords /> },
    { id: "projects", label: "Projects", icon: <FolderCode /> },
    { id: "minigames", label: "Trivia", icon: <Gamepad2 /> },
    { id: "profile", label: "Profile", icon: <User /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 flex w-full items-center justify-between gap-4 border-b bg-background/95 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <span className="font-mono text-sm font-black tracking-wider">DS</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-mono text-sm font-extrabold tracking-wider text-foreground sm:text-base">DE SUPER</span>
              <span className="rounded-md border bg-secondary px-1.5 py-0.5 font-mono text-[10px] font-bold text-secondary-foreground">s6ft</span>
            </div>
            <p className="hidden truncate text-[10px] text-muted-foreground sm:block">Python Coding Adventure</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-5">
          <div className="hidden w-44 flex-col items-end gap-1 sm:flex">
            <div className="flex w-full items-center justify-between gap-2 font-mono text-[10px]">
              <span className="truncate font-bold" style={{ color: currentRankInfo.color }}>RANK {currentRankInfo.numericRank}: {currentRankInfo.title}</span>
              <span className="shrink-0 text-muted-foreground">LVL {player.level}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${xpProgress}%` }} />
            </div>
            <div className="flex w-full justify-between font-mono text-[9px] text-muted-foreground"><span>{player.xp} XP</span><span>{nextRank ? `${nextRank.minXp} XP` : "MAX"}</span></div>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border bg-secondary px-2.5 py-1.5 font-mono text-xs font-bold text-secondary-foreground" aria-label={`${player.coins} credits`}>
            <Coins className="size-3.5 text-primary" />{player.coins}
          </div>
          <button onClick={toggleSound} title={player.soundEnabled ? "Mute SFX" : "Enable SFX"} aria-label={player.soundEnabled ? "Mute sound effects" : "Enable sound effects"} className="rounded-lg border bg-card p-2 text-muted-foreground transition-colors hover:text-primary">
            {player.soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </button>
        </div>
      </header>

      <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-2 py-2 backdrop-blur-xl sm:px-4">
        <div className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto sm:justify-center sm:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return <button key={item.id} onClick={() => setActiveTab(item.id)} aria-current={isActive ? "page" : undefined} className={`flex min-w-[4.25rem] shrink-0 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-colors ${isActive ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "size-4" })}
              <span>{item.label}</span>
            </button>;
          })}
        </div>
      </nav>
    </>
  );
};
