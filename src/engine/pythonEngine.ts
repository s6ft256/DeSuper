import { ExecutionResult, VisualAction } from "../types";

// ==========================================
// NUMPY (np) IMPLEMENTATION
// ==========================================
class NDArray {
  public data: any[];
  public shape: number[];
  public ndim: number;
  public size: number;
  public dtype: string;

  constructor(data: any[]) {
    this.data = Array.isArray(data) ? data : [data];
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
      this.shape = [data.length, data[0].length];
      this.ndim = 2;
      this.size = data.length * data[0].length;
    } else {
      this.shape = [this.data.length];
      this.ndim = 1;
      this.size = this.data.length;
    }
    this.dtype = typeof this.data[0] === "number" ? (Number.isInteger(this.data[0]) ? "int64" : "float64") : "object";
  }

  get T() {
    if (this.ndim === 2) {
      const rows = this.shape[0];
      const cols = this.shape[1];
      const transposed: any[][] = [];
      for (let j = 0; j < cols; j++) {
        transposed[j] = [];
        for (let i = 0; i < rows; i++) {
          transposed[j][i] = this.data[i][j];
        }
      }
      return new NDArray(transposed);
    }
    return this;
  }

  tolist() {
    return this.data;
  }

  flatten() {
    if (this.ndim === 2) {
      return new NDArray(this.data.reduce((acc, val) => acc.concat(val), []));
    }
    return new NDArray([...this.data]);
  }

  reshape(...newShape: any[]) {
    const flatShape = Array.isArray(newShape[0]) ? newShape[0] : newShape;
    const flat = this.flatten().data;
    if (flatShape.length === 2) {
      const [rows, cols] = flatShape;
      const matrix: any[][] = [];
      let idx = 0;
      for (let r = 0; r < rows; r++) {
        matrix[r] = [];
        for (let c = 0; c < cols; c++) {
          matrix[r][c] = flat[idx++];
        }
      }
      return new NDArray(matrix);
    }
    return new NDArray(flat);
  }

  sum() {
    const flat = this.flatten().data;
    return flat.reduce((a, b) => a + Number(b), 0);
  }

  mean() {
    const flat = this.flatten().data;
    return this.sum() / flat.length;
  }

  std() {
    const m = this.mean();
    const flat = this.flatten().data;
    const variance = flat.reduce((acc, v) => acc + Math.pow(v - m, 2), 0) / flat.length;
    return Math.sqrt(variance);
  }

  min() {
    const flat = this.flatten().data;
    return Math.min(...flat);
  }

  max() {
    const flat = this.flatten().data;
    return Math.max(...flat);
  }

  dot(other: any) {
    return numpy.dot(this, other);
  }

  toString() {
    return `array(${JSON.stringify(this.data)})`;
  }
}

