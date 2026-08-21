import { MapCoordinate } from "../types";

export const WORLD_MAP_COORDINATES: MapCoordinate[] = [
  // Sector 1: Core Awakening (Rank 1 ZERO)
  {
    level: 1,
    missionId: "m1",
    x: 80,
    y: 480,
    sector: "SECTOR 01",
    sectorName: "Core Awakening Gate",
    title: "Print First Signal",
    concept: "Standard Output (print)",
    difficulty: "Beginner",
    color: "#94a3b8",
    description: "Initialize the vehicle telemetry stream and wake the DeSuper terminal.",
  },
  {
    level: 2,
    missionId: "m2",
    x: 160,
    y: 430,
    sector: "SECTOR 01",
    sectorName: "Terminal Bay",
    title: "Codename Identifier",
    concept: "Strings & Variables",
    difficulty: "Beginner",
    color: "#94a3b8",
    description: "Broadcast racer identification to the central relay network.",
  },
  {
    level: 3,
    missionId: "m3",
    x: 240,
    y: 470,
    sector: "SECTOR 01",
    sectorName: "Power Station Alpha",
    title: "Energy Influx",
    concept: "Integers & Arithmetic",
    difficulty: "Beginner",
    color: "#94a3b8",
    description: "Ignite the primary battery cells and calibrate initial horsepower.",
  },

  // Sector 2: Neon Grid (Rank 2 NOVICE)
  {
    level: 4,
    missionId: "m4",
    x: 320,
    y: 390,
    sector: "SECTOR 02",
    sectorName: "Neon Gridway",
    title: "Cyber Slicing",
    concept: "String Slicing & Methods",
    difficulty: "Beginner",
    color: "#38bdf8",
    description: "Slice encrypted frequency tokens to pass through neon checkpoints.",
  },
  {
    level: 5,
    missionId: "m5",
    x: 400,
    y: 330,
    sector: "SECTOR 02",
    sectorName: "Telemetry Ridge",
    title: "Telemetry Stream",
    concept: "f-strings & Formatting",
    difficulty: "Beginner",
    color: "#38bdf8",
    description: "Stream high-speed vehicle diagnostic logs across the HUD.",
  },
  {
    level: 6,
    missionId: "m6",
    x: 490,
    y: 380,
    sector: "SECTOR 02",
    sectorName: "Flux Junction",
    title: "Data Transmutation",
    concept: "Type Casting & Float Math",
    difficulty: "Beginner",
    color: "#38bdf8",
    description: "Convert analog battery voltages into floating-point acceleration units.",
  },

  // Sector 3: Security Perimeter (Rank 3 APPRENTICE)
  {
    level: 7,
    missionId: "m7",
    x: 580,
    y: 460,
    sector: "SECTOR 03",
    sectorName: "Firewall Canyon",
    title: "Perimeter Gate",
    concept: "If-Else Conditionals",
    difficulty: "Intermediate",
    color: "#34d399",
    description: "Check clearance passes to unlock magnetic barrier gates.",
  },
  {
    level: 8,
    missionId: "m8",
    x: 670,
    y: 490,
    sector: "SECTOR 03",
    sectorName: "Threat Matrix Outpost",
    title: "Threat Matrix",
    concept: "Elif & Logical Operators",
    difficulty: "Intermediate",
    color: "#34d399",
    description: "Route around hazardous EMP mines using multi-branch logic.",
  },
  {
    level: 9,
    missionId: "m9",
    x: 770,
    y: 440,
    sector: "SECTOR 03",
    sectorName: "Plasma Fortress",
    title: "Plasma Shield",
    concept: "Ternary & Truthiness",
    difficulty: "Intermediate",
    color: "#34d399",
    description: "Arm the plasma forcefield during hyper-velocity canyon strafes.",
  },

  // Sector 4: Robotics Track (Rank 4 CODER)
  {
    level: 10,
    missionId: "m10",
    x: 870,
    y: 410,
    sector: "SECTOR 04",
    sectorName: "Automated Speedway",
    title: "Propulsion Loop",
    concept: "For Loops & range()",
    difficulty: "Intermediate",
    color: "#fbbf24",
    description: "Run automated throttle sequences for continuous nitro propulsion.",
  },
  {
    level: 11,
    missionId: "m11",
    x: 970,
    y: 350,
    sector: "SECTOR 04",
    sectorName: "Solar Harvester Loop",
    title: "Energy Harvester",
    concept: "While Loops & break/continue",
    difficulty: "Intermediate",
    color: "#fbbf24",
    description: "Harvest quantum solar orbs until capacitor maximum capacity is reached.",
  },
  {
    level: 12,
    missionId: "m12",
    x: 1070,
    y: 290,
    sector: "SECTOR 04",
    sectorName: "Arsenal Overlook",
    title: "Arsenal Sync",
    concept: "List Manipulation & Methods",
    difficulty: "Intermediate",
    color: "#fbbf24",
    description: "Equip turbo thrusters and photon blasters into vehicle weapon racks.",
  },
  {
    level: 13,
    missionId: "m13",
    x: 1110,
    y: 200,
    sector: "SECTOR 04",
    sectorName: "Dual Stream Interchange",
    title: "Dual Stream",
    concept: "enumerate() & zip()",
    difficulty: "Intermediate",
    color: "#fbbf24",
    description: "Synchronize dual engine rpm and temperature telemetry channels.",
  },

  // Sector 5: Data Matrix (Rank 5 DEVELOPER)
  {
    level: 14,
    missionId: "m14",
    x: 1040,
    y: 130,
    sector: "SECTOR 05",
    sectorName: "Cyber Registry Vault",
    title: "Cyber Registry",
    concept: "Dictionaries & Key-Value Lookups",
    difficulty: "Advanced",
    color: "#f97316",
    description: "Query regional traffic controllers and access road clearance codes.",
  },
  {
    level: 15,
    missionId: "m15",
    x: 940,
    y: 100,
    sector: "SECTOR 05",
    sectorName: "Comprehension Canyon",
    title: "Vector Sieve",
    concept: "List & Dict Comprehensions",
    difficulty: "Advanced",
    color: "#f97316",
    description: "Filter high-frequency radar pulses with one-line comprehension pipelines.",
  },
  {
    level: 16,
    missionId: "m16",
    x: 840,
    y: 140,
    sector: "SECTOR 05",
    sectorName: "Regex Terminal",
    title: "Regex Extraction",
    concept: "Regular Expressions (re module)",
    difficulty: "Advanced",
    color: "#f97316",
    description: "Extract corrupted coordinates from encrypted atmospheric beacon logs.",
  },

  // Sector 6: Algorithm Core (Rank 6 ENGINEER)
  {
    level: 17,
    missionId: "m17",
    x: 730,
    y: 110,
    sector: "SECTOR 06",
    sectorName: "Combustion Lab",
    title: "Modular Combustion",
    concept: "Functions, Parameters, & Return",
    difficulty: "Advanced",
    color: "#ec4899",
    description: "Modularize hyperdrive engine ignition subroutines.",
  },
  {
    level: 18,
    missionId: "m18",
    x: 630,
    y: 80,
    sector: "SECTOR 06",
    sectorName: "Functional Pipeline",
    title: "Dynamic Throttle",
    concept: "*args, **kwargs, & Lambdas",
    difficulty: "Advanced",
    color: "#ec4899",
    description: "Feed variable racing telemetry payloads into dynamic throttle controllers.",
  },
  {
    level: 19,
    missionId: "m19",
    x: 530,
    y: 120,
    sector: "SECTOR 06",
    sectorName: "Binary Search Tunnel",
    title: "Binary Highway",
    concept: "Binary Search & Recursion",
    difficulty: "Advanced",
    color: "#ec4899",
    description: "Pinpoint the optimal warp jump exit coordinate in log-time.",
  },

  // Sector 7: Object Citadel (Rank 7 ARCHITECT)
  {
    level: 20,
    missionId: "m20",
    x: 430,
    y: 90,
    sector: "SECTOR 07",
    sectorName: "Object Foundry",
    title: "OOP Blueprint",
    concept: "Classes, Objects, & __init__",
    difficulty: "Supreme",
    color: "#a855f7",
    description: "Instantiate custom CyberVehicle drone fleets with encapsulated states.",
  },
  {
    level: 21,
    missionId: "m21",
    x: 330,
    y: 70,
    sector: "SECTOR 07",
    sectorName: "Inheritance Spire",
    title: "Heritage Engine",
    concept: "Inheritance & Polymorphism",
    difficulty: "Supreme",
    color: "#a855f7",
    description: "Inherit racing chassis archetypes into combat and reconnaissance variants.",
  },

  // Sector 8: Shield Overpass (Rank 8 MASTER)
  {
    level: 22,
    missionId: "m22",
    x: 230,
    y: 110,
    sector: "SECTOR 08",
    sectorName: "Shield Overpass",
    title: "Error Shield",
    concept: "Try-Except & Custom Exceptions",
    difficulty: "Supreme",
    color: "#e11d48",
    description: "Deflect fatal system crashes during cosmic hyper-drift turbulence.",
  },
  {
    level: 23,
    missionId: "m23",
    x: 140,
    y: 160,
    sector: "SECTOR 08",
    sectorName: "Collections Depot",
    title: "Collections Matrix",
    concept: "collections (Counter, defaultdict)",
    difficulty: "Supreme",
    color: "#e11d48",
    description: "Aggregate thousands of telemetry packets per millisecond.",
  },

  // Sector 9: DeSuper Singularity Core (Rank 9 SUPREME)
  {
    level: 24,
    missionId: "m24",
    x: 100,
    y: 250,
    sector: "SECTOR 09",
    sectorName: "Vector Singularity",
    title: "NumPy Matrix Warp",
    concept: "NumPy & Vectorized Math",
    difficulty: "Supreme",
    color: "#eab308",
    description: "Execute parallel 4D trajectory matrices at light-speed.",
  },
  {
    level: 25,
    missionId: "m25",
    x: 170,
    y: 310,
    sector: "SECTOR 09",
    sectorName: "Data Stream Singularity",
    title: "Pandas Telemetry",
    concept: "Pandas DataFrames & Aggregation",
    difficulty: "Supreme",
    color: "#eab308",
    description: "Analyze race historical telemetry streams across billions of cycles.",
  },
  {
    level: 26,
    missionId: "m26",
    x: 270,
    y: 280,
    sector: "SECTOR 09",
    sectorName: "Neural Circuit Highway",
    title: "ML Drift Predictor",
    concept: "Machine Learning Regression",
    difficulty: "Supreme",
    color: "#eab308",
    description: "Train a neural network model to calculate optimal apex drift lines.",
  },
  {
    level: 27,
    missionId: "m27",
    x: 370,
    y: 230,
    sector: "SECTOR 09",
    sectorName: "DeSuper Singularity Core",
    title: "SINGULARITY RESTORATION",
    concept: "Complete Python Mastery",
    difficulty: "Supreme",
    color: "#eab308",
    description: "Restore the DeSuper Core to full autonomous quantum equilibrium!",
  },
];

// Helper to look up coordinates for any level (1-27+)
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

// Generate smooth cubic bezier SVG path connecting all map waypoints
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

