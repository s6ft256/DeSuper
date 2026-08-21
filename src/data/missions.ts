import { Mission, RankInfo } from "../types";

export const RANKS: RankInfo[] = [
  {
    id: "ZERO",
    numericRank: 1,
    title: "ZERO",
    badge: "00",
    color: "#94a3b8",
    description: "Begin your journey into the DeSuper digital universe. Awaken the Core terminal.",
    minXp: 0,
  },
  {
    id: "NOVICE",
    numericRank: 2,
    title: "NOVICE",
    badge: "01",
    color: "#38bdf8",
    description: "Master variables, data types, numbers, strings, and mathematical energy operations.",
    minXp: 300,
  },
  {
    id: "APPRENTICE",
    numericRank: 3,
    title: "APPRENTICE",
    badge: "02",
    color: "#34d399",
    description: "Harness conditional logic, security branch gates, and boolean decision-making.",
    minXp: 750,
  },
  {
    id: "CODER",
    numericRank: 4,
    title: "CODER",
    badge: "03",
    color: "#fbbf24",
    description: "Automate vehicles, loop through energy nodes, and master iteration protocols.",
    minXp: 1300,
  },
  {
    id: "DEVELOPER",
    numericRank: 5,
    title: "DEVELOPER",
    badge: "04",
    color: "#f97316",
    description: "Command inventories, data grids, dictionaries, sets, comprehensions, and regex parsing.",
    minXp: 2000,
  },
  {
    id: "ENGINEER",
    numericRank: 6,
    title: "ENGINEER",
    badge: "05",
    color: "#ec4899",
    description: "Architect reusable functions, *args/**kwargs, lambda filters, recursion, and binary search.",
    minXp: 2900,
  },
  {
    id: "ARCHITECT",
    numericRank: 7,
    title: "ARCHITECT",
    badge: "06",
    color: "#a855f7",
    description: "Construct autonomous object-oriented cyber entities, inheritance hierarchies, and dunder methods.",
    minXp: 4000,
  },
  {
    id: "MASTER",
    numericRank: 8,
    title: "MASTER",
    badge: "07",
    color: "#06b6d4",
    description: "Master exception shields, Counter/defaultdict, itertools combinations, and generator pipelines.",
    minXp: 5400,
  },
  {
    id: "SUPREME",
    numericRank: 9,
    title: "SUPREME",
    badge: "08",
    color: "#eab308",
    description: "NumPy matrix algebra, Pandas data analytics, Scikit-Learn ML models, Neural Perceptrons, and Core AI.",
    minXp: 7200,
  },
];