const numpy = {
  array: (data: any) => (data instanceof NDArray ? data : new NDArray(data)),
  zeros: (shape: any) => {
    if (Array.isArray(shape)) {
      const [rows, cols] = shape;
      const res = Array.from({ length: rows }, () => Array(cols).fill(0));
      return new NDArray(res);
    }
    return new NDArray(Array(shape).fill(0));
  },
  ones: (shape: any) => {
    if (Array.isArray(shape)) {
      const [rows, cols] = shape;
      const res = Array.from({ length: rows }, () => Array(cols).fill(1));
      return new NDArray(res);
    }
    return new NDArray(Array(shape).fill(1));
  },
  arange: (start: number, stop?: number, step = 1) => {
    const s = stop === undefined ? 0 : start;
    const e = stop === undefined ? start : stop;
    const arr: number[] = [];
    for (let i = s; i < e; i += step) arr.push(i);
    return new NDArray(arr);
  },
  linspace: (start: number, stop: number, num = 50) => {
    const step = (stop - start) / (num - 1);
    const arr: number[] = [];
    for (let i = 0; i < num; i++) arr.push(start + step * i);
    return new NDArray(arr);
  },
  mean: (a: any) => (a instanceof NDArray ? a.mean() : Array.isArray(a) ? new NDArray(a).mean() : Number(a)),
  median: (a: any) => {
    const flat = a instanceof NDArray ? a.flatten().data : Array.isArray(a) ? a : [a];
    const sorted = [...flat].sort((x, y) => x - y);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  },
  std: (a: any) => (a instanceof NDArray ? a.std() : new NDArray(a).std()),
  sum: (a: any) => (a instanceof NDArray ? a.sum() : new NDArray(a).sum()),
  min: (a: any) => (a instanceof NDArray ? a.min() : Math.min(...a)),
  max: (a: any) => (a instanceof NDArray ? a.max() : Math.max(...a)),
  dot: (a: any, b: any) => {
    const aData = a instanceof NDArray ? a.data : a;
    const bData = b instanceof NDArray ? b.data : b;

    // 1D dot product
    if (!Array.isArray(aData[0]) && !Array.isArray(bData[0])) {
      return aData.reduce((acc: number, val: number, i: number) => acc + val * bData[i], 0);
    }
    // 2D Matrix multiplication
    const aRows = aData.length;
    const aCols = aData[0].length;
    const bCols = bData[0].length;
    const result: number[][] = [];
    for (let i = 0; i < aRows; i++) {
      result[i] = [];
      for (let j = 0; j < bCols; j++) {
        let sum = 0;
        for (let k = 0; k < aCols; k++) {
          sum += aData[i][k] * bData[k][j];
        }
        result[i][j] = sum;
      }
    }
    return new NDArray(result);
  },
  matmul: (a: any, b: any) => numpy.dot(a, b),
  exp: (x: any) => (x instanceof NDArray ? new NDArray(x.data.map((v: number) => Math.exp(v))) : Math.exp(x)),
  log: (x: any) => (x instanceof NDArray ? new NDArray(x.data.map((v: number) => Math.log(v))) : Math.log(x)),
  sqrt: (x: any) => (x instanceof NDArray ? new NDArray(x.data.map((v: number) => Math.sqrt(v))) : Math.sqrt(x)),
  abs: (x: any) => (x instanceof NDArray ? new NDArray(x.data.map((v: number) => Math.abs(v))) : Math.abs(x)),
  random: {
    seed: (_val: number) => {},
    rand: (...dims: number[]) => {
      if (dims.length === 0) return Math.random();
      if (dims.length === 1) return new NDArray(Array.from({ length: dims[0] }, () => Math.random()));
      const [r, c] = dims;
      return new NDArray(Array.from({ length: r }, () => Array.from({ length: c }, () => Math.random())));
    },
    randn: (...dims: number[]) => {
      // Box-Muller normal distribution generator
      const genNorm = () => {
        const u = 1 - Math.random();
        const v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      };
      if (dims.length === 0) return genNorm();
      if (dims.length === 1) return new NDArray(Array.from({ length: dims[0] }, genNorm));
      const [r, c] = dims;
      return new NDArray(Array.from({ length: r }, () => Array.from({ length: c }, genNorm)));
    },
    randint: (low: number, high?: number, size?: number) => {
      const l = high === undefined ? 0 : low;
      const h = high === undefined ? low : high;
      if (size === undefined) return Math.floor(Math.random() * (h - l)) + l;
      return new NDArray(Array.from({ length: size }, () => Math.floor(Math.random() * (h - l)) + l));
    },
  },
};

// ==========================================
// PANDAS (pd) IMPLEMENTATION
// ==========================================
class Series {
  public data: any[];
  public index: any[];

  constructor(data: any[], index?: any[]) {
    this.data = Array.isArray(data) ? data : Object.values(data);
    this.index = index || Array.from({ length: this.data.length }, (_, i) => i);
  }

  get values() {
    return this.data;
  }

  mean() {
    return numpy.mean(this.data);
  }

  sum() {
    return numpy.sum(this.data);
  }

  std() {
    return numpy.std(this.data);
  }

  describe() {
    return {
      count: this.data.length,
      mean: this.mean(),
      std: this.std(),
      min: Math.min(...this.data),
      max: Math.max(...this.data),
    };
  }

  value_counts() {
    const counts: Record<string, number> = {};
    for (const val of this.data) {
      counts[String(val)] = (counts[String(val)] || 0) + 1;
    }
    return counts;
  }

  toString() {
    return JSON.stringify(this.data);
  }
}

class DataFrame {
  public data: Record<string, any[]>;
  public columns: string[];
  public shape: [number, number];

  constructor(raw: any, columns?: string[]) {
    this.data = {};
    if (Array.isArray(raw)) {
      if (raw.length > 0 && typeof raw[0] === "object") {
        this.columns = columns || Object.keys(raw[0]);
        for (const col of this.columns) {
          this.data[col] = raw.map((row) => row[col]);
        }
      } else {
        this.columns = columns || ["0"];
        this.data[this.columns[0]] = raw;
      }
    } else if (typeof raw === "object") {
      this.columns = columns || Object.keys(raw);
      for (const col of this.columns) {
        this.data[col] = Array.isArray(raw[col]) ? raw[col] : [raw[col]];
      }
    } else {
      this.columns = [];
    }
    const numRows = this.columns.length > 0 ? (this.data[this.columns[0]] || []).length : 0;
    this.shape = [numRows, this.columns.length];
  }

