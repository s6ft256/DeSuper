import { MapCoordinate } from "../types";
import { MISSIONS, RANKS } from "./missions";

// Sector metadata for all 10 ranks
const SECTOR_INFO: Record<string, { sector: string; sectorName: string; color: string }> = {
  ZERO: { sector: "SECTOR 01", sectorName: "Genesis Awakening", color: "#94a3b8" },
  NOVICE: { sector: "SECTOR 02", sectorName: "Neon Gridway", color: "#38bdf8" },
  APPRENTICE: { sector: "SECTOR 03", sectorName: "Firewall Canyon", color: "#34d399" },
  CODER: { sector: "SECTOR 04", sectorName: "Automated Speedway", color: "#fbbf24" },
  DEVELOPER: { sector: "SECTOR 05", sectorName: "Data Matrix Vault", color: "#f97316" },
  ENGINEER: { sector: "SECTOR 06", sectorName: "Algorithm Reactor", color: "#ec4899" },
  ARCHITECT: { sector: "SECTOR 07", sectorName: "Object Citadel", color: "#a855f7" },
  MASTER: { sector: "SECTOR 08", sectorName: "Shield Overpass", color: "#06b6d4" },
  GRANDMASTER: { sector: "SECTOR 09", sectorName: "Quantum Forge", color: "#e11d48" },
  SUPREME: { sector: "SECTOR 10", sectorName: "Supreme Singularity", color: "#eab308" },
};

// Generates coordinates in a continuous winding cyber circuit across 180 levels
function generateCircuitCoordinates(): MapCoordinate[] {
  const totalLevels = MISSIONS.length; // 180
  const coords: MapCoordinate[] = [];

  // Define 10 sector anchor zones across an expanded 1800 x 900 canvas
  const sectorPaths = [
    // Sector 1: Bottom-left corner heading right
    { startX: 80, startY: 760, endX: 380, endY: 760, curvature: 40 },
    // Sector 2: Sweeping up-right through neon flats
    { startX: 420, startY: 740, endX: 740, endY: 710, curvature: -50 },
    // Sector 3: Canyon curve heading toward bottom-right
    { startX: 780, startY: 720, endX: 1120, endY: 770, curvature: 60 },
    // Sector 4: Climbing up right border
    { startX: 1170, startY: 740, endX: 1480, endY: 580, curvature: -70 },
    // Sector 5: Reaching top right plateau
    { startX: 1480, startY: 530, endX: 1360, endY: 220, curvature: 60 },
    // Sector 6: Sweeping west across upper northern highway
    { startX: 1310, startY: 170, endX: 950, endY: 130, curvature: -45 },
    // Sector 7: Upper-middle citadel descent
    { startX: 900, startY: 140, endX: 560, endY: 160, curvature: 55 },
    // Sector 8: Descending northwest overpass
    { startX: 510, startY: 170, endX: 200, endY: 220, curvature: -50 },
    // Sector 9: Inward spiral to quantum forge
    { startX: 170, startY: 270, endX: 260, endY: 480, curvature: 70 },
    // Sector 10: Central Singularity Core vortex
    { startX: 310, startY: 510, endX: 760, endY: 440, curvature: -60 },
  ];

  const levelsPerSector = 18;

  for (let i = 0; i < totalLevels; i++) {
    const mission = MISSIONS[i];
    const sectorIndex = Math.min(Math.floor(i / levelsPerSector), sectorPaths.length - 1);
    const indexInSector = i % levelsPerSector;
    const t = indexInSector / (levelsPerSector - 1 || 1);

    const path = sectorPaths[sectorIndex];
    // Bezier interpolation with sector curvature wave
    const baseX = path.startX + (path.endX - path.startX) * t;
    const baseY = path.startY + (path.endY - path.startY) * t;
    const waveOffset = Math.sin(t * Math.PI) * path.curvature;

    // Add fine-grained serpentine micro-curves for dynamic road shape
    const microWave = Math.sin(i * 0.9) * 14;

    const x = Math.round(baseX + (sectorIndex % 2 === 0 ? 0 : microWave));
    const y = Math.round(baseY + waveOffset + microWave);

    const info = SECTOR_INFO[mission.rank] || {
      sector: `SECTOR ${sectorIndex + 1}`,
      sectorName: mission.rank,
      color: "#94a3b8",
    };

    coords.push({
      level: mission.number,
      missionId: mission.id,
      x,
      y,
      sector: info.sector,
      sectorName: info.sectorName,
      title: mission.title,
      concept: mission.concept,
      difficulty: mission.difficulty as any,
      color: info.color,
      description: mission.story,
    });
  }

  return coords;
}

export const WORLD_MAP_COORDINATES: MapCoordinate[] = generateCircuitCoordinates();

// Helper to look up coordinates for any level (1-180+)
export function getCoordinateForLevel(level: number): MapCoordinate {
  const clampedLevel = Math.max(1, Math.min(level, WORLD_MAP_COORDINATES.length));
  const found = WORLD_MAP_COORDINATES.find((c) => c.level === clampedLevel);
  return found || WORLD_MAP_COORDINATES[0];
}

// Calculate heading angle in degrees (0 = right, 90 = down, 180 = left, 270 = up)
export function calculateCarHeading(level: number): number {
  const current = getCoordinateForLevel(level);
  const next = getCoordinateForLevel(level < WORLD_MAP_COORDINATES.length ? level + 1 : level);
  const prev = getCoordinateForLevel(level > 1 ? level - 1 : level);

  let dx = next.x - current.x;
  let dy = next.y - current.y;

  if (dx === 0 && dy === 0) {
    dx = current.x - prev.x;
    dy = current.y - prev.y;
  }

  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI;
  return angleDeg;
}

// Generate smooth cubic bezier SVG path connecting all 180 map waypoints
export function generateWorldMapPathSvg(): string {
  if (WORLD_MAP_COORDINATES.length === 0) return "";
  let d = `M ${WORLD_MAP_COORDINATES[0].x} ${WORLD_MAP_COORDINATES[0].y}`;
  for (let i = 1; i < WORLD_MAP_COORDINATES.length; i++) {
    const prev = WORLD_MAP_COORDINATES[i - 1];
    const curr = WORLD_MAP_COORDINATES[i];
    const cx1 = prev.x + (curr.x - prev.x) * 0.5;
    const cy1 = prev.y;
    const cx2 = prev.x + (curr.x - prev.x) * 0.5;
    const cy2 = curr.y;
    d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
  }
  return d;
}

// Generate smooth cubic bezier SVG path up to a specific level for active highway glow
export function generateActiveMapPathSvg(upToLevel: number): string {
  const clamped = Math.max(1, Math.min(upToLevel, WORLD_MAP_COORDINATES.length));
  const coords = WORLD_MAP_COORDINATES.filter((c) => c.level <= clamped);
  if (coords.length <= 1) return "";
  let d = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const cx1 = prev.x + (curr.x - prev.x) * 0.5;
    const cy1 = prev.y;
    const cx2 = prev.x + (curr.x - prev.x) * 0.5;
    const cy2 = curr.y;
    d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
  }
  return d;
}
