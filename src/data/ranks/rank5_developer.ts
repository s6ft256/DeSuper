import { Mission } from "../../types";

export const RANK5_DEVELOPER_MISSIONS: Mission[] = [
  {
    id: "m73",
    rank: "DEVELOPER",
    number: 73,
    title: "List Mutation: Append & Pop",
    concept: "list.append() & list.pop()",
    difficulty: "Advanced",
    story: "Manage vehicle inventory by appending 'NITRO_CANISTER' and popping the depleted battery.",
    objectives: [
      "Set inventory = ['BATTERY_OLD', 'SHIELD']",
      "Call inventory.append('NITRO_CANISTER')",
      "Call inventory.pop(0)",
      "Print inventory",
    ],
    conceptExplanation: ".append(x) adds an item to the end of a list. .pop(index) removes and returns the item at index.",
    starterCode: `inventory = ["BATTERY_OLD", "SHIELD"]
inventory.append("NITRO_CANISTER")
inventory.pop(0)
print(inventory)
`,
    validationRules: {
      requiredKeywords: ["append", "pop(0)", "print"],
      requiredOutputIncludes: ["['SHIELD', 'NITRO_CANISTER']"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Append the nitro canister and pop index 0." },
      { level: 2, label: "Concept", text: "append adds to end; pop(0) removes first element." },
      { level: 3, label: "Example", text: 'inventory.append("NITRO_CANISTER")\ninventory.pop(0)\nprint(inventory)' },
      { level: 4, label: "Solution", text: "Execute list mutation." },
    ],
    xpReward: 450,
    coinsReward: 225,
    skillIdToUnlock: "py_lists",
    worldSceneType: "data_highway",
  },
  {
    id: "m74",
    rank: "DEVELOPER",
    number: 74,
    title: "List Sorting & Reversing",
    concept: "list.sort() & sorted()",
    difficulty: "Advanced",
    story: "Sort lap times in ascending order to find the fastest qualifying runs.",
    objectives: ["Set laps = [48.2, 45.1, 51.0, 43.8]", "Sort laps using laps.sort()", "Print laps"],
    conceptExplanation: "list.sort() sorts the list in-place in ascending order. Use sorted(list) to return a new sorted copy.",
    starterCode: `laps = [48.2, 45.1, 51.0, 43.8]
laps.sort()
print(laps)
`,
    validationRules: {
      requiredKeywords: ["laps.sort()", "print"],
      requiredOutputIncludes: ["[43.8, 45.1, 48.2, 51.0]"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use laps.sort()." },
      { level: 2, label: "Concept", text: "laps.sort() arranges floats from lowest to highest." },
      { level: 3, label: "Example", text: "laps.sort()\nprint(laps)" },
      { level: 4, label: "Solution", text: "Execute in-place list sorting." },
    ],
    xpReward: 455,
    coinsReward: 225,
    worldSceneType: "data_highway",
  },
  {
    id: "m75",
    rank: "DEVELOPER",
    number: 75,
    title: "List Slicing & Copying",
    concept: "Shallow Copy & Sub-lists [:]",
    difficulty: "Advanced",
    story: "Extract the top 3 high scores from a leaderboard list.",
    objectives: ["Set scores = [980, 940, 890, 750, 600]", "Extract top3 = scores[:3]", "Print top3"],
    conceptExplanation: "list[:3] slices the first 3 elements (indices 0, 1, 2).",
    starterCode: `scores = [980, 940, 890, 750, 600]
top3 = scores[:3]
print(top3)
`,
    validationRules: {
      requiredKeywords: ["scores[:3]", "top3", "print"],
      requiredOutputIncludes: ["[980, 940, 890]"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Slice scores[:3]." },
      { level: 2, label: "Concept", text: "scores[:3] grabs elements from index 0 to 2." },
      { level: 3, label: "Example", text: "top3 = scores[:3]\nprint(top3)" },
      { level: 4, label: "Solution", text: "Execute list slicing." },
    ],
    xpReward: 460,
    coinsReward: 230,
    worldSceneType: "data_highway",
  },
  {
    id: "m76",
    rank: "DEVELOPER",
    number: 76,
    title: "Immutable Tuples",
    concept: "Tuples (a, b, c) & Packing/Unpacking",
    difficulty: "Advanced",
    story: "Store immutable GPS coordinates (x, y, z) and unpack them into individual variables.",
    objectives: [
      "Set point = (120, 340, 50)",
      "Unpack x, y, z = point",
      "Print f'GPS: X={x} Y={y} Z={z}'",
    ],
    conceptExplanation: "Tuples are ordered, immutable collections defined with parentheses. Unpacking binds tuple items to variables.",
    starterCode: `point = (120, 340, 50)
x, y, z = point
print(f"GPS: X={x} Y={y} Z={z}")
`,
    validationRules: {
      requiredKeywords: ["(120, 340, 50)", "x, y, z = point", "print"],
      requiredOutputIncludes: ["GPS: X=120 Y=340 Z=50"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Unpack point directly: x, y, z = point." },
      { level: 2, label: "Concept", text: "Tuple unpacking matches elements position by position." },
      { level: 3, label: "Example", text: 'x, y, z = point\nprint(f"GPS: X={x} Y={y} Z={z}")' },
      { level: 4, label: "Solution", text: "Execute tuple unpacking." },
    ],
    xpReward: 465,
    coinsReward: 230,
    skillIdToUnlock: "py_tuples",
    worldSceneType: "data_highway",
  },
  {
    id: "m77",
    rank: "DEVELOPER",
    number: 77,
    title: "Dictionary Key-Value Lookup",
    concept: "Dictionaries {key: value}",
    difficulty: "Advanced",
    story: "Inspect vehicle specs stored in a telemetry dictionary.",
    objectives: [
      "Create car = {'model': 'CYBER_GT', 'top_speed': 420, 'turbo': True}",
      "Print car['top_speed']",
    ],
    conceptExplanation: "Dictionaries store key-value mappings. Retrieve values using dict[key].",
    starterCode: `car = {"model": "CYBER_GT", "top_speed": 420, "turbo": True}
print(car["top_speed"])
`,
    validationRules: {
      requiredKeywords: ["car[", "\"top_speed\"", "print"],
      requiredOutputIncludes: ["420"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: 'Lookup car["top_speed"].' },
      { level: 2, label: "Concept", text: "Dictionaries offer O(1) key lookups." },
      { level: 3, label: "Example", text: 'print(car["top_speed"])' },
      { level: 4, label: "Solution", text: "Execute dict lookup." },
    ],
    xpReward: 470,
    coinsReward: 235,
    skillIdToUnlock: "py_dicts",
    worldSceneType: "data_highway",
  },
  {
    id: "m78",
    rank: "DEVELOPER",
    number: 78,
    title: "Safe Dict Lookup with .get()",
    concept: "dict.get(key, default)",
    difficulty: "Advanced",
    story: "Safely query the 'shield_level' property with a fallback default value of 100.",
    objectives: [
      "Set vehicle = {'pilot': 'NEXUS'}",
      "Get shield = vehicle.get('shield_level', 100)",
      "Print shield",
    ],
    conceptExplanation: ".get(key, default) avoids raising a KeyError when a key does not exist.",
    starterCode: `vehicle = {"pilot": "NEXUS"}
shield = vehicle.get("shield_level", 100)
print(shield)
`,
    validationRules: {
      requiredKeywords: ["vehicle.get(", "\"shield_level\", 100", "print"],
      requiredOutputIncludes: ["100"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: 'Use vehicle.get("shield_level", 100).' },
      { level: 2, label: "Concept", text: "Returns 100 because 'shield_level' is missing." },
      { level: 3, label: "Example", text: 'shield = vehicle.get("shield_level", 100)\nprint(shield)' },
      { level: 4, label: "Solution", text: "Execute safe .get() query." },
    ],
    xpReward: 475,
    coinsReward: 235,
    worldSceneType: "data_highway",
  },
  {
    id: "m79",
    rank: "DEVELOPER",
    number: 79,
    title: "Iterating Dict Items",
    concept: "dict.items() & Key-Value Loops",
    difficulty: "Advanced",
    story: "Iterate through all system stats and display key-value pairs.",
    objectives: [
      "Iterate over stats = {'CORE': 'ONLINE', 'TURBO': 'READY'}.items()",
      "Print f'{k}: {v}'",
    ],
    conceptExplanation: ".items() returns key-value view pairs (key, value) for dictionary iteration.",
    starterCode: `stats = {"CORE": "ONLINE", "TURBO": "READY"}
for k, v in stats.items():
    print(f"{k}: {v}")
`,
    validationRules: {
      requiredKeywords: ["stats.items()", "for k, v", "print"],
      requiredOutputIncludes: ["CORE: ONLINE", "TURBO: READY"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use for k, v in stats.items():." },
      { level: 2, label: "Concept", text: ".items() provides both key and value." },
      { level: 3, label: "Example", text: 'for k, v in stats.items():\n    print(f"{k}: {v}")' },
      { level: 4, label: "Solution", text: "Execute dict.items() iteration." },
    ],
    xpReward: 480,
    coinsReward: 240,
    worldSceneType: "data_highway",
  },
  {
    id: "m80",
    rank: "DEVELOPER",
    number: 80,
    title: "Unique Sets & Deduplication",
    concept: "Sets & set() Constructor",
    difficulty: "Advanced",
    story: "Eliminate duplicate sensor signal IDs from a noisy stream.",
    objectives: [
      "Set raw_signals = ['SIG_A', 'SIG_B', 'SIG_A', 'SIG_C', 'SIG_B']",
      "Convert unique = sorted(list(set(raw_signals)))",
      "Print unique",
    ],
    conceptExplanation: "Sets are unordered collections of unique elements that automatically deduplicate items.",
    starterCode: `raw_signals = ["SIG_A", "SIG_B", "SIG_A", "SIG_C", "SIG_B"]
unique = sorted(list(set(raw_signals)))
print(unique)
`,
    validationRules: {
      requiredKeywords: ["set(raw_signals)", "sorted", "print"],
      requiredOutputIncludes: ["['SIG_A', 'SIG_B', 'SIG_C']"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Pass raw_signals through set() to deduplicate." },
      { level: 2, label: "Concept", text: "set() removes duplicate strings." },
      { level: 3, label: "Example", text: "unique = sorted(list(set(raw_signals)))\nprint(unique)" },
      { level: 4, label: "Solution", text: "Execute set deduplication." },
    ],
    xpReward: 485,
    coinsReward: 240,
    skillIdToUnlock: "py_sets",
    worldSceneType: "data_highway",
  },
  {
    id: "m81",
    rank: "DEVELOPER",
    number: 81,
    title: "Set Operations: Intersection & Union",
    concept: "Set Math (& and |)",
    difficulty: "Advanced",
    story: "Find common unlocked sectors between two player team members.",
    objectives: [
      "Set player1_sectors = {'SEC_1', 'SEC_2', 'SEC_3'}",
      "Set player2_sectors = {'SEC_2', 'SEC_3', 'SEC_4'}",
      "Compute common = sorted(list(player1_sectors & player2_sectors))",
      "Print common",
    ],
    conceptExplanation: "The '&' operator computes the intersection (common items) between two sets.",
    starterCode: `player1_sectors = {"SEC_1", "SEC_2", "SEC_3"}
player2_sectors = {"SEC_2", "SEC_3", "SEC_4"}
common = sorted(list(player1_sectors & player2_sectors))
print(common)
`,
    validationRules: {
      requiredKeywords: ["player1_sectors & player2_sectors", "sorted", "print"],
      requiredOutputIncludes: ["['SEC_2', 'SEC_3']"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use '&' between the two sets." },
      { level: 2, label: "Concept", text: "Intersection finds elements present in both sets." },
      { level: 3, label: "Example", text: "common = sorted(list(player1_sectors & player2_sectors))\nprint(common)" },
      { level: 4, label: "Solution", text: "Execute set intersection." },
    ],
    xpReward: 490,
    coinsReward: 245,
    worldSceneType: "data_highway",
  },
  {
    id: "m82",
    rank: "DEVELOPER",
    number: 82,
    title: "Basic List Comprehension",
    concept: "[x for x in iterable]",
    difficulty: "Advanced",
    story: "Square each speed multiplier in [1, 2, 3, 4] in a single concise line of Python.",
    objectives: [
      "Create squares = [x * x for x in [1, 2, 3, 4]]",
      "Print squares",
    ],
    conceptExplanation: "List comprehensions provide a concise way to create lists using the syntax [expression for item in iterable].",
    starterCode: `squares = [x * x for x in [1, 2, 3, 4]]
print(squares)
`,
    validationRules: {
      requiredKeywords: ["[x * x for x in", "print"],
      requiredOutputIncludes: ["[1, 4, 9, 16]"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use [x * x for x in [1, 2, 3, 4]]." },
      { level: 2, label: "Concept", text: "Calculates the square of each element." },
      { level: 3, label: "Example", text: "squares = [x * x for x in [1, 2, 3, 4]]\nprint(squares)" },
      { level: 4, label: "Solution", text: "Execute list comprehension." },
    ],
    xpReward: 495,
    coinsReward: 245,
    skillIdToUnlock: "py_comprehensions",
    worldSceneType: "data_highway",
  },
  {
    id: "m83",
    rank: "DEVELOPER",
    number: 83,
    title: "Filtered List Comprehension",
    concept: "[x for x in iterable if condition]",
    difficulty: "Advanced",
    story: "Filter out only high-speed velocities (> 300) from telemetry readings.",
    objectives: [
      "Set speeds = [240, 310, 280, 350, 420]",
      "Create high_speeds = [s for s in speeds if s > 300]",
      "Print high_speeds",
    ],
    conceptExplanation: "Adding 'if condition' at the end of a comprehension filters items.",
    starterCode: `speeds = [240, 310, 280, 350, 420]
high_speeds = [s for s in speeds if s > 300]
print(high_speeds)
`,
    validationRules: {
      requiredKeywords: ["[s for s in speeds if s > 300]", "print"],
      requiredOutputIncludes: ["[310, 350, 420]"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Add 'if s > 300' inside the comprehension brackets." },
      { level: 2, label: "Concept", text: "Only items satisfying the condition are included." },
      { level: 3, label: "Example", text: "high_speeds = [s for s in speeds if s > 300]\nprint(high_speeds)" },
      { level: 4, label: "Solution", text: "Execute filtered list comprehension." },
    ],
    xpReward: 500,
    coinsReward: 250,
    worldSceneType: "data_highway",
  },
  {
    id: "m84",
    rank: "DEVELOPER",
    number: 84,
    title: "Dictionary Comprehension",
    concept: "{k: v for ... in ...}",
    difficulty: "Advanced",
    story: "Construct a dictionary mapping sector IDs ('S1', 'S2', 'S3') to their required level numbers (10, 20, 30).",
    objectives: [
      "Set sectors = ['S1', 'S2', 'S3']",
      "Create map_dict = {s: (idx + 1) * 10 for idx, s in enumerate(sectors)}",
      "Print map_dict",
    ],
    conceptExplanation: "Dict comprehensions build dictionaries dynamically with {key_expr: val_expr for item in iterable}.",
    starterCode: `sectors = ["S1", "S2", "S3"]
map_dict = {s: (idx + 1) * 10 for idx, s in enumerate(sectors)}
print(map_dict)
`,
    validationRules: {
      requiredKeywords: ["{s: (idx + 1) * 10 for idx, s in enumerate(sectors)}", "print"],
      requiredOutputIncludes: ["'S1': 10", "'S3': 30"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use dict comprehension syntax {s: ...}." },
      { level: 2, label: "Concept", text: "Transforms list into dictionary mapping." },
      { level: 3, label: "Example", text: "map_dict = {s: (idx + 1) * 10 for idx, s in enumerate(sectors)}\nprint(map_dict)" },
      { level: 4, label: "Solution", text: "Execute dictionary comprehension." },
    ],
    xpReward: 505,
    coinsReward: 250,
    worldSceneType: "data_highway",
  },
  {
    id: "m85",
    rank: "DEVELOPER",
    number: 85,
    title: "Nested List Comprehension (Flattening)",
    concept: "2D Array Flattening",
    difficulty: "Advanced",
    story: "Flatten a 2D matrix [[1, 2], [3, 4], [5, 6]] into a single flat list.",
    objectives: [
      "Set matrix = [[1, 2], [3, 4], [5, 6]]",
      "Create flat = [val for row in matrix for val in row]",
      "Print flat",
    ],
    conceptExplanation: "Nested comprehensions can flatten multi-dimensional lists into 1D sequences.",
    starterCode: `matrix = [[1, 2], [3, 4], [5, 6]]
flat = [val for row in matrix for val in row]
print(flat)
`,
    validationRules: {
      requiredKeywords: ["[val for row in matrix for val in row]", "print"],
      requiredOutputIncludes: ["[1, 2, 3, 4, 5, 6]"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Write [val for row in matrix for val in row]." },
      { level: 2, label: "Concept", text: "The outer loop (for row in matrix) comes first." },
      { level: 3, label: "Example", text: "flat = [val for row in matrix for val in row]\nprint(flat)" },
      { level: 4, label: "Solution", text: "Execute list flattening comprehension." },
    ],
    xpReward: 510,
    coinsReward: 255,
    worldSceneType: "data_highway",
  },
  {
    id: "m86",
    rank: "DEVELOPER",
    number: 86,
    title: "Regex Pattern Matching: re.search",
    concept: "Regular Expressions (re.search)",
    difficulty: "Advanced",
    story: "Extract the vehicle model number from telemetry log 'LOG_ID: UNIT-8899_ACTIVE'.",
    objectives: [
      "Import re",
      "Match match = re.search(r'UNIT-\\d+', log)",
      "Print match.group()",
    ],
    conceptExplanation: "Python's 're' module handles pattern matching. '\\d+' matches one or more consecutive digits.",
    starterCode: `import re

log = "LOG_ID: UNIT-8899_ACTIVE"
match = re.search(r"UNIT-\\d+", log)
print(match.group())
`,
    validationRules: {
      requiredKeywords: ["import re", "re.search", "match.group()", "print"],
      requiredOutputIncludes: ["UNIT-8899"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use re.search(r'UNIT-\\d+', log)." },
      { level: 2, label: "Concept", text: "match.group() retrieves the matched string." },
      { level: 3, label: "Example", text: 'match = re.search(r"UNIT-\\d+", log)\nprint(match.group())' },
      { level: 4, label: "Solution", text: "Execute regex search extraction." },
    ],
    xpReward: 515,
    coinsReward: 255,
    skillIdToUnlock: "py_regex",
    worldSceneType: "data_highway",
  },
  {
    id: "m87",
    rank: "DEVELOPER",
    number: 87,
    title: "Regex Extraction: re.findall",
    concept: "Finding All Matches (re.findall)",
    difficulty: "Advanced",
    story: "Extract all numeric sensor voltage values from 'V1: 12V, V2: 24V, V3: 48V'.",
    objectives: [
      "Import re",
      "Find numbers = re.findall(r'\\d+', 'V1: 12V, V2: 24V, V3: 48V')",
      "Print numbers",
    ],
    conceptExplanation: "re.findall(pattern, text) returns a list of all non-overlapping matches.",
    starterCode: `import re

text = "V1: 12V, V2: 24V, V3: 48V"
numbers = re.findall(r"\\d+", text)
print(numbers)
`,
    validationRules: {
      requiredKeywords: ["import re", "re.findall", "print"],
      requiredOutputIncludes: ["['12', '24', '48']"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: 'Use re.findall(r"\\d+", text).' },
      { level: 2, label: "Concept", text: "Finds all digits in the string." },
      { level: 3, label: "Example", text: 'numbers = re.findall(r"\\d+", text)\nprint(numbers)' },
      { level: 4, label: "Solution", text: "Execute re.findall extraction." },
    ],
    xpReward: 520,
    coinsReward: 260,
    worldSceneType: "data_highway",
  },
  {
    id: "m88",
    rank: "DEVELOPER",
    number: 88,
    title: "Sorting with Custom Lambda Key",
    concept: "sorted(iterable, key=lambda)",
    difficulty: "Advanced",
    story: "Sort racers by their top speed in descending order using a lambda key.",
    objectives: [
      "Set racers = [{'name': 'AURA', 'speed': 320}, {'name': 'NEXUS', 'speed': 410}]",
      "Sort sorted_racers = sorted(racers, key=lambda r: r['speed'], reverse=True)",
      "Print sorted_racers[0]['name']",
    ],
    conceptExplanation: "The 'key' argument accepts a function (like a lambda) that extracts a comparison key from each element.",
    starterCode: `racers = [{"name": "AURA", "speed": 320}, {"name": "NEXUS", "speed": 410}]
sorted_racers = sorted(racers, key=lambda r: r["speed"], reverse=True)
print(sorted_racers[0]["name"])
`,
    validationRules: {
      requiredKeywords: ["key=lambda", "reverse=True", "print"],
      requiredOutputIncludes: ["NEXUS"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Sort with key=lambda r: r['speed']." },
      { level: 2, label: "Concept", text: "reverse=True sorts descending." },
      { level: 3, label: "Example", text: 'sorted_racers = sorted(racers, key=lambda r: r["speed"], reverse=True)\nprint(sorted_racers[0]["name"])' },
      { level: 4, label: "Solution", text: "Execute custom lambda sorting." },
    ],
    xpReward: 525,
    coinsReward: 260,
    worldSceneType: "data_highway",
  },
  {
    id: "m89",
    rank: "DEVELOPER",
    number: 89,
    title: "Dictionary Merging (| Operator)",
    concept: "Dict Union Operator (|) in Python 3.9+",
    difficulty: "Advanced",
    story: "Merge base engine settings with nitro boost upgrade configurations.",
    objectives: [
      "Set base = {'rpm': 5000, 'nitro': False}",
      "Set upgrade = {'nitro': True, 'boost_psi': 15}",
      "Merge merged = base | upgrade",
      "Print merged",
    ],
    conceptExplanation: "The '|' dictionary union operator combines two dictionaries, with right-hand keys taking precedence on conflict.",
    starterCode: `base = {"rpm": 5000, "nitro": False}
upgrade = {"nitro": True, "boost_psi": 15}
merged = base | upgrade
print(merged)
`,
    validationRules: {
      requiredKeywords: ["base | upgrade", "print"],
      requiredOutputIncludes: ["'nitro': True", "'boost_psi': 15"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use base | upgrade." },
      { level: 2, label: "Concept", text: "The pipe operator merges dictionaries cleanly." },
      { level: 3, label: "Example", text: "merged = base | upgrade\nprint(merged)" },
      { level: 4, label: "Solution", text: "Execute dict merging." },
    ],
    xpReward: 530,
    coinsReward: 265,
    worldSceneType: "data_highway",
  },
  {
    id: "m90",
    rank: "DEVELOPER",
    number: 90,
    title: "Developer Rank Capstone: Data Registry Citadel",
    concept: "Developer Mastery Synthesis",
    difficulty: "Advanced",
    story: "Process and filter a full fleet inventory using dicts, sets, list comprehensions, and regex parsing.",
    objectives: [
      "Filter fleet pilots with speed >= 400",
      "Format their names in uppercase",
      "Print 'DATA REGISTRY SYNCHRONIZED: DEVELOPER MASTERY ACHIEVED'",
    ],
    conceptExplanation: "You have mastered Python lists, tuples, dicts, sets, comprehensions, and regex data processing!",
    starterCode: `fleet = [
    {"pilot": "nexus", "speed": 420},
    {"pilot": "aura", "speed": 380},
    {"pilot": "zenith", "speed": 450}
]

top_pilots = [p["pilot"].upper() for p in fleet if p["speed"] >= 400]
print(top_pilots)
print("DATA REGISTRY SYNCHRONIZED: DEVELOPER MASTERY ACHIEVED")
`,
    validationRules: {
      requiredKeywords: ["for p in fleet if p[\"speed\"] >= 400", "print"],
      requiredOutputIncludes: ["['NEXUS', 'ZENITH']", "DATA REGISTRY SYNCHRONIZED: DEVELOPER MASTERY ACHIEVED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use list comprehension to filter speeds >= 400." },
      { level: 2, label: "Concept", text: "Combines dicts, list comprehensions, and upper()." },
      { level: 3, label: "Example", text: 'top_pilots = [p["pilot"].upper() for p in fleet if p["speed"] >= 400]\nprint(top_pilots)\nprint("DATA REGISTRY SYNCHRONIZED: DEVELOPER MASTERY ACHIEVED")' },
      { level: 4, label: "Solution", text: "Execute the Developer Capstone script." },
    ],
    xpReward: 550,
    coinsReward: 275,
    skillIdToUnlock: "py_developer_mastery",
    worldSceneType: "data_highway",
  },
];