  head(n = 5) {
    const preview: any[] = [];
    const rows = Math.min(n, this.shape[0]);
    for (let r = 0; r < rows; r++) {
      const rowObj: any = {};
      for (const col of this.columns) {
        rowObj[col] = this.data[col][r];
      }
      preview.push(rowObj);
    }
    return preview;
  }

  tail(n = 5) {
    const preview: any[] = [];
    const start = Math.max(0, this.shape[0] - n);
    for (let r = start; r < this.shape[0]; r++) {
      const rowObj: any = {};
      for (const col of this.columns) {
        rowObj[col] = this.data[col][r];
      }
      preview.push(rowObj);
    }
    return preview;
  }

  describe() {
    const stats: Record<string, any> = {};
    for (const col of this.columns) {
      if (typeof this.data[col][0] === "number") {
        const s = new Series(this.data[col]);
        stats[col] = s.describe();
      }
    }
    return stats;
  }

  groupby(colName: string) {
    const groups: Record<string, any[]> = {};
    const numRows = this.shape[0];
    for (let i = 0; i < numRows; i++) {
      const key = String(this.data[colName][i]);
      if (!groups[key]) groups[key] = [];
      const row: any = {};
      for (const c of this.columns) {
        row[c] = this.data[c][i];
      }
      groups[key].push(row);
    }

    return {
      mean: () => {
        const result: Record<string, any> = {};
        for (const [key, rows] of Object.entries(groups)) {
          result[key] = {};
          for (const c of this.columns) {
            if (c !== colName && typeof rows[0][c] === "number") {
              const sum = rows.reduce((acc, r) => acc + r[c], 0);
              result[key][c] = sum / rows.length;
            }
          }
        }
        return result;
      },
      sum: () => {
        const result: Record<string, any> = {};
        for (const [key, rows] of Object.entries(groups)) {
          result[key] = {};
          for (const c of this.columns) {
            if (c !== colName && typeof rows[0][c] === "number") {
              result[key][c] = rows.reduce((acc, r) => acc + r[c], 0);
            }
          }
        }
        return result;
      },
      count: () => {
        const result: Record<string, number> = {};
        for (const [key, rows] of Object.entries(groups)) {
          result[key] = rows.length;
        }
        return result;
      },
    };
  }

  to_dict() {
    const list: any[] = [];
    for (let r = 0; r < this.shape[0]; r++) {
      const row: any = {};
      for (const col of this.columns) {
        row[col] = this.data[col][r];
      }
      list.push(row);
    }
    return list;
  }

  toString() {
    return `DataFrame(shape=${JSON.stringify(this.shape)}, columns=${JSON.stringify(this.columns)})`;
  }
}

const pandas = {
  Series: (data: any, index?: any[]) => new Series(data, index),
  DataFrame: (data: any, columns?: string[]) => new DataFrame(data, columns),
};

// ==========================================
// SCIKIT-LEARN (sklearn) & MACHINE LEARNING
// ==========================================
class LinearRegression {
  public coef_: number[] = [];
  public intercept_: number = 0;

  fit(X: any, y: any) {
    const xMat = X instanceof NDArray ? X.data : X;
    const yArr = y instanceof NDArray ? y.data : y;

    // 1D or 2D feature matrix
    if (!Array.isArray(xMat[0])) {
      const n = xMat.length;
      const xMean = xMat.reduce((a: number, b: number) => a + b, 0) / n;
      const yMean = yArr.reduce((a: number, b: number) => a + b, 0) / n;
      let num = 0;
      let den = 0;
      for (let i = 0; i < n; i++) {
        num += (xMat[i] - xMean) * (yArr[i] - yMean);
        den += Math.pow(xMat[i] - xMean, 2);
      }
      const slope = den === 0 ? 0 : num / den;
      this.coef_ = [slope];
      this.intercept_ = yMean - slope * xMean;
    } else {
      // Multiple features approximation / closed form or simple linear fit
      const n = xMat.length;
      const p = xMat[0].length;
      this.coef_ = Array(p).fill(0);
      const yMean = yArr.reduce((a: number, b: number) => a + b, 0) / n;
      for (let j = 0; j < p; j++) {
        const xj = xMat.map((r: number[]) => r[j]);
        const xjMean = xj.reduce((a: number, b: number) => a + b, 0) / n;
        let num = 0;
        let den = 0;
        for (let i = 0; i < n; i++) {
          num += (xj[i] - xjMean) * (yArr[i] - yMean);
          den += Math.pow(xj[i] - xjMean, 2);
        }
        this.coef_[j] = den === 0 ? 0 : num / den;
      }
      this.intercept_ = yMean;
    }
    return this;
  }

