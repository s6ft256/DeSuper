import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useGame } from "../context/GameContext";
import { sound } from "../utils/audio";
import { ArcadeTrack } from "../types";
import {
  Zap,
  Gauge,
  Shield,
  Flame,
  Award,
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  Trophy,
  Compass,
  Radio,
  Crosshair,
  ArrowRight,
  ArrowLeft,
  FastForward,
} from "lucide-react";

export const ARCADE_TRACKS: ArcadeTrack[] = [
  {
    id: "track_neon",
    name: "Sector 1: Neon Gridway",
    sector: "Variables & Syntax Plains",
    theme: "cyan",
    bgGradient: "bg-slate-950",
    roadColor: "#082f49",
    neonBorder: "#06b6d4",
    targetScore: 1200,
    obstacleFrequency: 1.0,
    baseSpeed: 240,
    unlockedLevel: 1,
    description: "Cruise down the high-speed photon highway. Dodge syntax glitch barriers and collect Python token bytes.",
  },
  {
    id: "track_silicon",
    name: "Sector 2: Silicon Rift",
    sector: "Control Flow Canyon",
    theme: "purple",
    bgGradient: "bg-slate-950",
    roadColor: "#3b0764",
    neonBorder: "#a855f7",
    targetScore: 2200,
    obstacleFrequency: 1.35,
    baseSpeed: 300,
    unlockedLevel: 4,
    description: "Navigate turbulent data forks and branching logic gates at supersonic speeds.",
  },
  {
    id: "track_quantum",
    name: "Sector 3: Quantum Overdrive",
    sector: "Data Matrix Citadel",
    theme: "fuchsia",
    bgGradient: "bg-slate-950",
    roadColor: "#4c0519",
    neonBorder: "#ec4899",
    targetScore: 3500,
    obstacleFrequency: 1.7,
    baseSpeed: 370,
    unlockedLevel: 10,
    description: "High-density matrix lane with rapid firewall pulses and quantum memory nodes.",
  },
  {
    id: "track_singularity",
    name: "Sector 4: Apex Singularity",
    sector: "Supreme Engine Core",
    theme: "amber",
    bgGradient: "bg-slate-950",
    roadColor: "#451a03",
    neonBorder: "#f59e0b",
    targetScore: 5000,
    obstacleFrequency: 2.1,
    baseSpeed: 450,
    unlockedLevel: 19,
    description: "Ultimate supersonic test of reaction time. Maximum sentinel drones and warp hazards.",
  },
];

