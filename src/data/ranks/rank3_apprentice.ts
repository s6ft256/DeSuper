import { Mission } from "../../types";

export const RANK3_APPRENTICE_MISSIONS: Mission[] = [
  {
    id: "m37",
    rank: "APPRENTICE",
    number: 37,
    title: "Security Gate: If Condition",
    concept: "if Statements",
    difficulty: "Intermediate",
    story: "Approach the Sector 3 perimeter gate. If vehicle energy is 100 or greater, lower the security barriers.",
    objectives: ["Check if energy >= 100", "If true, print 'BARRIER LOWERED: ACCESS GRANTED'"],
    conceptExplanation: "An 'if' statement executes a block of indented code only when its condition expression evaluates to True.",
    starterCode: `energy = 120

# MISSION OBJECTIVE: Check if energy >= 100
if energy >= 100:
    print("BARRIER LOWERED: ACCESS GRANTED")
`,
    validationRules: {
      requiredKeywords: ["if", "energy >= 100:", "print"],
      requiredOutputIncludes: ["BARRIER LOWERED: ACCESS GRANTED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Write if energy >= 100: followed by indented print." },
      { level: 2, label: "Concept", text: "Python uses 4-space indentation for code blocks." },
      { level: 3, label: "Example", text: 'if energy >= 100:\n    print("BARRIER LOWERED: ACCESS GRANTED")' },
      { level: 4, label: "Solution", text: 'if energy >= 100:\n    print("BARRIER LOWERED: ACCESS GRANTED")' },
    ],
    xpReward: 250,
    coinsReward: 125,
    skillIdToUnlock: "py_conditionals",
    worldSceneType: "firewall_grid",
  },
  {
    id: "m38",
    rank: "APPRENTICE",
    number: 38,
    title: "Dual Branch: If-Else",
    concept: "if-else Statements",
    difficulty: "Intermediate",
    story: "Route the vehicle through the fast-lane if nitro level is above 50, otherwise route to the charging bay.",
    objectives: ["If nitro > 50, print 'FAST LANE ENGAGED'", "Else, print 'CHARGING BAY ROUTE'"],
    conceptExplanation: "The 'else' keyword defines an alternate code block that executes when the preceding 'if' condition is False.",
    starterCode: `nitro = 75

if nitro > 50:
    print("FAST LANE ENGAGED")
else:
    print("CHARGING BAY ROUTE")
`,
    validationRules: {
      requiredKeywords: ["if", "else:", "print"],
      requiredOutputIncludes: ["FAST LANE ENGAGED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Write the if-else branch structure." },
      { level: 2, label: "Concept", text: "if condition:\n    ...\nelse:\n    ..." },
      { level: 3, label: "Example", text: 'if nitro > 50:\n    print("FAST LANE ENGAGED")\nelse:\n    print("CHARGING BAY ROUTE")' },
      { level: 4, label: "Solution", text: "Execute the if-else branch." },
    ],
    xpReward: 255,
    coinsReward: 125,
    worldSceneType: "firewall_grid",
  },
  {
    id: "m39",
    rank: "APPRENTICE",
    number: 39,
    title: "Speed Zone: Elif Ladder",
    concept: "elif (Else If) Chains",
    difficulty: "Intermediate",
    story: "Categorize vehicle telemetry speed into 'HYPER', 'CRUISE', or 'SLOW'.",
    objectives: [
      "If speed >= 300, print 'STATUS: HYPER'",
      "Elif speed >= 150, print 'STATUS: CRUISE'",
      "Else, print 'STATUS: SLOW'",
    ],
    conceptExplanation: "'elif' allows checking multiple conditional expressions in sequence until one matches.",
    starterCode: `speed = 340

if speed >= 300:
    print("STATUS: HYPER")
elif speed >= 150:
    print("STATUS: CRUISE")
else:
    print("STATUS: SLOW")
`,
    validationRules: {
      requiredKeywords: ["if", "elif", "else:", "print"],
      requiredOutputIncludes: ["STATUS: HYPER"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Chain if, elif, and else." },
      { level: 2, label: "Concept", text: "elif checks subsequent conditions." },
      { level: 3, label: "Example", text: 'if speed >= 300:\n    print("STATUS: HYPER")\nelif speed >= 150:\n    print("STATUS: CRUISE")\nelse:\n    print("STATUS: SLOW")' },
      { level: 4, label: "Solution", text: "Execute the multi-tier speed classifier." },
    ],
    xpReward: 260,
    coinsReward: 130,
    worldSceneType: "firewall_grid",
  },
  {
    id: "m40",
    rank: "APPRENTICE",
    number: 40,
    title: "Nested Security Clearance",
    concept: "Nested Conditionals",
    difficulty: "Intermediate",
    story: "Verify user clearance level first, then check whether biometric scan passes.",
    objectives: [
      "If clearance == 'LEVEL_5', check if biometric == True",
      "If both match, print 'ACCESS: FULL VAULT UNLOCKED'",
    ],
    conceptExplanation: "You can place if statements inside other if statements to create nested logical decision trees.",
    starterCode: `clearance = "LEVEL_5"
biometric = True

if clearance == "LEVEL_5":
    if biometric:
        print("ACCESS: FULL VAULT UNLOCKED")
`,
    validationRules: {
      requiredKeywords: ["if clearance ==", "if biometric", "print"],
      requiredOutputIncludes: ["ACCESS: FULL VAULT UNLOCKED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Nest the second if inside the first." },
      { level: 2, label: "Concept", text: "Double indent 8 spaces for nested blocks." },
      { level: 3, label: "Example", text: 'if clearance == "LEVEL_5":\n    if biometric:\n        print("ACCESS: FULL VAULT UNLOCKED")' },
      { level: 4, label: "Solution", text: "Execute the nested security verification." },
    ],
    xpReward: 265,
    coinsReward: 130,
    worldSceneType: "firewall_grid",
  },
  {
    id: "m41",
    rank: "APPRENTICE",
    number: 41,
    title: "Logical NOT Inverter",
    concept: "The 'not' Operator",
    difficulty: "Intermediate",
    story: "Engage laser headlights when it is not daylight.",
    objectives: ["Set is_daylight = False", "If not is_daylight, print 'LIGHTS: ACTIVE'"],
    conceptExplanation: "The 'not' keyword inverts boolean values (not False is True, not True is False).",
    starterCode: `is_daylight = False

if not is_daylight:
    print("LIGHTS: ACTIVE")
`,
    validationRules: {
      requiredKeywords: ["not", "is_daylight", "print"],
      requiredOutputIncludes: ["LIGHTS: ACTIVE"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use if not is_daylight:." },
      { level: 2, label: "Concept", text: "not inverts the boolean condition." },
      { level: 3, label: "Example", text: 'if not is_daylight:\n    print("LIGHTS: ACTIVE")' },
      { level: 4, label: "Solution", text: "Execute the logical NOT inversion." },
    ],
    xpReward: 270,
    coinsReward: 135,
    worldSceneType: "firewall_grid",
  },
  {
    id: "m42",
    rank: "APPRENTICE",
    number: 42,
    title: "Compound AND/OR Logic",
    concept: "Complex Boolean Expressions",
    difficulty: "Intermediate",
    story: "Allow turbo boost if (nitro > 80 and temp < 100) or override_switch is True.",
    objectives: ["Evaluate compound condition", "If satisfied, print 'TURBO OVERDRIVE ENGAGED'"],
    conceptExplanation: "Parentheses group boolean operations to control precedence between 'and' and 'or'.",
    starterCode: `nitro = 90
temp = 75
override_switch = False

if (nitro > 80 and temp < 100) or override_switch:
    print("TURBO OVERDRIVE ENGAGED")
`,
    validationRules: {
      requiredKeywords: ["nitro > 80 and temp < 100", "override_switch", "print"],
      requiredOutputIncludes: ["TURBO OVERDRIVE ENGAGED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Group the and conditions in parentheses." },
      { level: 2, label: "Concept", text: "Parentheses group sub-expressions." },
      { level: 3, label: "Example", text: 'if (nitro > 80 and temp < 100) or override_switch:\n    print("TURBO OVERDRIVE ENGAGED")' },
      { level: 4, label: "Solution", text: "Run the compound conditional trigger." },
    ],
    xpReward: 275,
    coinsReward: 135,
    worldSceneType: "firewall_grid",
  },
  {
    id: "m43",
    rank: "APPRENTICE",
    number: 43,
    title: "Ternary Conditional Expression",
    concept: "Inline Ternary (x if cond else y)",
    difficulty: "Intermediate",
    story: "Determine vehicle suspension stiffness using an inline Python ternary operator.",
    objectives: ["Set mode = 'RACE'", "Set stiffness = 'HIGH' if mode == 'RACE' else 'NORMAL'", "Print stiffness"],
    conceptExplanation: "Python's ternary syntax is value_if_true if condition else value_if_false.",
    starterCode: `mode = "RACE"
stiffness = "HIGH" if mode == "RACE" else "NORMAL"
print(stiffness)
`,
    validationRules: {
      requiredKeywords: ["if mode ==", "else", "stiffness", "print"],
      requiredOutputIncludes: ["HIGH"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use inline if-else." },
      { level: 2, label: "Concept", text: "'HIGH' if mode == 'RACE' else 'NORMAL'" },
      { level: 3, label: "Example", text: 'stiffness = "HIGH" if mode == "RACE" else "NORMAL"\nprint(stiffness)' },
      { level: 4, label: "Solution", text: "Execute the ternary expression." },
    ],
    xpReward: 280,
    coinsReward: 140,
    worldSceneType: "firewall_grid",
  },
  {
    id: "m44",
    rank: "APPRENTICE",
    number: 44,
    title: "Truthiness: Non-Empty Strings",
    concept: "Truth Value Testing (Truthiness)",
    difficulty: "Intermediate",
    story: "Verify whether the pilot callsign input is non-empty without using len().",
    objectives: ["Set pilot = 'CYBER_ACE'", "If pilot: print 'VALID PILOT: REGISTERED'"],
    conceptExplanation: "In Python, non-empty strings, non-zero numbers, and non-empty collections evaluate to True in boolean contexts.",
    starterCode: `pilot = "CYBER_ACE"

if pilot:
    print("VALID PILOT: REGISTERED")
`,
    validationRules: {
      requiredKeywords: ["if pilot:", "print"],
      requiredOutputIncludes: ["VALID PILOT: REGISTERED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use if pilot: directly." },
      { level: 2, label: "Concept", text: "Non-empty string is truthy." },
      { level: 3, label: "Example", text: 'if pilot:\n    print("VALID PILOT: REGISTERED")' },
      { level: 4, label: "Solution", text: "Execute truthiness check." },
    ],
    xpReward: 285,
    coinsReward: 140,
    worldSceneType: "firewall_grid",
  },
  {
    id: "m45",
    rank: "APPRENTICE",
    number: 45,
    title: "Falsiness: Zero Check",
    concept: "Falsy Values (0, '', None, False)",
    difficulty: "Intermediate",
    story: "Detect when the vehicle battery charge reaches zero.",
    objectives: ["Set charge = 0", "If not charge: print 'EMERGENCY: CHARGE DEPLETED'"],
    conceptExplanation: "0, empty strings '', None, and False are considered falsy.",
    starterCode: `charge = 0

if not charge:
    print("EMERGENCY: CHARGE DEPLETED")
`,
    validationRules: {
      requiredKeywords: ["if not charge:", "print"],
      requiredOutputIncludes: ["EMERGENCY: CHARGE DEPLETED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "0 is falsy, so not charge is True." },
      { level: 2, label: "Concept", text: "if not charge:" },
      { level: 3, label: "Example", text: 'if not charge:\n    print("EMERGENCY: CHARGE DEPLETED")' },
      { level: 4, label: "Solution", text: "Execute falsy zero detection." },
    ],
    xpReward: 290,
    coinsReward: 145,
    worldSceneType: "firewall_grid",
  },
  {
    id: "m46",
    rank: "APPRENTICE",
    number: 46,
    title: "Chained Comparison Operators",
    concept: "Chained Comparisons (min < x < max)",
    difficulty: "Intermediate",
    story: "Verify that engine RPM is within optimal safety margins (3000 <= rpm <= 7000).",
    objectives: ["Set rpm = 5500", "If 3000 <= rpm <= 7000, print 'RPM: OPTIMAL ZONE'"],
    conceptExplanation: "Python supports chained comparisons like a < b < c, which evaluates as (a < b and b < c).",
    starterCode: `rpm = 5500

if 3000 <= rpm <= 7000:
    print("RPM: OPTIMAL ZONE")
`,
    validationRules: {
      requiredKeywords: ["3000 <=", "<= 7000:", "print"],
      requiredOutputIncludes: ["RPM: OPTIMAL ZONE"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Write 3000 <= rpm <= 7000." },
      { level: 2, label: "Concept", text: "Chained comparisons are clean in Python." },
      { level: 3, label: "Example", text: 'if 3000 <= rpm <= 7000:\n    print("RPM: OPTIMAL ZONE")' },
      { level: 4, label: "Solution", text: "Execute chained RPM comparison." },
    ],
    xpReward: 295,
    coinsReward: 145,
    worldSceneType: "firewall_grid",
  },
  {
    id: "m47",
    rank: "APPRENTICE",
    number: 47,
    title: "The 'is' Identity Operator",
    concept: "Identity (is) vs Equality (==)",
    difficulty: "Intermediate",
    story: "Check if the active error object is None.",
    objectives: ["Set active_error = None", "If active_error is None: print 'DIAGNOSTICS: NO ERRORS'"],
    conceptExplanation: "'is' checks object identity in memory (ideal for checking 'is None'), while '==' checks value equality.",
    starterCode: `active_error = None

if active_error is None:
    print("DIAGNOSTICS: NO ERRORS")
`,
    validationRules: {
      requiredKeywords: ["active_error is None:", "print"],
      requiredOutputIncludes: ["DIAGNOSTICS: NO ERRORS"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use 'is None'." },
      { level: 2, label: "Concept", text: "Always compare against None using 'is'." },
      { level: 3, label: "Example", text: 'if active_error is None:\n    print("DIAGNOSTICS: NO ERRORS")' },
      { level: 4, label: "Solution", text: "Execute identity verification." },
    ],
    xpReward: 300,
    coinsReward: 150,
    worldSceneType: "firewall_grid",
  },
  {
    id: "m48",
    rank: "APPRENTICE",
    number: 48,
    title: "The 'pass' Placeholder",
    concept: "The 'pass' Statement",
    difficulty: "Intermediate",
    story: "Construct an empty condition branch placeholder using pass for future expansion.",
    objectives: ["If False, use pass", "Else, print 'PASSED SAFELY'"],
    conceptExplanation: "'pass' is a null statement in Python used as a syntactic placeholder when code is required.",
    starterCode: `if False:
    pass
else:
    print("PASSED SAFELY")
`,
    validationRules: {
      requiredKeywords: ["pass", "else:", "print"],
      requiredOutputIncludes: ["PASSED SAFELY"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use pass inside the if block." },
      { level: 2, label: "Concept", text: "pass does nothing, acting as a placeholder." },
      { level: 3, label: "Example", text: 'if False:\n    pass\nelse:\n    print("PASSED SAFELY")' },
      { level: 4, label: "Solution", text: "Execute the pass statement structure." },
    ],
    xpReward: 305,
    coinsReward: 150,
    worldSceneType: "firewall_grid",
  },
  {
    id: "m49",
    rank: "APPRENTICE",
    number: 49,
    title: "Multi-Way Sector Routing",
    concept: "Complex Decision Matrix",
    difficulty: "Intermediate",
    story: "Route the vehicle according to zone name: 'ALPHA' -> Gate 1, 'BETA' -> Gate 2, 'GAMMA' -> Gate 3.",
    objectives: ["Test zone = 'BETA'", "Print 'ROUTED TO GATE 2'"],
    conceptExplanation: "Use elif ladders to implement multi-way dispatching.",
    starterCode: `zone = "BETA"

if zone == "ALPHA":
    print("ROUTED TO GATE 1")
elif zone == "BETA":
    print("ROUTED TO GATE 2")
elif zone == "GAMMA":
    print("ROUTED TO GATE 3")
`,
    validationRules: {
      requiredKeywords: ["if zone ==", "elif zone ==", "print"],
      requiredOutputIncludes: ["ROUTED TO GATE 2"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Check zone == 'BETA'." },
      { level: 2, label: "Concept", text: "Dispatch based on string match." },
      { level: 3, label: "Example", text: 'if zone == "BETA": print("ROUTED TO GATE 2")' },
      { level: 4, label: "Solution", text: "Execute the multi-way route." },
    ],
    xpReward: 310,
    coinsReward: 155,
    worldSceneType: "firewall_grid",
  },
  {
    id: "m50",
    rank: "APPRENTICE",
    number: 50,
    title: "Shield Overload Protection",
    concept: "Boundary Value Clamping",
    difficulty: "Intermediate",
    story: "Ensure vehicle shield value is clamped between 0 and 100.",
    objectives: ["Set raw_shield = 140", "If raw_shield > 100, set shield = 100", "Print shield"],
    conceptExplanation: "Conditional logic is used to clamp or sanitize numeric ranges.",
    starterCode: `raw_shield = 140
if raw_shield > 100:
    shield = 100
else:
    shield = raw_shield
print(shield)
`,
    validationRules: {
      requiredKeywords: ["raw_shield > 100", "shield = 100", "print"],
      requiredOutputIncludes: ["100"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Clamp raw_shield if above 100." },
      { level: 2, label: "Concept", text: "shield = 100 if raw_shield > 100 else raw_shield" },
      { level: 3, label: "Example", text: "if raw_shield > 100:\n    shield = 100\nprint(shield)" },
      { level: 4, label: "Solution", text: "Execute shield clamping." },
    ],
    xpReward: 315,
    coinsReward: 155,
    worldSceneType: "firewall_grid",
  },
  {
    id: "m51",
    rank: "APPRENTICE",
    number: 51,
    title: "Hazard Matrix Detection",
    concept: "Compound Hazard Filtering",
    difficulty: "Intermediate",
    story: "Detect whether an incoming track tile contains either 'FIREWALL' or 'GLITCH_SPIKE'.",
    objectives: [
      "Set hazard = 'FIREWALL'",
      "If hazard in ['FIREWALL', 'GLITCH_SPIKE']: print 'EVASIVE MANEUVER TRIGGERED'",
    ],
    conceptExplanation: "The 'in' operator combined with lists creates powerful membership tests.",
    starterCode: `hazard = "FIREWALL"
hazards_list = ["FIREWALL", "GLITCH_SPIKE"]

if hazard in hazards_list:
    print("EVASIVE MANEUVER TRIGGERED")
`,
    validationRules: {
      requiredKeywords: ["hazard in hazards_list", "print"],
      requiredOutputIncludes: ["EVASIVE MANEUVER TRIGGERED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use if hazard in hazards_list:." },
      { level: 2, label: "Concept", text: "'in' checks membership." },
      { level: 3, label: "Example", text: 'if hazard in hazards_list:\n    print("EVASIVE MANEUVER TRIGGERED")' },
      { level: 4, label: "Solution", text: "Execute membership hazard check." },
    ],
    xpReward: 320,
    coinsReward: 160,
    worldSceneType: "firewall_grid",
  },
  {
    id: "m52",
    rank: "APPRENTICE",
    number: 52,
    title: "Turbo Cooldown Timer",
    concept: "State Machine Transitions",
    difficulty: "Intermediate",
    story: "Check if cooldown timer is 0 to re-enable boost.",
    objectives: ["Set cooldown = 0", "If cooldown == 0: print 'BOOST: READY'"],
    conceptExplanation: "State checks govern vehicle ability triggers.",
    starterCode: `cooldown = 0
if cooldown == 0:
    print("BOOST: READY")
`,
    validationRules: {
      requiredKeywords: ["cooldown == 0:", "print"],
      requiredOutputIncludes: ["BOOST: READY"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Check cooldown == 0." },
      { level: 2, label: "Concept", text: "Compare zero cooldown." },
      { level: 3, label: "Example", text: 'if cooldown == 0:\n    print("BOOST: READY")' },
      { level: 4, label: "Solution", text: "Execute boost cooldown check." },
    ],
    xpReward: 325,
    coinsReward: 160,
    worldSceneType: "firewall_grid",
  },
  {
    id: "m53",
    rank: "APPRENTICE",
    number: 53,
    title: "Quantum Key Authenticator",
    concept: "Multi-Variable Security Gate",
    difficulty: "Intermediate",
    story: "Authenticate vehicle key: key must be 'QUANTUM_99' and version must be >= 3.",
    objectives: [
      "Set key = 'QUANTUM_99'",
      "Set version = 3",
      "If key == 'QUANTUM_99' and version >= 3: print 'ACCESS: GRANTED'",
    ],
    conceptExplanation: "Combining multiple criteria ensures strict validation.",
    starterCode: `key = "QUANTUM_99"
version = 3

if key == "QUANTUM_99" and version >= 3:
    print("ACCESS: GRANTED")
`,
    validationRules: {
      requiredKeywords: ["key == \"QUANTUM_99\"", "version >= 3", "print"],
      requiredOutputIncludes: ["ACCESS: GRANTED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Combine both with and." },
      { level: 2, label: "Concept", text: "Both conditions must be True." },
      { level: 3, label: "Example", text: 'if key == "QUANTUM_99" and version >= 3:\n    print("ACCESS: GRANTED")' },
      { level: 4, label: "Solution", text: "Execute quantum key authentication." },
    ],
    xpReward: 330,
    coinsReward: 165,
    worldSceneType: "firewall_grid",
  },
  {
    id: "m54",
    rank: "APPRENTICE",
    number: 54,
    title: "Apprentice Rank Capstone: Firewall Canyon",
    concept: "Apprentice Mastery Synthesis",
    difficulty: "Intermediate",
    story: "Defeat the Sector 3 Security Firewall by evaluating multiple security passkeys.",
    objectives: [
      "Set security_code = 909",
      "Set shield_active = True",
      "If security_code == 909 and shield_active: print 'FIREWALL CANYON BREACHED: APPRENTICE COMPLETE'",
    ],
    conceptExplanation: "You have mastered all Python conditional logic, branch execution, truthiness, and security evaluation!",
    starterCode: `security_code = 909
shield_active = True

# MISSION OBJECTIVE: Pass security code and shield check
if security_code == 909 and shield_active:
    print("FIREWALL CANYON BREACHED: APPRENTICE COMPLETE")
`,
    validationRules: {
      requiredKeywords: ["security_code == 909", "shield_active", "print"],
      requiredOutputIncludes: ["FIREWALL CANYON BREACHED: APPRENTICE COMPLETE"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Check code and shield status." },
      { level: 2, label: "Concept", text: "Validate both conditions." },
      { level: 3, label: "Example", text: 'if security_code == 909 and shield_active:\n    print("FIREWALL CANYON BREACHED: APPRENTICE COMPLETE")' },
      { level: 4, label: "Solution", text: "Execute the Apprentice Capstone verification." },
    ],
    xpReward: 350,
    coinsReward: 175,
    skillIdToUnlock: "py_apprentice_mastery",
    worldSceneType: "firewall_grid",
  },
];
