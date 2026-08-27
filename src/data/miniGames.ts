import { MiniGameQuestion, DailyQuest } from "../types";

export const MINI_GAME_QUESTIONS: MiniGameQuestion[] = [
  // Bug Hunter
  {
    id: "bg_1",
    title: "Bug Hunter: Missing Colon",
    question: "Identify the line with the syntax bug in this condition statement:",
    codeSnippet: `1: power = 100
2: if power > 50
3:     print("Optimal")`,
    options: ["Line 1", "Line 2: Missing ':' after 'power > 50'", "Line 3", "No bug"],
    correctIndex: 1,
    explanation: "In Python, compound statement headers like 'if', 'for', 'while', 'def', and 'class' must end with a colon (:).",
    type: "bug_hunter",
  },
  {
    id: "bg_2",
    title: "Bug Hunter: Type Concatenation Error",
    question: "What error will this Python code produce when executed?",
    codeSnippet: `energy = 100
print("Level: " + energy)`,
    options: [
      "SyntaxError",
      "TypeError: can only concatenate str (not 'int') to str",
      "NameError",
      "Outputs 'Level: 100'",
    ],
    correctIndex: 1,
    explanation: "Python is strongly typed and will not automatically concatenate an integer with a string using '+'. Use str(energy) or f'Level: {energy}'.",
    type: "bug_hunter",
  },
  {
    id: "bg_3",
    title: "Bug Hunter: Off-By-One Range",
    question: "How many times will this loop execute?",
    codeSnippet: `for i in range(1, 5):
    print(i)`,
    options: ["5 times (1, 2, 3, 4, 5)", "4 times (1, 2, 3, 4)", "6 times", "0 times"],
    correctIndex: 1,
    explanation: "range(start, end) is exclusive of the end value. range(1, 5) yields 1, 2, 3, and 4 (4 iterations).",
    type: "bug_hunter",
  },

  // Code Runner
  {
    id: "cr_1",
    title: "Code Runner: List Slicing",
    question: "What is the output of values[1:3]?",
    codeSnippet: `values = ['ALPHA', 'BETA', 'GAMMA', 'DELTA']
print(values[1:3])`,
    options: ["['ALPHA', 'BETA']", "['BETA', 'GAMMA']", "['BETA', 'GAMMA', 'DELTA']", "['GAMMA']"],
    correctIndex: 1,
    explanation: "Index 1 is 'BETA' and index 2 is 'GAMMA'. Index 3 ('DELTA') is excluded.",
    type: "code_runner",
  },
  {
    id: "cr_2",
    title: "Code Runner: Dict Key Lookup",
    question: "What value is returned by bot.get('energy', 0)?",
    codeSnippet: `bot = {'name': 'Nexus', 'level': 4}
print(bot.get('energy', 0))`,
    options: ["0 (default fallback value)", "None", "KeyError", "4"],
    correctIndex: 0,
    explanation: ".get(key, default) safely returns the default value if the key does not exist in the dictionary.",
    type: "code_runner",
  },

  // Algorithm Arena
  {
    id: "aa_1",
    title: "Algorithm Arena: Time Complexity",
    question: "What is the time complexity of searching a sorted list of N elements using Binary Search?",
    codeSnippet: `# Binary Search dividing search interval in half each step
while left <= right:
    mid = (left + right) // 2`,
    options: ["O(1) Constant", "O(log N) Logarithmic", "O(N) Linear", "O(N^2) Quadratic"],
    correctIndex: 1,
    explanation: "Binary search cuts the remaining search space in half with each comparison, achieving O(log N) efficiency.",
    type: "algo_arena",
  },
  {
    id: "aa_2",
    title: "Algorithm Arena: Hash Map Lookup",
    question: "What is the average time complexity of looking up a value by key in a Python dictionary?",
    codeSnippet: `db = {'id_842': 'ACTIVE_SECTOR'}
status = db['id_842']`,
    options: ["O(1) Constant", "O(N) Linear", "O(log N)", "O(N log N)"],
    correctIndex: 0,
    explanation: "Python dictionaries use hash tables under the hood, delivering O(1) average constant-time lookups.",
    type: "algo_arena",
  },

  // Security Lab
  {
    id: "sl_1",
    title: "Security Lab: Input Sanitization",
    question: "Why should untrusted user input never be executed with eval() in Python?",
    codeSnippet: `# DANGEROUS EXECUTION
user_data = input()
eval(user_data)`,
    options: [
      "eval() only works on floats",
      "eval() executes arbitrary code and allows remote command injection",
      "eval() is slower than int()",
      "eval() is deprecated in Python 3",
    ],
    correctIndex: 1,
    explanation: "eval() executes any string passed to it as live Python code. Malicious users could execute system commands or compromise security.",
    type: "security_lab",
  },
  // Additional Bug Hunter Questions
  {
    id: "bg_4",
    title: "Bug Hunter: Indentation Error",
    question: "What type of error does this code produce?",
    codeSnippet: `x = 10
if x > 5
    print("Big")`,
    options: ["IndentationError", "SyntaxError", "NameError", "No error"],
    correctIndex: 1,
    explanation: "The 'if' statement is missing a colon at the end, which is a SyntaxError, not an IndentationError.",
    type: "bug_hunter",
  },
  {
    id: "bg_5",
    title: "Bug Hunter: Mutable Default Argument",
    question: "What is the potential bug in this function definition?",
    codeSnippet: `def add_item(item, items=[]):
    items.append(item)
    return items`,
    options: [
      "No bug",
      "Default mutable argument is shared across calls",
      "Missing return type",
      "items should be a tuple",
    ],
    correctIndex: 1,
    explanation: "Mutable default arguments (like lists) are created once and shared across all function calls, leading to unexpected behavior.",
    type: "bug_hunter",
  },
  {
    id: "bg_6",
    title: "Bug Hunter: Variable Scope",
    question: "What happens when this code runs?",
    codeSnippet: `count = 0
def increment():
    count += 1
increment()`,
    options: [
      "count becomes 1",
      "UnboundLocalError",
      "SyntaxError",
      "count stays 0",
    ],
    correctIndex: 1,
    explanation: "Python treats 'count' as local because of the assignment, but it's not defined locally, causing UnboundLocalError.",
    type: "bug_hunter",
  },
  {
    id: "bg_7",
    title: "Bug Hunter: String Immutability",
    question: "What is the output of this code?",
    codeSnippet: `text = "hello"
text[0] = "H"
print(text)`,
    options: ["hello", "Hello", "TypeError", "H"],
    correctIndex: 2,
    explanation: "Strings are immutable in Python. You cannot assign to individual characters, which raises TypeError.",
    type: "bug_hunter",
  },
  {
    id: "bg_8",
    title: "Bug Hunter: Integer Division",
    question: "What is the result of 7 / 2 in Python 3?",
    codeSnippet: `result = 7 / 2
print(result)`,
    options: ["3", "3.5", "3.0", "Error"],
    correctIndex: 1,
    explanation: "In Python 3, the / operator always performs true division and returns a float, so 7 / 2 = 3.5.",
    type: "bug_hunter",
  },
  {
    id: "bg_9",
    title: "Bug Hunter: None Comparison",
    question: "What is the correct way to check if a variable is None?",
    codeSnippet: `value = None
# Which check is correct?`,
    options: [
      "value == None",
      "value is None",
      "value = None",
      "value equals None",
    ],
    correctIndex: 1,
    explanation: "PEP 8 recommends using 'is' for comparisons with None because None is a singleton object in Python.",
    type: "bug_hunter",
  },
  {
    id: "bg_10",
    title: "Bug Hunter: List Reference",
    question: "What is the output of this code?",
    codeSnippet: `a = [1, 2, 3]
b = a
b.append(4)
print(a)`,
    options: [
      "[1, 2, 3]",
      "[1, 2, 3, 4]",
      "[4, 3, 2, 1]",
      "Error",
    ],
    correctIndex: 1,
    explanation: "Assignment 'b = a' creates a reference to the same list. Modifying b also modifies a because they point to the same object.",
    type: "bug_hunter",
  },
  // Additional Code Runner Questions
  {
    id: "cr_3",
    title: "Code Runner: List Comprehension",
    question: "What is the output of this list comprehension?",
    codeSnippet: `result = [x**2 for x in range(4)]
print(result)`,
    options: ["[0, 1, 4, 9]", "[1, 4, 9, 16]", "[0, 2, 4, 6]", "[1, 2, 3, 4]"],
    correctIndex: 0,
    explanation: "range(4) generates 0, 1, 2, 3. Each value is squared: 0²=0, 1²=1, 2²=4, 3²=9.",
    type: "code_runner",
  },
  {
    id: "cr_4",
    title: "Code Runner: String Methods",
    codeSnippet: `text = "DeSuper"
print(text.lower()[::-1])`,
    question: "What is the output?",
    options:["repuseS", "desuper", "REPUSED", "disuper"],
    correctIndex: 0,
    explanation: "'DeSuper'.lower() = 'desuper', and [::-1] reverses it to 'repuseS'.",
    type: "code_runner",
  },
  {
    id: "cr_5",
    title: "Code Runner: Enumerate",
    codeSnippet: `for i, v in enumerate(['a', 'b']):
    print(i, v)`,
    question: "What is the first line of output?",
    options: ["a b", "0 a", "1 a", "a 0"],
    correctIndex: 1,
    explanation: "enumerate() returns (index, value) tuples starting from index 0, so the first output is '0 a'.",
    type: "code_runner",
  },
  {
    id: "cr_6",
    title: "Code Runner: Zip Function",
    question: "How many iterations does this loop execute?",
    codeSnippet: `a = [1, 2, 3]
b = ['x', 'y']
for item in zip(a, b):
    print(item)`,
    options: ["3", "2", "5", "Error"],
    correctIndex: 1,
    explanation: "zip() stops at the shortest iterable. Since b has only 2 elements, the loop runs 2 times.",
    type: "code_runner",
  },
  {
    id: "cr_7",
    title: "Code Runner: Set Operations",
    question: "What is the result of this set operation?",
    codeSnippet: `a = {1, 2, 3}
b = {2, 3, 4}
print(a & b)`,
    options: ["{1, 2, 3, 4}", "{2, 3}", "{1, 4}", "{1, 2, 3}"],
    correctIndex: 1,
    explanation: "The & operator returns the intersection of two sets: elements common to both a and b are {2, 3}.",
    type: "code_runner",
  },
  {
    id: "cr_8",
    title: "Code Runner: Lambda Function",
    question: "What does this lambda expression return?",
    codeSnippet: `f = lambda x, y: x * y + 1
print(f(3, 4))`,
    options: ["12", "13", "7", "8"],
    correctIndex: 1,
    explanation: "The lambda computes (3 * 4) + 1 = 12 + 1 = 13.",
    type: "code_runner",
  },
  {
    id: "cr_9",
    title: "Code Runner: F-String",
    question: "What is the output of this f-string?",
    codeSnippet: `name = "Eli"
version = "v0.1"
print(f"{name}-{version.upper()}")`,
    options: ["Eli-V0.1", "Eli-v0.1", "ELI-V0.1", "Eli-version"],
    correctIndex: 0,
    explanation: "The f-string interpolates name as 'Eli' and applies .upper() to version, resulting in 'Eli-V0.1'.",
    type: "code_runner",
  },
  {
    id: "cr_10",
    title: "Code Runner: Dictionary Merge",
    question: "What is the output after merging?",
    codeSnippet: `d1 = {'a': 1, 'b': 2}
d2 = {'b': 3, 'c': 4}
print({**d1, **d2})`,
    options: [
      "{'a': 1, 'b': 2, 'c': 4}",
      "{'a': 1, 'b': 3, 'c': 4}",
      "{'a': 1, 'b': 2, 'b': 3, 'c': 4}",
      "Error",
    ],
    correctIndex: 1,
    explanation: "When merging dictionaries with **, later values overwrite earlier ones. 'b': 3 from d2 overwrites 'b': 2.",
    type: "code_runner",
  },
  // Additional Algorithm Arena Questions
  {
    id: "aa_3",
    title: "Algorithm Arena: Bubble Sort",
    question: "What is the worst-case time complexity of Bubble Sort?",
    codeSnippet: `# Bubble Sort repeatedly swaps adjacent elements
for i in range(n):
    for j in range(0, n-i-1):`,
    options: ["O(N)", "O(N log N)", "O(N^2)", "O(2^N)"],
    correctIndex: 2,
    explanation: "Bubble Sort uses two nested loops, resulting in O(N^2) time complexity in the worst case.",
    type: "algo_arena",
  },
  {
    id: "aa_4",
    title: "Algorithm Arena: Stack Operations",
    question: "Which principle does a Stack data structure follow?",
    codeSnippet: `stack = []
stack.append(1)  # push
stack.append(2)  # push
stack.pop()      # returns 2`,
    options: ["FIFO (First In First Out)", "LIFO (Last In First Out)", "LILO", "Random Access"],
    correctIndex: 1,
    explanation: "A Stack follows LIFO: the last element pushed is the first one popped (Last In First Out).",
    type: "algo_arena",
  },
  {
    id: "aa_5",
    title: "Algorithm Arena: Recursion Depth",
    question: "What limits the maximum recursion depth in Python?",
    codeSnippet: `def recurse(n):
    if n == 0: return
    recurse(n-1)`,
    options: [
      "No limit",
      "System memory / recursion limit (~1000 by default)",
      "CPU speed",
      "Variable types",
    ],
    correctIndex: 1,
    explanation: "Python has a default recursion limit of ~1000 to prevent stack overflow. It can be changed with sys.setrecursionlimit().",
    type: "algo_arena",
  },
  {
    id: "aa_6",
    title: "Algorithm Arena: Binary Search Requirement",
    question: "What prerequisite must be met for binary search to work correctly?",
    codeSnippet: `# Binary search on a sorted list
sorted_list = [2, 5, 8, 12, 16, 23, 38]`,
    options: [
      "List must have even length",
      "List must be sorted",
      "List must contain only integers",
      "List must have no duplicates",
    ],
    correctIndex: 1,
    explanation: "Binary search requires the list to be sorted. It works by repeatedly dividing the search interval in half.",
    type: "algo_arena",
  },
  // Additional Security Lab Questions
  {
    id: "sl_2",
    title: "Security Lab: Password Storage",
    question: "What is the proper way to store passwords in a database?",
    codeSnippet: `# How should passwords be stored?`,
    options: [
      "Plain text",
      "Encrypted with base64",
      "Hashed with salt (e.g., bcrypt)",
      "As a comment in code",
    ],
    correctIndex: 2,
    explanation: "Passwords should be hashed with a salt using algorithms like bcrypt. Hashing is one-way, making it secure against data breaches.",
    type: "security_lab",
  },
  {
    id: "sl_3",
    title: "Security Lab: SQL Injection",
    question: "What is the primary defense against SQL injection attacks?",
    codeSnippet: `# VULNERABLE
query = f"SELECT * FROM users WHERE name = '{user_input}'"`,
    options: [
      "Using longer passwords",
      "Parameterized queries / prepared statements",
      "Adding more RAM",
      "Using faster databases",
    ],
    correctIndex: 1,
    explanation: "Parameterized queries separate code from data, preventing attackers from injecting malicious SQL code.",
    type: "security_lab",
  },
  {
    id: "sl_4",
    title: "Security Lab: HTTPS",
    question: "Why is HTTPS important for web applications?",
    codeSnippet: `# Communication between client and server`,
    options: [
      "Makes websites faster",
      "Encrypts data in transit between client and server",
      "Reduces server costs",
      "Improves SEO only",
    ],
    correctIndex: 1,
    explanation: "HTTPS encrypts all data transmitted between client and server, preventing eavesdropping and man-in-the-middle attacks.",
    type: "security_lab",
  },
  // More Bug Hunter Questions
  {
    id: "bg_11",
    title: "Bug Hunter: List Index",
    question: "What happens when you access index 5 of a 3-element list?",
    codeSnippet: `items = [1, 2, 3]
print(items[5])`,
    options: ["None", "0", "IndexError", "3"],
    correctIndex: 2,
    explanation: "Accessing an index beyond the list length raises IndexError. Python lists are 0-indexed, so valid indices are 0, 1, 2.",
    type: "bug_hunter",
  },
  {
    id: "bg_12",
    title: "Bug Hunter: Dictionary Key",
    question: "What happens when accessing a non-existent dictionary key?",
    codeSnippet: `data = {'a': 1}
print(data['b'])`,
    options: ["None", "0", "KeyError", "''"],
    correctIndex: 2,
    explanation: "Accessing a non-existent key with [] raises KeyError. Use .get() to return a default value instead.",
    type: "bug_hunter",
  },
  {
    id: "bg_13",
    title: "Bug Hunter: Integer Overflow",
    question: "Does Python have integer overflow issues?",
    codeSnippet: `x = 10 ** 1000
print(type(x))`,
    options: [
      "Yes, raises OverflowError",
      "No, Python integers have arbitrary precision",
      "Yes, returns infinity",
      "No, but returns float",
    ],
    correctIndex: 1,
    explanation: "Python integers have arbitrary precision - they can grow as large as memory allows without overflow.",
    type: "bug_hunter",
  },
  {
    id: "bg_14",
    title: "Bug Hunter: Float Precision",
    question: "What is the result of 0.1 + 0.2 in Python?",
    codeSnippet: `print(0.1 + 0.2)`,
    options: ["0.3", "0.30000000000000004", "0.30", "Error"],
    correctIndex: 1,
    explanation: "Floating-point arithmetic can have precision issues. 0.1 + 0.2 = 0.30000000000000004 due to binary representation.",
    type: "bug_hunter",
  },
  {
    id: "bg_15",
    title: "Bug Hunter: Mutable Argument",
    question: "What is a common bug with mutable default arguments?",
    codeSnippet: `def add_item(item, items=[]):
    items.append(item)
    return items`,
    options: [
      "No issue",
      "List is shared between calls",
      "Syntax error",
      "Always returns empty list",
    ],
    correctIndex: 1,
    explanation: "Mutable default arguments are created once and shared. Each call modifies the same list object.",
    type: "bug_hunter",
  },
  // More Code Runner Questions
  {
    id: "cr_11",
    title: "Code Runner: List Reverse",
    question: "What is the output of items[::-1]?",
    codeSnippet: `items = [1, 2, 3, 4]
print(items[::-1])`,
    options: ["[1, 2, 3, 4]", "[4, 3, 2, 1]", "[1, 4]", "Error"],
    correctIndex: 1,
    explanation: "[::-1] creates a reversed copy of the list using slice notation with step -1.",
    type: "code_runner",
  },
  {
    id: "cr_12",
    title: "Code Runner: String Join",
    question: "What is the output of '-'.join(['a', 'b', 'c'])?",
    codeSnippet: `result = '-'.join(['a', 'b', 'c'])
print(result)`,
    options: ["'a-b-c'", "'abc'", "'a,b,c'", "Error"],
    correctIndex: 0,
    explanation: "str.join() concatenates iterable elements with the string as separator.",
    type: "code_runner",
  },
  {
    id: "cr_13",
    title: "Code Runner: List Extend",
    question: "What is the difference between append and extend?",
    codeSnippet: `a = [1, 2]
a.extend([3, 4])
print(a)`,
    options: ["[1, 2, 3, 4]", "[1, 2, [3, 4]]", "[3, 4]", "Error"],
    correctIndex: 0,
    explanation: "extend() adds each element from the iterable. append() would add the list as a single element.",
    type: "code_runner",
  },
  {
    id: "cr_14",
    title: "Code Runner: Sort vs Sorted",
    question: "What is the difference between sort() and sorted()?",
    codeSnippet: `items = [3, 1, 2]
result = sorted(items)
print(result, items)`,
    options: [
      "Both modify original",
      "sorted() returns new list, sort() modifies in-place",
      "sort() returns new list",
      "No difference",
    ],
    correctIndex: 1,
    explanation: "sorted() returns a new sorted list. sort() modifies the list in-place and returns None.",
    type: "code_runner",
  },
  {
    id: "cr_15",
    title: "Code Runner: Any All",
    question: "What does any([False, True, False]) return?",
    codeSnippet: `result = any([False, True, False])
print(result)`,
    options: ["True", "False", "None", "Error"],
    correctIndex: 0,
    explanation: "any() returns True if at least one element is truthy. all() requires all elements to be truthy.",
    type: "code_runner",
  },
  // More Algorithm Arena Questions
  {
    id: "aa_7",
    title: "Algorithm Arena: Queue Operations",
    question: "Which principle does a Queue data structure follow?",
    codeSnippet: `from collections import deque
q = deque()
q.append(1)  # enqueue
q.popleft()  # dequeue`,
    options: ["LIFO", "FIFO", "Random", "Priority"],
    correctIndex: 1,
    explanation: "Queues follow FIFO: First In, First Out. The first element added is the first removed.",
    type: "algo_arena",
  },
  {
    id: "aa_8",
    title: "Algorithm Arena: Linked List",
    question: "What is the time complexity of accessing an element by index in a linked list?",
    codeSnippet: `# Linked list node access`,
    options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
    correctIndex: 2,
    explanation: "Linked lists require traversal from the head to reach an element, giving O(N) access time.",
    type: "algo_arena",
  },
  {
    id: "aa_9",
    title: "Algorithm Arena: Hash Table",
    question: "What is the average time complexity of hash table insertion?",
    codeSnippet: `d = {}
d['key'] = 'value'`,
    options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
    correctIndex: 0,
    explanation: "Hash tables provide O(1) average-case insertion, lookup, and deletion.",
    type: "algo_arena",
  },
  {
    id: "aa_10",
    title: "Algorithm Arena: Big-O Notation",
    question: "Which time complexity is the fastest for large N?",
    codeSnippet: `# Comparing algorithms`,
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctIndex: 0,
    explanation: "O(1) is constant time - the fastest, as it doesn't depend on input size.",
    type: "algo_arena",
  },
  // More Security Lab Questions
  {
    id: "sl_5",
    title: "Security Lab: XSS Prevention",
    question: "What is the primary defense against XSS (Cross-Site Scripting)?",
    codeSnippet: `# User input displayed on page`,
    options: [
      "Using HTTPS",
      "Input sanitization and output encoding",
      "Blocking JavaScript",
      "Using cookies",
    ],
    correctIndex: 1,
    explanation: "XSS is prevented by sanitizing user input and encoding output to prevent script injection.",
    type: "security_lab",
  },
  {
    id: "sl_6",
    title: "Security Lab: CSRF Protection",
    question: "What is a CSRF token used for?",
    codeSnippet: `# Form submission`,
    options: [
      "Speed up requests",
      "Prevent Cross-Site Request Forgery",
      "Encrypt data",
      "Cache responses",
    ],
    correctIndex: 1,
    explanation: "CSRF tokens verify that form submissions come from the legitimate user, not a malicious site.",
    type: "security_lab",
  },
  {
    id: "sl_7",
    title: "Security Lab: Environment Variables",
    question: "Why should secrets not be hardcoded in source code?",
    codeSnippet: `# BAD Practice
API_KEY = "sk-12345"`,
    options: [
      "Slows execution",
      "Exposed in version control",
      "Uses more memory",
      "Not Pythonic",
    ],
    correctIndex: 1,
    explanation: "Hardcoded secrets are exposed in version control. Use environment variables instead.",
    type: "security_lab",
  },
  {
    id: "sl_8",
    title: "Security Lab: Dependency Scanning",
    question: "Why is it important to scan dependencies for vulnerabilities?",
    codeSnippet: `# requirements.txt
requests==2.28.0`,
    options: [
      "Reduce file size",
      "Find and fix known security issues",
      "Improve performance",
      "Required by law",
    ],
    correctIndex: 1,
    explanation: "Dependencies may have known vulnerabilities. Scanning helps identify and fix security risks.",
    type: "security_lab",
  },
];

export const INITIAL_DAILY_QUESTS: DailyQuest[] = [
  {
    id: "dq_1",
    title: "Daily Debug",
    category: "debug",
    description: "Successfully execute code or solve a coding challenge.",
    targetCount: 1,
    currentCount: 0,
    completed: false,
    xpReward: 150,
    coinsReward: 100,
  },
  {
    id: "dq_2",
    title: "Daily Mission",
    category: "code",
    description: "Complete at least one curriculum mission today.",
    targetCount: 1,
    currentCount: 0,
    completed: false,
    xpReward: 200,
    coinsReward: 150,
  },
  {
    id: "dq_3",
    title: "Arcade Master",
    category: "boss",
    description: "Answer 2 mini-game challenges correctly.",
    targetCount: 2,
    currentCount: 0,
    completed: false,
    xpReward: 250,
    coinsReward: 200,
  },
];
