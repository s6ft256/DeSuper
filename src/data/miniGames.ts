import { MiniGameQuestion, DailyQuest } from "../types";

export const MINI_GAME_QUESTIONS: MiniGameQuestion[] = [
  // Bug Hunter
  {
    id: "bg_1",
    title: "Bug Hunter: Missing Colon",
    question: "Identify the line with the syntax bug in this condition statement:",
    codeSnippet: `1: power = 100
2: if power > 50
3:     print("Optimal")`,
    options: ["Line 1", "Line 2: Missing ':' after 'power > 50'", "Line 3", "No bug"],
    correctIndex: 1,
    explanation: "In Python, compound statement headers like 'if', 'for', 'while', 'def', and 'class' must end with a colon (:).",
    type: "bug_hunter",
  },
  {
    id: "bg_2",
    title: "Bug Hunter: Type Concatenation Error",
    question: "What error will this Python code produce when executed?",
    codeSnippet: `energy = 100
print("Level: " + energy)`,
    options: [
      "SyntaxError",
      "TypeError: can only concatenate str (not 'int') to str",
      "NameError",
      "Outputs 'Level: 100'",
    ],
    correctIndex: 1,
    explanation: "Python is strongly typed and will not automatically concatenate an integer with a string using '+'. Use str(energy) or f'Level: {energy}'.",
    type: "bug_hunter",
  },
  {
    id: "bg_3",
    title: "Bug Hunter: Off-By-One Range",
    question: "How many times will this loop execute?",
    codeSnippet: `for i in range(1, 5):
    print(i)`,
    options: ["5 times (1, 2, 3, 4, 5)", "4 times (1, 2, 3, 4)", "6 times", "0 times"],
    correctIndex: 1,
    explanation: "range(start, end) is exclusive of the end value. range(1, 5) yields 1, 2, 3, and 4 (4 iterations).",
    type: "bug_hunter",
  },

  // Code Runner
  {
    id: "cr_1",
    title: "Code Runner: List Slicing",
    question: "What is the output of values[1:3]?",
    codeSnippet: `values = ['ALPHA', 'BETA', 'GAMMA', 'DELTA']
print(values[1:3])`,
    options: ["['ALPHA', 'BETA']", "['BETA', 'GAMMA']", "['BETA', 'GAMMA', 'DELTA']", "['GAMMA']"],
    correctIndex: 1,
    explanation: "Index 1 is 'BETA' and index 2 is 'GAMMA'. Index 3 ('DELTA') is excluded.",
    type: "code_runner",
  },
  {
    id: "cr_2",
    title: "Code Runner: Dict Key Lookup",
    question: "What value is returned by bot.get('energy', 0)?",
    codeSnippet: `bot = {'name': 'Nexus', 'level': 4}
print(bot.get('energy', 0))`,
    options: ["0 (default fallback value)", "None", "KeyError", "4"],
    correctIndex: 0,
    explanation: ".get(key, default) safely returns the default value if the key does not exist in the dictionary.",
    type: "code_runner",
  },

  // Algorithm Arena
  {
    id: "aa_1",
    title: "Algorithm Arena: Time Complexity",
    question: "What is the time complexity of searching a sorted list of N elements using Binary Search?",
    codeSnippet: `# Binary Search dividing search interval in half each step
while left <= right:
    mid = (left + right) // 2`,
    options: ["O(1) Constant", "O(log N) Logarithmic", "O(N) Linear", "O(N^2) Quadratic"],
    correctIndex: 1,
    explanation: "Binary search cuts the remaining search space in half with each comparison, achieving O(log N) efficiency.",
    type: "algo_arena",
  },
  {
    id: "aa_2",
    title: "Algorithm Arena: Hash Map Lookup",
    question: "What is the average time complexity of looking up a value by key in a Python dictionary?",
    codeSnippet: `db = {'id_842': 'ACTIVE_SECTOR'}
status = db['id_842']`,
    options: ["O(1) Constant", "O(N) Linear", "O(log N)", "O(N log N)"],
    correctIndex: 0,
    explanation: "Python dictionaries use hash tables under the hood, delivering O(1) average constant-time lookups.",
    type: "algo_arena",
  },

  // Security Lab
  {
    id: "sl_1",
    title: "Security Lab: Input Sanitization",
    question: "Why should untrusted user input never be executed with eval() in Python?",
    codeSnippet: `# DANGEROUS EXECUTION
user_data = input()
eval(user_data)`,
    options: [
      "eval() only works on floats",
      "eval() executes arbitrary code and allows remote command injection",
      "eval() is slower than int()",
      "eval() is deprecated in Python 3",
    ],
    correctIndex: 1,
    explanation: "eval() executes any string passed to it as live Python code. Malicious users could execute system commands or compromise security.",
    type: "security_lab",
  },
];

export const INITIAL_DAILY_QUESTS: DailyQuest[] = [
  {
    id: "dq_1",
    title: "Daily Debug",
    category: "debug",
    description: "Successfully execute code or solve a coding challenge.",
    targetCount: 1,
    currentCount: 0,
    completed: false,
    xpReward: 150,
    coinsReward: 100,
  },
  {
    id: "dq_2",
    title: "Daily Mission",
    category: "code",
    description: "Complete at least one curriculum mission today.",
    targetCount: 1,
    currentCount: 0,
    completed: false,
    xpReward: 200,
    coinsReward: 150,
  },
  {
    id: "dq_3",
    title: "Arcade Master",
    category: "boss",
    description: "Answer 2 mini-game challenges correctly.",
    targetCount: 2,
    currentCount: 0,
    completed: false,
    xpReward: 250,
    coinsReward: 200,
  },
];
