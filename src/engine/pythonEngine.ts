import { ExecutionResult, VisualAction } from "../types";

export class PythonRuntime {
  public static execute(
    code: string,
    customContext: Record<string, any> = {}
  ): ExecutionResult {
    const startTime = performance.now();
    const output: string[] = [];
    const visualActions: VisualAction[] = [];
    const variables: Record<string, any> = {};

    // 1. Basic pre-validation & syntax check
    const syntaxError = this.checkSyntax(code);
    if (syntaxError) {
      return {
        success: false,
        output: [],
        error: syntaxError,
        variables: {},
        visualActions: [{ type: "error_glitch", message: syntaxError.message }],
        executionTimeMs: performance.now() - startTime,
      };
    }

    // 2. Setup game world interactive objects
    const gameWorld = {
      terminal: {
        activate: (msg = "ONLINE") => {
          visualActions.push({ type: "terminal_activate", message: String(msg) });
          output.push(`[SYSTEM]: Terminal activated -> "${msg}"`);
          return true;
        },
        send: (payload: any) => {
          visualActions.push({ type: "terminal_activate", payload });
          output.push(`[SYSTEM]: Transmission received: ${JSON.stringify(payload)}`);
          return true;
        },
      },
      door: {
        isOpen: false,
        open: () => {
          gameWorld.door.isOpen = true;
          visualActions.push({ type: "door_open" });
          output.push("[SECURITY]: Blast doors unsealed.");
          return true;
        },
        close: () => {
          gameWorld.door.isOpen = false;
          visualActions.push({ type: "door_close" });
          output.push("[SECURITY]: Blast doors locked.");
          return true;
        },
        unlock: (code: any) => {
          gameWorld.door.isOpen = true;
          visualActions.push({ type: "door_open", payload: code });
          output.push(`[SECURITY]: Access granted with passcode ${code}.`);
          return true;
        },
      },
      robot: {
        name: "AURA-BOT",
        health: 100,
        energy: 100,
        x: 0,
        y: 0,
        move: (steps = 1) => {
          for (let i = 0; i < Math.min(steps, 10); i++) {
            gameWorld.robot.x += 1;
            visualActions.push({ type: "robot_move", payload: { x: gameWorld.robot.x } });
          }
          output.push(`[ROBOT]: Moved forward ${steps} step(s). Current Position: (${gameWorld.robot.x}, ${gameWorld.robot.y})`);
          return gameWorld.robot.x;
        },
        scan: () => {
          visualActions.push({ type: "robot_scan" });
          output.push(`[ROBOT]: Area scanned. No immediate threats detected.`);
          return { status: "clean", anomalies: 0 };
        },
        recharge: (amount = 50) => {
          gameWorld.robot.energy = Math.min(100, gameWorld.robot.energy + amount);
          visualActions.push({ type: "robot_recharge", payload: gameWorld.robot.energy });
          output.push(`[ROBOT]: Power cells recharged to ${gameWorld.robot.energy}%.`);
          return gameWorld.robot.energy;
        },
        shoot: (target = "Target Anomaly") => {
          visualActions.push({ type: "robot_shoot", message: target });
          output.push(`[ROBOT]: Laser fired at ${target}!`);
          return true;
        },
      },
      drone: {
        fly_to: (x: number, y: number) => {
          visualActions.push({ type: "drone_fly", payload: { x, y } });
          output.push(`[DRONE]: Autonomous scout deployed to waypoint (${x}, ${y}).`);
          return true;
        },
      },
      shield: {
        engage: () => {
          visualActions.push({ type: "shield_engage" });
          output.push(`[DEFENSE]: Plasma shield active.`);
          return true;
        },
        set_frequency: (freq: number) => {
          visualActions.push({ type: "shield_engage", payload: freq });
          output.push(`[DEFENSE]: Shield harmonic aligned to ${freq} MHz.`);
          return true;
        },
      },
      energy_grid: {
        divert: (zone: string, amount: number) => {
          visualActions.push({ type: "energy_collect", payload: { zone, amount } });
          output.push(`[GRID]: Diverted ${amount} MW to Sector ${zone}.`);
          return true;
        },
      },
      collect_energy: () => {
        visualActions.push({ type: "energy_collect" });
        output.push(`[HARVESTER]: 10 Energy Units gathered.`);
        return 10;
      },
      activate_door: () => {
        gameWorld.door.open();
        return true;
      },
      recharge: () => {
        gameWorld.robot.recharge(50);
        return true;
      },
      system: {
        repair: (nodeName: string) => {
          visualActions.push({ type: "system_repair", message: nodeName });
          output.push(`[CORE]: Sector ${nodeName} repaired successfully.`);
          return true;
        },
      },
      enemy: {
        health: 100,
        take_damage: (amount: number) => {
          gameWorld.enemy.health = Math.max(0, gameWorld.enemy.health - amount);
          visualActions.push({ type: "enemy_damage", payload: gameWorld.enemy.health });
          output.push(`[COMBAT]: Bug entity suffered ${amount} damage! Remaining HP: ${gameWorld.enemy.health}`);
          return gameWorld.enemy.health;
        },
      },
      city: {
        manage_traffic: (level: number) => {
          visualActions.push({ type: "city_boost", payload: { traffic: level } });
          output.push(`[CITY-OS]: Traffic synchronization stabilized at Level ${level}.`);
          return true;
        },
        boost_power: () => {
          visualActions.push({ type: "city_boost", payload: { power: 100 } });
          output.push(`[CITY-OS]: Main power grid set to 100% capacity.`);
          return true;
        },
      },
    };

    // Helper functions in Python standard environment
    const builtins: Record<string, any> = {
      print: (...args: any[]) => {
        const line = args
          .map((a) => (typeof a === "object" && a !== null ? JSON.stringify(a) : String(a)))
          .join(" ");
        output.push(line);
        visualActions.push({ type: "print", message: line });
      },
      len: (obj: any) => {
        if (obj === undefined || obj === null) throw new Error("TypeError: object of type 'NoneType' has no len()");
        return obj.length !== undefined ? obj.length : Object.keys(obj).length;
      },
      range: (start: number, end?: number, step = 1) => {
        const res: number[] = [];
        let s = end === undefined ? 0 : start;
        let e = end === undefined ? start : end;
        if (step === 0) throw new Error("ValueError: range() arg 3 must not be zero");
        if (step > 0) {
          for (let i = s; i < e; i += step) {
            if (res.length > 5000) break; // safety guard
            res.push(i);
          }
        } else {
          for (let i = s; i > e; i += step) {
            if (res.length > 5000) break;
            res.push(i);
          }
        }
        return res;
      },
      int: (val: any) => {
        const num = parseInt(val, 10);
        if (isNaN(num)) throw new Error(`ValueError: invalid literal for int() with base 10: '${val}'`);
        return num;
      },
      float: (val: any) => {
        const num = parseFloat(val);
        if (isNaN(num)) throw new Error(`ValueError: could not convert string to float: '${val}'`);
        return num;
      },
      str: (val: any) => (typeof val === "object" ? JSON.stringify(val) : String(val)),
      bool: (val: any) => Boolean(val),
      sum: (list: number[]) => (Array.isArray(list) ? list.reduce((a, b) => a + b, 0) : 0),
      min: (...args: any[]) => {
        const flat = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
        return Math.min(...flat);
      },
      max: (...args: any[]) => {
        const flat = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
        return Math.max(...flat);
      },
      sorted: (list: any[]) => [...list].sort((a, b) => (a > b ? 1 : -1)),
      abs: (val: number) => Math.abs(val),
      round: (val: number, decimals = 0) => {
        const factor = Math.pow(10, decimals);
        return Math.round(val * factor) / factor;
      },
      type: (val: any) => {
        if (Array.isArray(val)) return "<class 'list'>";
        if (val === null) return "<class 'NoneType'>";
        if (typeof val === "number") return Number.isInteger(val) ? "<class 'int'>" : "<class 'float'>";
        if (typeof val === "string") return "<class 'str'>";
        if (typeof val === "boolean") return "<class 'bool'>";
        if (typeof val === "object") return "<class 'dict'>";
        return `<class '${typeof val}'>`;
      },
      input: (promptText = "") => {
        if (promptText) output.push(String(promptText));
        return "DeSuper Player";
      },
      True: true,
      False: false,
      None: null,
      json: {
        loads: (str: string) => JSON.parse(str),
        dumps: (obj: any) => JSON.stringify(obj),
      },
      math: {
        pi: Math.PI,
        sqrt: Math.sqrt,
        floor: Math.floor,
        ceil: Math.ceil,
      },
    };

    // 3. Transpile Python constructs to safe executable JavaScript
    try {
      const transpiled = this.transpilePythonToJS(code);
      const executionScope = {
        ...builtins,
        ...gameWorld,
        ...customContext,
      };

      // Construct a safe isolated function runner
      const scopeKeys = Object.keys(executionScope);
      const scopeValues = Object.values(executionScope);

      const runner = new Function(
        ...scopeKeys,
        `"use strict";
        const __vars = {};
        try {
          ${transpiled}
        } catch(e) {
          throw e;
        }
        return { __vars };`
      );

      const result = runner(...scopeValues);

      // Collect user variables
      if (result && result.__vars) {
        Object.assign(variables, result.__vars);
      }

      return {
        success: true,
        output,
        variables,
        visualActions,
        executionTimeMs: Math.round(performance.now() - startTime),
      };
    } catch (err: any) {
      const parsedError = this.parseRuntimeError(err, code);
      return {
        success: false,
        output,
        error: parsedError,
        variables,
        visualActions: [{ type: "error_glitch", message: parsedError.message }],
        executionTimeMs: Math.round(performance.now() - startTime),
      };
    }
  }

