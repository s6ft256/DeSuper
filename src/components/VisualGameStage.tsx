import React, { useEffect, useRef, useState } from "react";
import { VisualAction } from "../types";
import { sound } from "../utils/audio";
import { Shield, Zap, Terminal, Lock, Unlock, Bot, Radio, Cpu, Sparkles } from "lucide-react";

interface VisualGameStageProps {
  sceneType: "terminal" | "cyber_gate" | "robot_lab" | "drone_grid" | "data_matrix" | "core_reactor";
  visualActions: VisualAction[];
  isExecuting?: boolean;
}

export const VisualGameStage: React.FC<VisualGameStageProps> = ({
  sceneType,
  visualActions,
  isExecuting = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live visual states
  const [doorOpen, setDoorOpen] = useState(false);
  const [robotPos, setRobotPos] = useState({ x: 40, y: 110 });
  const [terminalActive, setTerminalActive] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [energyUnits, setEnergyUnits] = useState(3);
  const [recentActionMessage, setRecentActionMessage] = useState<string | null>(null);

  // Process visual actions sequentially
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
            setRobotPos((prev) => ({
              ...prev,
              x: Math.min(260, prev.x + 35),
            }));
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
      delay += 350;
    });

    const resetTimer = setTimeout(() => {
      // Keep state alive for satisfaction
    }, delay + 1500);

    return () => clearTimeout(resetTimer);
  }, [visualActions]);

  // Animated background particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; speed: number; size: number; opacity: number }[] = [];

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.3 + Math.random() * 0.8,
        size: 1 + Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.6,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cyber grid lines
      ctx.strokeStyle = "rgba(6, 182, 212, 0.08)";
      ctx.lineWidth = 1;
      const gridSize = 24;
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

      // Draw glowing particles
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }

        ctx.fillStyle = `rgba(6, 182, 212, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      id="visual-stage-container"
      className="relative w-full h-44 sm:h-52 bg-slate-950/90 rounded-xl border border-cyan-500/30 overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col justify-between p-3 select-none"
    >
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        width={400}
        height={220}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
      />

      {/* Top Holographic Status Bar */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-300 font-bold uppercase tracking-wider">
            SECTOR: {sceneType.replace(/_/g, " ")}
          </span>
        </div>

        {recentActionMessage && (
          <div className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-[11px] animate-fade-in truncate max-w-[180px]">
            {recentActionMessage}
          </div>
        )}

        <div className="flex items-center gap-2 text-slate-400">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>{energyUnits * 25} MW</span>
        </div>
      </div>

      {/* Dynamic World Elements Stage */}
      <div className="relative z-10 flex-1 flex items-center justify-between px-2 sm:px-6">
        {/* Left: Player Bot / Entity */}
        <div
          className="transition-all duration-500 ease-out flex flex-col items-center"
          style={{ transform: `translateX(${robotPos.x - 40}px)` }}
        >
          <div className="relative w-12 h-12 rounded-xl bg-slate-900 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Bot className="w-7 h-7 text-cyan-300 animate-pulse" />
            {isExecuting && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          <span className="mt-1 text-[10px] font-mono text-cyan-400 font-bold tracking-tight">
            AURA-BOT
          </span>
        </div>

        {/* Center: Interactive Scene Phenomenon */}
        <div className="flex flex-col items-center gap-2">
          {sceneType === "cyber_gate" ? (
            <div
              className={`p-3 rounded-xl border transition-all duration-500 ${
                doorOpen
                  ? "bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  : "bg-rose-950/50 border-rose-500/60 text-rose-300"
              }`}
            >
              {doorOpen ? (
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <Unlock className="w-5 h-5 animate-bounce" />
                  <span>BLAST DOOR OPEN</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <Lock className="w-5 h-5" />
                  <span>BLAST DOOR SEALED</span>
                </div>
              )}
            </div>
          ) : sceneType === "core_reactor" ? (
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-amber-400/60 border-dashed animate-spin flex items-center justify-center bg-amber-950/40">
                <Cpu className="w-8 h-8 text-amber-300 animate-pulse" />
              </div>
              <span className="absolute -bottom-4 text-[10px] font-mono text-amber-300 font-bold">
                CORE MATRIX
              </span>
            </div>
          ) : (
            <div
              className={`p-2.5 rounded-lg border transition-all duration-300 ${
                terminalActive
                  ? "bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "bg-slate-900 border-slate-700 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-2 font-mono text-xs">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>{terminalActive ? "TERMINAL ACTIVE" : "TERMINAL STANDBY"}</span>
              </div>
            </div>
          )}

          {shieldActive && (
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 animate-pulse">
              <Shield className="w-3.5 h-3.5" />
              <span>PLASMA SHIELD ENGAGED</span>
            </div>
          )}
        </div>

        {/* Right: Target Relay / Destination Node */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-indigo-500/50 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.2)]">
            <Radio className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="mt-1 text-[10px] font-mono text-indigo-300 font-bold">
            RELAY-X
          </span>
        </div>
      </div>

      {/* Bottom Visual Stage Floor */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-cyan-500/20 pt-1.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>VISUAL SIMULATION: LIVE</span>
        </div>
        <span className="text-cyan-500/70">s6ft // DE SUPER ENGINE</span>
      </div>
    </div>
  );
};
