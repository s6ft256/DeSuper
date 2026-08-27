import React, { useState } from "react";
import { AccessibleModal } from "./ui/AccessibleModal";
import { ProgressBar, Badge } from "./ui";
import { useGame } from "../context/GameContext";
import { useToast } from "./ui/Toast";

interface BattlePassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BattlePassTier {
  level: number;
  xpRequired: number;
  freeReward: { type: "coins" | "xp" | "item" | "gems"; amount: number; name: string; icon: string };
  premiumReward: { type: "coins" | "xp" | "item" | "gems"; amount: number; name: string; icon: string };
}

const generateBattlePassTiers = (): BattlePassTier[] => {
  return Array.from({ length: 30 }, (_, i) => {
    const level = i + 1;
    const xpRequired = level * 500;
    const isMilestone = level % 5 === 0;

    const freeReward: BattlePassTier["freeReward"] =
      level % 10 === 0
        ? { type: "gems", amount: 25, name: "25 Gems", icon: "💎" }
        : level % 5 === 0
        ? { type: "coins", amount: 200, name: "200 Coins", icon: "🪙" }
        : { type: "coins", amount: 50 * level, name: `${50 * level} Coins`, icon: "🪙" };

    const premiumReward: BattlePassTier["premiumReward"] =
      level % 10 === 0
        ? { type: "gems", amount: 100, name: "100 Gems", icon: "💎" }
        : level % 5 === 0
        ? { type: "item", amount: 1, name: "Exclusive Skin", icon: "🎨" }
        : { type: "coins", amount: 100 * level, name: `${100 * level} Coins`, icon: "🪙" };

    return { level, xpRequired, freeReward, premiumReward };
  });
};

const battlePassTiers = generateBattlePassTiers();

export const BattlePassModal: React.FC<BattlePassModalProps> = ({ isOpen, onClose }) => {
  const { player, addXpAndCoins } = useGame();
  const { success, info } = useToast();
  const [hasPremium, setHasPremium] = useState(false);
  const [claimedTiers, setClaimedTiers] = useState<number[]>([]);

  const currentTier = battlePassTiers.find((t) => player.xp < t.xpRequired) || battlePassTiers[battlePassTiers.length - 1];
  const currentTierIndex = battlePassTiers.indexOf(currentTier);
  const xpInCurrentTier = player.xp - (currentTierIndex > 0 ? battlePassTiers[currentTierIndex - 1].xpRequired : 0);
  const xpNeededForTier = currentTier.xpRequired - (currentTierIndex > 0 ? battlePassTiers[currentTierIndex - 1].xpRequired : 0);

  const handleClaim = (tier: BattlePassTier, isPremium: boolean) => {
    if (player.xp < tier.xpRequired) {
      info("Reach the required XP to claim this reward!");
      return;
    }
    if (claimedTiers.includes(tier.level)) {
      info("Already claimed!");
      return;
    }
    if (isPremium && !hasPremium) {
      info("Upgrade to Premium to claim this reward!");
      return;
    }

    const reward = isPremium ? tier.premiumReward : tier.freeReward;
    if (reward.type === "coins") {
      addXpAndCoins(0, reward.amount);
    } else if (reward.type === "xp") {
      addXpAndCoins(reward.amount, 0);
    }

    setClaimedTiers((prev) => [...prev, tier.level]);
    success(`Claimed: ${reward.name}!`);
  };

  return (
    <AccessibleModal isOpen={isOpen} onClose={onClose} title="Battle Pass" size="xl">
      <div className="space-y-6">
        {/* Season Info */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30">
          <div>
            <h3 className="text-lg font-bold font-mono text-white">Season 1: Genesis Protocol</h3>
            <p className="text-xs text-slate-400 mt-1">Ends in 45 days</p>
          </div>
          <Badge variant="info" size="md">Season 1</Badge>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-slate-300">
              Tier {currentTier.level} / {battlePassTiers.length}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {player.xp} / {currentTier.xpRequired} XP
            </span>
          </div>
          <ProgressBar
            value={xpInCurrentTier}
            max={xpNeededForTier}
            color="purple"
            size="lg"
          />
        </div>

        {/* Premium Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <div>
              <p className="text-sm font-bold font-mono text-white">Premium Pass</p>
              <p className="text-xs text-slate-400">Unlock exclusive rewards each tier</p>
            </div>
          </div>
          <button
            onClick={() => setHasPremium(!hasPremium)}
            className={`px-4 py-2 rounded-lg border font-mono text-sm cursor-pointer transition-colors ${
              hasPremium
                ? "bg-purple-500/30 border-purple-500/50 text-purple-200"
                : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {hasPremium ? "Active" : "Upgrade"}
          </button>
        </div>

        {/* Tiers */}
        <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
          {battlePassTiers.slice(0, 10).map((tier) => {
            const isUnlocked = player.xp >= tier.xpRequired;
            const isClaimed = claimedTiers.includes(tier.level);

            return (
              <div
                key={tier.level}
                className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${
                  isUnlocked
                    ? "bg-slate-800/50 border-slate-600"
                    : "bg-slate-900/50 border-slate-800 opacity-60"
                }`}
              >
                {/* Tier Number */}
                <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center font-mono font-bold text-white flex-shrink-0">
                  {tier.level}
                </div>

                {/* Free Reward */}
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-lg">{tier.freeReward.icon}</span>
                  <div>
                    <p className="text-xs font-mono text-slate-300">{tier.freeReward.name}</p>
                    <p className="text-[10px] text-slate-500">Free</p>
                  </div>
                </div>

                {/* Premium Reward */}
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-lg">{tier.premiumReward.icon}</span>
                  <div>
                    <p className="text-xs font-mono text-purple-300">{tier.premiumReward.name}</p>
                    <p className="text-[10px] text-slate-500">Premium</p>
                  </div>
                </div>

                {/* Claim Button */}
                <button
                  onClick={() => handleClaim(tier, false)}
                  disabled={!isUnlocked || isClaimed}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-xs cursor-pointer transition-colors ${
                    isClaimed
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                      : isUnlocked
                      ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30"
                      : "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {isClaimed ? "Claimed" : isUnlocked ? "Claim" : "Locked"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </AccessibleModal>
  );
};
