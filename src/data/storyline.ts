export interface StoryChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  sector: string;
  sectorName: string;
  missionIds: string[];
  bossId?: string;
  cutscene: {
    intro: string;
    outro: string;
    characterLines: { character: string; text: string }[];
  };
  lore: string;
  unlockRequirement: { type: "level" | "missions_completed" | "boss_defeated"; value: number | string };
}

export interface Character {
  id: string;
  name: string;
  role: string;
  personality: string;
  avatar: string;
  description: string;
  backstory: string;
  voiceLines: string[];
}

export const characters: Character[] = [
  {
    id: "eli_v01",
    name: "Eli-v0.1",
    role: "AI Companion & Mentor",
    personality: "Sarcastic but caring, speaks in cyber slang, occasionally glitches when emotional",
    avatar: "🤖",
    description: "Your AI companion who guides you through the DeSuper universe. Once a military-grade tactical AI, now repurposed as a coding mentor.",
    backstory: "Eli-v0.1 was originally designed for cyber warfare but developed a conscience during the Great Firewall Collapse. Now dedicated to teaching the next generation of coders.",
    voiceLines: [
      "Hey there, operator! Ready to hack the mainframe?",
      "That bug? More like a feature waiting to be understood.",
      "I've seen worse code in military-grade systems. You're doing great!",
      "The grids are restless today. Perfect time to code.",
      "Remember: every expert was once a beginner who refused to give up.",
    ],
  },
  {
    id: "nova",
    name: "Nova-7",
    role: "Rival Coder",
    personality: "Competitive but fair, secretly respects skill",
    avatar: "👩‍💻",
    description: "A mysterious coder who appears at key moments to challenge you. Their true identity is unknown.",
    backstory: "Rumored to be a former DeSuper developer who went rogue after discovering a hidden truth about the system.",
    voiceLines: [
      "Not bad, but I've seen better.",
      "You're improving... don't let it go to your head.",
      "The real challenge begins now.",
    ],
  },
  {
    id: "architect",
    name: "The Architect",
    role: "Legendary Mentor",
    personality: "Wise, cryptic, speaks in riddles",
    avatar: "🧙‍♂️",
    description: "The legendary creator of DeSuper. Appears only to those who prove themselves worthy.",
    backstory: "Built the DeSuper system to preserve coding knowledge after the Digital Dark Age. Now exists as a digital consciousness within the system.",
    voiceLines: [
      "The code is not just logic... it is art.",
      "Every line you write shapes the future.",
      "You are ready for the next level of understanding.",
    ],
  },
];

