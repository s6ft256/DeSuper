import React, { useState, useEffect, useMemo } from "react";
import { useGame } from "../context/GameContext";
import { MISSIONS, RANKS } from "../data/missions";
import { Mission, MissionHint } from "../types";
import { sound } from "../utils/audio";
import {
  Car,
  Zap,
  Navigation as NavIcon,
  Shield,
  Sparkles,
  ChevronRight,
  HelpCircle,
  RotateCw,
  Gauge,
  Compass,
  MapPin,
  CheckCircle2,
  Lock,
  Flame,
  Radio,
  Cpu,
  Layers,
  Award,
  Map,
} from "lucide-react";

interface CarProgressMapProps {
  currentMission: Mission;
  currentHintLevel: number;
  onAdvanceHint: () => void;
  playerCode?: string;
  errorMessage?: string;
  onSelectMission?: (missionId: string) => void;
}

// 27 Waypoint Coordinate Mapping along a winding Cyber Highway Map
// Points are in a 1000 x 480 coordinate space for crisp vector scaling
export const MAP_WAYPOINTS = [
  // Sector 1: Core Awakening (Rank 1 ZERO)
  { level: 1, id: "m1", x: 60, y: 390, sector: "ZERO", name: "Awakening Gate" },
  { level: 2, id: "m2", x: 130, y: 350, sector: "ZERO", name: "Identity Terminal" },
  { level: 3, id: "m3", x: 200, y: 380, sector: "ZERO", name: "Power Influx" },

  // Sector 2: Neon Grid (Rank 2 NOVICE)
  { level: 4, id: "m4", x: 270, y: 320, sector: "NOVICE", name: "Cyber Slicing" },
  { level: 5, id: "m5", x: 340, y: 270, sector: "NOVICE", name: "Telemetry Stream" },
  { level: 6, id: "m6", x: 410, y: 310, sector: "NOVICE", name: "Data Transmutation" },

  // Sector 3: Security Perimeter (Rank 3 APPRENTICE)
  { level: 7, id: "m7", x: 490, y: 380, sector: "APPRENTICE", name: "Perimeter Gate" },
  { level: 8, id: "m8", x: 570, y: 400, sector: "APPRENTICE", name: "Threat Matrix" },
  { level: 9, id: "m9", x: 650, y: 360, sector: "APPRENTICE", name: "Plasma Shield" },

  // Sector 4: Robotics Track (Rank 4 CODER)
  { level: 10, id: "m10", x: 740, y: 330, sector: "CODER", name: "Propulsion Loop" },
  { level: 11, id: "m11", x: 820, y: 280, sector: "CODER", name: "Energy Harvester" },
  { level: 12, id: "m12", x: 900, y: 240, sector: "CODER", name: "Arsenal Sync" },
  { level: 13, id: "m13", x: 930, y: 170, sector: "CODER", name: "Dual Stream" },

  // Sector 5: Data Matrix (Rank 5 DEVELOPER)
  { level: 14, id: "m14", x: 870, y: 120, sector: "DEVELOPER", name: "Cyber Registry" },
  { level: 15, id: "m15", x: 790, y: 100, sector: "DEVELOPER", name: "List Comprehensions" },
  { level: 16, id: "m16", x: 710, y: 130, sector: "DEVELOPER", name: "Regex Extraction" },

  // Sector 6: Algorithm Core (Rank 6 ENGINEER)
  { level: 17, id: "m17", x: 620, y: 110, sector: "ENGINEER", name: "Modular Combustion" },
  { level: 18, id: "m18", x: 540, y: 90, sector: "ENGINEER", name: "Functional Pipeline" },
  { level: 19, id: "m19", x: 460, y: 120, sector: "ENGINEER", name: "Binary Search" },

  // Sector 7: Object Citadel (Rank 7 ARCHITECT)
  { level: 20, id: "m20", x: 380, y: 100, sector: "ARCHITECT", name: "OOP Blueprint" },
  { level: 21, id: "m21", x: 300, y: 80, sector: "ARCHITECT", name: "Inheritance Hierarchy" },

  // Sector 8: Shield Overpass (Rank 8 MASTER)
  { level: 22, id: "m22", x: 220, y: 110, sector: "MASTER", name: "Error Shield" },
  { level: 23, id: "m23", x: 150, y: 140, sector: "MASTER", name: "Collections Matrix" },

  // Sector 9: DeSuper Singularity Core (Rank 9 SUPREME)
  { level: 24, id: "m24", x: 110, y: 210, sector: "SUPREME", name: "NumPy Vectors" },
  { level: 25, id: "m25", x: 160, y: 260, sector: "SUPREME", name: "Pandas Analytics" },
  { level: 26, id: "m26", x: 240, y: 230, sector: "SUPREME", name: "ML Predictor" },
  { level: 27, id: "m27", x: 320, y: 200, sector: "SUPREME", name: "CORE RESTORATION" },
];

