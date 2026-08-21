import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { MISSIONS, RANKS } from "../data/missions";
import { RankId, ExecutionResult, VisualAction } from "../types";
import { PythonRuntime } from "../engine/pythonEngine";
import { VisualGameStage } from "./VisualGameStage";
import { CodeEditor } from "./CodeEditor";
import { AICompanion } from "./AICompanion";
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
} from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "../utils/audio";

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

  const activeMission = MISSIONS.find((m) => m.id === selectedMissionId) || MISSIONS[0];

  // Execute Code in Python Sandbox
  const handleRunCode = (code: string): ExecutionResult => {
    setLastExecutedCode(code);
    const result = PythonRuntime.execute(code);
    setVisualActions(result.visualActions);

    // Validate mission completion
    if (result.success) {
      const isCompleted = validateMissionCompletion(activeMission, result, code);
      if (isCompleted) {
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
      }
    }

    return result;
  };

  const validateMissionCompletion = (
    mission: (typeof MISSIONS)[0],
    result: ExecutionResult,
    code: string
  ): boolean => {
    const rules = mission.validationRules;

    // Check required output
    if (rules.requiredOutputIncludes && rules.requiredOutputIncludes.length > 0) {
      const allOutput = result.output.join("\n");
      const hasAllOutput = rules.requiredOutputIncludes.every((req) =>
        allOutput.toLowerCase().includes(req.toLowerCase())
      );
      if (!hasAllOutput) return false;
    }

    // Check required keywords in code
    if (rules.requiredKeywords && rules.requiredKeywords.length > 0) {
      const hasAllKeywords = rules.requiredKeywords.every((kw) => code.includes(kw));
      if (!hasAllKeywords) return false;
    }

    // Check required variable values
    if (rules.requiredVariableValues) {
      for (const [varName, expectedVal] of Object.entries(rules.requiredVariableValues)) {
        if (JSON.stringify(result.variables[varName]) !== JSON.stringify(expectedVal)) {
          return false;
        }
      }
    }

    return true;
  };

  const handleNextMission = () => {
    setShowVictoryModal(false);
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? "bg-slate-900 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold"
                  : isRankUnlocked
                  ? "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200"
                  : "bg-slate-950/40 border-slate-900 text-slate-600 opacity-60"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isRankUnlocked ? r.color : "#475569" }}
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
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span className="font-bold text-cyan-400">AVAILABLE MISSIONS</span>
            <span>{selectedRank} TIER</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {MISSIONS.filter((m) => m.rank === selectedRank).map((m) => {
              const isCurrent = m.id === activeMission.id;
              const isCompleted = player.completedMissions.includes(m.id);

              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMissionId(m.id);
                    setCurrentHintLevel(1);
                    setVisualActions([]);
                    sound.playKeyClick();
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? "bg-slate-900/90 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      : "bg-slate-950/80 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold border ${
                        isCompleted
                          ? "bg-emerald-950 border-emerald-500/60 text-emerald-300"
                          : isCurrent
                          ? "bg-cyan-950 border-cyan-500/60 text-cyan-300"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : `#${m.number}`}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 font-mono line-clamp-1">
                        {m.title}
                      </h4>
                      <p className="text-[10px] text-cyan-400/80 font-mono">{m.concept}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-amber-400 font-semibold block">
                      +{m.xpReward} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Mission Active Lab */}
        <div className="lg:col-span-8 space-y-4">
          {/* Mission Briefing Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold mb-1">
                  <span>
                    MISSION {activeMission.number} // {activeMission.rank}
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                    {activeMission.difficulty}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white font-mono">{activeMission.title}</h2>
              </div>

              {player.completedMissions.includes(activeMission.id) && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>RESOLVED</span>
                </div>
              )}
            </div>

            {/* Story & Concept Explanation */}
            <p className="text-xs text-slate-300 leading-relaxed">{activeMission.story}</p>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-cyan-500/20 text-xs text-cyan-200">
              <div className="flex items-center gap-1.5 font-bold font-mono text-cyan-400 mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>CONCEPT: {activeMission.concept}</span>
              </div>
              <p className="leading-relaxed">{activeMission.conceptExplanation}</p>
            </div>

            {/* Objectives */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1">
                <Target className="w-3 h-3" />
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
          />

          {/* Python Code Editor */}
          <CodeEditor
            initialCode={activeMission.starterCode}
            onRunCode={handleRunCode}
            onResetCode={() => setVisualActions([])}
            onRequestHint={() => {
              sound.playLaserAction();
              setCurrentHintLevel((prev) => (prev >= 4 ? 1 : prev + 1));
            }}
            currentHintLevel={currentHintLevel}
          />

          {/* AI Mentor Companion Guidance */}
          <AICompanion
            mission={activeMission}
            currentHintLevel={currentHintLevel}
            onAdvanceHint={() => setCurrentHintLevel((prev) => Math.min(4, prev + 1))}
            playerCode={lastExecutedCode}
          />
        </div>
      </div>

      {/* Victory Celebration Modal */}
      {showVictoryModal && victoryDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.4)] text-center space-y-4 animate-scale-up">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              <Award className="w-9 h-9 text-slate-950" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase">
                MISSION ACCOMPLISHED
              </span>
              <h3 className="text-xl font-black text-white font-mono mt-1">
                {victoryDetails.missionTitle}
              </h3>
            </div>

            <div className="flex items-center justify-center gap-4 py-2">
              <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 font-mono">
                <span className="text-[10px] text-slate-400 block">EARNED</span>
                <span className="text-lg font-bold text-cyan-400">+{victoryDetails.xp} XP</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 font-mono">
                <span className="text-[10px] text-slate-400 block">REWARD</span>
                <span className="text-lg font-bold text-amber-400">
                  +{victoryDetails.coins} Coins
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              The DeSuper Core has accepted your code transmission. Concept mastered!
            </p>

            <button
              onClick={handleNextMission}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black font-mono text-sm rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>NEXT MISSION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