  private static checkSyntax(code: string) {
    const lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      const lineNum = i + 1;

      if (!trimmed || trimmed.startsWith("#")) continue;

      // Check unclosed quotes
      const singleQuotes = (line.match(/'/g) || []).length;
      const doubleQuotes = (line.match(/"/g) || []).length;
      if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
        return {
          type: "SyntaxError: EOL while scanning string literal",
          line: lineNum,
          message: `Unclosed quotation mark on line ${lineNum}`,
          whatHappened: `A string quotation was opened on line ${lineNum} but never closed before the line ended.`,
          whyItHappened: `In Python, every opening quote (' or ") must have a matching closing quote on the same line.`,
          conceptHint: `Check that all text strings have both opening and closing quotation marks.`,
          exampleFix: `print("SYSTEM ONLINE")  # Both quotes closed!`,
        };
      }

      // Check missing colon on control flow
      const startsWithControl = /^(if|elif|else|for|while|def|class|try|except|finally)\b/.test(trimmed);
      if (startsWithControl && !trimmed.endsWith(":") && !trimmed.includes("#")) {
        return {
          type: "SyntaxError: expected ':'",
          line: lineNum,
          message: `Missing colon (':') at the end of '${trimmed.split(" ")[0]}' statement on line ${lineNum}`,
          whatHappened: `The header of the compound statement on line ${lineNum} is missing a colon at the end.`,
          whyItHappened: `Python uses colons (:) to signal the start of an indented code block.`,
          conceptHint: `Add a ':' at the end of the line before writing indented code.`,
          exampleFix: `${trimmed}:`,
        };
      }

      // Check unclosed parenthesis
      const openParens = (line.match(/\(/g) || []).length;
      const closeParens = (line.match(/\)/g) || []).length;
      if (openParens > closeParens) {
        return {
          type: "SyntaxError: unexpected EOF while parsing",
          line: lineNum,
          message: `Unclosed parenthesis '(' on line ${lineNum}`,
          whatHappened: `An open parenthesis was never closed on line ${lineNum}.`,
          whyItHappened: `Function calls, lists, and expressions require matching closing parentheses.`,
          conceptHint: `Make sure every '(' is balanced with a ')'.`,
          exampleFix: `print("Hello World")`,
        };
      }
    }
    return null;
  }

  private static parseRuntimeError(err: any, originalCode: string) {
    const rawMsg = err.message || String(err);

    if (rawMsg.includes("is not defined")) {
      const varNameMatch = rawMsg.match(/([a-zA-Z0-9_]+) is not defined/);
      const varName = varNameMatch ? varNameMatch[1] : "variable";
      return {
        type: `NameError: name '${varName}' is not defined`,
        line: 1,
        message: `'${varName}' was referenced before assignment.`,
        whatHappened: `The program attempted to use '${varName}', but Python does not recognize what it is.`,
        whyItHappened: `Variables or functions must be created and assigned before being used. Check for typos.`,
        conceptHint: `Assign a value to '${varName}' first (e.g. ${varName} = 100) or check the spelling.`,
        exampleFix: `${varName} = "Cyber Grid"\nprint(${varName})`,
      };
    }

    if (rawMsg.includes("Maximum call stack size exceeded") || rawMsg.includes("infinite loop")) {
      return {
        type: "RecursionError / InfiniteLoopError",
        line: 1,
        message: "Infinite loop or runaway recursion detected.",
        whatHappened: "The code executed continuously without a termination condition.",
        whyItHappened: "A while loop condition was never set to False, or a recursive function lacked a base case.",
        conceptHint: "Add a condition that terminates the loop or decreases counter (e.g., i += 1).",
        exampleFix: "count = 0\nwhile count < 5:\n    print(count)\n    count += 1",
      };
    }

    return {
      type: "RuntimeError",
      line: 1,
      message: rawMsg,
      whatHappened: `An unexpected runtime error occurred during execution: ${rawMsg}`,
      whyItHappened: `The code attempted an operation not supported by current types or values.`,
      conceptHint: `Review variable types and arguments.`,
      exampleFix: `Ensure correct variable types and values before invoking methods.`,
    };
  }

  private static transpilePythonToJS(pythonCode: string): string {
    const lines = pythonCode.split("\n");
    const jsLines: string[] = [];
    const indentStack: number[] = [0];

    // Transpile line by line with indentation tracking
    for (let i = 0; i < lines.length; i++) {
      let rawLine = lines[i];
      if (!rawLine.trim() || rawLine.trim().startsWith("#")) {
        jsLines.push(`// ${rawLine.trim()}`);
        continue;
      }

      // Calculate leading indent
      const indent = rawLine.search(/\S|$/);
      let line = rawLine.trim();

      // Handle dedents
      while (indent < indentStack[indentStack.length - 1]) {
        indentStack.pop();
        jsLines.push("}".padStart(jsLines.length ? 2 : 0));
      }

      // Remove comments
      const commentIdx = line.indexOf("#");
      if (commentIdx !== -1) {
        line = line.substring(0, commentIdx).trim();
      }

      // Transform Python operators & keywords
      line = line
        .replace(/\bTrue\b/g, "true")
        .replace(/\bFalse\b/g, "false")
        .replace(/\bNone\b/g, "null")
        .replace(/\band\b/g, "&&")
        .replace(/\bor\b/g, "||")
        .replace(/\bnot\b/g, "!")
        .replace(/\belif\b/g, "else if");

      // Handle f-strings (e.g., f"Hello {name}!") -> `Hello ${name}!`
      line = line.replace(/f(["'])(.*?)\1/g, (match, quote, content) => {
        const replaced = content.replace(/\{([^{}]+)\}/g, "${$1}");
        return `\`${replaced}\``;
      });

      // Handle `for x in range(n):`
      const rangeMatch = line.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+range\((.*?)\):$/);
      if (rangeMatch) {
        const varName = rangeMatch[1];
        const args = rangeMatch[2];
        jsLines.push(`for (let ${varName} of range(${args})) {`);
        indentStack.push(indent + 4);
        continue;
      }

      // Handle `for item in list:`
      const forInMatch = line.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+(.*?):$/);
      if (forInMatch) {
        const itemVar = forInMatch[1];
        const listExpr = forInMatch[2];
        jsLines.push(`for (let ${itemVar} of (${listExpr})) {`);
        indentStack.push(indent + 4);
        continue;
      }

      // Handle `while condition:`
      const whileMatch = line.match(/^while\s+(.*?):$/);
      if (whileMatch) {
        const cond = whileMatch[1];
        jsLines.push(`let __loop_guard_${i} = 0; while (${cond}) { if (++__loop_guard_${i} > 2000) throw new Error("Infinite loop detected");`);
        indentStack.push(indent + 4);
        continue;
      }

      // Handle `if / else if / else`
      const ifMatch = line.match(/^(if|else if)\s+(.*?):$/);
      if (ifMatch) {
        const keyword = ifMatch[1];
        const cond = ifMatch[2];
        jsLines.push(`${keyword} (${cond}) {`);
        indentStack.push(indent + 4);
        continue;
      }

      if (line === "else:") {
        jsLines.push("else {");
        indentStack.push(indent + 4);
        continue;
      }

      // Handle `def function(args):`
      const defMatch = line.match(/^def\s+([a-zA-Z0-9_]+)\((.*?)\):$/);
      if (defMatch) {
        const fnName = defMatch[1];
        const args = defMatch[2];
        jsLines.push(`function ${fnName}(${args}) {`);
        indentStack.push(indent + 4);
        continue;
      }

      // Handle `class Name:` or `class Name(Parent):`
      const classMatch = line.match(/^class\s+([a-zA-Z0-9_]+)(?:\((.*?)\))?:$/);
      if (classMatch) {
        const className = classMatch[1];
        const parentClass = classMatch[2] ? ` extends ${classMatch[2]}` : "";
        jsLines.push(`class ${className}${parentClass} {`);
        indentStack.push(indent + 4);
        continue;
      }

      // Handle `def __init__(self, ...):`
      const initMatch = line.match(/^def\s+__init__\(\s*self\s*(?:,\s*(.*?))?\):$/);
      if (initMatch) {
        const args = initMatch[1] || "";
        jsLines.push(`constructor(${args}) {`);
        indentStack.push(indent + 4);
        continue;
      }

      // Handle class methods `def method(self, ...):`
      const methodMatch = line.match(/^def\s+([a-zA-Z0-9_]+)\(\s*self\s*(?:,\s*(.*?))?\):$/);
      if (methodMatch) {
        const methodName = methodMatch[1];
        const args = methodMatch[2] || "";
        jsLines.push(`${methodName}(${args}) {`);
        indentStack.push(indent + 4);
        continue;
      }

      // Handle `self.prop` -> `this.prop`
      line = line.replace(/\bself\b/g, "this");

      // Handle `variable = ...` assignment tracker
      const assignMatch = line.match(/^([a-zA-Z0-9_]+)\s*(=|\+=|-=|\*=|\/=)\s*(.*)$/);
      if (assignMatch) {
        const varName = assignMatch[1];
        const op = assignMatch[2];
        const expr = assignMatch[3];
        if (op === "=") {
          jsLines.push(`var ${varName} = ${expr}; __vars['${varName}'] = ${varName};`);
        } else {
          jsLines.push(`${varName} ${op} ${expr}; __vars['${varName}'] = ${varName};`);
        }
        continue;
      }

      // Handle method calls with list methods (e.g. .append() -> .push())
      line = line.replace(/\.append\(/g, ".push(");

      jsLines.push(`${line};`);
    }

    // Close any remaining opened blocks
    while (indentStack.length > 1) {
      indentStack.pop();
      jsLines.push("}");
    }

    return jsLines.join("\n");
  }
}
