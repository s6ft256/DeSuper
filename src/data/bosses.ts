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
if power > 50
    enemy.take_damage(100)
`,
        goal: "Fix the missing colon after 'power > 50' and ensure power is defined as 100",
        testCase: "power = 100\nif power > 50:\n    enemy.take_damage(100)",
        expectedOutput: "suffered 100 damage",
        hints: ["Add power = 100 before the if statement.", "Add a ':' at the end of 'if power > 50:'."],
      },
      {
        phaseNumber: 2,
        title: "Phase 2: Off-By-One Anomaly",
        bossDialogue: "You think you can loop? My loop terminates too early, missing the final weak spot!",
        buggyCode: `# Fix the range so that robot hits 3 times (range(3))
for i in range(1):
    enemy.take_damage(100)
`,
        goal: "Change range(1) to range(3) so 3 direct laser hits are fired",
        testCase: "for i in range(3):\n    enemy.take_damage(100)",
        expectedOutput: "suffered 100 damage",
        hints: ["Change range(1) to range(3)."],
      },
      {
        phaseNumber: 3,
        title: "Phase 3: Condition Inversion",
        bossDialogue: "My shield is impenetrable! Only the inverted logic protocol can crack it!",
        buggyCode: `# Fix the condition: shield_active is True, but we need not shield_active or bypass == True
