import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Gift, Coins, Zap, Flame, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: { xp: number; coins: number; streak: number } | null;
}

export function DailyRewardModal({ isOpen, onClose, reward }: DailyRewardModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && reward) {
      setShowConfetti(true);
      sound.playSuccess();
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isOpen, reward]);

  if (!isOpen || !reward) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 text-center space-y-4 bg-gradient-to-b from-amber-500/10 to-transparent">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto">
            <Gift className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-black font-mono text-white">Daily Reward!</h2>
            <p className="text-sm text-slate-400 font-mono mt-1">
              Day {reward.streak} streak
            </p>
          </div>
        </div>

        {/* Rewards */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-lg font-bold font-mono text-cyan-300">+{reward.xp}</span>
              <p className="text-[10px] text-slate-500 font-mono">XP</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-2">
                <Coins className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-lg font-bold font-mono text-amber-300">+{reward.coins}</span>
              <p className="text-[10px] text-slate-500 font-mono">Coins</p>
            </div>
          </div>

          {/* Streak info */}
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-mono">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-slate-300">
                {reward.streak < 7 ? `${7 - reward.streak} more days for 7x bonus!` : 'Maximum streak bonus!'}
              </span>
            </div>
          </div>

          {/* Claim button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl text-amber-300 font-mono font-bold cursor-pointer transition-all"
          >
            Claim Reward
          </button>
        </div>
      </div>
    </div>
  );
}
