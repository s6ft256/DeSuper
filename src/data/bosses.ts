import { BossBattle } from "../types";

export const BOSS_BATTLES: BossBattle[] = [
  {
    id: "boss_bug_king",
    name: "THE BUG KING",
    rankRequirement: "CODER",
    subtitle: "Swarm of Syntax and Logic Glitches",
    avatarIcon: "Bug",
    story: "The Bug King has hijacked Sector 4's processing pipeline, injecting malformed syntax and mismatched operators to paralyze the defense grid. Fix the 3 corrupted code modules to defeat him!",
    maxHp: 300,
    phases: [
      {
        phaseNumber: 1,
        title: "Phase 1: Syntax Swarm",
        bossDialogue: "Mwahaha! Your quotes are open and your colons are gone! Try executing this!",
        buggyCode: `# The Bug King's trap: Syntax Errors
# Fix the quotes and colon to activate laser defense
power = 100
if power > 50:
    enemy.take_damage(100)
`,
        goal: "Ensure power = 100 and if power > 50 has a colon to deal 100 damage",
        testCase: "power = 100\nif power > 50:\n    enemy.take_damage(100)",
        expectedOutput: "suffered 100 damage",
        hints: ["Keep power = 100 and make sure 'if power > 50:' has a colon."],
      },
      {
        phaseNumber: 2,
        title: "Phase 2: Off-By-One Anomaly",
        bossDialogue: "You think you can loop? My loop terminates too early, missing the final weak spot!",
        buggyCode: `# Fix the range so that laser hits 3 times (range(3))
for i in range(3):
    enemy.take_damage(100)
`,
        goal: "Use range(3) so that enemy.take_damage(100) fires 3 times",
        testCase: "for i in range(3):\n    enemy.take_damage(100)",
        expectedOutput: "suffered 100 damage",
        hints: ["Ensure range(3) is used."],
      },
      {
        phaseNumber: 3,
        title: "Phase 3: Condition Inversion",
        bossDialogue: "My shield is impenetrable! Only the inverted logic protocol can crack it!",
        buggyCode: `# Execute the shield break strike
shield_broken = True
if shield_broken:
    enemy.take_damage(100)
`,
        goal: "Execute the shield break strike to finish off The Bug King",
        testCase: "shield_broken = True\nif shield_broken:\n    enemy.take_damage(100)",
        expectedOutput: "suffered 100 damage",
        hints: ["Keep shield_broken = True and execute the attack."],
      },
    ],
    xpReward: 500,
    coinsReward: 300,
    badgeReward: "BUG_EXTERMINATOR",
  },
  {
    id: "boss_memory_eater",
    name: "THE MEMORY EATER",
    rankRequirement: "DEVELOPER",
    subtitle: "Resource Depletion Anomaly",
    avatarIcon: "Database",
    story: "A rogue daemon is flooding the memory registry with duplicate arrays and unoptimized lookups. Refactor the code with fast dictionary indexing to starve the beast!",
    maxHp: 300,
    phases: [
      {
        phaseNumber: 1,
        title: "Phase 1: Dictionary Indexing",
        bossDialogue: "Linear scans through 10,000 items will freeze your vehicle! Can you do an O(1) dict lookup?",
        buggyCode: `# Access the target power key directly in O(1) from db
db = {"sector_boss": 100}
enemy.take_damage(db["sector_boss"])
`,
        goal: "Look up 'sector_boss' from db and deal 100 damage",
        testCase: 'db = {"sector_boss": 100}\nenemy.take_damage(db["sector_boss"])',
        expectedOutput: "suffered 100 damage",
        hints: ["Access the dictionary value with db['sector_boss']."],
      },
      {
        phaseNumber: 2,
        title: "Phase 2: Duplicate Set Purge",
        bossDialogue: "I am choking your queues with duplicate tokens! Strip the duplicates!",
        buggyCode: `# Use set() to strip duplicate tokens: sum(set([50, 50])) = 50 * 2 = 100
tokens = [50, 50, 50, 50]
unique_power = sum(set(tokens)) * 2
enemy.take_damage(unique_power)
`,
        goal: "Convert tokens to a set to remove duplicates, then deal 100 damage",
        testCase: "tokens = [50, 50, 50, 50]\nenemy.take_damage(sum(set(tokens)) * 2)",
        expectedOutput: "suffered 100 damage",
        hints: ["set(tokens) yields [50], and 50 * 2 = 100."],
      },
    ],
    xpReward: 650,
    coinsReward: 400,
    badgeReward: "MEMORY_GUARDIAN",
  },
  {
    id: "boss_recursion_leviathan",
    name: "THE RECURSION LEVIATHAN",
    rankRequirement: "ENGINEER",
    subtitle: "Infinite Call-Stack Vortex",
    avatarIcon: "Layers",
    story: "A colossal beast spawned from an infinite recursive loop threatens to overflow the CPU stack. Provide the exact recursive base cases and memoized formulas to shatter the leviathan!",
    maxHp: 400,
    phases: [
      {
        phaseNumber: 1,
        title: "Phase 1: Base Case Restoration",
        bossDialogue: "Down, down you fall into infinite recursion without a base case! Can you halt my descent?",
        buggyCode: `# Add the missing base case n <= 1 to stop infinite recursion
def factorial_strike(n):
    if n <= 1:
        return 1
    return n * factorial_strike(n - 1)

damage = factorial_strike(5) - 20 # 120 - 20 = 100
enemy.take_damage(damage)
`,
        goal: "Execute recursive factorial strike with base case to deal 100 damage",
        testCase: "def factorial_strike(n):\n    if n <= 1:\n        return 1\n    return n * factorial_strike(n - 1)\nenemy.take_damage(factorial_strike(5) - 20)",
        expectedOutput: "suffered 100 damage",
        hints: ["factorial_strike(5) = 120, subtracting 20 deals 100 damage."],
      },
      {
        phaseNumber: 2,
        title: "Phase 2: Fibonacci Memoization",
        bossDialogue: "My exponential O(2^n) complexity will exhaust your cycles!",
        buggyCode: `# Dynamic programming memoization
memo = {0: 0, 1: 1}
def fib_strike(n):
    if n in memo:
        return memo[n]
    memo[n] = fib_strike(n-1) + fib_strike(n-2)
    return memo[n]

enemy.take_damage(fib_strike(10) + 45) # 55 + 45 = 100
`,
        goal: "Compute memoized Fibonacci(10) + 45 to deal 100 damage",
        testCase: "memo = {0: 0, 1: 1}\ndef fib_strike(n):\n    if n in memo: return memo[n]\n    memo[n] = fib_strike(n-1) + fib_strike(n-2)\n    return memo[n]\nenemy.take_damage(fib_strike(10) + 45)",
        expectedOutput: "suffered 100 damage",
        hints: ["Fibonacci(10) is 55. 55 + 45 = 100 damage."],
      },
    ],
    xpReward: 800,
    coinsReward: 500,
    badgeReward: "RECURSION_SLAYER",
  },
  {
    id: "boss_data_kraken",
    name: "THE DATA KRAKEN",
    rankRequirement: "MASTER",
    subtitle: "High-Dimensional Matrix Titan",
    avatarIcon: "Cpu",
    story: "A hyper-dimensional entity composed of unindexed tensors is crushing the data corridors. Deploy NumPy vector transformations and Pandas aggregations to slice through its tentacles!",
    maxHp: 400,
    phases: [
      {
        phaseNumber: 1,
        title: "Phase 1: NumPy Tensor Cleave",
        bossDialogue: "Your scalar weapons are useless in 3-dimensional space! Calculate the dot product!",
        buggyCode: `import numpy as np
v1 = np.array([10, 20, 30])
v2 = np.array([2, 1, 2])
# Dot product: (10*2) + (20*1) + (30*2) = 20 + 20 + 60 = 100
strike_power = np.dot(v1, v2)
enemy.take_damage(strike_power)
`,
        goal: "Compute NumPy dot product = 100 to strike the Kraken",
        testCase: "import numpy as np\nv1 = np.array([10, 20, 30])\nv2 = np.array([2, 1, 2])\nenemy.take_damage(np.dot(v1, v2))",
        expectedOutput: "suffered 100 damage",
        hints: ["np.dot(v1, v2) evaluates to 100."],
      },
      {
        phaseNumber: 2,
        title: "Phase 2: Pandas Dataframe Aggregation",
        bossDialogue: "I scatter my weak points across fragmented rows!",
        buggyCode: `import pandas as pd
df = pd.DataFrame({"phase": ["A", "B", "A", "B"], "dmg": [40, 30, 60, 20]})
alpha_dmg = df.groupby("phase").sum()["A"]["dmg"] # 40 + 60 = 100
enemy.take_damage(alpha_dmg)
`,
        goal: "Aggregate Phase A damage in Pandas to deal 100 finishing damage",
        testCase: 'import pandas as pd\ndf = pd.DataFrame({"phase": ["A", "B", "A", "B"], "dmg": [40, 30, 60, 20]})\nenemy.take_damage(df.groupby("phase").sum()["A"]["dmg"])',
        expectedOutput: "suffered 100 damage",
        hints: ["Phase A sum is 40 + 60 = 100."],
      },
    ],
    xpReward: 900,
    coinsReward: 550,
    badgeReward: "TENSOR_CONQUEROR",
  },
  {
    id: "boss_singularity_ai",
    name: "SINGULARITY AI SOVEREIGN",
    rankRequirement: "SUPREME",
    subtitle: "Rogue Machine Learning Superintelligence",
    avatarIcon: "Sparkles",
    story: "The supreme artificial intelligence of the DeSuper universe has gone rogue, attempting to rewrite reality itself. Train machine learning regression models and neural perceptrons to counter its weights and save the cosmos!",
    maxHp: 500,
    phases: [
      {
        phaseNumber: 1,
        title: "Phase 1: Linear Model Convergence",
        bossDialogue: "My predictive trajectories are absolute! You cannot align your weights to match me!",
        buggyCode: `from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([10, 20, 30])
y = np.array([50, 100, 150])

model = LinearRegression()
model.fit(X, y)
# Predict at X=20: 100
damage = model.predict(np.array([20]))[0]
enemy.take_damage(round(damage))
`,
        goal: "Fit Scikit-Learn Linear Regression and predict damage = 100",
        testCase: "from sklearn.linear_model import LinearRegression\nimport numpy as np\nX = np.array([10, 20, 30])\ny = np.array([50, 100, 150])\nmodel = LinearRegression()\nmodel.fit(X, y)\nenemy.take_damage(round(model.predict(np.array([20]))[0]))",
        expectedOutput: "suffered 100 damage",
        hints: ["Model learns y = 5 * x. At x = 20, y = 100."],
      },
      {
        phaseNumber: 2,
        title: "Phase 2: Neural Activation Strike",
        bossDialogue: "Witness the supreme singularity! Can your neural net achieve activation?",
        buggyCode: `# Neural Perceptron Step Activation
weights = [50, 50]
inputs = [1, 1]
bias = 0

total = sum(w * i for w, i in zip(weights, inputs)) + bias # 50 + 50 = 100
enemy.take_damage(total)
`,
        goal: "Fire 100 damage neural activation strike to defeat the Singularity Sovereign",
        testCase: "weights = [50, 50]\ninputs = [1, 1]\nbias = 0\ntotal = sum(w * i for w, i in zip(weights, inputs)) + bias\nenemy.take_damage(total)",
        expectedOutput: "suffered 100 damage",
        hints: ["50*1 + 50*1 = 100 damage."],
      },
    ],
    xpReward: 1200,
    coinsReward: 800,
    badgeReward: "SINGULARITY_SOVEREIGN",
  },
];