  predict(X: any) {
    const xMat = X instanceof NDArray ? X.data : X;
    if (!Array.isArray(xMat[0])) {
      return xMat.map((x: number) => this.coef_[0] * x + this.intercept_);
    }
    return xMat.map((row: number[]) => {
      let val = this.intercept_;
      for (let j = 0; j < row.length; j++) {
        val += row[j] * (this.coef_[j] || 0);
      }
      return val;
    });
  }

  score(X: any, y: any) {
    const yArr = y instanceof NDArray ? y.data : y;
    const yPred = this.predict(X);
    const yMean = yArr.reduce((a: number, b: number) => a + b, 0) / yArr.length;
    const ssTot = yArr.reduce((acc: number, val: number) => acc + Math.pow(val - yMean, 2), 0);
    const ssRes = yArr.reduce((acc: number, val: number, i: number) => acc + Math.pow(val - yPred[i], 2), 0);
    return ssTot === 0 ? 1 : 1 - ssRes / ssTot;
  }
}

class KMeans {
  public n_clusters: number;
  public cluster_centers_: number[][] = [];
  public labels_: number[] = [];

  constructor({ n_clusters = 2 }: { n_clusters?: number } = {}) {
    this.n_clusters = n_clusters;
  }

  fit(X: any) {
    const xMat = X instanceof NDArray ? X.data : X;
    const n = xMat.length;
    // Initialize cluster centers from first k points
    this.cluster_centers_ = [];
    for (let k = 0; k < this.n_clusters; k++) {
      this.cluster_centers_.push(Array.isArray(xMat[k % n]) ? [...xMat[k % n]] : [xMat[k % n]]);
    }

    // Assign points to nearest cluster
    this.labels_ = xMat.map((point: any) => {
      const p = Array.isArray(point) ? point : [point];
      let bestCluster = 0;
      let minDist = Infinity;
      for (let k = 0; k < this.n_clusters; k++) {
        const c = this.cluster_centers_[k];
        let dist = 0;
        for (let j = 0; j < p.length; j++) {
          dist += Math.pow(p[j] - c[j], 2);
        }
        if (dist < minDist) {
          minDist = dist;
          bestCluster = k;
        }
      }
      return bestCluster;
    });

    return this;
  }

  predict(X: any) {
    const xMat = X instanceof NDArray ? X.data : X;
    return xMat.map((point: any) => {
      const p = Array.isArray(point) ? point : [point];
      let bestCluster = 0;
      let minDist = Infinity;
      for (let k = 0; k < this.n_clusters; k++) {
        const c = this.cluster_centers_[k];
        let dist = 0;
        for (let j = 0; j < p.length; j++) {
          dist += Math.pow(p[j] - c[j], 2);
        }
        if (dist < minDist) {
          minDist = dist;
          bestCluster = k;
        }
      }
      return bestCluster;
    });
  }
}

class StandardScaler {
  public mean_: number[] = [];
  public scale_: number[] = [];

  fit_transform(X: any) {
    const xMat = X instanceof NDArray ? X.data : X;
    if (!Array.isArray(xMat[0])) {
      const mean = numpy.mean(xMat);
      const std = numpy.std(xMat) || 1;
      this.mean_ = [mean];
      this.scale_ = [std];
      return xMat.map((v: number) => (v - mean) / std);
    }
    const cols = xMat[0].length;
    this.mean_ = [];
    this.scale_ = [];
    for (let c = 0; c < cols; c++) {
      const colData = xMat.map((r: number[]) => r[c]);
      this.mean_.push(numpy.mean(colData));
      this.scale_.push(numpy.std(colData) || 1);
    }
    return xMat.map((row: number[]) => row.map((v: number, c: number) => (v - this.mean_[c]) / this.scale_[c]));
  }

  transform(X: any) {
    const xMat = X instanceof NDArray ? X.data : X;
    if (!Array.isArray(xMat[0])) {
      return xMat.map((v: number) => (v - this.mean_[0]) / this.scale_[0]);
    }
    return xMat.map((row: number[]) => row.map((v: number, c: number) => (v - this.mean_[c]) / this.scale_[c]));
  }
}

