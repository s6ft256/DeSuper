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
];
