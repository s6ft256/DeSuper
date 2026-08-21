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
    description: "Automate drones, loop through energy nodes, and master iteration protocols.",
    minXp: 1300,
  },
  {
    id: "DEVELOPER",
    numericRank: 5,
    title: "DEVELOPER",
    badge: "04",
    color: "#f97316",
    description: "Command inventories, data grids, dictionaries, lists, and multi-dimensional matrices.",
    minXp: 2000,
  },
  {
    id: "ENGINEER",
    numericRank: 6,
    title: "ENGINEER",
    badge: "05",
    color: "#ec4899",
    description: "Architect reusable function modules, combat formulas, and recursive routines.",
    minXp: 2900,
  },
  {
    id: "ARCHITECT",
    numericRank: 7,
    title: "ARCHITECT",
    badge: "06",
    color: "#a855f7",
    description: "Construct autonomous object-oriented cyber entities, robots, and polymorphic agents.",
    minXp: 4000,
  },
  {
    id: "MASTER",
    numericRank: 8,
    title: "MASTER",
    badge: "07",
    color: "#06b6d4",
    description: "Master exception shields, JSON streams, generator pipelines, and modular engines.",
    minXp: 5400,
  },
  {
    id: "SUPREME",
    numericRank: 9,
    title: "SUPREME",
    badge: "08",
    color: "#eab308",
    description: "Transcend basic programming: optimize algorithms, manage cyber cities, and rebuild the DeSuper Core.",
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
    concept: "print() and Output",
    difficulty: "Beginner",
    story: "You awaken in a dormant digital sector of DeSuper. The primary terminal is offline. Send a high-frequency broadcast signal to reboot the terminal.",
    objectives: ["Use print() to output 'SYSTEM ONLINE'", "Verify that the terminal illuminates in response"],
    conceptExplanation: "In Python, the print() function sends textual information to the output console or terminal screen. Text (strings) must always be wrapped in quotes like \"HELLO\" or 'HELLO'.",
    starterCode: `# Transmit the activation phrase
print("SYSTEM ONLINE")
`,
    validationRules: {
      requiredOutputIncludes: ["SYSTEM ONLINE"],
      requiredKeywords: ["print"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Look closely at the print statement." },
      { level: 2, label: "Concept", text: "In Python, print(\"...\") outputs whatever string is inside the parentheses." },
      { level: 3, label: "Example", text: 'print("SYSTEM ONLINE")' },
      { level: 4, label: "Solution", text: 'Write print("SYSTEM ONLINE") and click Execute Protocol.' },
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
    conceptExplanation: "Variables are named memory storage containers. In Python, you store data in a variable using the assignment operator (=). For example: player = 'Aura'.",
    starterCode: `# Store your codename in a variable
agent_name = "DeSuper"

# Print your agent_name
print(agent_name)
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
    title: "Terminal Handshake",
    concept: "Comments and Multiple Print Statements",
    difficulty: "Beginner",
    story: "Establish a multi-line diagnostic handshake with Sector 0-A. Include a comment documenting the transmission.",
    objectives: [
      "Add a comment starting with #",
      "Print 'CONNECTING TO CORE'",
      "Print 'CONNECTION ESTABLISHED'",
    ],
    conceptExplanation: "Comments in Python begin with the hash symbol (#). Python ignores comments during execution—they are meant for human developers to document code.",
    starterCode: `# Handshake sequence initiation
print("CONNECTING TO CORE")
print("CONNECTION ESTABLISHED")
`,
    validationRules: {
      requiredOutputIncludes: ["CONNECTING TO CORE", "CONNECTION ESTABLISHED"],
      requiredKeywords: ["print"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Make sure both print statements execute in order." },
      { level: 2, label: "Concept", text: "Python executes statements line by line from top to bottom." },
      { level: 3, label: "Example", text: 'print("Line 1")\nprint("Line 2")' },
      { level: 4, label: "Solution", text: 'Ensure both print lines are present and unquoted for commands.' },
    ],
    xpReward: 100,
    coinsReward: 50,
    skillIdToUnlock: "py_comments",
    worldSceneType: "terminal",
  },

  // ================= RANK 2: NOVICE =================
  {
    id: "m4",
    rank: "NOVICE",
    number: 4,
    title: "Energy Matrix Calculation",
    concept: "Integers, Floats, and Operators",
    difficulty: "Beginner",
    story: "The reactor core's power cells are operating at split capacity. Calculate the total energy by summing base_power and boost_power.",
    objectives: [
      "Set base_power to 150 (integer)",
      "Set boost_power to 45.5 (float)",
      "Calculate total_power = base_power + boost_power",
      "Print total_power",
    ],
    conceptExplanation: "Python supports numerical data types: integers (whole numbers like 150) and floats (decimal numbers like 45.5). Operators like +, -, *, / perform arithmetic.",
    starterCode: `# Configure reactor power
base_power = 150
boost_power = 45.5

# Calculate total power
total_power = base_power + boost_power

# Print the total power
print(total_power)
`,
    validationRules: {
      requiredOutputIncludes: ["195.5"],
      requiredKeywords: ["base_power", "boost_power", "total_power"],
      requiredVariableValues: { total_power: 195.5 },
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Add base_power and boost_power using the + operator." },
      { level: 2, label: "Concept", text: "When you add an int to a float, Python produces a float result." },
      { level: 3, label: "Example", text: "total = 100 + 25.5\nprint(total)" },
      { level: 4, label: "Solution", text: "Set total_power = base_power + boost_power and print(total_power)." },
    ],
    xpReward: 150,
    coinsReward: 75,
    skillIdToUnlock: "py_datatypes",
    worldSceneType: "robot_lab",
  },
  {
    id: "m5",
    rank: "NOVICE",
    number: 5,
    title: "Cyber String Matrix",
    concept: "String Concatenation and f-strings",
    difficulty: "Beginner",
    story: "Format the security badge output using Python f-strings to display the operative's sector authorization level.",
    objectives: [
      "Set sector to 'ALPHA-9'",
      "Set clearance to 5",
      "Print the formatted message using an f-string: 'ACCESS GRANTED: SECTOR ALPHA-9 LEVEL 5'",
    ],
    conceptExplanation: "f-strings allow you to insert variables directly inside string text by putting an 'f' before the quotes and enclosing variables in curly braces: f'Hello {name}!'.",
    starterCode: `sector = "ALPHA-9"
clearance = 5

# Format using an f-string
message = f"ACCESS GRANTED: SECTOR {sector} LEVEL {clearance}"
print(message)
`,
    validationRules: {
      requiredOutputIncludes: ["ACCESS GRANTED: SECTOR ALPHA-9 LEVEL 5"],
      requiredKeywords: ["sector", "clearance"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use f\"ACCESS GRANTED: SECTOR {sector} LEVEL {clearance}\"." },
      { level: 2, label: "Concept", text: "f-strings dynamically substitute expressions inside {curly braces}." },
      { level: 3, label: "Example", text: 'name = "AURA"\nprint(f"Agent: {name}")' },
      { level: 4, label: "Solution", text: 'print(f"ACCESS GRANTED: SECTOR {sector} LEVEL {clearance}")' },
    ],
    xpReward: 150,
    coinsReward: 75,
    skillIdToUnlock: "py_strings",
    worldSceneType: "cyber_gate",
  },
  {
    id: "m6",
    rank: "NOVICE",
    number: 6,
    title: "Power Type Conversion",
    concept: "Type Conversion (int, float, str)",
    difficulty: "Beginner",
    story: "An encrypted telemetry sensor transmitted power data as a string '750'. Convert it to an integer and multiply it by 2 to restore full generator output.",
    objectives: [
      "Given raw_signal = '750'",
      "Convert raw_signal to an integer using int()",
      "Multiply by 2 and print the resulting power level",
    ],
    conceptExplanation: "Type conversion functions like int(), float(), and str() change data from one type to another. For example, int('10') becomes the number 10.",
    starterCode: `raw_signal = "750"

# Convert to integer and multiply by 2
power = int(raw_signal) * 2

print(power)
`,
    validationRules: {
      requiredOutputIncludes: ["1500"],
      requiredKeywords: ["int", "raw_signal"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use int(raw_signal) before multiplying by 2." },
      { level: 2, label: "Concept", text: "Multiplying a string '750' * 2 would give '750750'. Converting to int gives 1500." },
      { level: 3, label: "Example", text: "val = int('50') * 2" },
      { level: 4, label: "Solution", text: "power = int(raw_signal) * 2\nprint(power)" },
    ],
    xpReward: 150,
    coinsReward: 75,
    skillIdToUnlock: "py_typecast",
    worldSceneType: "robot_lab",
  },

  // ================= RANK 3: APPRENTICE =================
  {
    id: "m7",
    rank: "APPRENTICE",
    number: 7,
    title: "Security Gate Override",
    concept: "if and else Statements",
    difficulty: "Intermediate",
    story: "A blast door blocks passage into the Data Matrix. Write a condition checking if energy is greater than 50. If true, open the blast door!",
    objectives: [
      "Set energy = 85",
      "Write an if/else block: if energy > 50, call door.open()",
      "Otherwise, print 'INSUFFICIENT POWER'",
    ],
    conceptExplanation: "if / else statements let your program make decisions. The indented code block under 'if' runs only when the boolean condition evaluates to True.",
    starterCode: `energy = 85

# Control the security door based on energy
if energy > 50:
    door.open()
else:
    print("INSUFFICIENT POWER")
`,
    validationRules: {
      requiredKeywords: ["if", "else", "door.open"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Check: if energy > 50:" },
      { level: 2, label: "Concept", text: "Remember to indent the lines under 'if' and 'else' with 4 spaces." },
      { level: 3, label: "Example", text: "if energy > 50:\n    door.open()\nelse:\n    print('Low')" },
      { level: 4, label: "Solution", text: "Use if energy > 50: followed by indented door.open()." },
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
    title: "Plasma Shield Calibration",
    concept: "if, elif, and else",
    difficulty: "Intermediate",
    story: "Incoming anomalous frequency waves require shield calibration. Adjust defense levels based on threat_level: 1 (LOW), 2 (MEDIUM), or 3 (CRITICAL).",
    objectives: [
      "Given threat_level = 3",
      "Use if / elif / else to check threat_level",
      "If 3, call shield.set_frequency(999)",
      "If 2, call shield.set_frequency(500)",
      "Else, call shield.set_frequency(100)",
    ],
    conceptExplanation: "The 'elif' (short for else if) keyword lets you check multiple conditions sequentially. Python stops checking once it finds the first condition that is True.",
    starterCode: `threat_level = 3

if threat_level == 3:
    shield.set_frequency(999)
elif threat_level == 2:
    shield.set_frequency(500)
else:
    shield.set_frequency(100)
`,
    validationRules: {
      requiredKeywords: ["if", "elif", "else", "shield.set_frequency"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use == for comparison (equality check)." },
      { level: 2, label: "Concept", text: "elif threat_level == 2:" },
      { level: 3, label: "Example", text: "if level == 3:\n    shield.set_frequency(999)" },
      { level: 4, label: "Solution", text: "Chain if, elif, and else with the required frequency parameters." },
    ],
    xpReward: 200,
    coinsReward: 100,
    skillIdToUnlock: "py_elif",
    worldSceneType: "robot_lab",
  },
  {
    id: "m9",
    rank: "APPRENTICE",
    number: 9,
    title: "Logical Security Fusion",
    concept: "Logical Operators (and, or, not)",
    difficulty: "Intermediate",
    story: "Bypass a dual-keylock authorization matrix. Both has_keycard must be True AND biometric_verified must be True to unlock the sector terminal.",
    objectives: [
      "Set has_keycard = True and biometric_verified = True",
      "Use 'and' operator in an if statement to verify both",
      "If both are verified, call terminal.activate('AUTHORIZED ACCESS')",
    ],
    conceptExplanation: "Logical operators 'and', 'or', and 'not' combine multiple boolean expressions. 'and' requires both conditions to be True.",
    starterCode: `has_keycard = True
biometric_verified = True

# Verify credentials using the 'and' operator
if has_keycard and biometric_verified:
    terminal.activate("AUTHORIZED ACCESS")
`,
    validationRules: {
      requiredKeywords: ["and", "terminal.activate"],
      requiredOutputIncludes: ["AUTHORIZED ACCESS"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Combine both boolean variables with 'and'." },
      { level: 2, label: "Concept", text: "if has_keycard and biometric_verified:" },
      { level: 3, label: "Example", text: "if ready and armed:\n    launch()" },
      { level: 4, label: "Solution", text: "if has_keycard and biometric_verified: terminal.activate(\"AUTHORIZED ACCESS\")" },
    ],
    xpReward: 200,
    coinsReward: 100,
    skillIdToUnlock: "py_logic_ops",
    worldSceneType: "terminal",
  },

  // ================= RANK 4: CODER =================
  {
    id: "m10",
    rank: "CODER",
    number: 10,
    title: "Energy Node Harvester",
    concept: "for Loops and range()",
    difficulty: "Intermediate",
    story: "Automate the energy harvester drone to gather power from 5 consecutive sub-nodes in Sector Gamma.",
    objectives: [
      "Write a for loop using range(5)",
      "Inside the loop, call collect_energy()",
    ],
    conceptExplanation: "A for loop iterates over a sequence (such as range(5) which produces 0, 1, 2, 3, 4). This lets you repeat actions automatically without duplicating lines.",
    starterCode: `# Automate energy collection 5 times
for i in range(5):
    collect_energy()
`,
    validationRules: {
      requiredKeywords: ["for", "in", "range", "collect_energy"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use for i in range(5):" },
      { level: 2, label: "Concept", text: "range(5) repeats the indented block exactly 5 times." },
      { level: 3, label: "Example", text: "for i in range(5):\n    collect_energy()" },
      { level: 4, label: "Solution", text: "Write 'for i in range(5):' with indented 'collect_energy()'." },
    ],
    xpReward: 250,
    coinsReward: 125,
    skillIdToUnlock: "py_for_loops",
    worldSceneType: "drone_grid",
  },
  {
    id: "m11",
    rank: "CODER",
    number: 11,
    title: "Autonomous Drone Patrol",
    concept: "while Loops",
    difficulty: "Intermediate",
    story: "Program a patrol drone to move forward until it has traveled 4 sectors. Increment steps on each iteration.",
    objectives: [
      "Initialize steps = 0",
      "Write a while loop: while steps < 4",
      "Inside the loop, call robot.move() and increment steps by 1 (steps += 1)",
    ],
    conceptExplanation: "A while loop continues executing as long as its condition remains True. Be sure to modify variables inside the loop so the condition eventually becomes False to prevent infinite loops.",
    starterCode: `steps = 0

# Patrol until 4 steps are complete
while steps < 4:
    robot.move()
    steps += 1

print(f"Patrol complete: {steps} steps")
`,
    validationRules: {
      requiredKeywords: ["while", "robot.move", "steps"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Increment steps inside the loop with steps += 1." },
      { level: 2, label: "Concept", text: "while steps < 4: will stop once steps reaches 4." },
      { level: 3, label: "Example", text: "while count < 4:\n    robot.move()\n    count += 1" },
      { level: 4, label: "Solution", text: "Keep while steps < 4: robot.move(); steps += 1." },
    ],
    xpReward: 250,
    coinsReward: 125,
    skillIdToUnlock: "py_while_loops",
    worldSceneType: "drone_grid",
  },
  {
    id: "m12",
    rank: "CODER",
    number: 12,
    title: "Loop Anomaly Breaker",
    concept: "break and continue",
    difficulty: "Intermediate",
    story: "Scan through node identifiers 0 to 9. If node equals 7 (corrupted node), break immediately to prevent system crash.",
    objectives: [
      "Loop through range(10)",
      "If node == 7, print 'CORRUPTED NODE DETECTED' and break",
      "Otherwise, print f'Scanned node {node}'",
    ],
    conceptExplanation: "'break' terminates the current loop immediately. 'continue' skips the rest of the current iteration and jumps to the next loop cycle.",
    starterCode: `for node in range(10):
    if node == 7:
        print("CORRUPTED NODE DETECTED")
        break
    print(f"Scanned node {node}")
`,
    validationRules: {
      requiredKeywords: ["break", "for", "in", "range"],
      requiredOutputIncludes: ["CORRUPTED NODE DETECTED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use break inside the if block when node == 7." },
      { level: 2, label: "Concept", text: "break exits the for loop immediately, so nodes 8 and 9 are never scanned." },
      { level: 3, label: "Example", text: "if item == target:\n    break" },
      { level: 4, label: "Solution", text: "Ensure 'break' is indented under if node == 7:." },
    ],
    xpReward: 250,
    coinsReward: 125,
    skillIdToUnlock: "py_break_continue",
    worldSceneType: "terminal",
  },

  // ================= RANK 5: DEVELOPER =================
  {
    id: "m13",
    rank: "DEVELOPER",
    number: 13,
    title: "Cyber Inventory Matrix",
    concept: "Lists and List Operations",
    difficulty: "Intermediate",
    story: "Configure the operative's cybernetic gear inventory. Add a 'Plasma Blaster', remove the corrupted item, and inspect inventory length.",
    objectives: [
      "Start with inventory = ['Data Pad', 'EMP Grenade']",
      "Add 'Plasma Blaster' using inventory.append()",
      "Print the full inventory and its length using len()",
    ],
    conceptExplanation: "Lists are ordered, mutable collections in Python. You create lists using square brackets []. Use .append(item) to add elements and len(list) to get the item count.",
    starterCode: `inventory = ["Data Pad", "EMP Grenade"]

# Equip the Plasma Blaster
inventory.append("Plasma Blaster")

print("INVENTORY:", inventory)
print("TOTAL ITEMS:", len(inventory))
`,
    validationRules: {
      requiredKeywords: ["append", "inventory", "len"],
      requiredOutputIncludes: ["Plasma Blaster", "3"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use inventory.append(\"Plasma Blaster\")." },
      { level: 2, label: "Concept", text: "Lists keep elements in ordered slots starting at index 0." },
      { level: 3, label: "Example", text: 'items.append("Shield")\nprint(len(items))' },
      { level: 4, label: "Solution", text: "Call inventory.append('Plasma Blaster') and print(inventory)." },
    ],
    xpReward: 300,
    coinsReward: 150,
    skillIdToUnlock: "py_lists",
    worldSceneType: "data_matrix",
  },
  {
    id: "m14",
    rank: "DEVELOPER",
    number: 14,
    title: "Sensor Array Slicing",
    concept: "List Indexing and Slicing",
    difficulty: "Intermediate",
    story: "Extract telemetry from sensor arrays 1 through 3 (excluding index 4) from a 6-sensor grid using slice notation [1:4].",
    objectives: [
      "Given telemetry = [12, 45, 78, 92, 105, 120]",
      "Extract active_sector = telemetry[1:4]",
      "Print active_sector",
    ],
    conceptExplanation: "List slicing [start:end] extracts a sub-list starting at 'start' up to (but not including) 'end'. For example, [1:4] gets items at indices 1, 2, and 3.",
    starterCode: `telemetry = [12, 45, 78, 92, 105, 120]

# Slice sensors from index 1 to 4
active_sector = telemetry[1:4]

print("ACTIVE SECTOR:", active_sector)
`,
    validationRules: {
      requiredKeywords: ["telemetry", "active_sector"],
      requiredOutputIncludes: ["[45, 78, 92]"],
      requiredVariableValues: { active_sector: [45, 78, 92] },
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use telemetry[1:4]." },
      { level: 2, label: "Concept", text: "Index 1 is 45, index 2 is 78, index 3 is 92. Index 4 (105) is excluded." },
      { level: 3, label: "Example", text: "sub = list_data[1:4]" },
      { level: 4, label: "Solution", text: "Set active_sector = telemetry[1:4] and print it." },
    ],
    xpReward: 300,
    coinsReward: 150,
    skillIdToUnlock: "py_slicing",
    worldSceneType: "data_matrix",
  },
  {
    id: "m15",
    rank: "DEVELOPER",
    number: 15,
    title: "Core Database Registry",
    concept: "Dictionaries (Key-Value Pairs)",
    difficulty: "Intermediate",
    story: "Access and modify the DeSuper Core security status dictionary. Update the 'firewall' key from 'STANDBY' to 'ACTIVE'.",
    objectives: [
      "Given core_db = {'status': 'ONLINE', 'firewall': 'STANDBY', 'security_level': 4}",
      "Update core_db['firewall'] = 'ACTIVE'",
      "Print the updated core_db",
    ],
    conceptExplanation: "Dictionaries store key-value mappings using curly braces {key: value}. You look up or update values using their keys: dict[key] = new_value.",
    starterCode: `core_db = {
    "status": "ONLINE",
    "firewall": "STANDBY",
    "security_level": 4
}

# Update firewall status
core_db["firewall"] = "ACTIVE"

print("CORE DATABASE:", core_db)
`,
    validationRules: {
      requiredKeywords: ["core_db", "firewall", "ACTIVE"],
      requiredOutputIncludes: ["ACTIVE"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Assign 'ACTIVE' to core_db['firewall']." },
      { level: 2, label: "Concept", text: "Dictionaries allow fast lookups and updates by key." },
      { level: 3, label: "Example", text: 'db["status"] = "OK"' },
      { level: 4, label: "Solution", text: 'core_db["firewall"] = "ACTIVE"\nprint(core_db)' },
    ],
    xpReward: 300,
    coinsReward: 150,
    skillIdToUnlock: "py_dicts",
    worldSceneType: "data_matrix",
  },

  // ================= RANK 6: ENGINEER =================
  {
    id: "m16",
    rank: "ENGINEER",
    number: 16,
    title: "Robot Repair Protocol",
    concept: "Functions, Parameters, and Return Values",
    difficulty: "Advanced",
    story: "Build a reusable engineering routine 'repair_robot' that takes a target robot object, restores its health by 50, and returns the updated health value.",
    objectives: [
      "Define function repair_unit(current_health, boost_amount)",
      "Return the sum of current_health and boost_amount",
      "Call repair_unit(40, 50) and print the result",
    ],
    conceptExplanation: "Functions are defined with the 'def' keyword. They accept parameters and pass back results with 'return'. This makes your code modular and reusable.",
    starterCode: `# Define the repair protocol
def repair_unit(current_health, boost_amount):
    new_health = current_health + boost_amount
    return new_health

# Test the protocol
result = repair_unit(40, 50)
print("REPAIRED HEALTH:", result)
`,
    validationRules: {
      requiredKeywords: ["def", "repair_unit", "return"],
      requiredOutputIncludes: ["90"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use def repair_unit(current_health, boost_amount):" },
      { level: 2, label: "Concept", text: "Return the calculated sum with 'return current_health + boost_amount'." },
      { level: 3, label: "Example", text: "def add(a, b):\n    return a + b" },
      { level: 4, label: "Solution", text: "Define repair_unit returning current_health + boost_amount." },
    ],
    xpReward: 350,
    coinsReward: 175,
    skillIdToUnlock: "py_functions",
    worldSceneType: "robot_lab",
  },
  {
    id: "m17",
    rank: "ENGINEER",
    number: 17,
    title: "Laser Grid Calculation",
    concept: "Default Parameters and Scope",
    difficulty: "Advanced",
    story: "Calculate laser beam output energy with an optional amplification multiplier (default multiplier = 1.5).",
    objectives: [
      "Define function calculate_beam(power, multiplier=1.5)",
      "Return power * multiplier",
      "Print calculate_beam(100) and calculate_beam(100, 2.0)",
    ],
    conceptExplanation: "Default parameters allow arguments to have preset values if the caller doesn't specify them. For example: def greet(name='Agent'): ...",
    starterCode: `def calculate_beam(power, multiplier=1.5):
    return power * multiplier

# Call with default multiplier
print("STANDARD BEAM:", calculate_beam(100))

# Call with custom multiplier
print("OVERCHARGED BEAM:", calculate_beam(100, 2.0))
`,
    validationRules: {
      requiredKeywords: ["def", "calculate_beam", "multiplier"],
      requiredOutputIncludes: ["150", "200"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Specify default multiplier in the function header: multiplier=1.5." },
      { level: 2, label: "Concept", text: "If only one argument is given, multiplier defaults to 1.5." },
      { level: 3, label: "Example", text: "def blast(p, m=1.5):\n    return p * m" },
      { level: 4, label: "Solution", text: "def calculate_beam(power, multiplier=1.5): return power * multiplier" },
    ],
    xpReward: 350,
    coinsReward: 175,
    skillIdToUnlock: "py_scope_defaults",
    worldSceneType: "robot_lab",
  },
  {
    id: "m18",
    rank: "ENGINEER",
    number: 18,
    title: "Quantum Reactor Countdown",
    concept: "Recursion",
    difficulty: "Advanced",
    story: "The reactor stabilizer needs a recursive countdown sequence from n down to 1, then prints 'REACTOR STABILIZED'.",
    objectives: [
      "Write a recursive function countdown(n)",
      "If n <= 0: print 'REACTOR STABILIZED' and return",
      "Else: print f'Count: {n}' and recursively call countdown(n - 1)",
    ],
    conceptExplanation: "Recursion is when a function calls itself to solve smaller sub-problems. Every recursive function MUST have a base case to stop calling itself.",
    starterCode: `def countdown(n):
    if n <= 0:
        print("REACTOR STABILIZED")
        return
    print(f"Count: {n}")
    countdown(n - 1)

# Initiate stabilization
countdown(3)
`,
    validationRules: {
      requiredKeywords: ["def", "countdown", "return"],
      requiredOutputIncludes: ["Count: 3", "Count: 2", "Count: 1", "REACTOR STABILIZED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Base case: when n <= 0, print 'REACTOR STABILIZED' and return." },
      { level: 2, label: "Concept", text: "Recursive step: call countdown(n - 1) on each step." },
      { level: 3, label: "Example", text: "def rec(n):\n    if n == 0: return\n    rec(n-1)" },
      { level: 4, label: "Solution", text: "Check n <= 0 for base case, otherwise call countdown(n - 1)." },
    ],
    xpReward: 350,
    coinsReward: 175,
    skillIdToUnlock: "py_recursion",
    worldSceneType: "core_reactor",
  },

  // ================= RANK 7: ARCHITECT =================
  {
    id: "m19",
    rank: "ARCHITECT",
    number: 19,
    title: "Cyber Entity Construction",
    concept: "Object-Oriented Programming (Classes & Objects)",
    difficulty: "Advanced",
    story: "Construct an autonomous CyberBot blueprint with attributes for name and energy, and a recharge() method that sets energy to 100.",
    objectives: [
      "Define class CyberBot with __init__(self, name) and self.energy = 50",
      "Add a method recharge(self) that sets self.energy = 100",
      "Instantiate bot = CyberBot('Sentinel')",
      "Call bot.recharge() and print bot.energy",
    ],
    conceptExplanation: "Classes are blueprints for creating objects. The __init__ constructor initializes attributes on 'self'. Methods are functions inside classes that operate on the object.",
    starterCode: `class CyberBot:
    def __init__(self, name):
        self.name = name
        self.energy = 50

    def recharge(self):
        self.energy = 100
        print(f"{self.name} recharged to 100%!")

# Create and recharge bot
bot = CyberBot("Sentinel")
bot.recharge()
print("FINAL ENERGY:", bot.energy)
`,
    validationRules: {
      requiredKeywords: ["class", "CyberBot", "__init__", "recharge", "self"],
      requiredOutputIncludes: ["Sentinel recharged to 100%!", "100"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Define class CyberBot with __init__(self, name) and recharge(self)." },
      { level: 2, label: "Concept", text: "self refers to the specific instance of the object being created or used." },
      { level: 3, label: "Example", text: "class Bot:\n    def __init__(self, name):\n        self.name = name" },
      { level: 4, label: "Solution", text: "Instantiate bot = CyberBot('Sentinel'), call bot.recharge(), and print bot.energy." },
    ],
    xpReward: 400,
    coinsReward: 200,
    skillIdToUnlock: "py_classes",
    worldSceneType: "robot_lab",
  },
  {
    id: "m20",
    rank: "ARCHITECT",
    number: 20,
    title: "Drone Fleet Inheritance",
    concept: "Inheritance and Polymorphism",
    difficulty: "Advanced",
    story: "Create a ScoutDrone subclass that inherits from CyberBot, adding a specialized scan_area() method.",
    objectives: [
      "Define class ScoutDrone(CyberBot)",
      "Add method scan_area(self) returning 'TARGET LOCATED'",
      "Instantiate scout = ScoutDrone('Scout-1')",
      "Print scout.scan_area()",
    ],
    conceptExplanation: "Inheritance lets a child class inherit methods and attributes from a parent class: class Child(Parent): ... This enables code reuse and specialized behaviors.",
    starterCode: `class CyberBot:
    def __init__(self, name):
        self.name = name

class ScoutDrone(CyberBot):
    def scan_area(self):
        return "TARGET LOCATED"

scout = ScoutDrone("Scout-1")
print(scout.name, "STATUS:", scout.scan_area())
`,
    validationRules: {
      requiredKeywords: ["class", "ScoutDrone", "CyberBot", "scan_area"],
      requiredOutputIncludes: ["TARGET LOCATED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Pass CyberBot inside parentheses: class ScoutDrone(CyberBot):" },
      { level: 2, label: "Concept", text: "ScoutDrone inherits the __init__ constructor from CyberBot." },
      { level: 3, label: "Example", text: "class Scout(Bot):\n    def scan(self):\n        return 'OK'" },
      { level: 4, label: "Solution", text: "Define class ScoutDrone(CyberBot) with scan_area(self) returning 'TARGET LOCATED'." },
    ],
    xpReward: 400,
    coinsReward: 200,
    skillIdToUnlock: "py_inheritance",
    worldSceneType: "drone_grid",
  },
  {
    id: "m21",
    rank: "ARCHITECT",
    number: 21,
    title: "Encapsulated Core Vault",
    concept: "Encapsulation and Properties",
    difficulty: "Advanced",
    story: "Build a SecurityVault class that protects the encryption key and provides an authorized access getter method.",
    objectives: [
      "Define SecurityVault class with passcode attribute",
      "Add unlock(self, input_code) method that returns True if code matches, else False",
      "Test unlocking with correct code 7799",
    ],
    conceptExplanation: "Encapsulation restricts direct access to internal components of an object, exposing controlled methods to interact safely with state.",
    starterCode: `class SecurityVault:
    def __init__(self, code):
        self.code = code

    def unlock(self, input_code):
        if input_code == self.code:
            return "ACCESS GRANTED"
        return "ACCESS DENIED"

vault = SecurityVault(7799)
print("TEST 1:", vault.unlock(7799))
print("TEST 2:", vault.unlock(1234))
`,
    validationRules: {
      requiredKeywords: ["class", "SecurityVault", "unlock"],
      requiredOutputIncludes: ["ACCESS GRANTED", "ACCESS DENIED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Compare input_code with self.code." },
      { level: 2, label: "Concept", text: "Return 'ACCESS GRANTED' when codes match." },
      { level: 3, label: "Example", text: "if input_code == self.code: return True" },
      { level: 4, label: "Solution", text: "Return 'ACCESS GRANTED' for 7799 and 'ACCESS DENIED' for 1234." },
    ],
    xpReward: 400,
    coinsReward: 200,
    skillIdToUnlock: "py_encapsulation",
    worldSceneType: "data_matrix",
  },

  // ================= RANK 8: MASTER =================
  {
    id: "m22",
    rank: "MASTER",
    number: 22,
    title: "Exception Firewall Shield",
    concept: "try, except, and Error Handling",
    difficulty: "Advanced",
    story: "A corrupted sensor stream may divide by zero or pass invalid integers. Enclose parsing in a try/except block to intercept anomalies gracefully without crashing.",
    objectives: [
      "Wrap division in try block",
      "Catch ZeroDivisionError / ValueError with except",
      "Print 'ANOMALY DEFLECTED: FALLBACK 0' when an exception occurs",
    ],
    conceptExplanation: "try / except blocks prevent programs from abruptly crashing when unexpected errors occur at runtime, allowing graceful recovery.",
    starterCode: `def safe_divide(a, b):
    try:
        result = a / b
        return result
    except:
        print("ANOMALY DEFLECTED: FALLBACK 0")
        return 0

print("NORMAL:", safe_divide(100, 2))
print("ANOMALY:", safe_divide(100, 0))
`,
    validationRules: {
      requiredKeywords: ["try", "except", "safe_divide"],
      requiredOutputIncludes: ["ANOMALY DEFLECTED: FALLBACK 0", "50"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use try: and except: to catch the division by zero." },
      { level: 2, label: "Concept", text: "If an error occurs in the try block, execution immediately jumps to except." },
      { level: 3, label: "Example", text: "try:\n    x = 1/0\nexcept:\n    print('Handled')" },
      { level: 4, label: "Solution", text: "Return a / b in try block, print fallback message and return 0 in except." },
    ],
    xpReward: 500,
    coinsReward: 250,
    skillIdToUnlock: "py_exceptions",
    worldSceneType: "terminal",
  },
  {
    id: "m23",
    rank: "MASTER",
    number: 23,
    title: "JSON Telemetry Stream",
    concept: "JSON Data Serialization and Parsing",
    difficulty: "Advanced",
    story: "Parse incoming cyber satellite telemetry encoded in JSON format and extract the security status.",
    objectives: [
      "Given raw_json = '{\"core\": \"DeSuper\", \"status\": \"OPTIMAL\", \"level\": 9}'",
      "Parse with json.loads(raw_json)",
      "Print the 'status' value",
    ],
    conceptExplanation: "JSON (JavaScript Object Notation) is the universal data exchange format. In Python, json.loads() converts JSON strings into Python dictionaries.",
    starterCode: `raw_json = '{"core": "DeSuper", "status": "OPTIMAL", "level": 9}'

# Parse telemetry stream
data = json.loads(raw_json)

print("CORE STATUS:", data["status"])
`,
    validationRules: {
      requiredKeywords: ["json.loads", "raw_json"],
      requiredOutputIncludes: ["OPTIMAL"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use json.loads(raw_json) to convert string to dict." },
      { level: 2, label: "Concept", text: "Access data['status'] on the parsed dictionary." },
      { level: 3, label: "Example", text: "parsed = json.loads(raw)\nprint(parsed['key'])" },
      { level: 4, label: "Solution", text: "Set data = json.loads(raw_json) and print(data['status'])." },
    ],
    xpReward: 500,
    coinsReward: 250,
    skillIdToUnlock: "py_json",
    worldSceneType: "data_matrix",
  },
  {
    id: "m24",
    rank: "MASTER",
    number: 24,
    title: "Cyber Stream Generators",
    concept: "Generators and yield",
    difficulty: "Advanced",
    story: "Build a memory-efficient generator function stream_energy(limit) that yields power pulses one by one.",
    objectives: [
      "Define function stream_energy(limit)",
      "Loop from 1 to limit + 1 and yield energy pulse",
      "Iterate over the generator with a for loop and print pulses",
    ],
    conceptExplanation: "Generators use the 'yield' keyword to produce values lazily on-demand without loading entire datasets into memory at once.",
    starterCode: `def stream_energy(limit):
    for i in range(1, limit + 1):
        yield f"PULSE_{i * 10}MW"

# Consume the generator stream
for pulse in stream_energy(3):
    print("EMITTED:", pulse)
`,
    validationRules: {
      requiredKeywords: ["def", "stream_energy", "yield"],
      requiredOutputIncludes: ["PULSE_10MW", "PULSE_20MW", "PULSE_30MW"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use yield instead of return inside the generator loop." },
      { level: 2, label: "Concept", text: "yield pauses function execution and emits a value to the caller." },
      { level: 3, label: "Example", text: "def gen():\n    yield 1\n    yield 2" },
      { level: 4, label: "Solution", text: "Loop in stream_energy and yield formatted pulse strings." },
    ],
    xpReward: 500,
    coinsReward: 250,
    skillIdToUnlock: "py_generators",
    worldSceneType: "core_reactor",
  },

  // ================= RANK 9: SUPREME =================
  {
    id: "m25",
    rank: "SUPREME",
    number: 25,
    title: "Binary Search Optimization",
    concept: "Algorithms & O(log n) Search",
    difficulty: "Supreme",
    story: "Locate the corrupted memory sector inside an indexed grid of 1,000 sectors in O(log n) time using Binary Search.",
    objectives: [
      "Implement binary_search(arr, target)",
      "Divide search space with left, right, and mid pointers",
      "Return the index of target 842",
    ],
    conceptExplanation: "Binary search searches a sorted list by repeatedly dividing the search interval in half, achieving logarithmic O(log n) efficiency.",
    starterCode: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

grid = [100, 250, 410, 600, 842, 990, 1200]
idx = binary_search(grid, 842)
print("CORRUPTED SECTOR FOUND AT INDEX:", idx)
`,
    validationRules: {
      requiredKeywords: ["def", "binary_search", "while", "left", "right"],
      requiredOutputIncludes: ["CORRUPTED SECTOR FOUND AT INDEX: 4"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Calculate mid = (left + right) // 2 on each iteration." },
      { level: 2, label: "Concept", text: "If arr[mid] < target, search right half by setting left = mid + 1." },
      { level: 3, label: "Example", text: "while left <= right: mid = (left + right) // 2 ..." },
      { level: 4, label: "Solution", text: "Implement binary search correctly to find index 4 for target 842." },
    ],
    xpReward: 750,
    coinsReward: 350,
    skillIdToUnlock: "py_algorithms",
    worldSceneType: "core_reactor",
  },
  {
    id: "m26",
    rank: "SUPREME",
    number: 26,
    title: "Autonomous City Grid Orchestrator",
    concept: "System Architecture and Multi-Component Integration",
    difficulty: "Supreme",
    story: "Coordinate power, traffic, and emergency response subsystems across DeSuper Digital Metropolis simultaneously.",
    objectives: [
      "Build CityOrchestrator class with sub-systems",
      "Include manage_traffic(level), boost_power(), and optimize_grid()",
      "Execute automated citywide stabilization protocol",
    ],
    conceptExplanation: "Supreme software engineering combines OOP, data structures, error handling, and algorithmic coordination into cohesive full-stack architectures.",
    starterCode: `class CityOrchestrator:
    def __init__(self, city_name):
        self.city_name = city_name
        self.power_level = 100
        self.traffic_flow = "OPTIMAL"

    def optimize_grid(self):
        city.boost_power()
        city.manage_traffic(5)
        return f"{self.city_name} GRID FULLY OPTIMIZED"

orchestrator = CityOrchestrator("DeSuper-Prime")
status = orchestrator.optimize_grid()
print("SYSTEM RESULT:", status)
`,
    validationRules: {
      requiredKeywords: ["class", "CityOrchestrator", "optimize_grid", "city.boost_power"],
      requiredOutputIncludes: ["GRID FULLY OPTIMIZED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Define CityOrchestrator and call city.boost_power() inside optimize_grid()." },
      { level: 2, label: "Concept", text: "Combine system methods to restore all city subsystems at once." },
      { level: 3, label: "Example", text: "orchestrator.optimize_grid()" },
      { level: 4, label: "Solution", text: "Instantiate CityOrchestrator and call optimize_grid()." },
    ],
    xpReward: 750,
    coinsReward: 350,
    skillIdToUnlock: "py_architecture",
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
    conceptExplanation: "You have progressed from Zero to Supreme! You are no longer just learning to code—you are building and mastering real systems with Python.",
    starterCode: `nodes = ["MEMORY", "LOGIC", "SECURITY", "ENERGY"]

# Repair every subsystem node
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
      { level: 3, label: "Example", text: "for n in nodes: system.repair(n)" },
      { level: 4, label: "Solution", text: "Run the loop and print the final Supreme restoration declaration." },
    ],
    xpReward: 1000,
    coinsReward: 500,
    skillIdToUnlock: "py_supreme_mastery",
    worldSceneType: "core_reactor",
  },
];
