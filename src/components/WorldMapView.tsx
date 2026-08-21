import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGame } from "../context/GameContext";
import { MISSIONS, RANKS } from "../data/missions";
import {
  WORLD_MAP_COORDINATES,
  generateWorldMapPathSvg,
  generateActiveMapPathSvg,
  getCoordinateForLevel,
  calculateCarHeading,
} from "../data/mapCoordinates";
import { MapCoordinate } from "../types";
import { sound } from "../utils/audio";
import {
  Car,
  Compass,
  Zap,
  Gauge,
  MapPin,
  CheckCircle2,
  Lock,
  Flame,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Award,
  Layers,
  Sparkles,
  ArrowUpRight,
  Shield,
  Radio,
  Crosshair,
  Sliders,
  Cpu,
  RotateCw,
  FastForward,
} from "lucide-react";

export const WorldMapView: React.FC = () => {
  const {
    player,
    currentLevel,
    setCurrentLevel,
    carPosition,
    moveCarToLevel,
    setSelectedMissionId,
    setActiveTab,
  } = useGame();

  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState<MapCoordinate>(() =>
    getCoordinateForLevel(currentLevel)
  );
  const [prevLevel, setPrevLevel] = useState<number>(currentLevel);
  const [isDriving, setIsDriving] = useState<boolean>(false);
  const [isAutoCruising, setIsAutoCruising] = useState<boolean>(false);
  const [cruiseSpeed, setCruiseSpeed] = useState<"normal" | "turbo" | "warp">("normal");
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Highest completed level
  const highestCompletedLevel = useMemo(() => {
    let max = 0;
    for (const coord of WORLD_MAP_COORDINATES) {
      if (player.completedMissions.includes(coord.missionId)) {
        if (coord.level > max) max = coord.level;
      }
    }
    return max;
  }, [player.completedMissions]);

  // Sync selected waypoint when currentLevel changes
  useEffect(() => {
    setSelectedWaypoint(getCoordinateForLevel(currentLevel));
  }, [currentLevel]);

  // Calculate motion keyframes along the SVG path when currentLevel changes
  const pathWaypoints = useMemo(() => {
    const targetCoord = getCoordinateForLevel(currentLevel);
    const targetHeading = calculateCarHeading(currentLevel);

    if (prevLevel === currentLevel) {
      return {
        x: [targetCoord.x],
        y: [targetCoord.y],
        rotate: [targetHeading],
        duration: 0.5,
      };
    }

    // Sequence of levels from prevLevel to currentLevel
    const sequence: number[] = [];
    const step = currentLevel > prevLevel ? 1 : -1;
    for (
      let l = prevLevel;
      currentLevel > prevLevel ? l <= currentLevel : l >= currentLevel;
      l += step
    ) {
      sequence.push(l);
    }

    const xs: number[] = [];
    const ys: number[] = [];
    const headings: number[] = [];

    for (let i = 0; i < sequence.length; i++) {
      const lvl = sequence[i];
      const c = getCoordinateForLevel(lvl);
      xs.push(c.x);
      ys.push(c.y);
      headings.push(calculateCarHeading(lvl));
    }

    // Dynamic duration based on jump distance & cruise speed
    const jumps = Math.abs(currentLevel - prevLevel);
    const speedMultiplier = cruiseSpeed === "warp" ? 0.35 : cruiseSpeed === "turbo" ? 0.6 : 1.0;
    const duration = Math.max(0.4, Math.min(2.5, (0.35 + jumps * 0.16) * speedMultiplier));

    return {
      x: xs,
      y: ys,
      rotate: headings,
      duration,
    };
  }, [currentLevel, prevLevel, cruiseSpeed]);

  // Trigger driving animation and audio feedback on currentLevel update
  useEffect(() => {
    if (prevLevel !== currentLevel) {
      setIsDriving(true);
      sound.playLaserAction();

      const timer = setTimeout(() => {
        setPrevLevel(currentLevel);
        setIsDriving(false);
      }, pathWaypoints.duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [currentLevel, prevLevel, pathWaypoints.duration]);

  // Auto-cruise simulation loop
  useEffect(() => {
    if (!isAutoCruising) return;
    const intervalMs = cruiseSpeed === "warp" ? 900 : cruiseSpeed === "turbo" ? 1400 : 2000;
    const interval = setInterval(() => {
      setCurrentLevel((prev) => {
        const next = prev >= WORLD_MAP_COORDINATES.length ? 1 : prev + 1;
        return next;
      });
    }, intervalMs);
    return () => clearInterval(interval);
  }, [isAutoCruising, cruiseSpeed, setCurrentLevel]);

  // Look up full mission metadata for the selected waypoint
  const currentMissionData = useMemo(() => {
    return MISSIONS.find((m) => m.id === selectedWaypoint.missionId) || MISSIONS[0];
  }, [selectedWaypoint.missionId]);

  const svgFullMapPath = useMemo(() => generateWorldMapPathSvg(), []);
  const svgActiveMapPath = useMemo(() => generateActiveMapPathSvg(currentLevel), [currentLevel]);
  const playerSuitColor = player.customization?.suitColor || "#06b6d4";

  // Handle clicking a node on the map
  const handleSelectLevel = (lvl: number) => {
    setIsAutoCruising(false);
    moveCarToLevel(lvl);
    setSelectedWaypoint(getCoordinateForLevel(lvl));
  };

  // Launch directly into coding mission
  const handleLaunchMission = () => {
    sound.playKeyClick();
    setSelectedMissionId(selectedWaypoint.missionId);
    setActiveTab("missions");
  };

  // Sectors for quick jumping
  const sectors = useMemo(() => {
    const map = new Map<string, { sector: string; sectorName: string; startLevel: number; color: string }>();
    for (const c of WORLD_MAP_COORDINATES) {
      if (!map.has(c.sector)) {
        map.set(c.sector, {
          sector: c.sector,
          sectorName: c.sectorName,
          startLevel: c.level,
          color: c.color,
        });
      }
    }
    return Array.from(map.values());
  }, []);

  return (
    <div id="world-map-view" className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Top Banner / Telemetry Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.15)] backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <motion.div
            className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg relative transition-all"
            style={{
              borderColor: playerSuitColor,
              backgroundColor: `${playerSuitColor}20`,
              boxShadow: `0 0 20px ${playerSuitColor}50`,
            }}
            animate={isDriving ? { scale: [1, 1.1, 1], rotate: [0, -3, 3, 0] } : {}}
            transition={{ repeat: isDriving ? Infinity : 0, duration: 0.4 }}
          >
            <Car className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border border-slate-950" />
          </motion.div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold font-mono text-white tracking-wide flex items-center gap-2">
                <span>DESUPER WORLD MAPWAY</span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 font-bold shadow-sm">
                LEVEL {currentLevel} OF {WORLD_MAP_COORDINATES.length}
              </span>
              {isDriving && (
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-amber-950/90 border border-amber-500/60 text-amber-300 font-bold animate-pulse">
                  PROPULSION ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
              <span>Racer: <strong className="text-slate-200">{player.customization?.name || "CyberOperative"}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{highestCompletedLevel} Checkpoints Cleared</span>
            </p>
          </div>
        </div>

        {/* Live Gauges & Cruise Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2 text-slate-300 shadow-inner">
            <Gauge className={`w-4 h-4 text-amber-400 ${isDriving ? "animate-spin" : "animate-pulse"}`} />
            <span>
              SPEED: <strong className="text-amber-300">{isDriving ? 420 + currentLevel * 12 : 260 + currentLevel * 8} KM/H</strong>
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2 text-slate-300 shadow-inner">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>
              COORDINATES: <strong className="text-cyan-300">[{Math.round(carPosition.x)}, {Math.round(carPosition.y)}]</strong>
            </span>
          </div>

          {/* Cruise Speed Toggle */}
          <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-0.5 text-[10px]">
            <button
              onClick={() => setCruiseSpeed("normal")}
              className={`px-2 py-1 rounded-lg transition-all ${
                cruiseSpeed === "normal" ? "bg-cyan-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              1x
            </button>
            <button
              onClick={() => setCruiseSpeed("turbo")}
              className={`px-2 py-1 rounded-lg transition-all ${
                cruiseSpeed === "turbo" ? "bg-amber-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              2x Nitro
            </button>
            <button
              onClick={() => setCruiseSpeed("warp")}
              className={`px-2 py-1 rounded-lg transition-all ${
                cruiseSpeed === "warp" ? "bg-fuchsia-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              3x Warp
            </button>
          </div>

          {/* Cruise Mode Toggle */}
          <button
            id="world-map-cruise-btn"
            onClick={() => {
              sound.playKeyClick();
              setIsAutoCruising((prev) => !prev);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs border transition-all cursor-pointer shadow-sm ${
              isAutoCruising
                ? "bg-amber-950/80 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse"
                : "bg-slate-950/80 border-violet-500/40 text-slate-300 hover:text-cyan-300 hover:border-cyan-400"
            }`}
          >
            {isAutoCruising ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>Auto-Cruising...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                <span>Auto-Cruise Map</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sector Quick-Travel Rail */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-mono text-slate-500 shrink-0 uppercase tracking-wider font-semibold pl-1">
          Sector Rail:
        </span>
        {sectors.map((s) => {
          const isCurrentSector = selectedWaypoint.sector === s.sector;
          return (
            <button
              key={s.sector}
              onClick={() => handleSelectLevel(s.startLevel)}
              className={`shrink-0 px-3 py-1 rounded-xl text-xs font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
                isCurrentSector
                  ? "bg-slate-900 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.35)] font-bold"
                  : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: s.color, boxShadow: `0 0 6px ${s.color}` }}
              />
              <span>{s.sector}</span>
            </button>
          );
        })}
      </div>

      {/* Main World Map Vector Canvas */}
      <div
        ref={mapContainerRef}
        id="world-map-canvas-container"
        className="relative w-full rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900/95 to-slate-950 border border-violet-500/30 overflow-hidden shadow-2xl aspect-[16/9] min-h-[380px] sm:min-h-[500px]"
      >
        {/* Futuristic Background Circuit Grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.5) 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Ambient Glow Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* SVG Map Scene */}
        <svg
          viewBox="0 0 1600 880"
          className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(6,182,212,0.15)] select-none"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="worldRoadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="75%" stopColor="#ec4899" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="activeTrackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="glowUnderTrack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0.35" />
            </linearGradient>

            {/* Neon Filters */}
            <filter id="neonBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="activeGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="carAuraGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="9" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sector Region Watermarks / Landmark Callouts */}
          <g className="font-mono text-[13px] font-black fill-slate-700/60 uppercase select-none tracking-widest">
            <text x="90" y="840">SECTOR 01 // GENESIS AWAKENING</text>
            <text x="430" y="820">SECTOR 02 // NEON GRIDWAY</text>
            <text x="800" y="850">SECTOR 03 // FIREWALL CANYON</text>
            <text x="1200" y="740">SECTOR 04 // AUTOMATED SPEEDWAY</text>
            <text x="1350" y="340">SECTOR 05 // DATA MATRIX VAULT</text>
            <text x="1000" y="90">SECTOR 06 // ALGORITHM REACTOR</text>
            <text x="600" y="100">SECTOR 07 // OBJECT CITADEL</text>
            <text x="150" y="150">SECTOR 08 // SHIELD OVERPASS</text>
            <text x="100" y="390">SECTOR 09 // QUANTUM FORGE</text>
            <text x="450" y="490">SECTOR 10 // SUPREME SINGULARITY</text>
          </g>

          {/* Wide Track Backdrop Glow */}
          <path
            d={svgFullMapPath}
            fill="none"
            stroke="url(#glowUnderTrack)"
            strokeWidth="38"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Outer Road Bed Asphalt Base */}
          <path
            d={svgFullMapPath}
            fill="none"
            stroke="#0b1120"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Full Cyber Highway Centerline (Default Track) */}
          <path
            d={svgFullMapPath}
            fill="none"
            stroke="url(#worldRoadGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neonBlur)"
          />

          {/* ACTIVE HIGHWAY TRAIL: Illuminates energized beam up to currentLevel */}
          {svgActiveMapPath && (
            <path
              d={svgActiveMapPath}
              fill="none"
              stroke="url(#activeTrackGrad)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#activeGlow)"
            />
          )}

          {/* High-speed White Dashed Striping */}
          <path
            d={svgFullMapPath}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeDasharray="10, 14"
            strokeLinecap="round"
            className="animate-pulse opacity-85"
          />

          {/* Waypoint Nodes along the Track */}
          {WORLD_MAP_COORDINATES.map((wp) => {
            const isCompleted = player.completedMissions.includes(wp.missionId);
            const isCurrent = wp.level === currentLevel;
            const isSelected = wp.level === selectedWaypoint.level;
            const isUnlocked = wp.level <= highestCompletedLevel + 1;
            const isHovered = hoveredLevel === wp.level;

            let fillColor = "#1e293b";
            let strokeColor = "#475569";
            let radius = 10;

            if (isCompleted) {
              fillColor = "#10b981";
              strokeColor = "#34d399";
              radius = 12;
            } else if (isCurrent) {
              fillColor = "#06b6d4";
              strokeColor = "#ffffff";
              radius = 15;
            } else if (isUnlocked) {
              fillColor = "#8b5cf6";
              strokeColor = "#c084fc";
              radius = 11;
            }

            return (
              <g
                key={wp.level}
                className="cursor-pointer transition-all duration-300"
                onClick={() => handleSelectLevel(wp.level)}
                onMouseEnter={() => setHoveredLevel(wp.level)}
                onMouseLeave={() => setHoveredLevel(null)}
              >
                {/* Outer Pulsing Rings for Current / Selected / Hovered */}
                {(isCurrent || isSelected || isHovered) && (
                  <circle
                    cx={wp.x}
                    cy={wp.y}
                    r={radius + 10}
                    fill={isCurrent ? "rgba(6, 182, 212, 0.4)" : "rgba(168, 85, 247, 0.25)"}
                    className="animate-ping"
                  />
                )}

                {/* Node Solid Base */}
                <circle
                  cx={wp.x}
                  cy={wp.y}
                  r={radius}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="3"
                  filter={isCurrent ? "url(#neonBlur)" : undefined}
                />

                {/* Level Number */}
                <text
                  x={wp.x}
                  y={wp.y + 4}
                  textAnchor="middle"
                  fill={isCompleted || isCurrent ? "#020617" : "#cbd5e1"}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {wp.level}
                </text>

                {/* Quick Map Tooltip Tag */}
                {(isHovered || isSelected) && (
                  <g pointerEvents="none" className="transition-all">
                    <rect
                      x={wp.x - 75}
                      y={wp.y - 44}
                      width="150"
                      height="30"
                      rx="8"
                      fill="#090d16"
                      stroke={isCurrent ? "#06b6d4" : "#a855f7"}
                      strokeWidth="1.8"
                      filter="drop-shadow(0 4px 10px rgba(0,0,0,0.6))"
                    />
                    <text
                      x={wp.x}
                      y={wp.y - 28}
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      LVL {wp.level}: {wp.title.toUpperCase()}
                    </text>
                    <text
                      x={wp.x}
                      y={wp.y - 18}
                      textAnchor="middle"
                      fill={isCompleted ? "#34d399" : "#38bdf8"}
                      fontSize="8"
                      fontFamily="monospace"
                    >
                      {isCompleted ? "✓ CLEARED" : wp.concept}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* ========================================================================= */}
          {/* FRAMER MOTION CAR OBJECT: Animates along SVG map path on currentLevel update */}
          {/* ========================================================================= */}
          <motion.g
            id="world-map-car-object"
            initial={false}
            animate={{
              x: pathWaypoints.x,
              y: pathWaypoints.y,
              rotate: pathWaypoints.rotate,
            }}
            transition={{
              duration: pathWaypoints.duration,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "0px 0px" }}
            filter="url(#carAuraGlow)"
          >
            {/* Plasma Exhaust Boost Trails */}
            <motion.path
              d="M -30 0 L -54 -9 L -44 0 L -54 9 Z"
              fill={isDriving || isAutoCruising ? "#f59e0b" : "#06b6d4"}
              animate={
                isDriving || isAutoCruising
                  ? {
                      scale: [1, 1.4, 1.1, 1.3],
                      opacity: [0.8, 1, 0.9, 1],
                    }
                  : { scale: 1, opacity: 0.75 }
              }
              transition={{ repeat: Infinity, duration: 0.25 }}
            />

            {/* Neon Chassis Underglow Ring */}
            <motion.ellipse
              cx="0"
              cy="0"
              rx="30"
              ry="16"
              fill={playerSuitColor}
              animate={
                isDriving
                  ? { rx: [28, 38, 28], ry: [14, 20, 14], opacity: [0.6, 0.9, 0.6] }
                  : { rx: 28, ry: 14, opacity: 0.6 }
              }
              transition={{ repeat: Infinity, duration: 0.3 }}
            />

            {/* Rear Spoiler Wings */}
            <rect
              x="-26"
              y="-14"
              width="6"
              height="28"
              rx="2"
              fill="#0f172a"
              stroke="#06b6d4"
              strokeWidth="1.5"
            />
            <line x1="-26" y1="-12" x2="-20" y2="-12" stroke="#06b6d4" strokeWidth="1.5" />
            <line x1="-26" y1="12" x2="-20" y2="12" stroke="#06b6d4" strokeWidth="1.5" />

            {/* Main Cyber Chassis Body */}
            <path
              d="M -22 -12 L -4 -14 L 16 -9 L 28 -3 L 30 0 L 28 3 L 16 9 L -4 14 L -22 12 Z"
              fill="#090d16"
              stroke={playerSuitColor}
              strokeWidth="2.5"
            />

            {/* Reflective Neon Cockpit Windshield */}
            <path
              d="M -9 -7 L 5 -8 L 14 -4 L 16 0 L 14 4 L 5 8 L -9 7 Z"
              fill="#06b6d4"
              opacity="0.85"
            />

            {/* Headlight Forward Projector Beams */}
            <polygon points="29,-5 68,-16 68,-2 30,-3" fill="#38bdf8" opacity="0.8" />
            <polygon points="29,5 68,16 68,2 30,3" fill="#38bdf8" opacity="0.8" />

            {/* Central Power Core Stripe */}
            <line x1="-5" y1="0" x2="26" y2="0" stroke="#ffffff" strokeWidth="1.8" />

            {/* High-traction Repulsor Wheel Pods */}
            <rect x="-18" y="-16" width="9" height="4" rx="2" fill="#38bdf8" />
            <rect x="9" y="-15" width="9" height="4" rx="2" fill="#38bdf8" />
            <rect x="-18" y="12" width="9" height="4" rx="2" fill="#38bdf8" />
            <rect x="9" y="11" width="9" height="4" rx="2" fill="#38bdf8" />
          </motion.g>
        </svg>

        {/* Bottom Floating Map Legend */}
        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-3 bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-violet-500/30 text-[11px] font-mono text-slate-300 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-400 border border-white animate-pulse" />
            <span>Car Position</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-violet-500 border border-violet-300" />
            <span>Unlocked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-700 border border-slate-600" />
            <span>Locked</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* LEVEL DOSSIER & VEHICLE NAVIGATION CONTROLS              */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Selected Checkpoint Dossier */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-slate-900/95 border border-violet-500/30 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-sm text-slate-950"
                style={{ backgroundColor: selectedWaypoint.color }}
              >
                #{selectedWaypoint.level}
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  {selectedWaypoint.sector} • {selectedWaypoint.sectorName}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white font-mono">
                  {selectedWaypoint.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-xl bg-violet-950/80 border border-violet-500/40 text-violet-300 font-semibold">
                Concept: {selectedWaypoint.concept}
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-bold">
                {currentMissionData.difficulty}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {selectedWaypoint.description || currentMissionData.story}
          </p>

          {/* Objectives Preview */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              Checkpoint Objectives:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {currentMissionData.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-mono font-bold mt-0.5">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Reward: <strong className="text-amber-300">+{currentMissionData.xpReward} XP</strong></span>
              <span>•</span>
              <span className="text-emerald-400">+{currentMissionData.coinsReward} Coins</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                id="world-map-jump-car-btn"
                onClick={() => moveCarToLevel(selectedWaypoint.level)}
                className="px-3.5 py-2 rounded-xl bg-slate-950 border border-violet-500/40 hover:border-cyan-400 text-xs font-mono text-slate-200 hover:text-cyan-300 transition-all cursor-pointer shadow-sm"
              >
                Position Car
              </button>

              <button
                id="world-map-race-btn"
                onClick={() => {
                  sound.playWarp();
                  setActiveTab("arcade");
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-300 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Race Track</span>
              </button>

              <button
                id="world-map-deploy-btn"
                onClick={handleLaunchMission}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.4)]"
              >
                <span>Deploy Mission #{selectedWaypoint.level}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Step Navigator & Car Level Slider */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/95 border border-violet-500/30 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-violet-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                VEHICLE LEVEL NAVIGATOR
              </span>
              <span className="text-cyan-300">Lvl {currentLevel} / {WORLD_MAP_COORDINATES.length}</span>
            </div>

            {/* Range Slider to smoothly move the car */}
            <div className="space-y-1.5">
              <input
                id="car-level-slider"
                type="range"
                min={1}
                max={WORLD_MAP_COORDINATES.length}
                value={currentLevel}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  moveCarToLevel(val);
                }}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Lvl 1 (Zero)</span>
                <span>Lvl 90 (Developer)</span>
                <span>Lvl 180 (Supreme)</span>
              </div>
            </div>

            {/* Step Backward / Forward Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                id="world-map-prev-btn"
                onClick={() => handleSelectLevel(Math.max(1, currentLevel - 1))}
                disabled={currentLevel <= 1}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:border-violet-500/50 disabled:opacity-40 transition-all cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Level</span>
              </button>

              <button
                id="world-map-next-btn"
                onClick={() => handleSelectLevel(Math.min(WORLD_MAP_COORDINATES.length, currentLevel + 1))}
                disabled={currentLevel >= WORLD_MAP_COORDINATES.length}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:border-violet-500/50 disabled:opacity-40 transition-all cursor-pointer shadow-sm"
              >
                <span>Next Level</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Stats Box */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Current Sector:</span>
              <strong className="text-cyan-300">{selectedWaypoint.sector}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Map Progress:</span>
              <strong className="text-emerald-400">
                {Math.round((highestCompletedLevel / WORLD_MAP_COORDINATES.length) * 100)}%
              </strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Heading Angle:</span>
              <strong className="text-amber-300">{Math.round(carPosition.heading || 0)}°</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Car Engine State:</span>
              <strong className={isDriving ? "text-amber-300 animate-pulse" : "text-emerald-400"}>
                {isDriving ? "ACCELERATING" : "CRUISING / READY"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

