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

export const BossBattlesView: React.FC = () => {
  const { player, defeatBoss, addXpAndCoins } = useGame();

  const [selectedBoss, setSelectedBoss] = useState<BossBattle>(BOSS_BATTLES[0]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [bossHp, setBossHp] = useState<number>(selectedBoss.maxHp);
  const [visualActions, setVisualActions] = useState<VisualAction[]>([]);
  const [battleWon, setBattleWon] = useState<boolean>(false);
  const [phaseFailed, setPhaseFailed] = useState<boolean>(false);
  const [failureReason, setFailureReason] = useState<string>("");
  const [phaseResetTrigger, setPhaseResetTrigger] = useState<number>(0);

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
        setPhaseFailed(false);
        setFailureReason("");
        sound.playBossHit();
        const damageAmount = Math.ceil(selectedBoss.maxHp / selectedBoss.phases.length);
        const newHp = Math.max(0, bossHp - damageAmount);
        setBossHp(newHp);

        if (currentPhaseIndex < selectedBoss.phases.length - 1) {
          setCurrentPhaseIndex((prev) => prev + 1);
        } else if (newHp <= 0 || currentPhaseIndex >= selectedBoss.phases.length - 1) {
          setBattleWon(true);
          sound.playLevelUp();
          defeatBoss(
            selectedBoss.id,
            selectedBoss.xpReward,
            selectedBoss.coinsReward,
            selectedBoss.badgeReward
          );
        }
      } else {
        sound.playError();
        setPhaseFailed(true);
        setFailureReason(
          `Attack output did not contain the required breach signature "${currentPhase.expectedOutput}". Boss shields deflected your logic.`
        );
      }
    } else {
      sound.playError();
      setPhaseFailed(true);
      setFailureReason(
        result.error?.whatHappened || "Syntax or execution error compromised your attack payload."
      );
    }

    return result;
  };

  const handleRetryPhase = () => {
    sound.playKeyClick();
    setPhaseFailed(false);
    setFailureReason("");
    setVisualActions([]);
  };

  const handleResetPhaseScaffold = () => {
    sound.playLaserAction();
    setPhaseFailed(false);
    setFailureReason("");
    setVisualActions([]);
    setPhaseResetTrigger((prev) => prev + 1);
  };

  const handleSelectBoss = (boss: BossBattle) => {
    setSelectedBoss(boss);
    setCurrentPhaseIndex(0);
    setBossHp(boss.maxHp);
    setBattleWon(false);
    setPhaseFailed(false);
    setFailureReason("");
    setVisualActions([]);
    sound.playKeyClick();
  };

  return (
    <div className="w-full px-3 sm:px-6 py-4 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold">
            <Swords className="w-4 h-4 text-rose-400" />
            <span className="bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-md text-slate-200">ANOMALY COMBAT ARENA</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono mt-1.5">
            Boss Battles // DeSuper Core Defense
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {BOSS_BATTLES.map((boss) => {
          const isSelected = boss.id === selectedBoss.id;
          const isDefeated = player.defeatedBosses.includes(boss.id);

          return (
            <div
              key={boss.id}
              onClick={() => handleSelectBoss(boss)}
              className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900 border-slate-500"
                  : "bg-slate-950 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300">
                    REQ: {boss.rankRequirement}
                  </span>
                  {isDefeated && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold bg-slate-900 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" />
                      VANQUISHED
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white font-mono">{boss.name}</h3>
                <p className="text-[11px] text-slate-300 line-clamp-2 mt-1">{boss.subtitle}</p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                <span className="text-amber-300 font-bold">+{boss.xpReward} XP</span>
                <span className="text-violet-400 font-semibold">{boss.phases.length} PHASES</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900 border border-slate-700 space-y-6">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold">
                <Skull className="w-4 h-4 text-rose-400" />
                <span className="bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-md text-slate-200">BOSS THREAT LEVEL: CRITICAL</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
                {selectedBoss.name}
              </h2>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs text-rose-300 font-bold bg-slate-900 border border-rose-500/40 px-2.5 py-0.5 rounded-lg">
                HP: {bossHp} / {selectedBoss.maxHp}
              </span>
              <span className="text-[10px] text-violet-300 block font-semibold mt-1">
                Phase {currentPhaseIndex + 1} of {selectedBoss.phases.length}
              </span>
            </div>
          </div>

          <div className="w-full h-3.5 bg-slate-950 rounded-full border border-rose-500/40 overflow-hidden p-0.5">
            <div
              className="h-full bg-rose-600 rounded-full"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-700 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>{selectedBoss.name} TRANSMISSION:</span>
          </div>
          <p className="text-xs sm:text-sm text-rose-200 font-mono italic">
            "{currentPhase.bossDialogue}"
          </p>
        </div>

        <VisualGameStage
          sceneType="core_reactor"
          visualActions={visualActions}
          levelNumber={currentPhaseIndex + 1}
          totalLevels={selectedBoss.phases.length}
          isLevelPassed={battleWon}
          missionTitle={selectedBoss.name}
        />

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-700 font-mono text-xs space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>PHASE OBJECTIVE: {currentPhase.title}</span>
          </div>
          <p className="text-slate-300">{currentPhase.goal}</p>
        </div>

        {phaseFailed && (
          <div className="p-4 rounded-2xl bg-slate-900 border-2 border-rose-500 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs sm:text-sm">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>ATTACK PARRIED // BOSS SHIELDS INTACT</span>
              </div>
              <button
                onClick={handleRetryPhase}
                className="px-2.5 py-1 bg-rose-900 hover:bg-rose-800 text-rose-200 text-[11px] font-mono rounded-lg border border-rose-500 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
            <p className="text-xs text-rose-200 font-mono bg-slate-950 p-2.5 rounded-xl border border-rose-500/30">
              {failureReason}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleRetryPhase}
                className="flex-1 py-2 px-3 bg-rose-700 hover:bg-rose-600 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RETRY ATTACK</span>
              </button>
              <button
                onClick={handleResetPhaseScaffold}
                className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-cyan-400" />
                <span>Reset Phase Code</span>
              </button>
            </div>
          </div>
        )}

        <CodeEditor
          key={`${selectedBoss.id}-p${currentPhaseIndex}-${phaseResetTrigger}`}
          initialCode={currentPhase.buggyCode}
          onRunCode={handleRunBossCode}
          onResetCode={() => {
            setVisualActions([]);
            setPhaseFailed(false);
          }}
          onRequestHint={() => {
            sound.playKeyClick();
          }}
          currentHintLevel={1}
          isFailed={phaseFailed}
        />

        {battleWon && (
          <div className="p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-black text-white font-mono">
              {selectedBoss.name} ANNIHILATED!
            </h3>
            <p className="text-xs text-emerald-200 font-mono">
              You defeated the anomaly and restored sector stability. Badge Unlocked:{" "}
              <strong className="text-white bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">{selectedBoss.badgeReward}</strong>
            </p>
            <div className="flex items-center justify-center gap-4 text-xs font-mono font-bold text-emerald-300 pt-1">
              <span className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700">+{selectedBoss.xpReward} XP</span>
              <span className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700 text-amber-300">+{selectedBoss.coinsReward} Coins</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
