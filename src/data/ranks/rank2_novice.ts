import { Mission } from "../../types";

export const RANK2_NOVICE_MISSIONS: Mission[] = [
  {
    id: "m19",
    rank: "NOVICE",
    number: 19,
    title: "String Slicing: Head Extraction",
    concept: "String Slicing [start:end]",
    difficulty: "Beginner",
    story: "Extract the security header 'CYBER' from the packet 'CYBER_RACER_77'.",
    objectives: ["Set packet = 'CYBER_RACER_77'", "Extract header = packet[0:5]", "Print header"],
    conceptExplanation: "String slicing syntax is string[start:stop], where start is inclusive and stop is exclusive.",
    starterCode: `packet = "CYBER_RACER_77"
header = packet[0:5]
print(header)
`,
    validationRules: {
      requiredKeywords: ["packet", "[0:5]", "header", "print"],
      requiredOutputIncludes: ["CYBER"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Slice from index 0 to index 5." },
      { level: 2, label: "Concept", text: "packet[0:5] extracts characters at 0, 1, 2, 3, 4." },
      { level: 3, label: "Example", text: 'header = packet[0:5]\nprint(header)' },
      { level: 4, label: "Solution", text: 'header = packet[0:5] and print(header).' },
    ],
    xpReward: 150,
    coinsReward: 75,
    skillIdToUnlock: "py_strings",
    worldSceneType: "cyber_highway",
  },
  {
    id: "m20",
    rank: "NOVICE",
    number: 20,
    title: "String Slicing: Tail Extraction",
    concept: "Negative Index Slicing [-N:]",
    difficulty: "Beginner",
    story: "Extract the vehicle ID '77' from the end of 'CYBER_RACER_77'.",
    objectives: ["Set packet = 'CYBER_RACER_77'", "Extract tail = packet[-2:]", "Print tail"],
    conceptExplanation: "Negative indexing counts from the end of the string. -1 is the last character.",
    starterCode: `packet = "CYBER_RACER_77"
tail = packet[-2:]
print(tail)
`,
    validationRules: {
      requiredKeywords: ["packet", "[-2:]", "tail", "print"],
      requiredOutputIncludes: ["77"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use negative slicing [-2:]." },
      { level: 2, label: "Concept", text: "packet[-2:] grabs the last 2 characters." },
      { level: 3, label: "Example", text: 'tail = packet[-2:]\nprint(tail)' },
      { level: 4, label: "Solution", text: 'tail = packet[-2:] and print(tail).' },
    ],
    xpReward: 155,
    coinsReward: 75,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m21",
    rank: "NOVICE",
    number: 21,
    title: "Uppercase Beacon Broadcast",
    concept: "str.upper() Method",
    difficulty: "Beginner",
    story: "Convert incoming lowercase beacon data into urgent uppercase alert signals.",
    objectives: ["Set signal = 'highway emergency'", "Set alert = signal.upper()", "Print alert"],
    conceptExplanation: ".upper() returns a new copy of the string converted entirely to uppercase.",
    starterCode: `signal = "highway emergency"
alert = signal.upper()
print(alert)
`,
    validationRules: {
      requiredKeywords: ["signal", "upper()", "alert", "print"],
      requiredOutputIncludes: ["HIGHWAY EMERGENCY"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Call .upper() on the signal." },
      { level: 2, label: "Concept", text: "alert = signal.upper()" },
      { level: 3, label: "Example", text: 'alert = signal.upper()\nprint(alert)' },
      { level: 4, label: "Solution", text: 'alert = signal.upper() and print(alert).' },
    ],
    xpReward: 160,
    coinsReward: 80,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m22",
    rank: "NOVICE",
    number: 22,
    title: "Lowercase Normalization",
    concept: "str.lower() Method",
    difficulty: "Beginner",
    story: "Normalize loud terminal commands to standard lowercase for internal parsing.",
    objectives: ["Set cmd = 'INITIALIZE_ENGINES'", "Set normalized = cmd.lower()", "Print normalized"],
    conceptExplanation: ".lower() returns a lowercase version of the target string.",
    starterCode: `cmd = "INITIALIZE_ENGINES"
normalized = cmd.lower()
print(normalized)
`,
    validationRules: {
      requiredKeywords: ["cmd", "lower()", "normalized", "print"],
      requiredOutputIncludes: ["initialize_engines"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use .lower()." },
      { level: 2, label: "Concept", text: "normalized = cmd.lower()" },
      { level: 3, label: "Example", text: 'normalized = cmd.lower()\nprint(normalized)' },
      { level: 4, label: "Solution", text: 'normalized = cmd.lower() and print(normalized).' },
    ],
    xpReward: 165,
    coinsReward: 80,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m23",
    rank: "NOVICE",
    number: 23,
    title: "f-String Telemetry Stream",
    concept: "Formatted String Literals (f-strings)",
    difficulty: "Beginner",
    story: "Format real-time telemetry speed and temperature into a clean HUD string.",
    objectives: [
      "Set speed = 320",
      "Set temp = 85",
      "Format msg = f'SPEED: {speed} KM/H | TEMP: {temp} C'",
      "Print msg",
    ],
    conceptExplanation: "f-strings (f'...') allow embedding expressions directly inside curly braces {var}.",
    starterCode: `speed = 320
temp = 85
msg = f"SPEED: {speed} KM/H | TEMP: {temp} C"
print(msg)
`,
    validationRules: {
      requiredKeywords: ["speed", "temp", "f\"", "print"],
      requiredOutputIncludes: ["SPEED: 320 KM/H | TEMP: 85 C"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: 'Use an f-string starting with f"..."' },
      { level: 2, label: "Concept", text: 'f"SPEED: {speed} KM/H | TEMP: {temp} C"' },
      { level: 3, label: "Example", text: 'msg = f"SPEED: {speed} KM/H | TEMP: {temp} C"\nprint(msg)' },
      { level: 4, label: "Solution", text: "Execute the f-string formatting statement." },
    ],
    xpReward: 170,
    coinsReward: 85,
    skillIdToUnlock: "py_fstrings",
    worldSceneType: "cyber_highway",
  },
  {
    id: "m24",
    rank: "NOVICE",
    number: 24,
    title: "Whitespace Trimming",
    concept: "str.strip()",
    difficulty: "Beginner",
    story: "Strip extraneous white spaces around decrypted pilot credentials.",
    objectives: ["Set raw_pilot = '   CYBER_PHOENIX   '", "Set clean_pilot = raw_pilot.strip()", "Print clean_pilot"],
    conceptExplanation: ".strip() removes leading and trailing whitespace from strings.",
    starterCode: `raw_pilot = "   CYBER_PHOENIX   "
clean_pilot = raw_pilot.strip()
print(clean_pilot)
`,
    validationRules: {
      requiredKeywords: ["raw_pilot", "strip()", "clean_pilot", "print"],
      requiredOutputIncludes: ["CYBER_PHOENIX"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use .strip() to trim whitespace." },
      { level: 2, label: "Concept", text: "clean_pilot = raw_pilot.strip()" },
      { level: 3, label: "Example", text: 'clean_pilot = raw_pilot.strip()\nprint(clean_pilot)' },
      { level: 4, label: "Solution", text: 'clean_pilot = raw_pilot.strip() and print(clean_pilot).' },
    ],
    xpReward: 175,
    coinsReward: 85,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m25",
    rank: "NOVICE",
    number: 25,
    title: "String Replacement",
    concept: "str.replace()",
    difficulty: "Beginner",
    story: "Patch glitch codes by replacing 'GLITCH' with 'SECURE'.",
    objectives: ["Set code = 'SYSTEM_GLITCH_MODE'", "Set patched = code.replace('GLITCH', 'SECURE')", "Print patched"],
    conceptExplanation: ".replace(old, new) replaces occurrences of a substring with a replacement string.",
    starterCode: `code = "SYSTEM_GLITCH_MODE"
patched = code.replace("GLITCH", "SECURE")
print(patched)
`,
    validationRules: {
      requiredKeywords: ["code", "replace", "patched", "print"],
      requiredOutputIncludes: ["SYSTEM_SECURE_MODE"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: 'Use code.replace("GLITCH", "SECURE").' },
      { level: 2, label: "Concept", text: ".replace(old, new) replaces all matching fragments." },
      { level: 3, label: "Example", text: 'patched = code.replace("GLITCH", "SECURE")\nprint(patched)' },
      { level: 4, label: "Solution", text: 'patched = code.replace("GLITCH", "SECURE") and print(patched).' },
    ],
    xpReward: 180,
    coinsReward: 90,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m26",
    rank: "NOVICE",
    number: 26,
    title: "Substring Search",
    concept: "The 'in' Keyword for Strings",
    difficulty: "Beginner",
    story: "Check if the keyword 'NITRO' exists in the active engine config.",
    objectives: ["Set config = 'TURBO_NITRO_INJECTION'", "Check exists = 'NITRO' in config", "Print exists"],
    conceptExplanation: "The 'in' operator checks if a substring or element exists within a sequence, returning True or False.",
    starterCode: `config = "TURBO_NITRO_INJECTION"
exists = "NITRO" in config
print(exists)
`,
    validationRules: {
      requiredKeywords: ["config", "\"NITRO\" in config", "exists", "print"],
      requiredOutputIncludes: ["True"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: 'Check "NITRO" in config.' },
      { level: 2, label: "Concept", text: "'in' evaluates to a boolean." },
      { level: 3, label: "Example", text: 'exists = "NITRO" in config\nprint(exists)' },
      { level: 4, label: "Solution", text: 'exists = "NITRO" in config and print(exists).' },
    ],
    xpReward: 185,
    coinsReward: 90,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m27",
    rank: "NOVICE",
    number: 27,
    title: "String Splitting",
    concept: "str.split()",
    difficulty: "Beginner",
    story: "Split a comma-separated sensor stream into a list of individual values.",
    objectives: ["Set stream = '240,85,99'", "Set tokens = stream.split(',')", "Print tokens"],
    conceptExplanation: ".split(delimiter) breaks a string into a list of tokens based on the specified delimiter.",
    starterCode: `stream = "240,85,99"
tokens = stream.split(",")
print(tokens)
`,
    validationRules: {
      requiredKeywords: ["stream", "split", "tokens", "print"],
      requiredOutputIncludes: ["['240', '85', '99']"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use stream.split(',')." },
      { level: 2, label: "Concept", text: ".split(',') yields a list of strings." },
      { level: 3, label: "Example", text: 'tokens = stream.split(",")\nprint(tokens)' },
      { level: 4, label: "Solution", text: 'tokens = stream.split(",") and print(tokens).' },
    ],
    xpReward: 190,
    coinsReward: 95,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m28",
    rank: "NOVICE",
    number: 28,
    title: "Prefix Checking",
    concept: "str.startswith()",
    difficulty: "Beginner",
    story: "Verify if the track code starts with 'SECTOR'.",
    objectives: ["Set track = 'SECTOR_02_NEON'", "Set valid = track.startswith('SECTOR')", "Print valid"],
    conceptExplanation: ".startswith(prefix) checks if a string begins with a specified substring.",
    starterCode: `track = "SECTOR_02_NEON"
valid = track.startswith("SECTOR")
print(valid)
`,
    validationRules: {
      requiredKeywords: ["track", "startswith", "valid", "print"],
      requiredOutputIncludes: ["True"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: 'Use track.startswith("SECTOR").' },
      { level: 2, label: "Concept", text: ".startswith() returns True or False." },
      { level: 3, label: "Example", text: 'valid = track.startswith("SECTOR")\nprint(valid)' },
      { level: 4, label: "Solution", text: 'valid = track.startswith("SECTOR") and print(valid).' },
    ],
    xpReward: 195,
    coinsReward: 95,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m29",
    rank: "NOVICE",
    number: 29,
    title: "Suffix Checking",
    concept: "str.endswith()",
    difficulty: "Beginner",
    story: "Check if the vehicle firmware file ends with '.bin'.",
    objectives: ["Set filename = 'firmware_v2.bin'", "Set is_bin = filename.endswith('.bin')", "Print is_bin"],
    conceptExplanation: ".endswith(suffix) tests if a string terminates with the given substring.",
    starterCode: `filename = "firmware_v2.bin"
is_bin = filename.endswith(".bin")
print(is_bin)
`,
    validationRules: {
      requiredKeywords: ["filename", "endswith", "is_bin", "print"],
      requiredOutputIncludes: ["True"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: 'Use filename.endswith(".bin").' },
      { level: 2, label: "Concept", text: ".endswith() checks the tail of a string." },
      { level: 3, label: "Example", text: 'is_bin = filename.endswith(".bin")\nprint(is_bin)' },
      { level: 4, label: "Solution", text: 'is_bin = filename.endswith(".bin") and print(is_bin).' },
    ],
    xpReward: 200,
    coinsReward: 100,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m30",
    rank: "NOVICE",
    number: 30,
    title: "String Joining",
    concept: "str.join()",
    difficulty: "Beginner",
    story: "Assemble a path URL using '/' as a joiner between sector segments.",
    objectives: ["Set segments = ['desuper', 'sector2', 'neon']", "Set path = '/'.join(segments)", "Print path"],
    conceptExplanation: "'delimiter'.join(iterable) joins a list of strings into one string separated by the delimiter.",
    starterCode: `segments = ["desuper", "sector2", "neon"]
path = "/".join(segments)
print(path)
`,
    validationRules: {
      requiredKeywords: ["segments", "join", "path", "print"],
      requiredOutputIncludes: ["desuper/sector2/neon"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: 'Use "/".join(segments).' },
      { level: 2, label: "Concept", text: "join() combines list items with a separator." },
      { level: 3, label: "Example", text: 'path = "/".join(segments)\nprint(path)' },
      { level: 4, label: "Solution", text: 'path = "/".join(segments) and print(path).' },
    ],
    xpReward: 205,
    coinsReward: 100,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m31",
    rank: "NOVICE",
    number: 31,
    title: "Comparison: Greater Than",
    concept: "Relational Operators (>, <, >=, <=)",
    difficulty: "Beginner",
    story: "Compare current vehicle velocity against the track speed limit of 280 km/h.",
    objectives: ["Set current_speed = 310", "Set speed_limit = 280", "Set is_speeding = current_speed > speed_limit", "Print is_speeding"],
    conceptExplanation: "Relational operators compare values and evaluate to boolean True or False.",
    starterCode: `current_speed = 310
speed_limit = 280
is_speeding = current_speed > speed_limit
print(is_speeding)
`,
    validationRules: {
      requiredKeywords: ["current_speed", "speed_limit", "is_speeding", "print"],
      requiredOutputIncludes: ["True"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Compare with '>'." },
      { level: 2, label: "Concept", text: "310 > 280 evaluates to True." },
      { level: 3, label: "Example", text: "is_speeding = current_speed > speed_limit\nprint(is_speeding)" },
      { level: 4, label: "Solution", text: "is_speeding = current_speed > speed_limit and print(is_speeding)." },
    ],
    xpReward: 210,
    coinsReward: 105,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m32",
    rank: "NOVICE",
    number: 32,
    title: "Equality Comparison",
    concept: "Equality Operator (==) vs Assignment (=)",
    difficulty: "Beginner",
    story: "Check if the entered security PIN matches the sector passkey.",
    objectives: ["Set entered_pin = 4455", "Set system_pin = 4455", "Set is_match = (entered_pin == system_pin)", "Print is_match"],
    conceptExplanation: "'==' tests equality between two values, whereas '=' assigns a value to a variable.",
    starterCode: `entered_pin = 4455
system_pin = 4455
is_match = entered_pin == system_pin
print(is_match)
`,
    validationRules: {
      requiredKeywords: ["entered_pin", "system_pin", "==", "is_match", "print"],
      requiredOutputIncludes: ["True"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use '==' for comparison." },
      { level: 2, label: "Concept", text: "entered_pin == system_pin evaluates to True." },
      { level: 3, label: "Example", text: "is_match = entered_pin == system_pin\nprint(is_match)" },
      { level: 4, label: "Solution", text: "is_match = entered_pin == system_pin and print(is_match)." },
    ],
    xpReward: 215,
    coinsReward: 105,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m33",
    rank: "NOVICE",
    number: 33,
    title: "Inequality Operator",
    concept: "Inequality (!=)",
    difficulty: "Beginner",
    story: "Verify that the vehicle target destination is not identical to current location.",
    objectives: ["Set current_loc = 'NEON_JUNCTION'", "Set target_loc = 'SILICON_RIFT'", "Set is_different = (current_loc != target_loc)", "Print is_different"],
    conceptExplanation: "'!=' checks if two values are not equal.",
    starterCode: `current_loc = "NEON_JUNCTION"
target_loc = "SILICON_RIFT"
is_different = current_loc != target_loc
print(is_different)
`,
    validationRules: {
      requiredKeywords: ["current_loc", "target_loc", "!=", "is_different", "print"],
      requiredOutputIncludes: ["True"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use '!=' to test inequality." },
      { level: 2, label: "Concept", text: "current_loc != target_loc evaluates to True." },
      { level: 3, label: "Example", text: "is_different = current_loc != target_loc\nprint(is_different)" },
      { level: 4, label: "Solution", text: "is_different = current_loc != target_loc and print(is_different)." },
    ],
    xpReward: 220,
    coinsReward: 110,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m34",
    rank: "NOVICE",
    number: 34,
    title: "Logical AND Gate",
    concept: "Logical 'and' Operator",
    difficulty: "Beginner",
    story: "Engage warp propulsion only when both shields and boost pressure are at maximum.",
    objectives: ["Set shield_ready = True", "Set boost_ready = True", "Set warp_allowed = shield_ready and boost_ready", "Print warp_allowed"],
    conceptExplanation: "The 'and' operator returns True only if both operand expressions evaluate to True.",
    starterCode: `shield_ready = True
boost_ready = True
warp_allowed = shield_ready and boost_ready
print(warp_allowed)
`,
    validationRules: {
      requiredKeywords: ["shield_ready", "boost_ready", "and", "warp_allowed", "print"],
      requiredOutputIncludes: ["True"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use 'and' to combine booleans." },
      { level: 2, label: "Concept", text: "True and True is True." },
      { level: 3, label: "Example", text: "warp_allowed = shield_ready and boost_ready\nprint(warp_allowed)" },
      { level: 4, label: "Solution", text: "warp_allowed = shield_ready and boost_ready and print(warp_allowed)." },
    ],
    xpReward: 225,
    coinsReward: 110,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m35",
    rank: "NOVICE",
    number: 35,
    title: "Logical OR Gate",
    concept: "Logical 'or' Operator",
    difficulty: "Beginner",
    story: "Allow lane overtaking if either the left or right lane is clear.",
    objectives: ["Set left_clear = False", "Set right_clear = True", "Set can_overtake = left_clear or right_clear", "Print can_overtake"],
    conceptExplanation: "The 'or' operator returns True if at least one operand evaluates to True.",
    starterCode: `left_clear = False
right_clear = True
can_overtake = left_clear or right_clear
print(can_overtake)
`,
    validationRules: {
      requiredKeywords: ["left_clear", "right_clear", "or", "can_overtake", "print"],
      requiredOutputIncludes: ["True"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use 'or'." },
      { level: 2, label: "Concept", text: "False or True is True." },
      { level: 3, label: "Example", text: "can_overtake = left_clear or right_clear\nprint(can_overtake)" },
      { level: 4, label: "Solution", text: "can_overtake = left_clear or right_clear and print(can_overtake)." },
    ],
    xpReward: 230,
    coinsReward: 115,
    worldSceneType: "cyber_highway",
  },
  {
    id: "m36",
    rank: "NOVICE",
    number: 36,
    title: "Novice Rank Capstone: Neon Grid Highway",
    concept: "Novice Rank Synthesis",
    difficulty: "Beginner",
    story: "Format and validate full racer passport credentials to breach Sector 2.",
    objectives: [
      "Set racer = 'nexus_prime'",
      "Format clean_racer = racer.upper()",
      "Set speed = 360",
      "Format hud = f'PILOT: {clean_racer} | VELOCITY: {speed} KM/H | READY: {speed > 300}'",
      "Print hud",
    ],
    conceptExplanation: "You have mastered Python string operations, methods, formatting, comparisons, and boolean logic!",
    starterCode: `racer = "nexus_prime"
clean_racer = racer.upper()
speed = 360
is_ready = speed > 300

hud = f"PILOT: {clean_racer} | VELOCITY: {speed} KM/H | READY: {is_ready}"
print(hud)
`,
    validationRules: {
      requiredKeywords: ["upper()", "f\"", "speed", "print"],
      requiredOutputIncludes: ["PILOT: NEXUS_PRIME | VELOCITY: 360 KM/H | READY: True"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Transform racer with upper() and format with an f-string." },
      { level: 2, label: "Concept", text: "Combine string methods with f-string interpolation." },
      { level: 3, label: "Example", text: 'hud = f"PILOT: {clean_racer} | VELOCITY: {speed} KM/H | READY: {is_ready}"\nprint(hud)' },
      { level: 4, label: "Solution", text: "Run the final Novice passport script." },
    ],
    xpReward: 250,
    coinsReward: 125,
    skillIdToUnlock: "py_novice_mastery",
    worldSceneType: "cyber_highway",
  },
];
