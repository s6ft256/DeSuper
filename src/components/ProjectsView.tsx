import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { PROJECTS } from "../data/projects";
import { ProjectTemplate, ExecutionResult, VisualAction } from "../types";
import { PythonRuntime } from "../engine/pythonEngine";
import { CodeEditor } from "./CodeEditor";
import { VisualGameStage } from "./VisualGameStage";
import {
  FolderCode,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Play,
  Layers,
  Award,
  Terminal,
} from "lucide-react";
import { sound } from "../utils/audio";
import confetti from "canvas-confetti";

export const ProjectsView: React.FC = () => {
  const { player, completeProject } = useGame();
  const [selectedProject, setSelectedProject] = useState<ProjectTemplate>(PROJECTS[0]);
  const [visualActions, setVisualActions] = useState<VisualAction[]>([]);
  const [testResults, setTestResults] = useState<{ name: string; passed: boolean }[]>([]);

  const handleRunProject = (code: string): ExecutionResult => {
    sound.playRun();
    const result = PythonRuntime.execute(code);
    setVisualActions(result.visualActions);

    if (result.success) {
      const outputText = result.output.join("\n");
      const tests = selectedProject.testSuites.map((ts) => ({
        name: ts.name,
        passed: outputText.includes(ts.expectedOutputPattern),
      }));

      setTestResults(tests);

      const allPassed = tests.every((t) => t.passed);
      if (allPassed) {
        sound.playSuccess();
        completeProject(
          selectedProject.id,
          selectedProject.xpReward,
          selectedProject.coinsReward
        );
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#06b6d4", "#a855f7", "#10b981"],
          });
        } catch {}
      }
    } else {
      sound.playError();
    }

    return result;
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
            <FolderCode className="w-4 h-4" />
            <span>REAL-WORLD PYTHON LAB</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
            Project Studio // Software Engineering
          </h1>
        </div>
      </div>

      {/* Project Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PROJECTS.map((proj) => {
          const isSelected = proj.id === selectedProject.id;
          const isDone = player.completedProjects.includes(proj.id);

          return (
            <div
              key={proj.id}
              onClick={() => {
                setSelectedProject(proj);
                setTestResults([]);
                setVisualActions([]);
                sound.playKeyClick();
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    {proj.tier}
                  </span>
                  {isDone && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      BUILT
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-white font-mono line-clamp-1">
                  {proj.title}
                </h3>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">{proj.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-amber-400 font-bold">
                <span>+{proj.xpReward} XP</span>
                <span className="text-slate-400">+{proj.coinsReward} Coins</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Project Workspace */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
        {/* Project Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              {selectedProject.category} // {selectedProject.tier}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono mt-0.5">
              {selectedProject.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
              +{selectedProject.xpReward} XP REWARD
            </span>
          </div>
        </div>

        {/* Requirements & Specifications */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-slate-400 font-bold">SYSTEM REQUIREMENTS:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedProject.requirements.map((req, i) => (
              <div
                key={i}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200 flex items-center gap-2"
              >
                <span className="text-cyan-400 font-bold">#{i + 1}</span>
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Game Stage */}
        <VisualGameStage sceneType="data_matrix" visualActions={visualActions} />

        {/* Project Code Editor */}
        <CodeEditor
          initialCode={selectedProject.starterCode}
          onRunCode={handleRunProject}
          onResetCode={() => {
            setVisualActions([]);
            setTestResults([]);
          }}
          onRequestHint={() => {
            sound.playKeyClick();
          }}
          currentHintLevel={1}
        />

        {/* Automated Test Suite Evaluation */}
        {testResults.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold">AUTOMATED TEST RUNNER:</span>
            <div className="space-y-1.5">
              {testResults.map((t, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg font-mono text-xs flex items-center justify-between border ${
                    t.passed
                      ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                      : "bg-rose-950/60 border-rose-500/40 text-rose-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {t.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-black flex items-center justify-center font-bold text-[10px]">
                        X
                      </span>
                    )}
                    <span>{t.name}</span>
                  </div>
                  <span className="font-bold">{t.passed ? "PASSED" : "FAILED"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
