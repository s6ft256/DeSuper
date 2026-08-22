import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { MISSIONS, RANKS } from "../data/missions";
import { RankId, ExecutionResult, VisualAction } from "../types";
import { PythonRuntime } from "../engine/pythonEngine";
import { VisualGameStage } from "./VisualGameStage";
import { CodeEditor } from "./CodeEditor";
import { CarProgressMap } from "./CarProgressMap";
import {
  CheckCircle2,
  Lock,
  Sparkles,
  ChevronRight,
  Play,
  Award,
  BookOpen,
  Target,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  RefreshCw,
  HelpCircle,
  XCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "../utils/audio";

interface FailureDiagnostic {
  reasons: string[];
  checks: { label: string; passed: boolean; tip?: string }[];
  error?: { type: string; whatHappened: string; whyItHappened: string; exampleFix: string };
  attemptCount: number;
}

export const MissionsView: React.FC = () => {
  const {
    player,
    selectedMissionId,
    setSelectedMissionId,
    completeMission,
    addXpAndCoins,
    unlockSkill,
  } = useGame();

  const [selectedRank, setSelectedRank] = useState<RankId>(player.rank);
  const [currentHintLevel, setCurrentHintLevel] = useState<number>(1);
  const [visualActions, setVisualActions] = useState<VisualAction[]>([]);
  const [lastExecutedCode, setLastExecutedCode] = useState<string>("");
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [victoryDetails, setVictoryDetails] = useState<{
    missionTitle: string;
    xp: number;
    coins: number;
  } | null>(null);

  // Failure and Retry State
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [failureDiagnostic, setFailureDiagnostic] = useState<FailureDiagnostic | null>(null);
  const [editorCodeResetTrigger, setEditorCodeResetTrigger] = useState<number>(0);

  const isMissionUnlocked = (missionIndex: number) =>
    missionIndex === 0 || player.completedMissions.includes(MISSIONS[missionIndex - 1].id);
  const requestedMission = MISSIONS.find((m) => m.id === selectedMissionId) || MISSIONS[0];
  const requestedMissionIndex = MISSIONS.findIndex((m) => m.id === requestedMission.id);
  const firstIncompleteMission = MISSIONS.find((mission) => !player.completedMissions.includes(mission.id));
  const activeMission =
    isMissionUnlocked(requestedMissionIndex) || player.completedMissions.includes(requestedMission.id)
      ? requestedMission
      : firstIncompleteMission || MISSIONS[MISSIONS.length - 1];
  const activeMissionIndex = MISSIONS.findIndex((m) => m.id === activeMission.id);
  const isFinalMission = activeMissionIndex === MISSIONS.length - 1;

  // Execute Code in Python Sandbox
  const handleRunCode = (code: string): ExecutionResult => {
    setLastExecutedCode(code);
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);

    const result = PythonRuntime.execute(code);
    setVisualActions(result.visualActions);

    if (result.success) {
      const validation = runDetailedValidation(activeMission, result, code);
      if (validation.passed) {
        setFailureDiagnostic(null);
        completeMission(
          activeMission.id,
          activeMission.xpReward,
          activeMission.coinsReward,
          activeMission.skillIdToUnlock
        );

        if (activeMission.skillIdToUnlock) {
          unlockSkill(activeMission.skillIdToUnlock);
        }

        setVictoryDetails({
          missionTitle: activeMission.title,
          xp: activeMission.xpReward,
          coins: activeMission.coinsReward,
        });
        setShowVictoryModal(true);
        sound.playSuccess();
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#06b6d4", "#10b981", "#fbbf24"],
          });
        } catch {}
      } else {
        // Code ran with no crash, but did not satisfy mission objectives
        sound.playError();
        setFailureDiagnostic({
          reasons: validation.reasons,
          checks: validation.checks,
          attemptCount: newAttemptCount,
        });
      }
    } else {
      // Code threw syntax error or runtime error
      sound.playError();
      const reasons = [result.error?.whatHappened || "Syntax or runtime error in Python script"];
      setFailureDiagnostic({
        reasons,
        checks: [
          {
            label: "Python syntax & runtime check",
            passed: false,
            tip: result.error?.whyItHappened || "Check indentation, colons (:), and string quotation marks.",
          },
        ],
        error: result.error,
        attemptCount: newAttemptCount,
      });
    }

    return result;
  };

  const runDetailedValidation = (
    mission: (typeof MISSIONS)[0],
    result: ExecutionResult,
    code: string
  ): { passed: boolean; reasons: string[]; checks: { label: string; passed: boolean; tip?: string }[] } => {
    const rules = mission.validationRules;
    const reasons: string[] = [];
    const checks: { label: string; passed: boolean; tip?: string }[] = [];

    // 1. Check Output
    if (rules.requiredOutputIncludes && rules.requiredOutputIncludes.length > 0) {
      const allOutput = result.output.join("\n");
      for (const req of rules.requiredOutputIncludes) {
        const hasReq = allOutput.toLowerCase().includes(req.toLowerCase());
        checks.push({
          label: `Output must contain: "${req}"`,
          passed: hasReq,
          tip: hasReq ? undefined : `Make sure to print() the expected text formatted with "${req}".`,
        });
        if (!hasReq) {
          reasons.push(`Missing required console output containing "${req}"`);
        }
      }
    }

    // 2. Check Keywords
    if (rules.requiredKeywords && rules.requiredKeywords.length > 0) {
      for (const kw of rules.requiredKeywords) {
        const hasKw = code.includes(kw);
        checks.push({
          label: `Code must use keyword / construct: '${kw}'`,
          passed: hasKw,
          tip: hasKw ? undefined : `The challenge requires writing '${kw}' to solve this step.`,
        });
        if (!hasKw) {
          reasons.push(`Your solution is missing required Python keyword: '${kw}'`);
        }
      }
    }

    // 3. Check Variables
    if (rules.requiredVariableValues) {
      for (const [varName, expectedVal] of Object.entries(rules.requiredVariableValues)) {
        const actualVal = result.variables[varName];
        const match = JSON.stringify(actualVal) === JSON.stringify(expectedVal);
        checks.push({
          label: `Variable '${varName}' must equal ${JSON.stringify(expectedVal)}`,
          passed: match,
          tip: match
            ? undefined
            : `Currently '${varName}' is ${actualVal !== undefined ? JSON.stringify(actualVal) : "undefined"}. Expected: ${JSON.stringify(expectedVal)}`,
        });
        if (!match) {
          reasons.push(
            `Variable '${varName}' has value ${actualVal !== undefined ? JSON.stringify(actualVal) : "not defined"}. Expected: ${JSON.stringify(expectedVal)}`
          );
        }
      }
    }

    const passed = reasons.length === 0;
    return { passed, reasons, checks };
  };

  const handleRetryMission = () => {
    sound.playKeyClick();
    setFailureDiagnostic(null);
    setVisualActions([]);
  };

  const handleResetToStarter = () => {
    sound.playLaserAction();
    setFailureDiagnostic(null);
    setVisualActions([]);
    setEditorCodeResetTrigger((prev) => prev + 1);
  };

  const handleNextMission = () => {
    setShowVictoryModal(false);
    setFailureDiagnostic(null);
    setAttemptCount(0);
    const currentIndex = MISSIONS.findIndex((m) => m.id === activeMission.id);
    if (currentIndex < MISSIONS.length - 1) {
      const nextMission = MISSIONS[currentIndex + 1];
      setSelectedMissionId(nextMission.id);
      setSelectedRank(nextMission.rank);
      setCurrentHintLevel(1);
      setVisualActions([]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 pb-24 space-y-6">
      {/* Rank Selector Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {RANKS.map((r) => {
          const isSelected = selectedRank === r.id;
          const isRankUnlocked = player.xp >= r.minXp;
          const completedCount = MISSIONS.filter(
            (m) => m.rank === r.id && player.completedMissions.includes(m.id)
          ).length;
          const totalInRank = MISSIONS.filter((m) => m.rank === r.id).length;

          return (
            <button
              key={r.id}
              onClick={() => setSelectedRank(r.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? "bg-slate-900 border-violet-400 text-cyan-300 shadow-[0_0_15px_rgba(139,92,246,0.35)] font-bold"
                  : isRankUnlocked
                  ? "bg-slate-950/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                  : "bg-slate-950/40 border-slate-900 text-slate-600 opacity-60"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: isRankUnlocked ? r.color : "#475569", color: r.color }}
              />
              <span>
                {r.numericRank}. {r.title}
              </span>
              <span className="text-[10px] text-slate-500">
                ({completedCount}/{totalInRank})
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Mission Arena Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mission Directory List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400 px-1">
            <span className="font-bold text-violet-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              AVAILABLE MISSIONS
            </span>
            <span className="px-2 py-0.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-[10px]">
              {selectedRank} TIER
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {MISSIONS.filter((m) => m.rank === selectedRank).map((m) => {
              const missionIndex = MISSIONS.findIndex((mission) => mission.id === m.id);
              const isCurrent = m.id === activeMission.id;
              const isCompleted = player.completedMissions.includes(m.id);
              const isUnlocked = isMissionUnlocked(missionIndex);

              return (
                <button
                  type="button"
                  key={m.id}
                  disabled={!isUnlocked}
                  aria-label={isUnlocked ? `Open mission ${m.number}: ${m.title}` : `Mission ${m.number} locked until the previous mission is completed`}
                  onClick={() => {
                    if (!isUnlocked) return;
                    setSelectedMissionId(m.id);
                    setCurrentHintLevel(1);
                    setVisualActions([]);
                    setFailureDiagnostic(null);
                    setAttemptCount(0);
                    sound.playKeyClick();
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    isCurrent
                      ? "bg-gradient-to-r from-violet-950/40 via-slate-900 to-slate-900 border-violet-400 shadow-[0_0_18px_rgba(139,92,246,0.25)]"
                      : isUnlocked
                      ? "bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50 cursor-pointer"
                      : "bg-slate-950/40 border-slate-900/80 text-slate-600 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold border ${
                        isCompleted
                          ? "bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.25)]"
                          : isCurrent
                          ? "bg-violet-950/80 border-violet-500/60 text-cyan-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : `#${m.number}`}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 font-mono line-clamp-1">
                        {m.title}
                      </h4>
                      <p className="text-[10px] text-cyan-400 font-mono">{m.concept}</p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-2">
                    <span className="text-[10px] font-mono text-amber-300 font-semibold block">
                      +{m.xpReward} XP
                    </span>
                    {!isUnlocked && <Lock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Mission Active Lab */}
        <div className="lg:col-span-8 space-y-4">
          {/* Mission Briefing Card */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/90 space-y-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-violet-400 font-bold mb-1">
                  <span className="bg-violet-950/80 border border-violet-500/30 px-2 py-0.5 rounded-md text-violet-300">
                    MISSION {activeMission.number} // {activeMission.rank}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-cyan-300 border border-cyan-500/30 text-[10px]">
                    {activeMission.difficulty}
                  </span>
                  {attemptCount > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 text-[10px]">
                      ATTEMPT #{attemptCount}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-white font-mono">{activeMission.title}</h2>
              </div>

              {player.completedMissions.includes(activeMission.id) && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>RESOLVED</span>
                </div>
              )}
            </div>

            {/* Story & Concept Explanation */}
            <p className="text-xs text-slate-300 leading-relaxed">{activeMission.story}</p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-violet-500/25 text-xs text-violet-200 shadow-inner">
              <div className="flex items-center gap-1.5 font-bold font-mono text-violet-300 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>CONCEPT: {activeMission.concept}</span>
              </div>
              <p className="leading-relaxed text-slate-300">{activeMission.conceptExplanation}</p>
            </div>

            {/* Objectives */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1">
                <Target className="w-3 h-3 text-amber-400" />
                <span>MISSION OBJECTIVES:</span>
              </span>
              <ul className="space-y-1">
                {activeMission.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300 font-mono">
                    <span className="text-cyan-400">▹</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Real-time 2D Visual Stage */}
          <VisualGameStage
            sceneType={activeMission.worldSceneType}
            visualActions={visualActions}
            levelNumber={activeMission.number}
            totalLevels={MISSIONS.length}
            isLevelPassed={player.completedMissions.includes(activeMission.id)}
            missionTitle={activeMission.title}
            rankTitle={activeMission.rank}
            onAdvanceLevel={handleNextMission}
          />

          {/* Dedicated Mission Failure & Retry Banner */}
          {failureDiagnostic && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/90 via-slate-900 to-slate-950 border-2 border-rose-500/70 shadow-[0_0_30px_rgba(244,63,94,0.25)] space-y-3 animate-shake">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
                  <span>MISSION VALIDATION FAILED (ATTEMPT #{failureDiagnostic.attemptCount})</span>
                </div>
                <button
                  onClick={handleRetryMission}
                  className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-mono rounded-lg border border-rose-500/50 flex items-center gap-1 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Dismiss</span>
                </button>
              </div>

              {/* Specific checks */}
              <div className="space-y-1.5 bg-slate-950/80 p-3 rounded-xl border border-rose-500/30">
                <span className="text-[11px] font-mono text-slate-400 font-bold block mb-1">
                  OBJECTIVE EVALUATION REPORT:
                </span>
                {failureDiagnostic.checks.map((chk, idx) => (
                  <div key={idx} className="flex flex-col text-xs font-mono">
                    <div className="flex items-center gap-2">
                      {chk.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <span className={chk.passed ? "text-emerald-300" : "text-rose-300 font-bold"}>
                        {chk.label}
                      </span>
                    </div>
                    {chk.tip && (
                      <p className="text-[11px] text-amber-300/90 ml-6 mt-0.5">
                        ↳ Hint: {chk.tip}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Error details if syntax/runtime crash */}
              {failureDiagnostic.error && (
                <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-500/30 text-xs font-mono space-y-1 text-amber-200">
                  <div className="text-rose-400 font-bold">
                    {failureDiagnostic.error.type}: {failureDiagnostic.error.whatHappened}
                  </div>
                  <div className="text-cyan-300 text-[11px]">
                    Recommendation: {failureDiagnostic.error.exampleFix}
                  </div>
                </div>
              )}

              {/* Interactive Retry Action Bar */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  id="mission-retry-btn"
                  onClick={handleRetryMission}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-rose-600 via-fuchsia-600 to-violet-600 hover:from-rose-500 hover:to-violet-500 text-white font-mono font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RETRY CODE (KEEP EDITS)</span>
                </button>

                <button
                  id="mission-reset-scaffold-btn"
                  onClick={handleResetToStarter}
                  className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all"
                  title="Revert back to clean starter code scaffold"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Reset Scaffold</span>
                </button>

                <button
                  onClick={() => setCurrentHintLevel((prev) => Math.min(4, prev + 1))}
                  className="py-2.5 px-3 bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 font-mono text-xs rounded-xl border border-amber-500/40 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Level {Math.min(4, currentHintLevel + 1)} Hint</span>
                </button>
              </div>
            </div>
          )}

          {/* Python Code Editor */}
          <CodeEditor
            key={`${activeMission.id}-${editorCodeResetTrigger}`}
            initialCode={activeMission.starterCode}
            onRunCode={handleRunCode}
            onResetCode={() => {
              setVisualActions([]);
              setFailureDiagnostic(null);
            }}
            onRequestHint={() => {
              sound.playLaserAction();
              setCurrentHintLevel((prev) => (prev >= 4 ? 1 : prev + 1));
            }}
            currentHintLevel={currentHintLevel}
            isFailed={!!failureDiagnostic}
          />

          {/* Car Progress Map Screen & Visual Tracker */}
          <CarProgressMap
            currentMission={activeMission}
            currentHintLevel={currentHintLevel}
            onAdvanceHint={() => setCurrentHintLevel((prev) => Math.min(4, prev + 1))}
            playerCode={lastExecutedCode}
            errorMessage={failureDiagnostic?.reasons.join(" | ")}
            onSelectMission={(missionId) => {
              setSelectedMissionId(missionId);
              const targetMission = MISSIONS.find((m) => m.id === missionId);
              if (targetMission) {
                setSelectedRank(targetMission.rank);
              }
              setCurrentHintLevel(1);
              setVisualActions([]);
              setFailureDiagnostic(null);
            }}
          />
        </div>
      </div>

      {/* Victory Celebration Modal */}
      {showVictoryModal && victoryDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg">
          <div className="w-full max-w-md p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-violet-500/60 shadow-[0_0_50px_rgba(139,92,246,0.35)] text-center space-y-4 animate-scale-up">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-[0_0_25px_rgba(217,70,239,0.5)]">
              <Award className="w-9 h-9 text-slate-950" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full shadow-sm">
                MISSION ACCOMPLISHED
              </span>
              <h3 className="text-xl font-black text-white font-mono mt-2.5">
                {victoryDetails.missionTitle}
              </h3>
            </div>

            <div className="flex items-center justify-center gap-4 py-2">
              <div className="px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-violet-500/30 font-mono shadow-sm">
                <span className="text-[10px] text-slate-400 block font-semibold">EARNED</span>
                <span className="text-lg font-bold text-cyan-300">+{victoryDetails.xp} XP</span>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 font-mono shadow-sm">
                <span className="text-[10px] text-slate-400 block font-semibold">REWARD</span>
                <span className="text-lg font-bold text-amber-300">
                  +{victoryDetails.coins} Coins
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Your code passed every validation check. The next level is now unlocked.
            </p>

            <button
              onClick={handleNextMission}
              disabled={isFinalMission}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:from-violet-500 hover:via-fuchsia-500 hover:to-cyan-400 disabled:from-slate-700 disabled:via-slate-700 disabled:to-slate-700 disabled:cursor-default text-white font-black font-mono text-sm rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>{isFinalMission ? "ALL LEVELS COMPLETE" : "NEXT LEVEL UNLOCKED"}</span>
              {!isFinalMission && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
