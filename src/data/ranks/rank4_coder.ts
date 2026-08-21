import { Mission } from "../../types";

export const RANK4_CODER_MISSIONS: Mission[] = [
  {
    id: "m55",
    rank: "CODER",
    number: 55,
    title: "Basic For Loop: Range Iteration",
    concept: "for Loops & range(stop)",
    difficulty: "Intermediate",
    story: "Drive the cyber vehicle forward through 4 consecutive checkpoints.",
    objectives: ["Loop i from 0 to 3 using range(4)", "Call robot.move() or print checkpoint messages", "Print 'ALL 4 CHECKPOINTS CLEARED'"],
    conceptExplanation: "'for i in range(n):' iterates n times with i taking values from 0 up to n-1.",
    starterCode: `for i in range(4):
    robot.move()

print("ALL 4 CHECKPOINTS CLEARED")
`,
    validationRules: {
      requiredKeywords: ["for", "in range(4):", "print"],
      requiredOutputIncludes: ["ALL 4 CHECKPOINTS CLEARED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use range(4) to loop 4 times." },
      { level: 2, label: "Concept", text: "for i in range(4): loops 4 times." },
      { level: 3, label: "Example", text: 'for i in range(4):\n    robot.move()\nprint("ALL 4 CHECKPOINTS CLEARED")' },
      { level: 4, label: "Solution", text: "Execute the range(4) loop." },
    ],
    xpReward: 350,
    coinsReward: 175,
    skillIdToUnlock: "py_loops",
    worldSceneType: "cyber_highway",
  },
  {
    id: "m56",
    rank: "CODER",
    number: 56,
    title: "Range with Start and Stop",
    concept: "range(start, stop)",
    difficulty: "Intermediate",
    story: "Scan energy frequencies from channel 10 to channel 14.",
    objectives: ["Loop i in range(10, 15)", "Print each frequency i"],
    conceptExplanation: "range(start, stop) generates numbers starting at 'start' and ending at 'stop - 1'.",
    starterCode: `for freq in range(10, 15):
    print(freq)
`,
    validationRules: {
      requiredKeywords: ["range(10, 15):", "print"],
      requiredOutputIncludes: ["10", "14"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use range(10, 15) to cover 10 through 14." },
      { level: 2, label: "Concept", text: "range(10, 15) produces 10, 11, 12, 13, 14." },
      { level: 3, label: "Example", text: "for freq in range(10, 15):\n    print(freq)" },
      { level: 4, label: "Solution", text: "Execute the range(10, 15) iteration." },
    ],
    xpReward: 355,
    coinsReward: 175,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m57",
    rank: "CODER",
    number: 57,
    title: "Range with Step Factor",
    concept: "range(start, stop, step)",
    difficulty: "Intermediate",
    story: "Sample vehicle speed sensors every 20 km/h from 0 up to 100.",
    objectives: ["Loop speed in range(0, 101, 20)", "Print speed"],
    conceptExplanation: "range(start, stop, step) steps by the given increment value.",
    starterCode: `for speed in range(0, 101, 20):
    print(speed)
`,
    validationRules: {
      requiredKeywords: ["range(0, 101, 20):", "print"],
      requiredOutputIncludes: ["0", "100"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Pass step 20 as the 3rd argument." },
      { level: 2, label: "Concept", text: "range(0, 101, 20) yields 0, 20, 40, 60, 80, 100." },
      { level: 3, label: "Example", text: "for speed in range(0, 101, 20):\n    print(speed)" },
      { level: 4, label: "Solution", text: "Execute stepped range iteration." },
    ],
    xpReward: 360,
    coinsReward: 180,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m58",
    rank: "CODER",
    number: 58,
    title: "Looping Over a List",
    concept: "Iterating Sequence Elements",
    difficulty: "Intermediate",
    story: "Inject energy cells from the list [25, 50, 75, 100].",
    objectives: ["Iterate cell in [25, 50, 75, 100]", "Print f'INJECTING {cell} MW'"],
    conceptExplanation: "In Python, 'for item in collection:' directly iterates through elements without index counters.",
    starterCode: `cells = [25, 50, 75, 100]
for cell in cells:
    print(f"INJECTING {cell} MW")
`,
    validationRules: {
      requiredKeywords: ["for cell in cells:", "print"],
      requiredOutputIncludes: ["INJECTING 100 MW"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Loop directly over cells." },
      { level: 2, label: "Concept", text: "for cell in cells:" },
      { level: 3, label: "Example", text: 'for cell in cells:\n    print(f"INJECTING {cell} MW")' },
      { level: 4, label: "Solution", text: "Execute list iteration." },
    ],
    xpReward: 365,
    coinsReward: 180,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m59",
    rank: "CODER",
    number: 59,
    title: "Accumulator Pattern",
    concept: "Summing & Aggregation in Loops",
    difficulty: "Intermediate",
    story: "Calculate total energy harvest from a stream of 5 energy orbs (each 20 MW).",
    objectives: ["Set total_energy = 0", "Add 20 in each iteration of range(5)", "Print total_energy"],
    conceptExplanation: "An accumulator variable stores the running total or aggregated state across loop iterations.",
    starterCode: `total_energy = 0
for i in range(5):
    total_energy += 20

print(total_energy)
`,
    validationRules: {
      requiredKeywords: ["total_energy = 0", "+= 20", "print"],
      requiredOutputIncludes: ["100"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use total_energy += 20 inside loop." },
      { level: 2, label: "Concept", text: "Add to accumulator each cycle." },
      { level: 3, label: "Example", text: "total_energy = 0\nfor i in range(5):\n    total_energy += 20\nprint(total_energy)" },
      { level: 4, label: "Solution", text: "Execute accumulator summation." },
    ],
    xpReward: 370,
    coinsReward: 185,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m60",
    rank: "CODER",
    number: 60,
    title: "While Loop: Countdown Sequence",
    concept: "while Loops",
    difficulty: "Intermediate",
    story: "Count down launch timer from 3 to 1 using a while loop, then print 'LAUNCH!'.",
    objectives: ["Set timer = 3", "While timer > 0: print timer, decrement timer -= 1", "Print 'LAUNCH!'"],
    conceptExplanation: "A 'while' loop continues executing as long as its condition remains True.",
    starterCode: `timer = 3
while timer > 0:
    print(timer)
    timer -= 1

print("LAUNCH!")
`,
    validationRules: {
      requiredKeywords: ["while timer > 0:", "timer -=", "print"],
      requiredOutputIncludes: ["3", "1", "LAUNCH!"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Decrement timer by 1 each step." },
      { level: 2, label: "Concept", text: "timer -= 1 prevents infinite loops." },
      { level: 3, label: "Example", text: 'while timer > 0:\n    print(timer)\n    timer -= 1\nprint("LAUNCH!")' },
      { level: 4, label: "Solution", text: "Execute while loop countdown." },
    ],
    xpReward: 375,
    coinsReward: 185,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m61",
    rank: "CODER",
    number: 61,
    title: "The 'break' Statement",
    concept: "Early Loop Termination (break)",
    difficulty: "Intermediate",
    story: "Stop scanning track tiles immediately when an 'OBSTACLE' is encountered.",
    objectives: [
      "Iterate over ['ROAD', 'ROAD', 'OBSTACLE', 'ROAD']",
      "If tile == 'OBSTACLE', print 'BRAKING: OBSTACLE HIT' and break",
    ],
    conceptExplanation: "'break' immediately terminates the innermost enclosing loop.",
    starterCode: `tiles = ["ROAD", "ROAD", "OBSTACLE", "ROAD"]
for tile in tiles:
    if tile == "OBSTACLE":
        print("BRAKING: OBSTACLE HIT")
        break
`,
    validationRules: {
      requiredKeywords: ["if tile == \"OBSTACLE\":", "break", "print"],
      requiredOutputIncludes: ["BRAKING: OBSTACLE HIT"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use break to exit the loop." },
      { level: 2, label: "Concept", text: "break exits loop immediately." },
      { level: 3, label: "Example", text: 'if tile == "OBSTACLE":\n    print("BRAKING: OBSTACLE HIT")\n    break' },
      { level: 4, label: "Solution", text: "Execute early break termination." },
    ],
    xpReward: 380,
    coinsReward: 190,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m62",
    rank: "CODER",
    number: 62,
    title: "The 'continue' Statement",
    concept: "Skipping Iterations (continue)",
    difficulty: "Intermediate",
    story: "Filter out corrupted sensor readings ('CORRUPT') and process only valid numerical data.",
    objectives: [
      "Iterate over [10, 'CORRUPT', 20, 'CORRUPT', 30]",
      "If item == 'CORRUPT': continue",
      "Print valid numbers",
    ],
    conceptExplanation: "'continue' skips the rest of the current iteration and jumps to the next cycle.",
    starterCode: `readings = [10, "CORRUPT", 20, "CORRUPT", 30]
for r in readings:
    if r == "CORRUPT":
        continue
    print(r)
`,
    validationRules: {
      requiredKeywords: ["if r == \"CORRUPT\":", "continue", "print(r)"],
      requiredOutputIncludes: ["10", "20", "30"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use continue when r == 'CORRUPT'." },
      { level: 2, label: "Concept", text: "continue skips to the next item." },
      { level: 3, label: "Example", text: 'if r == "CORRUPT":\n    continue\nprint(r)' },
      { level: 4, label: "Solution", text: "Execute continue skipping." },
    ],
    xpReward: 385,
    coinsReward: 190,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m63",
    rank: "CODER",
    number: 63,
    title: "Enumerate: Indexed Loop",
    concept: "enumerate() Index & Value Pairing",
    difficulty: "Intermediate",
    story: "Print each sector checkpoint along with its 0-indexed lap station number.",
    objectives: [
      "Iterate over checkpoints = ['ALPHA', 'BETA', 'GAMMA'] using enumerate()",
      "Print f'STATION {idx}: {name}'",
    ],
    conceptExplanation: "enumerate(iterable) yields pairs of (index, element) during iteration.",
    starterCode: `checkpoints = ["ALPHA", "BETA", "GAMMA"]
for idx, name in enumerate(checkpoints):
    print(f"STATION {idx}: {name}")
`,
    validationRules: {
      requiredKeywords: ["enumerate(checkpoints)", "for idx, name", "print"],
      requiredOutputIncludes: ["STATION 0: ALPHA", "STATION 2: GAMMA"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use for idx, name in enumerate(checkpoints):." },
      { level: 2, label: "Concept", text: "enumerate yields (index, value) tuples." },
      { level: 3, label: "Example", text: 'for idx, name in enumerate(checkpoints):\n    print(f"STATION {idx}: {name}")' },
      { level: 4, label: "Solution", text: "Execute enumerate iteration." },
    ],
    xpReward: 390,
    coinsReward: 195,
    skillIdToUnlock: "py_enumerate",
    worldSceneType: "cyber_highway",
  },
  {
    id: "m64",
    rank: "CODER",
    number: 64,
    title: "Zip: Synchronized Multi-Sequence Iteration",
    concept: "zip() Parallel Iteration",
    difficulty: "Intermediate",
    story: "Pair racer pilots with their corresponding vehicle speeds in lockstep.",
    objectives: [
      "Iterate pilots = ['AURA', 'NEXUS'] and speeds = [320, 350] using zip()",
      "Print f'{pilot} @ {speed} KM/H'",
    ],
    conceptExplanation: "zip(list1, list2) pairs up elements from multiple iterables index by index.",
    starterCode: `pilots = ["AURA", "NEXUS"]
speeds = [320, 350]

for pilot, speed in zip(pilots, speeds):
    print(f"{pilot} @ {speed} KM/H")
`,
    validationRules: {
      requiredKeywords: ["zip(pilots, speeds)", "for pilot, speed", "print"],
      requiredOutputIncludes: ["AURA @ 320 KM/H", "NEXUS @ 350 KM/H"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use for pilot, speed in zip(pilots, speeds):." },
      { level: 2, label: "Concept", text: "zip() iterates in parallel." },
      { level: 3, label: "Example", text: 'for pilot, speed in zip(pilots, speeds):\n    print(f"{pilot} @ {speed} KM/H")' },
      { level: 4, label: "Solution", text: "Execute zip synchronized iteration." },
    ],
    xpReward: 395,
    coinsReward: 195,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m65",
    rank: "CODER",
    number: 65,
    title: "Nested 2D Grid Scanning",
    concept: "Nested for Loops",
    difficulty: "Intermediate",
    story: "Scan a 2x3 laser matrix grid (rows 0..1, cols 0..2) and print coordinate pairs.",
    objectives: ["Loop r in range(2) and c in range(3)", "Print f'SCAN: ({r}, {c})'"],
    conceptExplanation: "Nested loops execute the inner loop completely for each cycle of the outer loop.",
    starterCode: `for r in range(2):
    for c in range(3):
        print(f"SCAN: ({r}, {c})")
`,
    validationRules: {
      requiredKeywords: ["for r in range(2):", "for c in range(3):", "print"],
      requiredOutputIncludes: ["SCAN: (0, 0)", "SCAN: (1, 2)"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Put the column loop inside the row loop." },
      { level: 2, label: "Concept", text: "Nested loops create 2D coordinate matrices." },
      { level: 3, label: "Example", text: 'for r in range(2):\n    for c in range(3):\n        print(f"SCAN: ({r}, {c})")' },
      { level: 4, label: "Solution", text: "Execute 2D grid scanning." },
    ],
    xpReward: 400,
    coinsReward: 200,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m66",
    rank: "CODER",
    number: 66,
    title: "For-Else Search Pattern",
    concept: "The 'else' Clause with for Loops",
    difficulty: "Intermediate",
    story: "Search for 'SUPER_TURBO' in the part inventory; execute the else block if not found.",
    objectives: [
      "Search inventory = ['TIRE', 'SHIELD', 'BATTERY']",
      "If 'SUPER_TURBO' found, break",
      "In the for-else block, print 'PART NOT FOUND: SYSTEM DEFAULT USED'",
    ],
    conceptExplanation: "A for loop's 'else' block executes ONLY if the loop finishes naturally without hitting a 'break'.",
    starterCode: `inventory = ["TIRE", "SHIELD", "BATTERY"]
for item in inventory:
    if item == "SUPER_TURBO":
        print("FOUND")
        break
else:
    print("PART NOT FOUND: SYSTEM DEFAULT USED")
`,
    validationRules: {
      requiredKeywords: ["for item in inventory:", "else:", "print"],
      requiredOutputIncludes: ["PART NOT FOUND: SYSTEM DEFAULT USED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Put else: aligned with the for keyword." },
      { level: 2, label: "Concept", text: "for-else runs else if no break occurs." },
      { level: 3, label: "Example", text: 'for item in inventory:\n    ...\nelse:\n    print("PART NOT FOUND: SYSTEM DEFAULT USED")' },
      { level: 4, label: "Solution", text: "Execute for-else fallback." },
    ],
    xpReward: 405,
    coinsReward: 200,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m67",
    rank: "CODER",
    number: 67,
    title: "Sum Built-in with Range",
    concept: "sum() Function",
    difficulty: "Intermediate",
    story: "Compute the mathematical sum of the first 10 numbers (1 to 10) directly.",
    objectives: ["Set total = sum(range(1, 11))", "Print total"],
    conceptExplanation: "The built-in sum() function calculates the sum of all elements in an iterable.",
    starterCode: `total = sum(range(1, 11))
print(total)
`,
    validationRules: {
      requiredKeywords: ["sum(range(1, 11))", "total", "print"],
      requiredOutputIncludes: ["55"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use sum(range(1, 11))." },
      { level: 2, label: "Concept", text: "sum() adds all numbers from 1 to 10 (55)." },
      { level: 3, label: "Example", text: "total = sum(range(1, 11))\nprint(total)" },
      { level: 4, label: "Solution", text: "Execute sum() calculation." },
    ],
    xpReward: 410,
    coinsReward: 205,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m68",
    rank: "CODER",
    number: 68,
    title: "Reversed Loop Iteration",
    concept: "reversed() Sequence Iteration",
    difficulty: "Intermediate",
    story: "Iterate through sector waypoints in reverse order.",
    objectives: ["Iterate over reversed(['ALPHA', 'BETA', 'GAMMA'])", "Print each sector"],
    conceptExplanation: "reversed(sequence) iterates through sequence elements from last to first.",
    starterCode: `sectors = ["ALPHA", "BETA", "GAMMA"]
for s in reversed(sectors):
    print(s)
`,
    validationRules: {
      requiredKeywords: ["reversed(sectors)", "for s in", "print"],
      requiredOutputIncludes: ["GAMMA", "ALPHA"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use for s in reversed(sectors):." },
      { level: 2, label: "Concept", text: "reversed() iterates backward." },
      { level: 3, label: "Example", text: "for s in reversed(sectors):\n    print(s)" },
      { level: 4, label: "Solution", text: "Execute reversed iteration." },
    ],
    xpReward: 415,
    coinsReward: 205,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m69",
    rank: "CODER",
    number: 69,
    title: "Min and Max Telemetry",
    concept: "min() and max() Functions",
    difficulty: "Intermediate",
    story: "Find the peak and lowest temperatures recorded during the speed run.",
    objectives: [
      "Set temps = [78, 85, 92, 69, 88]",
      "Print f'MIN: {min(temps)} | MAX: {max(temps)}'",
    ],
    conceptExplanation: "min() and max() return the smallest and largest values in a collection.",
    starterCode: `temps = [78, 85, 92, 69, 88]
print(f"MIN: {min(temps)} | MAX: {max(temps)}")
`,
    validationRules: {
      requiredKeywords: ["min(temps)", "max(temps)", "print"],
      requiredOutputIncludes: ["MIN: 69 | MAX: 92"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use min() and max() on temps." },
      { level: 2, label: "Concept", text: "min finds 69, max finds 92." },
      { level: 3, label: "Example", text: 'print(f"MIN: {min(temps)} | MAX: {max(temps)}")' },
      { level: 4, label: "Solution", text: "Execute min/max calculation." },
    ],
    xpReward: 420,
    coinsReward: 210,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m70",
    rank: "CODER",
    number: 70,
    title: "Finding In-Loop Match",
    concept: "Linear Search Pattern in Loop",
    difficulty: "Intermediate",
    story: "Find the first score above 500 in a list of race scores.",
    objectives: [
      "Iterate scores = [320, 480, 520, 610]",
      "If score > 500: print f'FOUND HIGHSCORE: {score}' and break",
    ],
    conceptExplanation: "Loops with early break are the foundation of linear search algorithms.",
    starterCode: `scores = [320, 480, 520, 610]
for score in scores:
    if score > 500:
        print(f"FOUND HIGHSCORE: {score}")
        break
`,
    validationRules: {
      requiredKeywords: ["if score > 500:", "break", "print"],
      requiredOutputIncludes: ["FOUND HIGHSCORE: 520"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Check score > 500 and break." },
      { level: 2, label: "Concept", text: "Linear search stops at the first matching element." },
      { level: 3, label: "Example", text: 'if score > 500:\n    print(f"FOUND HIGHSCORE: {score}")\n    break' },
      { level: 4, label: "Solution", text: "Execute linear search loop." },
    ],
    xpReward: 425,
    coinsReward: 210,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m71",
    rank: "CODER",
    number: 71,
    title: "Nested Accumulation Matrix",
    concept: "Summing 2D Array / Nested Lists",
    difficulty: "Intermediate",
    story: "Sum all numbers in a 2x2 matrix grid [[10, 20], [30, 40]].",
    objectives: ["Set total = 0", "Iterate row in grid, val in row: total += val", "Print total"],
    conceptExplanation: "Use nested loops to traverse and aggregate 2D nested data structures.",
    starterCode: `grid = [[10, 20], [30, 40]]
total = 0
for row in grid:
    for val in row:
        total += val

print(total)
`,
    validationRules: {
      requiredKeywords: ["for row in grid:", "for val in row:", "total +=", "print"],
      requiredOutputIncludes: ["100"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Loop through rows, then values in each row." },
      { level: 2, label: "Concept", text: "Add each val to total." },
      { level: 3, label: "Example", text: "for row in grid:\n    for val in row:\n        total += val\nprint(total)" },
      { level: 4, label: "Solution", text: "Execute 2D matrix sum." },
    ],
    xpReward: 430,
    coinsReward: 215,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m72",
    rank: "CODER",
    number: 72,
    title: "Coder Rank Capstone: Automated Propulsion Speedway",
    concept: "Coder Mastery Synthesis",
    difficulty: "Intermediate",
    story: "Program the autonomous pilot to navigate through 5 speedway checkpoints, harvesting energy tokens along the way.",
    objectives: [
      "Iterate 5 times with range(5)",
      "Call robot.move() and collect_energy()",
      "Print 'AUTOMATED SPEEDWAY CLEARED: CODER MASTERY ACHIEVED'",
    ],
    conceptExplanation: "You have mastered loops, while iteration, breaks, continues, enumerate, zip, and multi-dimensional scanning!",
    starterCode: `for lap in range(5):
    robot.move()
    collect_energy()

print("AUTOMATED SPEEDWAY CLEARED: CODER MASTERY ACHIEVED")
`,
    validationRules: {
      requiredKeywords: ["for lap in range(5):", "robot.move()", "print"],
      requiredOutputIncludes: ["AUTOMATED SPEEDWAY CLEARED: CODER MASTERY ACHIEVED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Run the loop 5 times." },
      { level: 2, label: "Concept", text: "Automate vehicle movement across all checkpoints." },
      { level: 3, label: "Example", text: 'for lap in range(5):\n    robot.move()\n    collect_energy()\nprint("AUTOMATED SPEEDWAY CLEARED: CODER MASTERY ACHIEVED")' },
      { level: 4, label: "Solution", text: "Execute the Coder Capstone loop." },
    ],
    xpReward: 450,
    coinsReward: 225,
    skillIdToUnlock: "py_coder_mastery",
    worldSceneType: "cyber_highway",
  },
];