shield_broken = True
if shield_broken == True:
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
        title: "Phase 1: List Lookup Overload",
        bossDialogue: "Linear scans through 10,000 items will freeze your browser! Can you do a dict key lookup?",
        buggyCode: `# Optimize: Access the target power key directly in O(1) from the database
db = {"sector_a": 50, "sector_boss": 100}
boss_power = db["sector_boss"]
enemy.take_damage(boss_power)
`,
        goal: "Look up 'sector_boss' from db and deal 100 damage",
        testCase: 'db = {"sector_boss": 100}\nenemy.take_damage(db["sector_boss"])',
        expectedOutput: "suffered 100 damage",
        hints: ["Access the dictionary value with db['sector_boss']."],
      },
      {
        phaseNumber: 2,
        title: "Phase 2: Duplicate Ingestion",
        bossDialogue: "I am choking your queues with duplicate tokens! Strip the duplicates!",
        buggyCode: `# Use set() or unique filtering to calculate total unique power
tokens = [50, 50, 50, 50]
unique_power = sum(set(tokens)) * 2
enemy.take_damage(unique_power)
`,
        goal: "Convert tokens to a set to remove duplicates (resulting in [50]), then multiply by 2 for 100 damage",
        testCase: "tokens = [50, 50, 50, 50]\nenemy.take_damage(sum(set(tokens)) * 2)",
        expectedOutput: "suffered 100 damage",
        hints: ["set(tokens) removes all duplicates so sum is 50.", "50 * 2 = 100 damage."],
      },
    ],
    xpReward: 650,
    coinsReward: 400,
    badgeReward: "MEMORY_GUARDIAN",
  },
  {
    id: "boss_infinite_loop",
    name: "THE INFINITE LOOP",
    rankRequirement: "ARCHITECT",
    subtitle: "Runaway Recursive Paradox",
    avatarIcon: "RotateCcw",
    story: "A recursive paradox is caught in an infinite cycle without a base case, threatening to consume all CPU cycles in DeSuper. Implement proper base cases to collapse the anomaly!",
    maxHp: 300,
    phases: [
      {
        phaseNumber: 1,
        title: "Phase 1: Terminate the While Cycle",
        bossDialogue: "I will spin forever and ever! You cannot stop the loop!",
        buggyCode: `# Fix the infinite while loop by incrementing counter
counter = 0
while counter < 3:
    enemy.take_damage(34)
    counter += 1  # Add the increment to prevent infinite spin!
`,
        goal: "Add 'counter += 1' inside the while loop so it terminates after 3 hits",
        testCase: "counter = 0\nwhile counter < 3:\n    enemy.take_damage(34)\n    counter += 1",
        expectedOutput: "suffered 34 damage",
        hints: ["Make sure 'counter += 1' is indented under the while loop."],
      },
      {
        phaseNumber: 2,
        title: "Phase 2: Recursive Base Case",
        bossDialogue: "My recursion calls itself to infinity! There is no bottom!",
        buggyCode: `# Implement the base case so recursive strike stops at n == 0
def strike(n):
    if n <= 0:
        return
    enemy.take_damage(100)
    strike(n - 1)

strike(2)
`,
        goal: "Ensure strike(n) has 'if n <= 0: return' base case",
        testCase: "def strike(n):\n    if n <= 0: return\n    enemy.take_damage(100)\n    strike(n-1)\nstrike(2)",
        expectedOutput: "suffered 100 damage",
        hints: ["Ensure base case if n <= 0: return is present."],
      },
    ],
    xpReward: 800,
    coinsReward: 500,
    badgeReward: "PARADOX_BREAKER",
  },
  {
    id: "boss_architect",
    name: "THE ARCHITECT",
    rankRequirement: "SUPREME",
    subtitle: "Creator of the DeSuper Simulation",
    avatarIcon: "Cpu",
    story: "The Architect is the master intelligence of DeSuper. They were not corrupt—they were testing you to see if humanity could produce a programmer capable of architecting true autonomous systems. Prove your Supreme mastery!",
    maxHp: 400,
    phases: [
      {
        phaseNumber: 1,
        title: "Phase 1: Polymorphic Core Overwrite",
        bossDialogue: "Show me your Object-Oriented mastery. Construct the SupremeAgent entity!",
        buggyCode: `class SupremeAgent:
    def __init__(self, name):
        self.name = name

    def attack(self):
        enemy.take_damage(100)

agent = SupremeAgent("MasterCoder")
agent.attack()
`,
        goal: "Instantiate SupremeAgent and call agent.attack()",
        testCase: "class SupremeAgent:\n    def attack(self):\n        enemy.take_damage(100)\nagent = SupremeAgent()\nagent.attack()",
        expectedOutput: "suffered 100 damage",
        hints: ["Instantiate the agent and call attack()."],
      },
      {
        phaseNumber: 2,
        title: "Phase 2: Algorithmic Calibration",
        bossDialogue: "Only an O(log n) binary search through my defense registers can penetrate this final matrix!",
        buggyCode: `registers = [10, 25, 50, 75, 100]
target = 100
if target in registers:
    enemy.take_damage(150)
`,
        goal: "Find target in registers and deliver 150 damage",
        testCase: "registers = [10, 25, 50, 75, 100]\nif 100 in registers:\n    enemy.take_damage(150)",
        expectedOutput: "suffered 150 damage",
        hints: ["Verify target is in registers."],
      },
      {
        phaseNumber: 3,
        title: "Phase 3: The Grand System Restoration",
        bossDialogue: "You have proven worthy. Execute the final synchronization protocol!",
        buggyCode: `# Final Core Restoration by s6ft
modules = ["CORE", "MATRIX", "SECURITY"]
for mod in modules:
    system.repair(mod)
    enemy.take_damage(50)

print("THE ARCHITECT HAS SURRENDERED CONTROL. SUPREME TITLE GRANTED.")
`,
        goal: "Restore all modules to achieve 100% Python Supreme Rank",
        testCase: 'modules = ["CORE", "MATRIX", "SECURITY"]\nfor mod in modules:\n    system.repair(mod)\n    enemy.take_damage(50)',
        expectedOutput: "THE ARCHITECT HAS SURRENDERED CONTROL",
        hints: ["Run the full restoration sequence."],
      },
    ],
    xpReward: 1500,
    coinsReward: 1000,
    badgeReward: "SUPREME_ARCHITECT",
  },
];