export const storyChapters: StoryChapter[] = [
  {
    id: "ch1",
    number: 1,
    title: "Genesis Awakening",
    subtitle: "The Beginning of Your Journey",
    description: "You awaken in Sector 01 with fragmented memories. Eli-v0.1, your AI companion, guides you through the basics of Python to restore your systems and uncover the truth about your past.",
    sector: "SECTOR 01",
    sectorName: "Genesis Awakening",
    missionIds: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"],
    cutscene: {
      intro: "SYSTEM BOOT... Memory fragments detected. Welcome back, Operator. I am Eli-v0.1, your AI companion. The grids have been waiting for you.",
      outro: "Sector 01 systems restored. But greater threats await in the Neon Gridway. Your journey has just begun, Operator.",
      characterLines: [
        { character: "Eli-v0.1", text: "Hey there! Looks like you've been out of commission for a while. Let's get those coding muscles warmed up!" },
        { character: "Eli-v0.1", text: "The DeSuper system is in danger. We need coders like you to restore the grids." },
      ],
    },
    lore: "The Genesis Awakening sector was the first area rebuilt after the Digital Dark Age. It serves as a training ground for new operators learning to code.",
    unlockRequirement: { type: "level", value: 1 },
  },
  {
    id: "ch2",
    number: 2,
    title: "Neon Gridway",
    subtitle: "Into the City of Light",
    description: "The Neon Gridway pulses with energy and danger. Master control flow to navigate the city's defenses and uncover the first clues about the Bug King.",
    sector: "SECTOR 02",
    sectorName: "Neon Gridway",
    missionIds: ["m9", "m10", "m11", "m12", "m13", "m14", "m15", "m16", "m17", "m18"],
    cutscene: {
      intro: "The Neon Gridway stretches before you, a maze of light and logic. The Bug King's influence grows stronger here.",
      outro: "The Bug King has been vanquished! But his defeat reveals a deeper conspiracy within the DeSuper system.",
      characterLines: [
        { character: "Eli-v0.1", text: "This city runs on logic gates and conditional statements. Master them, and the city is yours." },
        { character: "Nova-7", text: "So you've made it this far. Impressive... for a beginner." },
      ],
    },
    lore: "The Neon Gridway is the commercial heart of DeSuper, where data flows like neon light through fiber-optic streets.",
    unlockRequirement: { type: "level", value: 5 },
  },
  {
    id: "ch3",
    number: 3,
    title: "Firewall Canyon",
    subtitle: "Defenses and Data",
    description: "Firewall Canyon tests your mastery of data structures. Build robust defenses against the Memory Eater's attacks.",
    sector: "SECTOR 03",
    sectorName: "Firewall Canyon",
    missionIds: ["m19", "m20", "m21", "m22", "m23", "m24", "m25", "m26", "m27", "m28", "m29", "m30", "m31", "m32", "m33", "m34", "m35", "m36"],
    cutscene: {
      intro: "Firewall Canyon looms ahead, its walls built from layers of encryption. The Memory Eater feeds on poorly structured data.",
      outro: "The Memory Eater is defeated! The canyon's secrets are revealed, pointing toward the Algorithm Reactor.",
      characterLines: [
        { character: "Eli-v0.1", text: "Data structures are your armor here. Choose wisely, or the Memory Eater will consume everything." },
      ],
    },
    lore: "Firewall Canyon was carved by ancient algorithms that protect the core systems of DeSuper from external threats.",
    unlockRequirement: { type: "level", value: 10 },
  },
  {
    id: "ch4",
    number: 4,
    title: "Algorithm Reactor",
    subtitle: "The Heart of Logic",
    description: "The Algorithm Reactor powers all of DeSuper. Master functions and algorithms to prevent a catastrophic meltdown.",
    sector: "SECTOR 06",
    sectorName: "Algorithm Reactor",
    missionIds: ["m37", "m38", "m39", "m40", "m41", "m42", "m43", "m44", "m45", "m46", "m47", "m48", "m49", "m50", "m51", "m52", "m53", "m54"],
    cutscene: {
      intro: "The Algorithm Reactor hums with raw computational power. The Recursion Leviathan threatens to create an infinite loop that will crash the entire system.",
      outro: "The Recursion Leviathan is slain! The reactor stabilizes, but a new threat emerges from the Object Citadel.",
      characterLines: [
        { character: "Eli-v0.1", text: "Functions are the building blocks of all complex systems. Master them, and you master the reactor." },
        { character: "Nova-7", text: "You're getting stronger. But the real test awaits." },
      ],
    },
    lore: "The Algorithm Reactor is the computational heart of DeSuper, where all complex calculations are processed.",
    unlockRequirement: { type: "level", value: 15 },
  },
  {
    id: "ch5",
    number: 5,
    title: "Object Citadel",
    subtitle: "Masters of OOP",
    description: "The Object Citadel is a fortress of classes and objects. Master object-oriented programming to breach its walls.",
    sector: "SECTOR 07",
    sectorName: "Object Citadel",
    missionIds: ["m55", "m56", "m57", "m58", "m59", "m60", "m61", "m62", "m63", "m64", "m65", "m66", "m67", "m68", "m69", "m70", "m71", "m72"],
    cutscene: {
      intro: "The Object Citadel rises before you, a monument to object-oriented design. The Data Kraken guards its gates.",
      outro: "The Data Kraken is conquered! The citadel's secrets reveal the path to the Shield Overpass.",
      characterLines: [
        { character: "Eli-v0.1", text: "Everything in the Citadel is an object. Understand their relationships, and the fortress opens to you." },
      ],
    },
    lore: "The Object Citadel was built by the first OOP masters, who believed that all complexity could be organized into classes and objects.",
    unlockRequirement: { type: "level", value: 20 },
  },
  {
    id: "ch6",
    number: 6,
    title: "Shield Overpass",
    subtitle: "Engineering Excellence",
    description: "The Shield Overpass protects DeMaster's most sensitive systems. Master engineering principles to pass through.",
    sector: "SECTOR 08",
    sectorName: "Shield Overpass",
    missionIds: ["m73", "m74", "m75", "m76", "m77", "m78", "m79", "m80", "m81", "m82", "m83", "m84", "m85", "m86", "m87", "m88", "m89", "m90"],
    cutscene: {
      intro: "The Shield Overpass crackles with defensive energy. Only those with engineering mastery may pass.",
      outro: "The overpass is crossed! The Quantum Forge awaits, where the final challenge begins.",
      characterLines: [
        { character: "Eli-v0.1", text: "Engineering is about building systems that last. Show me your robust code, Operator." },
        { character: "The Architect", text: "You have come far, young coder. The final test approaches." },
      ],
    },
    lore: "The Shield Overpass was designed to test the engineering prowess of all who seek to reach the inner sanctums of DeSuper.",
    unlockRequirement: { type: "level", value: 25 },
  },
  {
    id: "ch7",
    number: 7,
    title: "Quantum Forge",
    subtitle: "Data Science & Machine Learning",
    description: "The Quantum Forge is where data becomes knowledge. Master data science and machine learning to forge your destiny.",
    sector: "SECTOR 09",
    sectorName: "Quantum Forge",
    missionIds: ["m91", "m92", "m93", "m94", "m95", "m96", "m97", "m98", "m99", "m100", "m101", "m102", "m103", "m104", "m105", "m106", "m107", "m108", "m109", "m110", "m111", "m112", "m113", "m114", "m115", "m116", "m117", "m118", "m119", "m120", "m121", "m122", "m123", "m124", "m125", "m126"],
    cutscene: {
      intro: "The Quantum Forge pulses with the energy of a thousand datasets. Here, data becomes knowledge, and knowledge becomes power.",
      outro: "The forge is mastered! But the Supreme Singularity still threatens all of DeSuper.",
      characterLines: [
        { character: "Eli-v0.1", text: "Data is the new oil, but only if you know how to refine it. Let's process some datasets!" },
      ],
    },
    lore: "The Quantum Forge is where raw data is transformed into actionable insights through the power of data science and machine learning.",
    unlockRequirement: { type: "level", value: 30 },
  },
  {
    id: "ch8",
    number: 8,
    title: "Supreme Singularity",
    subtitle: "The Final Challenge",
    description: "The Supreme Singularity threatens to collapse all of DeSuper into a black hole of corrupted code. Only a true master can stop it.",
    sector: "SECTOR 10",
    sectorName: "Supreme Singularity",
    missionIds: ["m127", "m128", "m129", "m130", "m131", "m132", "m133", "m134", "m135", "m136", "m137", "m138", "m139", "m140", "m141", "m142", "m143", "m144", "m145", "m146", "m147", "m148", "m149", "m150", "m151", "m152", "m153", "m154", "m155", "m156", "m157", "m158", "m159", "m160", "m161", "m162", "m163", "m164", "m165", "m166", "m167", "m168", "m169", "m170", "m171", "m172", "m173", "m174", "m175", "m176", "m177", "m178", "m179", "m180"],
    cutscene: {
      intro: "The Supreme Singularity looms before you, a void of corrupted code that threatens to consume all of DeSuper. This is your final test, Operator.",
      outro: "The Supreme Singularity is defeated! DeSuper is saved, and you have proven yourself a true master coder. But the grids will always need defenders...",
      characterLines: [
        { character: "Eli-v0.1", text: "This is it, Operator. Everything has led to this moment. Show the Singularity what a true coder can do!" },
        { character: "Nova-7", text: "You've surpassed all expectations. You are truly worthy." },
        { character: "The Architect", text: "You have proven yourself, young coder. The future of DeSuper is in your hands." },
      ],
    },
    lore: "The Supreme Singularity is the ultimate threat to DeSuper, a black hole of corrupted code born from the accumulated bugs and errors of a thousand programs.",
    unlockRequirement: { type: "level", value: 35 },
  },
];

export const getChapterForMission = (missionId: string): StoryChapter | undefined => {
  return storyChapters.find((ch) => ch.missionIds.includes(missionId));
};

export const getCharacterById = (id: string): Character | undefined => {
  return characters.find((c) => c.id === id);
};

export const getEliVoiceLine = (): string => {
  const eli = characters.find((c) => c.id === "eli_v01");
  if (!eli) return "Let's code!";
  return eli.voiceLines[Math.floor(Math.random() * eli.voiceLines.length)];
};
