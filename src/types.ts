export type RankId =
  | "ZERO"
  | "NOVICE"
  | "APPRENTICE"
  | "CODER"
  | "DEVELOPER"
  | "ENGINEER"
  | "ARCHITECT"
  | "MASTER"
  | "SUPREME";

export interface RankInfo {
  id: RankId;
  numericRank: number;
  title: string;
  badge: string;
  color: string;
  description: string;
  minXp: number;
}

export type ViewTab =
  | "world"
  | "missions"
  | "playground"
  | "skills"
  | "bosses"
  | "projects"
  | "minigames"
  | "supreme"
  | "customize"
  | "profile";

export interface VisualAction {
  type:
    | "print"
    | "terminal_activate"
    | "door_open"
    | "door_close"
    | "robot_move"
    | "robot_scan"
    | "robot_recharge"
    | "robot_shoot"
    | "energy_collect"
    | "shield_engage"
    | "drone_fly"
    | "data_decrypt"
    | "city_boost"
    | "enemy_damage"
    | "system_repair"
    | "error_glitch";
  payload?: any;
  message?: string;
  duration?: number;
}

export interface ExecutionResult {
  success: boolean;
  output: string[];
  error?: {
    type: string;
    line: number;
    message: string;
    whatHappened: string;
    whyItHappened: string;
    conceptHint: string;
    exampleFix: string;
  };
  variables: Record<string, any>;
  visualActions: VisualAction[];
  executionTimeMs: number;
}

export interface MissionHint {
  level: 1 | 2 | 3 | 4;
  label: string;
  text: string;
}

export interface Mission {
  id: string;
  rank: RankId;
  number: number;
  title: string;
  concept: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Supreme";
  story: string;
  objectives: string[];
  conceptExplanation: string;
  starterCode: string;
  solutionExample?: string;
  validationRules: {
    requiredOutputIncludes?: string[];
    requiredKeywords?: string[];
    forbiddenKeywords?: string[];
    requiredVariableValues?: Record<string, any>;
    customValidator?: string; // function body evaluated in JS sandbox
  };
  hints: MissionHint[];
  xpReward: number;
  coinsReward: number;
  skillIdToUnlock?: string;
  worldSceneType: "terminal" | "cyber_gate" | "robot_lab" | "drone_grid" | "data_matrix" | "core_reactor";
}

export interface SkillNode {
  id: string;
  branch:
    | "PYTHON CORE"
    | "CONTROL FLOW"
    | "DATA STRUCTURES"
    | "FUNCTIONS"
    | "OOP"
    | "ENGINEERING"
    | "ADVANCED"
    | "SUPREME";
  title: string;
  concept: string;
  description: string;
  tier: number;
  prerequisites: string[];
  iconName: string;
  unlocked: boolean;
  masteryPercent: number;
}

export interface BossBattle {
  id: string;
  name: string;
  rankRequirement: RankId;
  subtitle: string;
  avatarIcon: string;
  story: string;
  maxHp: number;
  phases: {
    phaseNumber: number;
    title: string;
    bossDialogue: string;
    buggyCode: string;
    goal: string;
    testCase: string;
    expectedOutput: string;
    hints: string[];
  }[];
  xpReward: number;
  coinsReward: number;
  badgeReward: string;
}

export interface ProjectTemplate {
  id: string;
  title: string;
  tier: "Beginner" | "Intermediate" | "Advanced" | "Supreme";
  category: string;
  description: string;
  starterCode: string;
  requirements: string[];
  testSuites: {
    name: string;
    input?: string;
    expectedOutputPattern: string;
  }[];
  xpReward: number;
  coinsReward: number;
}

export interface MiniGameQuestion {
  id: string;
  title: string;
  question: string;
  codeSnippet: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  type: "bug_hunter" | "code_runner" | "algo_arena" | "security_lab";
}

export interface DailyQuest {
  id: string;
  title: string;
  category: "debug" | "code" | "boss" | "streak";
  description: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  xpReward: number;
  coinsReward: number;
}

export interface PlayerCustomization {
  name: string;
  avatar: string;
  suitColor: string;
  helmetStyle: string;
  companionSkin: string;
  themeAccent: string;
  badgeTitle: string;
}

export interface PlayerState {
  name: string;
  level: number;
  xp: number;
  coins: number;
  rank: RankId;
  streak: number;
  lastPlayedDate: string;
  completedMissions: string[]; // mission IDs
  unlockedSkills: string[]; // skill IDs
  defeatedBosses: string[]; // boss IDs
  completedProjects: string[]; // project IDs
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: number;
  }[];
  customization: PlayerCustomization;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  stats: {
    codeExecutions: number;
    errorsEncountered: number;
    bugsPatched: number;
    hintsUsed: number;
    totalLinesWritten: number;
  };
}
