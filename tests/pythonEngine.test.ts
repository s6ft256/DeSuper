import { describe, it, expect } from "vitest";
import { PythonRuntime } from "../src/engine/pythonEngine";

describe("PythonRuntime", () => {
  it("executes a simple print statement", () => {
    const result = PythonRuntime.execute('print("HELLO")');
    expect(result.success).toBe(true);
    expect(result.output).toEqual(["HELLO"]);
  });

  it("captures variables into scope", () => {
    const result = PythonRuntime.execute('x = 42\nname = "CYBER"');
    expect(result.success).toBe(true);
    expect(result.variables.x).toBe(42);
    expect(result.variables.name).toBe("CYBER");
  });

  it("detects syntax errors (unclosed quote)", () => {
    const result = PythonRuntime.execute('print("hello)');
    expect(result.success).toBe(false);
    expect(result.error?.type).toContain("SyntaxError");
  });

  it("detects missing colon on if statement", () => {
    const result = PythonRuntime.execute("if True\n    print('ok')");
    expect(result.success).toBe(false);
    expect(result.error?.type).toContain("SyntaxError");
  });

  it("executes a for loop with range", () => {
    const result = PythonRuntime.execute("total = 0\nfor i in range(3):\n    total = total + i\nprint(total)");
    expect(result.success).toBe(true);
    expect(result.output).toEqual(["3"]);
    expect(result.variables.total).toBe(3);
  });

  it("supports numpy array creation and sum", () => {
    const result = PythonRuntime.execute("import numpy as np\narr = np.array([1, 2, 3, 4])\nprint(arr.sum())");
    expect(result.success).toBe(true);
    expect(result.output).toEqual(["10"]);
  });

  it("handles runtime NameError gracefully", () => {
    const result = PythonRuntime.execute("print(missing_var)");
    expect(result.success).toBe(false);
    expect(result.error?.type).toContain("NameError");
  });
});