export const MISSIONS: Mission[] = [
  // ================= RANK 1: ZERO =================
  {
    id: "m1",
    rank: "ZERO",
    number: 1,
    title: "Core Awakening",
    concept: "print() and Output Signals",
    difficulty: "Beginner",
    story: "You awaken in a dormant digital highway sector of DeSuper. The primary terminal is offline. Send a high-frequency broadcast signal using Python to reboot the terminal.",
    objectives: ["Use print() to output 'SYSTEM ONLINE'", "Verify that the terminal illuminates in response"],
    conceptExplanation: "In Python, the print() function sends textual information to the output console or terminal screen. Text (strings) must always be wrapped in quotes like \"HELLO\" or 'HELLO'.",
    starterCode: `# MISSION OBJECTIVE: Reboot the dormant terminal.
# Write a print() statement below that outputs: "SYSTEM ONLINE"

# TODO: Write your code here:

`,
    validationRules: {
      requiredOutputIncludes: ["SYSTEM ONLINE"],
      requiredKeywords: ["print"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Look closely at the print statement syntax." },
      { level: 2, label: "Concept", text: "In Python, print(\"...\") outputs whatever string is inside the parentheses." },
      { level: 3, label: "Example", text: 'print("SYSTEM ONLINE")' },
      { level: 4, label: "Solution", text: 'Write print("SYSTEM ONLINE") and click [RUN].' },
    ],
    xpReward: 100,
    coinsReward: 50,
    skillIdToUnlock: "py_print",
    worldSceneType: "terminal",
  },
  {
    id: "m2",
    rank: "ZERO",
    number: 2,
    title: "Identity Signal",
    concept: "Variables and Assignment",
    difficulty: "Beginner",
    story: "The security subroutines require an operative identity. Create a variable to store your agent codename and display it to the subsystem.",
    objectives: [
      "Create a variable called agent_name and assign it the string 'DeSuper'",
      "Print the value of agent_name",
    ],
    conceptExplanation: "Variables are named memory storage containers. In Python, you store data in a variable using the assignment operator (=). For example: player = 'CyberRacer'.",
    starterCode: `# MISSION OBJECTIVE: Set up your operative identity.
# 1. Create a variable called agent_name and assign it the string "DeSuper"
# 2. Use print() to output the agent_name variable

# TODO: Write your code here:

`,
    validationRules: {
      requiredOutputIncludes: ["DeSuper"],
      requiredKeywords: ["agent_name", "print"],
      requiredVariableValues: { agent_name: "DeSuper" },
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Define agent_name, then pass it to print()." },
      { level: 2, label: "Concept", text: "Do not put quotes around variable names when printing them: print(agent_name)." },
      { level: 3, label: "Example", text: 'agent_name = "DeSuper"\nprint(agent_name)' },
      { level: 4, label: "Solution", text: 'Set agent_name = "DeSuper" and print(agent_name).' },
    ],
    xpReward: 100,
    coinsReward: 50,
    skillIdToUnlock: "py_vars",
    worldSceneType: "terminal",
  },
  {
    id: "m3",
    rank: "ZERO",
    number: 3,
    title: "Power Influx",
    concept: "Arithmetic Operations (+, -, *, /)",
    difficulty: "Beginner",
    story: "The booster capacitors are low. Calculate total reserve energy by multiplying base capacitor charge by 4 booster cells.",
    objectives: [
      "Create base_charge = 25",
      "Create total_power = base_charge * 4",
      "Print total_power",
    ],
    conceptExplanation: "Python performs standard math: addition (+), subtraction (-), multiplication (*), division (/), floor division (//), modulo (%), and exponents (**).",
    starterCode: `# MISSION OBJECTIVE: Calculate booster cell energy.
base_charge = 25

# 1. Calculate total_power by multiplying base_charge by 4
# 2. Print total_power

# TODO: Write your code below:

`,
    validationRules: {
      requiredOutputIncludes: ["100"],
      requiredKeywords: ["base_charge", "total_power", "print"],
      requiredVariableValues: { total_power: 100 },
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use the asterisk (*) operator to multiply." },
      { level: 2, label: "Concept", text: "Assign total_power = base_charge * 4." },
      { level: 3, label: "Example", text: "total_power = base_charge * 4\nprint(total_power)" },
      { level: 4, label: "Solution", text: "total_power = base_charge * 4\nprint(total_power)" },
    ],
    xpReward: 120,
    coinsReward: 60,
    skillIdToUnlock: "py_arithmetic",
    worldSceneType: "terminal",
  },

  // ================= RANK 2: NOVICE =================
  {
    id: "m4",
    rank: "NOVICE",
    number: 4,
    title: "Cyber Slicing",
    concept: "String Indexing and Slicing",
    difficulty: "Beginner",
    story: "An encrypted satellite transmission was intercepted: 'NEO_CYBER_MATRIX'. Extract the exact security protocol word 'CYBER' using string slicing.",
    objectives: [
      "Given signal = 'NEO_CYBER_MATRIX'",
      "Extract 'CYBER' using slicing syntax [4:9]",
      "Store in variable decrypted and print it",
    ],
    conceptExplanation: "In Python, string slicing allows extracting sub-strings using the syntax string[start:end:step]. The start index is included, but the end index is excluded.",
    starterCode: `signal = "NEO_CYBER_MATRIX"

# MISSION OBJECTIVE: Extract 'CYBER' from the signal.
# 1. Slice signal from index 4 up to index 9
# 2. Assign the sliced text to decrypted
# 3. Print decrypted

# TODO: Write your code below:

`,
    validationRules: {
      requiredOutputIncludes: ["CYBER"],
      requiredKeywords: ["signal[", "decrypted"],
      requiredVariableValues: { decrypted: "CYBER" },
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Index 0 is 'N', index 4 is 'C', and index 9 stops right after 'R'." },
      { level: 2, label: "Concept", text: "decrypted = signal[4:9]" },
      { level: 3, label: "Example", text: 'decrypted = signal[4:9]\nprint(decrypted)' },
      { level: 4, label: "Solution", text: 'decrypted = signal[4:9]\nprint(decrypted)' },
    ],
    xpReward: 150,
    coinsReward: 75,
    skillIdToUnlock: "py_strings",
    worldSceneType: "terminal",
  },
  {
    id: "m5",
    rank: "NOVICE",
    number: 5,
    title: "Telemetry Stream",
    concept: "f-strings & Dynamic Formatting",
    difficulty: "Beginner",
    story: "Construct an official vehicle telemetry dashboard broadcast using Python f-strings formatted with speed and vehicle model.",
    objectives: [
      "Given vehicle = 'CYBER-GT' and speed = 320",
      "Format message as: 'TELEMETRY: CYBER-GT SPEED 320 KM/H'",
      "Print message",
    ],
    conceptExplanation: "Python f-strings (formatted string literals) allow embedding expressions inside string constants by prefixing with f and wrapping variables in curly braces {variable}.",
    starterCode: `vehicle = "CYBER-GT"
speed = 320

# MISSION OBJECTIVE: Create dynamic telemetry signal using an f-string.
# Output should be: "TELEMETRY: CYBER-GT SPEED 320 KM/H"

# TODO: Write your formatted string below:
telemetry = f"TELEMETRY: {vehicle} SPEED {speed} KM/H"
print(telemetry)
`,
    validationRules: {
      requiredOutputIncludes: ["TELEMETRY: CYBER-GT SPEED 320 KM/H"],
      requiredKeywords: ["f\"", "print"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use f\"TELEMETRY: {vehicle} SPEED {speed} KM/H\"" },
      { level: 2, label: "Concept", text: "f-strings replace {variable} with the variable's value automatically." },
      { level: 3, label: "Example", text: 'telemetry = f"TELEMETRY: {vehicle} SPEED {speed} KM/H"\nprint(telemetry)' },
      { level: 4, label: "Solution", text: 'Run the provided code to verify the telemetry output.' },
    ],
    xpReward: 160,
    coinsReward: 80,
    skillIdToUnlock: "py_fstrings",
    worldSceneType: "terminal",
  },
  {
    id: "m6",
    rank: "NOVICE",
    number: 6,
    title: "Data Transmutation",
    concept: "Type Casting (int, float, str)",
    difficulty: "Beginner",
    story: "Sensor readings arrive as raw text strings: raw_sensor = '150'. Convert it to an integer, add 50 calibration units, and print the total.",
    objectives: [
      "Convert raw_sensor = '150' to an int",
      "Add 50 to get calibrated_value = 200",
      "Print calibrated_value",
    ],
    conceptExplanation: "Type conversion or typecasting converts one data type into another. int('150') converts a string into a numeric integer.",
    starterCode: `raw_sensor = "150"

# MISSION OBJECTIVE: Convert string to integer and calibrate.
# 1. Cast raw_sensor to int and add 50
# 2. Store result in calibrated_value
# 3. Print calibrated_value

# TODO: Write your code below:

`,
    validationRules: {
      requiredOutputIncludes: ["200"],
      requiredKeywords: ["int(", "calibrated_value", "print"],
      requiredVariableValues: { calibrated_value: 200 },
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use int(raw_sensor) + 50." },
      { level: 2, label: "Concept", text: "calibrated_value = int(raw_sensor) + 50" },
      { level: 3, label: "Example", text: 'calibrated_value = int(raw_sensor) + 50\nprint(calibrated_value)' },
      { level: 4, label: "Solution", text: 'calibrated_value = int(raw_sensor) + 50\nprint(calibrated_value)' },
    ],
    xpReward: 170,
    coinsReward: 85,
    skillIdToUnlock: "py_typecast",
    worldSceneType: "terminal",
  },

  // ================= RANK 3: APPRENTICE =================
  {
    id: "m7",
    rank: "APPRENTICE",
    number: 7,
    title: "Perimeter Security Gate",
    concept: "if / else Branching",
    difficulty: "Intermediate",
    story: "A cyber-barrier blocks the highway track. Check if security_clearance is >= 3. If so, call door.open() and print 'ACCESS GRANTED'.",
    objectives: [
      "Given clearance_level = 5",
      "If clearance_level >= 3, open the door and print 'ACCESS GRANTED'",
      "Otherwise print 'ACCESS DENIED'",
    ],
    conceptExplanation: "The if / else statement allows the program to make decisions by executing specific code blocks only when a boolean condition evaluates to True.",
    starterCode: `clearance_level = 5

# MISSION OBJECTIVE: Validate security clearance and open gate.
# 1. Check if clearance_level >= 3
# 2. Inside the if block: call door.open() and print "ACCESS GRANTED"
# 3. In the else block: print "ACCESS DENIED"

if clearance_level >= 3:
    door.open()
    print("ACCESS GRANTED")
else:
    print("ACCESS DENIED")
`,
    validationRules: {
      requiredOutputIncludes: ["ACCESS GRANTED"],
      requiredKeywords: ["if", "door.open", "else"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Since clearance_level is 5 (which is >= 3), door.open() executes." },
      { level: 2, label: "Concept", text: "Conditionals check relational comparisons (>, <, >=, <=, ==, !=)." },
      { level: 3, label: "Example", text: 'if clearance_level >= 3:\n    door.open()\n    print("ACCESS GRANTED")' },
      { level: 4, label: "Solution", text: "Run the code to unseal the security gate." },
    ],
    xpReward: 200,
    coinsReward: 100,
    skillIdToUnlock: "py_conditions",
    worldSceneType: "cyber_gate",
  },
  {
    id: "m8",
    rank: "APPRENTICE",
    number: 8,
    title: "Defense Threat Matrix",
    concept: "Multi-branch Logic (elif)",
    difficulty: "Intermediate",
    story: "Classify incoming threat frequencies based on threat_level: 1 -> 'LOW', 2 -> 'MEDIUM', 3 -> 'CRITICAL'. Print 'THREAT STATUS: CRITICAL'.",
    objectives: [
      "Given threat_level = 3",
      "Use if / elif / else to evaluate threat_level",
      "Print 'THREAT STATUS: CRITICAL'",
    ],
    conceptExplanation: "The elif (short for else if) keyword lets you check multiple conditions sequentially until one matches.",
    starterCode: `threat_level = 3

# MISSION OBJECTIVE: Classify threat level using elif chain.
# If threat_level == 1: print "THREAT STATUS: LOW"
# Elif threat_level == 2: print "THREAT STATUS: MEDIUM"
# Elif threat_level == 3: print "THREAT STATUS: CRITICAL"
# Else: print "THREAT STATUS: UNKNOWN"

# TODO: Write your conditional logic below:

`,
    validationRules: {
      requiredOutputIncludes: ["THREAT STATUS: CRITICAL"],
      requiredKeywords: ["if", "elif", "print"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Check threat_level with == comparison operator." },
      { level: 2, label: "Concept", text: "Use elif threat_level == 3: print('THREAT STATUS: CRITICAL')" },
      { level: 3, label: "Example", text: 'if threat_level == 1:\n    print("THREAT STATUS: LOW")\nelif threat_level == 3:\n    print("THREAT STATUS: CRITICAL")' },
      { level: 4, label: "Solution", text: 'if threat_level == 1:\n    print("THREAT STATUS: LOW")\nelif threat_level == 2:\n    print("THREAT STATUS: MEDIUM")\nelif threat_level == 3:\n    print("THREAT STATUS: CRITICAL")\nelse:\n    print("THREAT STATUS: UNKNOWN")' },
    ],
    xpReward: 220,
    coinsReward: 110,
    skillIdToUnlock: "py_elif",
    worldSceneType: "cyber_gate",
  },
  {
    id: "m9",
    rank: "APPRENTICE",
    number: 9,
    title: "Plasma Shield Overdrive",
    concept: "Logical Operators (and, or, not)",
    difficulty: "Intermediate",
    story: "Activate the plasma defense shield if shield_ready is True AND energy_percent > 75. If both conditions hold, call shield.engage() and print 'SHIELD ENGAGED'.",
    objectives: [
      "Given shield_ready = True and energy_percent = 90",
      "Check using the 'and' operator",
      "Call shield.engage() and print 'SHIELD ENGAGED'",
    ],
    conceptExplanation: "Logical operators combine multiple boolean expressions: 'and' returns True only if both sides are True; 'or' returns True if at least one side is True; 'not' inverts a boolean.",
    starterCode: `shield_ready = True
energy_percent = 90

# MISSION OBJECTIVE: Engage shield with composite boolean logic.
# If shield_ready is True AND energy_percent > 75:
#    call shield.engage()
#    print "SHIELD ENGAGED"

# TODO: Write your code below:

`,
    validationRules: {
      requiredOutputIncludes: ["SHIELD ENGAGED"],
      requiredKeywords: ["shield_ready", "and", "shield.engage"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Combine both checks with the 'and' keyword." },
      { level: 2, label: "Concept", text: "if shield_ready and energy_percent > 75:" },
      { level: 3, label: "Example", text: 'if shield_ready and energy_percent > 75:\n    shield.engage()\n    print("SHIELD ENGAGED")' },
      { level: 4, label: "Solution", text: 'if shield_ready and energy_percent > 75:\n    shield.engage()\n    print("SHIELD ENGAGED")' },
    ],
    xpReward: 240,
    coinsReward: 120,
    skillIdToUnlock: "py_logical_ops",
    worldSceneType: "cyber_gate",
  },

  // ================= RANK 4: CODER =================
  {
    id: "m10",
    rank: "CODER",
    number: 10,
    title: "Vehicle Propulsion Loop",
    concept: "while Loops and Loop Counters",
    difficulty: "Intermediate",
    story: "Drive the cyber racer forward 3 sectors by using a while loop to call robot.move(1) until the counter reaches 3.",
    objectives: [
      "Initialize laps = 0",
      "Loop while laps < 3",
      "Call robot.move(1) and increment laps by 1",
      "Print 'COURSE COMPLETED'",
    ],
    conceptExplanation: "A while loop repeats a block of code continuously as long as its condition remains True. Remember to update the loop counter to avoid infinite loops!",
    starterCode: `# MISSION OBJECTIVE: Travel 3 sectors using a while loop.
laps = 0

# 1. Create while loop checking laps < 3
# 2. Call robot.move(1)
# 3. Increment laps += 1
# 4. Print "COURSE COMPLETED" after the loop

# TODO: Write your while loop below:

`,
    validationRules: {
      requiredOutputIncludes: ["COURSE COMPLETED"],
      requiredKeywords: ["while", "robot.move", "laps +="],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use while laps < 3: and remember to indent robot.move(1) and laps += 1." },
      { level: 2, label: "Concept", text: "Every iteration adds 1 to laps until laps reaches 3." },
      { level: 3, label: "Example", text: 'while laps < 3:\n    robot.move(1)\n    laps += 1\nprint("COURSE COMPLETED")' },
      { level: 4, label: "Solution", text: 'while laps < 3:\n    robot.move(1)\n    laps += 1\nprint("COURSE COMPLETED")' },
    ],
    xpReward: 280,
    coinsReward: 140,
    skillIdToUnlock: "py_while_loops",
    worldSceneType: "robot_lab",
  },
  {
    id: "m11",
    rank: "CODER",
    number: 11,
    title: "Energy Node Harvester",
    concept: "for Loops and range()",
    difficulty: "Intermediate",
    story: "Iterate across 5 energy collection nodes using a for loop with range(5). In each iteration, call collect_energy().",
    objectives: [
      "Loop 5 times using for i in range(5)",
      "Call collect_energy() in each step",
      "Print 'ALL 5 NODES HARVESTED'",
    ],
    conceptExplanation: "The for loop iterates over sequences (such as ranges, lists, or strings). range(5) produces numbers from 0 up to 4.",
    starterCode: `# MISSION OBJECTIVE: Harvest 5 power nodes.
# 1. Use for i in range(5):
# 2. Call collect_energy() inside the loop
# 3. Print "ALL 5 NODES HARVESTED" after the loop

# TODO: Write your loop below:

`,
    validationRules: {
      requiredOutputIncludes: ["ALL 5 NODES HARVESTED"],
      requiredKeywords: ["for", "in", "range(5)", "collect_energy"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Write: for i in range(5): collect_energy()" },
      { level: 2, label: "Concept", text: "The range function determines the exact number of cycles." },
      { level: 3, label: "Example", text: 'for i in range(5):\n    collect_energy()\nprint("ALL 5 NODES HARVESTED")' },
      { level: 4, label: "Solution", text: 'for i in range(5):\n    collect_energy()\nprint("ALL 5 NODES HARVESTED")' },
    ],
    xpReward: 300,
    coinsReward: 150,
    skillIdToUnlock: "py_for_loops",
    worldSceneType: "robot_lab",
  },
  {
    id: "m12",
    rank: "CODER",
    number: 12,
    title: "Arsenal Array Synchronization",
    concept: "List Manipulation & Methods (.append, .pop, .sort)",
    difficulty: "Intermediate",
    story: "Manage the vehicle's weapon inventory list. Append 'PLASMA_CANNON', remove outdated 'PULSE_LASER' with .pop(), sort the list, and print the weapons.",
    objectives: [
      "Given weapons = ['EMP_BLASTER', 'PULSE_LASER', 'TURBO_MISSILE']",
      "Add 'PLASMA_CANNON' using weapons.append()",
      "Remove 'PULSE_LASER' with weapons.pop(1)",
      "Sort weapons alphabetically with weapons.sort() and print weapons",
    ],
    conceptExplanation: "Python lists are ordered, mutable collections. Methods include .append() to add items, .pop() to remove by index, and .sort() to sort in place.",
    starterCode: `weapons = ["EMP_BLASTER", "PULSE_LASER", "TURBO_MISSILE"]

# MISSION OBJECTIVE: Update and sort weapon arsenal.
# 1. weapons.append("PLASMA_CANNON")
# 2. weapons.pop(1)
# 3. weapons.sort()
# 4. print(weapons)

# TODO: Write your code below:

`,
    validationRules: {
      requiredOutputIncludes: ["PLASMA_CANNON"],
      requiredKeywords: ["append", "pop", "sort", "print"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Chain append, pop, sort, and print in order." },
      { level: 2, label: "Concept", text: "weapons.append('PLASMA_CANNON') adds to the end; weapons.pop(1) removes index 1." },
      { level: 3, label: "Example", text: 'weapons.append("PLASMA_CANNON")\nweapons.pop(1)\nweapons.sort()\nprint(weapons)' },
      { level: 4, label: "Solution", text: 'weapons.append("PLASMA_CANNON")\nweapons.pop(1)\nweapons.sort()\nprint(weapons)' },
    ],
    xpReward: 320,
    coinsReward: 160,
    skillIdToUnlock: "py_lists",
    worldSceneType: "robot_lab",
  },
  {
    id: "m13",
    rank: "CODER",
    number: 13,
    title: "Dual Stream Synchronization",
    concept: "enumerate() and zip()",
    difficulty: "Intermediate",
    story: "Pair racer pilots with their corresponding turbo car models using zip() and display their grid positions with enumerate().",
    objectives: [
      "Given pilots = ['Aura', 'Viper', 'Cipher'] and cars = ['GT-1', 'NEO-R2', 'STEALTH-X']",
      "Zip pilots and cars together",
      "Loop and print each pair formatted as 'Aura -> GT-1'",
    ],
    conceptExplanation: "zip() aggregates elements from two or more iterables in pairs, and enumerate() returns an indexed counter alongside each element.",
    starterCode: `pilots = ["Aura", "Viper", "Cipher"]
cars = ["GT-1", "NEO-R2", "STEALTH-X"]

# MISSION OBJECTIVE: Iterate over paired pilot and car streams.
# for pilot, car in zip(pilots, cars):
#     print(f"{pilot} -> {car}")

for pilot, car in zip(pilots, cars):
    print(f"{pilot} -> {car}")
`,
    validationRules: {
      requiredOutputIncludes: ["Aura -> GT-1", "Viper -> NEO-R2", "Cipher -> STEALTH-X"],
      requiredKeywords: ["zip", "for", "print"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Run the zip loop to pair both lists element-by-element." },
      { level: 2, label: "Concept", text: "zip(list1, list2) yields tuples (item1, item2)." },
      { level: 3, label: "Example", text: 'for p, c in zip(pilots, cars):\n    print(f"{p} -> {c}")' },
      { level: 4, label: "Solution", text: "Execute the zip loop code." },
    ],
    xpReward: 340,
    coinsReward: 170,
    skillIdToUnlock: "py_zip_enumerate",
    worldSceneType: "robot_lab",
  },

  // ================= RANK 5: DEVELOPER =================
  {
    id: "m14",
    rank: "DEVELOPER",
    number: 14,
    title: "Cybernetic Registry",
    concept: "Dictionaries and Key-Value Mapping",
    difficulty: "Intermediate",
    story: "Query and mutate a vehicle diagnostic dictionary. Upgrade the 'armor' rating to 95 and return the total sum of power stats.",
    objectives: [
      "Given stats = {'speed': 300, 'armor': 80, 'energy': 100}",
      "Update stats['armor'] = 95",
      "Calculate total_stats = sum(stats.values()) and print total_stats",
    ],
    conceptExplanation: "Dictionaries store data in key-value pairs (dict = {'key': value}). Access and update keys in O(1) time using dict[key].",
    starterCode: `stats = {"speed": 300, "armor": 80, "energy": 100}

# MISSION OBJECTIVE: Upgrade armor and sum all vehicle metrics.
# 1. Set stats["armor"] = 95
# 2. Calculate total_stats = sum(stats.values())
# 3. Print total_stats (expected: 495)

# TODO: Write your dictionary operations below:

`,
    validationRules: {
      requiredOutputIncludes: ["495"],
      requiredKeywords: ["stats[", "sum", "print"],
      requiredVariableValues: { total_stats: 495 },
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Update stats['armor'] = 95 then compute sum(stats.values())." },
      { level: 2, label: "Concept", text: "stats.values() extracts [300, 95, 100]." },
      { level: 3, label: "Example", text: 'stats["armor"] = 95\ntotal_stats = sum(stats.values())\nprint(total_stats)' },
      { level: 4, label: "Solution", text: 'stats["armor"] = 95\ntotal_stats = sum(stats.values())\nprint(total_stats)' },
    ],
    xpReward: 380,
    coinsReward: 190,
    skillIdToUnlock: "py_dicts",
    worldSceneType: "data_matrix",
  },
  {
    id: "m15",
    rank: "DEVELOPER",
    number: 15,
    title: "Quantum List Comprehensions",
    concept: "List Comprehensions & Filtering",
    difficulty: "Intermediate",
    story: "Filter and amplify energy readings in one Pythonic line: given sensor_readings = [12, 45, 80, 24, 90], double only readings > 30.",
    objectives: [
      "Given sensor_readings = [12, 45, 80, 24, 90]",
      "Use list comprehension: [x * 2 for x in sensor_readings if x > 30]",
      "Assign result to boosted_readings and print it",
    ],
    conceptExplanation: "List comprehensions provide a concise way to create lists: [expression for item in iterable if condition].",
    starterCode: `sensor_readings = [12, 45, 80, 24, 90]

# MISSION OBJECTIVE: Filter and amplify readings in one list comprehension.
# Double all readings strictly greater than 30.
# Expected result: [90, 160, 180]

boosted_readings = [x * 2 for x in sensor_readings if x > 30]
print(boosted_readings)
`,
    validationRules: {
      requiredOutputIncludes: ["[90,160,180]", "90, 160, 180", "[90, 160, 180]"],
      requiredKeywords: ["for", "in", "if"],
      requiredVariableValues: { boosted_readings: [90, 160, 180] },
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "The comprehension transforms 45 -> 90, 80 -> 160, and 90 -> 180." },
      { level: 2, label: "Concept", text: "The 'if x > 30' clause skips 12 and 24." },
      { level: 3, label: "Example", text: 'boosted_readings = [x * 2 for x in sensor_readings if x > 30]\nprint(boosted_readings)' },
      { level: 4, label: "Solution", text: "Execute the list comprehension." },
    ],
    xpReward: 400,
    coinsReward: 200,
    skillIdToUnlock: "py_comprehensions",
    worldSceneType: "data_matrix",
  },
  {
    id: "m16",
    rank: "DEVELOPER",
    number: 16,
    title: "Regex Anomaly Extraction",
    concept: "Regular Expressions (re.findall)",
    difficulty: "Intermediate",
    story: "Extract all anomaly hex error codes formatted like 'ERR-101', 'ERR-404', 'ERR-999' from raw log stream text using the re module.",
    objectives: [
      "Import re or use built-in re.findall",
      "Extract pattern r'ERR-\\d+' from log_text",
      "Print extracted error list",
    ],
    conceptExplanation: "The re module provides regular expression matching operations. re.findall(pattern, string) returns all non-overlapping matches of pattern in string as a list of strings.",
    starterCode: `import re

log_text = "WARN node 4 ERR-101 offline. Sector 9 ERR-404 corrupted. Core ERR-999 danger."

# MISSION OBJECTIVE: Extract all error codes matching 'ERR-\\d+'.
# 1. Use re.findall(r"ERR-\\d+", log_text)
# 2. Store in errors
# 3. Print errors (expected: ['ERR-101', 'ERR-404', 'ERR-999'])

errors = re.findall(r"ERR-\\d+", log_text)
print(errors)
`,
    validationRules: {
      requiredOutputIncludes: ["ERR-101", "ERR-404", "ERR-999"],
      requiredKeywords: ["re.findall", "print"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use re.findall(r'ERR-\\d+', log_text)." },
      { level: 2, label: "Concept", text: "\\d+ matches one or more numeric digits following 'ERR-'." },
      { level: 3, label: "Example", text: 'errors = re.findall(r"ERR-\\d+", log_text)\nprint(errors)' },
      { level: 4, label: "Solution", text: "Execute the regex pattern matching." },
    ],
    xpReward: 420,
    coinsReward: 210,
    skillIdToUnlock: "py_regex",
    worldSceneType: "data_matrix",
  },

  // ================= RANK 6: ENGINEER =================
  {
    id: "m17",
    rank: "ENGINEER",
    number: 17,
    title: "Modular Combustion Function",
    concept: "Functions, Parameters, & Return Values",
    difficulty: "Advanced",
    story: "Construct a modular thruster acceleration calculation function calculate_thrust(mass, acceleration) that returns mass * acceleration.",
    objectives: [
      "Define function calculate_thrust(mass, acceleration)",
      "Return mass * acceleration",
      "Compute calculate_thrust(1200, 15) and print result",
    ],
    conceptExplanation: "Functions are reusable blocks of code defined with the def keyword. They accept parameters and return computed outputs with the return keyword.",
    starterCode: `# MISSION OBJECTIVE: Define modular physics calculator.
# 1. def calculate_thrust(mass, acceleration):
# 2.     return mass * acceleration
# 3. Call calculate_thrust(1200, 15) and print result (18000)

# TODO: Write your function below:

`,
    validationRules: {
      requiredOutputIncludes: ["18000"],
      requiredKeywords: ["def", "calculate_thrust", "return"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Write def calculate_thrust(mass, acceleration): return mass * acceleration" },
      { level: 2, label: "Concept", text: "Functions encapsulate logic so it can be called repeatedly." },
      { level: 3, label: "Example", text: 'def calculate_thrust(mass, acceleration):\n    return mass * acceleration\nprint(calculate_thrust(1200, 15))' },
      { level: 4, label: "Solution", text: 'def calculate_thrust(mass, acceleration):\n    return mass * acceleration\nprint(calculate_thrust(1200, 15))' },
    ],
    xpReward: 450,
    coinsReward: 225,
    skillIdToUnlock: "py_functions",
    worldSceneType: "core_reactor",
  },
  {
    id: "m18",
    rank: "ENGINEER",
    number: 18,
    title: "Lambda & Functional Higher-Order Pipeline",
    concept: "Lambda Functions, map(), and filter()",
    difficulty: "Advanced",
    story: "Use functional programming with lambda and filter() to extract all even telemetry frequencies from frequencies = [10, 15, 20, 25, 30, 35, 40].",
    objectives: [
      "Given frequencies = [10, 15, 20, 25, 30, 35, 40]",
      "Use filter with lambda x: x % 2 == 0",
      "Convert to list and print clean_freqs (expected: [10, 20, 30, 40])",
    ],
    conceptExplanation: "Lambda functions are small anonymous functions defined using lambda arguments: expression. filter() filters elements from an iterable based on a boolean function.",
    starterCode: `frequencies = [10, 15, 20, 25, 30, 35, 40]

# MISSION OBJECTIVE: Filter even frequencies using lambda & filter.
# 1. clean_freqs = list(filter(lambda x: x % 2 == 0, frequencies))
# 2. print(clean_freqs)

clean_freqs = list(filter(lambda x: x % 2 == 0, frequencies))
print(clean_freqs)
`,
    validationRules: {
      requiredOutputIncludes: ["10, 20, 30, 40", "[10, 20, 30, 40]"],
      requiredKeywords: ["filter", "lambda", "print"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "lambda x: x % 2 == 0 tests if a number is even." },
      { level: 2, label: "Concept", text: "filter applies the lambda condition to every element in frequencies." },
      { level: 3, label: "Example", text: 'clean_freqs = list(filter(lambda x: x % 2 == 0, frequencies))\nprint(clean_freqs)' },
      { level: 4, label: "Solution", text: "Execute the functional filtering pipeline." },
    ],
    xpReward: 480,
    coinsReward: 240,
    skillIdToUnlock: "py_lambdas",
    worldSceneType: "core_reactor",
  },
  {
    id: "m19",
    rank: "ENGINEER",
    number: 19,
    title: "Binary Search Algorithm",
    concept: "Search Algorithms (TheAlgorithms/Python)",
    difficulty: "Advanced",
    story: "Implement the O(log N) Binary Search algorithm to find target sector 42 in a sorted sector array [10, 20, 30, 42, 50, 60, 70, 80].",
    objectives: [
      "Implement binary_search(arr, target)",
      "Find index of 42 (expected index: 3)",
      "Print result index",
    ],
    conceptExplanation: "Binary search finds the position of a target value within a sorted array by repeatedly dividing the search interval in half, achieving O(log n) time complexity.",
    starterCode: `sectors = [10, 20, 30, 42, 50, 60, 70, 80]

def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

# MISSION OBJECTIVE: Locate sector 42 with binary search.
target_idx = binary_search(sectors, 42)
print("SECTOR INDEX:", target_idx)
`,
    validationRules: {
      requiredOutputIncludes: ["SECTOR INDEX: 3"],
      requiredKeywords: ["def", "binary_search", "while", "return"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Binary search halves the array range each step." },
      { level: 2, label: "Concept", text: "At mid = 3, sectors[3] is 42, so the index 3 is returned immediately." },
      { level: 3, label: "Example", text: 'target_idx = binary_search(sectors, 42)\nprint("SECTOR INDEX:", target_idx)' },
      { level: 4, label: "Solution", text: "Run the binary search code." },
    ],
    xpReward: 500,
    coinsReward: 250,
    skillIdToUnlock: "py_algorithms",
    worldSceneType: "core_reactor",
  },

  // ================= RANK 7: ARCHITECT =================
  {
    id: "m20",
    rank: "ARCHITECT",
    number: 20,
    title: "Object Blueprint Architecture",
    concept: "OOP Classes, __init__, and Methods",
    difficulty: "Advanced",
    story: "Architect an autonomous CyberCar class with __init__(self, model, top_speed) and a boost(self, amount) method that increases top_speed.",
    objectives: [
      "Define class CyberCar",
      "Initialize self.model and self.top_speed in __init__",
      "Implement boost(self, amount) adding amount to top_speed",
      "Instantiate CyberCar('VIPER-9', 300), boost by 50, and print final top_speed (350)",
    ],
    conceptExplanation: "Object-Oriented Programming (OOP) bundles data (attributes) and behavior (methods) into classes and instances.",
    starterCode: `# MISSION OBJECTIVE: Build CyberCar class blueprint.
class CyberCar:
    def __init__(self, model, top_speed):
        self.model = model
        self.top_speed = top_speed

    def boost(self, amount):
        self.top_speed += amount
        return self.top_speed

# Instantiate and test car:
car = CyberCar("VIPER-9", 300)
car.boost(50)
print(f"{car.model} TOP SPEED: {car.top_speed}")
`,
    validationRules: {
      requiredOutputIncludes: ["VIPER-9 TOP SPEED: 350"],
      requiredKeywords: ["class", "CyberCar", "__init__", "boost"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "self.top_speed starts at 300 and increases to 350 with boost(50)." },
      { level: 2, label: "Concept", text: "Methods use 'self' to access and mutate instance attributes." },
      { level: 3, label: "Example", text: 'car = CyberCar("VIPER-9", 300)\ncar.boost(50)\nprint(car.top_speed)' },
      { level: 4, label: "Solution", text: "Run the OOP CyberCar class simulation." },
    ],
    xpReward: 550,
    coinsReward: 275,
    skillIdToUnlock: "py_classes",
    worldSceneType: "core_reactor",
  },
  {
    id: "m21",
    rank: "ARCHITECT",
    number: 21,
    title: "Inheritance & Polymorphism Hierarchy",
    concept: "Class Inheritance & Method Overriding",
    difficulty: "Advanced",
    story: "Extend CyberCar into a specialized HyperRacer class that overrides drive_mode() to return 'HYPERSPEED_WARP'.",
    objectives: [
      "Define class HyperRacer(CyberCar)",
      "Implement drive_mode(self) returning 'HYPERSPEED_WARP'",
      "Instantiate HyperRacer and print drive_mode()",
    ],
    conceptExplanation: "Inheritance allows a child class to inherit attributes and methods from a parent class, and polymorphism lets child classes override specific behaviors.",
    starterCode: `class CyberCar:
    def __init__(self, model):
        self.model = model
        
    def drive_mode(self):
        return "STANDARD_CRUISE"

# MISSION OBJECTIVE: Create HyperRacer child class inheriting CyberCar.
# Override drive_mode(self) to return "HYPERSPEED_WARP"

class HyperRacer(CyberCar):
    def drive_mode(self):
        return "HYPERSPEED_WARP"

racer = HyperRacer("STEALTH-QUANTUM")
print("ACTIVE MODE:", racer.drive_mode())
`,
    validationRules: {
      requiredOutputIncludes: ["ACTIVE MODE: HYPERSPEED_WARP"],
      requiredKeywords: ["class", "HyperRacer", "CyberCar", "drive_mode"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "HyperRacer inherits CyberCar and overrides drive_mode()." },
      { level: 2, label: "Concept", text: "Subclasses can replace parental methods by defining a method with the same name." },
      { level: 3, label: "Example", text: 'class HyperRacer(CyberCar):\n    def drive_mode(self):\n        return "HYPERSPEED_WARP"' },
      { level: 4, label: "Solution", text: "Execute the inheritance hierarchy code." },
    ],
    xpReward: 600,
    coinsReward: 300,
    skillIdToUnlock: "py_inheritance",
    worldSceneType: "core_reactor",
  },

  // ================= RANK 8: MASTER =================
  {
    id: "m22",
    rank: "MASTER",
    number: 22,
    title: "Resilient Error Shield",
    concept: "Exception Handling (try / except / finally)",
    difficulty: "Advanced",
    story: "Protect the vehicle core against division by zero crashes during telemetry calculations by deploying a try/except error shield.",
    objectives: [
      "Wrap risky division in a try block",
      "Catch ZeroDivisionError and print 'SAFE FALLBACK: 0'",
      "Verify code finishes cleanly",
    ],
    conceptExplanation: "Exception handling with try and except blocks prevents program termination when runtime errors occur, allowing graceful recovery.",
    starterCode: `def calculate_efficiency(distance, fuel):
    try:
        result = distance / fuel
        return result
    except:
        return "SAFE FALLBACK: 0"

# MISSION OBJECTIVE: Test zero fuel division safety.
output = calculate_efficiency(500, 0)
print(output)
`,
    validationRules: {
      requiredOutputIncludes: ["SAFE FALLBACK: 0"],
      requiredKeywords: ["try", "except", "def"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "When fuel is 0, 500 / 0 throws an exception caught by except." },
      { level: 2, label: "Concept", text: "The except block returns 'SAFE FALLBACK: 0'." },
      { level: 3, label: "Example", text: 'try:\n    result = distance / fuel\nexcept:\n    return "SAFE FALLBACK: 0"' },
      { level: 4, label: "Solution", text: "Run the safe exception handling test." },
    ],
    xpReward: 650,
    coinsReward: 325,
    skillIdToUnlock: "py_exceptions",
    worldSceneType: "core_reactor",
  },
  {
    id: "m23",
    rank: "MASTER",
    number: 23,
    title: "High-Frequency Counter & Collections",
    concept: "collections.Counter & itertools",
    difficulty: "Advanced",
    story: "Analyze recurring vehicle telemetry sensor anomaly tokens using collections.Counter to find the most frequent warning code.",
    objectives: [
      "Given tokens = ['PWR', 'HEAT', 'PWR', 'SHIELD', 'PWR', 'HEAT']",
      "Count frequencies with Counter(tokens)",
      "Print the frequency of 'PWR' (expected: 3)",
    ],
    conceptExplanation: "The collections module provides specialized container datatypes like Counter, which counts occurrences of hashable objects.",
    starterCode: `from collections import Counter

tokens = ["PWR", "HEAT", "PWR", "SHIELD", "PWR", "HEAT"]

# MISSION OBJECTIVE: Count token occurrences with Counter.
counts = Counter(tokens)
pwr_count = counts["PWR"]
print("PWR FREQUENCY:", pwr_count)
`,
    validationRules: {
      requiredOutputIncludes: ["PWR FREQUENCY: 3"],
      requiredKeywords: ["Counter", "print"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Counter(tokens)['PWR'] calculates how many times 'PWR' appears." },
      { level: 2, label: "Concept", text: "Counter provides dict-like counting in O(N) time." },
      { level: 3, label: "Example", text: 'counts = Counter(tokens)\nprint("PWR FREQUENCY:", counts["PWR"])' },
      { level: 4, label: "Solution", text: "Execute the Counter analysis code." },
    ],
    xpReward: 700,
    coinsReward: 350,
    skillIdToUnlock: "py_collections",
    worldSceneType: "core_reactor",
  },

  // ================= RANK 9: SUPREME =================
  {
    id: "m24",
    rank: "SUPREME",
    number: 24,
    title: "NumPy Vector Matrix Acceleration",
    concept: "NumPy Arrays & Matrix Dot Product",
    difficulty: "Supreme",
    story: "Calculate multi-dimensional engine velocity vectors using NumPy. Compute the dot product between velocity weights and sensor array inputs.",
    objectives: [
      "Create np.array([2.5, 4.0, 6.5]) and weights np.array([1.2, 0.8, 2.0])",
      "Compute dot product: np.dot(velocities, weights)",
      "Print 'NET THRUST VECTOR: 19.2'",
    ],
    conceptExplanation: "NumPy is the fundamental package for scientific computing in Python, providing high-performance multidimensional arrays and matrix algebra operations.",
    starterCode: `import numpy as np

velocities = np.array([2.5, 4.0, 6.5])
weights = np.array([1.2, 0.8, 2.0])

# MISSION OBJECTIVE: Calculate dot product using np.dot().
# Formula: (2.5 * 1.2) + (4.0 * 0.8) + (6.5 * 2.0) = 3.0 + 3.2 + 13.0 = 19.2

net_thrust = np.dot(velocities, weights)
print("NET THRUST VECTOR:", round(net_thrust, 2))
`,
    validationRules: {
      requiredOutputIncludes: ["NET THRUST VECTOR: 19.2"],
      requiredKeywords: ["np.array", "np.dot", "print"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "np.dot computes the vector dot product." },
      { level: 2, label: "Concept", text: "3.0 + 3.2 + 13.0 = 19.2." },
      { level: 3, label: "Example", text: 'net_thrust = np.dot(velocities, weights)\nprint("NET THRUST VECTOR:", round(net_thrust, 2))' },
      { level: 4, label: "Solution", text: "Run the NumPy vector calculations." },
    ],
    xpReward: 800,
    coinsReward: 400,
    skillIdToUnlock: "py_numpy",
    worldSceneType: "core_reactor",
  },
  {
    id: "m25",
    rank: "SUPREME",
    number: 25,
    title: "Pandas Highway Traffic Analytics",
    concept: "Pandas DataFrame & Groupby Analytics",
    difficulty: "Supreme",
    story: "Analyze cyber-city highway sector congestion by creating a Pandas DataFrame and computing average vehicle speeds grouped by sector.",
    objectives: [
      "Construct pd.DataFrame with 'sector' and 'speed' columns",
      "Group by 'sector' and compute mean speed",
      "Print sector statistics",
    ],
    conceptExplanation: "Pandas is the leading Python library for data analysis and manipulation, offering fast DataFrames, aggregations, and grouped summary calculations.",
    starterCode: `import pandas as pd

traffic_data = {
    "sector": ["Alpha", "Beta", "Alpha", "Beta", "Alpha"],
    "speed": [280, 150, 320, 160, 300]
}

# MISSION OBJECTIVE: Create DataFrame and calculate groupby mean.
df = pd.DataFrame(traffic_data)
sector_stats = df.groupby("sector").mean()

print("ALPHA MEAN SPEED:", sector_stats["Alpha"]["speed"])
`,
    validationRules: {
      requiredOutputIncludes: ["ALPHA MEAN SPEED: 300"],
      requiredKeywords: ["pd.DataFrame", "groupby", "mean"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Alpha speeds are [280, 320, 300], whose average is exactly 300." },
      { level: 2, label: "Concept", text: "df.groupby('sector').mean() aggregates numeric columns per category." },
      { level: 3, label: "Example", text: 'df = pd.DataFrame(traffic_data)\nstats = df.groupby("sector").mean()\nprint("ALPHA MEAN SPEED:", stats["Alpha"]["speed"])' },
      { level: 4, label: "Solution", text: "Run the Pandas DataFrame analysis." },
    ],
    xpReward: 850,
    coinsReward: 425,
    skillIdToUnlock: "py_pandas",
    worldSceneType: "core_reactor",
  },
  {
    id: "m26",
    rank: "SUPREME",
    number: 26,
    title: "Scikit-Learn Machine Learning Predictor",
    concept: "Machine Learning (LinearRegression & Train/Test)",
    difficulty: "Supreme",
    story: "Train a Linear Regression AI model on vehicle boost wattage versus top speed to predict maximum velocity for 500W turbo input.",
    objectives: [
      "Fit LinearRegression on X=[100, 200, 300, 400], y=[150, 250, 350, 450]",
      "Predict output for 500W input",
      "Print predicted speed (expected: 550)",
    ],
    conceptExplanation: "Scikit-Learn is the gold standard Machine Learning library in Python for supervised learning (regression, classification) and unsupervised learning (clustering).",
    starterCode: `from sklearn.linear_model import LinearRegression
import numpy as np

# Training dataset: X (watts), y (km/h speed)
X = np.array([100, 200, 300, 400])
y = np.array([150, 250, 350, 450])

# MISSION OBJECTIVE: Train Linear Regression model and predict for 500W.
model = LinearRegression()
model.fit(X, y)

pred = model.predict(np.array([500]))
print("PREDICTED 500W SPEED:", round(pred[0]))
`,
    validationRules: {
      requiredOutputIncludes: ["PREDICTED 500W SPEED: 550"],
      requiredKeywords: ["LinearRegression", "fit", "predict"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "The model learns speed = 1.0 * watts + 50." },
      { level: 2, label: "Concept", text: "For 500W: 1.0 * 500 + 50 = 550 km/h." },
      { level: 3, label: "Example", text: 'model = LinearRegression()\nmodel.fit(X, y)\npred = model.predict(np.array([500]))\nprint("PREDICTED 500W SPEED:", round(pred[0]))' },
      { level: 4, label: "Solution", text: "Execute the Scikit-Learn machine learning training run." },
    ],
    xpReward: 900,
    coinsReward: 450,
    skillIdToUnlock: "py_ml",
    worldSceneType: "core_reactor",
  },
  {
    id: "m27",
    rank: "SUPREME",
    number: 27,
    title: "The DeSuper Core Restoration",
    concept: "Supreme Mastery Capstone",
    difficulty: "Supreme",
    story: "The final barrier is unlocked. You stand before the DeSuper Core. Restore all 4 central modules (Memory, Logic, Security, and Energy) to awaken the universe.",
    objectives: [
      "Restore all 4 Core nodes: 'MEMORY', 'LOGIC', 'SECURITY', 'ENERGY'",
      "Call system.repair() for each module in a loop",
      "Print 'DESUPER CORE FULLY RESTORED: SUPREME MASTERY ACHIEVED'",
    ],
    conceptExplanation: "You have progressed from Zero to Supreme! You have mastered core syntax, control flow, data structures, algorithms, OOP, NumPy, Pandas, and Machine Learning.",
    starterCode: `nodes = ["MEMORY", "LOGIC", "SECURITY", "ENERGY"]

# MISSION OBJECTIVE: Repair all 4 Core nodes and awaken the universe.
# 1. Loop through all nodes in the 'nodes' list
# 2. Call system.repair(node) inside the loop
# 3. Print "DESUPER CORE FULLY RESTORED: SUPREME MASTERY ACHIEVED"

for node in nodes:
    system.repair(node)

print("DESUPER CORE FULLY RESTORED: SUPREME MASTERY ACHIEVED")
`,
    validationRules: {
      requiredKeywords: ["for", "in", "system.repair"],
      requiredOutputIncludes: ["DESUPER CORE FULLY RESTORED: SUPREME MASTERY ACHIEVED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Iterate over nodes and call system.repair(node)." },
      { level: 2, label: "Concept", text: "Loop through all 4 modules to repair each subsystem." },
      { level: 3, label: "Example", text: 'for node in nodes:\n    system.repair(node)\nprint("DESUPER CORE FULLY RESTORED: SUPREME MASTERY ACHIEVED")' },
      { level: 4, label: "Solution", text: "Run the loop and print the final Supreme restoration declaration." },
    ],
    xpReward: 1000,
    coinsReward: 500,
    skillIdToUnlock: "py_supreme_mastery",
    worldSceneType: "core_reactor",
  },
];
