import { Mission } from "../../types";

export const RANK7_ARCHITECT_MISSIONS: Mission[] = [
  {
    id: "m109",
    rank: "ARCHITECT",
    number: 109,
    title: "Class Declaration & Instantiation",
    concept: "class & __init__ Constructor",
    difficulty: "Master",
    story: "Construct a CyberVehicle class blueprint with model and top_speed attributes.",
    objectives: [
      "Define CyberVehicle class with __init__(self, model, top_speed)",
      "Instantiate car = CyberVehicle('PHANTOM_GT', 450)",
      "Print f'{car.model} @ {car.top_speed} KM/H'",
    ],
    conceptExplanation: "Classes are blueprints for creating objects. The __init__ method initializes new instance attributes.",
    starterCode: `class CyberVehicle:
    def __init__(self, model, top_speed):
        self.model = model
        self.top_speed = top_speed

car = CyberVehicle("PHANTOM_GT", 450)
print(f"{car.model} @ {car.top_speed} KM/H")
`,
    validationRules: {
      requiredKeywords: ["class CyberVehicle:", "def __init__(self, model, top_speed):", "self.model =", "print"],
      requiredOutputIncludes: ["PHANTOM_GT @ 450 KM/H"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Define class with __init__." },
      { level: 2, label: "Concept", text: "Assign self.model and self.top_speed." },
      { level: 3, label: "Example", text: 'car = CyberVehicle("PHANTOM_GT", 450)\nprint(f"{car.model} @ {car.top_speed} KM/H")' },
      { level: 4, label: "Solution", text: "Execute class definition and instantiation." },
    ],
    xpReward: 650,
    coinsReward: 325,
    skillIdToUnlock: "py_classes",
    worldSceneType: "quantum_forge",
  },
  {
    id: "m110",
    rank: "ARCHITECT",
    number: 110,
    title: "Instance Methods & Self",
    concept: "Instance Methods",
    difficulty: "Master",
    story: "Add an accelerate(boost_amount) instance method to CyberVehicle.",
    objectives: [
      "Add accelerate(self, boost_amount) method to update self.current_speed",
      "Call car.accelerate(50)",
      "Print car.current_speed",
    ],
    conceptExplanation: "Methods are functions defined inside a class that operate on instance data via 'self'.",
    starterCode: `class CyberVehicle:
    def __init__(self, model):
        self.model = model
        self.current_speed = 100

    def accelerate(self, boost_amount):
        self.current_speed += boost_amount

car = CyberVehicle("VIPER")
car.accelerate(50)
print(car.current_speed)
`,
    validationRules: {
      requiredKeywords: ["def accelerate(self, boost_amount):", "self.current_speed +=", "print"],
      requiredOutputIncludes: ["150"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Define accelerate method taking self and boost_amount." },
      { level: 2, label: "Concept", text: "100 + 50 = 150." },
      { level: 3, label: "Example", text: "car.accelerate(50)\nprint(car.current_speed)" },
      { level: 4, label: "Solution", text: "Execute instance method acceleration." },
    ],
    xpReward: 655,
    coinsReward: 325,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m111",
    rank: "ARCHITECT",
    number: 111,
    title: "Class Inheritance & Extensibility",
    concept: "Subclasses & Inheritance",
    difficulty: "Master",
    story: "Derive a specialized WarpRacer subclass from the base Vehicle class.",
    objectives: [
      "Create class WarpRacer(Vehicle)",
      "Add engage_warp(self) method returning 'WARP SPEED ACTIVATED'",
      "Call racer.engage_warp()",
      "Print result",
    ],
    conceptExplanation: "Subclasses inherit attributes and methods from their parent (superclass).",
    starterCode: `class Vehicle:
    def __init__(self, name):
        self.name = name

class WarpRacer(Vehicle):
    def engage_warp(self):
        return f"{self.name}: WARP SPEED ACTIVATED"

racer = WarpRacer("STEALTH_99")
print(racer.engage_warp())
`,
    validationRules: {
      requiredKeywords: ["class WarpRacer(Vehicle):", "def engage_warp(self):", "print"],
      requiredOutputIncludes: ["STEALTH_99: WARP SPEED ACTIVATED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Inherit with class WarpRacer(Vehicle):." },
      { level: 2, label: "Concept", text: "WarpRacer gets self.name from Vehicle." },
      { level: 3, label: "Example", text: 'racer = WarpRacer("STEALTH_99")\nprint(racer.engage_warp())' },
      { level: 4, label: "Solution", text: "Execute class inheritance." },
    ],
    xpReward: 660,
    coinsReward: 330,
    skillIdToUnlock: "py_inheritance",
    worldSceneType: "quantum_forge",
  },
  {
    id: "m112",
    rank: "ARCHITECT",
    number: 112,
    title: "Super Constructor Calling with super()",
    concept: "super().__init__()",
    difficulty: "Master",
    story: "Extend vehicle parent initialization using super() to add hyper_drive capacity.",
    objectives: [
      "Call super().__init__(name, speed) in HyperVehicle",
      "Assign self.hyper_drive = hyper_drive",
      "Print f'{hv.name} | SPEED: {hv.speed} | HYPER: {hv.hyper_drive}'",
    ],
    conceptExplanation: "super() delegates method calls to the parent superclass, ensuring proper base initialization.",
    starterCode: `class Vehicle:
    def __init__(self, name, speed):
        self.name = name
        self.speed = speed

class HyperVehicle(Vehicle):
    def __init__(self, name, speed, hyper_drive):
        super().__init__(name, speed)
        self.hyper_drive = hyper_drive

hv = HyperVehicle("TITAN", 500, True)
print(f"{hv.name} | SPEED: {hv.speed} | HYPER: {hv.hyper_drive}")
`,
    validationRules: {
      requiredKeywords: ["super().__init__(name, speed)", "self.hyper_drive =", "print"],
      requiredOutputIncludes: ["TITAN | SPEED: 500 | HYPER: True"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Call super().__init__(name, speed)." },
      { level: 2, label: "Concept", text: "Initializes parent fields cleanly." },
      { level: 3, label: "Example", text: 'hv = HyperVehicle("TITAN", 500, True)' },
      { level: 4, label: "Solution", text: "Execute super() constructor chaining." },
    ],
    xpReward: 665,
    coinsReward: 330,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m113",
    rank: "ARCHITECT",
    number: 113,
    title: "String Representation: __str__ & __repr__",
    concept: "Magic Methods __str__ and __repr__",
    difficulty: "Master",
    story: "Implement human-readable __str__ formatting for vehicle telemetry objects.",
    objectives: [
      "Implement def __str__(self): return f'<Vehicle: {self.name}>'",
      "Print str(v)",
    ],
    conceptExplanation: "__str__ defines the informal string representation returned by str() and print().",
    starterCode: `class Vehicle:
    def __init__(self, name):
        self.name = name

    def __str__(self):
        return f"<Vehicle: {self.name}>"

v = Vehicle("TITANIUM_X")
print(str(v))
`,
    validationRules: {
      requiredKeywords: ["def __str__(self):", "return f\"<Vehicle: {self.name}>\"", "print"],
      requiredOutputIncludes: ["<Vehicle: TITANIUM_X>"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Define def __str__(self):." },
      { level: 2, label: "Concept", text: "Returns custom string for print()." },
      { level: 3, label: "Example", text: "print(str(v))" },
      { level: 4, label: "Solution", text: "Execute __str__ magic method." },
    ],
    xpReward: 670,
    coinsReward: 335,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m114",
    rank: "ARCHITECT",
    number: 114,
    title: "Encapsulation: Private Attributes & Name Mangling",
    concept: "Private Attributes (_protected and __private)",
    difficulty: "Master",
    story: "Protect the core nuclear reactor key from external direct tampering.",
    objectives: [
      "Set self.__reactor_key = 9988 in Core",
      "Implement get_key(self) method to access it safely",
      "Print core.get_key()",
    ],
    conceptExplanation: "Prefixing an attribute with '__' invokes name mangling (_ClassName__attribute) for privacy.",
    starterCode: `class Core:
    def __init__(self):
        self.__reactor_key = 9988

    def get_key(self):
        return self.__reactor_key

core = Core()
print(core.get_key())
`,
    validationRules: {
      requiredKeywords: ["self.__reactor_key =", "def get_key(self):", "print"],
      requiredOutputIncludes: ["9988"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use self.__reactor_key and getter method." },
      { level: 2, label: "Concept", text: "Getter provides controlled read access." },
      { level: 3, label: "Example", text: "print(core.get_key())" },
      { level: 4, label: "Solution", text: "Execute encapsulated attribute access." },
    ],
    xpReward: 675,
    coinsReward: 335,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m115",
    rank: "ARCHITECT",
    number: 115,
    title: "The @property Getter & Setter",
    concept: "Property Decorators (@property, @var.setter)",
    difficulty: "Master",
    story: "Enforce valid battery percentage ranges (0 to 100) using a @property setter.",
    objectives: [
      "Define @property charge",
      "Define @charge.setter with range validation (max 100)",
      "Set battery.charge = 150 (clamped to 100)",
      "Print battery.charge",
    ],
    conceptExplanation: "@property turns methods into attribute getters, while @name.setter defines validation logic.",
    starterCode: `class Battery:
    def __init__(self):
        self._charge = 100

    @property
    def charge(self):
        return self._charge

    @charge.setter
    def charge(self, val):
        self._charge = min(100, max(0, val))

b = Battery()
b.charge = 150
print(b.charge)
`,
    validationRules: {
      requiredKeywords: ["@property", "@charge.setter", "min(100, max(0, val))", "print"],
      requiredOutputIncludes: ["100"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use @property and @charge.setter." },
      { level: 2, label: "Concept", text: "Clamps value to 100." },
      { level: 3, label: "Example", text: "b.charge = 150\nprint(b.charge)" },
      { level: 4, label: "Solution", text: "Execute property validation." },
    ],
    xpReward: 680,
    coinsReward: 340,
    skillIdToUnlock: "py_properties",
    worldSceneType: "quantum_forge",
  },
  {
    id: "m116",
    rank: "ARCHITECT",
    number: 116,
    title: "Class Methods (@classmethod) & Factory Constructors",
    concept: "@classmethod & cls",
    difficulty: "Master",
    story: "Implement an alternate constructor factory create_turbo_model(cls, name).",
    objectives: [
      "Define @classmethod create_turbo_model(cls, name)",
      "Instantiate model using Racer.create_turbo_model('BLAZE')",
      "Print model.speed",
    ],
    conceptExplanation: "@classmethod receives the class object 'cls' instead of an instance 'self', often used for alternative constructors.",
    starterCode: `class Racer:
    def __init__(self, name, speed):
        self.name = name
        self.speed = speed

    @classmethod
    def create_turbo_model(cls, name):
        return cls(name, speed=500)

r = Racer.create_turbo_model("BLAZE")
print(r.speed)
`,
    validationRules: {
      requiredKeywords: ["@classmethod", "def create_turbo_model(cls, name):", "return cls(", "print"],
      requiredOutputIncludes: ["500"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use @classmethod with cls parameter." },
      { level: 2, label: "Concept", text: "Instantiates object with pre-set turbo speed." },
      { level: 3, label: "Example", text: 'r = Racer.create_turbo_model("BLAZE")\nprint(r.speed)' },
      { level: 4, label: "Solution", text: "Execute classmethod factory." },
    ],
    xpReward: 685,
    coinsReward: 340,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m117",
    rank: "ARCHITECT",
    number: 117,
    title: "Static Methods (@staticmethod)",
    concept: "@staticmethod Utility Functions",
    difficulty: "Master",
    story: "Add a pure mathematical conversion utility to the Vehicle class without binding to instances.",
    objectives: [
      "Define @staticmethod kmh_to_mph(kmh): return round(kmh * 0.621371)",
      "Call Vehicle.kmh_to_mph(300)",
      "Print result",
    ],
    conceptExplanation: "@staticmethod is a self-contained utility function attached to a class namespace without self or cls.",
    starterCode: `class Vehicle:
    @staticmethod
    def kmh_to_mph(kmh):
        return round(kmh * 0.621371)

print(Vehicle.kmh_to_mph(300))
`,
    validationRules: {
      requiredKeywords: ["@staticmethod", "def kmh_to_mph(kmh):", "print"],
      requiredOutputIncludes: ["186"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use @staticmethod." },
      { level: 2, label: "Concept", text: "round(300 * 0.621371) is 186." },
      { level: 3, label: "Example", text: "print(Vehicle.kmh_to_mph(300))" },
      { level: 4, label: "Solution", text: "Execute static utility method." },
    ],
    xpReward: 690,
    coinsReward: 345,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m118",
    rank: "ARCHITECT",
    number: 118,
    title: "Operator Overloading: __add__",
    concept: "Operator Overloading (__add__)",
    difficulty: "Master",
    story: "Overload the '+' operator to combine the cargo weights of two freight containers.",
    objectives: [
      "Implement def __add__(self, other): return Container(self.weight + other.weight)",
      "Add c1 + c2",
      "Print combined.weight",
    ],
    conceptExplanation: "Dunder methods like __add__ customize how built-in operators behave on user-defined objects.",
    starterCode: `class Container:
    def __init__(self, weight):
        self.weight = weight

    def __add__(self, other):
        return Container(self.weight + other.weight)

c1 = Container(50)
c2 = Container(75)
combined = c1 + c2
print(combined.weight)
`,
    validationRules: {
      requiredKeywords: ["def __add__(self, other):", "c1 + c2", "print"],
      requiredOutputIncludes: ["125"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Implement __add__(self, other)." },
      { level: 2, label: "Concept", text: "50 + 75 = 125." },
      { level: 3, label: "Example", text: "combined = c1 + c2\nprint(combined.weight)" },
      { level: 4, label: "Solution", text: "Execute operator overloading." },
    ],
    xpReward: 695,
    coinsReward: 345,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m119",
    rank: "ARCHITECT",
    number: 119,
    title: "Sequence Protocol: __len__ & __getitem__",
    concept: "Custom Indexable Containers",
    difficulty: "Master",
    story: "Build a Fleet container that supports len(fleet) and bracket indexing fleet[0].",
    objectives: [
      "Implement __len__ returning len(self.racers)",
      "Implement __getitem__(self, idx) returning self.racers[idx]",
      "Print len(fleet) and fleet[1]",
    ],
    conceptExplanation: "__len__ and __getitem__ make your custom classes act like native Python sequences.",
    starterCode: `class Fleet:
    def __init__(self, racers):
        self.racers = racers

    def __len__(self):
        return len(self.racers)

    def __getitem__(self, idx):
        return self.racers[idx]

fleet = Fleet(["PHANTOM", "VIPER", "TITAN"])
print(f"COUNT: {len(fleet)} | FIRST: {fleet[0]}")
`,
    validationRules: {
      requiredKeywords: ["def __len__(self):", "def __getitem__(self, idx):", "print"],
      requiredOutputIncludes: ["COUNT: 3 | FIRST: PHANTOM"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Implement __len__ and __getitem__." },
      { level: 2, label: "Concept", text: "Allows len() and [index] syntax on the object." },
      { level: 3, label: "Example", text: "print(f'COUNT: {len(fleet)} | FIRST: {fleet[0]}')" },
      { level: 4, label: "Solution", text: "Execute sequence protocol." },
    ],
    xpReward: 700,
    coinsReward: 350,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m120",
    rank: "ARCHITECT",
    number: 120,
    title: "Modern Python @dataclass",
    concept: "dataclasses (@dataclass)",
    difficulty: "Master",
    story: "Declare a modern, boilerplate-free PilotData model using @dataclass.",
    objectives: [
      "From dataclasses import dataclass",
      "Create @dataclass PilotData with pilot_id: str, rank: int, active: bool = True",
      "Instantiate p = PilotData('DES_01', 7)",
      "Print p",
    ],
    conceptExplanation: "The @dataclass decorator automatically generates __init__, __repr__, and __eq__ methods for data classes.",
    starterCode: `from dataclasses import dataclass

@dataclass
class PilotData:
    pilot_id: str
    rank: int
    active: bool = True

p = PilotData("DES_01", 7)
print(p)
`,
    validationRules: {
      requiredKeywords: ["from dataclasses import dataclass", "@dataclass", "pilot_id: str", "print"],
      requiredOutputIncludes: ["PilotData(pilot_id='DES_01', rank=7, active=True)"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use @dataclass decorator." },
      { level: 2, label: "Concept", text: "Auto-generates clean dataclass representations." },
      { level: 3, label: "Example", text: 'p = PilotData("DES_01", 7)\nprint(p)' },
      { level: 4, label: "Solution", text: "Execute dataclass declaration." },
    ],
    xpReward: 705,
    coinsReward: 350,
    skillIdToUnlock: "py_dataclasses",
    worldSceneType: "quantum_forge",
  },
  {
    id: "m121",
    rank: "ARCHITECT",
    number: 121,
    title: "Composition Over Inheritance",
    concept: "Object Composition Pattern",
    difficulty: "Master",
    story: "Equip a Vehicle with an Engine object component rather than inheriting from it.",
    objectives: [
      "Pass Engine instance into Vehicle",
      "Call vehicle.engine.ignite()",
      "Print result",
    ],
    conceptExplanation: "Composition models 'has-a' relationships by assembling smaller objects into larger components.",
    starterCode: `class Engine:
    def ignite(self):
        return "ENGINE: FIRED UP (1000 HP)"

class Vehicle:
    def __init__(self, engine):
        self.engine = engine

v = Vehicle(Engine())
print(v.engine.ignite())
`,
    validationRules: {
      requiredKeywords: ["class Engine:", "self.engine = engine", "print"],
      requiredOutputIncludes: ["ENGINE: FIRED UP (1000 HP)"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Pass Engine() to Vehicle." },
      { level: 2, label: "Concept", text: "v.engine.ignite() calls the component method." },
      { level: 3, label: "Example", text: "v = Vehicle(Engine())\nprint(v.engine.ignite())" },
      { level: 4, label: "Solution", text: "Execute object composition." },
    ],
    xpReward: 710,
    coinsReward: 355,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m122",
    rank: "ARCHITECT",
    number: 122,
    title: "Polymorphism: Unified Interfaces",
    concept: "Polymorphism & Duck Typing",
    difficulty: "Master",
    story: "Trigger launch_subsystem() on a diverse list of subsystem objects (Radar, Nitro, Shields).",
    objectives: [
      "Iterate over [Radar(), Nitro(), Shield()]",
      "Call .activate() on each",
    ],
    conceptExplanation: "Polymorphism allows different classes to share identical method interfaces.",
    starterCode: `class Radar:
    def activate(self):
        return "RADAR ONLINE"

class Nitro:
    def activate(self):
        return "NITRO ONLINE"

subsystems = [Radar(), Nitro()]
for sub in subsystems:
    print(sub.activate())
`,
    validationRules: {
      requiredKeywords: ["def activate(self):", "sub.activate()", "print"],
      requiredOutputIncludes: ["RADAR ONLINE", "NITRO ONLINE"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Call .activate() uniformly." },
      { level: 2, label: "Concept", text: "Different classes respond to the same method." },
      { level: 3, label: "Example", text: "for sub in subsystems:\n    print(sub.activate())" },
      { level: 4, label: "Solution", text: "Execute polymorphic dispatch." },
    ],
    xpReward: 715,
    coinsReward: 355,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m123",
    rank: "ARCHITECT",
    number: 123,
    title: "Context Managers & The 'with' Statement",
    concept: "__enter__ and __exit__ Context Protocol",
    difficulty: "Master",
    story: "Build a TurboMode context manager that safely enables and restores power levels.",
    objectives: [
      "Implement __enter__ and __exit__ methods",
      "Use with TurboMode(): print inside block",
    ],
    conceptExplanation: "Context managers manage resource setup and cleanup using '__enter__' and '__exit__'.",
    starterCode: `class TurboMode:
    def __enter__(self):
        print("TURBO: ACTIVATED")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print("TURBO: DEACTIVATED")

with TurboMode():
    print("RACING AT WARP SPEED")
`,
    validationRules: {
      requiredKeywords: ["def __enter__(self):", "def __exit__(self,", "with TurboMode():", "print"],
      requiredOutputIncludes: ["TURBO: ACTIVATED", "RACING AT WARP SPEED", "TURBO: DEACTIVATED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Implement __enter__ and __exit__." },
      { level: 2, label: "Concept", text: "__exit__ always runs upon leaving the with block." },
      { level: 3, label: "Example", text: "with TurboMode():\n    print('RACING AT WARP SPEED')" },
      { level: 4, label: "Solution", text: "Execute custom context manager." },
    ],
    xpReward: 720,
    coinsReward: 360,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m124",
    rank: "ARCHITECT",
    number: 124,
    title: "Abstract Base Classes (abc.ABC)",
    concept: "abc.ABC & @abstractmethod",
    difficulty: "Master",
    story: "Enforce contract compliance on vehicle controllers using abc.ABC.",
    objectives: [
      "Inherit ABC and decorate abstract method @abstractmethod def steer()",
      "Subclass and implement steer()",
      "Print result",
    ],
    conceptExplanation: "Abstract base classes define interface contracts that derived classes MUST implement.",
    starterCode: `from abc import ABC, abstractmethod

class BaseController(ABC):
    @abstractmethod
    def steer(self):
        pass

class CyberController(BaseController):
    def steer(self):
        return "STEERING: LOCKED ON COURSE"

ctrl = CyberController()
print(ctrl.steer())
`,
    validationRules: {
      requiredKeywords: ["from abc import ABC, abstractmethod", "@abstractmethod", "def steer(self):", "print"],
      requiredOutputIncludes: ["STEERING: LOCKED ON COURSE"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Use ABC and @abstractmethod." },
      { level: 2, label: "Concept", text: "Derived class implements steer()." },
      { level: 3, label: "Example", text: "ctrl = CyberController()\nprint(ctrl.steer())" },
      { level: 4, label: "Solution", text: "Execute abstract class implementation." },
    ],
    xpReward: 725,
    coinsReward: 360,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m125",
    rank: "ARCHITECT",
    number: 125,
    title: "Slot Optimization: __slots__",
    concept: "__slots__ Memory Optimization",
    difficulty: "Master",
    story: "Optimize millions of TelemetryPoint objects by locking memory layout with __slots__.",
    objectives: [
      "Define __slots__ = ('x', 'y')",
      "Instantiate and print point coordinates",
    ],
    conceptExplanation: "__slots__ prevents dynamic instance dict creation, drastically reducing memory footprint.",
    starterCode: `class TelemetryPoint:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x = x
        self.y = y

pt = TelemetryPoint(100, 200)
print(f"POINT: ({pt.x}, {pt.y})")
`,
    validationRules: {
      requiredKeywords: ["__slots__ = (\"x\", \"y\")", "pt.x", "print"],
      requiredOutputIncludes: ["POINT: (100, 200)"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Declare __slots__ tuple." },
      { level: 2, label: "Concept", text: "Restricts attribute creation for speed and memory efficiency." },
      { level: 3, label: "Example", text: "print(f'POINT: ({pt.x}, {pt.y})')" },
      { level: 4, label: "Solution", text: "Execute slots optimization." },
    ],
    xpReward: 730,
    coinsReward: 365,
    worldSceneType: "quantum_forge",
  },
  {
    id: "m126",
    rank: "ARCHITECT",
    number: 126,
    title: "Architect Rank Capstone: Quantum OOP Forge",
    concept: "Architect Mastery Synthesis",
    difficulty: "Master",
    story: "Design the entire vehicle manufacturing pipeline leveraging OOP, dataclasses, properties, and magic methods.",
    objectives: [
      "Instantiate full production vehicle object hierarchy",
      "Print 'QUANTUM OOP FORGE ONLINE: ARCHITECT MASTERY ACHIEVED'",
    ],
    conceptExplanation: "You have mastered Python Object-Oriented Architecture, class hierarchies, dataclasses, and design patterns!",
    starterCode: `from dataclasses import dataclass

@dataclass
class EngineSpec:
    hp: int
    turbo: bool

class MegaRacer:
    def __init__(self, name: str, spec: EngineSpec):
        self.name = name
        self.spec = spec

    def __str__(self):
        return f"<MegaRacer: {self.name} | {self.spec.hp}HP>"

car = MegaRacer("QUANTUM_ZENITH", EngineSpec(hp=1200, turbo=True))
print(str(car))
print("QUANTUM OOP FORGE ONLINE: ARCHITECT MASTERY ACHIEVED")
`,
    validationRules: {
      requiredKeywords: ["@dataclass", "class MegaRacer:", "def __str__(self):", "print"],
      requiredOutputIncludes: ["<MegaRacer: QUANTUM_ZENITH | 1200HP>", "QUANTUM OOP FORGE ONLINE: ARCHITECT MASTERY ACHIEVED"],
    },
    hints: [
      { level: 1, label: "Subtle Clue", text: "Build the complete dataclass and composite class." },
      { level: 2, label: "Concept", text: "Demonstrates full OOP architecture." },
      { level: 3, label: "Example", text: 'print("QUANTUM OOP FORGE ONLINE: ARCHITECT MASTERY ACHIEVED")' },
      { level: 4, label: "Solution", text: "Execute Architect Capstone script." },
    ],
    xpReward: 750,
    coinsReward: 375,
    skillIdToUnlock: "py_architect_mastery",
    worldSceneType: "quantum_forge",
  },
];