export const CarProgressMap: React.FC<CarProgressMapProps> = ({
  currentMission,
  currentHintLevel,
  onAdvanceHint,
  playerCode = "",
  errorMessage = "",
  onSelectMission,
}) => {
  const { player, setSelectedMissionId, setActiveTab } = useGame();

  const [isConsultingAI, setIsConsultingAI] = useState(false);
  const [aiCustomAdvice, setAiCustomAdvice] = useState<string | null>(null);
  const [mapZoomMode, setMapZoomMode] = useState<"standard" | "fullscreen">("standard");
  const [hoveredWaypoint, setHoveredWaypoint] = useState<number | null>(null);
  const [isBoosting, setIsBoosting] = useState(false);

  // Determine car's current position based on current active mission or completed level
  const currentWaypoint = useMemo(() => {
    const wp = MAP_WAYPOINTS.find((w) => w.id === currentMission.id);
    return wp || MAP_WAYPOINTS[0];
  }, [currentMission.id]);

  // Highest completed level
  const highestCompletedLevel = useMemo(() => {
    let max = 0;
    for (const wp of MAP_WAYPOINTS) {
      if (player.completedMissions.includes(wp.id)) {
        if (wp.level > max) max = wp.level;
      }
    }
    return max;
  }, [player.completedMissions]);

  // Calculate car position with smooth transition state
  const [carPos, setCarPos] = useState({ x: currentWaypoint.x, y: currentWaypoint.y });

  useEffect(() => {
    setIsBoosting(true);
    const timer = setTimeout(() => {
      setCarPos({ x: currentWaypoint.x, y: currentWaypoint.y });
      setIsBoosting(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentWaypoint]);

  // Active Hint for Onboard Car Copilot
  const activeHint: MissionHint =
    currentMission.hints[Math.min(currentHintLevel - 1, currentMission.hints.length - 1)] || {
      level: 1,
      label: "Guidance",
      text: "Review the mission objectives and construct the Python statements.",
    };

  const handleAskCopilot = async () => {
    sound.playKeyClick();
    setIsConsultingAI(true);
    try {
      const res = await fetch("/api/ai/companion-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionTitle: currentMission.title,
          concept: currentMission.concept,
          playerCode,
          errorMessage,
          hintLevel: currentHintLevel,
        }),
      });
      const data = await res.json();
      if (data && data.hint) {
        setAiCustomAdvice(data.hint);
        sound.playLaserAction();
      }
    } catch {
      setAiCustomAdvice(`[CAR TELEMETRY]: Core rule: ${currentMission.conceptExplanation}`);
    } finally {
      setIsConsultingAI(false);
    }
  };

  // Generate SVG path string connecting all waypoints in order
  const pathD = useMemo(() => {
    if (MAP_WAYPOINTS.length === 0) return "";
    let d = `M ${MAP_WAYPOINTS[0].x} ${MAP_WAYPOINTS[0].y}`;
    for (let i = 1; i < MAP_WAYPOINTS.length; i++) {
      const prev = MAP_WAYPOINTS[i - 1];
      const curr = MAP_WAYPOINTS[i];
      // Smooth cubic bezier curve between waypoints
      const cx1 = prev.x + (curr.x - prev.x) * 0.5;
      const cy1 = prev.y;
      const cx2 = prev.x + (curr.x - prev.x) * 0.5;
      const cy2 = curr.y;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, []);

  const playerSuitColor = player.customization?.suitColor || "#06b6d4";

  return (
    <div
      id="car-progress-system"
      className="w-full bg-slate-950/95 rounded-2xl border border-violet-500/40 p-4 shadow-[0_0_30px_rgba(139,92,246,0.18)] relative overflow-hidden space-y-4"
    >
      {/* Background Cyber Ambient Radiance */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-cyan-500/15 via-violet-500/15 to-fuchsia-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Map Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          {/* Animated Car Icon Badge */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-md relative"
            style={{
              borderColor: playerSuitColor,
              backgroundColor: `${playerSuitColor}20`,
              boxShadow: `0 0 15px ${playerSuitColor}40`,
            }}
          >
            <Car className="w-5 h-5 text-cyan-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                <span>CYBER RACER TELEMETRY MAP</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-semibold">
                SECTOR {currentWaypoint.sector}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Waypoint #{currentMission.number} of {MISSIONS.length} •{" "}
              <span className="text-emerald-400 font-bold">
                {highestCompletedLevel} Completed
              </span>
            </p>
          </div>
        </div>

        {/* Speed & Coordinates HUD */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-1.5 text-slate-300">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">
              VELOCITY: <strong className="text-amber-300">{260 + currentMission.number * 8} KM/H</strong>
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px]">
              GRID: <strong className="text-cyan-300">[{Math.round(carPos.x)}, {Math.round(carPos.y)}]</strong>
            </span>
          </div>

          <button
            onClick={() => {
              sound.playKeyClick();
              setActiveTab("world");
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-violet-950/80 hover:bg-violet-900/80 border border-violet-500/50 text-cyan-300 hover:text-white transition-all cursor-pointer text-xs shadow-sm"
            title="Open Full World Map"
          >
            <Map className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px]">Full World Map</span>
          </button>
        </div>
      </div>

      {/* Interactive Cyber Highway Map Canvas */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 border border-violet-500/30 overflow-hidden shadow-inner aspect-[21/9] sm:aspect-[24/9] min-h-[220px]">
        {/* Futuristic Map Grid Lines */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.4) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Dynamic SVG Vector Map Screen */}
        <svg
          viewBox="0 0 1000 480"
          className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(6,182,212,0.2)]"
        >
          <defs>
            {/* Road Glow Filters & Gradients */}
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#8b5cf6" stopOpacity="0.9" />
              <stop offset="80%" stopColor="#d946ef" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="1" />
            </linearGradient>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="carGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="7" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sector Region Zone Labels in Background */}
          <g className="opacity-30 font-mono text-[16px] font-black fill-slate-500 select-none">
            <text x="100" y="440">SECTOR 1 // AWAKENING</text>
            <text x="320" y="450">SECTOR 2-3 // GATES</text>
            <text x="750" y="440">SECTOR 4 // ROBOTICS</text>
            <text x="750" y="60">SECTOR 5-6 // ALGORITHMS</text>
            <text x="250" y="50">SECTOR 7-8 // OOP & SHIELDS</text>
            <text x="180" y="170">SECTOR 9 // SUPREME CORE</text>
          </g>

          {/* Background Outer Highway Track Border */}
          <path
            d={pathD}
            fill="none"
            stroke="#1e293b"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Inner Glowing Cyber Highway Track */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#roadGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neonGlow)"
          />

          {/* Animated Highway Dashed Center Strip */}
          <path
            d={pathD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeDasharray="8, 12"
            strokeLinecap="round"
            className="animate-pulse opacity-80"
          />

          {/* Checkpoint Nodes along the route */}
          {MAP_WAYPOINTS.map((wp) => {
            const isCompleted = player.completedMissions.includes(wp.id);
            const isCurrent = wp.id === currentMission.id;
            const isUnlocked = wp.level <= highestCompletedLevel + 1;
            const isHovered = hoveredWaypoint === wp.level;

            let fillColor = "#334155";
            let strokeColor = "#475569";
            let radius = 9;

            if (isCompleted) {
              fillColor = "#10b981";
              strokeColor = "#34d399";
              radius = 11;
            } else if (isCurrent) {
              fillColor = "#06b6d4";
              strokeColor = "#ffffff";
              radius = 14;
            } else if (isUnlocked) {
              fillColor = "#8b5cf6";
              strokeColor = "#c084fc";
              radius = 10;
            }

            return (
              <g
                key={wp.level}
                className="cursor-pointer transition-all duration-300"
                onClick={() => {
                  sound.playKeyClick();
                  if (onSelectMission) {
                    onSelectMission(wp.id);
                  } else {
                    setSelectedMissionId(wp.id);
                  }
                }}
                onMouseEnter={() => setHoveredWaypoint(wp.level)}
                onMouseLeave={() => setHoveredWaypoint(null)}
              >
                {/* Outer Glow Halo for Active / Completed Waypoints */}
                {(isCurrent || isHovered) && (
                  <circle
                    cx={wp.x}
                    cy={wp.y}
                    r={radius + 8}
                    fill={isCurrent ? "rgba(6, 182, 212, 0.3)" : "rgba(139, 92, 246, 0.2)"}
                    className="animate-ping"
                  />
                )}

                {/* Node Body */}
                <circle
                  cx={wp.x}
                  cy={wp.y}
                  r={radius}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  filter={isCurrent ? "url(#neonGlow)" : undefined}
                />

                {/* Level Number text */}
                <text
                  x={wp.x}
                  y={wp.y + 3.5}
                  textAnchor="middle"
                  fill={isCompleted || isCurrent ? "#020617" : "#cbd5e1"}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {wp.level}
                </text>

                {/* Waypoint Hover Tooltip Pin */}
                {(isHovered || isCurrent) && (
                  <g pointerEvents="none" className="transition-all">
                    <rect
                      x={wp.x - 65}
                      y={wp.y - 38}
                      width="130"
                      height="24"
                      rx="6"
                      fill="#090d16"
                      stroke={isCurrent ? "#06b6d4" : "#a855f7"}
                      strokeWidth="1.5"
                    />
                    <text
                      x={wp.x}
                      y={wp.y - 22}
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {wp.level}. {wp.name.toUpperCase()}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* ======================================================== */}
          {/* THE CAR OBJECT: Animated Player Vehicle on Map Screen   */}
          {/* ======================================================== */}
          <g
            id="map-car-object"
            transform={`translate(${carPos.x}, ${carPos.y})`}
            filter="url(#carGlow)"
            className="transition-all duration-700 ease-out"
          >
            {/* Plasma Boost Trails Behind Car */}
            <path
              d="M -26 0 L -45 -6 L -36 0 L -45 6 Z"
              fill={isBoosting ? "#ec4899" : "#06b6d4"}
              className="animate-pulse"
              opacity={isBoosting ? 0.95 : 0.75}
            />

            {/* Neon Underglow Disc */}
            <ellipse
              cx="0"
              cy="2"
              rx="24"
              ry="10"
              fill={playerSuitColor}
              opacity="0.5"
              className="animate-pulse"
            />

            {/* Futuristic Cyber Car Body Chassis (Top-Down Isometric Profile) */}
            {/* Rear Spoiler */}
            <rect x="-24" y="-12" width="5" height="24" rx="2" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
            <line x1="-24" y1="-10" x2="-19" y2="-10" stroke="#06b6d4" strokeWidth="1.5" />
            <line x1="-24" y1="10" x2="-19" y2="10" stroke="#06b6d4" strokeWidth="1.5" />

            {/* Main Aerodynamic Chassis */}
            <path
              d="M -20 -10 L -4 -12 L 14 -8 L 24 -3 L 26 0 L 24 3 L 14 8 L -4 12 L -20 10 Z"
              fill="#090d16"
              stroke={playerSuitColor}
              strokeWidth="2"
            />

            {/* Cockpit Canopy Glass (Cyan Reflective HUD) */}
            <path
              d="M -8 -6 L 4 -7 L 12 -4 L 14 0 L 12 4 L 4 7 L -8 6 Z"
              fill="#06b6d4"
              opacity="0.85"
            />

            {/* Front Headlight Beams */}
            <polygon points="25,-4 48,-10 48,-2 26,-2" fill="#38bdf8" opacity="0.65" />
            <polygon points="25,4 48,10 48,2 26,2" fill="#38bdf8" opacity="0.65" />

            {/* Center Hood Energy Core Line */}
            <line x1="0" y1="0" x2="22" y2="0" stroke="#ffffff" strokeWidth="1.5" />

            {/* Wheels / Repulsor Pods */}
            <rect x="-15" y="-14" width="8" height="3" rx="1.5" fill="#38bdf8" />
            <rect x="8" y="-13" width="8" height="3" rx="1.5" fill="#38bdf8" />
            <rect x="-15" y="11" width="8" height="3" rx="1.5" fill="#38bdf8" />
            <rect x="8" y="10" width="8" height="3" rx="1.5" fill="#38bdf8" />
          </g>
        </svg>

        {/* Floating Mini Legend / Sector Badge */}
        <div className="absolute bottom-2 left-2 z-10 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-violet-500/30 text-[10px] font-mono text-slate-300 shadow-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>VEHICLE: <strong>{player.customization?.name || "CyberOperative"}</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-300">PROGRESS: {highestCompletedLevel}/{MISSIONS.length}</span>
        </div>

        {/* Milestone Fast Jump Button */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
          <div className="px-2.5 py-1 rounded-xl bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-amber-300 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>RANK: {currentMission.rank}</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ONBOARD CAR COPILOT & SMART TELEMETRY GUIDANCE HUD       */}
      {/* ======================================================== */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-violet-500/30 space-y-2.5 shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-violet-300">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-bold">ONBOARD CAR COPILOT // {activeHint.label.toUpperCase()}</span>
          </div>

          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-violet-950/80 border border-violet-500/40 text-cyan-300 font-semibold shadow-sm">
            Copilot Tier {currentHintLevel} / 4
          </span>
        </div>

        {/* Copilot Advice Display */}
        <div className="p-3 rounded-lg bg-slate-950/80 border border-violet-500/20 text-xs text-slate-200 font-sans leading-relaxed">
          {aiCustomAdvice ? (
            <p className="text-cyan-200 font-mono font-medium">{aiCustomAdvice}</p>
          ) : (
            <p>{activeHint.text}</p>
          )}
        </div>

        {/* Copilot Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <button
            id="car-copilot-scan-btn"
            onClick={handleAskCopilot}
            disabled={isConsultingAI}
            className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 hover:text-white bg-violet-950/70 hover:bg-violet-900/70 px-3 py-1.5 rounded-xl border border-violet-500/50 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isConsultingAI ? "Scanning Roadway Neural Core..." : "Vehicle AI Diagnostic Scan"}</span>
          </button>

          {currentHintLevel < 4 && (
            <button
              id="car-copilot-advance-hint-btn"
              onClick={onAdvanceHint}
              className="flex items-center gap-1 text-[11px] font-mono text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900/70 px-3 py-1.5 rounded-xl border border-amber-500/50 transition-all cursor-pointer shadow-sm"
            >
              <span>Next Copilot Clue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