class Perceptron {
  public weights_: number[] = [];
  public bias_: number = 0;

  fit(X: any, y: any, epochs = 20, lr = 0.1) {
    const xMat = X instanceof NDArray ? X.data : X;
    const yArr = y instanceof NDArray ? y.data : y;
    const p = Array.isArray(xMat[0]) ? xMat[0].length : 1;
    this.weights_ = Array(p).fill(0);
    this.bias_ = 0;

    for (let ep = 0; ep < epochs; ep++) {
      for (let i = 0; i < xMat.length; i++) {
        const row = Array.isArray(xMat[i]) ? xMat[i] : [xMat[i]];
        let z = this.bias_;
        for (let j = 0; j < p; j++) z += row[j] * this.weights_[j];
        const pred = z >= 0 ? 1 : 0;
        const target = yArr[i] > 0 ? 1 : 0;
        const err = target - pred;
        if (err !== 0) {
          for (let j = 0; j < p; j++) {
            this.weights_[j] += lr * err * row[j];
          }
          this.bias_ += lr * err;
        }
      }
    }
    return this;
  }

  predict(X: any) {
    const xMat = X instanceof NDArray ? X.data : X;
    return xMat.map((row: any) => {
      const r = Array.isArray(row) ? row : [row];
      let z = this.bias_;
      for (let j = 0; j < r.length; j++) z += r[j] * (this.weights_[j] || 0);
      return z >= 0 ? 1 : 0;
    });
  }
}

const sklearn = {
  linear_model: {
    LinearRegression: LinearRegression,
    Perceptron: Perceptron,
  },
  cluster: {
    KMeans: KMeans,
  },
  preprocessing: {
    StandardScaler: StandardScaler,
  },
  model_selection: {
    train_test_split: (X: any, y: any, { test_size = 0.2, random_state = 42 }: any = {}) => {
      const xArr = X instanceof NDArray ? X.data : X;
      const yArr = y instanceof NDArray ? y.data : y;
      const splitIdx = Math.floor(xArr.length * (1 - test_size));
      return [
        xArr.slice(0, splitIdx),
        xArr.slice(splitIdx),
        yArr.slice(0, splitIdx),
        yArr.slice(splitIdx),
      ];
    },
  },
  metrics: {
    accuracy_score: (y_true: any, y_pred: any) => {
      const t = y_true instanceof NDArray ? y_true.data : y_true;
      const p = y_pred instanceof NDArray ? y_pred.data : y_pred;
      let correct = 0;
      for (let i = 0; i < t.length; i++) {
        if (t[i] === p[i]) correct++;
      }
      return correct / t.length;
    },
    mean_squared_error: (y_true: any, y_pred: any) => {
      const t = y_true instanceof NDArray ? y_true.data : y_true;
      const p = y_pred instanceof NDArray ? y_pred.data : y_pred;
      const sumErr = t.reduce((acc: number, val: number, i: number) => acc + Math.pow(val - p[i], 2), 0);
      return sumErr / t.length;
    },
  },
};

