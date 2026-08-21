import React, { useState } from "react";
import { PythonRuntime } from "../engine/pythonEngine";
import { ExecutionResult, VisualAction } from "../types";
import { CodeEditor } from "./CodeEditor";
import { VisualGameStage } from "./VisualGameStage";
import { Code, Sparkles, BookOpen, Download, Copy, Check } from "lucide-react";
import { sound } from "../utils/audio";

const CODE_PRESETS = [
  {
    name: "Robot Automation Loop",
    code: `# DeSuper Cyber Automation
for i in range(5):
    robot.move()
    collect_energy()

print("AUTOMATION COMPLETE: 50 MW GENERATED")
`,
  },
  {
    name: "Security Door Protocol",
    code: `passcode = 7788
door.unlock(passcode)
shield.engage()

print("DEFENSE PROTOCOL OPERATIONAL")
`,
  },
  {
    name: "Binary Search Algorithm",
    code: `def binary_search(arr, target):
    l, r = 0, len(arr) - 1
    while l <= r:
        m = (l + r) // 2
        if arr[m] == target:
            return m
        elif arr[m] < target:
            l = m + 1
        else:
            r = m - 1
    return -1

data = [10, 25, 50, 75, 100, 250, 500]
target_idx = binary_search(data, 100)
print(f"Target 100 located at index: {target_idx}")
`,
  },
  {
    name: "OOP Cyber Entity",
    code: `class CyberDrone:
    def __init__(self, codename):
        self.codename = codename
        self.battery = 100

    def patrol(self):
        robot.move(3)
        print(f"{self.codename} patrol routine finished.")

drone = CyberDrone("AURA-X")
drone.patrol()
`,
  },
];

export const PlaygroundView: React.FC = () => {
  const [currentCode, setCurrentCode] = useState(CODE_PRESETS[0].code);
  const [visualActions, setVisualActions] = useState<VisualAction[]>([]);
  const [copied, setCopied] = useState(false);

  const handleRunCode = (code: string): ExecutionResult => {
    sound.playRun();
    const result = PythonRuntime.execute(code);
    setVisualActions(result.visualActions);
    if (result.success) sound.playSuccess();
    else sound.playError();
    return result;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    sound.playKeyClick();
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
            <Code className="w-4 h-4" />
            <span>UNRESTRICTED PYTHON SANDBOX</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
            Cyber Terminal IDE
          </h1>
        </div>

        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 font-mono text-xs cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied!" : "Copy Code"}</span>
        </button>
      </div>

      {/* Preset Code Snippets Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[10px] font-mono text-slate-500 font-bold px-1">PRESETS:</span>
        {CODE_PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentCode(p.code);
              setVisualActions([]);
              sound.playKeyClick();
            }}
            className="px-3 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-cyan-300 font-mono text-xs rounded-xl whitespace-nowrap transition-colors cursor-pointer"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Visual Game Stage */}
      <VisualGameStage sceneType="robot_lab" visualActions={visualActions} />

      {/* Code Editor */}
      <CodeEditor
        initialCode={currentCode}
        onRunCode={handleRunCode}
        onResetCode={() => setVisualActions([])}
        onRequestHint={() => {
          sound.playKeyClick();
        }}
        currentHintLevel={1}
      />
    </div>
  );
};
