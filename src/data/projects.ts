import { ProjectTemplate } from "../types";

export const PROJECTS: ProjectTemplate[] = [
  {
    id: "proj_calc",
    title: "Cyberpunk Terminal Calculator",
    tier: "Beginner",
    category: "Utility Application",
    description: "Build a multi-operation calculator capable of addition, subtraction, multiplication, and division with formatted cyberpunk output.",
    starterCode: `def cyber_calc(a, b, operation):
    if operation == "add":
        return a + b
    elif operation == "subtract":
        return a - b
    elif operation == "multiply":
        return a * b
    elif operation == "divide":
        return a / b if b != 0 else "DIV_ZERO_ERROR"
    return "INVALID_OP"

# Test the calculator
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
    starterCode: `class CyberInventory:
    def __init__(self):
        self.items = {}

    def add_item(self, name, power):
        self.items[name] = power

    def get_total_power(self):
        return sum(self.items.values())

# Construct inventory
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
    starterCode: `def scan_security_ports(ports):
    vulnerabilities = []
    for port, status in ports.items():
        if status == "OPEN_UNENCRYPTED":
            vulnerabilities.append(port)
    return {
        "scanned": len(ports),
        "threats": vulnerabilities,
        "secure": len(vulnerabilities) == 0
    }

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
    starterCode: `class SupremeCityController:
    def __init__(self, name):
        self.name = name
        self.energy_reserves = 5000
        self.active_districts = ["Alpha", "Beta", "Gamma"]

    def balance_grid(self):
        allocation = self.energy_reserves // len(self.active_districts)
        grid_status = {}
        for district in self.active_districts:
            grid_status[district] = allocation
        return grid_status

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
