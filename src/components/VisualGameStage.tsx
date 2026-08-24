import React, { useEffect, useRef, useState } from "react";
import { VisualAction } from "../types";
import { sound } from "../utils/audio";
import { Shield, Zap, Terminal, Lock, Unlock, Radio, Cpu, Sparkles, FastForward, Gauge, Flame, ArrowRight } from "lucide-react";

interface VisualGameStageProps {
  sceneType: "terminal" | "cyber_gate" | "robot_lab" | "drone_grid" | "data_matrix" | "core_reactor" | string;
  visualActions: VisualAction[];
  isExecuting?: boolean;
  levelNumber?: number;
  totalLevels?: number;
  isLevelPassed?: boolean;
  missionTitle?: string;
  rankTitle?: string;
  onAdvanceLevel?: () => void;
}

export const VisualGameStage: React.FC<VisualGameStageProps> = ({
  sceneType,
  visualActions,
  isExecuting = false,
  levelNumber = 1,
  totalLevels = 27,
  isLevelPassed = false,
  missionTitle,
  rankTitle,
  onAdvanceLevel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [doorOpen, setDoorOpen] = useState(false);
  const [terminalActive, setTerminalActive] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [energyUnits, setEnergyUnits] = useState(3 + (levelNumber % 5) * 2);
  const [recentActionMessage, setRecentActionMessage] = useState<string | null>(null);
  const [isWarping, setIsWarping] = useState(false);

  useEffect(() => {
    setDoorOpen(false);
    setTerminalActive(false);
    setShieldActive(false);
    setRecentActionMessage(`LEVEL ${levelNumber} // READY`);
    setEnergyUnits(3 + (levelNumber % 5) * 2);
    setIsWarping(false);
  }, [levelNumber, sceneType]);

  useEffect(() => {
    if (isLevelPassed) {
      setIsWarping(true);
      setDoorOpen(true);
      setTerminalActive(true);
      setShieldActive(true);
      setRecentActionMessage(`LEVEL ${levelNumber} CLEARED`);

      const timer = setTimeout(() => {
        setIsWarping(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isLevelPassed, levelNumber]);

  useEffect(() => {
    if (!visualActions || visualActions.length === 0) return;

    let delay = 0;
    visualActions.forEach((action) => {
      setTimeout(() => {
        setRecentActionMessage(action.message || action.type.replace(/_/g, " ").toUpperCase());

        switch (action.type) {
          case "terminal_activate":
            setTerminalActive(true);
            sound.playLaserAction();
            break;
          case "door_open":
            setDoorOpen(true);
            sound.playLaserAction();
            break;
          case "door_close":
            setDoorOpen(false);
            break;
          case "robot_move":
            sound.playKeyClick();
            break;
          case "robot_recharge":
            setEnergyUnits((prev) => Math.min(10, prev + 2));
            sound.playLaserAction();
            break;
          case "robot_shoot":
            sound.playBossHit();
            break;
          case "shield_engage":
            setShieldActive(true);
            sound.playLaserAction();
            break;
          case "energy_collect":
            setEnergyUnits((prev) => prev + 1);
            sound.playKeyClick();
            break;
          case "enemy_damage":
            sound.playBossHit();
            break;
          case "system_repair":
            setTerminalActive(true);
            sound.playSuccess();
            break;
          case "error_glitch":
            sound.playError();
            break;
        }
      }, delay);
      delay += 320;
    });

    return () => {};
  }, [visualActions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(139, 92, 246, 0.08)";
      ctx.lineWidth = 1;
      const gridSize = 22;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const roadY = 175;
      ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, roadY);
      ctx.lineTo(canvas.width, roadY);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const levelProgressPercent = Math.min(100, Math.round((levelNumber / totalLevels) * 100));

  return (
    <div
      id="visual-stage-container"
      className="relative w-full h-48 sm:h-56 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between p-3.5 select-none"
    >
      <canvas
        ref={canvasRef}
        width={400}
        height={220}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="relative z-10 flex items-center justify-between text-xs font-mono gap-2">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${isLevelPassed ? "bg-emerald-400" : "bg-cyan-400"}`} />
          <div className="flex flex-col">
            <span className="text-cyan-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>LEVEL {levelNumber}/{totalLevels}</span>
            </span>
          </div>
        </div>

        {recentActionMessage && (
          <div className="px-2.5 py-0.5 rounded-full border border-slate-700 text-[10px] sm:text-[11px] truncate max-w-[200px] bg-slate-900 text-slate-300">
            {recentActionMessage}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800 text-[10px] text-slate-400">
            <Gauge className="w-3 h-3 text-slate-400" />
            <span>PROGRESS:</span>
            <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-500"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
            <span className="text-slate-300 font-bold">{levelProgressPercent}%</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-amber-300 font-bold text-[11px]">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{energyUnits * 25} MW</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between px-2 sm:px-6">
        <div className="flex flex-col items-center">
          {sceneType === "cyber_gate" ? (
            <div className={`p-3 rounded-2xl border ${doorOpen || isLevelPassed ? "bg-slate-900 border-emerald-500 text-emerald-300" : "bg-slate-900 border-rose-500 text-rose-300"}`}>
              {doorOpen || isLevelPassed ? (
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                  <Unlock className="w-5 h-5 text-emerald-300" />
                  <span>BLAST GATE OPEN</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                  <Lock className="w-5 h-5 text-rose-400" />
                  <span>BLAST GATE SEALED</span>
                </div>
              )}
            </div>
          ) : sceneType === "core_reactor" ? (
            <div className="relative flex items-center justify-center">
              <div className={`w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center bg-slate-900 ${isLevelPassed ? "border-emerald-400" : "border-amber-400/70"}`}>
                <Cpu className={`w-8 h-8 ${isLevelPassed ? "text-emerald-300" : "text-amber-300"}`} />
              </div>
              <span className="absolute -bottom-4 text-[10px] font-mono text-amber-300 font-bold">
                CORE MATRIX
              </span>
            </div>
          ) : (
            <div className={`p-2.5 rounded-xl border ${terminalActive || isLevelPassed ? "bg-slate-900 border-cyan-400 text-cyan-300" : "bg-slate-900 border-slate-700 text-slate-400"}`}>
              <div className="flex items-center gap-2 font-mono text-xs font-bold">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>{terminalActive || isLevelPassed ? "TERMINAL ACTIVE" : "TERMINAL STANDBY"}</span>
              </div>
            </div>
          )}

          {shieldActive && (
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-300 bg-slate-900 px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-bold">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>PLASMA SHIELD ENGAGED</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${isWarping || isLevelPassed ? "bg-slate-900 border-cyan-400" : "bg-slate-900 border-slate-700"}`}>
            {isWarping || isLevelPassed ? (
              <FastForward className="w-7 h-7 text-cyan-300" />
            ) : (
              <Radio className="w-7 h-7 text-slate-400" />
            )}
          </div>
          <span className={`mt-1 text-[10px] font-mono font-bold ${isWarping || isLevelPassed ? "text-cyan-300" : "text-slate-500"}`}>
            {isWarping || isLevelPassed ? "WARP GATEWAY" : "CHECKPOINT"}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-1.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className={`w-3.5 h-3.5 ${isLevelPassed ? "text-emerald-400" : "text-slate-500"}`} />
          <span>
            {isWarping
              ? `HYPERSPEED ADVANCE TO NEXT LEVEL...`
              : isLevelPassed
              ? `LEVEL ${levelNumber} RESOLVED // TRACK CLEARED`
              : `HIGHWAY ACTIVE: LEVEL ${levelNumber} OF ${totalLevels}`}
          </span>
        </div>

        {isLevelPassed && onAdvanceLevel ? (
          <button
            id="stage-next-sector-btn"
            onClick={onAdvanceLevel}
            className="flex items-center gap-1 px-2.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold border border-slate-700 cursor-pointer"
          >
            <span>NEXT SECTOR</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        ) : (
          <span className="text-slate-500 font-semibold">s6ft // SUPER SPEEDWAY</span>
        )}
      </div>
    </div>
  );
};
