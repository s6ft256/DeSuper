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
import confetti from "canvas-confetti";

export const ARCADE_TRACKS: ArcadeTrack[] = [
  {
    id: "track_neon",
    name: "Sector 1: Neon Gridway",
    sector: "Variables & Syntax Plains",
    theme: "cyan",
    bgGradient: "from-slate-950 via-cyan-950/40 to-slate-950",
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
    bgGradient: "from-slate-950 via-purple-950/40 to-slate-950",
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
    bgGradient: "from-slate-950 via-fuchsia-950/40 to-slate-950",
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
    bgGradient: "from-slate-950 via-amber-950/40 to-slate-950",
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
  x: number; // Lane coordinate from -1 (left) to 1 (right)
  y: number; // Distance ahead from 0 to 1200
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

  // High Scores Storage
  const [highScores, setHighScores] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("desuper_arcade_highscores");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player Vehicle Physics State
  const playerRef = useRef({
    laneX: 0, // -0.85 to 0.85
    targetLaneX: 0,
    vx: 0,
    isBoosting: false,
    isBraking: false,
    carTilt: 0,
    roadScroll: 0,
  });

  // Game Engine state refs
  const gameObjectsRef = useRef<GameObject[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const nextObjectIdRef = useRef(1);
  const lastSpawnDistRef = useRef(0);
  const keysPressedRef = useRef<{ [key: string]: boolean }>({});

  const playerSuitColor = player.customization?.suitColor || "#06b6d4";

  // Toggle Background Music
  const handleToggleMusic = () => {
    const nextState = sound.toggleMusic();
    setIsMusicOn(nextState);
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = true;

      // Handle Quick In-Game Shortcuts
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

  // Activate EMP Shockwave
  const triggerEmpShockwave = useCallback(() => {
    if (!hasEmpAvailable && nitro < 40) return;
    sound.playLaserAction();
    setEmpBlastActive(true);
    setTimeout(() => setEmpBlastActive(false), 450);

    if (hasEmpAvailable) {
      setHasEmpAvailable(false);
    } else {
      setNitro((n) => Math.max(0, n - 40));
    }

    // Destroy all obstacles currently on screen
    let destroyed = 0;
    gameObjectsRef.current = gameObjectsRef.current.filter((obj) => {
      if (obj.type === "obstacle" || obj.type === "laser_wall") {
        destroyed++;
        // Spawn particle explosion
        for (let i = 0; i < 16; i++) {
          particlesRef.current.push({
            x: (obj.x + 1) * 200,
            y: 350 - obj.y * 0.3,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 1,
            maxLife: 0.5,
            color: "#f59e0b",
            size: Math.random() * 6 + 3,
          });
        }
        return false;
      }
      return true;
    });

    if (destroyed > 0) {
      sound.playSuccess();
      setScore((s) => s + destroyed * 150 * combo);
    }
  }, [hasEmpAvailable, nitro, combo]);

  // Start / Restart Game
  const handleStartGame = (track: ArcadeTrack) => {
    setSelectedTrack(track);
    sound.playWarp();
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
      carTilt: 0,
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

  // Main Canvas & Game Animation Loop
  useEffect(() => {
    if (gameState !== "playing") return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Game Loop Function
    const render = (time: number) => {
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      // Handle Key Inputs
      const keys = keysPressedRef.current;
      const moveLeft = keys["ArrowLeft"] || keys["KeyA"];
      const moveRight = keys["ArrowRight"] || keys["KeyD"];
      const boostKey = keys["ArrowUp"] || keys["KeyW"];
      const brakeKey = keys["ArrowDown"] || keys["KeyS"];

      // Steering with momentum
      if (moveLeft && !moveRight) {
        playerRef.current.vx -= 4.8 * dt;
        playerRef.current.carTilt = Math.max(-0.4, playerRef.current.carTilt - 3 * dt);
      } else if (moveRight && !moveLeft) {
        playerRef.current.vx += 4.8 * dt;
        playerRef.current.carTilt = Math.min(0.4, playerRef.current.carTilt + 3 * dt);
      } else {
        playerRef.current.vx *= 0.88;
        playerRef.current.carTilt *= 0.82;
      }

      playerRef.current.laneX += playerRef.current.vx * dt * 2.5;
      playerRef.current.laneX = Math.max(-0.86, Math.min(0.86, playerRef.current.laneX));

      // Nitro & Speed Dynamics
      let currentSpeed = selectedTrack.baseSpeed;
      if (boostKey && nitro > 0) {
        currentSpeed *= 1.65;
        playerRef.current.isBoosting = true;
        setNitro((n) => Math.max(0, n - 22 * dt));
        if (Math.random() < 0.3) sound.playLaserAction();
      } else {
        playerRef.current.isBoosting = false;
        // Slowly recharge nitro
        setNitro((n) => Math.min(100, n + 6 * dt));
      }

      if (brakeKey) {
        currentSpeed *= 0.6;
        playerRef.current.isBraking = true;
      } else {
        playerRef.current.isBraking = false;
      }

      setSpeed(Math.round(currentSpeed));

      // Distance & Score progression
      const distTraveled = currentSpeed * dt * 1.5;
      setDistance((d) => d + Math.round(distTraveled));
      setScore((s) => s + Math.round(distTraveled * 0.1 * combo));

      playerRef.current.roadScroll = (playerRef.current.roadScroll + currentSpeed * dt * 0.015) % 1;

      // Spawn Game Objects (Tokens, Powerups, Obstacles)
      if (distance - lastSpawnDistRef.current > 75 / selectedTrack.obstacleFrequency) {
        lastSpawnDistRef.current = distance;
        const rand = Math.random();
        const spawnLane = (Math.random() * 1.6 - 0.8);

        if (rand < 0.42) {
          // Python Code Token
          const tokens = ['"str"', "def", "[]", "{}", "42", "len()", "True", "zip()"];
          const label = tokens[Math.floor(Math.random() * tokens.length)];
          gameObjectsRef.current.push({
            id: nextObjectIdRef.current++,
            type: "coin",
            x: spawnLane,
            y: 950,
            label,
            size: 24,
            color: "#38bdf8",
          });
        } else if (rand < 0.58) {
          // Memory / XP Crystal
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
          // Nitro or Shield Powerup
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
          // Obstacle (Glitch wall or Sentinel laser barrier)
          const isLaser = Math.random() < 0.4;
          gameObjectsRef.current.push({
            id: nextObjectIdRef.current++,
            type: isLaser ? "laser_wall" : "obstacle",
            x: spawnLane,
            y: 950,
            label: isLaser ? "SYNTAX_ERR" : "GLITCH_WALL",
            size: isLaser ? 46 : 38,
            color: isLaser ? "#ef4444" : "#f43f5e",
          });
        }
      }

      // Update Game Objects Position & Check Collisions
      const remainingObjects: GameObject[] = [];
      const pX = playerRef.current.laneX;

      gameObjectsRef.current.forEach((obj) => {
        // Move towards player
        obj.y -= currentSpeed * dt * 1.6;

        // Data Magnet Effect
        if (hasMagnetActive && (obj.type === "coin" || obj.type === "crystal")) {
          obj.x += (pX - obj.x) * dt * 4;
        }

        // Check if passed player
        if (obj.y < -50) {
          return; // Discard
        }

        // Collision Check with Player (Player is at y = 80-160)
        if (obj.y > 60 && obj.y < 160) {
          const xDist = Math.abs(obj.x - pX);
          if (xDist < 0.22) {
            // Collision Occurred!
            if (obj.type === "coin") {
              sound.playCoin();
              setScore((s) => s + 50 * combo);
              setTokensCollected((t) => t + 1);
              setCombo((c) => Math.min(8, c + 1));
              setComboTimer(4);

              // Spawn sparkle particles
              for (let i = 0; i < 8; i++) {
                particlesRef.current.push({
                  x: canvas.width / 2 + pX * 220,
                  y: canvas.height - 110,
                  vx: (Math.random() - 0.5) * 5,
                  vy: (Math.random() - 0.5) * 5,
                  life: 1,
                  maxLife: 0.4,
                  color: "#38bdf8",
                  size: 4,
                });
              }
              return;
            } else if (obj.type === "crystal") {
              sound.playPowerup();
              setScore((s) => s + 120 * combo);
              setCombo((c) => Math.min(8, c + 1));
              return;
            } else if (obj.type === "nitro") {
              sound.playNitro();
              setNitro(100);
              setScore((s) => s + 100);
              return;
            } else if (obj.type === "shield") {
              sound.playShield();
              setShield(100);
              setHasShieldActive(true);
              return;
            } else if (obj.type === "obstacle" || obj.type === "laser_wall") {
              // Hit hazard!
              if (hasShieldActive) {
                sound.playShield();
                setHasShieldActive(false);
                setShield(25);
                setCombo(1);
                // Spark particles
                for (let i = 0; i < 12; i++) {
                  particlesRef.current.push({
                    x: canvas.width / 2 + pX * 220,
                    y: canvas.height - 110,
                    vx: (Math.random() - 0.5) * 9,
                    vy: (Math.random() - 0.5) * 9,
                    life: 1,
                    maxLife: 0.5,
                    color: "#06b6d4",
                    size: 5,
                  });
                }
                return;
              } else {
                sound.playCrash();
                setShield((sh) => {
                  const newSh = sh - 45;
                  if (newSh <= 0) {
                    // Game Over
                    setTimeout(() => handleGameOver(), 100);
                    return 0;
                  }
                  return newSh;
                });
                setCombo(1);
                return;
              }
            }
          }
        }

        remainingObjects.push(obj);
      });

      gameObjectsRef.current = remainingObjects;

      // Update Particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt / p.maxLife;
      });
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      // Check Target Score Victory
      if (score >= selectedTrack.targetScore && gameState === "playing") {
        handleVictory();
      }

      // ================= DRAWING SECTION =================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const horizonY = h * 0.28;

      // 1. Futuristic Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, "#020617");
      skyGrad.addColorStop(0.6, "#0f172a");
      skyGrad.addColorStop(1, selectedTrack.neonBorder + "30");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizonY);

      // Cyber Grid / Distant Mountains on Horizon
      ctx.strokeStyle = selectedTrack.neonBorder + "40";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < w; i += 40) {
        ctx.moveTo(i, horizonY);
        ctx.lineTo(w / 2 + (i - w / 2) * 0.3, 0);
      }
      ctx.stroke();

      // Horizon Glow Line
      ctx.strokeStyle = selectedTrack.neonBorder;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = selectedTrack.neonBorder;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(w, horizonY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 2. 3D Perspective Road
      const roadTopW = 120;
      const roadBottomW = w * 0.92;
      const roadTopLeft = (w - roadTopW) / 2;
      const roadBottomLeft = (w - roadBottomW) / 2;

      ctx.fillStyle = selectedTrack.roadColor;
      ctx.beginPath();
      ctx.moveTo(roadTopLeft, horizonY);
      ctx.lineTo(roadTopLeft + roadTopW, horizonY);
      ctx.lineTo(roadBottomLeft + roadBottomW, h);
      ctx.lineTo(roadBottomLeft, h);
      ctx.closePath();
      ctx.fill();

      // Road Borders (Neon Curbing)
      ctx.strokeStyle = selectedTrack.neonBorder;
      ctx.lineWidth = 4;
      ctx.shadowColor = selectedTrack.neonBorder;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(roadTopLeft, horizonY);
      ctx.lineTo(roadBottomLeft, h);
      ctx.moveTo(roadTopLeft + roadTopW, horizonY);
      ctx.lineTo(roadBottomLeft + roadBottomW, h);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Animated Road Lanes
      const lanes = [-0.5, 0, 0.5];
      lanes.forEach((laneFrac) => {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 2;
        ctx.setLineDash([20, 25]);
        ctx.lineDashOffset = -playerRef.current.roadScroll * 120;
        ctx.beginPath();
        const startX = w / 2 + laneFrac * (roadTopW * 0.45);
        const endX = w / 2 + laneFrac * (roadBottomW * 0.45);
        ctx.moveTo(startX, horizonY);
        ctx.lineTo(endX, h);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 3. Render Objects (Perspective Scaling)
      // Sort back to front
      const sortedObjects = [...gameObjectsRef.current].sort((a, b) => b.y - a.y);
      sortedObjects.forEach((obj) => {
        const progress = 1 - obj.y / 1000; // 0 at horizon, 1 at bottom
        if (progress < 0 || progress > 1.05) return;

        const objY = horizonY + progress * (h - horizonY);
        const currentRoadW = roadTopW + progress * (roadBottomW - roadTopW);
        const objX = w / 2 + obj.x * (currentRoadW * 0.44);
        const scale = 0.35 + progress * 0.85;

        ctx.save();
        ctx.translate(objX, objY);
        ctx.scale(scale, scale);

        if (obj.type === "coin") {
          // Token Byte Coin
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
          // XP Crystal
          ctx.shadowColor = "#d946ef";
          ctx.shadowBlur = 12;
          ctx.fillStyle = "#a855f7";
          ctx.beginPath();
          ctx.moveTo(0, -obj.size);
          ctx.lineTo(obj.size * 0.7, 0);
          ctx.lineTo(0, obj.size);
          ctx.lineTo(-obj.size * 0.7, 0);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = "#fdf4ff";
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (obj.type === "nitro" || obj.type === "shield") {
          // Powerup Orb
          ctx.shadowColor = obj.color;
          ctx.shadowBlur = 14;
          ctx.fillStyle = obj.color;
          ctx.beginPath();
          ctx.roundRect(-obj.size, -obj.size * 0.7, obj.size * 2, obj.size * 1.4, 6);
          ctx.fill();
          ctx.fillStyle = "#000000";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(obj.label || "", 0, 0);
        } else if (obj.type === "obstacle" || obj.type === "laser_wall") {
          // Laser Glitch Barrier / Hazard
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 15;
          ctx.fillStyle = "rgba(239, 68, 68, 0.85)";
          ctx.fillRect(-obj.size, -10, obj.size * 2, 20);

          ctx.strokeStyle = "#fef08a";
          ctx.lineWidth = 2;
          ctx.strokeRect(-obj.size, -10, obj.size * 2, 20);

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(obj.label || "ERR", 0, 0);
        }

        ctx.restore();
      });

      // 4. Render Player Cyber Car
      const carBaseY = h - 90;
      const playerScreenX = w / 2 + playerRef.current.laneX * (roadBottomW * 0.44);

      ctx.save();
      ctx.translate(playerScreenX, carBaseY);
      ctx.rotate(playerRef.current.carTilt);

      // Car Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.ellipse(0, 30, 42, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Exhaust Boost Plumes
      if (playerRef.current.isBoosting) {
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.moveTo(-18, 30);
        ctx.lineTo(0, 65 + Math.random() * 20);
        ctx.lineTo(18, 30);
        ctx.fill();
      } else {
        ctx.fillStyle = "#06b6d4";
        ctx.beginPath();
        ctx.moveTo(-14, 28);
        ctx.lineTo(0, 48 + Math.random() * 10);
        ctx.lineTo(14, 28);
        ctx.fill();
      }

      // Underglow
      ctx.shadowColor = playerSuitColor;
      ctx.shadowBlur = 20;
      ctx.fillStyle = playerSuitColor;
      ctx.beginPath();
      ctx.ellipse(0, 10, 46, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      // Car Main Body Hull
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.roundRect(-30, -32, 60, 64, 10);
      ctx.fill();

      // Aerodynamic Cockpit Glass
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.roundRect(-16, -18, 32, 32, 6);
      ctx.fill();

      // Cyber Decals & Wing Spoilers
      ctx.strokeStyle = playerSuitColor;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-30, -32, 60, 64);

      ctx.fillStyle = "#1e293b";
      ctx.fillRect(-38, 18, 76, 8); // Spoiler wing

      // Tail Lights
      ctx.fillStyle = "#ef4444";
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 10;
      ctx.fillRect(-26, 26, 12, 4);
      ctx.fillRect(14, 26, 12, 4);

      // Quantum Shield Visual Effect
      if (hasShieldActive) {
        ctx.shadowColor = "#06b6d4";
        ctx.shadowBlur = 25;
        ctx.strokeStyle = "rgba(6, 182, 212, 0.75)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 54, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      // 5. EMP Shockwave Visual Wave
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

      // 6. Render Sparkle Particles
      particlesRef.current.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, selectedTrack, hasShieldActive, hasMagnetActive, combo, empBlastActive, distance, score, nitro, playerSuitColor]);

  // Handle Game Over
  const handleGameOver = () => {
    setGameState("gameover");
    sound.playError();

    // Reward partial XP & Coins
    const gainedXp = Math.floor(score * 0.15);
    const gainedCoins = Math.floor(tokensCollected * 8);
    if (gainedXp > 0 || gainedCoins > 0) {
      addXpAndCoins(gainedXp, gainedCoins);
    }
  };

  // Handle Victory
  const handleVictory = () => {
    setGameState("victory");
    sound.playLevelUp();

    // Update High Scores
    setHighScores((prev) => {
      const prevBest = prev[selectedTrack.id] || 0;
      if (score > prevBest) {
        const next = { ...prev, [selectedTrack.id]: score };
        localStorage.setItem("desuper_arcade_highscores", JSON.stringify(next));
        return next;
      }
      return prev;
    });

    // Reward Full Rewards
    const totalXp = Math.floor(score * 0.3) + 200;
    const totalCoins = Math.floor(tokensCollected * 15) + 100;
    addXpAndCoins(totalXp, totalCoins);
    progressDailyQuest("streak", 1);
    progressDailyQuest("code", 1);

    try {
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#06b6d4", "#a855f7", "#f59e0b", "#10b981"],
      });
    } catch {}
  };

  // Mobile On-Screen Steering controls
  const handleTouchLeft = () => {
    playerRef.current.laneX = Math.max(-0.85, playerRef.current.laneX - 0.28);
    playerRef.current.carTilt = -0.3;
    setTimeout(() => {
      playerRef.current.carTilt = 0;
    }, 120);
  };

  const handleTouchRight = () => {
    playerRef.current.laneX = Math.min(0.85, playerRef.current.laneX + 0.28);
    playerRef.current.carTilt = 0.3;
    setTimeout(() => {
      playerRef.current.carTilt = 0;
    }, 120);
  };

  const handleTouchBoost = () => {
    if (nitro > 15) {
      setNitro((n) => Math.max(0, n - 20));
      sound.playNitro();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 pb-24 space-y-6">
      {/* Top Banner / Mode Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.15)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-violet-600 to-fuchsia-500 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Flame className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-white font-mono tracking-wide">
                CYBER HIGHWAY RACER
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 font-bold">
                ARCADE ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Steer through supersonic quantum lanes, collect Python tokens, and dodge firewall barriers.
            </p>
          </div>
        </div>

        {/* Global Controls: Music & Track Quick Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMusic}
            className={`px-3 py-1.5 rounded-xl border font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isMusicOn
                ? "bg-violet-900/80 border-violet-400 text-cyan-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>{isMusicOn ? "SYNTH ON" : "SYNTH OFF"}</span>
          </button>
        </div>
      </div>

      {/* Track Selection Bar (When in Menu) */}
      {gameState === "menu" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold text-slate-300 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              SELECT CYBER SECTOR TRACK
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Personal Best: {highScores[selectedTrack.id] || 0} PTS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ARCADE_TRACKS.map((track) => {
              const isSelected = selectedTrack.id === track.id;
              const isLocked = currentLevel < track.unlockedLevel;
              const bestScore = highScores[track.id] || 0;

              return (
                <button
                  key={track.id}
                  disabled={isLocked}
                  onClick={() => {
                    sound.playKeyClick();
                    setSelectedTrack(track);
                  }}
                  className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-44 ${
                    isSelected
                      ? "bg-slate-900/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400"
                      : isLocked
                      ? "bg-slate-950/60 border-slate-800 opacity-60 cursor-not-allowed"
                      : "bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-cyan-400 font-bold">{track.sector}</span>
                      {isLocked ? (
                        <span className="text-[10px] text-rose-400 font-bold">LVL {track.unlockedLevel}+</span>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                          <Trophy className="w-3 h-3" /> {bestScore}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-white font-mono">{track.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{track.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span>Base: {track.baseSpeed} KM/H</span>
                    <span className="text-emerald-400 font-bold">Goal: {track.targetScore}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Launch Action */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-violet-950/40 border border-cyan-500/40 text-center space-y-4 shadow-xl">
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-mono font-bold text-white">READY TO LAUNCH: {selectedTrack.name}</h3>
              <p className="text-xs text-slate-400 font-mono">
                Use <strong className="text-cyan-300">Arrow Keys / A & D</strong> to steer, <strong className="text-amber-300">Up / W</strong> for Nitro, <strong className="text-fuchsia-300">Spacebar</strong> for EMP Pulse.
              </p>
            </div>

            <button
              onClick={() => handleStartGame(selectedTrack)}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-mono font-extrabold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <Play className="w-5 h-5 fill-current" />
              START CYBER RACE
            </button>
          </div>
        </div>
      )}

      {/* Active Game / Play Screen */}
      {(gameState === "playing" || gameState === "paused" || gameState === "gameover" || gameState === "victory") && (
        <div className="space-y-3">
          {/* Real-time In-Game Telemetry HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-mono">
            {/* Speedometer */}
            <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-slate-400">SPEED:</span>
              </div>
              <strong className="text-amber-300 text-sm">{speed} KM/H</strong>
            </div>

            {/* Score */}
            <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-400">SCORE:</span>
              </div>
              <strong className="text-cyan-300 text-sm">{score}</strong>
            </div>

            {/* Combo Streak */}
            <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-fuchsia-400" />
                <span className="text-slate-400">COMBO:</span>
              </div>
              <strong className={`text-sm ${combo > 1 ? "text-fuchsia-300 font-black animate-pulse" : "text-slate-300"}`}>
                {combo}X MULTI
              </strong>
            </div>

            {/* Shield Bar */}
            <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" /> SHIELD
                </span>
                <span className="text-emerald-300 font-bold">{shield}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-200"
                  style={{ width: `${shield}%` }}
                />
              </div>
            </div>

            {/* Nitro Boost Gauge */}
            <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between shadow-inner col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> NITRO
                </span>
                <span className="text-amber-300 font-bold">{Math.round(nitro)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-200"
                  style={{ width: `${nitro}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Game Canvas Viewport */}
          <div className="relative w-full aspect-[16/9] max-h-[520px] rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950 shadow-[0_0_35px_rgba(6,182,212,0.2)]">
            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              className="w-full h-full object-cover block"
            />

            {/* In-Game EMP Trigger Button */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={triggerEmpShockwave}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border flex items-center gap-1.5 transition-all shadow-lg cursor-pointer ${
                  hasEmpAvailable || nitro >= 40
                    ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-300 animate-pulse"
                    : "bg-slate-900/80 border-slate-700 text-slate-500 cursor-not-allowed"
                }`}
                title="Press Spacebar or Click to unleash EMP Blast"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>EMP BLAST (SPACE)</span>
              </button>
            </div>

            {/* Target Goal Progress Overlay */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300 flex items-center gap-2 backdrop-blur-sm">
              <span className="text-slate-400">Target:</span>
              <strong className="text-emerald-300">{score} / {selectedTrack.targetScore} PTS</strong>
            </div>

            {/* Pause Overlay */}
            {gameState === "paused" && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
                <h3 className="text-2xl font-black font-mono text-white tracking-widest">SYSTEM PAUSED</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setGameState("playing")}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase"
                  >
                    RESUME (P)
                  </button>
                  <button
                    onClick={() => setGameState("menu")}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs uppercase"
                  >
                    EXIT TO MENU
                  </button>
                </div>
              </div>
            )}

            {/* Game Over Screen */}
            {gameState === "gameover" && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.4)]">
                  <Flame className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black font-mono text-white">SHIELDS DEPLETED // RACE TERMINATED</h3>
                  <p className="text-xs font-mono text-slate-400">
                    Final Score: <strong className="text-cyan-300">{score} PTS</strong> | Python Tokens: <strong className="text-amber-300">{tokensCollected}</strong>
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStartGame(selectedTrack)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono font-bold text-xs uppercase shadow-lg cursor-pointer"
                  >
                    RETRY RACE
                  </button>
                  <button
                    onClick={() => setGameState("menu")}
                    className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs uppercase cursor-pointer"
                  >
                    TRACK SELECT
                  </button>
                </div>
              </div>
            )}

            {/* Victory Screen */}
            {gameState === "victory" && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <Trophy className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-black font-mono text-emerald-300 tracking-wide">
                    TRACK CLEARED // TARGET REACHED!
                  </h3>
                  <p className="text-xs font-mono text-slate-300">
                    High Speed Mastery Achieved on {selectedTrack.name}
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs font-mono pt-2">
                    <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300">
                      Score: <strong>{score}</strong>
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-amber-300">
                      +XP & Coins Rewarded
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleStartGame(selectedTrack)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-mono font-bold text-xs uppercase shadow-lg cursor-pointer"
                  >
                    RACE AGAIN
                  </button>
                  <button
                    onClick={() => setGameState("menu")}
                    className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs uppercase cursor-pointer"
                  >
                    CHANGE TRACK
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile / Touch On-Screen Driving Controller */}
          <div className="sm:hidden grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={handleTouchLeft}
              className="py-3.5 rounded-xl bg-slate-900 border border-slate-800 active:bg-cyan-900/50 flex items-center justify-center text-cyan-300 font-mono font-bold text-xs"
            >
              <ArrowLeft className="w-5 h-5" /> STEER LEFT
            </button>
            <button
              onClick={handleTouchBoost}
              className="py-3.5 rounded-xl bg-amber-950/80 border border-amber-500/40 active:bg-amber-800 text-amber-300 font-mono font-bold text-xs flex items-center justify-center gap-1"
            >
              <Flame className="w-4 h-4" /> NITRO
            </button>
            <button
              onClick={handleTouchRight}
              className="py-3.5 rounded-xl bg-slate-900 border border-slate-800 active:bg-cyan-900/50 flex items-center justify-center text-cyan-300 font-mono font-bold text-xs"
            >
              STEER RIGHT <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
