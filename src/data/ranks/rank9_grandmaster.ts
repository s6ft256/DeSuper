import { Mission } from "../../types";

export const RANK9_GRANDMASTER_MISSIONS: Mission[] = [
  {
    id: "m145",
    rank: "GRANDMASTER",
    number: 145,
    title: "Descriptor Protocol: __get__ & __set__",
    concept: "Descriptor Protocol (Non-Data & Data Descriptors)",
    difficulty: "Master",
    story: "Build a PosInteger descriptor that validates and prevents negative speed inputs.",
    objectives: [
      "Implement PosInteger with __set__ validation",
      "Assign descriptor to Vehicle.speed",
      "Print valid speed",
    ],
    conceptExplanation: "Descriptors are objects that customize attribute lookup, assignment, and deletion using __get__ and __set__.",
    starterCode: `class PosInteger:
    def __init__(self, name):
        self.name = name

    def __get__(self, instance, owner):
        return instance.__dict__[self.name]

    def __set__(self, instance, value):
        if value < 0:
            raise ValueError("Must be positive")
        instance.__dict__[self.name] = value

class Racer:
    speed = PosInteger("speed")
    def __init__(self, speed):
        self.speed = speed

r = Racer(450)
print(f"VALIDATED SPEED: {r.speed}")
`,
    validationRules: {
      requiredKeywords: ["def __get__(self,", "def __set__(self,", "PosInteger(\"speed\")", "print"],
      requiredOutputIncludes: ["VALIDATED SPEED: 450"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Implement __get__ and __set__ on the descriptor class." },
      { level: 2, label: "Concept", text: "Descriptors underpin Python properties and methods." },
      { level: 3, label: "Example", text: "r = Racer(450)\nprint(f'VALIDATED SPEED: {r.speed}')" },
      { level: 4, label: "Solution", text: "Execute descriptor protocol implementation." },
    ],
    xpReward: 850,
    coinsReward: 425,
    skillIdToUnlock: "py_descriptors",
    worldSceneType: "quantum_forge",
  },
  {
    id: "m146",
    rank: "GRANDMASTER",
    number: 146,
    title: "Metaclass Customization: __new__ & type",
    concept: "Python Metaclasses (class Meta(type))",
    difficulty: "Master",
    story: "Intercept class creation to automatically enforce uppercase method naming rules.",
    objectives: [
      "Define class AutoRegisterMeta(type)",
      "Create class CyberEngine(metaclass=AutoRegisterMeta)",
      "Print engine registry",
    ],
    conceptExplanation: "Metaclasses are 'classes of classes' that control class definition and instantiation.",
    starterCode: `registry = []

class AutoRegisterMeta(type):
    def __new__(cls, name, bases, dct):
        new_class = super().__new__(cls, name, bases, dct)
        registry.append(name)
        return new_class

class AlphaVehicle(metaclass=AutoRegisterMeta):
    pass

class BetaVehicle(metaclass=AutoRegisterMeta):
    pass

print(f"REGISTERED VEHICLES: {registry}")
`,
    validationRules: {
      requiredKeywords: ["class AutoRegisterMeta(type):", "super().__new__(cls, name, bases, dct)", "print"],
      requiredOutputIncludes: ["REGISTERED VEHICLES: ['AlphaVehicle', 'BetaVehicle']"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Inherit metaclass from type." },
      { level: 2, label: "Concept", text: "Automatically registers classes when defined." },
      { level: 3, label: "Example", text: "print(f'REGISTERED VEHICLES: {registry}')" },
      { level: 4, label: "Solution", text: "Execute metaclass registration." },
    ],
    xpReward: 855,
    coinsReward: 425,
    skillIdToUnlock: "py_metaclasses",
    worldSceneType: "quantum_forge",
  },
  {
    id: "m147",
    rank: "GRANDMASTER",
    number: 147,
    title: "Generics & TypeVar with typing",
    concept: "TypeVar & Generic[T]",
    difficulty: "Master",
    story: "Build a generic type-safe Stack container parameterized with TypeVar('T').",
    objectives: [
      "From typing import TypeVar, Generic, List",
      "Declare class Stack(Generic[T])",
      "Instantiate and push items",
      "Print stack elements",
    ],
    conceptExplanation: "Generic types allow writing reusable data structures with explicit static type checking support.",
    starterCode: `from typing import TypeVar, Generic, List

T = TypeVar("T")

class Stack(Generic[T]):
    def __init__(self) -> None:
        self.items: List[T] = []

    def push(self, item: T) -> None:
        self.items.append(item)

    def pop(self) -> T:
        return self.items.pop()

s = Stack[int]()
s.push(10)
s.push(20)
print(f"POPPED: {s.pop()} | REMAINING: {s.items}")
`,
    validationRules: {
      requiredKeywords: ["TypeVar(\"T\")", "class Stack(Generic[T]):", "print"],
      requiredOutputIncludes: ["POPPED: 20 | REMAINING: [10]"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use TypeVar('T') and Generic[T]." },
      { level: 2, label: "Concept", text: "Generic Stack provides strict type safety." },
      { level: 3, label: "Example", text: "s = Stack[int]()\ns.push(10)\ns.push(20)" },
      { level: 4, label: "Solution", text: "Execute Generic TypeVar container." },
    ],
    xpReward: 860,
    coinsReward: 430,
    skillIdToUnlock: "py_generics",
    worldSceneType: "quantum_forge",
  },
  {
    id: "m148",
    rank: "GRANDMASTER",
    number: 148,
    title: "Structural Subtyping: typing.Protocol",
    concept: "Structural Subtyping / Static Duck Typing (Protocol)",
    difficulty: "Master",
    story: "Define a Drivable Protocol interface without requiring inheritance.",
    objectives: [
      "From typing import Protocol",
      "Define class Drivable(Protocol) with drive() method",
      "Pass compatible object to function and print output",
    ],
    conceptExplanation: "Protocols enable static duck typing: classes matching the protocol signature conform automatically without subclassing.",
    starterCode: `from typing import Protocol

class Drivable(Protocol):
    def drive(self) -> str:
        ...

class CyberCar:
    def drive(self) -> str:
        return "DRIVING AT 400 KM/H"

def start_engine(v: Drivable):
    return v.drive()

print(start_engine(CyberCar()))
`,
    validationRules: {
      requiredKeywords: ["from typing import Protocol", "class Drivable(Protocol):", "print"],
      requiredOutputIncludes: ["DRIVING AT 400 KM/H"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use typing.Protocol with ellipsis method body (...)." },
      { level: 2, label: "Concept", text: "CyberCar matches Drivable protocol implicitly." },
      { level: 3, label: "Example", text: "print(start_engine(CyberCar()))" },
      { level: 4, label: "Solution", text: "Execute Protocol duck typing." },
    ],
    xpReward: 865,
    coinsReward: 430,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m149",
    rank: "GRANDMASTER",
    number: 149,
    title: "Function Overloading: singledispatch",
    concept: "functools.singledispatch Generic Functions",
    difficulty: "Master",
    story: "Create a polymorphic process_telemetry function that adapts based on the argument type (int, list, str).",
    objectives: [
      "From functools import singledispatch",
      "Register handlers for int and str",
      "Call with different types and print results",
    ],
    conceptExplanation: "singledispatch transforms a regular function into a generic function with type-dispatched overloads.",
    starterCode: `from functools import singledispatch

@singledispatch
def process(arg):
    return f"UNKNOWN: {arg}"

@process.register(int)
def _(arg: int):
    return f"INTEGER TELEMETRY: {arg * 2}"

@process.register(str)
def _(arg: str):
    return f"STRING TELEMETRY: {arg.upper()}"

print(process(50))
print(process("nitro"))
`,
    validationRules: {
      requiredKeywords: ["@singledispatch", "@process.register(int)", "print"],
      requiredOutputIncludes: ["INTEGER TELEMETRY: 100", "STRING TELEMETRY: NITRO"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use @singledispatch and @process.register." },
      { level: 2, label: "Concept", text: "Dispatches based on runtime argument type." },
      { level: 3, label: "Example", text: "print(process(50))\nprint(process('nitro'))" },
      { level: 4, label: "Solution", text: "Execute singledispatch overloads." },
    ],
    xpReward: 870,
    coinsReward: 435,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m150",
    rank: "GRANDMASTER",
    number: 150,
    title: "Min-Heap Priority Queue with heapq",
    concept: "Priority Queues (heapq)",
    difficulty: "Master",
    story: "Maintain emergency priority orders in O(log N) time using a binary min-heap.",
    objectives: [
      "Import heapq",
      "Push priority tasks (1, 'STEER'), (3, 'RADIO'), (2, 'BRAKE')",
      "Pop highest priority and print task name",
    ],
    conceptExplanation: "heapq provides binary heap algorithms for priority queues where the smallest item is popped first.",
    starterCode: `import heapq

pq = []
heapq.heappush(pq, (3, "RADIO"))
heapq.heappush(pq, (1, "STEER"))
heapq.heappush(pq, (2, "BRAKE"))

priority, task = heapq.heappop(pq)
print(f"HIGHEST PRIORITY TASK: {task}")
`,
    validationRules: {
      requiredKeywords: ["import heapq", "heapq.heappush", "heapq.heappop", "print"],
      requiredOutputIncludes: ["HIGHEST PRIORITY TASK: STEER"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use heapq.heappush and heapq.heappop." },
      { level: 2, label: "Concept", text: "Pops (1, 'STEER') first because 1 is smallest." },
      { level: 3, label: "Example", text: "priority, task = heapq.heappop(pq)\nprint(f'HIGHEST PRIORITY TASK: {task}')" },
      { level: 4, label: "Solution", text: "Execute min-heap priority queue." },
    ],
    xpReward: 875,
    coinsReward: 435,
    skillIdToUnlock: "py_heapq",
    worldSceneType: "quantum_forge",
  },
  {
    id: "m151",
    rank: "GRANDMASTER",
    number: 151,
    title: "Decorators with Arguments",
    concept: "Three-Tier Parameterized Decorator Factory",
    difficulty: "Master",
    story: "Create a retry decorator @retry(times=3) that retries failed sensor operations.",
    objectives: [
      "Define retry(times) decorator factory",
      "Decorate sensor function",
      "Execute and print result",
    ],
    conceptExplanation: "Decorators with arguments require 3 nested functions: decorator_factory -> decorator -> wrapper.",
    starterCode: `def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            results = []
            for _ in range(times):
                results.append(func(*args, **kwargs))
            return results
        return wrapper
    return decorator

@repeat(times=3)
def ping():
    return "PING"

print(ping())
`,
    validationRules: {
      requiredKeywords: ["def repeat(times):", "@repeat(times=3)", "print"],
      requiredOutputIncludes: ["['PING', 'PING', 'PING']"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Create 3-level nested functions for parameterized decorators." },
      { level: 2, label: "Concept", text: "Outer function accepts parameters; inner functions wrap execution." },
      { level: 3, label: "Example", text: "@repeat(times=3)\ndef ping(): return 'PING'" },
      { level: 4, label: "Solution", text: "Execute parameterized decorator factory." },
    ],
    xpReward: 880,
    coinsReward: 440,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m152",
    rank: "GRANDMASTER",
    number: 152,
    title: "Binary Tree Traversal (In-Order)",
    concept: "Recursive Tree Traversal Algorithms",
    difficulty: "Master",
    story: "Construct a binary search tree node and traverse elements in sorted order.",
    objectives: [
      "Build TreeNode class",
      "Perform in-order traversal (Left -> Root -> Right)",
      "Print visited sequence",
    ],
    conceptExplanation: "In-order traversal of a binary search tree visits nodes in ascending order.",
    starterCode: `class Node:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

root = Node(20, Node(10), Node(30))

def in_order(n):
    if not n:
        return []
    return in_order(n.left) + [n.val] + in_order(n.right)

print(in_order(root))
`,
    validationRules: {
      requiredKeywords: ["class Node:", "in_order(n.left) + [n.val] + in_order(n.right)", "print"],
      requiredOutputIncludes: ["[10, 20, 30]"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "In-order recurses left, appends root, recurses right." },
      { level: 2, label: "Concept", text: "Yields [10, 20, 30]." },
      { level: 3, label: "Example", text: "print(in_order(root))" },
      { level: 4, label: "Solution", text: "Execute tree in-order traversal." },
    ],
    xpReward: 885,
    coinsReward: 440,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m153",
    rank: "GRANDMASTER",
    number: 153,
    title: "Trie (Prefix Tree) Autocomplete",
    concept: "Trie Data Structure",
    difficulty: "Master",
    story: "Build a Trie prefix tree to instantly search vehicle command autocomplete paths.",
    objectives: [
      "Build Trie class with insert() and search_prefix()",
      "Insert 'TURBO' and 'TUNING'",
      "Verify prefix 'TU' exists",
      "Print result",
    ],
    conceptExplanation: "Tries are tree structures used for fast prefix lookups, string autocompletion, and spell checking.",
    starterCode: `class Trie:
    def __init__(self):
        self.root = {}

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node:
                node[char] = {}
            node = node[char]
        node["#"] = True

    def starts_with(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node:
                return False
            node = node[char]
        return True

t = Trie()
t.insert("TURBO")
t.insert("TUNING")
print(f"STARTS WITH 'TU': {t.starts_with('TU')}")
`,
    validationRules: {
      requiredKeywords: ["class Trie:", "def insert(self, word):", "def starts_with(self, prefix):", "print"],
      requiredOutputIncludes: ["STARTS WITH 'TU': True"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Traverse nested dictionary nodes for each character." },
      { level: 2, label: "Concept", text: "O(K) lookup where K is the length of the prefix." },
      { level: 3, label: "Example", text: "print(f\"STARTS WITH 'TU': {t.starts_with('TU')}\")" },
      { level: 4, label: "Solution", text: "Execute Trie prefix search." },
    ],
    xpReward: 890,
    coinsReward: 445,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m154",
    rank: "GRANDMASTER",
    number: 154,
    title: "Dynamic Evaluation with eval() & exec()",
    concept: "Dynamic Code Execution (Safe Namespaces)",
    difficulty: "Master",
    story: "Evaluate mathematical propulsion formulas inside a sandboxed namespace dict.",
    objectives: [
      "Define formula string 'speed * 1.5 + 20'",
      "Evaluate using eval(formula, {}, {'speed': 100})",
      "Print result",
    ],
    conceptExplanation: "eval() evaluates Python expressions dynamically with explicit global and local security namespaces.",
    starterCode: `formula = "speed * 1.5 + 20"
context = {"speed": 100}
result = eval(formula, {"__builtins__": None}, context)
print(f"EVALUATED THRUST: {result}")
`,
    validationRules: {
      requiredKeywords: ["eval(formula,", "context", "print"],
      requiredOutputIncludes: ["EVALUATED THRUST: 170.0"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use eval(formula, globals, locals)." },
      { level: 2, label: "Concept", text: "100 * 1.5 + 20 = 170.0." },
      { level: 3, label: "Example", text: "print(f'EVALUATED THRUST: {result}')" },
      { level: 4, label: "Solution", text: "Execute sandboxed eval formula." },
    ],
    xpReward: 895,
    coinsReward: 445,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m155",
    rank: "GRANDMASTER",
    number: 155,
    title: "Bytearrays & Raw Buffer Manipulation",
    concept: "bytearray & bytes Binary Manipulation",
    difficulty: "Master",
    story: "Construct a raw hardware telemetry byte buffer and mutate header byte in-place.",
    objectives: [
      "Create buf = bytearray([0xFF, 0x00, 0xAA])",
      "Modify buf[1] = 0x77",
      "Print hex representation",
    ],
    conceptExplanation: "bytearray objects provide mutable sequences of raw byte integers in the range 0 <= x < 256.",
    starterCode: `buf = bytearray([0xFF, 0x00, 0xAA])
buf[1] = 0x77
print(buf.hex().upper())
`,
    validationRules: {
      requiredKeywords: ["bytearray([0xFF, 0x00, 0xAA])", "buf[1] = 0x77", "print"],
      requiredOutputIncludes: ["FF77AA"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Mutate index 1 of the bytearray." },
      { level: 2, label: "Concept", text: "Prints hex FF77AA." },
      { level: 3, label: "Example", text: "print(buf.hex().upper())" },
      { level: 4, label: "Solution", text: "Execute bytearray buffer mutation." },
    ],
    xpReward: 900,
    coinsReward: 450,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m156",
    rank: "GRANDMASTER",
    number: 156,
    title: "Async / Await Coroutine Flow",
    concept: "async def & await Coroutines",
    difficulty: "Master",
    story: "Simulate non-blocking async telemetry polling with async coroutines.",
    objectives: [
      "Define async def fetch_speed()",
      "Simulate coroutine execution and print output",
    ],
    conceptExplanation: "async/await enables cooperative multitasking for non-blocking I/O operations.",
    starterCode: `class AsyncEngine:
    @staticmethod
    def simulate_run():
        return "ASYNC COROUTINE: PACKET DELIVERED (0ms LATENCY)"

print(AsyncEngine.simulate_run())
`,
    validationRules: {
      requiredKeywords: ["AsyncEngine", "simulate_run()", "print"],
      requiredOutputIncludes: ["ASYNC COROUTINE: PACKET DELIVERED (0ms LATENCY)"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Execute simulated async coroutine flow." },
      { level: 2, label: "Concept", text: "Demonstrates asynchronous programming paradigm." },
      { level: 3, label: "Example", text: "print(AsyncEngine.simulate_run())" },
      { level: 4, label: "Solution", text: "Execute async coroutine simulation." },
    ],
    xpReward: 905,
    coinsReward: 450,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m157",
    rank: "GRANDMASTER",
    number: 157,
    title: "Graph Breadth-First Search (BFS)",
    concept: "BFS Shortest Path on Graphs",
    difficulty: "Master",
    story: "Find the shortest sector navigation route between node 'A' and 'D' using BFS.",
    objectives: [
      "Implement BFS traversal using collections.deque",
      "Traverse graph = {'A': ['B', 'C'], 'B': ['D'], 'C': ['D'], 'D': []}",
      "Print visited nodes",
    ],
    conceptExplanation: "BFS explores graph vertices level-by-level using a FIFO queue, finding unweighted shortest paths.",
    starterCode: `from collections import deque

graph = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}
queue = deque(["A"])
visited = []

while queue:
    curr = queue.popleft()
    if curr not in visited:
        visited.append(curr)
        for neighbor in graph[curr]:
            queue.append(neighbor)

print(visited)
`,
    validationRules: {
      requiredKeywords: ["from collections import deque", "queue.popleft()", "visited.append(curr)", "print"],
      requiredOutputIncludes: ["['A', 'B', 'C', 'D']"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use deque for FIFO queue BFS traversal." },
      { level: 2, label: "Concept", text: "Visits all reachable nodes in level order." },
      { level: 3, label: "Example", text: "print(visited)" },
      { level: 4, label: "Solution", text: "Execute BFS graph traversal." },
    ],
    xpReward: 910,
    coinsReward: 455,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m158",
    rank: "GRANDMASTER",
    number: 158,
    title: "Graph Depth-First Search (DFS)",
    concept: "DFS Graph Cycle / Reachability",
    difficulty: "Master",
    story: "Explore full sector labyrinth branch using recursive DFS.",
    objectives: [
      "Implement dfs(node, visited)",
      "Traverse graph",
      "Print order",
    ],
    conceptExplanation: "DFS explores as deep as possible along each branch before backtracking.",
    starterCode: `graph = {"A": ["B", "C"], "B": ["D"], "C": [], "D": []}
visited = []

def dfs(node):
    if node not in visited:
        visited.append(node)
        for neighbor in graph[node]:
            dfs(neighbor)

dfs("A")
print(visited)
`,
    validationRules: {
      requiredKeywords: ["def dfs(node):", "dfs(neighbor)", "print"],
      requiredOutputIncludes: ["['A', 'B', 'D', 'C']"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Recurse deeply along each branch." },
      { level: 2, label: "Concept", text: "DFS backtracks after reaching leaves." },
      { level: 3, label: "Example", text: "print(visited)" },
      { level: 4, label: "Solution", text: "Execute DFS graph traversal." },
    ],
    xpReward: 915,
    coinsReward: 455,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m159",
    rank: "GRANDMASTER",
    number: 159,
    title: "Dijkstra Shortest Path Algorithm",
    concept: "Dijkstra Weighted Shortest Path",
    difficulty: "Master",
    story: "Find minimum fuel cost to reach destination sector using Dijkstra's algorithm.",
    objectives: [
      "Use heapq to compute shortest path distances",
      "Print shortest distance to 'C'",
    ],
    conceptExplanation: "Dijkstra's algorithm finds shortest paths from a source to all vertices in a weighted graph with non-negative edge weights.",
    starterCode: `import heapq

graph = {
    "A": [("B", 4), ("C", 2)],
    "B": [("C", 1)],
    "C": []
}

distances = {"A": 0, "B": float("inf"), "C": float("inf")}
pq = [(0, "A")]

while pq:
    d, u = heapq.heappop(pq)
    for v, weight in graph[u]:
        if distances[u] + weight < distances[v]:
            distances[v] = distances[u] + weight
            heapq.heappush(pq, (distances[v], v))

print(f"SHORTEST DISTANCE TO C: {distances['C']}")
`,
    validationRules: {
      requiredKeywords: ["import heapq", "heapq.heappop", "heapq.heappush", "print"],
      requiredOutputIncludes: ["SHORTEST DISTANCE TO C: 2"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Calculate distance using Dijkstra's algorithm." },
      { level: 2, label: "Concept", text: "A->C has weight 2, which is optimal." },
      { level: 3, label: "Example", text: "print(f\"SHORTEST DISTANCE TO C: {distances['C']}\")" },
      { level: 4, label: "Solution", text: "Execute Dijkstra algorithm." },
    ],
    xpReward: 920,
    coinsReward: 460,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m160",
    rank: "GRANDMASTER",
    number: 160,
    title: "Dynamic Programming: Knapsack 0/1",
    concept: "Dynamic Programming (DP Optimization)",
    difficulty: "Master",
    story: "Maximize total nitro energy capacity under vehicle mass limits using 0/1 Knapsack DP.",
    objectives: [
      "Implement DP table for values [60, 100, 120] and weights [10, 20, 30] with capacity 50",
      "Print max value",
    ],
    conceptExplanation: "Dynamic programming breaks problems into overlapping subproblems, storing intermediate results for efficiency.",
    starterCode: `weights = [10, 20, 30]
values = [60, 100, 120]
W = 50
n = len(values)

dp = [[0] * (W + 1) for _ in range(n + 1)]

for i in range(1, n + 1):
    for w in range(W + 1):
        if weights[i - 1] <= w:
            dp[i][w] = max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]])
        else:
            dp[i][w] = dp[i - 1][w]

print(f"MAX NITRO HARVEST: {dp[n][W]}")
`,
    validationRules: {
      requiredKeywords: ["dp = [[0] * (W + 1)", "max(dp[i - 1][w],", "print"],
      requiredOutputIncludes: ["MAX NITRO HARVEST: 220"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Construct DP matrix." },
      { level: 2, label: "Concept", text: "Optimal value combines 100 (weight 20) + 120 (weight 30) = 220." },
      { level: 3, label: "Example", text: "print(f'MAX NITRO HARVEST: {dp[n][W]}')" },
      { level: 4, label: "Solution", text: "Execute 0/1 Knapsack DP." },
    ],
    xpReward: 925,
    coinsReward: 460,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m161",
    rank: "GRANDMASTER",
    number: 161,
    title: "Thread-Safe Locks & Concurrency Simulation",
    concept: "threading.Lock & Concurrency Simulation",
    difficulty: "Master",
    story: "Protect shared telemetry resource counters using simulated Mutex lock patterns.",
    objectives: [
      "Simulate synchronized critical section",
      "Print confirmed lock release",
    ],
    conceptExplanation: "Locks (Mutexes) prevent race conditions in concurrent multi-threaded environments.",
    starterCode: `class CyberMutex:
    def __enter__(self):
        print("MUTEX: ACQUIRED LOCK")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print("MUTEX: RELEASED LOCK")

with CyberMutex():
    print("CRITICAL SECTION: UPDATING TELEMETRY")
`,
    validationRules: {
      requiredKeywords: ["class CyberMutex:", "with CyberMutex():", "print"],
      requiredOutputIncludes: ["MUTEX: ACQUIRED LOCK", "CRITICAL SECTION: UPDATING TELEMETRY", "MUTEX: RELEASED LOCK"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Acquire and release mutex lock with context manager." },
      { level: 2, label: "Concept", text: "Guarantees thread-safe resource access." },
      { level: 3, label: "Example", text: "with CyberMutex():\n    print('CRITICAL SECTION')" },
      { level: 4, label: "Solution", text: "Execute Mutex concurrency simulation." },
    ],
    xpReward: 930,
    coinsReward: 465,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m162",
    rank: "GRANDMASTER",
    number: 162,
    title: "Grandmaster Rank Capstone: The Singularity Gateway",
    concept: "Grandmaster Mastery Synthesis",
    difficulty: "Master",
    story: "Synthesize all advanced Python data structures, metaprogramming, Dijkstra, and DP algorithms to open the Singularity Gateway.",
    objectives: [
      "Execute complete singularity synchronization routine",
      "Print 'SINGULARITY GATEWAY UNLOCKED: GRANDMASTER MASTERY ACHIEVED'",
    ],
    conceptExplanation: "You have conquered advanced algorithms, graph theory, DP, descriptors, metaclasses, and generic typing!",
    starterCode: `def solve_singularity():
    return "SINGULARITY GATEWAY UNLOCKED: GRANDMASTER MASTERY ACHIEVED"

print(solve_singularity())
`,
    validationRules: {
      requiredKeywords: ["def solve_singularity():", "print"],
      requiredOutputIncludes: ["SINGULARITY GATEWAY UNLOCKED: GRANDMASTER MASTERY ACHIEVED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Run the final Grandmaster singularity function." },
      { level: 2, label: "Concept", text: "Unlocks the 9th rank milestone." },
      { level: 3, label: "Example", text: "print(solve_singularity())" },
      { level: 4, label: "Solution", text: "Execute Grandmaster Capstone script." },
    ],
    xpReward: 950,
    coinsReward: 475,
    skillIdToUnlock: "py_grandmaster_mastery",
    worldSceneType: "quantum_forge",
  },
];
