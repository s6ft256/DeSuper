import { Mission, RankInfo } from "../types";
import { RANK1_ZERO_MISSIONS } from "./ranks/rank1_zero";
import { RANK2_NOVICE_MISSIONS } from "./ranks/rank2_novice";
import { RANK3_APPRENTICE_MISSIONS } from "./ranks/rank3_apprentice";
import { RANK4_CODER_MISSIONS } from "./ranks/rank4_coder";
import { RANK5_DEVELOPER_MISSIONS } from "./ranks/rank5_developer";
import { RANK6_ENGINEER_MISSIONS } from "./ranks/rank6_engineer";
import { RANK7_ARCHITECT_MISSIONS } from "./ranks/rank7_architect";
import { RANK8_MASTER_MISSIONS } from "./ranks/rank8_master";
import { RANK9_GRANDMASTER_MISSIONS } from "./ranks/rank9_grandmaster";
import { RANK10_SUPREME_MISSIONS } from "./ranks/rank10_supreme";

export const RANKS: RankInfo[] = [
  {
    id: "ZERO",
    numericRank: 1,
    title: "ZERO",
    badge: "00",
    color: "#94a3b8",
    description: "Begin your journey into the DeSuper digital universe. Awaken the Core terminal and syntax fundamentals.",
    minXp: 0,
  },
  {
    id: "NOVICE",
    numericRank: 2,
    title: "NOVICE",
    badge: "01",
    color: "#38bdf8",
    description: "Master variables, data types, numbers, string operations, slicing, and mathematical energy operations.",
    minXp: 500,
  },
  {
    id: "APPRENTICE",
    numericRank: 3,
    title: "APPRENTICE",
    badge: "02",
    color: "#34d399",
    description: "Harness conditional logic, security branch gates, truth tables, and boolean decision-making.",
    minXp: 1500,
  },
  {
    id: "CODER",
    numericRank: 4,
    title: "CODER",
    badge: "03",
    color: "#fbbf24",
    description: "Automate vehicles, loop through energy nodes, while loops, for loops, and master iteration protocols.",
    minXp: 3000,
  },
  {
    id: "DEVELOPER",
    numericRank: 5,
    title: "DEVELOPER",
    badge: "04",
    color: "#f97316",
    description: "Command inventories, data grids, dictionaries, sets, tuples, list comprehensions, and regex parsing.",
    minXp: 5000,
  },
  {
    id: "ENGINEER",
    numericRank: 6,
    title: "ENGINEER",
    badge: "05",
    color: "#ec4899",
    description: "Architect reusable functions, *args/**kwargs, lambda filters, recursion, and binary search.",
    minXp: 7500,
  },
  {
    id: "ARCHITECT",
    numericRank: 7,
    title: "ARCHITECT",
    badge: "06",
    color: "#a855f7",
    description: "Construct autonomous object-oriented cyber entities, inheritance hierarchies, and dunder methods.",
    minXp: 10500,
  },
  {
    id: "MASTER",
    numericRank: 8,
    title: "MASTER",
    badge: "07",
    color: "#06b6d4",
    description: "Master exception shields, Counter/defaultdict, itertools combinations, and generator pipelines.",
    minXp: 14000,
  },
  {
    id: "GRANDMASTER",
    numericRank: 9,
    title: "GRANDMASTER",
    badge: "08",
    color: "#e11d48",
    description: "Metaprogramming, Descriptors, Metaclasses, Generics/TypeVar, Protocols, Dijkstra, and DP Knapsack.",
    minXp: 18000,
  },
  {
    id: "SUPREME",
    numericRank: 10,
    title: "SUPREME",
    badge: "09",
    color: "#eab308",
    description: "AST parsing, Bytecode disassembly, Perceptron Neural Networks, Virtual Machine interpretation, and Transcendence.",
    minXp: 23000,
  },
];

export const MISSIONS: Mission[] = [
  ...RANK1_ZERO_MISSIONS,
  ...RANK2_NOVICE_MISSIONS,
  ...RANK3_APPRENTICE_MISSIONS,
  ...RANK4_CODER_MISSIONS,
  ...RANK5_DEVELOPER_MISSIONS,
  ...RANK6_ENGINEER_MISSIONS,
  ...RANK7_ARCHITECT_MISSIONS,
  ...RANK8_MASTER_MISSIONS,
  ...RANK9_GRANDMASTER_MISSIONS,
  ...RANK10_SUPREME_MISSIONS,
];