// ==========================================
// REGEX & STANDARD LIBRARIES
// ==========================================
const re = {
  findall: (pattern: string | RegExp, str: string) => {
    const flags = typeof pattern === "string" ? "g" : (pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
    const reg = typeof pattern === "string" ? new RegExp(pattern, flags) : new RegExp(pattern.source, flags);
    const matches = String(str).match(reg);
    return matches ? Array.from(matches) : [];
  },
  search: (pattern: string | RegExp, str: string) => {
    const reg = typeof pattern === "string" ? new RegExp(pattern) : pattern;
    const res = reg.exec(String(str));
    return res ? { group: (idx = 0) => res[idx], start: () => res.index, end: () => res.index + res[0].length } : null;
  },
  match: (pattern: string | RegExp, str: string) => {
    const reg = typeof pattern === "string" ? new RegExp("^" + pattern) : new RegExp("^" + pattern.source);
    const res = reg.exec(String(str));
    return res ? { group: (idx = 0) => res[idx] } : null;
  },
  sub: (pattern: string | RegExp, repl: string, str: string) => {
    const reg = typeof pattern === "string" ? new RegExp(pattern, "g") : pattern;
    return String(str).replace(reg, repl);
  },
  split: (pattern: string | RegExp, str: string) => {
    const reg = typeof pattern === "string" ? new RegExp(pattern) : pattern;
    return String(str).split(reg);
  },
};

const collections = {
  Counter: (iterable: any) => {
    const counts: Record<string, number> = {};
    const items = typeof iterable === "string" ? iterable.split("") : Array.isArray(iterable) ? iterable : Object.values(iterable);
    for (const item of items) {
      counts[String(item)] = (counts[String(item)] || 0) + 1;
    }
    return {
      ...counts,
      most_common: (n?: number) => {
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        return n ? sorted.slice(0, n) : sorted;
      },
    };
  },
  defaultdict: (defaultFactory: () => any) => {
    return new Proxy({} as Record<string, any>, {
      get: (target, prop: string) => {
        if (!(prop in target)) {
          target[prop] = defaultFactory ? defaultFactory() : 0;
        }
        return target[prop];
      },
    });
  },
  deque: (iterable: any[] = []) => {
    const arr = [...iterable];
    return {
      append: (item: any) => arr.push(item),
      appendleft: (item: any) => arr.unshift(item),
      pop: () => arr.pop(),
      popleft: () => arr.shift(),
      tolist: () => arr,
    };
  },
};

const itertools = {
  combinations: (iterable: any[], r: number) => {
    const arr = [...iterable];
    const result: any[][] = [];
    const f = (prefix: any[], start: number) => {
      if (prefix.length === r) {
        result.push(prefix);
        return;
      }
      for (let i = start; i < arr.length; i++) {
        f([...prefix, arr[i]], i + 1);
      }
    };
    f([], 0);
    return result;
  },
  permutations: (iterable: any[], r?: number) => {
    const arr = [...iterable];
    const len = r || arr.length;
    const result: any[][] = [];
    const used = Array(arr.length).fill(false);
    const f = (prefix: any[]) => {
      if (prefix.length === len) {
        result.push(prefix);
        return;
      }
      for (let i = 0; i < arr.length; i++) {
        if (!used[i]) {
          used[i] = true;
          f([...prefix, arr[i]]);
          used[i] = false;
        }
      }
    };
    f([]);
    return result;
  },
  accumulate: (iterable: number[], func = (a: number, b: number) => a + b) => {
    const res: number[] = [];
    let acc = iterable[0];
    res.push(acc);
    for (let i = 1; i < iterable.length; i++) {
      acc = func(acc, iterable[i]);
      res.push(acc);
    }
    return res;
  },
};

const statistics = {
  mean: (data: number[]) => data.reduce((a, b) => a + b, 0) / data.length,
  median: (data: number[]) => numpy.median(data),
  stdev: (data: number[]) => numpy.std(data),
  variance: (data: number[]) => Math.pow(numpy.std(data), 2),
};

export class PythonRuntime {
  public static execute(
    code: string,
    customContext: Record<string, any> = {}
  ): ExecutionResult {
    const startTime = performance.now();
    const output: string[] = [];
    const visualActions: VisualAction[] = [];
    const variables: Record<string, any> = {};

    // 1. Pre-validation & Syntax Checking
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

    // 2. Interactive Game World Simulation Objects
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
        name: "CYBER-RACER",
        health: 100,
        energy: 100,
        x: 0,
        y: 0,
        move: (steps = 1) => {
          for (let i = 0; i < Math.min(steps, 10); i++) {
            gameWorld.robot.x += 1;
            visualActions.push({ type: "robot_move", payload: { x: gameWorld.robot.x } });
          }
          output.push(`[VEHICLE]: Accelerated ${steps} sector(s). Position: (${gameWorld.robot.x}, ${gameWorld.robot.y})`);
          return gameWorld.robot.x;
        },
        scan: () => {
          visualActions.push({ type: "robot_scan" });
          output.push(`[VEHICLE]: Track radar clear. Optimal route computed.`);
          return { status: "clean", anomalies: 0 };
        },
        recharge: (amount = 50) => {
          gameWorld.robot.energy = Math.min(100, gameWorld.robot.energy + amount);
          visualActions.push({ type: "robot_recharge", payload: gameWorld.robot.energy });
          output.push(`[VEHICLE]: Battery cells recharged to ${gameWorld.robot.energy}%.`);
          return gameWorld.robot.energy;
        },
        shoot: (target = "Target Anomaly") => {
          visualActions.push({ type: "robot_shoot", message: target });
          output.push(`[VEHICLE]: Plasma beam fired at ${target}!`);
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

    // 3. Full Standard Python & Package Environment
    const builtins: Record<string, any> = {
      print: (...args: any[]) => {
        const line = args
          .map((a) => (typeof a === "object" && a !== null ? (a instanceof NDArray || a instanceof Series || a instanceof DataFrame ? a.toString() : JSON.stringify(a)) : String(a)))
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
            if (res.length > 5000) break;
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
      sorted: (list: any[], key?: (x: any) => any, reverse = false) => {
        const copy = [...list];
        copy.sort((a, b) => {
          const valA = key ? key(a) : a;
          const valB = key ? key(b) : b;
          return valA > valB ? (reverse ? -1 : 1) : valA < valB ? (reverse ? 1 : -1) : 0;
        });
        return copy;
      },
      abs: (val: number) => Math.abs(val),
      round: (val: number, decimals = 0) => {
        const factor = Math.pow(10, decimals);
        return Math.round(val * factor) / factor;
      },
      enumerate: (iterable: any[], start = 0) => {
        return iterable.map((item, idx) => [start + idx, item]);
      },
      zip: (...iterables: any[][]) => {
        const minLen = Math.min(...iterables.map((it) => it.length));
        const res: any[][] = [];
        for (let i = 0; i < minLen; i++) {
          res.push(iterables.map((it) => it[i]));
        }
        return res;
      },
      map: (fn: any, iterable: any[]) => iterable.map(fn),
      filter: (fn: any, iterable: any[]) => iterable.filter(fn),
      all: (iterable: any[]) => iterable.every(Boolean),
      any: (iterable: any[]) => iterable.some(Boolean),
      reversed: (iterable: any[]) => [...iterable].reverse(),
      set: (iterable: any[] = []) => Array.from(new Set(iterable)),
      list: (iterable: any = []) => (Array.isArray(iterable) ? iterable : Array.from(iterable)),
      dict: (entries: any = {}) => entries,
      type: (val: any) => {
        if (val instanceof NDArray) return "<class 'numpy.ndarray'>";
        if (val instanceof DataFrame) return "<class 'pandas.core.frame.DataFrame'>";
        if (val instanceof Series) return "<class 'pandas.core.series.Series'>";
        if (Array.isArray(val)) return "<class 'list'>";
        if (val === null) return "<class 'NoneType'>";
        if (typeof val === "number") return Number.isInteger(val) ? "<class 'int'>" : "<class 'float'>";
        if (typeof val === "string") return "<class 'str'>";
        if (typeof val === "boolean") return "<class 'bool'>";
        if (typeof val === "object") return "<class 'dict'>";
        return `<class '${typeof val}'>`;
      },
      isinstance: (obj: any, typeName: any) => {
        if (typeName === "int") return typeof obj === "number" && Number.isInteger(obj);
        if (typeName === "float") return typeof obj === "number" && !Number.isInteger(obj);
        if (typeName === "str") return typeof obj === "string";
        if (typeName === "list") return Array.isArray(obj);
        if (typeName === "dict") return typeof obj === "object" && obj !== null && !Array.isArray(obj);
        return true;
      },
      input: (promptText = "") => {
        if (promptText) output.push(String(promptText));
        return "DeSuper Racer";
      },
      True: true,
      False: false,
      None: null,

      // Modules injection
      numpy: numpy,
      np: numpy,
      pandas: pandas,
      pd: pandas,
      sklearn: sklearn,
      LinearRegression: LinearRegression,
      KMeans: KMeans,
      StandardScaler: StandardScaler,
      Perceptron: Perceptron,
      train_test_split: sklearn.model_selection.train_test_split,
      accuracy_score: sklearn.metrics.accuracy_score,
      mean_squared_error: sklearn.metrics.mean_squared_error,
      re: re,
      collections: collections,
      Counter: collections.Counter,
      defaultdict: collections.defaultdict,
      itertools: itertools,
      statistics: statistics,
      json: {
        loads: (str: string) => JSON.parse(str),
        dumps: (obj: any) => JSON.stringify(obj),
      },
      math: {
        pi: Math.PI,
        e: Math.E,
        sqrt: Math.sqrt,
        floor: Math.floor,
        ceil: Math.ceil,
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        log: Math.log,
        log2: Math.log2,
        log10: Math.log10,
        exp: Math.exp,
        pow: Math.pow,
        factorial: (n: number) => {
          let res = 1;
          for (let i = 2; i <= n; i++) res *= i;
          return res;
        },
        gcd: (a: number, b: number) => {
          while (b) {
            const t = b;
            b = a % b;
            a = t;
          }
          return a;
        },
      },
      random: {
        randint: (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a,
        choice: (seq: any[]) => seq[Math.floor(Math.random() * seq.length)],
        choices: (seq: any[], { k = 1 }: any = {}) => Array.from({ length: k }, () => seq[Math.floor(Math.random() * seq.length)]),
        shuffle: (seq: any[]) => seq.sort(() => Math.random() - 0.5),
        random: () => Math.random(),
        sample: (seq: any[], k: number) => [...seq].sort(() => Math.random() - 0.5).slice(0, k),
        seed: (_v: any) => {},
      },
      datetime: {
        datetime: {
          now: () => new Date(),
        },
        date: {
          today: () => new Date(),
        },
        timedelta: (days = 0) => days * 86400000,
      },
      functools: {
        reduce: (fn: any, iterable: any[], init?: any) => (init !== undefined ? iterable.reduce(fn, init) : iterable.reduce(fn)),
        lru_cache: () => (fn: any) => fn,
      },
    };

    // 4. Safe Python Transpilation & Execution Runner
    try {
      const transpiled = this.transpilePythonToJS(code);
      const executionScope = {
        ...builtins,
        ...gameWorld,
        ...customContext,
      };

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

  private static parseRuntimeError(err: any, _originalCode: string) {
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
        exampleFix: `${varName} = "Cyber Track"\nprint(${varName})`,
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

      // Skip import statements because standard modules (numpy, pandas, sklearn, re, collections, itertools, math, random, etc.) are pre-injected into execution scope!
      if (/^import\s+|^from\s+/.test(line)) {
        jsLines.push(`// ${line} (Module pre-loaded in environment)`);
        continue;
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

      // Handle f-strings
      line = line.replace(/f(["'])(.*?)\1/g, (_match, _quote, content) => {
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

      // Handle `for a, b in enumerate(list):`
      const enumMatch = line.match(/^for\s+([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s+in\s+enumerate\((.*?)\):$/);
      if (enumMatch) {
        const iVar = enumMatch[1];
        const valVar = enumMatch[2];
        const listExpr = enumMatch[3];
        jsLines.push(`for (let [${iVar}, ${valVar}] of enumerate(${listExpr})) {`);
        indentStack.push(indent + 4);
        continue;
      }

      // Handle `for a, b in zip(list1, list2):`
      const zipMatch = line.match(/^for\s+([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s+in\s+zip\((.*?)\):$/);
      if (zipMatch) {
        const aVar = zipMatch[1];
        const bVar = zipMatch[2];
        const args = zipMatch[3];
        jsLines.push(`for (let [${aVar}, ${bVar}] of zip(${args})) {`);
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
        jsLines.push(`let __loop_guard_${i} = 0; while (${cond}) { if (++__loop_guard_${i} > 3000) throw new Error("Infinite loop detected");`);
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

      // Handle `try:`
      if (line === "try:") {
        jsLines.push("try {");
        indentStack.push(indent + 4);
        continue;
      }

      // Handle `except ...:`
      if (/^except(\s+.*)?:$/.test(line)) {
        jsLines.push("} catch (e) {");
        indentStack.push(indent + 4);
        continue;
      }

      if (line === "finally:") {
        jsLines.push("} finally {");
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

      // Handle list comprehension assignment: `var = [x * 2 for x in nums]`
      const listCompAssign = line.match(/^([a-zA-Z0-9_]+)\s*=\s*\[\s*(.*?)\s+for\s+([a-zA-Z0-9_]+)\s+in\s+(.*?)\s*(?:if\s+(.*?))?\]$/);
      if (listCompAssign) {
        const varName = listCompAssign[1];
        const expr = listCompAssign[2];
        const itVar = listCompAssign[3];
        const srcList = listCompAssign[4];
        const filterCond = listCompAssign[5];
        if (filterCond) {
          jsLines.push(`var ${varName} = (${srcList}).filter(${itVar} => ${filterCond}).map(${itVar} => ${expr}); __vars['${varName}'] = ${varName};`);
        } else {
          jsLines.push(`var ${varName} = (${srcList}).map(${itVar} => ${expr}); __vars['${varName}'] = ${varName};`);
        }
        continue;
      }

      // Handle lambda expressions: `square = lambda x: x * x`
      const lambdaMatch = line.match(/^([a-zA-Z0-9_]+)\s*=\s*lambda\s+([^:]+):\s*(.*)$/);
      if (lambdaMatch) {
        const varName = lambdaMatch[1];
        const params = lambdaMatch[2];
        const body = lambdaMatch[3];
        jsLines.push(`var ${varName} = (${params}) => (${body}); __vars['${varName}'] = ${varName};`);
        continue;
      }

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

    // Close any remaining open blocks
    while (indentStack.length > 1) {
      indentStack.pop();
      jsLines.push("}");
    }

    return jsLines.join("\n");
  }
}

