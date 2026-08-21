import { Mission } from "../../types";

export const RANK1_ZERO_MISSIONS: Mission[] = [
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

print("SYSTEM ONLINE")
`,
    validationRules: {
      requiredKeywords: ["print"],
      requiredOutputIncludes: ["SYSTEM ONLINE"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Look at the print() function. Text goes between parentheses and quotes." },
      { level: 2, label: "Concept", text: 'In Python, we write print("Your text here") to show messages.' },
      { level: 3, label: "Example", text: 'print("SYSTEM ONLINE")' },
      { level: 4, label: "Solution", text: 'Write: print("SYSTEM ONLINE")' },
    ],
    xpReward: 50,
    coinsReward: 25,
    skillIdToUnlock: "py_print",
    worldSceneType: "cyber_highway",
  },
  {
    id: "m2",
    rank: "ZERO",
    number: 2,
    title: "Codename Identifier",
    concept: "String Variables",
    difficulty: "Beginner",
    story: "To navigate the highway grid, you must register your Cyber Pilot callsign into the DeSuper main registry.",
    objectives: ["Declare a variable named 'pilot_name'", "Assign it the string 'NEXUS_ONE'", "Print the variable pilot_name"],
    conceptExplanation: "Variables are named containers for storing data values. In Python, you assign a value using the '=' operator without needing let or var.",
    starterCode: `# MISSION OBJECTIVE: Register pilot callsign.
# 1. Create variable: pilot_name = "NEXUS_ONE"
# 2. Print pilot_name

pilot_name = "NEXUS_ONE"
print(pilot_name)
`,
    validationRules: {
      requiredKeywords: ["pilot_name", "print"],
      requiredOutputIncludes: ["NEXUS_ONE"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Assign the string to pilot_name and pass pilot_name to print()." },
      { level: 2, label: "Concept", text: 'variable = "value" stores data. print(variable) prints that data.' },
      { level: 3, label: "Example", text: 'pilot_name = "NEXUS_ONE"\nprint(pilot_name)' },
      { level: 4, label: "Solution", text: 'Set pilot_name = "NEXUS_ONE" and call print(pilot_name).' },
    ],
    xpReward: 60,
    coinsReward: 30,
    skillIdToUnlock: "py_variables",
    worldSceneType: "cyber_highway",
  },
  {
    id: "m3",
    rank: "ZERO",
    number: 3,
    title: "Energy Influx",
    concept: "Integers & Arithmetic",
    difficulty: "Beginner",
    story: "The vehicle battery cells require balanced charging. Combine the energy from primary and secondary capacitors.",
    objectives: ["Set battery_a = 45", "Set battery_b = 55", "Calculate total_power = battery_a + battery_b", "Print total_power"],
    conceptExplanation: "Integers are whole numbers without decimal points. Python supports standard arithmetic operators: + (addition), - (subtraction), * (multiplication), and / (division).",
    starterCode: `battery_a = 45
battery_b = 55

# MISSION OBJECTIVE: Calculate total power and print it
total_power = battery_a + battery_b
print(total_power)
`,
    validationRules: {
      requiredKeywords: ["battery_a", "battery_b", "total_power", "print"],
      requiredOutputIncludes: ["100"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Add battery_a and battery_b together using '+'." },
      { level: 2, label: "Concept", text: "total_power = battery_a + battery_b stores 100." },
      { level: 3, label: "Example", text: "total_power = battery_a + battery_b\nprint(total_power)" },
      { level: 4, label: "Solution", text: "total_power = battery_a + battery_b and print(total_power)." },
    ],
    xpReward: 70,
    coinsReward: 35,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m4",
    rank: "ZERO",
    number: 4,
    title: "Horsepower Multiplier",
    concept: "Multiplication (*)",
    difficulty: "Beginner",
    story: "Your propulsion thrusters can multiply engine output across 4 auxiliary cylinders.",
    objectives: ["Set base_thrust = 120", "Multiply base_thrust by 4 to get max_thrust", "Print max_thrust"],
    conceptExplanation: "Use the asterisk (*) operator in Python to multiply numeric values.",
    starterCode: `base_thrust = 120

# MISSION OBJECTIVE: Calculate max_thrust by multiplying base_thrust by 4
max_thrust = base_thrust * 4
print(max_thrust)
`,
    validationRules: {
      requiredKeywords: ["base_thrust", "max_thrust", "print"],
      requiredOutputIncludes: ["480"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use '*' to multiply by 4." },
      { level: 2, label: "Concept", text: "max_thrust = base_thrust * 4" },
      { level: 3, label: "Example", text: "max_thrust = base_thrust * 4\nprint(max_thrust)" },
      { level: 4, label: "Solution", text: "Write max_thrust = base_thrust * 4 and print(max_thrust)." },
    ],
    xpReward: 75,
    coinsReward: 35,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m5",
    rank: "ZERO",
    number: 5,
    title: "Velocity Division",
    concept: "Float Division (/)",
    difficulty: "Beginner",
    story: "Calculate average lap speed over 3 sectors of the Genesis track.",
    objectives: ["Set total_distance = 450", "Set total_time = 3", "Calculate avg_speed = total_distance / total_time", "Print avg_speed"],
    conceptExplanation: "In Python 3, single slash '/' always performs float division, producing a floating-point number.",
    starterCode: `total_distance = 450
total_time = 3

# MISSION OBJECTIVE: Compute avg_speed
avg_speed = total_distance / total_time
print(avg_speed)
`,
    validationRules: {
      requiredKeywords: ["total_distance", "total_time", "avg_speed", "print"],
      requiredOutputIncludes: ["150"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Divide distance by time using '/'." },
      { level: 2, label: "Concept", text: "avg_speed = total_distance / total_time" },
      { level: 3, label: "Example", text: "avg_speed = total_distance / total_time\nprint(avg_speed)" },
      { level: 4, label: "Solution", text: "avg_speed = total_distance / total_time and print(avg_speed)." },
    ],
    xpReward: 80,
    coinsReward: 40,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m6",
    rank: "ZERO",
    number: 6,
    title: "Comment Documentation",
    concept: "Single & Multi-line Comments (#)",
    difficulty: "Beginner",
    story: "Document your vehicle's laser radar frequency before entering the magnetic tunnels.",
    objectives: ["Add a comment starting with #", "Declare radar_hz = 950", "Print radar_hz"],
    conceptExplanation: "Comments in Python start with the '#' hash symbol. Python ignores everything after '#' on that line.",
    starterCode: `# Cyber Highway Radar Config
radar_hz = 950
print(radar_hz)
`,
    validationRules: {
      requiredKeywords: ["#", "radar_hz", "print"],
      requiredOutputIncludes: ["950"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Comments start with #." },
      { level: 2, label: "Concept", text: "# This is a comment" },
      { level: 3, label: "Example", text: "# Calibrating radar\nradar_hz = 950\nprint(radar_hz)" },
      { level: 4, label: "Solution", text: "Keep the comment and print radar_hz." },
    ],
    xpReward: 85,
    coinsReward: 40,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m7",
    rank: "ZERO",
    number: 7,
    title: "Type Discovery",
    concept: "type() Inspection",
    difficulty: "Beginner",
    story: "Analyze raw data packets incoming from the highway beacon.",
    objectives: ["Set signal = 'DE_SUPER_BEACON'", "Print type(signal)"],
    conceptExplanation: "The built-in type() function inspects and returns the data type of any Python object (e.g. <class 'str'>, <class 'int'>).",
    starterCode: `signal = "DE_SUPER_BEACON"

# MISSION OBJECTIVE: Print the type of signal
print(type(signal))
`,
    validationRules: {
      requiredKeywords: ["type", "signal", "print"],
      requiredOutputIncludes: ["str"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Pass signal inside type(), and type() inside print()." },
      { level: 2, label: "Concept", text: "print(type(signal))" },
      { level: 3, label: "Example", text: 'signal = "DE_SUPER_BEACON"\nprint(type(signal))' },
      { level: 4, label: "Solution", text: "print(type(signal))" },
    ],
    xpReward: 90,
    coinsReward: 45,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m8",
    rank: "ZERO",
    number: 8,
    title: "Integer Type Check",
    concept: "type(int)",
    difficulty: "Beginner",
    story: "Verify that the chassis serial number is stored as an integer.",
    objectives: ["Set chassis_id = 90210", "Print type(chassis_id)"],
    conceptExplanation: "Integers have the type 'int' in Python.",
    starterCode: `chassis_id = 90210
print(type(chassis_id))
`,
    validationRules: {
      requiredKeywords: ["chassis_id", "type", "print"],
      requiredOutputIncludes: ["int"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use print(type(chassis_id))." },
      { level: 2, label: "Concept", text: "Integers return <class 'int'>." },
      { level: 3, label: "Example", text: "print(type(chassis_id))" },
      { level: 4, label: "Solution", text: "print(type(chassis_id))" },
    ],
    xpReward: 95,
    coinsReward: 45,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m9",
    rank: "ZERO",
    number: 9,
    title: "Float Coordinates",
    concept: "Floating-Point Numbers (float)",
    difficulty: "Beginner",
    story: "Calibrate GPS latitude on the cyber highway.",
    objectives: ["Set latitude = 37.7749", "Print latitude"],
    conceptExplanation: "Floats represent real numbers written with a decimal point.",
    starterCode: `latitude = 37.7749
print(latitude)
`,
    validationRules: {
      requiredKeywords: ["latitude", "print"],
      requiredOutputIncludes: ["37.7749"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "latitude is a floating point number." },
      { level: 2, label: "Concept", text: "Floats have decimals." },
      { level: 3, label: "Example", text: "latitude = 37.7749\nprint(latitude)" },
      { level: 4, label: "Solution", text: "latitude = 37.7749\nprint(latitude)" },
    ],
    xpReward: 100,
    coinsReward: 50,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m10",
    rank: "ZERO",
    number: 10,
    title: "Boolean Ignition",
    concept: "Booleans (True / False)",
    difficulty: "Beginner",
    story: "Engage the cyber vehicle core ignition circuit.",
    objectives: ["Set is_ignition_on = True", "Print is_ignition_on"],
    conceptExplanation: "Booleans represent truth values in Python: True or False (capitalized).",
    starterCode: `is_ignition_on = True
print(is_ignition_on)
`,
    validationRules: {
      requiredKeywords: ["is_ignition_on", "True", "print"],
      requiredOutputIncludes: ["True"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "True must have a capital 'T'." },
      { level: 2, label: "Concept", text: "Python booleans are True and False." },
      { level: 3, label: "Example", text: "is_ignition_on = True\nprint(is_ignition_on)" },
      { level: 4, label: "Solution", text: "is_ignition_on = True\nprint(is_ignition_on)" },
    ],
    xpReward: 105,
    coinsReward: 50,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m11",
    rank: "ZERO",
    number: 11,
    title: "String Concatenation",
    concept: "String Joining (+)",
    difficulty: "Beginner",
    story: "Join the sector code and gate number into a single dispatch packet.",
    objectives: ["Set prefix = 'SECTOR_'", "Set number = '01'", "Set packet = prefix + number", "Print packet"],
    conceptExplanation: "The '+' operator between two strings concatenates (glues) them together.",
    starterCode: `prefix = "SECTOR_"
number = "01"
packet = prefix + number
print(packet)
`,
    validationRules: {
      requiredKeywords: ["prefix", "number", "packet", "print"],
      requiredOutputIncludes: ["SECTOR_01"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Join the two string variables with '+'." },
      { level: 2, label: "Concept", text: "packet = prefix + number" },
      { level: 3, label: "Example", text: "packet = prefix + number\nprint(packet)" },
      { level: 4, label: "Solution", text: "packet = prefix + number and print(packet)." },
    ],
    xpReward: 110,
    coinsReward: 55,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m12",
    rank: "ZERO",
    number: 12,
    title: "String Multiplication",
    concept: "String Repetition (*)",
    difficulty: "Beginner",
    story: "Generate a barrier pulse beacon repeating '=-' 10 times.",
    objectives: ["Set pattern = '=-' * 10", "Print pattern"],
    conceptExplanation: "In Python, multiplying a string by an integer repeats that string N times.",
    starterCode: `pattern = "=-" * 10
print(pattern)
`,
    validationRules: {
      requiredKeywords: ["pattern", "print"],
      requiredOutputIncludes: ["=-=-=-=-=-=-=-=-=-=-"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Multiply the string '=-' by 10." },
      { level: 2, label: "Concept", text: "'=-' * 10 creates a repeated pattern." },
      { level: 3, label: "Example", text: 'pattern = "=-" * 10\nprint(pattern)' },
      { level: 4, label: "Solution", text: 'pattern = "=-" * 10 and print(pattern).' },
    ],
    xpReward: 115,
    coinsReward: 55,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m13",
    rank: "ZERO",
    number: 13,
    title: "String Length",
    concept: "len() Function",
    difficulty: "Beginner",
    story: "Measure the character length of the cyber encryption key.",
    objectives: ["Set key = 'CYBER_QUANTUM_KEY_99'", "Print len(key)"],
    conceptExplanation: "The len() function returns the number of characters in a string or items in a collection.",
    starterCode: `key = "CYBER_QUANTUM_KEY_99"
print(len(key))
`,
    validationRules: {
      requiredKeywords: ["key", "len", "print"],
      requiredOutputIncludes: ["21"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use len(key) inside print()." },
      { level: 2, label: "Concept", text: "len() measures character count." },
      { level: 3, label: "Example", text: "print(len(key))" },
      { level: 4, label: "Solution", text: "print(len(key))" },
    ],
    xpReward: 120,
    coinsReward: 60,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m14",
    rank: "ZERO",
    number: 14,
    title: "Integer Exponentiation",
    concept: "Power Operator (**)",
    difficulty: "Beginner",
    story: "Calculate turbo wattage scaling 2 to the power of 8.",
    objectives: ["Set watts = 2 ** 8", "Print watts"],
    conceptExplanation: "The '**' operator calculates exponents (powers) in Python: 2 ** 8 = 256.",
    starterCode: `watts = 2 ** 8
print(watts)
`,
    validationRules: {
      requiredKeywords: ["watts", "**", "print"],
      requiredOutputIncludes: ["256"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use '**' for exponents." },
      { level: 2, label: "Concept", text: "2 ** 8 = 256" },
      { level: 3, label: "Example", text: "watts = 2 ** 8\nprint(watts)" },
      { level: 4, label: "Solution", text: "watts = 2 ** 8 and print(watts)." },
    ],
    xpReward: 125,
    coinsReward: 60,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m15",
    rank: "ZERO",
    number: 15,
    title: "Floor Division",
    concept: "Floor Division (//)",
    difficulty: "Beginner",
    story: "Calculate whole fuel cell packs when dividing 100 liters into 15L containers.",
    objectives: ["Set packs = 100 // 15", "Print packs"],
    conceptExplanation: "The '//' floor division operator divides and rounds down to the nearest integer.",
    starterCode: `packs = 100 // 15
print(packs)
`,
    validationRules: {
      requiredKeywords: ["packs", "//", "print"],
      requiredOutputIncludes: ["6"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use '//' for integer floor division." },
      { level: 2, label: "Concept", text: "100 // 15 = 6" },
      { level: 3, label: "Example", text: "packs = 100 // 15\nprint(packs)" },
      { level: 4, label: "Solution", text: "packs = 100 // 15 and print(packs)." },
    ],
    xpReward: 130,
    coinsReward: 65,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m16",
    rank: "ZERO",
    number: 16,
    title: "Remainder Modulo",
    concept: "Modulo Operator (%)",
    difficulty: "Beginner",
    story: "Calculate the leftover fuel after packing cells.",
    objectives: ["Set remainder = 100 % 15", "Print remainder"],
    conceptExplanation: "The '%' modulo operator computes the remainder of a division.",
    starterCode: `remainder = 100 % 15
print(remainder)
`,
    validationRules: {
      requiredKeywords: ["remainder", "%", "print"],
      requiredOutputIncludes: ["10"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use '%' to get the remainder." },
      { level: 2, label: "Concept", text: "100 % 15 is 10." },
      { level: 3, label: "Example", text: "remainder = 100 % 15\nprint(remainder)" },
      { level: 4, label: "Solution", text: "remainder = 100 % 15 and print(remainder)." },
    ],
    xpReward: 135,
    coinsReward: 65,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m17",
    rank: "ZERO",
    number: 17,
    title: "Type Casting to String",
    concept: "str() Conversion",
    difficulty: "Beginner",
    story: "Convert lap time integer 42 into string format to send telemetry.",
    objectives: ["Set lap_time = 42", "Set msg = 'Lap: ' + str(lap_time)", "Print msg"],
    conceptExplanation: "The str() function converts numbers and other objects to string type.",
    starterCode: `lap_time = 42
msg = "Lap: " + str(lap_time)
print(msg)
`,
    validationRules: {
      requiredKeywords: ["str", "lap_time", "msg", "print"],
      requiredOutputIncludes: ["Lap: 42"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Convert lap_time using str()." },
      { level: 2, label: "Concept", text: "str(42) produces '42'." },
      { level: 3, label: "Example", text: 'msg = "Lap: " + str(lap_time)\nprint(msg)' },
      { level: 4, label: "Solution", text: 'msg = "Lap: " + str(lap_time) and print(msg).' },
    ],
    xpReward: 140,
    coinsReward: 70,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m18",
    rank: "ZERO",
    number: 18,
    title: "Zero Rank Capstone: System Telemetry",
    concept: "Zero Mastery Synthesis",
    difficulty: "Beginner",
    story: "Synthesize all Rank 1 telemetry protocols to unlock the Novice Neon Gridway.",
    objectives: [
      "Set racer = 'PILOT_ZERO'",
      "Set speed = 250",
      "Set status = True",
      "Print 'PILOT: PILOT_ZERO | SPEED: 250 | ACTIVE: True'",
    ],
    conceptExplanation: "Congratulations on mastering the fundamentals of Python! You are ready to enter Rank 2: NOVICE.",
    starterCode: `racer = "PILOT_ZERO"
speed = 250
status = True

# MISSION OBJECTIVE: Combine all 3 into final dispatch string
report = "PILOT: " + racer + " | SPEED: " + str(speed) + " | ACTIVE: " + str(status)
print(report)
`,
    validationRules: {
      requiredKeywords: ["racer", "speed", "status", "print"],
      requiredOutputIncludes: ["PILOT: PILOT_ZERO | SPEED: 250 | ACTIVE: True"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Format the dispatch report and print it." },
      { level: 2, label: "Concept", text: "Combine strings and str() representations." },
      { level: 3, label: "Example", text: 'report = "PILOT: " + racer + " | SPEED: " + str(speed) + " | ACTIVE: " + str(status)\nprint(report)' },
      { level: 4, label: "Solution", text: "Execute the completed report script." },
    ],
    xpReward: 150,
    coinsReward: 75,
    skillIdToUnlock: "py_zero_mastery",
    worldSceneType: "cyber_highway",
  },
];
