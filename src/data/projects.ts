import { ProjectTemplate } from "../types";

export const PROJECTS: ProjectTemplate[] = [
  {
    id: "proj_calc",
    title: "Cyberpunk Terminal Calculator",
    tier: "Beginner",
    category: "Utility Application",
    description: "Build a multi-operation calculator capable of addition, subtraction, multiplication, and division with formatted cyberpunk output.",
    starterCode: `# PROJECT: Cyberpunk Terminal Calculator
# Implement cyber_calc(a, b, operation) to handle:
# "add" -> a + b
# "subtract" -> a - b
# "multiply" -> a * b
# "divide" -> a / b (or "DIV_ZERO_ERROR" if b == 0)
# Automated Test Runs:`,
    requirements: [
      "Implement cyber_calc(a, b, operation)",
      "Support 'add', 'subtract', 'multiply', 'divide'",
      "Handle division by zero safely",
      "Return valid formatted results",
    ],
    testSuites: [
      { name: "Addition Test", expectedOutputPattern: "50 + 25 = 75" },
      { name: "Multiplication Test", expectedOutputPattern: "100 * 4 = 400" },
    ],
    xpReward: 300,
    coinsReward: 150,
  },
  {
    id: "proj_inventory",
    title: "Cybernetic Inventory & Weapon Manager",
    tier: "Intermediate",
    category: "Data Management System",
    description: "Create an object-oriented Inventory System that tracks weapon names, damage levels, durability, and computes total combat gear power.",
    starterCode: `# PROJECT: Cybernetic Inventory & Weapon Manager
# Create class CyberInventory:
# 1. __init__(self): initialize self.items dictionary
# 2. add_item(self, name, power): add name and power to self.items
# 3. get_total_power(self): return sum of power values
# Construct and test inventory:`,
    requirements: [
      "Define CyberInventory class",
      "Implement add_item(name, power)",
      "Implement get_total_power() summing dictionary values",
      "Test with multiple items",
    ],
    testSuites: [
      { name: "Inventory Summation Test", expectedOutputPattern: "TOTAL ARSENAL POWER: 205" },
    ],
    xpReward: 450,
    coinsReward: 250,
  },
  {
    id: "proj_cipher",
    title: "Cryptographic Caesar Cipher & Anomaly Decoder",
    tier: "Intermediate",
    category: "Cybersecurity & Algorithms",
    description: "Build a string manipulation cipher algorithm to encrypt and decrypt transmission signals by shifting ASCII character codes.",
    starterCode: `# PROJECT: Caesar Cipher & Signal Cryptography
# Test encryption:`,
    requirements: [
      "Implement cyber_encrypt(text, shift)",
      "Correctly shift uppercase and lowercase letters",
      "Preserve non-alphabetic symbols",
    ],
    testSuites: [
      { name: "Encryption Output Test", expectedOutputPattern: "ENCRYPTED SIGNAL: FBEHU" },
    ],
    xpReward: 500,
    coinsReward: 250,
  },
  {
    id: "proj_drone",
    title: "Autonomous Drone Flight Path Optimizer",
    tier: "Advanced",
    category: "Algorithms & Pathfinding",
    description: "Implement a shortest path finding algorithm (Breadth-First Search) across a cyber city waypoint network graph.",
    starterCode: `# PROJECT: Autonomous Drone Graph Navigation (TheAlgorithms)
# Test flight grid:`,
    requirements: [
      "Implement shortest_path(graph, start, target) using BFS",
      "Return fastest route array between nodes",
    ],
    testSuites: [
      { name: "Pathfinding Test", expectedOutputPattern: "OPTIMAL FLIGHT PATH: Sector_A -> Sector_B -> Sector_D -> Core_Reactor" },
    ],
    xpReward: 600,
    coinsReward: 300,
  },
  {
    id: "proj_numpy",
    title: "Planetary Atmospheric Sensor Matrix",
    tier: "Advanced",
    category: "Scientific Computing & NumPy",
    description: "Perform multidimensional matrix statistics, normalization, and sensor vector dot products using NumPy array algebra.",
    starterCode: `# PROJECT: Atmospheric Matrix Processor
# 1. Create a 3x3 sensor matrix`,
    requirements: [
      "Create 2D NumPy array matrix",
      "Calculate matrix mean, standard deviation, and maximum peak",
      "Print formatted scientific metrics",
    ],
    testSuites: [
      { name: "NumPy Mean Test", expectedOutputPattern: "SENSOR MEAN: 113.3" },
      { name: "NumPy Peak Test", expectedOutputPattern: "SENSOR PEAK: 150" },
    ],
    xpReward: 700,
    coinsReward: 350,
  },
  {
    id: "proj_pandas",
    title: "Cyber-City Transit Passenger Analytics",
    tier: "Supreme",
    category: "Data Wrangling & Pandas",
    description: "Analyze large-scale urban transit records with Pandas, aggregating passenger volumes and computing average sector delays.",
    starterCode: `# PROJECT: Transit Flow Analytics`,
    requirements: [
      "Initialize Pandas DataFrame from data dictionary",
      "Compute grouped averages per transit line",
      "Extract and display aggregated passenger volume",
    ],
    testSuites: [
      { name: "Pandas GroupBy Test", expectedOutputPattern: "HYPER LOOP AVERAGE PASSENGERS: 2600" },
    ],
    xpReward: 800,
    coinsReward: 400,
  },
  {
    id: "proj_ml",
    title: "AI Threat Predictor & Linear Classifier",
    tier: "Supreme",
    category: "Machine Learning & Scikit-Learn",
    description: "Train a Scikit-Learn Linear Regression model on threat intensity indicators to predict critical breach probabilities.",
    starterCode: `# PROJECT: AI Anomaly Predictor
# Training features: X (bandwidth anomalies), y (breach risk score)
# Predict risk for 80 anomaly units:`,
    requirements: [
      "Instantiate and fit LinearRegression from Scikit-Learn",
      "Train model on feature vector",
      "Predict target risk score and evaluate output",
    ],
    testSuites: [
      { name: "ML Prediction Test", expectedOutputPattern: "PREDICTED BREACH RISK: 120%" },
    ],
    xpReward: 900,
    coinsReward: 450,
  },
  {
    id: "proj_perceptron",
    title: "Neural Network Perceptron Brain",
    tier: "Supreme",
    category: "Deep Learning & Neural Networks",
    description: "Construct a single-layer Artificial Neural Perceptron with weights, bias, and step activation function from scratch.",
    starterCode: `# PROJECT: Neural Perceptron Unit (TheAlgorithms & 30-Days-Of-Python)
        # Calculate dot product of inputs and weights + bias
        # Step activation function
# Test perceptron logic gate (AND gate):`,
    requirements: [
      "Define NeuralPerceptron class with weights and bias",
      "Implement activate(inputs) calculating weighted sum + bias",
      "Simulate binary logic decision boundary",
    ],
    testSuites: [
      { name: "Perceptron True Test", expectedOutputPattern: "[1, 1] ACTIVATION: 1" },
      { name: "Perceptron False Test", expectedOutputPattern: "[1, 0] ACTIVATION: 0" },
    ],
    xpReward: 1000,
    coinsReward: 500,
  },
  {
    id: "proj_password_gen",
    title: "Quantum Password Generator",
    tier: "Beginner",
    category: "Security & Randomization",
    description: "Build a secure password generator that creates random passwords with customizable length and character sets using Python's random and string modules.",
    starterCode: `# PROJECT: Quantum Password Generator
# Implement generate_password(length, use_special=True)
# Use random.choices() to select characters
# Test with length=12:`,
    requirements: [
      "Implement generate_password(length, use_special=True)",
      "Include uppercase, lowercase, digits, and optional special chars",
      "Use random.choices() for selection",
      "Return a string of the specified length",
    ],
    testSuites: [
      { name: "Password Length Test", expectedOutputPattern: "GENERATED PASSWORD:" },
      { name: "Password Strength Test", expectedOutputPattern: "STRENGTH: STRONG" },
    ],
    xpReward: 250,
    coinsReward: 120,
  },
  {
    id: "proj_todo_list",
    title: "Cyber Task Manager",
    tier: "Beginner",
    category: "Data Structures",
    description: "Create a command-line task manager that allows adding, completing, and listing tasks with priority levels and due dates.",
    starterCode: `# PROJECT: Cyber Task Manager
# Implement TaskManager class with:
# - add_task(name, priority)
# - complete_task(name)
# - get_pending_tasks()
# Test the functionality:`,
    requirements: [
      "Define TaskManager class",
      "Implement add_task(name, priority) storing tasks in a list",
      "Implement complete_task(name) marking tasks done",
      "Implement get_pending_tasks() returning incomplete tasks",
    ],
    testSuites: [
      { name: "Add Task Test", expectedOutputPattern: "TASK ADDED: Hack the mainframe" },
      { name: "Complete Task Test", expectedOutputPattern: "PENDING TASKS: 2" },
    ],
    xpReward: 280,
    coinsReward: 140,
  },
  {
    id: "proj_hangman",
    title: "Neural Hangman Game",
    tier: "Intermediate",
    category: "Game Development",
    description: "Build the classic Hangman game with a cyberpunk twist. Guess the hidden word before the hangman is complete!",
    starterCode: `# PROJECT: Neural Hangman
# Implement play_hangman(word, max_guesses=6)
# Track guessed letters and remaining attempts
# Test with word="PYTHON":`,
    requirements: [
      "Implement play_hangman(word, max_guesses=6)",
      "Display current state of guessed word",
      "Track remaining guesses",
      "Return True if won, False if lost",
    ],
    testSuites: [
      { name: "Correct Guess Test", expectedOutputPattern: "WORD: P_T_ON" },
      { name: "Win Test", expectedOutputPattern: "VICTORY!" },
    ],
    xpReward: 400,
    coinsReward: 200,
  },
  {
    id: "proj_file_organizer",
    title: "Cyber File System Organizer",
    tier: "Intermediate",
    category: "File I/O & Automation",
    description: "Create a script that organizes files in a directory by their extension, moving them into appropriate folders automatically.",
    starterCode: `# PROJECT: File System Organizer
# Implement organize_files(file_list)
# Group files by extension into categories
# Test with mixed file types:`,
    requirements: [
      "Implement organize_files(file_list)",
      "Categorize files by extension (images, docs, code, etc.)",
      "Return a dictionary of categories with file lists",
      "Handle unknown extensions as 'other'",
    ],
    testSuites: [
      { name: "Image Files Test", expectedOutputPattern: "IMAGES: ['photo.jpg', 'logo.png']" },
      { name: "Code Files Test", expectedOutputPattern: "CODE: ['app.py', 'index.html']" },
    ],
    xpReward: 420,
    coinsReward: 210,
  },
  {
    id: "proj_api_simulator",
    title: "DeSuper API Simulator",
    tier: "Advanced",
    category: "Web Development & APIs",
    description: "Build a simple REST API simulator that handles GET, POST, PUT, and DELETE operations on a resource collection.",
    starterCode: `# PROJECT: DeSuper API Simulator
# Implement SimpleAPI class with:
# - get(resource_id)
# - create(data)
# - update(resource_id, data)
# - delete(resource_id)
# Test CRUD operations:`,
    requirements: [
      "Define SimpleAPI class with internal data store",
      "Implement get(resource_id) returning resource or None",
      "Implement create(data) adding new resource with auto-ID",
      "Implement update and delete methods",
    ],
    testSuites: [
      { name: "Create Test", expectedOutputPattern: "CREATED: {'id': 1" },
      { name: "Get Test", expectedOutputPattern: "RETRIEVED: {'id': 1" },
    ],
    xpReward: 650,
    coinsReward: 320,
  },
  {
    id: "proj_sorting_visualizer",
    title: "Algorithm Sorting Visualizer",
    tier: "Advanced",
    category: "Algorithms & Visualization",
    description: "Implement multiple sorting algorithms (Bubble Sort, Quick Sort, Merge Sort) and compare their performance on different input sizes.",
    starterCode: `# PROJECT: Sorting Algorithm Visualizer
# Implement bubble_sort(arr) and quick_sort(arr)
# Compare execution times
# Test with [64, 34, 25, 12, 22, 11, 90]:`,
    requirements: [
      "Implement bubble_sort(arr) returning sorted array",
      "Implement quick_sort(arr) using recursion",
      "Add timing comparison between algorithms",
      "Return results with execution times",
    ],
    testSuites: [
      { name: "Bubble Sort Test", expectedOutputPattern: "BUBBLE SORT: [11, 12, 22, 25, 34, 64, 90]" },
      { name: "Quick Sort Test", expectedOutputPattern: "QUICK SORT: [11, 12, 22, 25, 34, 64, 90]" },
    ],
    xpReward: 680,
    coinsReward: 340,
  },
  {
    id: "proj_chatbot",
    title: "Eli-v0.1 Chatbot Prototype",
    tier: "Intermediate",
    category: "Natural Language Processing",
    description: "Build a simple rule-based chatbot that responds to user inputs with predefined patterns and responses, similar to Eli-v0.1.",
    starterCode: `# PROJECT: Eli-v0.1 Chatbot Prototype
# Implement ChatBot class with:
# - respond(user_input) matching patterns
# - add_pattern(pattern, response)
# Test with various inputs:`,
    requirements: [
      "Define ChatBot class with pattern-response pairs",
      "Implement respond(user_input) finding best match",
      "Add default response for unknown inputs",
      "Support pattern matching with keywords",
    ],
    testSuites: [
      { name: "Greeting Test", expectedOutputPattern: "Eli: Hey there!" },
      { name: "Code Help Test", expectedOutputPattern: "Eli: Let me help you with that code!" },
    ],
    xpReward: 480,
    coinsReward: 240,
  },
  {
    id: "proj_weather_app",
    title: "Cyber Weather Dashboard",
    tier: "Advanced",
    category: "Data Processing & APIs",
    description: "Create a weather data processor that analyzes temperature data, calculates statistics, and generates a formatted weather report.",
    starterCode: `# PROJECT: Cyber Weather Dashboard
# Implement analyze_weather(temperatures)
# Calculate min, max, average, and trend
# Test with weekly data:`,
    requirements: [
      "Implement analyze_weather(temperatures)",
      "Calculate min, max, and average temperature",
      "Determine trend (warming, cooling, stable)",
      "Return formatted weather report",
    ],
    testSuites: [
      { name: "Stats Test", expectedOutputPattern: "AVG TEMP: 23.5C" },
      { name: "Trend Test", expectedOutputPattern: "TREND: WARMING" },
    ],
    xpReward: 580,
    coinsReward: 290,
  },
  {
    id: "proj_blockchain",
    title: "DeSuper Blockchain Ledger",
    tier: "Supreme",
    category: "Cryptography & Data Structures",
    description: "Implement a simple blockchain with blocks, hashing, and chain validation to understand the fundamentals of distributed ledger technology.",
    starterCode: `# PROJECT: DeSuper Blockchain Ledger
# Implement Block and Blockchain classes
# Each block contains: index, data, previous_hash, hash
# Test chain integrity:`,
    requirements: [
      "Define Block class with index, data, previous_hash, hash",
      "Implement calculate_hash() using SHA-256",
      "Define Blockchain class with add_block(data) method",
      "Implement is_valid() verifying chain integrity",
    ],
    testSuites: [
      { name: "Genesis Block Test", expectedOutputPattern: "BLOCK 0 HASH:" },
      { name: "Chain Valid Test", expectedOutputPattern: "CHAIN VALID: True" },
    ],
    xpReward: 950,
    coinsReward: 480,
  },
  {
    id: "proj_tic_tac_toe",
    title: "Neural Tic-Tac-Toe AI",
    tier: "Intermediate",
    category: "Game Development & AI",
    description: "Build a Tic-Tac-Toe game with an AI opponent using the minimax algorithm for perfect play.",
    starterCode: `# PROJECT: Neural Tic-Tac-Toe AI
# Implement TicTacToe class with:
# - make_move(position)
# - get_ai_move() using minimax
# - check_winner()
# Test gameplay:`,
    requirements: [
      "Define TicTacToe class with 3x3 board",
      "Implement make_move(position) for player and AI",
      "Implement get_ai_move() using minimax algorithm",
      "Implement check_winner() detecting wins/draws",
    ],
    testSuites: [
      { name: "Player Move Test", expectedOutputPattern: "BOARD UPDATED" },
      { name: "AI Move Test", expectedOutputPattern: "AI PLAYS POSITION:" },
    ],
    xpReward: 520,
    coinsReward: 260,
  },
];
