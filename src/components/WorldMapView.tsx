import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGame } from "../context/GameContext";
import { MISSIONS, RANKS } from "../data/missions";
import {
  WORLD_MAP_COORDINATES,
  generateWorldMapPathSvg,
  getCoordinateForLevel,
} from "../data/mapCoordinates";
import { MapCoordinate } from "../types";
import { sound } from "../utils/audio";
import {
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
  BookOpen,
  Map as MapIcon,
} from "lucide-react";

export const WorldMapView: React.FC = () => {
  const {
    player,
    currentLevel,
    setCurrentLevel,
    setSelectedMissionId,
    setActiveTab,
  } = useGame();

  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState<MapCoordinate>(() =>
    getCoordinateForLevel(currentLevel)
  );
  const [isDriving, setIsDriving] = useState<boolean>(false);
  const [isAutoCruising, setIsAutoCruising] = useState<boolean>(false);
  const [cruiseSpeed, setCruiseSpeed] = useState<"normal" | "turbo" | "warp">("normal");
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const visibleWaypoints = useMemo(() => {
    const currentIndex = WORLD_MAP_COORDINATES.findIndex((w) => w.missionId === selectedWaypoint.missionId);
    const start = Math.max(0, currentIndex - 10);
    const end = Math.min(WORLD_MAP_COORDINATES.length, currentIndex + 15);
    return WORLD_MAP_COORDINATES.slice(start, end);
  }, [selectedWaypoint.missionId]);

  const highestCompletedLevel = useMemo(() => {
    let max = 0;
    for (const coord of WORLD_MAP_COORDINATES) {
      if (player.completedMissions.includes(coord.missionId)) {
        if (coord.level > max) max = coord.level;
      }
    }
    return max;
  }, [player.completedMissions]);

  useEffect(() => {
    setSelectedWaypoint(getCoordinateForLevel(currentLevel));
  }, [currentLevel]);

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
  }, [isAutoCruising, cruiseSpeed]);

  const currentMissionData = useMemo(() => {
    return MISSIONS.find((m) => m.id === selectedWaypoint.missionId) || MISSIONS[0];
  }, [selectedWaypoint.missionId]);

  const handleSelectLevel = (level: number) => {
    setCurrentLevel(level);
    sound.playKeyClick();
    const wp = getCoordinateForLevel(level);
    setSelectedWaypoint(wp);
    if (wp.missionId) {
      setSelectedMissionId(wp.missionId);
    }
  };

  const handleDriveToggle = () => {
    if (isDriving) {
      setIsDriving(false);
      setIsAutoCruising(false);
    } else {
      setIsDriving(true);
      sound.playWarp();
      handleSelectLevel(currentLevel);
    }
  };

  const handlePrevLevel = () => {
    handleSelectLevel(Math.max(1, currentLevel - 1));
  };

  const handleNextLevel = () => {
    handleSelectLevel(Math.min(WORLD_MAP_COORDINATES.length, currentLevel + 1));
  };

  return (
    <div id="world-map-view" className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-700">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-slate-700 bg-slate-800">
            <MapIcon className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border border-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold font-mono text-white tracking-wide flex items-center gap-2">
                <span>DESUPER WORLD MAPWAY</span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-cyan-300 font-bold">
                LEVEL {currentLevel} OF {WORLD_MAP_COORDINATES.length}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
              <span><strong className="text-slate-200">{player.customization?.name || "CyberOperative"}</strong></span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-bold">{highestCompletedLevel} Checkpoints</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDriveToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold cursor-pointer border ${
              isDriving
                ? "bg-rose-900 border-rose-500 text-rose-200"
                : "bg-emerald-900 border-emerald-500 text-emerald-200"
            }`}
          >
            {isDriving ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>STOP CRUISE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>AUTO CRUISE</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-400">
            <span>SPEED:</span>
            {["normal", "turbo", "warp"].map((s) => (
              <button
                key={s}
                onClick={() => setCruiseSpeed(s as typeof cruiseSpeed)}
                className={`px-1.5 py-0.5 rounded-md border cursor-pointer ${
                  cruiseSpeed === s
                    ? "bg-slate-800 border-cyan-400 text-cyan-300"
                    : "border-transparent text-slate-500"
                }`}
              >
                {s === "normal" ? "1x" : s === "turbo" ? "2x" : "4x"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={mapContainerRef}
        className="relative w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden aspect-[16/9] sm:aspect-[21/9] min-h-[320px]"
      >
        <svg
          viewBox="0 0 1600 880"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#ec4899" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="1" />
            </linearGradient>
          </defs>

          <g className="opacity-30 font-mono text-[14px] font-black fill-slate-500 select-none uppercase tracking-wider">
            <text x="90" y="840">SECTOR 01 // AWAKENING</text>
            <text x="430" y="820">SECTOR 02 // NEON GRID</text>
            <text x="800" y="850">SECTOR 03 // FIREWALL</text>
            <text x="1200" y="740">SECTOR 04 // ROBOTICS</text>
            <text x="1350" y="340">SECTOR 05 // DATA VAULT</text>
            <text x="1000" y="90">SECTOR 06 // ALGORITHMS</text>
            <text x="600" y="100">SECTOR 07 // CITADEL</text>
            <text x="150" y="150">SECTOR 08 // SHIELDS</text>
            <text x="100" y="390">SECTOR 09 // QUANTUM</text>
            <text x="450" y="490">SECTOR 10 // SINGULARITY</text>
          </g>

          <path d={generateWorldMapPathSvg()} fill="none" stroke="#1e293b" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
          <path d={generateWorldMapPathSvg()} fill="none" stroke="url(#roadGrad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d={generateWorldMapPathSvg()} fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="8, 12" strokeLinecap="round" className="opacity-80" />

          {visibleWaypoints.map((wp) => {
            const isCompleted = player.completedMissions.includes(wp.missionId);
            const isCurrent = wp.missionId === selectedWaypoint.missionId;
            const isUnlocked = wp.level <= highestCompletedLevel + 1;
            const isHovered = hoveredLevel === wp.level;

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
                className="cursor-pointer"
                onClick={() => {
                  sound.playKeyClick();
                  handleSelectLevel(wp.level);
                }}
                onMouseEnter={() => setHoveredLevel(wp.level)}
                onMouseLeave={() => setHoveredLevel(null)}
              >
                {(isCurrent || isHovered) && (
                  <circle cx={wp.x} cy={wp.y} r={radius + 8} fill={isCurrent ? "rgba(6, 182, 212, 0.3)" : "rgba(139, 92, 246, 0.2)"} />
                )}

                <circle cx={wp.x} cy={wp.y} r={radius} fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
                <text x={wp.x} y={wp.y + 3.5} textAnchor="middle" fill={isCompleted || isCurrent ? "#020617" : "#cbd5e1"} fontSize="9" fontFamily="monospace" fontWeight="bold" pointerEvents="none">
                  {wp.level}
                </text>

                {(isHovered || isCurrent) && (
                  <g pointerEvents="none">
                    <rect x={wp.x - 75} y={wp.y - 38} width="150" height="24" rx="6" fill="#090d16" stroke={isCurrent ? "#06b6d4" : "#a855f7"} strokeWidth="1.5" />
                    <text x={wp.x} y={wp.y - 22} textAnchor="middle" fill="#f8fafc" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      {wp.level}. {wp.title.toUpperCase()}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-3 bg-slate-950/90 px-3.5 py-2 rounded-2xl border border-slate-700 text-[11px] font-mono text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-400 border border-white" />
            <span>Active</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-700 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3.5">
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
              <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
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

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                setSelectedMissionId(selectedWaypoint.missionId);
                setActiveTab("missions");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold cursor-pointer border border-slate-700"
            >
              <Play className="w-3.5 h-3.5" />
              <span>START MISSION</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevLevel}
                disabled={currentLevel <= 1}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextLevel}
                disabled={currentLevel >= WORLD_MAP_COORDINATES.length}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-700 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400 border-b border-slate-800 pb-3.5">
            <span className="text-cyan-300 font-bold">MISSION DETAILS</span>
            <span className="text-amber-300">#{selectedWaypoint.level}</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
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
              <span>Status:</span>
              <strong className={isDriving ? "text-amber-300" : "text-emerald-400"}>
                {isDriving ? "ACTIVE" : "READY"}
              </strong>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 font-bold">ACTIVE OBJECTIVES:</span>
            <ul className="space-y-1">
              {currentMissionData.objectives.slice(0, 3).map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300 font-mono">
                  <span className="text-cyan-400">▹</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
