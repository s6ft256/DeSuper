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
    # TODO: Implement operations and return calculated result
    pass

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
        # TODO: Initialize items dictionary
        pass

    def add_item(self, name, power):
        # TODO: Store weapon power in self.items
        pass

    def get_total_power(self):
        # TODO: Return the sum of all item powers
        pass

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
    id: "proj_security_scanner",
    title: "Autonomous Security & Port Scanner",
    tier: "Advanced",
    category: "Cybersecurity Tool",
    description: "Build an automated port & telemetry vulnerability analyzer that scans simulated network ports, flags anomalies, and formats a JSON report.",
    starterCode: `# PROJECT: Autonomous Security & Port Scanner
# Implement scan_security_ports(ports):
# 1. Loop through the ports dictionary
# 2. Collect any port whose status is "OPEN_UNENCRYPTED" into a threats list
# 3. Return a dict: {"scanned": len(ports), "threats": threats, "secure": len(threats) == 0}

def scan_security_ports(ports):
    # TODO: Scan ports, find unencrypted ports, and return dictionary report
    pass

network_ports = {
    80: "OPEN_UNENCRYPTED",
    443: "SECURE_TLS",
    8080: "OPEN_UNENCRYPTED",
    22: "SECURE_SSH"
}

report = scan_security_ports(network_ports)
print("SECURITY REPORT:", report)
`,
    requirements: [
      "Scan dictionary of ports and statuses",
      "Collect all ports with 'OPEN_UNENCRYPTED' into threat list",
      "Return summary dictionary containing scanned count and threats",
    ],
    testSuites: [
      { name: "Threat Detection Test", expectedOutputPattern: "threats" },
    ],
    xpReward: 600,
    coinsReward: 350,
  },
  {
    id: "proj_autonomous_city",
    title: "Supreme Metropolis Automation AI",
    tier: "Supreme",
    category: "Autonomous Systems",
    description: "Architect a comprehensive multi-tier simulation managing energy allocation, traffic signal timings, and emergency emergency dispatch across DeSuper Prime.",
    starterCode: `# PROJECT: Supreme Metropolis Automation AI
# Create SupremeCityController:
# 1. __init__(self, name): sets self.name = name, self.energy_reserves = 5000,
#    and self.active_districts = ["Alpha", "Beta", "Gamma"]
# 2. balance_grid(self): calculates allocation = self.energy_reserves // len(self.active_districts)
#    and returns a dictionary mapping each district to its allocation

class SupremeCityController:
    def __init__(self, name):
        # TODO: Initialize name, energy_reserves (5000), and active_districts list
        pass

    def balance_grid(self):
        # TODO: Divide reserves among districts and return status dictionary
        pass

city_ai = SupremeCityController("DeSuper Prime")
print("METROPOLIS GRID ALLOCATION:", city_ai.balance_grid())
`,
    requirements: [
      "Manage multi-district power distribution",
      "Perform integer division for even allocation",
      "Return status dictionary for all active districts",
    ],
    testSuites: [
      { name: "Metropolis Allocation Test", expectedOutputPattern: "METROPOLIS GRID ALLOCATION" },
    ],
    xpReward: 1000,
    coinsReward: 600,
  },
];
