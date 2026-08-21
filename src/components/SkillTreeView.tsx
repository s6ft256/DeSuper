import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { SKILL_TREE } from "../data/skillTree";
import { SkillNode } from "../types";
import {
  GitFork,
  CheckCircle2,
  Lock,
  Sparkles,
  Layers,
  BookOpen,
  ArrowRight,
  Zap,
} from "lucide-react";
import { sound } from "../utils/audio";

const BRANCHES = [
  "PYTHON CORE",
  "CONTROL FLOW",
  "DATA STRUCTURES",
  "FUNCTIONS",
  "OOP",
  "ENGINEERING",
  "ADVANCED",
  "SUPREME",
] as const;

export const SkillTreeView: React.FC = () => {
  const { player, unlockSkill, addXpAndCoins } = useGame();
  const [selectedBranch, setSelectedBranch] = useState<string>("PYTHON CORE");
  const [activeNode, setActiveNode] = useState<SkillNode | null>(SKILL_TREE[0]);

  const branchNodes = SKILL_TREE.filter((node) => node.branch === selectedBranch);

  const handleNodeClick = (node: SkillNode) => {
    setActiveNode(node);
    sound.playKeyClick();
  };

  const handleUnlockNode = (node: SkillNode) => {
    if (player.coins >= 100) {
      sound.playSuccess();
      unlockSkill(node.id);
      addXpAndCoins(50, -100);
    } else {
      sound.playError();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
            <GitFork className="w-4 h-4" />
            <span>NEURAL PROGRESSION MATRIX</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
            Python Skill Constellation
          </h1>
        </div>
      </div>

      {/* Branch Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {BRANCHES.map((branch) => {
          const isSelected = selectedBranch === branch;
          const totalInBranch = SKILL_TREE.filter((n) => n.branch === branch).length;
          const unlockedInBranch = SKILL_TREE.filter(
            (n) => n.branch === branch && player.unlockedSkills.includes(n.id)
          ).length;

          return (
            <button
              key={branch}
              onClick={() => {
                setSelectedBranch(branch);
                const first = SKILL_TREE.find((n) => n.branch === branch);
                if (first) setActiveNode(first);
                sound.playKeyClick();
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? "bg-slate-900 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold"
                  : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>{branch}</span>
              <span className="ml-1.5 text-[10px] text-slate-500">
                ({unlockedInBranch}/{totalInBranch})
              </span>
            </button>
          );
        })}
      </div>

      {/* Skill Constellation Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Constellation Nodes */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-950/90 border border-cyan-500/30 relative min-h-[420px] flex flex-col justify-between shadow-xl overflow-hidden">
          {/* Background Ambient Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-bold border-b border-slate-800 pb-2">
              <span>BRANCH: {selectedBranch}</span>
              <span className="text-slate-400">SELECT NODE TO INSPECT</span>
            </div>

            {/* Visual Node Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {branchNodes.map((node, idx) => {
                const isUnlocked = player.unlockedSkills.includes(node.id);
                const isSelected = activeNode?.id === node.id;
                const canUnlock =
                  !isUnlocked &&
                  (node.prerequisites.length === 0 ||
                    node.prerequisites.some((pr) => player.unlockedSkills.includes(pr)));

                return (
                  <div
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    className={`relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[120px] ${
                      isSelected
                        ? "bg-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-102"
                        : isUnlocked
                        ? "bg-slate-900/80 border-emerald-500/50 hover:border-emerald-400"
                        : canUnlock
                        ? "bg-slate-950/90 border-amber-500/40 hover:border-amber-400"
                        : "bg-slate-950/40 border-slate-900 opacity-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold border ${
                          isUnlocked
                            ? "bg-emerald-950 border-emerald-400 text-emerald-300"
                            : canUnlock
                            ? "bg-amber-950 border-amber-400 text-amber-300"
                            : "bg-slate-900 border-slate-800 text-slate-500"
                        }`}
                      >
                        {isUnlocked ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : canUnlock ? (
                          <Zap className="w-4 h-4" />
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-slate-500">Tier {node.tier}</span>
                    </div>

                    <div className="mt-2">
                      <h4 className="text-xs font-bold text-slate-100 font-mono line-clamp-1">
                        {node.title}
                      </h4>
                      <p className="text-[10px] font-mono text-cyan-400/90 mt-0.5">{node.concept}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-800 pt-3">
            <span>Progress through missions to unlock nodes automatically</span>
            <span className="text-cyan-400 font-bold">TOTAL SKILLS UNLOCKED: {player.unlockedSkills.length}</span>
          </div>
        </div>

        {/* Right: Skill Node Deep Inspector */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          {activeNode ? (
            <>
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider uppercase">
                    {activeNode.branch} // TIER {activeNode.tier}
                  </span>
                  <h3 className="text-base font-bold text-white font-mono mt-0.5">
                    {activeNode.title}
                  </h3>
                </div>

                <div
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    player.unlockedSkills.includes(activeNode.id)
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                      : "bg-amber-950 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  {player.unlockedSkills.includes(activeNode.id) ? "MASTERED" : "LOCKED"}
                </div>
              </div>

              {/* Concept Details */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>SYNTAX BLUEPRINT</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs">
                  <code>{activeNode.concept}</code>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 font-bold">DESCRIPTION</span>
                <p className="text-xs text-slate-300 leading-relaxed">{activeNode.description}</p>
              </div>

              {/* Unlock Actions */}
              {!player.unlockedSkills.includes(activeNode.id) && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <button
                    onClick={() => handleUnlockNode(activeNode)}
                    disabled={player.coins < 100}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-black font-mono text-xs rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>OVERRIDE UNLOCK (100 Coins)</span>
                  </button>
                  <p className="text-[10px] text-slate-500 text-center font-mono">
                    Or solve the corresponding Rank mission to unlock for free!
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-slate-500 italic">Select a node from the constellation...</p>
          )}
        </div>
      </div>
    </div>
  );
};
