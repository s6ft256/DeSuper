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

def cyber_calc(a, b, operation):
    if operation == "add":
        return a + b
    elif operation == "subtract":
        return a - b
    elif operation == "multiply":
        return a * b
    elif operation == "divide":
        return "DIV_ZERO_ERROR" if b == 0 else a / b
    return "UNKNOWN_OPERATION"

# Automated Test Runs:
print("50 + 25 =", cyber_calc(50, 25, "add"))
print("100 * 4 =", cyber_calc(100, 4, "multiply"))
`,
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

class CyberInventory:
    def __init__(self):
        self.items = {}

    def add_item(self, name, power):
        self.items[name] = power

    def get_total_power(self):
        return sum(self.items.values())

# Construct and test inventory:
inv = CyberInventory()
inv.add_item("Plasma Rifle", 120)
inv.add_item("EMP Disruptor", 85)

print("TOTAL ARSENAL POWER:", inv.get_total_power())
`,
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
def cyber_encrypt(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            shifted = chr((ord(char) - base + shift) % 26 + base)
            result += shifted
        else:
            result += char
    return result

# Test encryption:
cipher_text = cyber_encrypt("CYBER", 3)
print("ENCRYPTED SIGNAL:", cipher_text)
`,
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
def shortest_path(graph, start, target):
    queue = [[start]]
    visited = set([start])

    while queue:
        path = queue.pop(0)
        node = path[-1]

        if node == target:
            return path

        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                new_path = list(path)
                new_path.append(neighbor)
                queue.append(new_path)
    return []

# Test flight grid:
city_grid = {
    "Sector_A": ["Sector_B", "Sector_C"],
    "Sector_B": ["Sector_D"],
    "Sector_C": ["Sector_D"],
    "Sector_D": ["Core_Reactor"]
}

route = shortest_path(city_grid, "Sector_A", "Core_Reactor")
print("OPTIMAL FLIGHT PATH:", " -> ".join(route))
`,
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
    starterCode: `import numpy as np

# PROJECT: Atmospheric Matrix Processor
# 1. Create a 3x3 sensor matrix
sensor_matrix = np.array([
    [100, 120, 110],
    [90, 85, 95],
    [140, 130, 150]
])

mean_reading = np.mean(sensor_matrix)
std_dev = np.std(sensor_matrix)
max_anomaly = np.max(sensor_matrix)

print(f"SENSOR MEAN: {round(mean_reading, 1)}")
print(f"SENSOR PEAK: {max_anomaly}")
`,
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
    starterCode: `import pandas as pd

# PROJECT: Transit Flow Analytics
records = {
    "line": ["Neon_Express", "Hyper_Loop", "Neon_Express", "Hyper_Loop"],
    "passengers": [1200, 2400, 1500, 2800],
    "delay_mins": [2, 0, 4, 1]
}

df = pd.DataFrame(records)
stats = df.groupby("line").mean()

print("HYPER LOOP AVERAGE PASSENGERS:", round(stats["Hyper_Loop"]["passengers"]))
`,
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
    starterCode: `from sklearn.linear_model import LinearRegression
import numpy as np

# PROJECT: AI Anomaly Predictor
# Training features: X (bandwidth anomalies), y (breach risk score)
X = np.array([10, 20, 30, 40, 50])
y = np.array([15, 30, 45, 60, 75])

model = LinearRegression()
model.fit(X, y)

# Predict risk for 80 anomaly units:
test_x = np.array([80])
predicted_risk = model.predict(test_x)

print(f"PREDICTED BREACH RISK: {round(predicted_risk[0])}%")
`,
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
class NeuralPerceptron:
    def __init__(self, weights, bias):
        self.weights = weights
        self.bias = bias

    def activate(self, inputs):
        # Calculate dot product of inputs and weights + bias
        total = sum(i * w for i, w in zip(inputs, self.weights)) + self.bias
        # Step activation function
        return 1 if total >= 0 else 0

# Test perceptron logic gate (AND gate):
and_perceptron = NeuralPerceptron(weights=[1.0, 1.0], bias=-1.5)

print("[1, 1] ACTIVATION:", and_perceptron.activate([1, 1]))
print("[1, 0] ACTIVATION:", and_perceptron.activate([1, 0]))
`,
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
