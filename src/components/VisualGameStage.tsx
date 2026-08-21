import React, { useEffect, useRef, useState } from "react";
import { VisualAction } from "../types";
import { sound } from "../utils/audio";
import { Shield, Zap, Terminal, Lock, Unlock, Car, Radio, Cpu, Sparkles, FastForward, ArrowRight, Gauge, Flame } from "lucide-react";

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

// Car chassis styles and color variations per level
const CAR_VARIANTS = [
  { name: "CYBER-GT 100", body: "from-cyan-500 via-blue-600 to-indigo-700", glow: "rgba(6,182,212,0.6)", neon: "text-cyan-300", accent: "#06b6d4" },
  { name: "NEO-DRIFT R2", body: "from-fuchsia-500 via-purple-600 to-slate-900", glow: "rgba(217,70,239,0.6)", neon: "text-fuchsia-300", accent: "#d946ef" },
  { name: "VIPER QUANTUM", body: "from-emerald-400 via-teal-600 to-slate-950", glow: "rgba(16,185,129,0.6)", neon: "text-emerald-300", accent: "#10b981" },
  { name: "HYPER-FLAME 9", body: "from-amber-400 via-rose-600 to-violet-900", glow: "rgba(245,158,11,0.6)", neon: "text-amber-300", accent: "#f59e0b" },
  { name: "STEALTH-X PHANTOM", body: "from-violet-500 via-indigo-600 to-cyan-700", glow: "rgba(139,92,246,0.6)", neon: "text-violet-300", accent: "#8b5cf6" },
];

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

  // Pick car archetype based on level progression
  const carVariant = CAR_VARIANTS[(levelNumber - 1) % CAR_VARIANTS.length];

  // Calculate dynamic baseline position based on level progress (moves from left to right as levels increase)
  const maxTrackDistance = 240; // Max horizontal pixel travel before blast door
  const baseLevelOffset = Math.min(
    maxTrackDistance,
    Math.round(((levelNumber - 1) / Math.max(1, totalLevels - 1)) * maxTrackDistance)
  );

  // Live visual states
  const [doorOpen, setDoorOpen] = useState(false);
  const [carX, setCarX] = useState(baseLevelOffset);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [boostActive, setBoostActive] = useState(false);
  const [terminalActive, setTerminalActive] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [energyUnits, setEnergyUnits] = useState(3 + (levelNumber % 5) * 2);
  const [recentActionMessage, setRecentActionMessage] = useState<string | null>(null);
  const [isWarping, setIsWarping] = useState(false);
  const [hasTriggeredPassAnim, setHasTriggeredPassAnim] = useState(false);

  // Synchronize base position when level changes
  useEffect(() => {
    setDoorOpen(false);
    setTerminalActive(false);
    setShieldActive(false);
    setRecentActionMessage(`LEVEL ${levelNumber} // VEHICLE ENGAGED ON TRACK`);
    setEnergyUnits(3 + (levelNumber % 5) * 2);
    setHasTriggeredPassAnim(false);
    setIsWarping(false);
    setBoostActive(false);

    // Initial drive-in animation to level position
    setCarX(Math.max(0, baseLevelOffset - 35));
    const timer = setTimeout(() => {
      setCarX(baseLevelOffset);
      setWheelRotation((prev) => prev + 180);
    }, 120);

    return () => clearTimeout(timer);
  }, [levelNumber, sceneType, baseLevelOffset]);

  // Trigger warp / hyperspeed boost when level is passed
  useEffect(() => {
    if (isLevelPassed && !hasTriggeredPassAnim) {
      setHasTriggeredPassAnim(true);
      setIsWarping(true);
      setBoostActive(true);
      sound.playWarp();
      setDoorOpen(true);
      setTerminalActive(true);
      setShieldActive(true);
      setRecentActionMessage(`LEVEL ${levelNumber} CLEARED // HYPERSPEED ADVANCE`);

      // Animate vehicle speeding across into the warp gateway / blast door
      const timer1 = setTimeout(() => {
        setCarX(380);
        setWheelRotation((prev) => prev + 720);
      }, 250);

      const timer2 = setTimeout(() => {
        setIsWarping(false);
        setBoostActive(false);
      }, 2500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isLevelPassed, hasTriggeredPassAnim, levelNumber]);

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
            // Move car forward and rotate wheels
            setCarX((prev) => Math.min(320, prev + 30));
            setWheelRotation((prev) => prev + 180);
            setBoostActive(true);
            setTimeout(() => setBoostActive(false), 500);
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

  // Animated background track, road marks & speed warp canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; speed: number; size: number; opacity: number; colorPrefix: string }[] = [];
    let roadDashOffset = 0;

    for (let i = 0; i < 45; i++) {
      const colors = [
        "rgba(168, 85, 247, ", // Violet
        "rgba(6, 182, 212, ",   // Cyan
        "rgba(236, 72, 153, ",  // Pink / Fuchsia
        "rgba(16, 185, 129, ",  // Emerald
      ];
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.3 + Math.random() * 0.9,
        size: 1 + Math.random() * 2.5,
        opacity: 0.25 + Math.random() * 0.65,
        colorPrefix: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cyber grid lines
      ctx.strokeStyle = isWarping ? "rgba(6, 182, 212, 0.25)" : "rgba(139, 92, 246, 0.08)";
      ctx.lineWidth = isWarping ? 2 : 1;
      const gridSize = isWarping ? 16 : 22;
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

      // Animated Road Track / Cyber Highway lines on ground (y ~ 170)
      const roadY = 175;
      ctx.strokeStyle = isWarping ? "rgba(6, 182, 212, 0.6)" : "rgba(168, 85, 247, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, roadY);
      ctx.lineTo(canvas.width, roadY);
      ctx.stroke();

      // Dashed lane dividers moving
      const speed = isWarping ? 18 : isExecuting || boostActive ? 6 : 1.5;
      roadDashOffset = (roadDashOffset + speed) % 30;

      ctx.strokeStyle = isWarping ? "rgba(6, 182, 212, 0.9)" : "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 18]);
      ctx.lineDashOffset = -roadDashOffset;
      ctx.beginPath();
      ctx.moveTo(0, roadY + 8);
      ctx.lineTo(canvas.width, roadY + 8);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Draw particles (warp speed streak lines if warping)
      particles.forEach((p) => {
        if (isWarping || boostActive) {
          p.x -= p.speed * (isWarping ? 16 : 8);
          if (p.x < 0) {
            p.x = canvas.width;
            p.y = Math.random() * canvas.height;
          }
          ctx.strokeStyle = `${p.colorPrefix}0.85)`;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + (isWarping ? 30 : 15), p.y);
          ctx.stroke();
        } else {
          p.y -= p.speed;
          if (p.y < 0) {
            p.y = canvas.height;
            p.x = Math.random() * canvas.width;
          }
          ctx.fillStyle = `${p.colorPrefix}${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isWarping, isExecuting, boostActive]);

  const levelProgressPercent = Math.min(100, Math.round((levelNumber / totalLevels) * 100));

  return (
    <div
      id="visual-stage-container"
      className={`relative w-full h-48 sm:h-56 bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-950/95 rounded-2xl border transition-all duration-500 overflow-hidden shadow-[0_0_25px_rgba(139,92,246,0.15)] flex flex-col justify-between p-3.5 select-none ${
        isWarping
          ? "border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.4)]"
          : isLevelPassed
          ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.25)]"
          : "border-violet-500/30"
      }`}
    >
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        width={400}
        height={220}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
      />

      {/* Top Holographic Status Bar & Level Progression */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full animate-pulse ${
              isLevelPassed ? "bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]" : "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
            }`}
          />
          <div className="flex flex-col">
            <span className="text-cyan-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>LEVEL {levelNumber}/{totalLevels}</span>
              <span className="text-slate-500">//</span>
              <span className="text-violet-300 font-normal">{carVariant.name}</span>
            </span>
          </div>
        </div>

        {/* Action / Warp Status Banner */}
        {recentActionMessage && (
          <div
            className={`px-2.5 py-0.5 rounded-full border text-[10px] sm:text-[11px] animate-fade-in truncate max-w-[200px] shadow-sm ${
              isWarping
                ? "bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.4)] font-bold animate-pulse"
                : isLevelPassed
                ? "bg-emerald-950/90 border-emerald-400/60 text-emerald-200"
                : "bg-violet-950/90 border-violet-400/60 text-cyan-200"
            }`}
          >
            {recentActionMessage}
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Level Progress Track Mini Bar */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800 text-[10px] text-slate-400">
            <Gauge className="w-3 h-3 text-cyan-400" />
            <span>PROGRESS:</span>
            <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
            <span className="text-cyan-300 font-bold">{levelProgressPercent}%</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/50 border border-amber-500/40 text-amber-300 font-bold text-[11px]">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{energyUnits * 25} MW</span>
          </div>
        </div>
      </div>

      {/* Dynamic World Elements Stage */}
      <div className="relative z-10 flex-1 flex items-center justify-between px-2 sm:px-6">
        {/* Animated Cyber Car Vehicle */}
        <div
          className="transition-all duration-700 ease-out flex flex-col items-center"
          style={{ transform: `translateX(${carX}px)` }}
        >
          {/* Car Body Visual Container */}
          <div className="relative flex flex-col items-center">
            {/* Boost Flame when moving / accelerating */}
            {(boostActive || isWarping || isExecuting) && (
              <div className="absolute -left-6 top-2 flex items-center animate-pulse">
                <Flame className="w-6 h-5 text-cyan-400 fill-cyan-400 animate-spin" />
                <div className="w-4 h-1.5 bg-gradient-to-r from-cyan-400 to-transparent rounded-full blur-[1px]" />
              </div>
            )}

            {/* Futuristic Sports Car Chassis */}
            <div
              className={`relative w-20 h-10 rounded-xl bg-gradient-to-r ${carVariant.body} border-2 border-cyan-400/80 flex items-center justify-between px-2 shadow-lg transition-all ${
                isWarping
                  ? "scale-110 shadow-[0_0_30px_rgba(6,182,212,0.9)] border-cyan-200"
                  : isLevelPassed
                  ? "shadow-[0_0_25px_rgba(16,185,129,0.7)] border-emerald-300"
                  : "shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              }`}
            >
              {/* Cockpit Canopy / Windshield */}
              <div className="absolute top-1 left-4 w-9 h-3.5 bg-cyan-950/90 border border-cyan-300/80 rounded-t-lg backdrop-blur-sm overflow-hidden flex items-center justify-center">
                <div className="w-full h-0.5 bg-cyan-300/60 animate-pulse" />
              </div>

              {/* Headlights (Front Beam) */}
              <div className="absolute -right-2 top-2.5 w-3 h-2 bg-cyan-300 rounded-r-full shadow-[0_0_12px_#22d3ee]" />
              <div className="absolute -right-7 top-1 w-8 h-5 bg-gradient-to-r from-cyan-400/40 to-transparent rounded-r-full pointer-events-none blur-[2px]" />

              {/* Rear Tail Light */}
              <div className="absolute -left-1 top-2.5 w-1.5 h-3 bg-rose-500 rounded-l-sm shadow-[0_0_8px_#f43f5e]" />

              {/* Car Side Decal / Level Badge */}
              <div className="relative z-10 text-[9px] font-black font-mono tracking-tighter text-white/90 drop-shadow ml-2">
                L{levelNumber}
              </div>

              {/* Engine Core Indicator */}
              <div className="relative z-10 flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
              </div>
            </div>

            {/* Glowing Cyber Wheels with Rotation */}
            <div className="flex justify-between w-16 -mt-2 px-1 relative z-20">
              {/* Rear Wheel */}
              <div
                className="w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-transform duration-300"
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
              </div>

              {/* Front Wheel */}
              <div
                className="w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-transform duration-300"
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
              </div>
            </div>
          </div>

          <span className="mt-1 text-[10px] font-mono text-cyan-300 font-bold tracking-tight flex items-center gap-1">
            <Car className="w-3 h-3 text-cyan-400" />
            <span>{carVariant.name}</span>
          </span>
        </div>

        {/* Center: Interactive Scene Phenomenon */}
        <div className="flex flex-col items-center gap-2">
          {sceneType === "cyber_gate" ? (
            <div
              className={`p-3 rounded-2xl border transition-all duration-500 ${
                doorOpen || isLevelPassed
                  ? "bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_22px_rgba(16,185,129,0.4)]"
                  : "bg-rose-950/70 border-rose-500/70 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
              }`}
            >
              {doorOpen || isLevelPassed ? (
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                  <Unlock className="w-5 h-5 animate-bounce text-emerald-300" />
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
              <div
                className={`w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center bg-gradient-to-tr from-amber-950/60 to-orange-950/40 transition-all ${
                  isLevelPassed
                    ? "border-emerald-400 animate-spin shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                    : "border-amber-400/70 animate-spin shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                }`}
              >
                <Cpu
                  className={`w-8 h-8 ${
                    isLevelPassed ? "text-emerald-300" : "text-amber-300"
                  } animate-pulse`}
                />
              </div>
              <span className="absolute -bottom-4 text-[10px] font-mono text-amber-300 font-bold">
                CORE MATRIX
              </span>
            </div>
          ) : (
            <div
              className={`p-2.5 rounded-xl border transition-all duration-300 ${
                terminalActive || isLevelPassed
                  ? "bg-violet-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_18px_rgba(6,182,212,0.45)]"
                  : "bg-slate-900/90 border-slate-700 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-2 font-mono text-xs font-bold">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>{terminalActive || isLevelPassed ? "TERMINAL ACTIVE" : "TERMINAL STANDBY"}</span>
              </div>
            </div>
          )}

          {shieldActive && (
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse font-bold">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>PLASMA SHIELD ENGAGED</span>
            </div>
          )}
        </div>

        {/* Right: Target Relay / Hyperspace Warp Gateway */}
        <div className="flex flex-col items-center">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              isWarping || isLevelPassed
                ? "bg-cyan-950/90 border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.7)] animate-pulse"
                : "bg-slate-900/90 border border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.25)]"
            }`}
          >
            {isWarping || isLevelPassed ? (
              <FastForward className="w-7 h-7 text-cyan-300 animate-spin" />
            ) : (
              <Radio className="w-7 h-7 text-fuchsia-400" />
            )}
          </div>
          <span
            className={`mt-1 text-[10px] font-mono font-bold ${
              isWarping || isLevelPassed ? "text-cyan-300 animate-pulse" : "text-fuchsia-300"
            }`}
          >
            {isWarping || isLevelPassed ? "WARP GATEWAY" : "CHECKPOINT"}
          </span>
        </div>
      </div>

      {/* Bottom Visual Stage Floor */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-violet-500/20 pt-1.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className={`w-3.5 h-3.5 ${isLevelPassed ? "text-emerald-400" : "text-cyan-400"}`} />
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
            className="flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white rounded-lg text-[10px] font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)] cursor-pointer transition-all"
          >
            <span>NEXT SECTOR</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        ) : (
          <span className="text-violet-400/80 font-semibold">s6ft // SUPER SPEEDWAY</span>
        )}
      </div>
    </div>
  );
};

