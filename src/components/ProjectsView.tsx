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
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { sound } from "../utils/audio";

export const ProjectsView: React.FC = () => {
  const { player, completeProject } = useGame();
  const [selectedProject, setSelectedProject] = useState<ProjectTemplate>(PROJECTS[0]);
  const [visualActions, setVisualActions] = useState<VisualAction[]>([]);
  const [testResults, setTestResults] = useState<{ name: string; passed: boolean }[]>([]);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [projectResetTrigger, setProjectResetTrigger] = useState<number>(0);

  const hasFailedTests = testResults.length > 0 && testResults.some((t) => !t.passed);

  const handleRunProject = (code: string): ExecutionResult => {
    sound.playRun();
    const result = PythonRuntime.execute(code);
    setVisualActions(result.visualActions);

    if (result.success) {
      setProjectError(null);
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
      } else {
        sound.playError();
      }
    } else {
      sound.playError();
      setProjectError(result.error?.whatHappened || "Syntax or runtime error during project execution.");
      setTestResults(
        selectedProject.testSuites.map((ts) => ({
          name: ts.name,
          passed: false,
        }))
      );
    }

    return result;
  };

  const handleRetryProject = () => {
    sound.playKeyClick();
    setProjectError(null);
    setVisualActions([]);
  };

  const handleResetProjectScaffold = () => {
    sound.playLaserAction();
    setProjectError(null);
    setTestResults([]);
    setVisualActions([]);
    setProjectResetTrigger((prev) => prev + 1);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-300 font-mono text-xs font-bold">
            <FolderCode className="w-4 h-4 text-cyan-400" />
            <span className="bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-md text-slate-200">REAL-WORLD PYTHON LAB</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono mt-1.5">
            Project Studio // Software Engineering
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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
              className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900 border-slate-500"
                  : "bg-slate-950 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300">
                    {proj.tier}
                  </span>
                  {isDone && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold bg-slate-900 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      BUILT
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-white font-mono line-clamp-1">
                  {proj.title}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-2 mt-1">{proj.description}</p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                <span className="text-amber-300 font-bold">+{proj.xpReward} XP</span>
                <span className="text-violet-400 font-semibold">+{proj.coinsReward} Coins</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900 border border-slate-700 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3.5">
          <div>
            <span className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wider bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md">
              {selectedProject.category} // {selectedProject.tier}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono mt-2">
              {selectedProject.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
              +{selectedProject.xpReward} XP REWARD
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          <span className="text-xs font-mono text-slate-300 font-bold">SYSTEM REQUIREMENTS:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {selectedProject.requirements.map((req, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 flex items-center gap-2.5"
              >
                <span className="text-cyan-400 font-bold bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">#{i + 1}</span>
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>

        <VisualGameStage
          sceneType="data_matrix"
          visualActions={visualActions}
          levelNumber={PROJECTS.findIndex((p) => p.id === selectedProject.id) + 1}
          totalLevels={PROJECTS.length}
          isLevelPassed={testResults.length > 0 && testResults.every((t) => t.passed)}
          missionTitle={selectedProject.title}
        />

        {(hasFailedTests || projectError) && (
          <div className="p-4 rounded-2xl bg-slate-900 border-2 border-rose-500 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>BUILD TEST SUITE FAILED // CODE REQUIRES REVISION</span>
              </div>
              <button
                onClick={handleRetryProject}
                className="px-2.5 py-1 bg-rose-900 hover:bg-rose-800 text-rose-200 text-[11px] font-mono rounded-lg border border-rose-500 cursor-pointer"
              >
                Dismiss
              </button>
            </div>

            {projectError && (
              <p className="text-xs text-rose-200 font-mono bg-slate-950 p-2.5 rounded-xl border border-rose-500/30">
                {projectError}
              </p>
            )}

            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={handleRetryProject}
                className="flex-1 py-2 px-3 bg-rose-700 hover:bg-rose-600 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RETRY TEST RUN (KEEP EDITS)</span>
              </button>
              <button
                onClick={handleResetProjectScaffold}
                className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-cyan-400" />
                <span>Reset Starter Code</span>
              </button>
            </div>
          </div>
        )}

        <CodeEditor
          key={`${selectedProject.id}-${projectResetTrigger}`}
          initialCode={selectedProject.starterCode}
          onRunCode={handleRunProject}
          onResetCode={() => {
            setVisualActions([]);
            setTestResults([]);
            setProjectError(null);
          }}
          onRequestHint={() => {
            sound.playKeyClick();
          }}
          currentHintLevel={1}
          isFailed={hasFailedTests || !!projectError}
        />

        {testResults.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-700 space-y-2.5">
            <span className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              AUTOMATED TEST RUNNER:
            </span>
            <div className="space-y-2">
              {testResults.map((t, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl font-mono text-xs flex items-center justify-between border ${
                    t.passed
                      ? "bg-slate-900 border-emerald-500/40 text-emerald-300"
                      : "bg-slate-900 border-rose-500/40 text-rose-300"
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
