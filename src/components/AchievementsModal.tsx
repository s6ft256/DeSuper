import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Award, Lock, CheckCircle, Trophy, Flame, Code, Target, Zap, Star } from 'lucide-react';
import { sound } from '../utils/audio';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Achievement definitions
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_mission',
    title: 'First Steps',
    description: 'Complete your first mission',
    icon: 'Target',
    unlocked: false,
    rarity: 'common',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'five_missions',
    title: 'Getting Started',
    description: 'Complete 5 missions',
    icon: 'Target',
    unlocked: false,
    rarity: 'common',
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'ten_missions',
    title: 'Dedicated Learner',
    description: 'Complete 10 missions',
    icon: 'Target',
    unlocked: false,
    rarity: 'common',
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'first_boss',
    title: 'Boss Slayer',
    description: 'Defeat your first boss',
    icon: 'Zap',
    unlocked: false,
    rarity: 'rare',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'Flame',
    unlocked: false,
    rarity: 'rare',
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'level_10',
    title: 'Rising Star',
    description: 'Reach level 10',
    icon: 'Star',
    unlocked: false,
    rarity: 'rare',
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'coder_rank',
    title: 'Certified Coder',
    description: 'Reach Coder rank',
    icon: 'Code',
    unlocked: false,
    rarity: 'epic',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'fifty_missions',
    title: 'Mission Master',
    description: 'Complete 50 missions',
    icon: 'Trophy',
    unlocked: false,
    rarity: 'epic',
    progress: 0,
    maxProgress: 50,
  },
  {
    id: 'all_bosses',
    title: 'Boss Collector',
    description: 'Defeat all bosses',
    icon: 'Zap',
    unlocked: false,
    rarity: 'legendary',
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'supreme_rank',
    title: 'Supreme Master',
    description: 'Reach Supreme rank',
    icon: 'Award',
    unlocked: false,
    rarity: 'legendary',
    progress: 0,
    maxProgress: 1,
  },
];

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  const { player } = useGame();
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  if (!isOpen) return null;

  // Calculate achievement progress based on player state
  const achievements = ACHIEVEMENTS.map((achievement) => {
    let progress = 0;
    let unlocked = false;

    switch (achievement.id) {
      case 'first_mission':
        progress = Math.min(player.completedMissions.length, 1);
        unlocked = player.completedMissions.length >= 1;
        break;
      case 'five_missions':
        progress = Math.min(player.completedMissions.length, 5);
        unlocked = player.completedMissions.length >= 5;
        break;
      case 'ten_missions':
        progress = Math.min(player.completedMissions.length, 10);
        unlocked = player.completedMissions.length >= 10;
        break;
      case 'first_boss':
        progress = Math.min(player.defeatedBosses.length, 1);
        unlocked = player.defeatedBosses.length >= 1;
        break;
      case 'streak_7':
        progress = Math.min(player.streak, 7);
        unlocked = player.streak >= 7;
        break;
      case 'level_10':
        progress = Math.min(player.level, 10);
        unlocked = player.level >= 10;
        break;
      case 'coder_rank':
        progress = player.rank !== 'ZERO' && player.rank !== 'NOVICE' && player.rank !== 'APPRENTICE' ? 1 : 0;
        unlocked = progress === 1;
        break;
      case 'fifty_missions':
        progress = Math.min(player.completedMissions.length, 50);
        unlocked = player.completedMissions.length >= 50;
        break;
      case 'all_bosses':
        progress = Math.min(player.defeatedBosses.length, 5);
        unlocked = player.defeatedBosses.length >= 5;
        break;
      case 'supreme_rank':
        progress = player.rank === 'SUPREME' ? 1 : 0;
        unlocked = player.rank === 'SUPREME';
        break;
      default:
        progress = 0;
        unlocked = false;
    }

    return {
      ...achievement,
      progress,
      unlocked,
      unlockedAt: unlocked ? Date.now() : undefined,
    };
  });

  const filteredAchievements = selectedRarity === 'all'
    ? achievements
    : achievements.filter((a) => a.rarity === selectedRarity);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-slate-300 border-slate-600';
      case 'rare': return 'text-cyan-300 border-cyan-500/40';
      case 'epic': return 'text-purple-300 border-purple-500/40';
      case 'legendary': return 'text-amber-300 border-amber-500/40';
      default: return 'text-slate-300 border-slate-600';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-slate-800';
      case 'rare': return 'bg-cyan-500/10';
      case 'epic': return 'bg-purple-500/10';
      case 'legendary': return 'bg-amber-500/10';
      default: return 'bg-slate-800';
    }
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'Target': return <Target className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'Star': return <Star className="w-5 h-5" />;
      case 'Code': return <Code className="w-5 h-5" />;
      case 'Trophy': return <Trophy className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80" onClick={onClose}>
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono text-white">Achievements</h2>
              <p className="text-xs text-slate-400 font-mono">{unlockedCount}/{totalCount} unlocked</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>

        {/* Rarity Filter */}
        <div className="px-6 py-3 border-b border-slate-800 flex items-center gap-2">
          {['all', 'common', 'rare', 'epic', 'legendary'].map((rarity) => (
            <button
              key={rarity}
              onClick={() => {
                setSelectedRarity(rarity);
                sound.playKeyClick();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono capitalize cursor-pointer transition-all ${
                selectedRarity === rarity
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {rarity}
            </button>
          ))}
        </div>

        {/* Achievements List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border transition-all ${
                achievement.unlocked
                  ? `${getRarityBg(achievement.rarity)} ${getRarityColor(achievement.rarity)}`
                  : 'bg-slate-800/50 border-slate-700 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  achievement.unlocked
                    ? getRarityBg(achievement.rarity)
                    : 'bg-slate-800'
                }`}>
                  {achievement.unlocked ? (
                    getIcon(achievement.icon)
                  ) : (
                    <Lock className="w-5 h-5 text-slate-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold font-mono text-sm ${
                      achievement.unlocked ? 'text-white' : 'text-slate-500'
                    }`}>
                      {achievement.title}
                    </h3>
                    {achievement.unlocked && (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{achievement.description}</p>
                  {!achievement.unlocked && achievement.maxProgress && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 transition-all"
                          style={{ width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                  )}
                </div>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                  achievement.unlocked
                    ? getRarityColor(achievement.rarity)
                    : 'text-slate-600'
                }`}>
                  {achievement.rarity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