interface GameObject {
  id: number;
  type: "coin" | "crystal" | "nitro" | "shield" | "emp" | "obstacle" | "laser_wall";
  x: number;
  y: number;
  label?: string;
  size: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const ArcadeRacerView: React.FC = () => {
  const { player, addXpAndCoins, progressDailyQuest, currentLevel } = useGame();

  const [selectedTrack, setSelectedTrack] = useState<ArcadeTrack>(ARCADE_TRACKS[0]);
  const [gameState, setGameState] = useState<"menu" | "playing" | "paused" | "gameover" | "victory">("menu");
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(240);
  const [nitro, setNitro] = useState(100);
  const [shield, setShield] = useState(100);
  const [combo, setCombo] = useState(1);
  const [comboTimer, setComboTimer] = useState(0);
  const [hasShieldActive, setHasShieldActive] = useState(false);
  const [hasEmpAvailable, setHasEmpAvailable] = useState(false);
  const [hasMagnetActive, setHasMagnetActive] = useState(false);
  const [tokensCollected, setTokensCollected] = useState(0);
  const [empBlastActive, setEmpBlastActive] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(() => sound.getIsMusicPlaying());

  const [highScores, setHighScores] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("desuper_arcade_highscores");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const playerRef = useRef({
    laneX: 0,
    targetLaneX: 0,
    vx: 0,
    isBoosting: false,
    isBraking: false,
    roadScroll: 0,
  });

  const gameObjectsRef = useRef<GameObject[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const nextObjectIdRef = useRef(1);
  const lastSpawnDistRef = useRef(0);
  const keysPressedRef = useRef<{ [key: string]: boolean }>({});

  const playerSuitColor = player.customization?.suitColor || "#06b6d4";

  const handleToggleMusic = () => {
    const nextState = sound.toggleMusic();
    setIsMusicOn(nextState);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = true;

      if (gameState === "playing") {
        if (e.code === "Space") {
          e.preventDefault();
          triggerEmpShockwave();
        }
        if (e.code === "KeyP" || e.code === "Escape") {
          setGameState((prev) => (prev === "playing" ? "paused" : prev === "paused" ? "playing" : prev));
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState, hasEmpAvailable]);

  const triggerEmpShockwave = useCallback(() => {
    if (!hasEmpAvailable && nitro < 40) return;
    sound.playLaserAction();
    setEmpBlastActive(true);
    setTimeout(() => setEmpBlastActive(false), 450);

    const destroyed = gameObjectsRef.current.filter((obj) => {
      const objY = 950 - (obj.y / 1200) * 400;
      return objY > 150 && objY < 350 && Math.abs(obj.x) < 1.1;
    }).length;

    if (destroyed > 0) {
      sound.playSuccess();
      setScore((s) => s + destroyed * 150 * combo);
    }
  }, [hasEmpAvailable, nitro, combo]);

  const handleStartGame = (track: ArcadeTrack) => {
    setSelectedTrack(track);
    if (!isMusicOn) {
      sound.startMusic();
      setIsMusicOn(true);
    }

    playerRef.current = {
      laneX: 0,
      targetLaneX: 0,
      vx: 0,
      isBoosting: false,
      isBraking: false,
      roadScroll: 0,
    };

    gameObjectsRef.current = [];
    particlesRef.current = [];
    nextObjectIdRef.current = 1;
    lastSpawnDistRef.current = 0;

    setScore(0);
    setDistance(0);
    setSpeed(track.baseSpeed);
    setNitro(100);
    setShield(100);
    setCombo(1);
    setComboTimer(0);
    setHasShieldActive(true);
    setHasEmpAvailable(true);
    setHasMagnetActive(false);
    setTokensCollected(0);
    setGameState("playing");
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = (time: number) => {
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      const keys = keysPressedRef.current;
      const moveLeft = keys["ArrowLeft"] || keys["KeyA"];
      const moveRight = keys["ArrowRight"] || keys["KeyD"];
      const boostKey = keys["ArrowUp"] || keys["KeyW"];
      const brakeKey = keys["ArrowDown"] || keys["KeyS"];

      if (moveLeft && !moveRight) {
        playerRef.current.vx -= 4.8 * dt;
      } else if (moveRight && !moveLeft) {
        playerRef.current.vx += 4.8 * dt;
      } else {
        playerRef.current.vx *= 0.88;
      }

      playerRef.current.laneX += playerRef.current.vx * dt * 2.5;
      playerRef.current.laneX = Math.max(-0.86, Math.min(0.86, playerRef.current.laneX));

      let currentSpeed = selectedTrack.baseSpeed;
      if (boostKey && nitro > 0) {
        currentSpeed *= 1.65;
        playerRef.current.isBoosting = true;
        setNitro((n) => Math.max(0, n - 22 * dt));
        if (Math.random() < 0.3) sound.playLaserAction();
      } else {
        playerRef.current.isBoosting = false;
        setNitro((n) => Math.min(100, n + 6 * dt));
      }

      if (brakeKey) {
        currentSpeed *= 0.6;
        playerRef.current.isBraking = true;
      } else {
        playerRef.current.isBraking = false;
      }

      setSpeed(Math.round(currentSpeed));

      const distTraveled = currentSpeed * dt * 1.5;
      setDistance((d) => d + Math.round(distTraveled));
      setScore((s) => s + Math.round(distTraveled * 0.1 * combo));

      playerRef.current.roadScroll = (playerRef.current.roadScroll + currentSpeed * dt * 0.015) % 1;

      if (distance - lastSpawnDistRef.current > 75 / selectedTrack.obstacleFrequency) {
        lastSpawnDistRef.current = distance;
        const rand = Math.random();
        const spawnLane = (Math.random() * 1.6 - 0.8);

        if (rand < 0.42) {
          gameObjectsRef.current.push({
            id: nextObjectIdRef.current++,
            type: "coin",
            x: spawnLane,
            y: 950,
            label: "PY",
            size: 24,
            color: "#38bdf8",
          });
        } else if (rand < 0.58) {
          gameObjectsRef.current.push({
            id: nextObjectIdRef.current++,
            type: "crystal",
            x: spawnLane,
            y: 950,
            label: "XP",
            size: 28,
            color: "#a855f7",
          });
        } else if (rand < 0.68) {
          const isShield = Math.random() < 0.5;
          gameObjectsRef.current.push({
            id: nextObjectIdRef.current++,
            type: isShield ? "shield" : "nitro",
            x: spawnLane,
            y: 950,
            label: isShield ? "SHIELD" : "NITRO",
            size: 26,
            color: isShield ? "#10b981" : "#f59e0b",
          });
        } else {
          const isLaser = Math.random() < 0.4;
          gameObjectsRef.current.push({
            id: nextObjectIdRef.current++,
            type: isLaser ? "laser_wall" : "obstacle",
            x: spawnLane,
            y: 950,
            label: isLaser ? "SYNTAX_ERR" : "GLITCH",
            size: isLaser ? 46 : 38,
            color: isLaser ? "#ef4444" : "#f43f5e",
          });
        }
      }

      const remainingObjects: GameObject[] = [];
      const pX = playerRef.current.laneX;

      gameObjectsRef.current.forEach((obj) => {
        obj.y -= currentSpeed * dt * 1.6;

        if (hasMagnetActive && (obj.type === "coin" || obj.type === "crystal")) {
          obj.x += (pX - obj.x) * dt * 4;
        }

        if (obj.y < -50) return;

        if (obj.y > 60 && obj.y < 160) {
          const xDist = Math.abs(obj.x - pX);
          if (xDist < 0.22) {
            if (obj.type === "coin") {
              sound.playCoin();
              setScore((s) => s + 50 * combo);
              setTokensCollected((t) => t + 1);
              setCombo((c) => Math.min(8, c + 1));
              setComboTimer(4);
              return;
            } else if (obj.type === "crystal") {
              sound.playLevelUp();
              setScore((s) => s + 100 * combo);
              setTokensCollected((t) => t + 1);
              setCombo((c) => Math.min(8, c + 1));
              setComboTimer(4);
              return;
            } else if (obj.type === "nitro") {
              sound.playWarp();
              setNitro(100);
              return;
            } else if (obj.type === "shield") {
              sound.playSuccess();
              setHasShieldActive(true);
              setShield(100);
              return;
            } else if (obj.type === "emp") {
              sound.playLaserAction();
              setHasEmpAvailable(true);
              return;
            } else {
              if (hasShieldActive) {
                setHasShieldActive(false);
                sound.playError();
                return;
              }
              setGameState("gameover");
              handleGameOver();
              return;
            }
          }
        }

        remainingObjects.push(obj);
      });

      gameObjectsRef.current = remainingObjects;

      if (comboTimer > 0) {
        setComboTimer((t) => {
          const next = t - dt;
          if (next <= 0) {
            setCombo(1);
            return 0;
          }
          return next;
        });
      }

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = selectedTrack.roadColor;
      ctx.fillRect(0, 0, w, h);

      const roadTopW = w * 0.3;
      const roadBottomW = w * 0.92;
      const roadTopLeft = (w - roadTopW) / 2;
      const roadBottomLeft = (w - roadBottomW) / 2;
      const horizonY = h * 0.55;

      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.moveTo(roadTopLeft, horizonY);
      ctx.lineTo(roadTopLeft + roadTopW, horizonY);
      ctx.lineTo(roadBottomLeft + roadBottomW, h);
      ctx.lineTo(roadBottomLeft, h);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = selectedTrack.neonBorder;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(roadTopLeft, horizonY);
      ctx.lineTo(roadBottomLeft, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(roadTopLeft + roadTopW, horizonY);
      ctx.lineTo(roadBottomLeft + roadBottomW, h);
      ctx.stroke();

      const dashSpacing = 40;
      const offset = (playerRef.current.roadScroll * dashSpacing) % dashSpacing;
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 18]);
      ctx.lineDashOffset = -offset;
      ctx.beginPath();
      for (let y = horizonY; y < h; y += dashSpacing) {
        const progress = (y - horizonY) / (h - horizonY);
        const currentRoadW = roadTopW + progress * (roadBottomW - roadTopW);
        const leftX = (w - currentRoadW) / 2;
        ctx.moveTo(leftX + currentRoadW / 2, y);
        ctx.lineTo(leftX + currentRoadW / 2, y + 12);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      const remainingAfterRender: GameObject[] = [];
      gameObjectsRef.current.forEach((obj) => {
        if (obj.y < -50) return;

        const progress = Math.max(0, Math.min(1, obj.y / 1200));
        const objY = horizonY + progress * (h - horizonY);
        const currentRoadW = roadTopW + progress * (roadBottomW - roadTopW);
        const objX = w / 2 + obj.x * (currentRoadW * 0.44);
        const scale = 0.35 + progress * 0.85;

        ctx.save();
        ctx.translate(objX, objY);
        ctx.scale(scale, scale);

        if (obj.type === "coin") {
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 10;
          ctx.fillStyle = "#0284c7";
          ctx.beginPath();
          ctx.arc(0, 0, obj.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#7dd3fc";
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 11px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(obj.label || "{}", 0, 0);
        } else if (obj.type === "crystal") {
          ctx.shadowColor = "#a855f7";
          ctx.shadowBlur = 12;
          ctx.fillStyle = "#7c3aed";
          ctx.beginPath();
          ctx.moveTo(0, -obj.size * 0.8);
          ctx.lineTo(obj.size * 0.7, 0);
          ctx.lineTo(0, obj.size * 0.8);
          ctx.lineTo(-obj.size * 0.7, 0);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = "#e9d5ff";
          ctx.font = "bold 10px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(obj.label || "XP", 0, 0);
        } else if (obj.type === "nitro" || obj.type === "shield") {
          ctx.shadowColor = obj.color;
          ctx.shadowBlur = 10;
          ctx.fillStyle = obj.color;
          ctx.beginPath();
          ctx.roundRect(-obj.size * 0.7, -obj.size * 0.7, obj.size * 1.4, obj.size * 1.4, 6);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(obj.label || "", 0, 0);
        } else {
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 10;
          ctx.fillStyle = "#7f1d1d";
          ctx.fillRect(-obj.size * 0.7, -obj.size * 0.4, obj.size * 1.4, obj.size * 0.8);
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 2;
          ctx.strokeRect(-obj.size * 0.7, -obj.size * 0.4, obj.size * 1.4, obj.size * 0.8);
          ctx.fillStyle = "#fecaca";
          ctx.font = "bold 8px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(obj.label || "", 0, 0);
        }

        ctx.restore();
        remainingAfterRender.push(obj);
      });

      gameObjectsRef.current = remainingAfterRender;

      particlesRef.current.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0) return;

        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      if (empBlastActive) {
        ctx.save();
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 12;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, w * 0.45, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, selectedTrack, hasShieldActive, hasMagnetActive, combo, empBlastActive, distance, score, nitro, playerSuitColor, triggerEmpShockwave]);

  const handleGameOver = () => {
    const gainedXp = Math.floor(score * 0.15);
    const gainedCoins = Math.floor(tokensCollected * 8);
    if (gainedXp > 0 || gainedCoins > 0) {
      addXpAndCoins(gainedXp, gainedCoins);
    }

    const trackId = selectedTrack.id;
    setHighScores((prev) => {
      const current = prev[trackId] || 0;
      if (score > current) {
        const next = { ...prev, [trackId]: score };
        try {
          localStorage.setItem("desuper_arcade_highscores", JSON.stringify(next));
        } catch {}
        return next;
      }
      return prev;
    });
  };

  const handleVictory = () => {
    setGameState("victory");
    sound.playLevelUp();

    const gainedXp = Math.floor(score * 0.2);
    const gainedCoins = Math.floor(tokensCollected * 12);
    addXpAndCoins(gainedXp, gainedCoins);
    progressDailyQuest("boss", 1);
  };

  useEffect(() => {
    if (gameState === "playing" && score >= selectedTrack.targetScore) {
      handleVictory();
    }
  }, [score, gameState, selectedTrack.targetScore]);

  const handleRestart = () => {
    handleStartGame(selectedTrack);
  };

  return (
    <div className="w-full px-3 sm:px-6 py-4 pb-24 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-white font-mono tracking-wide">
                CYBER HIGHWAY RACER
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-bold">
                ARCADE ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Steer through supersonic quantum lanes, collect Python tokens, and dodge firewall barriers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMusic}
            title={isMusicOn ? "Mute Music" : "Enable Music"}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 cursor-pointer"
          >
            {isMusicOn ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>SCORE</span>
              <Zap className="w-3 h-3 text-amber-400" />
            </div>
            <span className="text-lg font-bold text-cyan-300">{score}</span>
            <span className="text-[10px] text-slate-500">/ {selectedTrack.targetScore}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>SPEED</span>
              <Gauge className="w-3 h-3 text-cyan-400" />
            </div>
            <span className="text-lg font-bold text-white">{speed} <span className="text-[10px] text-slate-500">KM/H</span></span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>NITRO</span>
              <Flame className="w-3 h-3 text-amber-400" />
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${nitro}%` }} />
            </div>
            <span className="text-[10px] text-amber-300 font-bold">{Math.round(nitro)}%</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>SHIELD</span>
              <Shield className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${shield}%` }} />
            </div>
            <span className="text-[10px] text-emerald-300 font-bold">{Math.round(shield)}%</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>COMBO</span>
              <Sparkles className="w-3 h-3 text-fuchsia-400" />
            </div>
            <span className={`text-lg font-bold ${combo > 1 ? "text-fuchsia-300" : "text-slate-300"}`}>x{combo}</span>
            <span className="text-[10px] text-slate-500">{tokensCollected} tokens</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span className="font-bold text-slate-300">TRACK SELECT</span>
            <span className="text-[10px] text-slate-500">Use arrow keys to steer • SPACE for EMP</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {ARCADE_TRACKS.map((track) => {
              const isSelected = selectedTrack.id === track.id;
              const isUnlocked = currentLevel >= track.unlockedLevel;
              const bestScore = highScores[track.id] || 0;

              return (
                <button
                  key={track.id}
                  onClick={() => {
                    if (!isUnlocked) return;
                    if (gameState === "playing") return;
                    setSelectedTrack(track);
                    sound.playKeyClick();
                  }}
                  disabled={!isUnlocked || gameState === "playing"}
                  className={`p-3 rounded-xl border text-left cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 border-slate-500"
                      : isUnlocked
                      ? "bg-slate-950 border-slate-800 hover:border-slate-700"
                      : "bg-slate-950 border-slate-900 text-slate-600 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="text-[10px] font-bold text-slate-400 mb-1">{track.sector}</div>
                  <div className="text-xs font-bold text-white font-mono mb-2">{track.name}</div>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-amber-300">+{track.targetScore} PTS</span>
                    {bestScore > 0 && <span className="text-cyan-300">BEST: {bestScore}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative w-full aspect-[16/9] max-h-[520px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
          <canvas
            ref={canvasRef}
            width={800}
            height={450}
            className="w-full h-full object-cover block"
          />

          {gameState === "menu" && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
                <Trophy className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white font-mono">ARCADE RACER</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Select a track and press START to race.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleStartGame(selectedTrack)}
                  disabled={currentLevel < selectedTrack.unlockedLevel}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs uppercase cursor-pointer border border-slate-700 disabled:opacity-50"
                >
                  START RACE
                </button>
              </div>
            </div>
          )}

          {gameState === "paused" && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <h3 className="text-2xl font-black font-mono text-white tracking-widest">PAUSED</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setGameState("playing")}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs uppercase border border-slate-700"
                >
                  RESUME (P)
                </button>
                <button
                  onClick={() => setGameState("menu")}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono font-bold text-xs uppercase border border-slate-700"
                >
                  EXIT TO MENU
                </button>
              </div>
            </div>
          )}

          {gameState === "gameover" && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-rose-400">
                <Flame className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black font-mono text-white">RACE TERMINATED</h3>
                <p className="text-xs font-mono text-slate-400">
                  Final Score: <strong className="text-cyan-300">{score} PTS</strong> | Tokens: <strong className="text-amber-300">{tokensCollected}</strong>
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs uppercase border border-slate-700"
                >
                  RETRY RACE
                </button>
                <button
                  onClick={() => setGameState("menu")}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono font-bold text-xs uppercase border border-slate-700"
                >
                  TRACK SELECT
                </button>
              </div>
            </div>
          )}

          {gameState === "victory" && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-2xl font-black font-mono text-emerald-300 tracking-wide">
                  TRACK CLEARED
                </h3>
                <p className="text-xs font-mono text-slate-300">
                  Mastery Achieved on {selectedTrack.name}
                </p>
                <div className="flex items-center justify-center gap-4 text-xs font-mono pt-2">
                  <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300">
                    Score: <strong>{score}</strong>
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-amber-300">
                    +XP & Coins
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs uppercase border border-slate-700"
                >
                  RETRY RACE
                </button>
                <button
                  onClick={() => setGameState("menu")}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono font-bold text-xs uppercase border border-slate-700"
                >
                  TRACK SELECT
                </button>
              </div>
            </div>
          )}

          {gameState === "playing" && (
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={() => setGameState("paused")}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs cursor-pointer"
              >
                PAUSE (P)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
