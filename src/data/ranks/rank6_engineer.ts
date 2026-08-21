import { Mission } from "../../types";

export const RANK6_ENGINEER_MISSIONS: Mission[] = [
  {
    id: "m91",
    rank: "ENGINEER",
    number: 91,
    title: "Function Declaration & Return",
    concept: "def and return",
    difficulty: "Advanced",
    story: "Define a reusable function compute_thrust(mass, accel) to calculate vehicle force (F = m * a).",
    objectives: [
      "Define function compute_thrust(mass, accel) that returns mass * accel",
      "Call force = compute_thrust(1000, 5)",
      "Print force",
    ],
    conceptExplanation: "The 'def' keyword defines a function. The 'return' statement sends a computed value back to the caller.",
    starterCode: `def compute_thrust(mass, accel):
    return mass * accel

force = compute_thrust(1000, 5)
print(force)
`,
    validationRules: {
      requiredKeywords: ["def compute_thrust", "return", "print"],
      requiredOutputIncludes: ["5000"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Define the function and return mass * accel." },
      { level: 2, label: "Concept", text: "def name(args):\n    return result" },
      { level: 3, label: "Example", text: "def compute_thrust(mass, accel):\n    return mass * accel\nforce = compute_thrust(1000, 5)\nprint(force)" },
      { level: 4, label: "Solution", text: "Execute function declaration." },
    ],
    xpReward: 550,
    coinsReward: 275,
    skillIdToUnlock: "py_functions",
    worldSceneType: "core_reactor",
  },
  {
    id: "m92",
    rank: "ENGINEER",
    number: 92,
    title: "Default Parameter Values",
    concept: "Optional / Default Arguments",
    difficulty: "Advanced",
    story: "Create a boost function where turbo multiplier defaults to 1.5 if omitted.",
    objectives: [
      "Define engage_boost(base_speed, multiplier=1.5)",
      "Call engage_boost(200)",
      "Print result",
    ],
    conceptExplanation: "Parameters can define fallback default values (param=default) used when the caller does not supply that argument.",
    starterCode: `def engage_boost(base_speed, multiplier=1.5):
    return base_speed * multiplier

boosted = engage_boost(200)
print(boosted)
`,
    validationRules: {
      requiredKeywords: ["multiplier=1.5", "return", "print"],
      requiredOutputIncludes: ["300.0"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Set multiplier=1.5 in the def line." },
      { level: 2, label: "Concept", text: "200 * 1.5 = 300.0" },
      { level: 3, label: "Example", text: "def engage_boost(base_speed, multiplier=1.5):\n    return base_speed * multiplier\nprint(engage_boost(200))" },
      { level: 4, label: "Solution", text: "Execute default argument function." },
    ],
    xpReward: 555,
    coinsReward: 275,
    worldSceneType: "core_reactor",
  },
  {
    id: "m93",
    rank: "ENGINEER",
    number: 93,
    title: "Positional Variable Arguments (*args)",
    concept: "*args for Arbitrary Arguments",
    difficulty: "Advanced",
    story: "Calculate total energy consumption across an arbitrary number of vehicle modules.",
    objectives: [
      "Define sum_energy(*args) that returns sum(args)",
      "Call total = sum_energy(10, 20, 30, 40)",
      "Print total",
    ],
    conceptExplanation: "*args packs arbitrary positional arguments into a tuple inside the function body.",
    starterCode: `def sum_energy(*args):
    return sum(args)

total = sum_energy(10, 20, 30, 40)
print(total)
`,
    validationRules: {
      requiredKeywords: ["def sum_energy(*args):", "sum(args)", "print"],
      requiredOutputIncludes: ["100"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use *args to capture all values." },
      { level: 2, label: "Concept", text: "args is received as a tuple." },
      { level: 3, label: "Example", text: "def sum_energy(*args):\n    return sum(args)\nprint(sum_energy(10, 20, 30, 40))" },
      { level: 4, label: "Solution", text: "Execute *args function." },
    ],
    xpReward: 560,
    coinsReward: 280,
    skillIdToUnlock: "py_args_kwargs",
    worldSceneType: "core_reactor",
  },
  {
    id: "m94",
    rank: "ENGINEER",
    number: 94,
    title: "Keyword Variable Arguments (**kwargs)",
    concept: "**kwargs for Arbitrary Named Arguments",
    difficulty: "Advanced",
    story: "Construct vehicle configuration dictionary dynamically from keyword parameters.",
    objectives: [
      "Define build_config(**kwargs) that returns kwargs",
      "Call cfg = build_config(engine='V8_CYBER', turbo=True, shield=100)",
      "Print cfg['engine']",
    ],
    conceptExplanation: "**kwargs collects arbitrary keyword arguments into a standard dictionary.",
    starterCode: `def build_config(**kwargs):
    return kwargs

cfg = build_config(engine="V8_CYBER", turbo=True, shield=100)
print(cfg["engine"])
`,
    validationRules: {
      requiredKeywords: ["def build_config(**kwargs):", "return kwargs", "print"],
      requiredOutputIncludes: ["V8_CYBER"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use **kwargs to capture dictionary parameters." },
      { level: 2, label: "Concept", text: "kwargs becomes a dictionary inside the function." },
      { level: 3, label: "Example", text: 'cfg = build_config(engine="V8_CYBER")\nprint(cfg["engine"])' },
      { level: 4, label: "Solution", text: "Execute **kwargs function." },
    ],
    xpReward: 565,
    coinsReward: 280,
    worldSceneType: "core_reactor",
  },
  {
    id: "m95",
    rank: "ENGINEER",
    number: 95,
    title: "Anonymous Lambda Functions",
    concept: "lambda Arguments: Expression",
    difficulty: "Advanced",
    story: "Create a compact inline lambda function to compute kilowatt-hours to horsepower.",
    objectives: [
      "Define kw_to_hp = lambda kw: kw * 1.341",
      "Call hp = round(kw_to_hp(100))",
      "Print hp",
    ],
    conceptExplanation: "Lambdas are small anonymous functions defined with the syntax 'lambda x: expression'.",
    starterCode: `kw_to_hp = lambda kw: kw * 1.341
hp = round(kw_to_hp(100))
print(hp)
`,
    validationRules: {
      requiredKeywords: ["lambda kw:", "print"],
      requiredOutputIncludes: ["134"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Write kw_to_hp = lambda kw: kw * 1.341." },
      { level: 2, label: "Concept", text: "round(100 * 1.341) is 134." },
      { level: 3, label: "Example", text: "kw_to_hp = lambda kw: kw * 1.341\nprint(round(kw_to_hp(100)))" },
      { level: 4, label: "Solution", text: "Execute lambda computation." },
    ],
    xpReward: 570,
    coinsReward: 285,
    skillIdToUnlock: "py_lambda",
    worldSceneType: "core_reactor",
  },
  {
    id: "m96",
    rank: "ENGINEER",
    number: 96,
    title: "Functional Mapping with map()",
    concept: "map(func, iterable)",
    difficulty: "Advanced",
    story: "Double all vehicle boost pressure stages [10, 20, 30] using map().",
    objectives: [
      "Call doubled = list(map(lambda x: x * 2, [10, 20, 30]))",
      "Print doubled",
    ],
    conceptExplanation: "map(func, iterable) applies a function to all elements in the iterable.",
    starterCode: `doubled = list(map(lambda x: x * 2, [10, 20, 30]))
print(doubled)
`,
    validationRules: {
      requiredKeywords: ["map(lambda", "list(", "print"],
      requiredOutputIncludes: ["[20, 40, 60]"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use map with a lambda function." },
      { level: 2, label: "Concept", text: "Wrap map in list() to get a list." },
      { level: 3, label: "Example", text: "doubled = list(map(lambda x: x * 2, [10, 20, 30]))\nprint(doubled)" },
      { level: 4, label: "Solution", text: "Execute functional mapping." },
    ],
    xpReward: 575,
    coinsReward: 285,
    worldSceneType: "core_reactor",
  },
  {
    id: "m97",
    rank: "ENGINEER",
    number: 97,
    title: "Functional Filtering with filter()",
    concept: "filter(predicate, iterable)",
    difficulty: "Advanced",
    story: "Filter out only even lap checkpoint identifiers from [1, 2, 3, 4, 5, 6].",
    objectives: [
      "Call evens = list(filter(lambda x: x % 2 == 0, [1, 2, 3, 4, 5, 6]))",
      "Print evens",
    ],
    conceptExplanation: "filter(func, iterable) keeps only elements for which func returns True.",
    starterCode: `evens = list(filter(lambda x: x % 2 == 0, [1, 2, 3, 4, 5, 6]))
print(evens)
`,
    validationRules: {
      requiredKeywords: ["filter(lambda", "x % 2 == 0", "print"],
      requiredOutputIncludes: ["[2, 4, 6]"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Filter with x % 2 == 0." },
      { level: 2, label: "Concept", text: "Keeps elements where remainder is 0." },
      { level: 3, label: "Example", text: "evens = list(filter(lambda x: x % 2 == 0, [1, 2, 3, 4, 5, 6]))\nprint(evens)" },
      { level: 4, label: "Solution", text: "Execute functional filter." },
    ],
    xpReward: 580,
    coinsReward: 290,
    worldSceneType: "core_reactor",
  },
  {
    id: "m98",
    rank: "ENGINEER",
    number: 98,
    title: "Recursive Countdown Countdown",
    concept: "Recursion & Base Cases",
    difficulty: "Advanced",
    story: "Calculate factorial countdown calculation 5! (5 * 4 * 3 * 2 * 1) using recursion.",
    objectives: [
      "Define factorial(n): if n <= 1 return 1, else return n * factorial(n - 1)",
      "Call result = factorial(5)",
      "Print result",
    ],
    conceptExplanation: "A recursive function calls itself. It must have a base case to terminate recursion.",
    starterCode: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
`,
    validationRules: {
      requiredKeywords: ["def factorial", "factorial(n - 1)", "print"],
      requiredOutputIncludes: ["120"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Return n * factorial(n - 1) with base case n <= 1." },
      { level: 2, label: "Concept", text: "5 * 4 * 3 * 2 * 1 = 120." },
      { level: 3, label: "Example", text: "def factorial(n):\n    if n <= 1: return 1\n    return n * factorial(n - 1)\nprint(factorial(5))" },
      { level: 4, label: "Solution", text: "Execute recursive factorial." },
    ],
    xpReward: 585,
    coinsReward: 290,
    skillIdToUnlock: "py_recursion",
    worldSceneType: "core_reactor",
  },
  {
    id: "m99",
    rank: "ENGINEER",
    number: 99,
    title: "Binary Search Algorithm (O(log N))",
    concept: "Binary Search Implementation",
    difficulty: "Advanced",
    story: "Locate target checkpoint index in a sorted list of 7 waypoints in O(log N) steps.",
    objectives: [
      "Implement binary_search(arr, target)",
      "Search for target 70 in [10, 20, 30, 50, 70, 90, 110]",
      "Print index",
    ],
    conceptExplanation: "Binary search repeatedly halves the search interval of a sorted collection.",
    starterCode: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

data = [10, 20, 30, 50, 70, 90, 110]
idx = binary_search(data, 70)
print(idx)
`,
    validationRules: {
      requiredKeywords: ["while left <= right:", "mid = (left + right) // 2", "print"],
      requiredOutputIncludes: ["4"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Find index of 70 (index 4)." },
      { level: 2, label: "Concept", text: "Halves search window each step." },
      { level: 3, label: "Example", text: "idx = binary_search(data, 70)\nprint(idx)" },
      { level: 4, label: "Solution", text: "Execute binary search." },
    ],
    xpReward: 590,
    coinsReward: 295,
    worldSceneType: "core_reactor",
  },
  {
    id: "m100",
    rank: "ENGINEER",
    number: 100,
    title: "Scope & Closure Functions",
    concept: "Nested Functions & Lexical Scope",
    difficulty: "Advanced",
    story: "Create a boost multiplier generator function that returns a customized multiplier closure.",
    objectives: [
      "Define make_booster(factor) which returns a function multiplying by factor",
      "Create turbo = make_booster(3)",
      "Print turbo(50)",
    ],
    conceptExplanation: "A closure is an inner function that retains access to variables in its outer enclosing scope.",
    starterCode: `def make_booster(factor):
    def booster(speed):
        return speed * factor
    return booster

turbo = make_booster(3)
print(turbo(50))
`,
    validationRules: {
      requiredKeywords: ["def make_booster", "return booster", "print"],
      requiredOutputIncludes: ["150"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Return the inner booster function." },
      { level: 2, label: "Concept", text: "turbo remembers factor=3, so 50 * 3 = 150." },
      { level: 3, label: "Example", text: "turbo = make_booster(3)\nprint(turbo(50))" },
      { level: 4, label: "Solution", text: "Execute closure generator." },
    ],
    xpReward: 595,
    coinsReward: 295,
    worldSceneType: "core_reactor",
  },
  {
    id: "m101",
    rank: "ENGINEER",
    number: 101,
    title: "Python Decorator Pattern",
    concept: "Decorators (@decorator_name)",
    difficulty: "Advanced",
    story: "Create an audit logger decorator @log_telemetry that announces execution before calling a function.",
    objectives: [
      "Define log_telemetry decorator",
      "Decorate launch_thrusters()",
      "Call launch_thrusters()",
    ],
    conceptExplanation: "Decorators are functions that take another function as an argument and extend its behavior without modifying it.",
    starterCode: `def log_telemetry(func):
    def wrapper():
        print("AUDIT: EXECUTING PROPULSION")
        return func()
    return wrapper

@log_telemetry
def launch_thrusters():
    print("THRUSTERS: ACTIVE")

launch_thrusters()
`,
    validationRules: {
      requiredKeywords: ["@log_telemetry", "def wrapper", "print"],
      requiredOutputIncludes: ["AUDIT: EXECUTING PROPULSION", "THRUSTERS: ACTIVE"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Decorate the function with @log_telemetry." },
      { level: 2, label: "Concept", text: "The wrapper runs pre-execution logic." },
      { level: 3, label: "Example", text: "@log_telemetry\ndef launch_thrusters():\n    print('THRUSTERS: ACTIVE')\nlaunch_thrusters()" },
      { level: 4, label: "Solution", text: "Execute decorated function." },
    ],
    xpReward: 600,
    coinsReward: 300,
    skillIdToUnlock: "py_decorators",
    worldSceneType: "core_reactor",
  },
  {
    id: "m102",
    rank: "ENGINEER",
    number: 102,
    title: "Docstrings & Help Documentation",
    concept: "Function __doc__ & Documentation",
    difficulty: "Advanced",
    story: "Document function specifications using a triple-quoted docstring.",
    objectives: [
      "Add docstring to calibrate_radar",
      "Print calibrate_radar.__doc__",
    ],
    conceptExplanation: "Docstrings immediately follow a function header and document its parameters, behavior, and return types.",
    starterCode: `def calibrate_radar():
    """Calibrates cyber radar frequency to 990MHz."""
    return 990

print(calibrate_radar.__doc__)
`,
    validationRules: {
      requiredKeywords: ['"""Calibrates cyber radar frequency to 990MHz."""', "__doc__", "print"],
      requiredOutputIncludes: ["Calibrates cyber radar frequency to 990MHz."],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: 'Use triple quotes """docstring""".' },
      { level: 2, label: "Concept", text: "Access with function.__doc__." },
      { level: 3, label: "Example", text: "print(calibrate_radar.__doc__)" },
      { level: 4, label: "Solution", text: "Execute docstring inspection." },
    ],
    xpReward: 605,
    coinsReward: 300,
    worldSceneType: "core_reactor",
  },
  {
    id: "m103",
    rank: "ENGINEER",
    number: 103,
    title: "Global vs Local Scope",
    concept: "The 'global' Keyword",
    difficulty: "Advanced",
    story: "Modify a global system battery variable inside a charging station function.",
    objectives: [
      "Declare global battery = 50",
      "Inside charge(), declare 'global battery' and set battery = 100",
      "Call charge() and print battery",
    ],
    conceptExplanation: "The 'global' keyword allows modifying variables declared at module level inside function scopes.",
    starterCode: `battery = 50

def charge():
    global battery
    battery = 100

charge()
print(battery)
`,
    validationRules: {
      requiredKeywords: ["global battery", "battery = 100", "print"],
      requiredOutputIncludes: ["100"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Write global battery inside charge()." },
      { level: 2, label: "Concept", text: "Binds the local assignment to global scope." },
      { level: 3, label: "Example", text: "def charge():\n    global battery\n    battery = 100" },
      { level: 4, label: "Solution", text: "Execute global scope mutation." },
    ],
    xpReward: 610,
    coinsReward: 305,
    worldSceneType: "core_reactor",
  },
  {
    id: "m104",
    rank: "ENGINEER",
    number: 104,
    title: "Fibonacci Sequence Generator",
    concept: "Recursive / Iterative Series",
    difficulty: "Advanced",
    story: "Compute the 7th Fibonacci number (1, 1, 2, 3, 5, 8, 13).",
    objectives: [
      "Define fib(n)",
      "Print fib(7)",
    ],
    conceptExplanation: "Fibonacci sequence: fib(n) = fib(n-1) + fib(n-2) with fib(1)=1, fib(2)=1.",
    starterCode: `def fib(n):
    if n <= 2:
        return 1
    return fib(n - 1) + fib(n - 2)

print(fib(7))
`,
    validationRules: {
      requiredKeywords: ["def fib", "fib(n - 1) + fib(n - 2)", "print"],
      requiredOutputIncludes: ["13"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Return fib(n-1) + fib(n-2)." },
      { level: 2, label: "Concept", text: "fib(7) evaluates to 13." },
      { level: 3, label: "Example", text: "print(fib(7))" },
      { level: 4, label: "Solution", text: "Execute Fibonacci sequence computation." },
    ],
    xpReward: 615,
    coinsReward: 305,
    worldSceneType: "core_reactor",
  },
  {
    id: "m105",
    rank: "ENGINEER",
    number: 105,
    title: "Type Annotations & Hints",
    concept: "Type Hints (x: int) -> int",
    difficulty: "Advanced",
    story: "Add Python type annotations to calculate_voltage function.",
    objectives: [
      "Define calculate_voltage(current: float, resistance: float) -> float",
      "Print calculate_voltage(2.5, 4.0)",
    ],
    conceptExplanation: "Type hints document expected parameter and return types for static type analysis.",
    starterCode: `def calculate_voltage(current: float, resistance: float) -> float:
    return current * resistance

print(calculate_voltage(2.5, 4.0))
`,
    validationRules: {
      requiredKeywords: ["current: float", "resistance: float) -> float:", "print"],
      requiredOutputIncludes: ["10.0"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use type hints: current: float, resistance: float." },
      { level: 2, label: "Concept", text: "2.5 * 4.0 = 10.0" },
      { level: 3, label: "Example", text: "def calculate_voltage(current: float, resistance: float) -> float:\n    return current * resistance" },
      { level: 4, label: "Solution", text: "Execute type-annotated function." },
    ],
    xpReward: 620,
    coinsReward: 310,
    worldSceneType: "core_reactor",
  },
  {
    id: "m106",
    rank: "ENGINEER",
    number: 106,
    title: "Keyword-Only Arguments (*)",
    concept: "Keyword-Only Parameters (*, key=val)",
    difficulty: "Advanced",
    story: "Enforce keyword-only argument passing for safety-critical shield activations.",
    objectives: [
      "Define activate_shield(*, level: int)",
      "Call activate_shield(level=100)",
      "Print result",
    ],
    conceptExplanation: "A bare '*' in a function parameter list forces all following parameters to be passed by keyword.",
    starterCode: `def activate_shield(*, level: int):
    return f"SHIELD ENGAGED AT {level}%"

status = activate_shield(level=100)
print(status)
`,
    validationRules: {
      requiredKeywords: ["def activate_shield(*, level: int):", "level=100", "print"],
      requiredOutputIncludes: ["SHIELD ENGAGED AT 100%"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use *, level: int in def line." },
      { level: 2, label: "Concept", text: "Requires calling with level=100." },
      { level: 3, label: "Example", text: "status = activate_shield(level=100)\nprint(status)" },
      { level: 4, label: "Solution", text: "Execute keyword-only function." },
    ],
    xpReward: 625,
    coinsReward: 310,
    worldSceneType: "core_reactor",
  },
  {
    id: "m107",
    rank: "ENGINEER",
    number: 107,
    title: "Quick Sort Algorithm Implementation",
    concept: "Divide-and-Conquer Sorting",
    difficulty: "Advanced",
    story: "Sort race sector times using a clean recursive Quick Sort implementation.",
    objectives: [
      "Define quicksort(arr)",
      "Sort [60, 20, 80, 10, 50]",
      "Print sorted list",
    ],
    conceptExplanation: "Quick sort partitions an array around a pivot and recursively sorts sub-arrays.",
    starterCode: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

data = [60, 20, 80, 10, 50]
print(quicksort(data))
`,
    validationRules: {
      requiredKeywords: ["def quicksort", "quicksort(left) + middle + quicksort(right)", "print"],
      requiredOutputIncludes: ["[10, 20, 50, 60, 80]"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use quicksort recursion." },
      { level: 2, label: "Concept", text: "Sorts array in O(N log N) average time." },
      { level: 3, label: "Example", text: "print(quicksort(data))" },
      { level: 4, label: "Solution", text: "Execute quicksort." },
    ],
    xpReward: 630,
    coinsReward: 315,
    worldSceneType: "core_reactor",
  },
  {
    id: "m108",
    rank: "ENGINEER",
    number: 108,
    title: "Engineer Rank Capstone: Algorithm Core Reactor",
    concept: "Engineer Mastery Synthesis",
    difficulty: "Advanced",
    story: "Engineer the core reactor balancing function combining closures, decorators, *args, and binary search.",
    objectives: [
      "Calibrate core output across all 4 energy channels",
      "Print 'ALGORITHM REACTOR STABILIZED: ENGINEER MASTERY ACHIEVED'",
    ],
    conceptExplanation: "You have mastered Python functions, parameters, recursion, closures, decorators, and algorithms!",
    starterCode: `def balance_reactor(*channels):
    return sum(channels) / len(channels)

avg_core = balance_reactor(100, 100, 100, 100)
print(f"AVERAGE CORE: {avg_core}")
print("ALGORITHM REACTOR STABILIZED: ENGINEER MASTERY ACHIEVED")
`,
    validationRules: {
      requiredKeywords: ["def balance_reactor(*channels):", "sum(channels) / len(channels)", "print"],
      requiredOutputIncludes: ["AVERAGE CORE: 100.0", "ALGORITHM REACTOR STABILIZED: ENGINEER MASTERY ACHIEVED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Calculate average across channels." },
      { level: 2, label: "Concept", text: "Demonstrates full mastery of functions and aggregation." },
      { level: 3, label: "Example", text: 'print("ALGORITHM REACTOR STABILIZED: ENGINEER MASTERY ACHIEVED")' },
      { level: 4, label: "Solution", text: "Execute Engineer Capstone script." },
    ],
    xpReward: 650,
    coinsReward: 325,
    skillIdToUnlock: "py_engineer_mastery",
    worldSceneType: "core_reactor",
  },
];
