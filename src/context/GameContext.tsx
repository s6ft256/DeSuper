import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { PlayerState, RankId, ViewTab, DailyQuest, MapCoordinate } from "../types";
import { RANKS, MISSIONS } from "../data/missions";
import { INITIAL_DAILY_QUESTS } from "../data/miniGames";
import {
  WORLD_MAP_COORDINATES,
  getCoordinateForLevel,
} from "../data/mapCoordinates";
import { sound } from "../utils/audio";
import confetti from "canvas-confetti";
import { useAuth } from "./AuthContext";

interface GameContextType {
  player: PlayerState;
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  selectedMissionId: string;
  setSelectedMissionId: (id: string) => void;
  currentLevel: number;
  setCurrentLevel: React.Dispatch<React.SetStateAction<number>>;
  mapCoordinates: MapCoordinate[];
  dailyQuests: DailyQuest[];
  addXpAndCoins: (xp: number, coins: number, gems?: number) => void;
  completeMission: (missionId: string, xp: number, coins: number, unlockSkillId?: string) => void;
  defeatBoss: (bossId: string, xp: number, coins: number, badge: string) => void;
  completeProject: (projectId: string, xp: number, coins: number) => void;
  unlockSkill: (skillId: string) => void;
  updateCustomization: (customization: Partial<PlayerState["customization"]>) => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
  incrementStat: (statKey: keyof PlayerState["stats"], amount?: number) => void;
  progressDailyQuest: (category: DailyQuest["category"], amount?: number) => void;
  resetGameProgress: () => void;
  claimDailyReward: () => { xp: number; coins: number; streak: number } | null;
  claimStreakReward: () => { xp: number; coins: number } | null;
  isOnline: boolean;
  lastSyncTime: Date | null;
  purchaseItem: (itemId: string, price: number, currency?: "coins" | "gems") => boolean;
  getMissionStatus: (missionId: string) => "locked" | "available" | "completed";
  addGems: (amount: number) => void;
  ownedItems: string[];
}

const STORAGE_KEY = "desuper_game_save_v1";
const DAILY_REWARD_KEY = "desuper_daily_reward_date";
const STREAK_REWARD_KEY = "desuper_streak_last_claimed";

