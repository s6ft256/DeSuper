import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { BOSS_BATTLES } from "../data/bosses";
import { BossBattle, ExecutionResult, VisualAction } from "../types";
import { PythonRuntime } from "../engine/pythonEngine";
import { VisualGameStage } from "./VisualGameStage";
import { CodeEditor } from "./CodeEditor";
import {
  Swords,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Skull,
  Award,
  Sparkles,
  Zap,
  RotateCcw,
} from "lucide-react";
import { sound } from "../utils/audio";
import confetti from "canvas-confetti";

export const BossBattlesView: React.FC = () => {
  const { player, defeatBoss, addXpAndCoins } = useGame();

  const [selectedBoss, setSelectedBoss] = useState<BossBattle>(BOSS_BATTLES[0]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [bossHp, setBossHp] = useState<number>(selectedBoss.maxHp);
  const [visualActions, setVisualActions] = useState<VisualAction[]>([]);
  const [battleWon, setBattleWon] = useState<boolean>(false);

  const currentPhase = selectedBoss.phases[currentPhaseIndex] || selectedBoss.phases[0];
  const hpPercent = Math.max(0, Math.min(100, (bossHp / selectedBoss.maxHp) * 100));

  const handleRunBossCode = (code: string): ExecutionResult => {
    sound.playRun();
    const result = PythonRuntime.execute(code);
    setVisualActions(result.visualActions);

    if (result.success) {
      const outputText = result.output.join("\n");
      const hasDamage = outputText.toLowerCase().includes(currentPhase.expectedOutput.toLowerCase());

      if (hasDamage) {
        sound.playBossHit();
        const damageAmount = Math.ceil(selectedBoss.maxHp / selectedBoss.phases.length);
        const newHp = Math.max(0, bossHp - damageAmount);
        setBossHp(newHp);

        if (currentPhaseIndex < selectedBoss.phases.length - 1) {
          // Advance to next phase
          setCurrentPhaseIndex((prev) => prev + 1);
        } else if (newHp <= 0 || currentPhaseIndex >= selectedBoss.phases.length - 1) {
          // Victory!
          setBattleWon(true);
          sound.playLevelUp();
          defeatBoss(
            selectedBoss.id,
            selectedBoss.xpReward,
            selectedBoss.coinsReward,
            selectedBoss.badgeReward
          );
          try {
            confetti({
              particleCount: 120,
              spread: 90,
              origin: { y: 0.5 },
              colors: ["#ef4444", "#f59e0b", "#06b6d4"],
            });
          } catch {}
        }
      }
    } else {
      sound.playError();
    }

    return result;
  };

  const handleSelectBoss = (boss: BossBattle) => {
    setSelectedBoss(boss);
    setCurrentPhaseIndex(0);
    setBossHp(boss.maxHp);
    setBattleWon(false);
    setVisualActions([]);
    sound.playKeyClick();
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 pb-24 space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold">
            <Swords className="w-4 h-4" />
            <span>ANOMALY COMBAT ARENA</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
            Boss Battles // DeSuper Core Defense
          </h1>
        </div>
      </div>

      {/* Boss Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {BOSS_BATTLES.map((boss) => {
          const isSelected = boss.id === selectedBoss.id;
          const isDefeated = player.defeatedBosses.includes(boss.id);

          return (
            <div
              key={boss.id}
              onClick={() => handleSelectBoss(boss)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                  : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40">
                    REQ: {boss.rankRequirement}
                  </span>
                  {isDefeated && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      VANQUISHED
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white font-mono">{boss.name}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{boss.subtitle}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-amber-400 font-bold">+{boss.xpReward} XP</span>
                <span className="text-slate-500">{boss.phases.length} PHASES</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Boss Encounter Arena */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-500/40 shadow-2xl space-y-6">
        {/* Boss Status & Dynamic HP Gauge */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold">
                <Skull className="w-4 h-4 animate-bounce" />
                <span>BOSS THREAT LEVEL: CRITICAL</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
                {selectedBoss.name}
              </h2>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs text-rose-300 font-bold">
                HP: {bossHp} / {selectedBoss.maxHp}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Phase {currentPhaseIndex + 1} of {selectedBoss.phases.length}
              </span>
            </div>
          </div>

          {/* Glowing Boss Health Bar */}
          <div className="w-full h-3 bg-slate-950 rounded-full border border-rose-500/30 overflow-hidden p-0.5 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
            <div
              className="h-full bg-gradient-to-r from-rose-600 via-amber-500 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* Boss Dialogue Glitch Box */}
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400">
            <Flame className="w-3.5 h-3.5" />
            <span>{selectedBoss.name} TRANSMISSION:</span>
          </div>
          <p className="text-xs sm:text-sm text-rose-200 font-mono italic">
            "{currentPhase.bossDialogue}"
          </p>
        </div>

        {/* Visual Game Combat Stage */}
        <VisualGameStage sceneType="core_reactor" visualActions={visualActions} />

        {/* Phase Objective */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>PHASE OBJECTIVE: {currentPhase.title}</span>
          </div>
          <p className="text-slate-300">{currentPhase.goal}</p>
        </div>

        {/* Combat Code Editor */}
        <CodeEditor
          initialCode={currentPhase.buggyCode}
          onRunCode={handleRunBossCode}
          onResetCode={() => setVisualActions([])}
          onRequestHint={() => {
            sound.playKeyClick();
          }}
          currentHintLevel={1}
        />

        {/* Victory Banner */}
        {battleWon && (
          <div className="p-5 rounded-2xl bg-emerald-950/90 border-2 border-emerald-400 text-center space-y-3 shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-scale-up">
            <Award className="w-12 h-12 text-emerald-300 mx-auto" />
            <h3 className="text-xl font-black text-white font-mono">
              {selectedBoss.name} ANNIHILATED!
            </h3>
            <p className="text-xs text-emerald-200 font-mono">
              You defeated the anomaly and restored sector stability. Badge Unlocked:{" "}
              <strong>{selectedBoss.badgeReward}</strong>
            </p>
            <div className="flex items-center justify-center gap-4 text-xs font-mono font-bold text-emerald-300">
              <span>+{selectedBoss.xpReward} XP</span>
              <span>+{selectedBoss.coinsReward} Coins</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