const DEFAULT_PLAYER: PlayerState = {
  name: "CyberOperative",
  level: 1,
  xp: 0,
  coins: 100,
  gems: 10,
  rank: "ZERO",
  streak: 1,
  lastPlayedDate: new Date().toISOString().split("T")[0],
  completedMissions: [],
  unlockedSkills: ["py_print"],
  defeatedBosses: [],
  completedProjects: [],
  achievements: [
    {
      id: "first_signal",
      title: "First Transmission",
      description: "Successfully booted the DeSuper Core terminal.",
      icon: "Terminal",
      unlockedAt: Date.now(),
    },
  ],
  customization: {
    name: "CyberOperative",
    avatar: "cyber_ninja",
    suitColor: "#06b6d4",
    helmetStyle: "visor_alpha",
    companionSkin: "aura_cyan",
    themeAccent: "cyan",
    badgeTitle: "REBOOT OPERATIVE",
  },
  soundEnabled: true,
  hapticsEnabled: true,
  stats: {
    codeExecutions: 0,
    errorsEncountered: 0,
    bugsPatched: 0,
    hintsUsed: 0,
    totalLinesWritten: 0,
  },
  ownedItems: [],
  battlePassXp: 0,
  battlePassTier: 0,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

// Daily reward calculation based on streak
const calculateDailyReward = (streak: number): { xp: number; coins: number } => {
  const baseXp = 50;
  const baseCoins = 25;
  const multiplier = Math.min(streak, 7); // Cap at 7x multiplier
  return {
    xp: baseXp * multiplier,
    coins: baseCoins * multiplier,
  };
};

// Streak milestone rewards
const getStreakMilestoneReward = (streak: number): { xp: number; coins: number } | null => {
  const milestones: Record<number, { xp: number; coins: number }> = {
    3: { xp: 100, coins: 50 },
    7: { xp: 300, coins: 150 },
    14: { xp: 500, coins: 300 },
    30: { xp: 1000, coins: 500 },
    60: { xp: 2000, coins: 1000 },
    100: { xp: 5000, coins: 2500 },
  };
  return milestones[streak] || null;
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<PlayerState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PLAYER;
  });

  const [activeTab, setActiveTab] = useState<ViewTab>("missions");
  const [selectedMissionId, setSelectedMissionId] = useState<string>("m1");
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(INITIAL_DAILY_QUESTS);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [ownedItems, setOwnedItems] = useState<string[]>([]);

  // Current Level state integer for map path navigation
  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    return Math.max(1, Math.min(27, player.level || 1));
  });

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Check and update daily streak on load
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastPlayed = player.lastPlayedDate;

    if (lastPlayed !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      setPlayer((prev) => ({
        ...prev,
        streak: lastPlayed === yesterdayStr ? prev.streak + 1 : 1,
        lastPlayedDate: today,
      }));
    }
  }, []);

  // Sync currentLevel when selectedMissionId changes
  useEffect(() => {
    const match = selectedMissionId.match(/^m(\d+)$/);
    if (match) {
      const lvl = parseInt(match[1], 10);
      if (!isNaN(lvl) && lvl >= 1 && lvl <= WORLD_MAP_COORDINATES.length) {
        if (lvl !== currentLevel) {
          setCurrentLevel(lvl);
        }
      }
    }
  }, [selectedMissionId]);

  // Sync with audio engine
  useEffect(() => {
    sound.setEnabled(player.soundEnabled);
  }, [player.soundEnabled]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    } catch {
      // LocalStorage error guard
    }
  }, [player]);

  const { user, syncPlayerToSupabase } = useAuth();

  // Sync to Supabase when player changes (debounced)
  useEffect(() => {
    if (!user || !isOnline) return;
    const timeout = setTimeout(() => {
      syncPlayerToSupabase();
      setLastSyncTime(new Date());
    }, 1000);
    return () => clearTimeout(timeout);
  }, [player, user, syncPlayerToSupabase, isOnline]);

  // Compute Rank based on XP
  const calculateRank = (currentXp: number): RankId => {
    let currentRank: RankId = "ZERO";
    for (const rank of RANKS) {
      if (currentXp >= rank.minXp) {
        currentRank = rank.id;
      }
    }
    return currentRank;
  };

  // Get mission status for prerequisites
  const getMissionStatus = useCallback((missionId: string): 'locked' | 'available' | 'completed' => {
    const missionIndex = MISSIONS.findIndex((m) => m.id === missionId);
    if (missionIndex === -1) return 'locked';

    // Check if completed
    if (player.completedMissions.includes(missionId)) {
      return 'completed';
    }

    // First mission is always available
    if (missionIndex === 0) {
      return 'available';
    }

    // Check if previous mission is completed
    const previousMission = MISSIONS[missionIndex - 1];
    if (previousMission && player.completedMissions.includes(previousMission.id)) {
      return 'available';
    }

    return 'locked';
  }, [player.completedMissions]);

  const addXpAndCoins = (xpAmount: number, coinsAmount: number, gemsAmount: number = 0) => {
    setPlayer((prev) => {
      const newXp = prev.xp + xpAmount;
      const newCoins = prev.coins + coinsAmount;
      const newGems = prev.gems + gemsAmount;
      const newRank = calculateRank(newXp);
      const newLevel = Math.floor(newXp / 250) + 1;

      if (newRank !== prev.rank || newLevel > prev.level) {
        sound.playLevelUp();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#06b6d4", "#10b981", "#fbbf24", "#a855f7"],
          });
        } catch {
          // Confetti fallback
        }
      }

      return {
        ...prev,
        xp: newXp,
        coins: newCoins,
        gems: newGems,
        level: newLevel,
        rank: newRank,
        battlePassXp: prev.battlePassXp + xpAmount,
      };
    });
  };

  // Claim daily login reward
  const claimDailyReward = useCallback((): { xp: number; coins: number; streak: number } | null => {
    const today = new Date().toISOString().split("T")[0];
    const lastClaimed = localStorage.getItem(DAILY_REWARD_KEY);

    if (lastClaimed === today) {
      return null; // Already claimed today
    }

    const reward = calculateDailyReward(player.streak);
    
    addXpAndCoins(reward.xp, reward.coins);
    localStorage.setItem(DAILY_REWARD_KEY, today);

    return {
      ...reward,
      streak: player.streak,
    };
  }, [player.streak]);

  // Claim streak milestone reward
  const claimStreakReward = useCallback((): { xp: number; coins: number } | null => {
    const lastClaimed = parseInt(localStorage.getItem(STREAK_REWARD_KEY) || "0");
    const currentStreak = player.streak;

    if (currentStreak <= lastClaimed) {
      return null; // No new milestone reached
    }

    const milestoneReward = getStreakMilestoneReward(currentStreak);
    if (!milestoneReward) {
      return null;
    }

    addXpAndCoins(milestoneReward.xp, milestoneReward.coins);
    localStorage.setItem(STREAK_REWARD_KEY, currentStreak.toString());

    return milestoneReward;
  }, [player.streak]);

  // Purchase item from shop
  const purchaseItem = useCallback((itemId: string, price: number, currency: "coins" | "gems" = "coins"): boolean => {
    const balance = currency === "coins" ? player.coins : player.gems;
    if (balance < price) {
      return false;
    }

    setPlayer((prev) => ({
      ...prev,
      coins: currency === "coins" ? prev.coins - price : prev.coins,
      gems: currency === "gems" ? prev.gems - price : prev.gems,
      ownedItems: [...prev.ownedItems, itemId],
    }));

    return true;
  }, [player.coins, player.gems]);

  // Add gems (for purchases, rewards, etc.)
  const addGems = useCallback((amount: number) => {
    setPlayer((prev) => ({
      ...prev,
      gems: prev.gems + amount,
    }));
  }, []);

  const completeMission = (
    missionId: string,
    xpReward: number,
    coinsReward: number,
    unlockSkillId?: string
  ) => {
    setPlayer((prev) => {
      const alreadyCompleted = prev.completedMissions.includes(missionId);
      const newCompleted = alreadyCompleted
        ? prev.completedMissions
        : [...prev.completedMissions, missionId];
      const newUnlockedSkills =
        unlockSkillId && !prev.unlockedSkills.includes(unlockSkillId)
          ? [...prev.unlockedSkills, unlockSkillId]
          : prev.unlockedSkills;

      const newXp = prev.xp + (alreadyCompleted ? Math.floor(xpReward * 0.2) : xpReward);
      const newCoins = prev.coins + (alreadyCompleted ? Math.floor(coinsReward * 0.2) : coinsReward);
      const newRank = calculateRank(newXp);
      const newLevel = Math.floor(newXp / 250) + 1;

      return {
        ...prev,
        completedMissions: newCompleted,
        unlockedSkills: newUnlockedSkills,
        xp: newXp,
        coins: newCoins,
        level: newLevel,
        rank: newRank,
      };
    });

    progressDailyQuest("code", 1);
  };

  const defeatBoss = (bossId: string, xp: number, coins: number, badge: string) => {
    setPlayer((prev) => {
      const alreadyDefeated = prev.defeatedBosses.includes(bossId);
      const newDefeated = alreadyDefeated ? prev.defeatedBosses : [...prev.defeatedBosses, bossId];
      const newAchievements = prev.achievements.some((a) => a.id === badge)
        ? prev.achievements
        : [
            ...prev.achievements,
            {
              id: badge,
              title: badge.replace(/_/g, " "),
              description: `Vanquished boss challenge: ${bossId}`,
              icon: "Trophy",
              unlockedAt: Date.now(),
            },
          ];

      return {
        ...prev,
        defeatedBosses: newDefeated,
        achievements: newAchievements,
        xp: prev.xp + (alreadyDefeated ? Math.floor(xp * 0.2) : xp),
        coins: prev.coins + (alreadyDefeated ? Math.floor(coins * 0.2) : coins),
      };
    });

    progressDailyQuest("boss", 1);
  };

  const completeProject = (projectId: string, xp: number, coins: number) => {
    setPlayer((prev) => {
      const alreadyDone = prev.completedProjects.includes(projectId);
      const newProjects = alreadyDone ? prev.completedProjects : [...prev.completedProjects, projectId];
      return {
        ...prev,
        completedProjects: newProjects,
        xp: prev.xp + (alreadyDone ? 50 : xp),
        coins: prev.coins + (alreadyDone ? 25 : coins),
      };
    });
  };

  const unlockSkill = (skillId: string) => {
    setPlayer((prev) => {
      if (prev.unlockedSkills.includes(skillId)) return prev;
      return {
        ...prev,
        unlockedSkills: [...prev.unlockedSkills, skillId],
      };
    });
  };

  const updateCustomization = (custom: Partial<PlayerState["customization"]>) => {
    setPlayer((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        ...custom,
      },
    }));
  };

  const toggleSound = () => {
    setPlayer((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const toggleHaptics = () => {
    setPlayer((prev) => ({ ...prev, hapticsEnabled: !prev.hapticsEnabled }));
  };

  const incrementStat = (statKey: keyof PlayerState["stats"], amount = 1) => {
    setPlayer((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statKey]: (prev.stats[statKey] || 0) + amount,
      },
    }));
  };

  const progressDailyQuest = (category: DailyQuest["category"], amount = 1) => {
    setDailyQuests((prev) =>
      prev.map((q) => {
        if (q.category === category && !q.completed) {
          const nextCount = q.currentCount + amount;
          const isDone = nextCount >= q.targetCount;
          if (isDone) {
            addXpAndCoins(q.xpReward, q.coinsReward);
          }
          return {
            ...q,
            currentCount: nextCount,
            completed: isDone,
          };
        }
        return q;
      })
    );
  };

  const resetGameProgress = () => {
    setPlayer(DEFAULT_PLAYER);
    setDailyQuests(INITIAL_DAILY_QUESTS);
    setSelectedMissionId("m1");
    setCurrentLevel(1);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(DAILY_REWARD_KEY);
      localStorage.removeItem(STREAK_REWARD_KEY);
    } catch {}
  };

  return (
    <GameContext.Provider
      value={{
        player,
        activeTab,
        setActiveTab,
        selectedMissionId,
        setSelectedMissionId,
        currentLevel,
        setCurrentLevel,
        mapCoordinates: WORLD_MAP_COORDINATES,
        dailyQuests,
        addXpAndCoins,
        completeMission,
        defeatBoss,
        completeProject,
        unlockSkill,
        updateCustomization,
        toggleSound,
        toggleHaptics,
        incrementStat,
        progressDailyQuest,
        resetGameProgress,
        claimDailyReward,
        claimStreakReward,
        isOnline,
        lastSyncTime,
        purchaseItem,
        getMissionStatus,
        addGems,
        ownedItems,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
}
