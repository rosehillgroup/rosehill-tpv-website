// api/blend-recipes.js
import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
var __webpack_modules__ = { 896: (e, t, r) => {
  e.exports = r.p + "293248747edf5d37944a.js?.";
}, 339: (e) => {
  e.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("module");
} };
var __webpack_module_cache__ = {};
function __nccwpck_require__(e) {
  var t = __webpack_module_cache__[e];
  if (t !== void 0) {
    return t.exports;
  }
  var r = __webpack_module_cache__[e] = { exports: {} };
  var n = true;
  try {
    __webpack_modules__[e](r, r.exports, __nccwpck_require__);
    n = false;
  } finally {
    if (n) delete __webpack_module_cache__[e];
  }
  return r.exports;
}
__nccwpck_require__.m = __webpack_modules__;
(() => {
  __nccwpck_require__.d = (e, t) => {
    for (var r in t) {
      if (__nccwpck_require__.o(t, r) && !__nccwpck_require__.o(e, r)) {
        Object.defineProperty(e, r, { enumerable: true, get: t[r] });
      }
    }
  };
})();
(() => {
  __nccwpck_require__.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
})();
(() => {
  var e;
  if (typeof import.meta.url === "string") e = import.meta.url;
  if (!e) throw new Error("Automatic publicPath is not supported in this browser");
  e = e.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
  __nccwpck_require__.p = e;
})();
if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = new URL(".", import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
(() => {
  __nccwpck_require__.b = new URL("./", import.meta.url);
  var e = { 792: 0 };
})();
var __webpack_exports__ = {};
__nccwpck_require__.d(__webpack_exports__, { $: () => __webpack_exports__config, A: () => __webpack_exports__default });
var module__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(339);
var __webpack_modules__ = { 8772: (e, t, r) => {
  const n = r(5317);
  const { isLinux: i, getReport: o } = r(3235);
  const { LDD_PATH: s, SELF_PATH: a, readFile: l, readFileSync: c } = r(3991);
  const { interpreterPath: h } = r(167);
  let u;
  let p;
  let d;
  const m = "getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true";
  let g = "";
  const safeCommand = () => {
    if (!g) {
      return new Promise(((e2) => {
        n.exec(m, ((t2, r2) => {
          g = t2 ? " " : r2;
          e2(g);
        }));
      }));
    }
    return g;
  };
  const safeCommandSync = () => {
    if (!g) {
      try {
        g = n.execSync(m, { encoding: "utf8" });
      } catch (e2) {
        g = " ";
      }
    }
    return g;
  };
  const b = "glibc";
  const w = /LIBC[a-z0-9 \-).]*?(\d+\.\d+)/i;
  const E = "musl";
  const isFileMusl = (e2) => e2.includes("libc.musl-") || e2.includes("ld-musl-");
  const familyFromReport = () => {
    const e2 = o();
    if (e2.header && e2.header.glibcVersionRuntime) {
      return b;
    }
    if (Array.isArray(e2.sharedObjects)) {
      if (e2.sharedObjects.some(isFileMusl)) {
        return E;
      }
    }
    return null;
  };
  const familyFromCommand = (e2) => {
    const [t2, r2] = e2.split(/[\r\n]+/);
    if (t2 && t2.includes(b)) {
      return b;
    }
    if (r2 && r2.includes(E)) {
      return E;
    }
    return null;
  };
  const familyFromInterpreterPath = (e2) => {
    if (e2) {
      if (e2.includes("/ld-musl-")) {
        return E;
      } else if (e2.includes("/ld-linux-")) {
        return b;
      }
    }
    return null;
  };
  const getFamilyFromLddContent = (e2) => {
    e2 = e2.toString();
    if (e2.includes("musl")) {
      return E;
    }
    if (e2.includes("GNU C Library")) {
      return b;
    }
    return null;
  };
  const familyFromFilesystem = async () => {
    if (p !== void 0) {
      return p;
    }
    p = null;
    try {
      const e2 = await l(s);
      p = getFamilyFromLddContent(e2);
    } catch (e2) {
    }
    return p;
  };
  const familyFromFilesystemSync = () => {
    if (p !== void 0) {
      return p;
    }
    p = null;
    try {
      const e2 = c(s);
      p = getFamilyFromLddContent(e2);
    } catch (e2) {
    }
    return p;
  };
  const familyFromInterpreter = async () => {
    if (u !== void 0) {
      return u;
    }
    u = null;
    try {
      const e2 = await l(a);
      const t2 = h(e2);
      u = familyFromInterpreterPath(t2);
    } catch (e2) {
    }
    return u;
  };
  const familyFromInterpreterSync = () => {
    if (u !== void 0) {
      return u;
    }
    u = null;
    try {
      const e2 = c(a);
      const t2 = h(e2);
      u = familyFromInterpreterPath(t2);
    } catch (e2) {
    }
    return u;
  };
  const family = async () => {
    let e2 = null;
    if (i()) {
      e2 = await familyFromInterpreter();
      if (!e2) {
        e2 = await familyFromFilesystem();
        if (!e2) {
          e2 = familyFromReport();
        }
        if (!e2) {
          const t2 = await safeCommand();
          e2 = familyFromCommand(t2);
        }
      }
    }
    return e2;
  };
  const familySync = () => {
    let e2 = null;
    if (i()) {
      e2 = familyFromInterpreterSync();
      if (!e2) {
        e2 = familyFromFilesystemSync();
        if (!e2) {
          e2 = familyFromReport();
        }
        if (!e2) {
          const t2 = safeCommandSync();
          e2 = familyFromCommand(t2);
        }
      }
    }
    return e2;
  };
  const isNonGlibcLinux = async () => i() && await family() !== b;
  const isNonGlibcLinuxSync = () => i() && familySync() !== b;
  const versionFromFilesystem = async () => {
    if (d !== void 0) {
      return d;
    }
    d = null;
    try {
      const e2 = await l(s);
      const t2 = e2.match(w);
      if (t2) {
        d = t2[1];
      }
    } catch (e2) {
    }
    return d;
  };
  const versionFromFilesystemSync = () => {
    if (d !== void 0) {
      return d;
    }
    d = null;
    try {
      const e2 = c(s);
      const t2 = e2.match(w);
      if (t2) {
        d = t2[1];
      }
    } catch (e2) {
    }
    return d;
  };
  const versionFromReport = () => {
    const e2 = o();
    if (e2.header && e2.header.glibcVersionRuntime) {
      return e2.header.glibcVersionRuntime;
    }
    return null;
  };
  const versionSuffix = (e2) => e2.trim().split(/\s+/)[1];
  const versionFromCommand = (e2) => {
    const [t2, r2, n2] = e2.split(/[\r\n]+/);
    if (t2 && t2.includes(b)) {
      return versionSuffix(t2);
    }
    if (r2 && n2 && r2.includes(E)) {
      return versionSuffix(n2);
    }
    return null;
  };
  const version = async () => {
    let e2 = null;
    if (i()) {
      e2 = await versionFromFilesystem();
      if (!e2) {
        e2 = versionFromReport();
      }
      if (!e2) {
        const t2 = await safeCommand();
        e2 = versionFromCommand(t2);
      }
    }
    return e2;
  };
  const versionSync = () => {
    let e2 = null;
    if (i()) {
      e2 = versionFromFilesystemSync();
      if (!e2) {
        e2 = versionFromReport();
      }
      if (!e2) {
        const t2 = safeCommandSync();
        e2 = versionFromCommand(t2);
      }
    }
    return e2;
  };
  e.exports = { GLIBC: b, MUSL: E, family, familySync, isNonGlibcLinux, isNonGlibcLinuxSync, version, versionSync };
}, 167: (e) => {
  const interpreterPath = (e2) => {
    if (e2.length < 64) {
      return null;
    }
    if (e2.readUInt32BE(0) !== 2135247942) {
      return null;
    }
    if (e2.readUInt8(4) !== 2) {
      return null;
    }
    if (e2.readUInt8(5) !== 1) {
      return null;
    }
    const t = e2.readUInt32LE(32);
    const r = e2.readUInt16LE(54);
    const n = e2.readUInt16LE(56);
    for (let i = 0; i < n; i++) {
      const n2 = t + i * r;
      const o = e2.readUInt32LE(n2);
      if (o === 3) {
        const t2 = e2.readUInt32LE(n2 + 8);
        const r2 = e2.readUInt32LE(n2 + 32);
        return e2.subarray(t2, t2 + r2).toString().replace(/\0.*$/g, "");
      }
    }
    return null;
  };
  e.exports = { interpreterPath };
}, 3991: (e, t, r) => {
  const n = r(9896);
  const i = "/usr/bin/ldd";
  const o = "/proc/self/exe";
  const s = 2048;
  const readFileSync = (e2) => {
    const t2 = n.openSync(e2, "r");
    const r2 = Buffer.alloc(s);
    const i2 = n.readSync(t2, r2, 0, s, 0);
    n.close(t2, (() => {
    }));
    return r2.subarray(0, i2);
  };
  const readFile = (e2) => new Promise(((t2, r2) => {
    n.open(e2, "r", ((e3, i2) => {
      if (e3) {
        r2(e3);
      } else {
        const e4 = Buffer.alloc(s);
        n.read(i2, e4, 0, s, 0, ((r3, o2) => {
          t2(e4.subarray(0, o2));
          n.close(i2, (() => {
          }));
        }));
      }
    }));
  }));
  e.exports = { LDD_PATH: i, SELF_PATH: o, readFileSync, readFile };
}, 3235: (e) => {
  const isLinux = () => process.platform === "linux";
  let t = null;
  const getReport = () => {
    if (!t) {
      if (isLinux() && process.report) {
        const e2 = process.report.excludeNetwork;
        process.report.excludeNetwork = true;
        t = process.report.getReport();
        process.report.excludeNetwork = e2;
      } else {
        t = {};
      }
    }
    return t;
  };
  e.exports = { isLinux, getReport };
}, 7586: (e, t, r) => {
  e = r.nmd(e);
  var n, i;
  i = (function() {
    function kMeans2(e2) {
      var t2, r2, n2, i2, o;
      if (e2 == null) {
        e2 = {};
      }
      this.K = (t2 = e2.K) != null ? t2 : 5;
      this.maxIterations = (r2 = e2.maxIterations) != null ? r2 : 100;
      this.enableConvergenceTest = (n2 = e2.enableConvergenceTest) != null ? n2 : true;
      this.tolerance = (i2 = e2.tolerance) != null ? i2 : 1e-9;
      this.initialize = (o = e2.initialize) != null ? o : kMeans2.initializeForgy;
    }
    kMeans2.prototype.cluster = function(e2) {
      var t2;
      this.X = e2;
      this.prevCentroids = [];
      this.clusters = [];
      this.currentIteration = 0;
      t2 = [this.X.length, this.X[0].length], this.m = t2[0], this.n = t2[1];
      if (this.m == null || this.n == null || this.m < this.K || this.n < 1) {
        throw "You must pass more data";
      }
      return this.centroids = this.initialize(this.X, this.K, this.m, this.n);
    };
    kMeans2.prototype.step = function() {
      return this.currentIteration++ < this.maxIterations;
    };
    kMeans2.prototype.autoCluster = function(e2) {
      var t2;
      this.cluster(e2);
      t2 = [];
      while (this.step()) {
        this.findClosestCentroids();
        this.moveCentroids();
        if (this.hasConverged()) {
          break;
        } else {
          t2.push(void 0);
        }
      }
      return t2;
    };
    kMeans2.initializeForgy = function(e2, t2, r2, n2) {
      var i2, o, s;
      s = [];
      for (i2 = o = 0; 0 <= t2 ? o < t2 : o > t2; i2 = 0 <= t2 ? ++o : --o) {
        s.push(e2[Math.floor(Math.random() * r2)]);
      }
      return s;
    };
    kMeans2.initializeInRange = function(e2, t2, r2, n2) {
      var i2, o, s, a, l, c, h, u, p, d, m, g, b, w;
      for (o = h = 0; 0 <= n2 ? h < n2 : h > n2; o = 0 <= n2 ? ++h : --h) {
        l = Infinity;
      }
      for (o = u = 0; 0 <= n2 ? u < n2 : u > n2; o = 0 <= n2 ? ++u : --u) {
        a = -Infinity;
      }
      for (p = 0, m = e2.length; p < m; p++) {
        c = e2[p];
        for (o = d = 0, g = c.length; d < g; o = ++d) {
          i2 = c[o];
          l[o] = Math.min(l[o], i2);
          a[o] = Math.max(a[o], i2);
        }
      }
      w = [];
      for (s = b = 0; 0 <= t2 ? b < t2 : b > t2; s = 0 <= t2 ? ++b : --b) {
        w.push((function() {
          var e3, t3;
          t3 = [];
          for (i2 = e3 = 0; 0 <= n2 ? e3 < n2 : e3 > n2; i2 = 0 <= n2 ? ++e3 : --e3) {
            t3.push(Math.random() * (a[i2] - l[i2]) + l[i2]);
          }
          return t3;
        })());
      }
      return w;
    };
    kMeans2.prototype.findClosestCentroids = function() {
      var e2, t2, r2, n2, i2, o, s, a, l, c, h, u, p, d, m, g, b, w;
      if (this.enableConvergenceTest) {
        this.prevCentroids = function() {
          var e3, t3, r3, n3;
          r3 = this.centroids;
          n3 = [];
          for (e3 = 0, t3 = r3.length; e3 < t3; e3++) {
            s = r3[e3];
            n3.push(s.slice(0));
          }
          return n3;
        }.call(this);
      }
      this.clusters = function() {
        var e3, t3, n3;
        n3 = [];
        for (r2 = e3 = 0, t3 = this.K; 0 <= t3 ? e3 < t3 : e3 > t3; r2 = 0 <= t3 ? ++e3 : --e3) {
          n3.push([]);
        }
        return n3;
      }.call(this);
      m = this.X;
      w = [];
      for (r2 = c = 0, p = m.length; c < p; r2 = ++c) {
        a = m[r2];
        t2 = 0;
        l = Infinity;
        g = this.centroids;
        for (n2 = h = 0, d = g.length; h < d; n2 = ++h) {
          e2 = g[n2];
          o = 0;
          for (i2 = u = 0, b = a.length; 0 <= b ? u < b : u > b; i2 = 0 <= b ? ++u : --u) {
            o += (a[i2] - e2[i2]) * (a[i2] - e2[i2]);
          }
          if (o < l) {
            t2 = n2;
            l = o;
          }
        }
        w.push(this.clusters[t2].push(r2));
      }
      return w;
    };
    kMeans2.prototype.moveCentroids = function() {
      var e2, t2, r2, n2, i2, o, s, a, l;
      a = this.clusters;
      l = [];
      for (r2 = o = 0, s = a.length; o < s; r2 = ++o) {
        e2 = a[r2];
        if (e2.length < 1) {
          continue;
        }
        l.push(function() {
          var o2, s2, a2, l2, c;
          c = [];
          for (n2 = o2 = 0, l2 = this.n; 0 <= l2 ? o2 < l2 : o2 > l2; n2 = 0 <= l2 ? ++o2 : --o2) {
            i2 = 0;
            for (s2 = 0, a2 = e2.length; s2 < a2; s2++) {
              t2 = e2[s2];
              i2 += this.X[t2][n2];
            }
            c.push(this.centroids[r2][n2] = i2 / e2.length);
          }
          return c;
        }.call(this));
      }
      return l;
    };
    kMeans2.prototype.hasConverged = function() {
      var e2, t2, r2, n2, i2, o, s;
      if (!this.enableConvergenceTest) {
        return false;
      }
      for (t2 = n2 = 0, o = this.n; 0 <= o ? n2 < o : n2 > o; t2 = 0 <= o ? ++n2 : --n2) {
        for (r2 = i2 = 0, s = this.m; 0 <= s ? i2 < s : i2 > s; r2 = 0 <= s ? ++i2 : --i2) {
          e2 = Math.abs(this.prevCentroids[t2][r2] - this.centroids[t2][r2]);
          if (this.tolerance > e2) {
            return true;
          }
        }
      }
      return false;
    };
    return kMeans2;
  })();
  if ((e !== null ? e.exports : void 0) != null || typeof n !== "undefined" && n !== null) {
    e.exports = n = i;
  } else {
    window.kMeans = i;
  }
}, 6747: (e, t, r) => {
  const n = Symbol("SemVer ANY");
  class Comparator {
    static get ANY() {
      return n;
    }
    constructor(e2, t2) {
      t2 = i(t2);
      if (e2 instanceof Comparator) {
        if (e2.loose === !!t2.loose) {
          return e2;
        } else {
          e2 = e2.value;
        }
      }
      e2 = e2.trim().split(/\s+/).join(" ");
      l("comparator", e2, t2);
      this.options = t2;
      this.loose = !!t2.loose;
      this.parse(e2);
      if (this.semver === n) {
        this.value = "";
      } else {
        this.value = this.operator + this.semver.version;
      }
      l("comp", this);
    }
    parse(e2) {
      const t2 = this.options.loose ? o[s.COMPARATORLOOSE] : o[s.COMPARATOR];
      const r2 = e2.match(t2);
      if (!r2) {
        throw new TypeError(`Invalid comparator: ${e2}`);
      }
      this.operator = r2[1] !== void 0 ? r2[1] : "";
      if (this.operator === "=") {
        this.operator = "";
      }
      if (!r2[2]) {
        this.semver = n;
      } else {
        this.semver = new c(r2[2], this.options.loose);
      }
    }
    toString() {
      return this.value;
    }
    test(e2) {
      l("Comparator.test", e2, this.options.loose);
      if (this.semver === n || e2 === n) {
        return true;
      }
      if (typeof e2 === "string") {
        try {
          e2 = new c(e2, this.options);
        } catch (e3) {
          return false;
        }
      }
      return a(e2, this.operator, this.semver, this.options);
    }
    intersects(e2, t2) {
      if (!(e2 instanceof Comparator)) {
        throw new TypeError("a Comparator is required");
      }
      if (this.operator === "") {
        if (this.value === "") {
          return true;
        }
        return new h(e2.value, t2).test(this.value);
      } else if (e2.operator === "") {
        if (e2.value === "") {
          return true;
        }
        return new h(this.value, t2).test(e2.semver);
      }
      t2 = i(t2);
      if (t2.includePrerelease && (this.value === "<0.0.0-0" || e2.value === "<0.0.0-0")) {
        return false;
      }
      if (!t2.includePrerelease && (this.value.startsWith("<0.0.0") || e2.value.startsWith("<0.0.0"))) {
        return false;
      }
      if (this.operator.startsWith(">") && e2.operator.startsWith(">")) {
        return true;
      }
      if (this.operator.startsWith("<") && e2.operator.startsWith("<")) {
        return true;
      }
      if (this.semver.version === e2.semver.version && this.operator.includes("=") && e2.operator.includes("=")) {
        return true;
      }
      if (a(this.semver, "<", e2.semver, t2) && this.operator.startsWith(">") && e2.operator.startsWith("<")) {
        return true;
      }
      if (a(this.semver, ">", e2.semver, t2) && this.operator.startsWith("<") && e2.operator.startsWith(">")) {
        return true;
      }
      return false;
    }
  }
  e.exports = Comparator;
  const i = r(1788);
  const { safeRe: o, t: s } = r(5047);
  const a = r(286);
  const l = r(8895);
  const c = r(5075);
  const h = r(2566);
}, 2566: (e, t, r) => {
  const n = /\s+/g;
  class Range {
    constructor(e2, t2) {
      t2 = s(t2);
      if (e2 instanceof Range) {
        if (e2.loose === !!t2.loose && e2.includePrerelease === !!t2.includePrerelease) {
          return e2;
        } else {
          return new Range(e2.raw, t2);
        }
      }
      if (e2 instanceof a) {
        this.raw = e2.value;
        this.set = [[e2]];
        this.formatted = void 0;
        return this;
      }
      this.options = t2;
      this.loose = !!t2.loose;
      this.includePrerelease = !!t2.includePrerelease;
      this.raw = e2.trim().replace(n, " ");
      this.set = this.raw.split("||").map(((e3) => this.parseRange(e3.trim()))).filter(((e3) => e3.length));
      if (!this.set.length) {
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      }
      if (this.set.length > 1) {
        const e3 = this.set[0];
        this.set = this.set.filter(((e4) => !isNullSet(e4[0])));
        if (this.set.length === 0) {
          this.set = [e3];
        } else if (this.set.length > 1) {
          for (const e4 of this.set) {
            if (e4.length === 1 && isAny(e4[0])) {
              this.set = [e4];
              break;
            }
          }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let e2 = 0; e2 < this.set.length; e2++) {
          if (e2 > 0) {
            this.formatted += "||";
          }
          const t2 = this.set[e2];
          for (let e3 = 0; e3 < t2.length; e3++) {
            if (e3 > 0) {
              this.formatted += " ";
            }
            this.formatted += t2[e3].toString().trim();
          }
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(e2) {
      const t2 = (this.options.includePrerelease && g) | (this.options.loose && b);
      const r2 = t2 + ":" + e2;
      const n2 = o.get(r2);
      if (n2) {
        return n2;
      }
      const i2 = this.options.loose;
      const s2 = i2 ? h[u.HYPHENRANGELOOSE] : h[u.HYPHENRANGE];
      e2 = e2.replace(s2, hyphenReplace(this.options.includePrerelease));
      l("hyphen replace", e2);
      e2 = e2.replace(h[u.COMPARATORTRIM], p);
      l("comparator trim", e2);
      e2 = e2.replace(h[u.TILDETRIM], d);
      l("tilde trim", e2);
      e2 = e2.replace(h[u.CARETTRIM], m);
      l("caret trim", e2);
      let c2 = e2.split(" ").map(((e3) => parseComparator(e3, this.options))).join(" ").split(/\s+/).map(((e3) => replaceGTE0(e3, this.options)));
      if (i2) {
        c2 = c2.filter(((e3) => {
          l("loose invalid filter", e3, this.options);
          return !!e3.match(h[u.COMPARATORLOOSE]);
        }));
      }
      l("range list", c2);
      const w = /* @__PURE__ */ new Map();
      const E = c2.map(((e3) => new a(e3, this.options)));
      for (const e3 of E) {
        if (isNullSet(e3)) {
          return [e3];
        }
        w.set(e3.value, e3);
      }
      if (w.size > 1 && w.has("")) {
        w.delete("");
      }
      const v = [...w.values()];
      o.set(r2, v);
      return v;
    }
    intersects(e2, t2) {
      if (!(e2 instanceof Range)) {
        throw new TypeError("a Range is required");
      }
      return this.set.some(((r2) => isSatisfiable(r2, t2) && e2.set.some(((e3) => isSatisfiable(e3, t2) && r2.every(((r3) => e3.every(((e4) => r3.intersects(e4, t2)))))))));
    }
    test(e2) {
      if (!e2) {
        return false;
      }
      if (typeof e2 === "string") {
        try {
          e2 = new c(e2, this.options);
        } catch (e3) {
          return false;
        }
      }
      for (let t2 = 0; t2 < this.set.length; t2++) {
        if (testSet(this.set[t2], e2, this.options)) {
          return true;
        }
      }
      return false;
    }
  }
  e.exports = Range;
  const i = r(95);
  const o = new i();
  const s = r(1788);
  const a = r(6747);
  const l = r(8895);
  const c = r(5075);
  const { safeRe: h, t: u, comparatorTrimReplace: p, tildeTrimReplace: d, caretTrimReplace: m } = r(5047);
  const { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: b } = r(3493);
  const isNullSet = (e2) => e2.value === "<0.0.0-0";
  const isAny = (e2) => e2.value === "";
  const isSatisfiable = (e2, t2) => {
    let r2 = true;
    const n2 = e2.slice();
    let i2 = n2.pop();
    while (r2 && n2.length) {
      r2 = n2.every(((e3) => i2.intersects(e3, t2)));
      i2 = n2.pop();
    }
    return r2;
  };
  const parseComparator = (e2, t2) => {
    e2 = e2.replace(h[u.BUILD], "");
    l("comp", e2, t2);
    e2 = replaceCarets(e2, t2);
    l("caret", e2);
    e2 = replaceTildes(e2, t2);
    l("tildes", e2);
    e2 = replaceXRanges(e2, t2);
    l("xrange", e2);
    e2 = replaceStars(e2, t2);
    l("stars", e2);
    return e2;
  };
  const isX = (e2) => !e2 || e2.toLowerCase() === "x" || e2 === "*";
  const replaceTildes = (e2, t2) => e2.trim().split(/\s+/).map(((e3) => replaceTilde(e3, t2))).join(" ");
  const replaceTilde = (e2, t2) => {
    const r2 = t2.loose ? h[u.TILDELOOSE] : h[u.TILDE];
    return e2.replace(r2, ((t3, r3, n2, i2, o2) => {
      l("tilde", e2, t3, r3, n2, i2, o2);
      let s2;
      if (isX(r3)) {
        s2 = "";
      } else if (isX(n2)) {
        s2 = `>=${r3}.0.0 <${+r3 + 1}.0.0-0`;
      } else if (isX(i2)) {
        s2 = `>=${r3}.${n2}.0 <${r3}.${+n2 + 1}.0-0`;
      } else if (o2) {
        l("replaceTilde pr", o2);
        s2 = `>=${r3}.${n2}.${i2}-${o2} <${r3}.${+n2 + 1}.0-0`;
      } else {
        s2 = `>=${r3}.${n2}.${i2} <${r3}.${+n2 + 1}.0-0`;
      }
      l("tilde return", s2);
      return s2;
    }));
  };
  const replaceCarets = (e2, t2) => e2.trim().split(/\s+/).map(((e3) => replaceCaret(e3, t2))).join(" ");
  const replaceCaret = (e2, t2) => {
    l("caret", e2, t2);
    const r2 = t2.loose ? h[u.CARETLOOSE] : h[u.CARET];
    const n2 = t2.includePrerelease ? "-0" : "";
    return e2.replace(r2, ((t3, r3, i2, o2, s2) => {
      l("caret", e2, t3, r3, i2, o2, s2);
      let a2;
      if (isX(r3)) {
        a2 = "";
      } else if (isX(i2)) {
        a2 = `>=${r3}.0.0${n2} <${+r3 + 1}.0.0-0`;
      } else if (isX(o2)) {
        if (r3 === "0") {
          a2 = `>=${r3}.${i2}.0${n2} <${r3}.${+i2 + 1}.0-0`;
        } else {
          a2 = `>=${r3}.${i2}.0${n2} <${+r3 + 1}.0.0-0`;
        }
      } else if (s2) {
        l("replaceCaret pr", s2);
        if (r3 === "0") {
          if (i2 === "0") {
            a2 = `>=${r3}.${i2}.${o2}-${s2} <${r3}.${i2}.${+o2 + 1}-0`;
          } else {
            a2 = `>=${r3}.${i2}.${o2}-${s2} <${r3}.${+i2 + 1}.0-0`;
          }
        } else {
          a2 = `>=${r3}.${i2}.${o2}-${s2} <${+r3 + 1}.0.0-0`;
        }
      } else {
        l("no pr");
        if (r3 === "0") {
          if (i2 === "0") {
            a2 = `>=${r3}.${i2}.${o2}${n2} <${r3}.${i2}.${+o2 + 1}-0`;
          } else {
            a2 = `>=${r3}.${i2}.${o2}${n2} <${r3}.${+i2 + 1}.0-0`;
          }
        } else {
          a2 = `>=${r3}.${i2}.${o2} <${+r3 + 1}.0.0-0`;
        }
      }
      l("caret return", a2);
      return a2;
    }));
  };
  const replaceXRanges = (e2, t2) => {
    l("replaceXRanges", e2, t2);
    return e2.split(/\s+/).map(((e3) => replaceXRange(e3, t2))).join(" ");
  };
  const replaceXRange = (e2, t2) => {
    e2 = e2.trim();
    const r2 = t2.loose ? h[u.XRANGELOOSE] : h[u.XRANGE];
    return e2.replace(r2, ((r3, n2, i2, o2, s2, a2) => {
      l("xRange", e2, r3, n2, i2, o2, s2, a2);
      const c2 = isX(i2);
      const h2 = c2 || isX(o2);
      const u2 = h2 || isX(s2);
      const p2 = u2;
      if (n2 === "=" && p2) {
        n2 = "";
      }
      a2 = t2.includePrerelease ? "-0" : "";
      if (c2) {
        if (n2 === ">" || n2 === "<") {
          r3 = "<0.0.0-0";
        } else {
          r3 = "*";
        }
      } else if (n2 && p2) {
        if (h2) {
          o2 = 0;
        }
        s2 = 0;
        if (n2 === ">") {
          n2 = ">=";
          if (h2) {
            i2 = +i2 + 1;
            o2 = 0;
            s2 = 0;
          } else {
            o2 = +o2 + 1;
            s2 = 0;
          }
        } else if (n2 === "<=") {
          n2 = "<";
          if (h2) {
            i2 = +i2 + 1;
          } else {
            o2 = +o2 + 1;
          }
        }
        if (n2 === "<") {
          a2 = "-0";
        }
        r3 = `${n2 + i2}.${o2}.${s2}${a2}`;
      } else if (h2) {
        r3 = `>=${i2}.0.0${a2} <${+i2 + 1}.0.0-0`;
      } else if (u2) {
        r3 = `>=${i2}.${o2}.0${a2} <${i2}.${+o2 + 1}.0-0`;
      }
      l("xRange return", r3);
      return r3;
    }));
  };
  const replaceStars = (e2, t2) => {
    l("replaceStars", e2, t2);
    return e2.trim().replace(h[u.STAR], "");
  };
  const replaceGTE0 = (e2, t2) => {
    l("replaceGTE0", e2, t2);
    return e2.trim().replace(h[t2.includePrerelease ? u.GTE0PRE : u.GTE0], "");
  };
  const hyphenReplace = (e2) => (t2, r2, n2, i2, o2, s2, a2, l2, c2, h2, u2, p2) => {
    if (isX(n2)) {
      r2 = "";
    } else if (isX(i2)) {
      r2 = `>=${n2}.0.0${e2 ? "-0" : ""}`;
    } else if (isX(o2)) {
      r2 = `>=${n2}.${i2}.0${e2 ? "-0" : ""}`;
    } else if (s2) {
      r2 = `>=${r2}`;
    } else {
      r2 = `>=${r2}${e2 ? "-0" : ""}`;
    }
    if (isX(c2)) {
      l2 = "";
    } else if (isX(h2)) {
      l2 = `<${+c2 + 1}.0.0-0`;
    } else if (isX(u2)) {
      l2 = `<${c2}.${+h2 + 1}.0-0`;
    } else if (p2) {
      l2 = `<=${c2}.${h2}.${u2}-${p2}`;
    } else if (e2) {
      l2 = `<${c2}.${h2}.${+u2 + 1}-0`;
    } else {
      l2 = `<=${l2}`;
    }
    return `${r2} ${l2}`.trim();
  };
  const testSet = (e2, t2, r2) => {
    for (let r3 = 0; r3 < e2.length; r3++) {
      if (!e2[r3].test(t2)) {
        return false;
      }
    }
    if (t2.prerelease.length && !r2.includePrerelease) {
      for (let r3 = 0; r3 < e2.length; r3++) {
        l(e2[r3].semver);
        if (e2[r3].semver === a.ANY) {
          continue;
        }
        if (e2[r3].semver.prerelease.length > 0) {
          const n2 = e2[r3].semver;
          if (n2.major === t2.major && n2.minor === t2.minor && n2.patch === t2.patch) {
            return true;
          }
        }
      }
      return false;
    }
    return true;
  };
}, 5075: (e, t, r) => {
  const n = r(8895);
  const { MAX_LENGTH: i, MAX_SAFE_INTEGER: o } = r(3493);
  const { safeRe: s, t: a } = r(5047);
  const l = r(1788);
  const { compareIdentifiers: c } = r(5772);
  class SemVer {
    constructor(e2, t2) {
      t2 = l(t2);
      if (e2 instanceof SemVer) {
        if (e2.loose === !!t2.loose && e2.includePrerelease === !!t2.includePrerelease) {
          return e2;
        } else {
          e2 = e2.version;
        }
      } else if (typeof e2 !== "string") {
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof e2}".`);
      }
      if (e2.length > i) {
        throw new TypeError(`version is longer than ${i} characters`);
      }
      n("SemVer", e2, t2);
      this.options = t2;
      this.loose = !!t2.loose;
      this.includePrerelease = !!t2.includePrerelease;
      const r2 = e2.trim().match(t2.loose ? s[a.LOOSE] : s[a.FULL]);
      if (!r2) {
        throw new TypeError(`Invalid Version: ${e2}`);
      }
      this.raw = e2;
      this.major = +r2[1];
      this.minor = +r2[2];
      this.patch = +r2[3];
      if (this.major > o || this.major < 0) {
        throw new TypeError("Invalid major version");
      }
      if (this.minor > o || this.minor < 0) {
        throw new TypeError("Invalid minor version");
      }
      if (this.patch > o || this.patch < 0) {
        throw new TypeError("Invalid patch version");
      }
      if (!r2[4]) {
        this.prerelease = [];
      } else {
        this.prerelease = r2[4].split(".").map(((e3) => {
          if (/^[0-9]+$/.test(e3)) {
            const t3 = +e3;
            if (t3 >= 0 && t3 < o) {
              return t3;
            }
          }
          return e3;
        }));
      }
      this.build = r2[5] ? r2[5].split(".") : [];
      this.format();
    }
    format() {
      this.version = `${this.major}.${this.minor}.${this.patch}`;
      if (this.prerelease.length) {
        this.version += `-${this.prerelease.join(".")}`;
      }
      return this.version;
    }
    toString() {
      return this.version;
    }
    compare(e2) {
      n("SemVer.compare", this.version, this.options, e2);
      if (!(e2 instanceof SemVer)) {
        if (typeof e2 === "string" && e2 === this.version) {
          return 0;
        }
        e2 = new SemVer(e2, this.options);
      }
      if (e2.version === this.version) {
        return 0;
      }
      return this.compareMain(e2) || this.comparePre(e2);
    }
    compareMain(e2) {
      if (!(e2 instanceof SemVer)) {
        e2 = new SemVer(e2, this.options);
      }
      if (this.major < e2.major) {
        return -1;
      }
      if (this.major > e2.major) {
        return 1;
      }
      if (this.minor < e2.minor) {
        return -1;
      }
      if (this.minor > e2.minor) {
        return 1;
      }
      if (this.patch < e2.patch) {
        return -1;
      }
      if (this.patch > e2.patch) {
        return 1;
      }
      return 0;
    }
    comparePre(e2) {
      if (!(e2 instanceof SemVer)) {
        e2 = new SemVer(e2, this.options);
      }
      if (this.prerelease.length && !e2.prerelease.length) {
        return -1;
      } else if (!this.prerelease.length && e2.prerelease.length) {
        return 1;
      } else if (!this.prerelease.length && !e2.prerelease.length) {
        return 0;
      }
      let t2 = 0;
      do {
        const r2 = this.prerelease[t2];
        const i2 = e2.prerelease[t2];
        n("prerelease compare", t2, r2, i2);
        if (r2 === void 0 && i2 === void 0) {
          return 0;
        } else if (i2 === void 0) {
          return 1;
        } else if (r2 === void 0) {
          return -1;
        } else if (r2 === i2) {
          continue;
        } else {
          return c(r2, i2);
        }
      } while (++t2);
    }
    compareBuild(e2) {
      if (!(e2 instanceof SemVer)) {
        e2 = new SemVer(e2, this.options);
      }
      let t2 = 0;
      do {
        const r2 = this.build[t2];
        const i2 = e2.build[t2];
        n("build compare", t2, r2, i2);
        if (r2 === void 0 && i2 === void 0) {
          return 0;
        } else if (i2 === void 0) {
          return 1;
        } else if (r2 === void 0) {
          return -1;
        } else if (r2 === i2) {
          continue;
        } else {
          return c(r2, i2);
        }
      } while (++t2);
    }
    inc(e2, t2, r2) {
      if (e2.startsWith("pre")) {
        if (!t2 && r2 === false) {
          throw new Error("invalid increment argument: identifier is empty");
        }
        if (t2) {
          const e3 = `-${t2}`.match(this.options.loose ? s[a.PRERELEASELOOSE] : s[a.PRERELEASE]);
          if (!e3 || e3[1] !== t2) {
            throw new Error(`invalid identifier: ${t2}`);
          }
        }
      }
      switch (e2) {
        case "premajor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor = 0;
          this.major++;
          this.inc("pre", t2, r2);
          break;
        case "preminor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor++;
          this.inc("pre", t2, r2);
          break;
        case "prepatch":
          this.prerelease.length = 0;
          this.inc("patch", t2, r2);
          this.inc("pre", t2, r2);
          break;
        case "prerelease":
          if (this.prerelease.length === 0) {
            this.inc("patch", t2, r2);
          }
          this.inc("pre", t2, r2);
          break;
        case "release":
          if (this.prerelease.length === 0) {
            throw new Error(`version ${this.raw} is not a prerelease`);
          }
          this.prerelease.length = 0;
          break;
        case "major":
          if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
            this.major++;
          }
          this.minor = 0;
          this.patch = 0;
          this.prerelease = [];
          break;
        case "minor":
          if (this.patch !== 0 || this.prerelease.length === 0) {
            this.minor++;
          }
          this.patch = 0;
          this.prerelease = [];
          break;
        case "patch":
          if (this.prerelease.length === 0) {
            this.patch++;
          }
          this.prerelease = [];
          break;
        case "pre": {
          const e3 = Number(r2) ? 1 : 0;
          if (this.prerelease.length === 0) {
            this.prerelease = [e3];
          } else {
            let n2 = this.prerelease.length;
            while (--n2 >= 0) {
              if (typeof this.prerelease[n2] === "number") {
                this.prerelease[n2]++;
                n2 = -2;
              }
            }
            if (n2 === -1) {
              if (t2 === this.prerelease.join(".") && r2 === false) {
                throw new Error("invalid increment argument: identifier already exists");
              }
              this.prerelease.push(e3);
            }
          }
          if (t2) {
            let n2 = [t2, e3];
            if (r2 === false) {
              n2 = [t2];
            }
            if (c(this.prerelease[0], t2) === 0) {
              if (isNaN(this.prerelease[1])) {
                this.prerelease = n2;
              }
            } else {
              this.prerelease = n2;
            }
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${e2}`);
      }
      this.raw = this.format();
      if (this.build.length) {
        this.raw += `+${this.build.join(".")}`;
      }
      return this;
    }
  }
  e.exports = SemVer;
}, 286: (e, t, r) => {
  const n = r(2450);
  const i = r(7350);
  const o = r(3071);
  const s = r(7308);
  const a = r(2632);
  const l = r(6565);
  const cmp = (e2, t2, r2, c) => {
    switch (t2) {
      case "===":
        if (typeof e2 === "object") {
          e2 = e2.version;
        }
        if (typeof r2 === "object") {
          r2 = r2.version;
        }
        return e2 === r2;
      case "!==":
        if (typeof e2 === "object") {
          e2 = e2.version;
        }
        if (typeof r2 === "object") {
          r2 = r2.version;
        }
        return e2 !== r2;
      case "":
      case "=":
      case "==":
        return n(e2, r2, c);
      case "!=":
        return i(e2, r2, c);
      case ">":
        return o(e2, r2, c);
      case ">=":
        return s(e2, r2, c);
      case "<":
        return a(e2, r2, c);
      case "<=":
        return l(e2, r2, c);
      default:
        throw new TypeError(`Invalid operator: ${t2}`);
    }
  };
  e.exports = cmp;
}, 5105: (e, t, r) => {
  const n = r(5075);
  const i = r(9689);
  const { safeRe: o, t: s } = r(5047);
  const coerce = (e2, t2) => {
    if (e2 instanceof n) {
      return e2;
    }
    if (typeof e2 === "number") {
      e2 = String(e2);
    }
    if (typeof e2 !== "string") {
      return null;
    }
    t2 = t2 || {};
    let r2 = null;
    if (!t2.rtl) {
      r2 = e2.match(t2.includePrerelease ? o[s.COERCEFULL] : o[s.COERCE]);
    } else {
      const n2 = t2.includePrerelease ? o[s.COERCERTLFULL] : o[s.COERCERTL];
      let i2;
      while ((i2 = n2.exec(e2)) && (!r2 || r2.index + r2[0].length !== e2.length)) {
        if (!r2 || i2.index + i2[0].length !== r2.index + r2[0].length) {
          r2 = i2;
        }
        n2.lastIndex = i2.index + i2[1].length + i2[2].length;
      }
      n2.lastIndex = -1;
    }
    if (r2 === null) {
      return null;
    }
    const a = r2[2];
    const l = r2[3] || "0";
    const c = r2[4] || "0";
    const h = t2.includePrerelease && r2[5] ? `-${r2[5]}` : "";
    const u = t2.includePrerelease && r2[6] ? `+${r2[6]}` : "";
    return i(`${a}.${l}.${c}${h}${u}`, t2);
  };
  e.exports = coerce;
}, 3565: (e, t, r) => {
  const n = r(5075);
  const compare = (e2, t2, r2) => new n(e2, r2).compare(new n(t2, r2));
  e.exports = compare;
}, 2450: (e, t, r) => {
  const n = r(3565);
  const eq = (e2, t2, r2) => n(e2, t2, r2) === 0;
  e.exports = eq;
}, 3071: (e, t, r) => {
  const n = r(3565);
  const gt = (e2, t2, r2) => n(e2, t2, r2) > 0;
  e.exports = gt;
}, 7308: (e, t, r) => {
  const n = r(3565);
  const gte = (e2, t2, r2) => n(e2, t2, r2) >= 0;
  e.exports = gte;
}, 2632: (e, t, r) => {
  const n = r(3565);
  const lt = (e2, t2, r2) => n(e2, t2, r2) < 0;
  e.exports = lt;
}, 6565: (e, t, r) => {
  const n = r(3565);
  const lte = (e2, t2, r2) => n(e2, t2, r2) <= 0;
  e.exports = lte;
}, 7350: (e, t, r) => {
  const n = r(3565);
  const neq = (e2, t2, r2) => n(e2, t2, r2) !== 0;
  e.exports = neq;
}, 9689: (e, t, r) => {
  const n = r(5075);
  const parse = (e2, t2, r2 = false) => {
    if (e2 instanceof n) {
      return e2;
    }
    try {
      return new n(e2, t2);
    } catch (e3) {
      if (!r2) {
        return null;
      }
      throw e3;
    }
  };
  e.exports = parse;
}, 4243: (e, t, r) => {
  const n = r(2566);
  const satisfies = (e2, t2, r2) => {
    try {
      t2 = new n(t2, r2);
    } catch (e3) {
      return false;
    }
    return t2.test(e2);
  };
  e.exports = satisfies;
}, 3493: (e) => {
  const t = "2.0.0";
  const r = 256;
  const n = Number.MAX_SAFE_INTEGER || 9007199254740991;
  const i = 16;
  const o = r - 6;
  const s = ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"];
  e.exports = { MAX_LENGTH: r, MAX_SAFE_COMPONENT_LENGTH: i, MAX_SAFE_BUILD_LENGTH: o, MAX_SAFE_INTEGER: n, RELEASE_TYPES: s, SEMVER_SPEC_VERSION: t, FLAG_INCLUDE_PRERELEASE: 1, FLAG_LOOSE: 2 };
}, 8895: (e) => {
  const t = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e2) => console.error("SEMVER", ...e2) : () => {
  };
  e.exports = t;
}, 5772: (e) => {
  const t = /^[0-9]+$/;
  const compareIdentifiers = (e2, r) => {
    if (typeof e2 === "number" && typeof r === "number") {
      return e2 === r ? 0 : e2 < r ? -1 : 1;
    }
    const n = t.test(e2);
    const i = t.test(r);
    if (n && i) {
      e2 = +e2;
      r = +r;
    }
    return e2 === r ? 0 : n && !i ? -1 : i && !n ? 1 : e2 < r ? -1 : 1;
  };
  const rcompareIdentifiers = (e2, t2) => compareIdentifiers(t2, e2);
  e.exports = { compareIdentifiers, rcompareIdentifiers };
}, 95: (e) => {
  class LRUCache {
    constructor() {
      this.max = 1e3;
      this.map = /* @__PURE__ */ new Map();
    }
    get(e2) {
      const t = this.map.get(e2);
      if (t === void 0) {
        return void 0;
      } else {
        this.map.delete(e2);
        this.map.set(e2, t);
        return t;
      }
    }
    delete(e2) {
      return this.map.delete(e2);
    }
    set(e2, t) {
      const r = this.delete(e2);
      if (!r && t !== void 0) {
        if (this.map.size >= this.max) {
          const e3 = this.map.keys().next().value;
          this.delete(e3);
        }
        this.map.set(e2, t);
      }
      return this;
    }
  }
  e.exports = LRUCache;
}, 1788: (e) => {
  const t = Object.freeze({ loose: true });
  const r = Object.freeze({});
  const parseOptions = (e2) => {
    if (!e2) {
      return r;
    }
    if (typeof e2 !== "object") {
      return t;
    }
    return e2;
  };
  e.exports = parseOptions;
}, 5047: (e, t, r) => {
  const { MAX_SAFE_COMPONENT_LENGTH: n, MAX_SAFE_BUILD_LENGTH: i, MAX_LENGTH: o } = r(3493);
  const s = r(8895);
  t = e.exports = {};
  const a = t.re = [];
  const l = t.safeRe = [];
  const c = t.src = [];
  const h = t.safeSrc = [];
  const u = t.t = {};
  let p = 0;
  const d = "[a-zA-Z0-9-]";
  const m = [["\\s", 1], ["\\d", o], [d, i]];
  const makeSafeRegex = (e2) => {
    for (const [t2, r2] of m) {
      e2 = e2.split(`${t2}*`).join(`${t2}{0,${r2}}`).split(`${t2}+`).join(`${t2}{1,${r2}}`);
    }
    return e2;
  };
  const createToken = (e2, t2, r2) => {
    const n2 = makeSafeRegex(t2);
    const i2 = p++;
    s(e2, i2, t2);
    u[e2] = i2;
    c[i2] = t2;
    h[i2] = n2;
    a[i2] = new RegExp(t2, r2 ? "g" : void 0);
    l[i2] = new RegExp(n2, r2 ? "g" : void 0);
  };
  createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
  createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
  createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${d}*`);
  createToken("MAINVERSION", `(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})`);
  createToken("MAINVERSIONLOOSE", `(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})`);
  createToken("PRERELEASEIDENTIFIER", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIER]})`);
  createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIERLOOSE]})`);
  createToken("PRERELEASE", `(?:-(${c[u.PRERELEASEIDENTIFIER]}(?:\\.${c[u.PRERELEASEIDENTIFIER]})*))`);
  createToken("PRERELEASELOOSE", `(?:-?(${c[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[u.PRERELEASEIDENTIFIERLOOSE]})*))`);
  createToken("BUILDIDENTIFIER", `${d}+`);
  createToken("BUILD", `(?:\\+(${c[u.BUILDIDENTIFIER]}(?:\\.${c[u.BUILDIDENTIFIER]})*))`);
  createToken("FULLPLAIN", `v?${c[u.MAINVERSION]}${c[u.PRERELEASE]}?${c[u.BUILD]}?`);
  createToken("FULL", `^${c[u.FULLPLAIN]}$`);
  createToken("LOOSEPLAIN", `[v=\\s]*${c[u.MAINVERSIONLOOSE]}${c[u.PRERELEASELOOSE]}?${c[u.BUILD]}?`);
  createToken("LOOSE", `^${c[u.LOOSEPLAIN]}$`);
  createToken("GTLT", "((?:<|>)?=?)");
  createToken("XRANGEIDENTIFIERLOOSE", `${c[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
  createToken("XRANGEIDENTIFIER", `${c[u.NUMERICIDENTIFIER]}|x|X|\\*`);
  createToken("XRANGEPLAIN", `[v=\\s]*(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:${c[u.PRERELEASE]})?${c[u.BUILD]}?)?)?`);
  createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:${c[u.PRERELEASELOOSE]})?${c[u.BUILD]}?)?)?`);
  createToken("XRANGE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAIN]}$`);
  createToken("XRANGELOOSE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAINLOOSE]}$`);
  createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`);
  createToken("COERCE", `${c[u.COERCEPLAIN]}(?:$|[^\\d])`);
  createToken("COERCEFULL", c[u.COERCEPLAIN] + `(?:${c[u.PRERELEASE]})?(?:${c[u.BUILD]})?(?:$|[^\\d])`);
  createToken("COERCERTL", c[u.COERCE], true);
  createToken("COERCERTLFULL", c[u.COERCEFULL], true);
  createToken("LONETILDE", "(?:~>?)");
  createToken("TILDETRIM", `(\\s*)${c[u.LONETILDE]}\\s+`, true);
  t.tildeTrimReplace = "$1~";
  createToken("TILDE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAIN]}$`);
  createToken("TILDELOOSE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAINLOOSE]}$`);
  createToken("LONECARET", "(?:\\^)");
  createToken("CARETTRIM", `(\\s*)${c[u.LONECARET]}\\s+`, true);
  t.caretTrimReplace = "$1^";
  createToken("CARET", `^${c[u.LONECARET]}${c[u.XRANGEPLAIN]}$`);
  createToken("CARETLOOSE", `^${c[u.LONECARET]}${c[u.XRANGEPLAINLOOSE]}$`);
  createToken("COMPARATORLOOSE", `^${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]})$|^$`);
  createToken("COMPARATOR", `^${c[u.GTLT]}\\s*(${c[u.FULLPLAIN]})$|^$`);
  createToken("COMPARATORTRIM", `(\\s*)${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]}|${c[u.XRANGEPLAIN]})`, true);
  t.comparatorTrimReplace = "$1$2$3";
  createToken("HYPHENRANGE", `^\\s*(${c[u.XRANGEPLAIN]})\\s+-\\s+(${c[u.XRANGEPLAIN]})\\s*$`);
  createToken("HYPHENRANGELOOSE", `^\\s*(${c[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[u.XRANGEPLAINLOOSE]})\\s*$`);
  createToken("STAR", "(<|>)?=?\\s*\\*");
  createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
  createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
}, 7063: (module) => {
  module.exports = eval("require")("@img/sharp-libvips-dev/cplusplus");
}, 6576: (module) => {
  module.exports = eval("require")("@img/sharp-libvips-dev/include");
}, 6279: (module) => {
  module.exports = eval("require")("@img/sharp-wasm32/versions");
}, 5317: (e) => {
  e.exports = (0, module__WEBPACK_IMPORTED_MODULE_0__.createRequire)(import.meta.url)("child_process");
}, 9896: (e) => {
  e.exports = (0, module__WEBPACK_IMPORTED_MODULE_0__.createRequire)(import.meta.url)("fs");
}, 1421: (e) => {
  e.exports = (0, module__WEBPACK_IMPORTED_MODULE_0__.createRequire)(import.meta.url)("node:child_process");
}, 7598: (e) => {
  e.exports = (0, module__WEBPACK_IMPORTED_MODULE_0__.createRequire)(import.meta.url)("node:crypto");
}, 8474: (e) => {
  e.exports = (0, module__WEBPACK_IMPORTED_MODULE_0__.createRequire)(import.meta.url)("node:events");
}, 8161: (e) => {
  e.exports = (0, module__WEBPACK_IMPORTED_MODULE_0__.createRequire)(import.meta.url)("node:os");
}, 6760: (e) => {
  e.exports = (0, module__WEBPACK_IMPORTED_MODULE_0__.createRequire)(import.meta.url)("node:path");
}, 7075: (e) => {
  e.exports = (0, module__WEBPACK_IMPORTED_MODULE_0__.createRequire)(import.meta.url)("node:stream");
}, 7975: (e) => {
  e.exports = (0, module__WEBPACK_IMPORTED_MODULE_0__.createRequire)(import.meta.url)("node:util");
}, 7016: (e, t, r) => {
  const n = r(3031);
  const i = { and: "and", or: "or", eor: "eor" };
  function removeAlpha() {
    this.options.removeAlpha = true;
    return this;
  }
  function ensureAlpha(e2) {
    if (n.defined(e2)) {
      if (n.number(e2) && n.inRange(e2, 0, 1)) {
        this.options.ensureAlpha = e2;
      } else {
        throw n.invalidParameterError("alpha", "number between 0 and 1", e2);
      }
    } else {
      this.options.ensureAlpha = 1;
    }
    return this;
  }
  function extractChannel(e2) {
    const t2 = { red: 0, green: 1, blue: 2, alpha: 3 };
    if (Object.keys(t2).includes(e2)) {
      e2 = t2[e2];
    }
    if (n.integer(e2) && n.inRange(e2, 0, 4)) {
      this.options.extractChannel = e2;
    } else {
      throw n.invalidParameterError("channel", "integer or one of: red, green, blue, alpha", e2);
    }
    return this;
  }
  function joinChannel(e2, t2) {
    if (Array.isArray(e2)) {
      e2.forEach((function(e3) {
        this.options.joinChannelIn.push(this._createInputDescriptor(e3, t2));
      }), this);
    } else {
      this.options.joinChannelIn.push(this._createInputDescriptor(e2, t2));
    }
    return this;
  }
  function bandbool(e2) {
    if (n.string(e2) && n.inArray(e2, ["and", "or", "eor"])) {
      this.options.bandBoolOp = e2;
    } else {
      throw n.invalidParameterError("boolOp", "one of: and, or, eor", e2);
    }
    return this;
  }
  e.exports = (e2) => {
    Object.assign(e2.prototype, { removeAlpha, ensureAlpha, extractChannel, joinChannel, bandbool });
    e2.bool = i;
  };
}, 8459: (e, t, r) => {
  const n = r(171);
  const i = r(3031);
  const o = { multiband: "multiband", "b-w": "b-w", bw: "b-w", cmyk: "cmyk", srgb: "srgb" };
  function tint(e2) {
    this._setBackgroundColourOption("tint", e2);
    return this;
  }
  function greyscale(e2) {
    this.options.greyscale = i.bool(e2) ? e2 : true;
    return this;
  }
  function grayscale(e2) {
    return this.greyscale(e2);
  }
  function pipelineColourspace(e2) {
    if (!i.string(e2)) {
      throw i.invalidParameterError("colourspace", "string", e2);
    }
    this.options.colourspacePipeline = e2;
    return this;
  }
  function pipelineColorspace(e2) {
    return this.pipelineColourspace(e2);
  }
  function toColourspace(e2) {
    if (!i.string(e2)) {
      throw i.invalidParameterError("colourspace", "string", e2);
    }
    this.options.colourspace = e2;
    return this;
  }
  function toColorspace(e2) {
    return this.toColourspace(e2);
  }
  function _getBackgroundColourOption(e2) {
    if (i.object(e2) || i.string(e2) && e2.length >= 3 && e2.length <= 200) {
      const t2 = n(e2);
      return [t2.red(), t2.green(), t2.blue(), Math.round(t2.alpha() * 255)];
    } else {
      throw i.invalidParameterError("background", "object or string", e2);
    }
  }
  function _setBackgroundColourOption(e2, t2) {
    if (i.defined(t2)) {
      this.options[e2] = _getBackgroundColourOption(t2);
    }
  }
  e.exports = (e2) => {
    Object.assign(e2.prototype, { tint, greyscale, grayscale, pipelineColourspace, pipelineColorspace, toColourspace, toColorspace, _getBackgroundColourOption, _setBackgroundColourOption });
    e2.colourspace = o;
    e2.colorspace = o;
  };
}, 6360: (e, t, r) => {
  const n = r(3031);
  const i = { clear: "clear", source: "source", over: "over", in: "in", out: "out", atop: "atop", dest: "dest", "dest-over": "dest-over", "dest-in": "dest-in", "dest-out": "dest-out", "dest-atop": "dest-atop", xor: "xor", add: "add", saturate: "saturate", multiply: "multiply", screen: "screen", overlay: "overlay", darken: "darken", lighten: "lighten", "colour-dodge": "colour-dodge", "color-dodge": "colour-dodge", "colour-burn": "colour-burn", "color-burn": "colour-burn", "hard-light": "hard-light", "soft-light": "soft-light", difference: "difference", exclusion: "exclusion" };
  function composite(e2) {
    if (!Array.isArray(e2)) {
      throw n.invalidParameterError("images to composite", "array", e2);
    }
    this.options.composite = e2.map(((e3) => {
      if (!n.object(e3)) {
        throw n.invalidParameterError("image to composite", "object", e3);
      }
      const t2 = this._inputOptionsFromObject(e3);
      const r2 = { input: this._createInputDescriptor(e3.input, t2, { allowStream: false }), blend: "over", tile: false, left: 0, top: 0, hasOffset: false, gravity: 0, premultiplied: false };
      if (n.defined(e3.blend)) {
        if (n.string(i[e3.blend])) {
          r2.blend = i[e3.blend];
        } else {
          throw n.invalidParameterError("blend", "valid blend name", e3.blend);
        }
      }
      if (n.defined(e3.tile)) {
        if (n.bool(e3.tile)) {
          r2.tile = e3.tile;
        } else {
          throw n.invalidParameterError("tile", "boolean", e3.tile);
        }
      }
      if (n.defined(e3.left)) {
        if (n.integer(e3.left)) {
          r2.left = e3.left;
        } else {
          throw n.invalidParameterError("left", "integer", e3.left);
        }
      }
      if (n.defined(e3.top)) {
        if (n.integer(e3.top)) {
          r2.top = e3.top;
        } else {
          throw n.invalidParameterError("top", "integer", e3.top);
        }
      }
      if (n.defined(e3.top) !== n.defined(e3.left)) {
        throw new Error("Expected both left and top to be set");
      } else {
        r2.hasOffset = n.integer(e3.top) && n.integer(e3.left);
      }
      if (n.defined(e3.gravity)) {
        if (n.integer(e3.gravity) && n.inRange(e3.gravity, 0, 8)) {
          r2.gravity = e3.gravity;
        } else if (n.string(e3.gravity) && n.integer(this.constructor.gravity[e3.gravity])) {
          r2.gravity = this.constructor.gravity[e3.gravity];
        } else {
          throw n.invalidParameterError("gravity", "valid gravity", e3.gravity);
        }
      }
      if (n.defined(e3.premultiplied)) {
        if (n.bool(e3.premultiplied)) {
          r2.premultiplied = e3.premultiplied;
        } else {
          throw n.invalidParameterError("premultiplied", "boolean", e3.premultiplied);
        }
      }
      return r2;
    }));
    return this;
  }
  e.exports = (e2) => {
    e2.prototype.composite = composite;
    e2.blend = i;
  };
}, 9667: (e, t, r) => {
  const n = r(7975);
  const i = r(7075);
  const o = r(3031);
  r(1395);
  const s = n.debuglog("sharp");
  const queueListener = (e2) => {
    Sharp.queue.emit("change", e2);
  };
  const Sharp = function(e2, t2) {
    if (arguments.length === 1 && !o.defined(e2)) {
      throw new Error("Invalid input");
    }
    if (!(this instanceof Sharp)) {
      return new Sharp(e2, t2);
    }
    i.Duplex.call(this);
    this.options = { topOffsetPre: -1, leftOffsetPre: -1, widthPre: -1, heightPre: -1, topOffsetPost: -1, leftOffsetPost: -1, widthPost: -1, heightPost: -1, width: -1, height: -1, canvas: "crop", position: 0, resizeBackground: [0, 0, 0, 255], angle: 0, rotationAngle: 0, rotationBackground: [0, 0, 0, 255], rotateBefore: false, orientBefore: false, flip: false, flop: false, extendTop: 0, extendBottom: 0, extendLeft: 0, extendRight: 0, extendBackground: [0, 0, 0, 255], extendWith: "background", withoutEnlargement: false, withoutReduction: false, affineMatrix: [], affineBackground: [0, 0, 0, 255], affineIdx: 0, affineIdy: 0, affineOdx: 0, affineOdy: 0, affineInterpolator: this.constructor.interpolators.bilinear, kernel: "lanczos3", fastShrinkOnLoad: true, tint: [-1, 0, 0, 0], flatten: false, flattenBackground: [0, 0, 0], unflatten: false, negate: false, negateAlpha: true, medianSize: 0, blurSigma: 0, precision: "integer", minAmpl: 0.2, sharpenSigma: 0, sharpenM1: 1, sharpenM2: 2, sharpenX1: 2, sharpenY2: 10, sharpenY3: 20, threshold: 0, thresholdGrayscale: true, trimBackground: [], trimThreshold: -1, trimLineArt: false, dilateWidth: 0, erodeWidth: 0, gamma: 0, gammaOut: 0, greyscale: false, normalise: false, normaliseLower: 1, normaliseUpper: 99, claheWidth: 0, claheHeight: 0, claheMaxSlope: 3, brightness: 1, saturation: 1, hue: 0, lightness: 0, booleanBufferIn: null, booleanFileIn: "", joinChannelIn: [], extractChannel: -1, removeAlpha: false, ensureAlpha: -1, colourspace: "srgb", colourspacePipeline: "last", composite: [], fileOut: "", formatOut: "input", streamOut: false, keepMetadata: 0, withMetadataOrientation: -1, withMetadataDensity: 0, withIccProfile: "", withExif: {}, withExifMerge: true, withXmp: "", resolveWithObject: false, loop: -1, delay: [], jpegQuality: 80, jpegProgressive: false, jpegChromaSubsampling: "4:2:0", jpegTrellisQuantisation: false, jpegOvershootDeringing: false, jpegOptimiseScans: false, jpegOptimiseCoding: true, jpegQuantisationTable: 0, pngProgressive: false, pngCompressionLevel: 6, pngAdaptiveFiltering: false, pngPalette: false, pngQuality: 100, pngEffort: 7, pngBitdepth: 8, pngDither: 1, jp2Quality: 80, jp2TileHeight: 512, jp2TileWidth: 512, jp2Lossless: false, jp2ChromaSubsampling: "4:4:4", webpQuality: 80, webpAlphaQuality: 100, webpLossless: false, webpNearLossless: false, webpSmartSubsample: false, webpSmartDeblock: false, webpPreset: "default", webpEffort: 4, webpMinSize: false, webpMixed: false, gifBitdepth: 8, gifEffort: 7, gifDither: 1, gifInterFrameMaxError: 0, gifInterPaletteMaxError: 3, gifKeepDuplicateFrames: false, gifReuse: true, gifProgressive: false, tiffQuality: 80, tiffCompression: "jpeg", tiffBigtiff: false, tiffPredictor: "horizontal", tiffPyramid: false, tiffMiniswhite: false, tiffBitdepth: 8, tiffTile: false, tiffTileHeight: 256, tiffTileWidth: 256, tiffXres: 1, tiffYres: 1, tiffResolutionUnit: "inch", heifQuality: 50, heifLossless: false, heifCompression: "av1", heifEffort: 4, heifChromaSubsampling: "4:4:4", heifBitdepth: 8, jxlDistance: 1, jxlDecodingTier: 0, jxlEffort: 7, jxlLossless: false, rawDepth: "uchar", tileSize: 256, tileOverlap: 0, tileContainer: "fs", tileLayout: "dz", tileFormat: "last", tileDepth: "last", tileAngle: 0, tileSkipBlanks: -1, tileBackground: [255, 255, 255, 255], tileCentre: false, tileId: "https://example.com/iiif", tileBasename: "", timeoutSeconds: 0, linearA: [], linearB: [], pdfBackground: [255, 255, 255, 255], debuglog: (e3) => {
      this.emit("warning", e3);
      s(e3);
    }, queueListener };
    this.options.input = this._createInputDescriptor(e2, t2, { allowStream: true });
    return this;
  };
  Object.setPrototypeOf(Sharp.prototype, i.Duplex.prototype);
  Object.setPrototypeOf(Sharp, i.Duplex);
  function clone() {
    const e2 = this.constructor.call();
    const { debuglog: t2, queueListener: r2, ...n2 } = this.options;
    e2.options = structuredClone(n2);
    e2.options.debuglog = t2;
    e2.options.queueListener = r2;
    if (this._isStreamInput()) {
      this.on("finish", (() => {
        this._flattenBufferIn();
        e2.options.input.buffer = this.options.input.buffer;
        e2.emit("finish");
      }));
    }
    return e2;
  }
  Object.assign(Sharp.prototype, { clone });
  e.exports = Sharp;
}, 3491: (e, t, r) => {
  const n = r(9667);
  r(5019)(n);
  r(1527)(n);
  r(6360)(n);
  r(6450)(n);
  r(8459)(n);
  r(7016)(n);
  r(982)(n);
  r(735)(n);
  e.exports = n;
}, 5019: (e, t, r) => {
  const n = r(3031);
  const i = r(1395);
  const o = { left: "low", top: "low", low: "low", center: "centre", centre: "centre", right: "high", bottom: "high", high: "high" };
  const s = ["failOn", "limitInputPixels", "unlimited", "animated", "autoOrient", "density", "ignoreIcc", "page", "pages", "sequentialRead", "jp2", "openSlide", "pdf", "raw", "svg", "tiff", "failOnError", "openSlideLevel", "pdfBackground", "tiffSubifd"];
  function _inputOptionsFromObject(e2) {
    const t2 = s.filter(((t3) => n.defined(e2[t3]))).map(((t3) => [t3, e2[t3]]));
    return t2.length ? Object.fromEntries(t2) : void 0;
  }
  function _createInputDescriptor(e2, t2, r2) {
    const i2 = { autoOrient: false, failOn: "warning", limitInputPixels: 16383 ** 2, ignoreIcc: false, unlimited: false, sequentialRead: true };
    if (n.string(e2)) {
      i2.file = e2;
    } else if (n.buffer(e2)) {
      if (e2.length === 0) {
        throw Error("Input Buffer is empty");
      }
      i2.buffer = e2;
    } else if (n.arrayBuffer(e2)) {
      if (e2.byteLength === 0) {
        throw Error("Input bit Array is empty");
      }
      i2.buffer = Buffer.from(e2, 0, e2.byteLength);
    } else if (n.typedArray(e2)) {
      if (e2.length === 0) {
        throw Error("Input Bit Array is empty");
      }
      i2.buffer = Buffer.from(e2.buffer, e2.byteOffset, e2.byteLength);
    } else if (n.plainObject(e2) && !n.defined(t2)) {
      t2 = e2;
      if (_inputOptionsFromObject(t2)) {
        i2.buffer = [];
      }
    } else if (!n.defined(e2) && !n.defined(t2) && n.object(r2) && r2.allowStream) {
      i2.buffer = [];
    } else if (Array.isArray(e2)) {
      if (e2.length > 1) {
        if (!this.options.joining) {
          this.options.joining = true;
          this.options.join = e2.map(((e3) => this._createInputDescriptor(e3)));
        } else {
          throw new Error("Recursive join is unsupported");
        }
      } else {
        throw new Error("Expected at least two images to join");
      }
    } else {
      throw new Error(`Unsupported input '${e2}' of type ${typeof e2}${n.defined(t2) ? ` when also providing options of type ${typeof t2}` : ""}`);
    }
    if (n.object(t2)) {
      if (n.defined(t2.failOnError)) {
        if (n.bool(t2.failOnError)) {
          i2.failOn = t2.failOnError ? "warning" : "none";
        } else {
          throw n.invalidParameterError("failOnError", "boolean", t2.failOnError);
        }
      }
      if (n.defined(t2.failOn)) {
        if (n.string(t2.failOn) && n.inArray(t2.failOn, ["none", "truncated", "error", "warning"])) {
          i2.failOn = t2.failOn;
        } else {
          throw n.invalidParameterError("failOn", "one of: none, truncated, error, warning", t2.failOn);
        }
      }
      if (n.defined(t2.autoOrient)) {
        if (n.bool(t2.autoOrient)) {
          i2.autoOrient = t2.autoOrient;
        } else {
          throw n.invalidParameterError("autoOrient", "boolean", t2.autoOrient);
        }
      }
      if (n.defined(t2.density)) {
        if (n.inRange(t2.density, 1, 1e5)) {
          i2.density = t2.density;
        } else {
          throw n.invalidParameterError("density", "number between 1 and 100000", t2.density);
        }
      }
      if (n.defined(t2.ignoreIcc)) {
        if (n.bool(t2.ignoreIcc)) {
          i2.ignoreIcc = t2.ignoreIcc;
        } else {
          throw n.invalidParameterError("ignoreIcc", "boolean", t2.ignoreIcc);
        }
      }
      if (n.defined(t2.limitInputPixels)) {
        if (n.bool(t2.limitInputPixels)) {
          i2.limitInputPixels = t2.limitInputPixels ? 16383 ** 2 : 0;
        } else if (n.integer(t2.limitInputPixels) && n.inRange(t2.limitInputPixels, 0, Number.MAX_SAFE_INTEGER)) {
          i2.limitInputPixels = t2.limitInputPixels;
        } else {
          throw n.invalidParameterError("limitInputPixels", "positive integer", t2.limitInputPixels);
        }
      }
      if (n.defined(t2.unlimited)) {
        if (n.bool(t2.unlimited)) {
          i2.unlimited = t2.unlimited;
        } else {
          throw n.invalidParameterError("unlimited", "boolean", t2.unlimited);
        }
      }
      if (n.defined(t2.sequentialRead)) {
        if (n.bool(t2.sequentialRead)) {
          i2.sequentialRead = t2.sequentialRead;
        } else {
          throw n.invalidParameterError("sequentialRead", "boolean", t2.sequentialRead);
        }
      }
      if (n.defined(t2.raw)) {
        if (n.object(t2.raw) && n.integer(t2.raw.width) && t2.raw.width > 0 && n.integer(t2.raw.height) && t2.raw.height > 0 && n.integer(t2.raw.channels) && n.inRange(t2.raw.channels, 1, 4)) {
          i2.rawWidth = t2.raw.width;
          i2.rawHeight = t2.raw.height;
          i2.rawChannels = t2.raw.channels;
          switch (e2.constructor) {
            case Uint8Array:
            case Uint8ClampedArray:
              i2.rawDepth = "uchar";
              break;
            case Int8Array:
              i2.rawDepth = "char";
              break;
            case Uint16Array:
              i2.rawDepth = "ushort";
              break;
            case Int16Array:
              i2.rawDepth = "short";
              break;
            case Uint32Array:
              i2.rawDepth = "uint";
              break;
            case Int32Array:
              i2.rawDepth = "int";
              break;
            case Float32Array:
              i2.rawDepth = "float";
              break;
            case Float64Array:
              i2.rawDepth = "double";
              break;
            default:
              i2.rawDepth = "uchar";
              break;
          }
        } else {
          throw new Error("Expected width, height and channels for raw pixel input");
        }
        i2.rawPremultiplied = false;
        if (n.defined(t2.raw.premultiplied)) {
          if (n.bool(t2.raw.premultiplied)) {
            i2.rawPremultiplied = t2.raw.premultiplied;
          } else {
            throw n.invalidParameterError("raw.premultiplied", "boolean", t2.raw.premultiplied);
          }
        }
        i2.rawPageHeight = 0;
        if (n.defined(t2.raw.pageHeight)) {
          if (n.integer(t2.raw.pageHeight) && t2.raw.pageHeight > 0 && t2.raw.pageHeight <= t2.raw.height) {
            if (t2.raw.height % t2.raw.pageHeight !== 0) {
              throw new Error(`Expected raw.height ${t2.raw.height} to be a multiple of raw.pageHeight ${t2.raw.pageHeight}`);
            }
            i2.rawPageHeight = t2.raw.pageHeight;
          } else {
            throw n.invalidParameterError("raw.pageHeight", "positive integer", t2.raw.pageHeight);
          }
        }
      }
      if (n.defined(t2.animated)) {
        if (n.bool(t2.animated)) {
          i2.pages = t2.animated ? -1 : 1;
        } else {
          throw n.invalidParameterError("animated", "boolean", t2.animated);
        }
      }
      if (n.defined(t2.pages)) {
        if (n.integer(t2.pages) && n.inRange(t2.pages, -1, 1e5)) {
          i2.pages = t2.pages;
        } else {
          throw n.invalidParameterError("pages", "integer between -1 and 100000", t2.pages);
        }
      }
      if (n.defined(t2.page)) {
        if (n.integer(t2.page) && n.inRange(t2.page, 0, 1e5)) {
          i2.page = t2.page;
        } else {
          throw n.invalidParameterError("page", "integer between 0 and 100000", t2.page);
        }
      }
      if (n.object(t2.openSlide) && n.defined(t2.openSlide.level)) {
        if (n.integer(t2.openSlide.level) && n.inRange(t2.openSlide.level, 0, 256)) {
          i2.openSlideLevel = t2.openSlide.level;
        } else {
          throw n.invalidParameterError("openSlide.level", "integer between 0 and 256", t2.openSlide.level);
        }
      } else if (n.defined(t2.level)) {
        if (n.integer(t2.level) && n.inRange(t2.level, 0, 256)) {
          i2.openSlideLevel = t2.level;
        } else {
          throw n.invalidParameterError("level", "integer between 0 and 256", t2.level);
        }
      }
      if (n.object(t2.tiff) && n.defined(t2.tiff.subifd)) {
        if (n.integer(t2.tiff.subifd) && n.inRange(t2.tiff.subifd, -1, 1e5)) {
          i2.tiffSubifd = t2.tiff.subifd;
        } else {
          throw n.invalidParameterError("tiff.subifd", "integer between -1 and 100000", t2.tiff.subifd);
        }
      } else if (n.defined(t2.subifd)) {
        if (n.integer(t2.subifd) && n.inRange(t2.subifd, -1, 1e5)) {
          i2.tiffSubifd = t2.subifd;
        } else {
          throw n.invalidParameterError("subifd", "integer between -1 and 100000", t2.subifd);
        }
      }
      if (n.object(t2.svg)) {
        if (n.defined(t2.svg.stylesheet)) {
          if (n.string(t2.svg.stylesheet)) {
            i2.svgStylesheet = t2.svg.stylesheet;
          } else {
            throw n.invalidParameterError("svg.stylesheet", "string", t2.svg.stylesheet);
          }
        }
        if (n.defined(t2.svg.highBitdepth)) {
          if (n.bool(t2.svg.highBitdepth)) {
            i2.svgHighBitdepth = t2.svg.highBitdepth;
          } else {
            throw n.invalidParameterError("svg.highBitdepth", "boolean", t2.svg.highBitdepth);
          }
        }
      }
      if (n.object(t2.pdf) && n.defined(t2.pdf.background)) {
        i2.pdfBackground = this._getBackgroundColourOption(t2.pdf.background);
      } else if (n.defined(t2.pdfBackground)) {
        i2.pdfBackground = this._getBackgroundColourOption(t2.pdfBackground);
      }
      if (n.object(t2.jp2) && n.defined(t2.jp2.oneshot)) {
        if (n.bool(t2.jp2.oneshot)) {
          i2.jp2Oneshot = t2.jp2.oneshot;
        } else {
          throw n.invalidParameterError("jp2.oneshot", "boolean", t2.jp2.oneshot);
        }
      }
      if (n.defined(t2.create)) {
        if (n.object(t2.create) && n.integer(t2.create.width) && t2.create.width > 0 && n.integer(t2.create.height) && t2.create.height > 0 && n.integer(t2.create.channels)) {
          i2.createWidth = t2.create.width;
          i2.createHeight = t2.create.height;
          i2.createChannels = t2.create.channels;
          i2.createPageHeight = 0;
          if (n.defined(t2.create.pageHeight)) {
            if (n.integer(t2.create.pageHeight) && t2.create.pageHeight > 0 && t2.create.pageHeight <= t2.create.height) {
              if (t2.create.height % t2.create.pageHeight !== 0) {
                throw new Error(`Expected create.height ${t2.create.height} to be a multiple of create.pageHeight ${t2.create.pageHeight}`);
              }
              i2.createPageHeight = t2.create.pageHeight;
            } else {
              throw n.invalidParameterError("create.pageHeight", "positive integer", t2.create.pageHeight);
            }
          }
          if (n.defined(t2.create.noise)) {
            if (!n.object(t2.create.noise)) {
              throw new Error("Expected noise to be an object");
            }
            if (t2.create.noise.type !== "gaussian") {
              throw new Error("Only gaussian noise is supported at the moment");
            }
            i2.createNoiseType = t2.create.noise.type;
            if (!n.inRange(t2.create.channels, 1, 4)) {
              throw n.invalidParameterError("create.channels", "number between 1 and 4", t2.create.channels);
            }
            i2.createNoiseMean = 128;
            if (n.defined(t2.create.noise.mean)) {
              if (n.number(t2.create.noise.mean) && n.inRange(t2.create.noise.mean, 0, 1e4)) {
                i2.createNoiseMean = t2.create.noise.mean;
              } else {
                throw n.invalidParameterError("create.noise.mean", "number between 0 and 10000", t2.create.noise.mean);
              }
            }
            i2.createNoiseSigma = 30;
            if (n.defined(t2.create.noise.sigma)) {
              if (n.number(t2.create.noise.sigma) && n.inRange(t2.create.noise.sigma, 0, 1e4)) {
                i2.createNoiseSigma = t2.create.noise.sigma;
              } else {
                throw n.invalidParameterError("create.noise.sigma", "number between 0 and 10000", t2.create.noise.sigma);
              }
            }
          } else if (n.defined(t2.create.background)) {
            if (!n.inRange(t2.create.channels, 3, 4)) {
              throw n.invalidParameterError("create.channels", "number between 3 and 4", t2.create.channels);
            }
            i2.createBackground = this._getBackgroundColourOption(t2.create.background);
          } else {
            throw new Error("Expected valid noise or background to create a new input image");
          }
          delete i2.buffer;
        } else {
          throw new Error("Expected valid width, height and channels to create a new input image");
        }
      }
      if (n.defined(t2.text)) {
        if (n.object(t2.text) && n.string(t2.text.text)) {
          i2.textValue = t2.text.text;
          if (n.defined(t2.text.height) && n.defined(t2.text.dpi)) {
            throw new Error("Expected only one of dpi or height");
          }
          if (n.defined(t2.text.font)) {
            if (n.string(t2.text.font)) {
              i2.textFont = t2.text.font;
            } else {
              throw n.invalidParameterError("text.font", "string", t2.text.font);
            }
          }
          if (n.defined(t2.text.fontfile)) {
            if (n.string(t2.text.fontfile)) {
              i2.textFontfile = t2.text.fontfile;
            } else {
              throw n.invalidParameterError("text.fontfile", "string", t2.text.fontfile);
            }
          }
          if (n.defined(t2.text.width)) {
            if (n.integer(t2.text.width) && t2.text.width > 0) {
              i2.textWidth = t2.text.width;
            } else {
              throw n.invalidParameterError("text.width", "positive integer", t2.text.width);
            }
          }
          if (n.defined(t2.text.height)) {
            if (n.integer(t2.text.height) && t2.text.height > 0) {
              i2.textHeight = t2.text.height;
            } else {
              throw n.invalidParameterError("text.height", "positive integer", t2.text.height);
            }
          }
          if (n.defined(t2.text.align)) {
            if (n.string(t2.text.align) && n.string(this.constructor.align[t2.text.align])) {
              i2.textAlign = this.constructor.align[t2.text.align];
            } else {
              throw n.invalidParameterError("text.align", "valid alignment", t2.text.align);
            }
          }
          if (n.defined(t2.text.justify)) {
            if (n.bool(t2.text.justify)) {
              i2.textJustify = t2.text.justify;
            } else {
              throw n.invalidParameterError("text.justify", "boolean", t2.text.justify);
            }
          }
          if (n.defined(t2.text.dpi)) {
            if (n.integer(t2.text.dpi) && n.inRange(t2.text.dpi, 1, 1e6)) {
              i2.textDpi = t2.text.dpi;
            } else {
              throw n.invalidParameterError("text.dpi", "integer between 1 and 1000000", t2.text.dpi);
            }
          }
          if (n.defined(t2.text.rgba)) {
            if (n.bool(t2.text.rgba)) {
              i2.textRgba = t2.text.rgba;
            } else {
              throw n.invalidParameterError("text.rgba", "bool", t2.text.rgba);
            }
          }
          if (n.defined(t2.text.spacing)) {
            if (n.integer(t2.text.spacing) && n.inRange(t2.text.spacing, -1e6, 1e6)) {
              i2.textSpacing = t2.text.spacing;
            } else {
              throw n.invalidParameterError("text.spacing", "integer between -1000000 and 1000000", t2.text.spacing);
            }
          }
          if (n.defined(t2.text.wrap)) {
            if (n.string(t2.text.wrap) && n.inArray(t2.text.wrap, ["word", "char", "word-char", "none"])) {
              i2.textWrap = t2.text.wrap;
            } else {
              throw n.invalidParameterError("text.wrap", "one of: word, char, word-char, none", t2.text.wrap);
            }
          }
          delete i2.buffer;
        } else {
          throw new Error("Expected a valid string to create an image with text.");
        }
      }
      if (n.defined(t2.join)) {
        if (n.defined(this.options.join)) {
          if (n.defined(t2.join.animated)) {
            if (n.bool(t2.join.animated)) {
              i2.joinAnimated = t2.join.animated;
            } else {
              throw n.invalidParameterError("join.animated", "boolean", t2.join.animated);
            }
          }
          if (n.defined(t2.join.across)) {
            if (n.integer(t2.join.across) && n.inRange(t2.join.across, 1, 1e6)) {
              i2.joinAcross = t2.join.across;
            } else {
              throw n.invalidParameterError("join.across", "integer between 1 and 100000", t2.join.across);
            }
          }
          if (n.defined(t2.join.shim)) {
            if (n.integer(t2.join.shim) && n.inRange(t2.join.shim, 0, 1e6)) {
              i2.joinShim = t2.join.shim;
            } else {
              throw n.invalidParameterError("join.shim", "integer between 0 and 100000", t2.join.shim);
            }
          }
          if (n.defined(t2.join.background)) {
            i2.joinBackground = this._getBackgroundColourOption(t2.join.background);
          }
          if (n.defined(t2.join.halign)) {
            if (n.string(t2.join.halign) && n.string(this.constructor.align[t2.join.halign])) {
              i2.joinHalign = this.constructor.align[t2.join.halign];
            } else {
              throw n.invalidParameterError("join.halign", "valid alignment", t2.join.halign);
            }
          }
          if (n.defined(t2.join.valign)) {
            if (n.string(t2.join.valign) && n.string(this.constructor.align[t2.join.valign])) {
              i2.joinValign = this.constructor.align[t2.join.valign];
            } else {
              throw n.invalidParameterError("join.valign", "valid alignment", t2.join.valign);
            }
          }
        } else {
          throw new Error("Expected input to be an array of images to join");
        }
      }
    } else if (n.defined(t2)) {
      throw new Error(`Invalid input options ${t2}`);
    }
    return i2;
  }
  function _write(e2, t2, r2) {
    if (Array.isArray(this.options.input.buffer)) {
      if (n.buffer(e2)) {
        if (this.options.input.buffer.length === 0) {
          this.on("finish", (() => {
            this.streamInFinished = true;
          }));
        }
        this.options.input.buffer.push(e2);
        r2();
      } else {
        r2(new Error("Non-Buffer data on Writable Stream"));
      }
    } else {
      r2(new Error("Unexpected data on Writable Stream"));
    }
  }
  function _flattenBufferIn() {
    if (this._isStreamInput()) {
      this.options.input.buffer = Buffer.concat(this.options.input.buffer);
    }
  }
  function _isStreamInput() {
    return Array.isArray(this.options.input.buffer);
  }
  function metadata(e2) {
    const t2 = Error();
    if (n.fn(e2)) {
      if (this._isStreamInput()) {
        this.on("finish", (() => {
          this._flattenBufferIn();
          i.metadata(this.options, ((r2, i2) => {
            if (r2) {
              e2(n.nativeError(r2, t2));
            } else {
              e2(null, i2);
            }
          }));
        }));
      } else {
        i.metadata(this.options, ((r2, i2) => {
          if (r2) {
            e2(n.nativeError(r2, t2));
          } else {
            e2(null, i2);
          }
        }));
      }
      return this;
    } else {
      if (this._isStreamInput()) {
        return new Promise(((e3, r2) => {
          const finished = () => {
            this._flattenBufferIn();
            i.metadata(this.options, ((i2, o2) => {
              if (i2) {
                r2(n.nativeError(i2, t2));
              } else {
                e3(o2);
              }
            }));
          };
          if (this.writableFinished) {
            finished();
          } else {
            this.once("finish", finished);
          }
        }));
      } else {
        return new Promise(((e3, r2) => {
          i.metadata(this.options, ((i2, o2) => {
            if (i2) {
              r2(n.nativeError(i2, t2));
            } else {
              e3(o2);
            }
          }));
        }));
      }
    }
  }
  function stats(e2) {
    const t2 = Error();
    if (n.fn(e2)) {
      if (this._isStreamInput()) {
        this.on("finish", (() => {
          this._flattenBufferIn();
          i.stats(this.options, ((r2, i2) => {
            if (r2) {
              e2(n.nativeError(r2, t2));
            } else {
              e2(null, i2);
            }
          }));
        }));
      } else {
        i.stats(this.options, ((r2, i2) => {
          if (r2) {
            e2(n.nativeError(r2, t2));
          } else {
            e2(null, i2);
          }
        }));
      }
      return this;
    } else {
      if (this._isStreamInput()) {
        return new Promise(((e3, r2) => {
          this.on("finish", (function() {
            this._flattenBufferIn();
            i.stats(this.options, ((i2, o2) => {
              if (i2) {
                r2(n.nativeError(i2, t2));
              } else {
                e3(o2);
              }
            }));
          }));
        }));
      } else {
        return new Promise(((e3, r2) => {
          i.stats(this.options, ((i2, o2) => {
            if (i2) {
              r2(n.nativeError(i2, t2));
            } else {
              e3(o2);
            }
          }));
        }));
      }
    }
  }
  e.exports = (e2) => {
    Object.assign(e2.prototype, { _inputOptionsFromObject, _createInputDescriptor, _write, _flattenBufferIn, _isStreamInput, metadata, stats });
    e2.align = o;
  };
}, 3031: (e) => {
  const defined = (e2) => typeof e2 !== "undefined" && e2 !== null;
  const object = (e2) => typeof e2 === "object";
  const plainObject = (e2) => Object.prototype.toString.call(e2) === "[object Object]";
  const fn = (e2) => typeof e2 === "function";
  const bool = (e2) => typeof e2 === "boolean";
  const buffer = (e2) => e2 instanceof Buffer;
  const typedArray = (e2) => {
    if (defined(e2)) {
      switch (e2.constructor) {
        case Uint8Array:
        case Uint8ClampedArray:
        case Int8Array:
        case Uint16Array:
        case Int16Array:
        case Uint32Array:
        case Int32Array:
        case Float32Array:
        case Float64Array:
          return true;
      }
    }
    return false;
  };
  const arrayBuffer = (e2) => e2 instanceof ArrayBuffer;
  const string = (e2) => typeof e2 === "string" && e2.length > 0;
  const number = (e2) => typeof e2 === "number" && !Number.isNaN(e2);
  const integer = (e2) => Number.isInteger(e2);
  const inRange = (e2, t, r) => e2 >= t && e2 <= r;
  const inArray = (e2, t) => t.includes(e2);
  const invalidParameterError = (e2, t, r) => new Error(`Expected ${t} for ${e2} but received ${r} of type ${typeof r}`);
  const nativeError = (e2, t) => {
    t.message = e2.message;
    return t;
  };
  e.exports = { defined, object, plainObject, fn, bool, buffer, typedArray, arrayBuffer, string, number, integer, inRange, inArray, invalidParameterError, nativeError };
}, 1808: (e, t, r) => {
  const { spawnSync: n } = r(1421);
  const { createHash: i } = r(7598);
  const o = r(5105);
  const s = r(7308);
  const a = r(4243);
  const l = r(8772);
  const { config: c, engines: h, optionalDependencies: u } = r(7816);
  const p = process.env.npm_package_config_libvips || c.libvips;
  const d = o(p).version;
  const m = ["darwin-arm64", "darwin-x64", "linux-arm", "linux-arm64", "linux-ppc64", "linux-riscv64", "linux-s390x", "linux-x64", "linuxmusl-arm64", "linuxmusl-x64", "win32-arm64", "win32-ia32", "win32-x64"];
  const g = { encoding: "utf8", shell: true };
  const log = (e2) => {
    if (e2 instanceof Error) {
      console.error(`sharp: Installation error: ${e2.message}`);
    } else {
      console.log(`sharp: ${e2}`);
    }
  };
  const runtimeLibc = () => l.isNonGlibcLinuxSync() ? l.familySync() : "";
  const runtimePlatformArch = () => `${process.platform}${runtimeLibc()}-${process.arch}`;
  const buildPlatformArch = () => {
    if (isEmscripten()) {
      return "wasm32";
    }
    const { npm_config_arch: e2, npm_config_platform: t2, npm_config_libc: r2 } = process.env;
    const n2 = typeof r2 === "string" ? r2 : runtimeLibc();
    return `${t2 || process.platform}${n2}-${e2 || process.arch}`;
  };
  const buildSharpLibvipsIncludeDir = () => {
    try {
      return (0, module__WEBPACK_IMPORTED_MODULE_0__.createRequire)(import.meta.url)(`@img/sharp-libvips-dev-${buildPlatformArch()}/include`);
    } catch {
      try {
        return r(6576);
      } catch {
      }
    }
    return "";
  };
  const buildSharpLibvipsCPlusPlusDir = () => {
    try {
      return r(7063);
    } catch {
    }
    return "";
  };
  const buildSharpLibvipsLibDir = () => {
    try {
      return (0, module__WEBPACK_IMPORTED_MODULE_0__.createRequire)(import.meta.url)(`@img/sharp-libvips-dev-${buildPlatformArch()}/lib`);
    } catch {
      try {
        return (0, module__WEBPACK_IMPORTED_MODULE_0__.createRequire)(import.meta.url)(`@img/sharp-libvips-${buildPlatformArch()}/lib`);
      } catch {
      }
    }
    return "";
  };
  const isUnsupportedNodeRuntime = () => {
    if (process.release?.name === "node" && process.versions) {
      if (!a(process.versions.node, h.node)) {
        return { found: process.versions.node, expected: h.node };
      }
    }
  };
  const isEmscripten = () => {
    const { CC: e2 } = process.env;
    return Boolean(e2?.endsWith("/emcc"));
  };
  const isRosetta = () => {
    if (process.platform === "darwin" && process.arch === "x64") {
      const e2 = n("sysctl sysctl.proc_translated", g).stdout;
      return (e2 || "").trim() === "sysctl.proc_translated: 1";
    }
    return false;
  };
  const sha512 = (e2) => i("sha512").update(e2).digest("hex");
  const yarnLocator = () => {
    try {
      const e2 = sha512(`imgsharp-libvips-${buildPlatformArch()}`);
      const t2 = o(u[`@img/sharp-libvips-${buildPlatformArch()}`], { includePrerelease: true }).version;
      return sha512(`${e2}npm:${t2}`).slice(0, 10);
    } catch {
    }
    return "";
  };
  const spawnRebuild = () => n(`node-gyp rebuild --directory=src ${isEmscripten() ? "--nodedir=emscripten" : ""}`, { ...g, stdio: "inherit" }).status;
  const globalLibvipsVersion = () => {
    if (process.platform !== "win32") {
      const e2 = n("pkg-config --modversion vips-cpp", { ...g, env: { ...process.env, PKG_CONFIG_PATH: pkgConfigPath() } }).stdout;
      return (e2 || "").trim();
    } else {
      return "";
    }
  };
  const pkgConfigPath = () => {
    if (process.platform !== "win32") {
      const e2 = n('which brew >/dev/null 2>&1 && brew environment --plain | grep PKG_CONFIG_LIBDIR | cut -d" " -f2', g).stdout || "";
      return [e2.trim(), process.env.PKG_CONFIG_PATH, "/usr/local/lib/pkgconfig", "/usr/lib/pkgconfig", "/usr/local/libdata/pkgconfig", "/usr/libdata/pkgconfig"].filter(Boolean).join(":");
    } else {
      return "";
    }
  };
  const skipSearch = (e2, t2, r2) => {
    if (r2) {
      r2(`Detected ${t2}, skipping search for globally-installed libvips`);
    }
    return e2;
  };
  const useGlobalLibvips = (e2) => {
    if (Boolean(process.env.SHARP_IGNORE_GLOBAL_LIBVIPS) === true) {
      return skipSearch(false, "SHARP_IGNORE_GLOBAL_LIBVIPS", e2);
    }
    if (Boolean(process.env.SHARP_FORCE_GLOBAL_LIBVIPS) === true) {
      return skipSearch(true, "SHARP_FORCE_GLOBAL_LIBVIPS", e2);
    }
    if (isRosetta()) {
      return skipSearch(false, "Rosetta", e2);
    }
    const t2 = globalLibvipsVersion();
    return !!t2 && s(t2, d);
  };
  e.exports = { minimumLibvipsVersion: d, prebuiltPlatforms: m, buildPlatformArch, buildSharpLibvipsIncludeDir, buildSharpLibvipsCPlusPlusDir, buildSharpLibvipsLibDir, isUnsupportedNodeRuntime, runtimePlatformArch, log, yarnLocator, spawnRebuild, globalLibvipsVersion, pkgConfigPath, useGlobalLibvips };
}, 6450: (e, t, r) => {
  const n = r(3031);
  const i = { integer: "integer", float: "float", approximate: "approximate" };
  function rotate(e2, t2) {
    if (!n.defined(e2)) {
      return this.autoOrient();
    }
    if (this.options.angle || this.options.rotationAngle) {
      this.options.debuglog("ignoring previous rotate options");
      this.options.angle = 0;
      this.options.rotationAngle = 0;
    }
    if (n.integer(e2) && !(e2 % 90)) {
      this.options.angle = e2;
    } else if (n.number(e2)) {
      this.options.rotationAngle = e2;
      if (n.object(t2) && t2.background) {
        this._setBackgroundColourOption("rotationBackground", t2.background);
      }
    } else {
      throw n.invalidParameterError("angle", "numeric", e2);
    }
    return this;
  }
  function autoOrient() {
    this.options.input.autoOrient = true;
    return this;
  }
  function flip(e2) {
    this.options.flip = n.bool(e2) ? e2 : true;
    return this;
  }
  function flop(e2) {
    this.options.flop = n.bool(e2) ? e2 : true;
    return this;
  }
  function affine(e2, t2) {
    const r2 = [].concat(...e2);
    if (r2.length === 4 && r2.every(n.number)) {
      this.options.affineMatrix = r2;
    } else {
      throw n.invalidParameterError("matrix", "1x4 or 2x2 array", e2);
    }
    if (n.defined(t2)) {
      if (n.object(t2)) {
        this._setBackgroundColourOption("affineBackground", t2.background);
        if (n.defined(t2.idx)) {
          if (n.number(t2.idx)) {
            this.options.affineIdx = t2.idx;
          } else {
            throw n.invalidParameterError("options.idx", "number", t2.idx);
          }
        }
        if (n.defined(t2.idy)) {
          if (n.number(t2.idy)) {
            this.options.affineIdy = t2.idy;
          } else {
            throw n.invalidParameterError("options.idy", "number", t2.idy);
          }
        }
        if (n.defined(t2.odx)) {
          if (n.number(t2.odx)) {
            this.options.affineOdx = t2.odx;
          } else {
            throw n.invalidParameterError("options.odx", "number", t2.odx);
          }
        }
        if (n.defined(t2.ody)) {
          if (n.number(t2.ody)) {
            this.options.affineOdy = t2.ody;
          } else {
            throw n.invalidParameterError("options.ody", "number", t2.ody);
          }
        }
        if (n.defined(t2.interpolator)) {
          if (n.inArray(t2.interpolator, Object.values(this.constructor.interpolators))) {
            this.options.affineInterpolator = t2.interpolator;
          } else {
            throw n.invalidParameterError("options.interpolator", "valid interpolator name", t2.interpolator);
          }
        }
      } else {
        throw n.invalidParameterError("options", "object", t2);
      }
    }
    return this;
  }
  function sharpen(e2, t2, r2) {
    if (!n.defined(e2)) {
      this.options.sharpenSigma = -1;
    } else if (n.bool(e2)) {
      this.options.sharpenSigma = e2 ? -1 : 0;
    } else if (n.number(e2) && n.inRange(e2, 0.01, 1e4)) {
      this.options.sharpenSigma = e2;
      if (n.defined(t2)) {
        if (n.number(t2) && n.inRange(t2, 0, 1e4)) {
          this.options.sharpenM1 = t2;
        } else {
          throw n.invalidParameterError("flat", "number between 0 and 10000", t2);
        }
      }
      if (n.defined(r2)) {
        if (n.number(r2) && n.inRange(r2, 0, 1e4)) {
          this.options.sharpenM2 = r2;
        } else {
          throw n.invalidParameterError("jagged", "number between 0 and 10000", r2);
        }
      }
    } else if (n.plainObject(e2)) {
      if (n.number(e2.sigma) && n.inRange(e2.sigma, 1e-6, 10)) {
        this.options.sharpenSigma = e2.sigma;
      } else {
        throw n.invalidParameterError("options.sigma", "number between 0.000001 and 10", e2.sigma);
      }
      if (n.defined(e2.m1)) {
        if (n.number(e2.m1) && n.inRange(e2.m1, 0, 1e6)) {
          this.options.sharpenM1 = e2.m1;
        } else {
          throw n.invalidParameterError("options.m1", "number between 0 and 1000000", e2.m1);
        }
      }
      if (n.defined(e2.m2)) {
        if (n.number(e2.m2) && n.inRange(e2.m2, 0, 1e6)) {
          this.options.sharpenM2 = e2.m2;
        } else {
          throw n.invalidParameterError("options.m2", "number between 0 and 1000000", e2.m2);
        }
      }
      if (n.defined(e2.x1)) {
        if (n.number(e2.x1) && n.inRange(e2.x1, 0, 1e6)) {
          this.options.sharpenX1 = e2.x1;
        } else {
          throw n.invalidParameterError("options.x1", "number between 0 and 1000000", e2.x1);
        }
      }
      if (n.defined(e2.y2)) {
        if (n.number(e2.y2) && n.inRange(e2.y2, 0, 1e6)) {
          this.options.sharpenY2 = e2.y2;
        } else {
          throw n.invalidParameterError("options.y2", "number between 0 and 1000000", e2.y2);
        }
      }
      if (n.defined(e2.y3)) {
        if (n.number(e2.y3) && n.inRange(e2.y3, 0, 1e6)) {
          this.options.sharpenY3 = e2.y3;
        } else {
          throw n.invalidParameterError("options.y3", "number between 0 and 1000000", e2.y3);
        }
      }
    } else {
      throw n.invalidParameterError("sigma", "number between 0.01 and 10000", e2);
    }
    return this;
  }
  function median(e2) {
    if (!n.defined(e2)) {
      this.options.medianSize = 3;
    } else if (n.integer(e2) && n.inRange(e2, 1, 1e3)) {
      this.options.medianSize = e2;
    } else {
      throw n.invalidParameterError("size", "integer between 1 and 1000", e2);
    }
    return this;
  }
  function blur(e2) {
    let t2;
    if (n.number(e2)) {
      t2 = e2;
    } else if (n.plainObject(e2)) {
      if (!n.number(e2.sigma)) {
        throw n.invalidParameterError("options.sigma", "number between 0.3 and 1000", t2);
      }
      t2 = e2.sigma;
      if ("precision" in e2) {
        if (n.string(i[e2.precision])) {
          this.options.precision = i[e2.precision];
        } else {
          throw n.invalidParameterError("precision", "one of: integer, float, approximate", e2.precision);
        }
      }
      if ("minAmplitude" in e2) {
        if (n.number(e2.minAmplitude) && n.inRange(e2.minAmplitude, 1e-3, 1)) {
          this.options.minAmpl = e2.minAmplitude;
        } else {
          throw n.invalidParameterError("minAmplitude", "number between 0.001 and 1", e2.minAmplitude);
        }
      }
    }
    if (!n.defined(e2)) {
      this.options.blurSigma = -1;
    } else if (n.bool(e2)) {
      this.options.blurSigma = e2 ? -1 : 0;
    } else if (n.number(t2) && n.inRange(t2, 0.3, 1e3)) {
      this.options.blurSigma = t2;
    } else {
      throw n.invalidParameterError("sigma", "number between 0.3 and 1000", t2);
    }
    return this;
  }
  function dilate(e2) {
    if (!n.defined(e2)) {
      this.options.dilateWidth = 1;
    } else if (n.integer(e2) && e2 > 0) {
      this.options.dilateWidth = e2;
    } else {
      throw n.invalidParameterError("dilate", "positive integer", dilate);
    }
    return this;
  }
  function erode(e2) {
    if (!n.defined(e2)) {
      this.options.erodeWidth = 1;
    } else if (n.integer(e2) && e2 > 0) {
      this.options.erodeWidth = e2;
    } else {
      throw n.invalidParameterError("erode", "positive integer", erode);
    }
    return this;
  }
  function flatten(e2) {
    this.options.flatten = n.bool(e2) ? e2 : true;
    if (n.object(e2)) {
      this._setBackgroundColourOption("flattenBackground", e2.background);
    }
    return this;
  }
  function unflatten() {
    this.options.unflatten = true;
    return this;
  }
  function gamma(e2, t2) {
    if (!n.defined(e2)) {
      this.options.gamma = 2.2;
    } else if (n.number(e2) && n.inRange(e2, 1, 3)) {
      this.options.gamma = e2;
    } else {
      throw n.invalidParameterError("gamma", "number between 1.0 and 3.0", e2);
    }
    if (!n.defined(t2)) {
      this.options.gammaOut = this.options.gamma;
    } else if (n.number(t2) && n.inRange(t2, 1, 3)) {
      this.options.gammaOut = t2;
    } else {
      throw n.invalidParameterError("gammaOut", "number between 1.0 and 3.0", t2);
    }
    return this;
  }
  function negate(e2) {
    this.options.negate = n.bool(e2) ? e2 : true;
    if (n.plainObject(e2) && "alpha" in e2) {
      if (!n.bool(e2.alpha)) {
        throw n.invalidParameterError("alpha", "should be boolean value", e2.alpha);
      } else {
        this.options.negateAlpha = e2.alpha;
      }
    }
    return this;
  }
  function normalise(e2) {
    if (n.plainObject(e2)) {
      if (n.defined(e2.lower)) {
        if (n.number(e2.lower) && n.inRange(e2.lower, 0, 99)) {
          this.options.normaliseLower = e2.lower;
        } else {
          throw n.invalidParameterError("lower", "number between 0 and 99", e2.lower);
        }
      }
      if (n.defined(e2.upper)) {
        if (n.number(e2.upper) && n.inRange(e2.upper, 1, 100)) {
          this.options.normaliseUpper = e2.upper;
        } else {
          throw n.invalidParameterError("upper", "number between 1 and 100", e2.upper);
        }
      }
    }
    if (this.options.normaliseLower >= this.options.normaliseUpper) {
      throw n.invalidParameterError("range", "lower to be less than upper", `${this.options.normaliseLower} >= ${this.options.normaliseUpper}`);
    }
    this.options.normalise = true;
    return this;
  }
  function normalize(e2) {
    return this.normalise(e2);
  }
  function clahe(e2) {
    if (n.plainObject(e2)) {
      if (n.integer(e2.width) && e2.width > 0) {
        this.options.claheWidth = e2.width;
      } else {
        throw n.invalidParameterError("width", "integer greater than zero", e2.width);
      }
      if (n.integer(e2.height) && e2.height > 0) {
        this.options.claheHeight = e2.height;
      } else {
        throw n.invalidParameterError("height", "integer greater than zero", e2.height);
      }
      if (n.defined(e2.maxSlope)) {
        if (n.integer(e2.maxSlope) && n.inRange(e2.maxSlope, 0, 100)) {
          this.options.claheMaxSlope = e2.maxSlope;
        } else {
          throw n.invalidParameterError("maxSlope", "integer between 0 and 100", e2.maxSlope);
        }
      }
    } else {
      throw n.invalidParameterError("options", "plain object", e2);
    }
    return this;
  }
  function convolve(e2) {
    if (!n.object(e2) || !Array.isArray(e2.kernel) || !n.integer(e2.width) || !n.integer(e2.height) || !n.inRange(e2.width, 3, 1001) || !n.inRange(e2.height, 3, 1001) || e2.height * e2.width !== e2.kernel.length) {
      throw new Error("Invalid convolution kernel");
    }
    if (!n.integer(e2.scale)) {
      e2.scale = e2.kernel.reduce(((e3, t2) => e3 + t2), 0);
    }
    if (e2.scale < 1) {
      e2.scale = 1;
    }
    if (!n.integer(e2.offset)) {
      e2.offset = 0;
    }
    this.options.convKernel = e2;
    return this;
  }
  function threshold(e2, t2) {
    if (!n.defined(e2)) {
      this.options.threshold = 128;
    } else if (n.bool(e2)) {
      this.options.threshold = e2 ? 128 : 0;
    } else if (n.integer(e2) && n.inRange(e2, 0, 255)) {
      this.options.threshold = e2;
    } else {
      throw n.invalidParameterError("threshold", "integer between 0 and 255", e2);
    }
    if (!n.object(t2) || t2.greyscale === true || t2.grayscale === true) {
      this.options.thresholdGrayscale = true;
    } else {
      this.options.thresholdGrayscale = false;
    }
    return this;
  }
  function boolean(e2, t2, r2) {
    this.options.boolean = this._createInputDescriptor(e2, r2);
    if (n.string(t2) && n.inArray(t2, ["and", "or", "eor"])) {
      this.options.booleanOp = t2;
    } else {
      throw n.invalidParameterError("operator", "one of: and, or, eor", t2);
    }
    return this;
  }
  function linear(e2, t2) {
    if (!n.defined(e2) && n.number(t2)) {
      e2 = 1;
    } else if (n.number(e2) && !n.defined(t2)) {
      t2 = 0;
    }
    if (!n.defined(e2)) {
      this.options.linearA = [];
    } else if (n.number(e2)) {
      this.options.linearA = [e2];
    } else if (Array.isArray(e2) && e2.length && e2.every(n.number)) {
      this.options.linearA = e2;
    } else {
      throw n.invalidParameterError("a", "number or array of numbers", e2);
    }
    if (!n.defined(t2)) {
      this.options.linearB = [];
    } else if (n.number(t2)) {
      this.options.linearB = [t2];
    } else if (Array.isArray(t2) && t2.length && t2.every(n.number)) {
      this.options.linearB = t2;
    } else {
      throw n.invalidParameterError("b", "number or array of numbers", t2);
    }
    if (this.options.linearA.length !== this.options.linearB.length) {
      throw new Error("Expected a and b to be arrays of the same length");
    }
    return this;
  }
  function recomb(e2) {
    if (!Array.isArray(e2)) {
      throw n.invalidParameterError("inputMatrix", "array", e2);
    }
    if (e2.length !== 3 && e2.length !== 4) {
      throw n.invalidParameterError("inputMatrix", "3x3 or 4x4 array", e2.length);
    }
    const t2 = e2.flat().map(Number);
    if (t2.length !== 9 && t2.length !== 16) {
      throw n.invalidParameterError("inputMatrix", "cardinality of 9 or 16", t2.length);
    }
    this.options.recombMatrix = t2;
    return this;
  }
  function modulate(e2) {
    if (!n.plainObject(e2)) {
      throw n.invalidParameterError("options", "plain object", e2);
    }
    if ("brightness" in e2) {
      if (n.number(e2.brightness) && e2.brightness >= 0) {
        this.options.brightness = e2.brightness;
      } else {
        throw n.invalidParameterError("brightness", "number above zero", e2.brightness);
      }
    }
    if ("saturation" in e2) {
      if (n.number(e2.saturation) && e2.saturation >= 0) {
        this.options.saturation = e2.saturation;
      } else {
        throw n.invalidParameterError("saturation", "number above zero", e2.saturation);
      }
    }
    if ("hue" in e2) {
      if (n.integer(e2.hue)) {
        this.options.hue = e2.hue % 360;
      } else {
        throw n.invalidParameterError("hue", "number", e2.hue);
      }
    }
    if ("lightness" in e2) {
      if (n.number(e2.lightness)) {
        this.options.lightness = e2.lightness;
      } else {
        throw n.invalidParameterError("lightness", "number", e2.lightness);
      }
    }
    return this;
  }
  e.exports = (e2) => {
    Object.assign(e2.prototype, { autoOrient, rotate, flip, flop, affine, sharpen, erode, dilate, median, blur, flatten, unflatten, gamma, negate, normalise, normalize, clahe, convolve, threshold, boolean, linear, recomb, modulate });
  };
}, 982: (e, t, r) => {
  const n = r(6760);
  const i = r(3031);
  const o = r(1395);
  const s = /* @__PURE__ */ new Map([["heic", "heif"], ["heif", "heif"], ["avif", "avif"], ["jpeg", "jpeg"], ["jpg", "jpeg"], ["jpe", "jpeg"], ["tile", "tile"], ["dz", "tile"], ["png", "png"], ["raw", "raw"], ["tiff", "tiff"], ["tif", "tiff"], ["webp", "webp"], ["gif", "gif"], ["jp2", "jp2"], ["jpx", "jp2"], ["j2k", "jp2"], ["j2c", "jp2"], ["jxl", "jxl"]]);
  const a = /\.(jp[2x]|j2[kc])$/i;
  const errJp2Save = () => new Error("JP2 output requires libvips with support for OpenJPEG");
  const bitdepthFromColourCount = (e2) => 1 << 31 - Math.clz32(Math.ceil(Math.log2(e2)));
  function toFile(e2, t2) {
    let r2;
    if (!i.string(e2)) {
      r2 = new Error("Missing output file path");
    } else if (i.string(this.options.input.file) && n.resolve(this.options.input.file) === n.resolve(e2)) {
      r2 = new Error("Cannot use same file for input and output");
    } else if (a.test(n.extname(e2)) && !this.constructor.format.jp2k.output.file) {
      r2 = errJp2Save();
    }
    if (r2) {
      if (i.fn(t2)) {
        t2(r2);
      } else {
        return Promise.reject(r2);
      }
    } else {
      this.options.fileOut = e2;
      const r3 = Error();
      return this._pipeline(t2, r3);
    }
    return this;
  }
  function toBuffer(e2, t2) {
    if (i.object(e2)) {
      this._setBooleanOption("resolveWithObject", e2.resolveWithObject);
    } else if (this.options.resolveWithObject) {
      this.options.resolveWithObject = false;
    }
    this.options.fileOut = "";
    const r2 = Error();
    return this._pipeline(i.fn(e2) ? e2 : t2, r2);
  }
  function keepExif() {
    this.options.keepMetadata |= 1;
    return this;
  }
  function withExif(e2) {
    if (i.object(e2)) {
      for (const [t2, r2] of Object.entries(e2)) {
        if (i.object(r2)) {
          for (const [e3, n2] of Object.entries(r2)) {
            if (i.string(n2)) {
              this.options.withExif[`exif-${t2.toLowerCase()}-${e3}`] = n2;
            } else {
              throw i.invalidParameterError(`${t2}.${e3}`, "string", n2);
            }
          }
        } else {
          throw i.invalidParameterError(t2, "object", r2);
        }
      }
    } else {
      throw i.invalidParameterError("exif", "object", e2);
    }
    this.options.withExifMerge = false;
    return this.keepExif();
  }
  function withExifMerge(e2) {
    this.withExif(e2);
    this.options.withExifMerge = true;
    return this;
  }
  function keepIccProfile() {
    this.options.keepMetadata |= 8;
    return this;
  }
  function withIccProfile(e2, t2) {
    if (i.string(e2)) {
      this.options.withIccProfile = e2;
    } else {
      throw i.invalidParameterError("icc", "string", e2);
    }
    this.keepIccProfile();
    if (i.object(t2)) {
      if (i.defined(t2.attach)) {
        if (i.bool(t2.attach)) {
          if (!t2.attach) {
            this.options.keepMetadata &= ~8;
          }
        } else {
          throw i.invalidParameterError("attach", "boolean", t2.attach);
        }
      }
    }
    return this;
  }
  function keepXmp() {
    this.options.keepMetadata |= 2;
    return this;
  }
  function withXmp(e2) {
    if (i.string(e2) && e2.length > 0) {
      this.options.withXmp = e2;
      this.options.keepMetadata |= 2;
    } else {
      throw i.invalidParameterError("xmp", "non-empty string", e2);
    }
    return this;
  }
  function keepMetadata() {
    this.options.keepMetadata = 31;
    return this;
  }
  function withMetadata(e2) {
    this.keepMetadata();
    this.withIccProfile("srgb");
    if (i.object(e2)) {
      if (i.defined(e2.orientation)) {
        if (i.integer(e2.orientation) && i.inRange(e2.orientation, 1, 8)) {
          this.options.withMetadataOrientation = e2.orientation;
        } else {
          throw i.invalidParameterError("orientation", "integer between 1 and 8", e2.orientation);
        }
      }
      if (i.defined(e2.density)) {
        if (i.number(e2.density) && e2.density > 0) {
          this.options.withMetadataDensity = e2.density;
        } else {
          throw i.invalidParameterError("density", "positive number", e2.density);
        }
      }
      if (i.defined(e2.icc)) {
        this.withIccProfile(e2.icc);
      }
      if (i.defined(e2.exif)) {
        this.withExifMerge(e2.exif);
      }
    }
    return this;
  }
  function toFormat(e2, t2) {
    const r2 = s.get((i.object(e2) && i.string(e2.id) ? e2.id : e2).toLowerCase());
    if (!r2) {
      throw i.invalidParameterError("format", `one of: ${[...s.keys()].join(", ")}`, e2);
    }
    return this[r2](t2);
  }
  function jpeg(e2) {
    if (i.object(e2)) {
      if (i.defined(e2.quality)) {
        if (i.integer(e2.quality) && i.inRange(e2.quality, 1, 100)) {
          this.options.jpegQuality = e2.quality;
        } else {
          throw i.invalidParameterError("quality", "integer between 1 and 100", e2.quality);
        }
      }
      if (i.defined(e2.progressive)) {
        this._setBooleanOption("jpegProgressive", e2.progressive);
      }
      if (i.defined(e2.chromaSubsampling)) {
        if (i.string(e2.chromaSubsampling) && i.inArray(e2.chromaSubsampling, ["4:2:0", "4:4:4"])) {
          this.options.jpegChromaSubsampling = e2.chromaSubsampling;
        } else {
          throw i.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", e2.chromaSubsampling);
        }
      }
      const t2 = i.bool(e2.optimizeCoding) ? e2.optimizeCoding : e2.optimiseCoding;
      if (i.defined(t2)) {
        this._setBooleanOption("jpegOptimiseCoding", t2);
      }
      if (i.defined(e2.mozjpeg)) {
        if (i.bool(e2.mozjpeg)) {
          if (e2.mozjpeg) {
            this.options.jpegTrellisQuantisation = true;
            this.options.jpegOvershootDeringing = true;
            this.options.jpegOptimiseScans = true;
            this.options.jpegProgressive = true;
            this.options.jpegQuantisationTable = 3;
          }
        } else {
          throw i.invalidParameterError("mozjpeg", "boolean", e2.mozjpeg);
        }
      }
      const r2 = i.bool(e2.trellisQuantization) ? e2.trellisQuantization : e2.trellisQuantisation;
      if (i.defined(r2)) {
        this._setBooleanOption("jpegTrellisQuantisation", r2);
      }
      if (i.defined(e2.overshootDeringing)) {
        this._setBooleanOption("jpegOvershootDeringing", e2.overshootDeringing);
      }
      const n2 = i.bool(e2.optimizeScans) ? e2.optimizeScans : e2.optimiseScans;
      if (i.defined(n2)) {
        this._setBooleanOption("jpegOptimiseScans", n2);
        if (n2) {
          this.options.jpegProgressive = true;
        }
      }
      const o2 = i.number(e2.quantizationTable) ? e2.quantizationTable : e2.quantisationTable;
      if (i.defined(o2)) {
        if (i.integer(o2) && i.inRange(o2, 0, 8)) {
          this.options.jpegQuantisationTable = o2;
        } else {
          throw i.invalidParameterError("quantisationTable", "integer between 0 and 8", o2);
        }
      }
    }
    return this._updateFormatOut("jpeg", e2);
  }
  function png(e2) {
    if (i.object(e2)) {
      if (i.defined(e2.progressive)) {
        this._setBooleanOption("pngProgressive", e2.progressive);
      }
      if (i.defined(e2.compressionLevel)) {
        if (i.integer(e2.compressionLevel) && i.inRange(e2.compressionLevel, 0, 9)) {
          this.options.pngCompressionLevel = e2.compressionLevel;
        } else {
          throw i.invalidParameterError("compressionLevel", "integer between 0 and 9", e2.compressionLevel);
        }
      }
      if (i.defined(e2.adaptiveFiltering)) {
        this._setBooleanOption("pngAdaptiveFiltering", e2.adaptiveFiltering);
      }
      const t2 = e2.colours || e2.colors;
      if (i.defined(t2)) {
        if (i.integer(t2) && i.inRange(t2, 2, 256)) {
          this.options.pngBitdepth = bitdepthFromColourCount(t2);
        } else {
          throw i.invalidParameterError("colours", "integer between 2 and 256", t2);
        }
      }
      if (i.defined(e2.palette)) {
        this._setBooleanOption("pngPalette", e2.palette);
      } else if ([e2.quality, e2.effort, e2.colours, e2.colors, e2.dither].some(i.defined)) {
        this._setBooleanOption("pngPalette", true);
      }
      if (this.options.pngPalette) {
        if (i.defined(e2.quality)) {
          if (i.integer(e2.quality) && i.inRange(e2.quality, 0, 100)) {
            this.options.pngQuality = e2.quality;
          } else {
            throw i.invalidParameterError("quality", "integer between 0 and 100", e2.quality);
          }
        }
        if (i.defined(e2.effort)) {
          if (i.integer(e2.effort) && i.inRange(e2.effort, 1, 10)) {
            this.options.pngEffort = e2.effort;
          } else {
            throw i.invalidParameterError("effort", "integer between 1 and 10", e2.effort);
          }
        }
        if (i.defined(e2.dither)) {
          if (i.number(e2.dither) && i.inRange(e2.dither, 0, 1)) {
            this.options.pngDither = e2.dither;
          } else {
            throw i.invalidParameterError("dither", "number between 0.0 and 1.0", e2.dither);
          }
        }
      }
    }
    return this._updateFormatOut("png", e2);
  }
  function webp(e2) {
    if (i.object(e2)) {
      if (i.defined(e2.quality)) {
        if (i.integer(e2.quality) && i.inRange(e2.quality, 1, 100)) {
          this.options.webpQuality = e2.quality;
        } else {
          throw i.invalidParameterError("quality", "integer between 1 and 100", e2.quality);
        }
      }
      if (i.defined(e2.alphaQuality)) {
        if (i.integer(e2.alphaQuality) && i.inRange(e2.alphaQuality, 0, 100)) {
          this.options.webpAlphaQuality = e2.alphaQuality;
        } else {
          throw i.invalidParameterError("alphaQuality", "integer between 0 and 100", e2.alphaQuality);
        }
      }
      if (i.defined(e2.lossless)) {
        this._setBooleanOption("webpLossless", e2.lossless);
      }
      if (i.defined(e2.nearLossless)) {
        this._setBooleanOption("webpNearLossless", e2.nearLossless);
      }
      if (i.defined(e2.smartSubsample)) {
        this._setBooleanOption("webpSmartSubsample", e2.smartSubsample);
      }
      if (i.defined(e2.smartDeblock)) {
        this._setBooleanOption("webpSmartDeblock", e2.smartDeblock);
      }
      if (i.defined(e2.preset)) {
        if (i.string(e2.preset) && i.inArray(e2.preset, ["default", "photo", "picture", "drawing", "icon", "text"])) {
          this.options.webpPreset = e2.preset;
        } else {
          throw i.invalidParameterError("preset", "one of: default, photo, picture, drawing, icon, text", e2.preset);
        }
      }
      if (i.defined(e2.effort)) {
        if (i.integer(e2.effort) && i.inRange(e2.effort, 0, 6)) {
          this.options.webpEffort = e2.effort;
        } else {
          throw i.invalidParameterError("effort", "integer between 0 and 6", e2.effort);
        }
      }
      if (i.defined(e2.minSize)) {
        this._setBooleanOption("webpMinSize", e2.minSize);
      }
      if (i.defined(e2.mixed)) {
        this._setBooleanOption("webpMixed", e2.mixed);
      }
    }
    trySetAnimationOptions(e2, this.options);
    return this._updateFormatOut("webp", e2);
  }
  function gif(e2) {
    if (i.object(e2)) {
      if (i.defined(e2.reuse)) {
        this._setBooleanOption("gifReuse", e2.reuse);
      }
      if (i.defined(e2.progressive)) {
        this._setBooleanOption("gifProgressive", e2.progressive);
      }
      const t2 = e2.colours || e2.colors;
      if (i.defined(t2)) {
        if (i.integer(t2) && i.inRange(t2, 2, 256)) {
          this.options.gifBitdepth = bitdepthFromColourCount(t2);
        } else {
          throw i.invalidParameterError("colours", "integer between 2 and 256", t2);
        }
      }
      if (i.defined(e2.effort)) {
        if (i.number(e2.effort) && i.inRange(e2.effort, 1, 10)) {
          this.options.gifEffort = e2.effort;
        } else {
          throw i.invalidParameterError("effort", "integer between 1 and 10", e2.effort);
        }
      }
      if (i.defined(e2.dither)) {
        if (i.number(e2.dither) && i.inRange(e2.dither, 0, 1)) {
          this.options.gifDither = e2.dither;
        } else {
          throw i.invalidParameterError("dither", "number between 0.0 and 1.0", e2.dither);
        }
      }
      if (i.defined(e2.interFrameMaxError)) {
        if (i.number(e2.interFrameMaxError) && i.inRange(e2.interFrameMaxError, 0, 32)) {
          this.options.gifInterFrameMaxError = e2.interFrameMaxError;
        } else {
          throw i.invalidParameterError("interFrameMaxError", "number between 0.0 and 32.0", e2.interFrameMaxError);
        }
      }
      if (i.defined(e2.interPaletteMaxError)) {
        if (i.number(e2.interPaletteMaxError) && i.inRange(e2.interPaletteMaxError, 0, 256)) {
          this.options.gifInterPaletteMaxError = e2.interPaletteMaxError;
        } else {
          throw i.invalidParameterError("interPaletteMaxError", "number between 0.0 and 256.0", e2.interPaletteMaxError);
        }
      }
      if (i.defined(e2.keepDuplicateFrames)) {
        if (i.bool(e2.keepDuplicateFrames)) {
          this._setBooleanOption("gifKeepDuplicateFrames", e2.keepDuplicateFrames);
        } else {
          throw i.invalidParameterError("keepDuplicateFrames", "boolean", e2.keepDuplicateFrames);
        }
      }
    }
    trySetAnimationOptions(e2, this.options);
    return this._updateFormatOut("gif", e2);
  }
  function jp2(e2) {
    if (!this.constructor.format.jp2k.output.buffer) {
      throw errJp2Save();
    }
    if (i.object(e2)) {
      if (i.defined(e2.quality)) {
        if (i.integer(e2.quality) && i.inRange(e2.quality, 1, 100)) {
          this.options.jp2Quality = e2.quality;
        } else {
          throw i.invalidParameterError("quality", "integer between 1 and 100", e2.quality);
        }
      }
      if (i.defined(e2.lossless)) {
        if (i.bool(e2.lossless)) {
          this.options.jp2Lossless = e2.lossless;
        } else {
          throw i.invalidParameterError("lossless", "boolean", e2.lossless);
        }
      }
      if (i.defined(e2.tileWidth)) {
        if (i.integer(e2.tileWidth) && i.inRange(e2.tileWidth, 1, 32768)) {
          this.options.jp2TileWidth = e2.tileWidth;
        } else {
          throw i.invalidParameterError("tileWidth", "integer between 1 and 32768", e2.tileWidth);
        }
      }
      if (i.defined(e2.tileHeight)) {
        if (i.integer(e2.tileHeight) && i.inRange(e2.tileHeight, 1, 32768)) {
          this.options.jp2TileHeight = e2.tileHeight;
        } else {
          throw i.invalidParameterError("tileHeight", "integer between 1 and 32768", e2.tileHeight);
        }
      }
      if (i.defined(e2.chromaSubsampling)) {
        if (i.string(e2.chromaSubsampling) && i.inArray(e2.chromaSubsampling, ["4:2:0", "4:4:4"])) {
          this.options.jp2ChromaSubsampling = e2.chromaSubsampling;
        } else {
          throw i.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", e2.chromaSubsampling);
        }
      }
    }
    return this._updateFormatOut("jp2", e2);
  }
  function trySetAnimationOptions(e2, t2) {
    if (i.object(e2) && i.defined(e2.loop)) {
      if (i.integer(e2.loop) && i.inRange(e2.loop, 0, 65535)) {
        t2.loop = e2.loop;
      } else {
        throw i.invalidParameterError("loop", "integer between 0 and 65535", e2.loop);
      }
    }
    if (i.object(e2) && i.defined(e2.delay)) {
      if (i.integer(e2.delay) && i.inRange(e2.delay, 0, 65535)) {
        t2.delay = [e2.delay];
      } else if (Array.isArray(e2.delay) && e2.delay.every(i.integer) && e2.delay.every(((e3) => i.inRange(e3, 0, 65535)))) {
        t2.delay = e2.delay;
      } else {
        throw i.invalidParameterError("delay", "integer or an array of integers between 0 and 65535", e2.delay);
      }
    }
  }
  function tiff(e2) {
    if (i.object(e2)) {
      if (i.defined(e2.quality)) {
        if (i.integer(e2.quality) && i.inRange(e2.quality, 1, 100)) {
          this.options.tiffQuality = e2.quality;
        } else {
          throw i.invalidParameterError("quality", "integer between 1 and 100", e2.quality);
        }
      }
      if (i.defined(e2.bitdepth)) {
        if (i.integer(e2.bitdepth) && i.inArray(e2.bitdepth, [1, 2, 4, 8])) {
          this.options.tiffBitdepth = e2.bitdepth;
        } else {
          throw i.invalidParameterError("bitdepth", "1, 2, 4 or 8", e2.bitdepth);
        }
      }
      if (i.defined(e2.tile)) {
        this._setBooleanOption("tiffTile", e2.tile);
      }
      if (i.defined(e2.tileWidth)) {
        if (i.integer(e2.tileWidth) && e2.tileWidth > 0) {
          this.options.tiffTileWidth = e2.tileWidth;
        } else {
          throw i.invalidParameterError("tileWidth", "integer greater than zero", e2.tileWidth);
        }
      }
      if (i.defined(e2.tileHeight)) {
        if (i.integer(e2.tileHeight) && e2.tileHeight > 0) {
          this.options.tiffTileHeight = e2.tileHeight;
        } else {
          throw i.invalidParameterError("tileHeight", "integer greater than zero", e2.tileHeight);
        }
      }
      if (i.defined(e2.miniswhite)) {
        this._setBooleanOption("tiffMiniswhite", e2.miniswhite);
      }
      if (i.defined(e2.pyramid)) {
        this._setBooleanOption("tiffPyramid", e2.pyramid);
      }
      if (i.defined(e2.xres)) {
        if (i.number(e2.xres) && e2.xres > 0) {
          this.options.tiffXres = e2.xres;
        } else {
          throw i.invalidParameterError("xres", "number greater than zero", e2.xres);
        }
      }
      if (i.defined(e2.yres)) {
        if (i.number(e2.yres) && e2.yres > 0) {
          this.options.tiffYres = e2.yres;
        } else {
          throw i.invalidParameterError("yres", "number greater than zero", e2.yres);
        }
      }
      if (i.defined(e2.compression)) {
        if (i.string(e2.compression) && i.inArray(e2.compression, ["none", "jpeg", "deflate", "packbits", "ccittfax4", "lzw", "webp", "zstd", "jp2k"])) {
          this.options.tiffCompression = e2.compression;
        } else {
          throw i.invalidParameterError("compression", "one of: none, jpeg, deflate, packbits, ccittfax4, lzw, webp, zstd, jp2k", e2.compression);
        }
      }
      if (i.defined(e2.bigtiff)) {
        this._setBooleanOption("tiffBigtiff", e2.bigtiff);
      }
      if (i.defined(e2.predictor)) {
        if (i.string(e2.predictor) && i.inArray(e2.predictor, ["none", "horizontal", "float"])) {
          this.options.tiffPredictor = e2.predictor;
        } else {
          throw i.invalidParameterError("predictor", "one of: none, horizontal, float", e2.predictor);
        }
      }
      if (i.defined(e2.resolutionUnit)) {
        if (i.string(e2.resolutionUnit) && i.inArray(e2.resolutionUnit, ["inch", "cm"])) {
          this.options.tiffResolutionUnit = e2.resolutionUnit;
        } else {
          throw i.invalidParameterError("resolutionUnit", "one of: inch, cm", e2.resolutionUnit);
        }
      }
    }
    return this._updateFormatOut("tiff", e2);
  }
  function avif(e2) {
    return this.heif({ ...e2, compression: "av1" });
  }
  function heif(e2) {
    if (i.object(e2)) {
      if (i.string(e2.compression) && i.inArray(e2.compression, ["av1", "hevc"])) {
        this.options.heifCompression = e2.compression;
      } else {
        throw i.invalidParameterError("compression", "one of: av1, hevc", e2.compression);
      }
      if (i.defined(e2.quality)) {
        if (i.integer(e2.quality) && i.inRange(e2.quality, 1, 100)) {
          this.options.heifQuality = e2.quality;
        } else {
          throw i.invalidParameterError("quality", "integer between 1 and 100", e2.quality);
        }
      }
      if (i.defined(e2.lossless)) {
        if (i.bool(e2.lossless)) {
          this.options.heifLossless = e2.lossless;
        } else {
          throw i.invalidParameterError("lossless", "boolean", e2.lossless);
        }
      }
      if (i.defined(e2.effort)) {
        if (i.integer(e2.effort) && i.inRange(e2.effort, 0, 9)) {
          this.options.heifEffort = e2.effort;
        } else {
          throw i.invalidParameterError("effort", "integer between 0 and 9", e2.effort);
        }
      }
      if (i.defined(e2.chromaSubsampling)) {
        if (i.string(e2.chromaSubsampling) && i.inArray(e2.chromaSubsampling, ["4:2:0", "4:4:4"])) {
          this.options.heifChromaSubsampling = e2.chromaSubsampling;
        } else {
          throw i.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", e2.chromaSubsampling);
        }
      }
      if (i.defined(e2.bitdepth)) {
        if (i.integer(e2.bitdepth) && i.inArray(e2.bitdepth, [8, 10, 12])) {
          if (e2.bitdepth !== 8 && this.constructor.versions.heif) {
            throw i.invalidParameterError("bitdepth when using prebuilt binaries", 8, e2.bitdepth);
          }
          this.options.heifBitdepth = e2.bitdepth;
        } else {
          throw i.invalidParameterError("bitdepth", "8, 10 or 12", e2.bitdepth);
        }
      }
    } else {
      throw i.invalidParameterError("options", "Object", e2);
    }
    return this._updateFormatOut("heif", e2);
  }
  function jxl(e2) {
    if (i.object(e2)) {
      if (i.defined(e2.quality)) {
        if (i.integer(e2.quality) && i.inRange(e2.quality, 1, 100)) {
          this.options.jxlDistance = e2.quality >= 30 ? 0.1 + (100 - e2.quality) * 0.09 : 53 / 3e3 * e2.quality * e2.quality - 23 / 20 * e2.quality + 25;
        } else {
          throw i.invalidParameterError("quality", "integer between 1 and 100", e2.quality);
        }
      } else if (i.defined(e2.distance)) {
        if (i.number(e2.distance) && i.inRange(e2.distance, 0, 15)) {
          this.options.jxlDistance = e2.distance;
        } else {
          throw i.invalidParameterError("distance", "number between 0.0 and 15.0", e2.distance);
        }
      }
      if (i.defined(e2.decodingTier)) {
        if (i.integer(e2.decodingTier) && i.inRange(e2.decodingTier, 0, 4)) {
          this.options.jxlDecodingTier = e2.decodingTier;
        } else {
          throw i.invalidParameterError("decodingTier", "integer between 0 and 4", e2.decodingTier);
        }
      }
      if (i.defined(e2.lossless)) {
        if (i.bool(e2.lossless)) {
          this.options.jxlLossless = e2.lossless;
        } else {
          throw i.invalidParameterError("lossless", "boolean", e2.lossless);
        }
      }
      if (i.defined(e2.effort)) {
        if (i.integer(e2.effort) && i.inRange(e2.effort, 1, 9)) {
          this.options.jxlEffort = e2.effort;
        } else {
          throw i.invalidParameterError("effort", "integer between 1 and 9", e2.effort);
        }
      }
    }
    trySetAnimationOptions(e2, this.options);
    return this._updateFormatOut("jxl", e2);
  }
  function raw(e2) {
    if (i.object(e2)) {
      if (i.defined(e2.depth)) {
        if (i.string(e2.depth) && i.inArray(e2.depth, ["char", "uchar", "short", "ushort", "int", "uint", "float", "complex", "double", "dpcomplex"])) {
          this.options.rawDepth = e2.depth;
        } else {
          throw i.invalidParameterError("depth", "one of: char, uchar, short, ushort, int, uint, float, complex, double, dpcomplex", e2.depth);
        }
      }
    }
    return this._updateFormatOut("raw");
  }
  function tile(e2) {
    if (i.object(e2)) {
      if (i.defined(e2.size)) {
        if (i.integer(e2.size) && i.inRange(e2.size, 1, 8192)) {
          this.options.tileSize = e2.size;
        } else {
          throw i.invalidParameterError("size", "integer between 1 and 8192", e2.size);
        }
      }
      if (i.defined(e2.overlap)) {
        if (i.integer(e2.overlap) && i.inRange(e2.overlap, 0, 8192)) {
          if (e2.overlap > this.options.tileSize) {
            throw i.invalidParameterError("overlap", `<= size (${this.options.tileSize})`, e2.overlap);
          }
          this.options.tileOverlap = e2.overlap;
        } else {
          throw i.invalidParameterError("overlap", "integer between 0 and 8192", e2.overlap);
        }
      }
      if (i.defined(e2.container)) {
        if (i.string(e2.container) && i.inArray(e2.container, ["fs", "zip"])) {
          this.options.tileContainer = e2.container;
        } else {
          throw i.invalidParameterError("container", "one of: fs, zip", e2.container);
        }
      }
      if (i.defined(e2.layout)) {
        if (i.string(e2.layout) && i.inArray(e2.layout, ["dz", "google", "iiif", "iiif3", "zoomify"])) {
          this.options.tileLayout = e2.layout;
        } else {
          throw i.invalidParameterError("layout", "one of: dz, google, iiif, iiif3, zoomify", e2.layout);
        }
      }
      if (i.defined(e2.angle)) {
        if (i.integer(e2.angle) && !(e2.angle % 90)) {
          this.options.tileAngle = e2.angle;
        } else {
          throw i.invalidParameterError("angle", "positive/negative multiple of 90", e2.angle);
        }
      }
      this._setBackgroundColourOption("tileBackground", e2.background);
      if (i.defined(e2.depth)) {
        if (i.string(e2.depth) && i.inArray(e2.depth, ["onepixel", "onetile", "one"])) {
          this.options.tileDepth = e2.depth;
        } else {
          throw i.invalidParameterError("depth", "one of: onepixel, onetile, one", e2.depth);
        }
      }
      if (i.defined(e2.skipBlanks)) {
        if (i.integer(e2.skipBlanks) && i.inRange(e2.skipBlanks, -1, 65535)) {
          this.options.tileSkipBlanks = e2.skipBlanks;
        } else {
          throw i.invalidParameterError("skipBlanks", "integer between -1 and 255/65535", e2.skipBlanks);
        }
      } else if (i.defined(e2.layout) && e2.layout === "google") {
        this.options.tileSkipBlanks = 5;
      }
      const t2 = i.bool(e2.center) ? e2.center : e2.centre;
      if (i.defined(t2)) {
        this._setBooleanOption("tileCentre", t2);
      }
      if (i.defined(e2.id)) {
        if (i.string(e2.id)) {
          this.options.tileId = e2.id;
        } else {
          throw i.invalidParameterError("id", "string", e2.id);
        }
      }
      if (i.defined(e2.basename)) {
        if (i.string(e2.basename)) {
          this.options.tileBasename = e2.basename;
        } else {
          throw i.invalidParameterError("basename", "string", e2.basename);
        }
      }
    }
    if (i.inArray(this.options.formatOut, ["jpeg", "png", "webp"])) {
      this.options.tileFormat = this.options.formatOut;
    } else if (this.options.formatOut !== "input") {
      throw i.invalidParameterError("format", "one of: jpeg, png, webp", this.options.formatOut);
    }
    return this._updateFormatOut("dz");
  }
  function timeout(e2) {
    if (!i.plainObject(e2)) {
      throw i.invalidParameterError("options", "object", e2);
    }
    if (i.integer(e2.seconds) && i.inRange(e2.seconds, 0, 3600)) {
      this.options.timeoutSeconds = e2.seconds;
    } else {
      throw i.invalidParameterError("seconds", "integer between 0 and 3600", e2.seconds);
    }
    return this;
  }
  function _updateFormatOut(e2, t2) {
    if (!(i.object(t2) && t2.force === false)) {
      this.options.formatOut = e2;
    }
    return this;
  }
  function _setBooleanOption(e2, t2) {
    if (i.bool(t2)) {
      this.options[e2] = t2;
    } else {
      throw i.invalidParameterError(e2, "boolean", t2);
    }
  }
  function _read() {
    if (!this.options.streamOut) {
      this.options.streamOut = true;
      const e2 = Error();
      this._pipeline(void 0, e2);
    }
  }
  function _pipeline(e2, t2) {
    if (typeof e2 === "function") {
      if (this._isStreamInput()) {
        this.on("finish", (() => {
          this._flattenBufferIn();
          o.pipeline(this.options, ((r2, n2, o2) => {
            if (r2) {
              e2(i.nativeError(r2, t2));
            } else {
              e2(null, n2, o2);
            }
          }));
        }));
      } else {
        o.pipeline(this.options, ((r2, n2, o2) => {
          if (r2) {
            e2(i.nativeError(r2, t2));
          } else {
            e2(null, n2, o2);
          }
        }));
      }
      return this;
    } else if (this.options.streamOut) {
      if (this._isStreamInput()) {
        this.once("finish", (() => {
          this._flattenBufferIn();
          o.pipeline(this.options, ((e3, r2, n2) => {
            if (e3) {
              this.emit("error", i.nativeError(e3, t2));
            } else {
              this.emit("info", n2);
              this.push(r2);
            }
            this.push(null);
            this.on("end", (() => this.emit("close")));
          }));
        }));
        if (this.streamInFinished) {
          this.emit("finish");
        }
      } else {
        o.pipeline(this.options, ((e3, r2, n2) => {
          if (e3) {
            this.emit("error", i.nativeError(e3, t2));
          } else {
            this.emit("info", n2);
            this.push(r2);
          }
          this.push(null);
          this.on("end", (() => this.emit("close")));
        }));
      }
      return this;
    } else {
      if (this._isStreamInput()) {
        return new Promise(((e3, r2) => {
          this.once("finish", (() => {
            this._flattenBufferIn();
            o.pipeline(this.options, ((n2, o2, s2) => {
              if (n2) {
                r2(i.nativeError(n2, t2));
              } else {
                if (this.options.resolveWithObject) {
                  e3({ data: o2, info: s2 });
                } else {
                  e3(o2);
                }
              }
            }));
          }));
        }));
      } else {
        return new Promise(((e3, r2) => {
          o.pipeline(this.options, ((n2, o2, s2) => {
            if (n2) {
              r2(i.nativeError(n2, t2));
            } else {
              if (this.options.resolveWithObject) {
                e3({ data: o2, info: s2 });
              } else {
                e3(o2);
              }
            }
          }));
        }));
      }
    }
  }
  e.exports = (e2) => {
    Object.assign(e2.prototype, { toFile, toBuffer, keepExif, withExif, withExifMerge, keepIccProfile, withIccProfile, keepXmp, withXmp, keepMetadata, withMetadata, toFormat, jpeg, jp2, png, webp, tiff, avif, heif, jxl, gif, raw, tile, timeout, _updateFormatOut, _setBooleanOption, _read, _pipeline });
  };
}, 1527: (e, t, r) => {
  const n = r(3031);
  const i = { center: 0, centre: 0, north: 1, east: 2, south: 3, west: 4, northeast: 5, southeast: 6, southwest: 7, northwest: 8 };
  const o = { top: 1, right: 2, bottom: 3, left: 4, "right top": 5, "right bottom": 6, "left bottom": 7, "left top": 8 };
  const s = { background: "background", copy: "copy", repeat: "repeat", mirror: "mirror" };
  const a = { entropy: 16, attention: 17 };
  const l = { nearest: "nearest", linear: "linear", cubic: "cubic", mitchell: "mitchell", lanczos2: "lanczos2", lanczos3: "lanczos3", mks2013: "mks2013", mks2021: "mks2021" };
  const c = { contain: "contain", cover: "cover", fill: "fill", inside: "inside", outside: "outside" };
  const h = { contain: "embed", cover: "crop", fill: "ignore_aspect", inside: "max", outside: "min" };
  function isRotationExpected(e2) {
    return e2.angle % 360 !== 0 || e2.rotationAngle !== 0;
  }
  function isResizeExpected(e2) {
    return e2.width !== -1 || e2.height !== -1;
  }
  function resize(e2, t2, r2) {
    if (isResizeExpected(this.options)) {
      this.options.debuglog("ignoring previous resize options");
    }
    if (this.options.widthPost !== -1) {
      this.options.debuglog("operation order will be: extract, resize, extract");
    }
    if (n.defined(e2)) {
      if (n.object(e2) && !n.defined(r2)) {
        r2 = e2;
      } else if (n.integer(e2) && e2 > 0) {
        this.options.width = e2;
      } else {
        throw n.invalidParameterError("width", "positive integer", e2);
      }
    } else {
      this.options.width = -1;
    }
    if (n.defined(t2)) {
      if (n.integer(t2) && t2 > 0) {
        this.options.height = t2;
      } else {
        throw n.invalidParameterError("height", "positive integer", t2);
      }
    } else {
      this.options.height = -1;
    }
    if (n.object(r2)) {
      if (n.defined(r2.width)) {
        if (n.integer(r2.width) && r2.width > 0) {
          this.options.width = r2.width;
        } else {
          throw n.invalidParameterError("width", "positive integer", r2.width);
        }
      }
      if (n.defined(r2.height)) {
        if (n.integer(r2.height) && r2.height > 0) {
          this.options.height = r2.height;
        } else {
          throw n.invalidParameterError("height", "positive integer", r2.height);
        }
      }
      if (n.defined(r2.fit)) {
        const e3 = h[r2.fit];
        if (n.string(e3)) {
          this.options.canvas = e3;
        } else {
          throw n.invalidParameterError("fit", "valid fit", r2.fit);
        }
      }
      if (n.defined(r2.position)) {
        const e3 = n.integer(r2.position) ? r2.position : a[r2.position] || o[r2.position] || i[r2.position];
        if (n.integer(e3) && (n.inRange(e3, 0, 8) || n.inRange(e3, 16, 17))) {
          this.options.position = e3;
        } else {
          throw n.invalidParameterError("position", "valid position/gravity/strategy", r2.position);
        }
      }
      this._setBackgroundColourOption("resizeBackground", r2.background);
      if (n.defined(r2.kernel)) {
        if (n.string(l[r2.kernel])) {
          this.options.kernel = l[r2.kernel];
        } else {
          throw n.invalidParameterError("kernel", "valid kernel name", r2.kernel);
        }
      }
      if (n.defined(r2.withoutEnlargement)) {
        this._setBooleanOption("withoutEnlargement", r2.withoutEnlargement);
      }
      if (n.defined(r2.withoutReduction)) {
        this._setBooleanOption("withoutReduction", r2.withoutReduction);
      }
      if (n.defined(r2.fastShrinkOnLoad)) {
        this._setBooleanOption("fastShrinkOnLoad", r2.fastShrinkOnLoad);
      }
    }
    if (isRotationExpected(this.options) && isResizeExpected(this.options)) {
      this.options.rotateBefore = true;
    }
    return this;
  }
  function extend(e2) {
    if (n.integer(e2) && e2 > 0) {
      this.options.extendTop = e2;
      this.options.extendBottom = e2;
      this.options.extendLeft = e2;
      this.options.extendRight = e2;
    } else if (n.object(e2)) {
      if (n.defined(e2.top)) {
        if (n.integer(e2.top) && e2.top >= 0) {
          this.options.extendTop = e2.top;
        } else {
          throw n.invalidParameterError("top", "positive integer", e2.top);
        }
      }
      if (n.defined(e2.bottom)) {
        if (n.integer(e2.bottom) && e2.bottom >= 0) {
          this.options.extendBottom = e2.bottom;
        } else {
          throw n.invalidParameterError("bottom", "positive integer", e2.bottom);
        }
      }
      if (n.defined(e2.left)) {
        if (n.integer(e2.left) && e2.left >= 0) {
          this.options.extendLeft = e2.left;
        } else {
          throw n.invalidParameterError("left", "positive integer", e2.left);
        }
      }
      if (n.defined(e2.right)) {
        if (n.integer(e2.right) && e2.right >= 0) {
          this.options.extendRight = e2.right;
        } else {
          throw n.invalidParameterError("right", "positive integer", e2.right);
        }
      }
      this._setBackgroundColourOption("extendBackground", e2.background);
      if (n.defined(e2.extendWith)) {
        if (n.string(s[e2.extendWith])) {
          this.options.extendWith = s[e2.extendWith];
        } else {
          throw n.invalidParameterError("extendWith", "one of: background, copy, repeat, mirror", e2.extendWith);
        }
      }
    } else {
      throw n.invalidParameterError("extend", "integer or object", e2);
    }
    return this;
  }
  function extract(e2) {
    const t2 = isResizeExpected(this.options) || this.options.widthPre !== -1 ? "Post" : "Pre";
    if (this.options[`width${t2}`] !== -1) {
      this.options.debuglog("ignoring previous extract options");
    }
    ["left", "top", "width", "height"].forEach((function(r2) {
      const i2 = e2[r2];
      if (n.integer(i2) && i2 >= 0) {
        this.options[r2 + (r2 === "left" || r2 === "top" ? "Offset" : "") + t2] = i2;
      } else {
        throw n.invalidParameterError(r2, "integer", i2);
      }
    }), this);
    if (isRotationExpected(this.options) && !isResizeExpected(this.options)) {
      if (this.options.widthPre === -1 || this.options.widthPost === -1) {
        this.options.rotateBefore = true;
      }
    }
    if (this.options.input.autoOrient) {
      this.options.orientBefore = true;
    }
    return this;
  }
  function trim(e2) {
    this.options.trimThreshold = 10;
    if (n.defined(e2)) {
      if (n.object(e2)) {
        if (n.defined(e2.background)) {
          this._setBackgroundColourOption("trimBackground", e2.background);
        }
        if (n.defined(e2.threshold)) {
          if (n.number(e2.threshold) && e2.threshold >= 0) {
            this.options.trimThreshold = e2.threshold;
          } else {
            throw n.invalidParameterError("threshold", "positive number", e2.threshold);
          }
        }
        if (n.defined(e2.lineArt)) {
          this._setBooleanOption("trimLineArt", e2.lineArt);
        }
      } else {
        throw n.invalidParameterError("trim", "object", e2);
      }
    }
    if (isRotationExpected(this.options)) {
      this.options.rotateBefore = true;
    }
    return this;
  }
  e.exports = (e2) => {
    Object.assign(e2.prototype, { resize, extend, extract, trim });
    e2.gravity = i;
    e2.strategy = a;
    e2.kernel = l;
    e2.fit = c;
    e2.position = o;
  };
}, 1395: (e, t, r) => {
  const { familySync: n, versionSync: i } = r(8772);
  const { runtimePlatformArch: o, isUnsupportedNodeRuntime: s, prebuiltPlatforms: a, minimumLibvipsVersion: l } = r(1808);
  const c = o();
  const h = [`../src/build/Release/sharp-${c}.node`, "../src/build/Release/sharp-wasm32.node", `@img/sharp-${c}/sharp.node`, "@img/sharp-wasm32/sharp.node"];
  let u, p;
  const d = [];
  for (u of h) {
    try {
      p = (0, module__WEBPACK_IMPORTED_MODULE_0__.createRequire)(import.meta.url)(u);
      break;
    } catch (e2) {
      d.push(e2);
    }
  }
  if (p && u.startsWith("@img/sharp-linux-x64") && !p._isUsingX64V2()) {
    const e2 = new Error("Prebuilt binaries for linux-x64 require v2 microarchitecture");
    e2.code = "Unsupported CPU";
    d.push(e2);
    p = null;
  }
  if (p) {
    e.exports = p;
  } else {
    const [t2, r2, o2] = ["linux", "darwin", "win32"].map(((e2) => c.startsWith(e2)));
    const h2 = [`Could not load the "sharp" module using the ${c} runtime`];
    d.forEach(((e2) => {
      if (e2.code !== "MODULE_NOT_FOUND") {
        h2.push(`${e2.code}: ${e2.message}`);
      }
    }));
    const u2 = d.map(((e2) => e2.message)).join(" ");
    h2.push("Possible solutions:");
    if (s()) {
      const { found: e2, expected: t3 } = s();
      h2.push("- Please upgrade Node.js:", `    Found ${e2}`, `    Requires ${t3}`);
    } else if (a.includes(c)) {
      const [e2, t3] = c.split("-");
      const r3 = e2.endsWith("musl") ? " --libc=musl" : "";
      h2.push("- Ensure optional dependencies can be installed:", "    npm install --include=optional sharp", "- Ensure your package manager supports multi-platform installation:", "    See https://sharp.pixelplumbing.com/install#cross-platform", "- Add platform-specific dependencies:", `    npm install --os=${e2.replace("musl", "")}${r3} --cpu=${t3} sharp`);
    } else {
      h2.push(`- Manually install libvips >= ${l}`, "- Add experimental WebAssembly-based dependencies:", "    npm install --cpu=wasm32 sharp", "    npm install @img/sharp-wasm32");
    }
    if (t2 && /(symbol not found|CXXABI_)/i.test(u2)) {
      try {
        const { config: e2 } = (0, module__WEBPACK_IMPORTED_MODULE_0__.createRequire)(import.meta.url)(`@img/sharp-libvips-${c}/package`);
        const t3 = `${n()} ${i()}`;
        const r3 = `${e2.musl ? "musl" : "glibc"} ${e2.musl || e2.glibc}`;
        h2.push("- Update your OS:", `    Found ${t3}`, `    Requires ${r3}`);
      } catch (e2) {
      }
    }
    if (t2 && /\/snap\/core[0-9]{2}/.test(u2)) {
      h2.push("- Remove the Node.js Snap, which does not support native modules", "    snap remove node");
    }
    if (r2 && /Incompatible library version/.test(u2)) {
      h2.push("- Update Homebrew:", "    brew update && brew upgrade vips");
    }
    if (d.some(((e2) => e2.code === "ERR_DLOPEN_DISABLED"))) {
      h2.push("- Run Node.js without using the --no-addons flag");
    }
    if (o2 && /The specified procedure could not be found/.test(u2)) {
      h2.push("- Using the canvas package on Windows?", "    See https://sharp.pixelplumbing.com/install#canvas-and-windows", "- Check for outdated versions of sharp in the dependency tree:", "    npm ls sharp");
    }
    h2.push("- Consult the installation documentation:", "    See https://sharp.pixelplumbing.com/install");
    throw new Error(h2.join("\n"));
  }
}, 735: (e, t, r) => {
  const n = r(8474);
  const i = r(8772);
  const o = r(3031);
  const { runtimePlatformArch: s } = r(1808);
  const a = r(1395);
  const l = s();
  const c = a.libvipsVersion();
  const h = a.format();
  h.heif.output.alias = ["avif", "heic"];
  h.jpeg.output.alias = ["jpe", "jpg"];
  h.tiff.output.alias = ["tif"];
  h.jp2k.output.alias = ["j2c", "j2k", "jp2", "jpx"];
  const u = { nearest: "nearest", bilinear: "bilinear", bicubic: "bicubic", locallyBoundedBicubic: "lbb", nohalo: "nohalo", vertexSplitQuadraticBasisSpline: "vsqbs" };
  let p = { vips: c.semver };
  if (!c.isGlobal) {
    if (!c.isWasm) {
      try {
        p = (0, module__WEBPACK_IMPORTED_MODULE_0__.createRequire)(import.meta.url)(`@img/sharp-${l}/versions`);
      } catch (e2) {
        try {
          p = (0, module__WEBPACK_IMPORTED_MODULE_0__.createRequire)(import.meta.url)(`@img/sharp-libvips-${l}/versions`);
        } catch (e3) {
        }
      }
    } else {
      try {
        p = r(6279);
      } catch (e2) {
      }
    }
  }
  p.sharp = r(7816).version;
  if (p.heif && h.heif) {
    h.heif.input.fileSuffix = [".avif"];
    h.heif.output.alias = ["avif"];
  }
  function cache(e2) {
    if (o.bool(e2)) {
      if (e2) {
        return a.cache(50, 20, 100);
      } else {
        return a.cache(0, 0, 0);
      }
    } else if (o.object(e2)) {
      return a.cache(e2.memory, e2.files, e2.items);
    } else {
      return a.cache();
    }
  }
  cache(true);
  function concurrency(e2) {
    return a.concurrency(o.integer(e2) ? e2 : null);
  }
  if (i.familySync() === i.GLIBC && !a._isUsingJemalloc()) {
    a.concurrency(1);
  } else if (i.familySync() === i.MUSL && a.concurrency() === 1024) {
    a.concurrency(r(8161).availableParallelism());
  }
  const d = new n.EventEmitter();
  function counters() {
    return a.counters();
  }
  function simd(e2) {
    return a.simd(o.bool(e2) ? e2 : null);
  }
  function block(e2) {
    if (o.object(e2)) {
      if (Array.isArray(e2.operation) && e2.operation.every(o.string)) {
        a.block(e2.operation, true);
      } else {
        throw o.invalidParameterError("operation", "Array<string>", e2.operation);
      }
    } else {
      throw o.invalidParameterError("options", "object", e2);
    }
  }
  function unblock(e2) {
    if (o.object(e2)) {
      if (Array.isArray(e2.operation) && e2.operation.every(o.string)) {
        a.block(e2.operation, false);
      } else {
        throw o.invalidParameterError("operation", "Array<string>", e2.operation);
      }
    } else {
      throw o.invalidParameterError("options", "object", e2);
    }
  }
  e.exports = (e2) => {
    e2.cache = cache;
    e2.concurrency = concurrency;
    e2.counters = counters;
    e2.simd = simd;
    e2.format = h;
    e2.interpolators = u;
    e2.versions = p;
    e2.queue = d;
    e2.block = block;
    e2.unblock = unblock;
  };
}, 5446: (e) => {
  var t = Object.defineProperty;
  var r = Object.getOwnPropertyDescriptor;
  var n = Object.getOwnPropertyNames;
  var i = Object.prototype.hasOwnProperty;
  var __export = (e2, r2) => {
    for (var n2 in r2) t(e2, n2, { get: r2[n2], enumerable: true });
  };
  var __copyProps = (e2, o2, s2, a2) => {
    if (o2 && typeof o2 === "object" || typeof o2 === "function") {
      for (let l2 of n(o2)) if (!i.call(e2, l2) && l2 !== s2) t(e2, l2, { get: () => o2[l2], enumerable: !(a2 = r(o2, l2)) || a2.enumerable });
    }
    return e2;
  };
  var __toCommonJS = (e2) => __copyProps(t({}, "__esModule", { value: true }), e2);
  var o = {};
  __export(o, { default: () => x });
  e.exports = __toCommonJS(o);
  var s = { aliceblue: [240, 248, 255], antiquewhite: [250, 235, 215], aqua: [0, 255, 255], aquamarine: [127, 255, 212], azure: [240, 255, 255], beige: [245, 245, 220], bisque: [255, 228, 196], black: [0, 0, 0], blanchedalmond: [255, 235, 205], blue: [0, 0, 255], blueviolet: [138, 43, 226], brown: [165, 42, 42], burlywood: [222, 184, 135], cadetblue: [95, 158, 160], chartreuse: [127, 255, 0], chocolate: [210, 105, 30], coral: [255, 127, 80], cornflowerblue: [100, 149, 237], cornsilk: [255, 248, 220], crimson: [220, 20, 60], cyan: [0, 255, 255], darkblue: [0, 0, 139], darkcyan: [0, 139, 139], darkgoldenrod: [184, 134, 11], darkgray: [169, 169, 169], darkgreen: [0, 100, 0], darkgrey: [169, 169, 169], darkkhaki: [189, 183, 107], darkmagenta: [139, 0, 139], darkolivegreen: [85, 107, 47], darkorange: [255, 140, 0], darkorchid: [153, 50, 204], darkred: [139, 0, 0], darksalmon: [233, 150, 122], darkseagreen: [143, 188, 143], darkslateblue: [72, 61, 139], darkslategray: [47, 79, 79], darkslategrey: [47, 79, 79], darkturquoise: [0, 206, 209], darkviolet: [148, 0, 211], deeppink: [255, 20, 147], deepskyblue: [0, 191, 255], dimgray: [105, 105, 105], dimgrey: [105, 105, 105], dodgerblue: [30, 144, 255], firebrick: [178, 34, 34], floralwhite: [255, 250, 240], forestgreen: [34, 139, 34], fuchsia: [255, 0, 255], gainsboro: [220, 220, 220], ghostwhite: [248, 248, 255], gold: [255, 215, 0], goldenrod: [218, 165, 32], gray: [128, 128, 128], green: [0, 128, 0], greenyellow: [173, 255, 47], grey: [128, 128, 128], honeydew: [240, 255, 240], hotpink: [255, 105, 180], indianred: [205, 92, 92], indigo: [75, 0, 130], ivory: [255, 255, 240], khaki: [240, 230, 140], lavender: [230, 230, 250], lavenderblush: [255, 240, 245], lawngreen: [124, 252, 0], lemonchiffon: [255, 250, 205], lightblue: [173, 216, 230], lightcoral: [240, 128, 128], lightcyan: [224, 255, 255], lightgoldenrodyellow: [250, 250, 210], lightgray: [211, 211, 211], lightgreen: [144, 238, 144], lightgrey: [211, 211, 211], lightpink: [255, 182, 193], lightsalmon: [255, 160, 122], lightseagreen: [32, 178, 170], lightskyblue: [135, 206, 250], lightslategray: [119, 136, 153], lightslategrey: [119, 136, 153], lightsteelblue: [176, 196, 222], lightyellow: [255, 255, 224], lime: [0, 255, 0], limegreen: [50, 205, 50], linen: [250, 240, 230], magenta: [255, 0, 255], maroon: [128, 0, 0], mediumaquamarine: [102, 205, 170], mediumblue: [0, 0, 205], mediumorchid: [186, 85, 211], mediumpurple: [147, 112, 219], mediumseagreen: [60, 179, 113], mediumslateblue: [123, 104, 238], mediumspringgreen: [0, 250, 154], mediumturquoise: [72, 209, 204], mediumvioletred: [199, 21, 133], midnightblue: [25, 25, 112], mintcream: [245, 255, 250], mistyrose: [255, 228, 225], moccasin: [255, 228, 181], navajowhite: [255, 222, 173], navy: [0, 0, 128], oldlace: [253, 245, 230], olive: [128, 128, 0], olivedrab: [107, 142, 35], orange: [255, 165, 0], orangered: [255, 69, 0], orchid: [218, 112, 214], palegoldenrod: [238, 232, 170], palegreen: [152, 251, 152], paleturquoise: [175, 238, 238], palevioletred: [219, 112, 147], papayawhip: [255, 239, 213], peachpuff: [255, 218, 185], peru: [205, 133, 63], pink: [255, 192, 203], plum: [221, 160, 221], powderblue: [176, 224, 230], purple: [128, 0, 128], rebeccapurple: [102, 51, 153], red: [255, 0, 0], rosybrown: [188, 143, 143], royalblue: [65, 105, 225], saddlebrown: [139, 69, 19], salmon: [250, 128, 114], sandybrown: [244, 164, 96], seagreen: [46, 139, 87], seashell: [255, 245, 238], sienna: [160, 82, 45], silver: [192, 192, 192], skyblue: [135, 206, 235], slateblue: [106, 90, 205], slategray: [112, 128, 144], slategrey: [112, 128, 144], snow: [255, 250, 250], springgreen: [0, 255, 127], steelblue: [70, 130, 180], tan: [210, 180, 140], teal: [0, 128, 128], thistle: [216, 191, 216], tomato: [255, 99, 71], turquoise: [64, 224, 208], violet: [238, 130, 238], wheat: [245, 222, 179], white: [255, 255, 255], whitesmoke: [245, 245, 245], yellow: [255, 255, 0], yellowgreen: [154, 205, 50] };
  var a = /* @__PURE__ */ Object.create(null);
  for (const e2 in s) {
    if (Object.hasOwn(s, e2)) {
      a[s[e2]] = e2;
    }
  }
  var l = { to: {}, get: {} };
  l.get = function(e2) {
    const t2 = e2.slice(0, 3).toLowerCase();
    let r2;
    let n2;
    switch (t2) {
      case "hsl": {
        r2 = l.get.hsl(e2);
        n2 = "hsl";
        break;
      }
      case "hwb": {
        r2 = l.get.hwb(e2);
        n2 = "hwb";
        break;
      }
      default: {
        r2 = l.get.rgb(e2);
        n2 = "rgb";
        break;
      }
    }
    if (!r2) {
      return null;
    }
    return { model: n2, value: r2 };
  };
  l.get.rgb = function(e2) {
    if (!e2) {
      return null;
    }
    const t2 = /^#([a-f\d]{3,4})$/i;
    const r2 = /^#([a-f\d]{6})([a-f\d]{2})?$/i;
    const n2 = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[\s,|/]\s*([+-]?[\d.]+)(%?)\s*)?\)$/;
    const i2 = /^rgba?\(\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[\s,|/]\s*([+-]?[\d.]+)(%?)\s*)?\)$/;
    const o2 = /^(\w+)$/;
    let a2 = [0, 0, 0, 1];
    let l2;
    let c2;
    let h2;
    if (l2 = e2.match(r2)) {
      h2 = l2[2];
      l2 = l2[1];
      for (c2 = 0; c2 < 3; c2++) {
        const e3 = c2 * 2;
        a2[c2] = Number.parseInt(l2.slice(e3, e3 + 2), 16);
      }
      if (h2) {
        a2[3] = Number.parseInt(h2, 16) / 255;
      }
    } else if (l2 = e2.match(t2)) {
      l2 = l2[1];
      h2 = l2[3];
      for (c2 = 0; c2 < 3; c2++) {
        a2[c2] = Number.parseInt(l2[c2] + l2[c2], 16);
      }
      if (h2) {
        a2[3] = Number.parseInt(h2 + h2, 16) / 255;
      }
    } else if (l2 = e2.match(n2)) {
      for (c2 = 0; c2 < 3; c2++) {
        a2[c2] = Number.parseInt(l2[c2 + 1], 10);
      }
      if (l2[4]) {
        a2[3] = l2[5] ? Number.parseFloat(l2[4]) * 0.01 : Number.parseFloat(l2[4]);
      }
    } else if (l2 = e2.match(i2)) {
      for (c2 = 0; c2 < 3; c2++) {
        a2[c2] = Math.round(Number.parseFloat(l2[c2 + 1]) * 2.55);
      }
      if (l2[4]) {
        a2[3] = l2[5] ? Number.parseFloat(l2[4]) * 0.01 : Number.parseFloat(l2[4]);
      }
    } else if (l2 = e2.match(o2)) {
      if (l2[1] === "transparent") {
        return [0, 0, 0, 0];
      }
      if (!Object.hasOwn(s, l2[1])) {
        return null;
      }
      a2 = s[l2[1]];
      a2[3] = 1;
      return a2;
    } else {
      return null;
    }
    for (c2 = 0; c2 < 3; c2++) {
      a2[c2] = clamp2(a2[c2], 0, 255);
    }
    a2[3] = clamp2(a2[3], 0, 1);
    return a2;
  };
  l.get.hsl = function(e2) {
    if (!e2) {
      return null;
    }
    const t2 = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[,|/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
    const r2 = e2.match(t2);
    if (r2) {
      const e3 = Number.parseFloat(r2[4]);
      const t3 = (Number.parseFloat(r2[1]) % 360 + 360) % 360;
      const n2 = clamp2(Number.parseFloat(r2[2]), 0, 100);
      const i2 = clamp2(Number.parseFloat(r2[3]), 0, 100);
      const o2 = clamp2(Number.isNaN(e3) ? 1 : e3, 0, 1);
      return [t3, n2, i2, o2];
    }
    return null;
  };
  l.get.hwb = function(e2) {
    if (!e2) {
      return null;
    }
    const t2 = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*[\s,]\s*([+-]?[\d.]+)%\s*[\s,]\s*([+-]?[\d.]+)%\s*(?:[\s,]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
    const r2 = e2.match(t2);
    if (r2) {
      const e3 = Number.parseFloat(r2[4]);
      const t3 = (Number.parseFloat(r2[1]) % 360 + 360) % 360;
      const n2 = clamp2(Number.parseFloat(r2[2]), 0, 100);
      const i2 = clamp2(Number.parseFloat(r2[3]), 0, 100);
      const o2 = clamp2(Number.isNaN(e3) ? 1 : e3, 0, 1);
      return [t3, n2, i2, o2];
    }
    return null;
  };
  l.to.hex = function(...e2) {
    return "#" + hexDouble(e2[0]) + hexDouble(e2[1]) + hexDouble(e2[2]) + (e2[3] < 1 ? hexDouble(Math.round(e2[3] * 255)) : "");
  };
  l.to.rgb = function(...e2) {
    return e2.length < 4 || e2[3] === 1 ? "rgb(" + Math.round(e2[0]) + ", " + Math.round(e2[1]) + ", " + Math.round(e2[2]) + ")" : "rgba(" + Math.round(e2[0]) + ", " + Math.round(e2[1]) + ", " + Math.round(e2[2]) + ", " + e2[3] + ")";
  };
  l.to.rgb.percent = function(...e2) {
    const t2 = Math.round(e2[0] / 255 * 100);
    const r2 = Math.round(e2[1] / 255 * 100);
    const n2 = Math.round(e2[2] / 255 * 100);
    return e2.length < 4 || e2[3] === 1 ? "rgb(" + t2 + "%, " + r2 + "%, " + n2 + "%)" : "rgba(" + t2 + "%, " + r2 + "%, " + n2 + "%, " + e2[3] + ")";
  };
  l.to.hsl = function(...e2) {
    return e2.length < 4 || e2[3] === 1 ? "hsl(" + e2[0] + ", " + e2[1] + "%, " + e2[2] + "%)" : "hsla(" + e2[0] + ", " + e2[1] + "%, " + e2[2] + "%, " + e2[3] + ")";
  };
  l.to.hwb = function(...e2) {
    let t2 = "";
    if (e2.length >= 4 && e2[3] !== 1) {
      t2 = ", " + e2[3];
    }
    return "hwb(" + e2[0] + ", " + e2[1] + "%, " + e2[2] + "%" + t2 + ")";
  };
  l.to.keyword = function(...e2) {
    return a[e2.slice(0, 3)];
  };
  function clamp2(e2, t2, r2) {
    return Math.min(Math.max(t2, e2), r2);
  }
  function hexDouble(e2) {
    const t2 = Math.round(e2).toString(16).toUpperCase();
    return t2.length < 2 ? "0" + t2 : t2;
  }
  var c = l;
  var h = {};
  for (const e2 of Object.keys(s)) {
    h[s[e2]] = e2;
  }
  var u = { rgb: { channels: 3, labels: "rgb" }, hsl: { channels: 3, labels: "hsl" }, hsv: { channels: 3, labels: "hsv" }, hwb: { channels: 3, labels: "hwb" }, cmyk: { channels: 4, labels: "cmyk" }, xyz: { channels: 3, labels: "xyz" }, lab: { channels: 3, labels: "lab" }, oklab: { channels: 3, labels: ["okl", "oka", "okb"] }, lch: { channels: 3, labels: "lch" }, oklch: { channels: 3, labels: ["okl", "okc", "okh"] }, hex: { channels: 1, labels: ["hex"] }, keyword: { channels: 1, labels: ["keyword"] }, ansi16: { channels: 1, labels: ["ansi16"] }, ansi256: { channels: 1, labels: ["ansi256"] }, hcg: { channels: 3, labels: ["h", "c", "g"] }, apple: { channels: 3, labels: ["r16", "g16", "b16"] }, gray: { channels: 1, labels: ["gray"] } };
  var p = u;
  var d = (6 / 29) ** 3;
  function srgbNonlinearTransform(e2) {
    const t2 = e2 > 31308e-7 ? 1.055 * e2 ** (1 / 2.4) - 0.055 : e2 * 12.92;
    return Math.min(Math.max(0, t2), 1);
  }
  function srgbNonlinearTransformInv(e2) {
    return e2 > 0.04045 ? ((e2 + 0.055) / 1.055) ** 2.4 : e2 / 12.92;
  }
  for (const e2 of Object.keys(u)) {
    if (!("channels" in u[e2])) {
      throw new Error("missing channels property: " + e2);
    }
    if (!("labels" in u[e2])) {
      throw new Error("missing channel labels property: " + e2);
    }
    if (u[e2].labels.length !== u[e2].channels) {
      throw new Error("channel and label counts mismatch: " + e2);
    }
    const { channels: t2, labels: r2 } = u[e2];
    delete u[e2].channels;
    delete u[e2].labels;
    Object.defineProperty(u[e2], "channels", { value: t2 });
    Object.defineProperty(u[e2], "labels", { value: r2 });
  }
  u.rgb.hsl = function(e2) {
    const t2 = e2[0] / 255;
    const r2 = e2[1] / 255;
    const n2 = e2[2] / 255;
    const i2 = Math.min(t2, r2, n2);
    const o2 = Math.max(t2, r2, n2);
    const s2 = o2 - i2;
    let a2;
    let l2;
    switch (o2) {
      case i2: {
        a2 = 0;
        break;
      }
      case t2: {
        a2 = (r2 - n2) / s2;
        break;
      }
      case r2: {
        a2 = 2 + (n2 - t2) / s2;
        break;
      }
      case n2: {
        a2 = 4 + (t2 - r2) / s2;
        break;
      }
    }
    a2 = Math.min(a2 * 60, 360);
    if (a2 < 0) {
      a2 += 360;
    }
    const c2 = (i2 + o2) / 2;
    if (o2 === i2) {
      l2 = 0;
    } else if (c2 <= 0.5) {
      l2 = s2 / (o2 + i2);
    } else {
      l2 = s2 / (2 - o2 - i2);
    }
    return [a2, l2 * 100, c2 * 100];
  };
  u.rgb.hsv = function(e2) {
    let t2;
    let r2;
    let n2;
    let i2;
    let o2;
    const s2 = e2[0] / 255;
    const a2 = e2[1] / 255;
    const l2 = e2[2] / 255;
    const c2 = Math.max(s2, a2, l2);
    const h2 = c2 - Math.min(s2, a2, l2);
    const diffc = function(e3) {
      return (c2 - e3) / 6 / h2 + 1 / 2;
    };
    if (h2 === 0) {
      i2 = 0;
      o2 = 0;
    } else {
      o2 = h2 / c2;
      t2 = diffc(s2);
      r2 = diffc(a2);
      n2 = diffc(l2);
      switch (c2) {
        case s2: {
          i2 = n2 - r2;
          break;
        }
        case a2: {
          i2 = 1 / 3 + t2 - n2;
          break;
        }
        case l2: {
          i2 = 2 / 3 + r2 - t2;
          break;
        }
      }
      if (i2 < 0) {
        i2 += 1;
      } else if (i2 > 1) {
        i2 -= 1;
      }
    }
    return [i2 * 360, o2 * 100, c2 * 100];
  };
  u.rgb.hwb = function(e2) {
    const t2 = e2[0];
    const r2 = e2[1];
    let n2 = e2[2];
    const i2 = u.rgb.hsl(e2)[0];
    const o2 = 1 / 255 * Math.min(t2, Math.min(r2, n2));
    n2 = 1 - 1 / 255 * Math.max(t2, Math.max(r2, n2));
    return [i2, o2 * 100, n2 * 100];
  };
  u.rgb.oklab = function(e2) {
    const t2 = srgbNonlinearTransformInv(e2[0] / 255);
    const r2 = srgbNonlinearTransformInv(e2[1] / 255);
    const n2 = srgbNonlinearTransformInv(e2[2] / 255);
    const i2 = Math.cbrt(0.4122214708 * t2 + 0.5363325363 * r2 + 0.0514459929 * n2);
    const o2 = Math.cbrt(0.2119034982 * t2 + 0.6806995451 * r2 + 0.1073969566 * n2);
    const s2 = Math.cbrt(0.0883024619 * t2 + 0.2817188376 * r2 + 0.6299787005 * n2);
    const a2 = 0.2104542553 * i2 + 0.793617785 * o2 - 0.0040720468 * s2;
    const l2 = 1.9779984951 * i2 - 2.428592205 * o2 + 0.4505937099 * s2;
    const c2 = 0.0259040371 * i2 + 0.7827717662 * o2 - 0.808675766 * s2;
    return [a2 * 100, l2 * 100, c2 * 100];
  };
  u.rgb.cmyk = function(e2) {
    const t2 = e2[0] / 255;
    const r2 = e2[1] / 255;
    const n2 = e2[2] / 255;
    const i2 = Math.min(1 - t2, 1 - r2, 1 - n2);
    const o2 = (1 - t2 - i2) / (1 - i2) || 0;
    const s2 = (1 - r2 - i2) / (1 - i2) || 0;
    const a2 = (1 - n2 - i2) / (1 - i2) || 0;
    return [o2 * 100, s2 * 100, a2 * 100, i2 * 100];
  };
  function comparativeDistance(e2, t2) {
    return (e2[0] - t2[0]) ** 2 + (e2[1] - t2[1]) ** 2 + (e2[2] - t2[2]) ** 2;
  }
  u.rgb.keyword = function(e2) {
    const t2 = h[e2];
    if (t2) {
      return t2;
    }
    let r2 = Number.POSITIVE_INFINITY;
    let n2;
    for (const t3 of Object.keys(s)) {
      const i2 = s[t3];
      const o2 = comparativeDistance(e2, i2);
      if (o2 < r2) {
        r2 = o2;
        n2 = t3;
      }
    }
    return n2;
  };
  u.keyword.rgb = function(e2) {
    return s[e2];
  };
  u.rgb.xyz = function(e2) {
    const t2 = srgbNonlinearTransformInv(e2[0] / 255);
    const r2 = srgbNonlinearTransformInv(e2[1] / 255);
    const n2 = srgbNonlinearTransformInv(e2[2] / 255);
    const i2 = t2 * 0.4124564 + r2 * 0.3575761 + n2 * 0.1804375;
    const o2 = t2 * 0.2126729 + r2 * 0.7151522 + n2 * 0.072175;
    const s2 = t2 * 0.0193339 + r2 * 0.119192 + n2 * 0.9503041;
    return [i2 * 100, o2 * 100, s2 * 100];
  };
  u.rgb.lab = function(e2) {
    const t2 = u.rgb.xyz(e2);
    let r2 = t2[0];
    let n2 = t2[1];
    let i2 = t2[2];
    r2 /= 95.047;
    n2 /= 100;
    i2 /= 108.883;
    r2 = r2 > d ? r2 ** (1 / 3) : 7.787 * r2 + 16 / 116;
    n2 = n2 > d ? n2 ** (1 / 3) : 7.787 * n2 + 16 / 116;
    i2 = i2 > d ? i2 ** (1 / 3) : 7.787 * i2 + 16 / 116;
    const o2 = 116 * n2 - 16;
    const s2 = 500 * (r2 - n2);
    const a2 = 200 * (n2 - i2);
    return [o2, s2, a2];
  };
  u.hsl.rgb = function(e2) {
    const t2 = e2[0] / 360;
    const r2 = e2[1] / 100;
    const n2 = e2[2] / 100;
    let i2;
    let o2;
    if (r2 === 0) {
      o2 = n2 * 255;
      return [o2, o2, o2];
    }
    const s2 = n2 < 0.5 ? n2 * (1 + r2) : n2 + r2 - n2 * r2;
    const a2 = 2 * n2 - s2;
    const l2 = [0, 0, 0];
    for (let e3 = 0; e3 < 3; e3++) {
      i2 = t2 + 1 / 3 * -(e3 - 1);
      if (i2 < 0) {
        i2++;
      }
      if (i2 > 1) {
        i2--;
      }
      if (6 * i2 < 1) {
        o2 = a2 + (s2 - a2) * 6 * i2;
      } else if (2 * i2 < 1) {
        o2 = s2;
      } else if (3 * i2 < 2) {
        o2 = a2 + (s2 - a2) * (2 / 3 - i2) * 6;
      } else {
        o2 = a2;
      }
      l2[e3] = o2 * 255;
    }
    return l2;
  };
  u.hsl.hsv = function(e2) {
    const t2 = e2[0];
    let r2 = e2[1] / 100;
    let n2 = e2[2] / 100;
    let i2 = r2;
    const o2 = Math.max(n2, 0.01);
    n2 *= 2;
    r2 *= n2 <= 1 ? n2 : 2 - n2;
    i2 *= o2 <= 1 ? o2 : 2 - o2;
    const s2 = (n2 + r2) / 2;
    const a2 = n2 === 0 ? 2 * i2 / (o2 + i2) : 2 * r2 / (n2 + r2);
    return [t2, a2 * 100, s2 * 100];
  };
  u.hsv.rgb = function(e2) {
    const t2 = e2[0] / 60;
    const r2 = e2[1] / 100;
    let n2 = e2[2] / 100;
    const i2 = Math.floor(t2) % 6;
    const o2 = t2 - Math.floor(t2);
    const s2 = 255 * n2 * (1 - r2);
    const a2 = 255 * n2 * (1 - r2 * o2);
    const l2 = 255 * n2 * (1 - r2 * (1 - o2));
    n2 *= 255;
    switch (i2) {
      case 0: {
        return [n2, l2, s2];
      }
      case 1: {
        return [a2, n2, s2];
      }
      case 2: {
        return [s2, n2, l2];
      }
      case 3: {
        return [s2, a2, n2];
      }
      case 4: {
        return [l2, s2, n2];
      }
      case 5: {
        return [n2, s2, a2];
      }
    }
  };
  u.hsv.hsl = function(e2) {
    const t2 = e2[0];
    const r2 = e2[1] / 100;
    const n2 = e2[2] / 100;
    const i2 = Math.max(n2, 0.01);
    let o2;
    let s2;
    s2 = (2 - r2) * n2;
    const a2 = (2 - r2) * i2;
    o2 = r2 * i2;
    o2 /= a2 <= 1 ? a2 : 2 - a2;
    o2 = o2 || 0;
    s2 /= 2;
    return [t2, o2 * 100, s2 * 100];
  };
  u.hwb.rgb = function(e2) {
    const t2 = e2[0] / 360;
    let r2 = e2[1] / 100;
    let n2 = e2[2] / 100;
    const i2 = r2 + n2;
    let o2;
    if (i2 > 1) {
      r2 /= i2;
      n2 /= i2;
    }
    const s2 = Math.floor(6 * t2);
    const a2 = 1 - n2;
    o2 = 6 * t2 - s2;
    if ((s2 & 1) !== 0) {
      o2 = 1 - o2;
    }
    const l2 = r2 + o2 * (a2 - r2);
    let c2;
    let h2;
    let u2;
    switch (s2) {
      default:
      case 6:
      case 0: {
        c2 = a2;
        h2 = l2;
        u2 = r2;
        break;
      }
      case 1: {
        c2 = l2;
        h2 = a2;
        u2 = r2;
        break;
      }
      case 2: {
        c2 = r2;
        h2 = a2;
        u2 = l2;
        break;
      }
      case 3: {
        c2 = r2;
        h2 = l2;
        u2 = a2;
        break;
      }
      case 4: {
        c2 = l2;
        h2 = r2;
        u2 = a2;
        break;
      }
      case 5: {
        c2 = a2;
        h2 = r2;
        u2 = l2;
        break;
      }
    }
    return [c2 * 255, h2 * 255, u2 * 255];
  };
  u.cmyk.rgb = function(e2) {
    const t2 = e2[0] / 100;
    const r2 = e2[1] / 100;
    const n2 = e2[2] / 100;
    const i2 = e2[3] / 100;
    const o2 = 1 - Math.min(1, t2 * (1 - i2) + i2);
    const s2 = 1 - Math.min(1, r2 * (1 - i2) + i2);
    const a2 = 1 - Math.min(1, n2 * (1 - i2) + i2);
    return [o2 * 255, s2 * 255, a2 * 255];
  };
  u.xyz.rgb = function(e2) {
    const t2 = e2[0] / 100;
    const r2 = e2[1] / 100;
    const n2 = e2[2] / 100;
    let i2;
    let o2;
    let s2;
    i2 = t2 * 3.2404542 + r2 * -1.5371385 + n2 * -0.4985314;
    o2 = t2 * -0.969266 + r2 * 1.8760108 + n2 * 0.041556;
    s2 = t2 * 0.0556434 + r2 * -0.2040259 + n2 * 1.0572252;
    i2 = srgbNonlinearTransform(i2);
    o2 = srgbNonlinearTransform(o2);
    s2 = srgbNonlinearTransform(s2);
    return [i2 * 255, o2 * 255, s2 * 255];
  };
  u.xyz.lab = function(e2) {
    let t2 = e2[0];
    let r2 = e2[1];
    let n2 = e2[2];
    t2 /= 95.047;
    r2 /= 100;
    n2 /= 108.883;
    t2 = t2 > d ? t2 ** (1 / 3) : 7.787 * t2 + 16 / 116;
    r2 = r2 > d ? r2 ** (1 / 3) : 7.787 * r2 + 16 / 116;
    n2 = n2 > d ? n2 ** (1 / 3) : 7.787 * n2 + 16 / 116;
    const i2 = 116 * r2 - 16;
    const o2 = 500 * (t2 - r2);
    const s2 = 200 * (r2 - n2);
    return [i2, o2, s2];
  };
  u.xyz.oklab = function(e2) {
    const t2 = e2[0] / 100;
    const r2 = e2[1] / 100;
    const n2 = e2[2] / 100;
    const i2 = Math.cbrt(0.8189330101 * t2 + 0.3618667424 * r2 - 0.1288597137 * n2);
    const o2 = Math.cbrt(0.0329845436 * t2 + 0.9293118715 * r2 + 0.0361456387 * n2);
    const s2 = Math.cbrt(0.0482003018 * t2 + 0.2643662691 * r2 + 0.633851707 * n2);
    const a2 = 0.2104542553 * i2 + 0.793617785 * o2 - 0.0040720468 * s2;
    const l2 = 1.9779984951 * i2 - 2.428592205 * o2 + 0.4505937099 * s2;
    const c2 = 0.0259040371 * i2 + 0.7827717662 * o2 - 0.808675766 * s2;
    return [a2 * 100, l2 * 100, c2 * 100];
  };
  u.oklab.oklch = function(e2) {
    return u.lab.lch(e2);
  };
  u.oklab.xyz = function(e2) {
    const t2 = e2[0] / 100;
    const r2 = e2[1] / 100;
    const n2 = e2[2] / 100;
    const i2 = (0.999999998 * t2 + 0.396337792 * r2 + 0.215803758 * n2) ** 3;
    const o2 = (1.000000008 * t2 - 0.105561342 * r2 - 0.063854175 * n2) ** 3;
    const s2 = (1.000000055 * t2 - 0.089484182 * r2 - 1.291485538 * n2) ** 3;
    const a2 = 1.227013851 * i2 - 0.55779998 * o2 + 0.281256149 * s2;
    const l2 = -0.040580178 * i2 + 1.11225687 * o2 - 0.071676679 * s2;
    const c2 = -0.076381285 * i2 - 0.421481978 * o2 + 1.58616322 * s2;
    return [a2 * 100, l2 * 100, c2 * 100];
  };
  u.oklab.rgb = function(e2) {
    const t2 = e2[0] / 100;
    const r2 = e2[1] / 100;
    const n2 = e2[2] / 100;
    const i2 = (t2 + 0.3963377774 * r2 + 0.2158037573 * n2) ** 3;
    const o2 = (t2 - 0.1055613458 * r2 - 0.0638541728 * n2) ** 3;
    const s2 = (t2 - 0.0894841775 * r2 - 1.291485548 * n2) ** 3;
    const a2 = srgbNonlinearTransform(4.0767416621 * i2 - 3.3077115913 * o2 + 0.2309699292 * s2);
    const l2 = srgbNonlinearTransform(-1.2684380046 * i2 + 2.6097574011 * o2 - 0.3413193965 * s2);
    const c2 = srgbNonlinearTransform(-0.0041960863 * i2 - 0.7034186147 * o2 + 1.707614701 * s2);
    return [a2 * 255, l2 * 255, c2 * 255];
  };
  u.oklch.oklab = function(e2) {
    return u.lch.lab(e2);
  };
  u.lab.xyz = function(e2) {
    const t2 = e2[0];
    const r2 = e2[1];
    const n2 = e2[2];
    let i2;
    let o2;
    let s2;
    o2 = (t2 + 16) / 116;
    i2 = r2 / 500 + o2;
    s2 = o2 - n2 / 200;
    const a2 = o2 ** 3;
    const l2 = i2 ** 3;
    const c2 = s2 ** 3;
    o2 = a2 > d ? a2 : (o2 - 16 / 116) / 7.787;
    i2 = l2 > d ? l2 : (i2 - 16 / 116) / 7.787;
    s2 = c2 > d ? c2 : (s2 - 16 / 116) / 7.787;
    i2 *= 95.047;
    o2 *= 100;
    s2 *= 108.883;
    return [i2, o2, s2];
  };
  u.lab.lch = function(e2) {
    const t2 = e2[0];
    const r2 = e2[1];
    const n2 = e2[2];
    let i2;
    const o2 = Math.atan2(n2, r2);
    i2 = o2 * 360 / 2 / Math.PI;
    if (i2 < 0) {
      i2 += 360;
    }
    const s2 = Math.sqrt(r2 * r2 + n2 * n2);
    return [t2, s2, i2];
  };
  u.lch.lab = function(e2) {
    const t2 = e2[0];
    const r2 = e2[1];
    const n2 = e2[2];
    const i2 = n2 / 360 * 2 * Math.PI;
    const o2 = r2 * Math.cos(i2);
    const s2 = r2 * Math.sin(i2);
    return [t2, o2, s2];
  };
  u.rgb.ansi16 = function(e2, t2 = null) {
    const [r2, n2, i2] = e2;
    let o2 = t2 === null ? u.rgb.hsv(e2)[2] : t2;
    o2 = Math.round(o2 / 50);
    if (o2 === 0) {
      return 30;
    }
    let s2 = 30 + (Math.round(i2 / 255) << 2 | Math.round(n2 / 255) << 1 | Math.round(r2 / 255));
    if (o2 === 2) {
      s2 += 60;
    }
    return s2;
  };
  u.hsv.ansi16 = function(e2) {
    return u.rgb.ansi16(u.hsv.rgb(e2), e2[2]);
  };
  u.rgb.ansi256 = function(e2) {
    const t2 = e2[0];
    const r2 = e2[1];
    const n2 = e2[2];
    if (t2 >> 4 === r2 >> 4 && r2 >> 4 === n2 >> 4) {
      if (t2 < 8) {
        return 16;
      }
      if (t2 > 248) {
        return 231;
      }
      return Math.round((t2 - 8) / 247 * 24) + 232;
    }
    const i2 = 16 + 36 * Math.round(t2 / 255 * 5) + 6 * Math.round(r2 / 255 * 5) + Math.round(n2 / 255 * 5);
    return i2;
  };
  u.ansi16.rgb = function(e2) {
    e2 = e2[0];
    let t2 = e2 % 10;
    if (t2 === 0 || t2 === 7) {
      if (e2 > 50) {
        t2 += 3.5;
      }
      t2 = t2 / 10.5 * 255;
      return [t2, t2, t2];
    }
    const r2 = (Math.trunc(e2 > 50) + 1) * 0.5;
    const n2 = (t2 & 1) * r2 * 255;
    const i2 = (t2 >> 1 & 1) * r2 * 255;
    const o2 = (t2 >> 2 & 1) * r2 * 255;
    return [n2, i2, o2];
  };
  u.ansi256.rgb = function(e2) {
    e2 = e2[0];
    if (e2 >= 232) {
      const t3 = (e2 - 232) * 10 + 8;
      return [t3, t3, t3];
    }
    e2 -= 16;
    let t2;
    const r2 = Math.floor(e2 / 36) / 5 * 255;
    const n2 = Math.floor((t2 = e2 % 36) / 6) / 5 * 255;
    const i2 = t2 % 6 / 5 * 255;
    return [r2, n2, i2];
  };
  u.rgb.hex = function(e2) {
    const t2 = ((Math.round(e2[0]) & 255) << 16) + ((Math.round(e2[1]) & 255) << 8) + (Math.round(e2[2]) & 255);
    const r2 = t2.toString(16).toUpperCase();
    return "000000".slice(r2.length) + r2;
  };
  u.hex.rgb = function(e2) {
    const t2 = e2.toString(16).match(/[a-f\d]{6}|[a-f\d]{3}/i);
    if (!t2) {
      return [0, 0, 0];
    }
    let r2 = t2[0];
    if (t2[0].length === 3) {
      r2 = [...r2].map(((e3) => e3 + e3)).join("");
    }
    const n2 = Number.parseInt(r2, 16);
    const i2 = n2 >> 16 & 255;
    const o2 = n2 >> 8 & 255;
    const s2 = n2 & 255;
    return [i2, o2, s2];
  };
  u.rgb.hcg = function(e2) {
    const t2 = e2[0] / 255;
    const r2 = e2[1] / 255;
    const n2 = e2[2] / 255;
    const i2 = Math.max(Math.max(t2, r2), n2);
    const o2 = Math.min(Math.min(t2, r2), n2);
    const s2 = i2 - o2;
    let a2;
    const l2 = s2 < 1 ? o2 / (1 - s2) : 0;
    if (s2 <= 0) {
      a2 = 0;
    } else if (i2 === t2) {
      a2 = (r2 - n2) / s2 % 6;
    } else if (i2 === r2) {
      a2 = 2 + (n2 - t2) / s2;
    } else {
      a2 = 4 + (t2 - r2) / s2;
    }
    a2 /= 6;
    a2 %= 1;
    return [a2 * 360, s2 * 100, l2 * 100];
  };
  u.hsl.hcg = function(e2) {
    const t2 = e2[1] / 100;
    const r2 = e2[2] / 100;
    const n2 = r2 < 0.5 ? 2 * t2 * r2 : 2 * t2 * (1 - r2);
    let i2 = 0;
    if (n2 < 1) {
      i2 = (r2 - 0.5 * n2) / (1 - n2);
    }
    return [e2[0], n2 * 100, i2 * 100];
  };
  u.hsv.hcg = function(e2) {
    const t2 = e2[1] / 100;
    const r2 = e2[2] / 100;
    const n2 = t2 * r2;
    let i2 = 0;
    if (n2 < 1) {
      i2 = (r2 - n2) / (1 - n2);
    }
    return [e2[0], n2 * 100, i2 * 100];
  };
  u.hcg.rgb = function(e2) {
    const t2 = e2[0] / 360;
    const r2 = e2[1] / 100;
    const n2 = e2[2] / 100;
    if (r2 === 0) {
      return [n2 * 255, n2 * 255, n2 * 255];
    }
    const i2 = [0, 0, 0];
    const o2 = t2 % 1 * 6;
    const s2 = o2 % 1;
    const a2 = 1 - s2;
    let l2 = 0;
    switch (Math.floor(o2)) {
      case 0: {
        i2[0] = 1;
        i2[1] = s2;
        i2[2] = 0;
        break;
      }
      case 1: {
        i2[0] = a2;
        i2[1] = 1;
        i2[2] = 0;
        break;
      }
      case 2: {
        i2[0] = 0;
        i2[1] = 1;
        i2[2] = s2;
        break;
      }
      case 3: {
        i2[0] = 0;
        i2[1] = a2;
        i2[2] = 1;
        break;
      }
      case 4: {
        i2[0] = s2;
        i2[1] = 0;
        i2[2] = 1;
        break;
      }
      default: {
        i2[0] = 1;
        i2[1] = 0;
        i2[2] = a2;
      }
    }
    l2 = (1 - r2) * n2;
    return [(r2 * i2[0] + l2) * 255, (r2 * i2[1] + l2) * 255, (r2 * i2[2] + l2) * 255];
  };
  u.hcg.hsv = function(e2) {
    const t2 = e2[1] / 100;
    const r2 = e2[2] / 100;
    const n2 = t2 + r2 * (1 - t2);
    let i2 = 0;
    if (n2 > 0) {
      i2 = t2 / n2;
    }
    return [e2[0], i2 * 100, n2 * 100];
  };
  u.hcg.hsl = function(e2) {
    const t2 = e2[1] / 100;
    const r2 = e2[2] / 100;
    const n2 = r2 * (1 - t2) + 0.5 * t2;
    let i2 = 0;
    if (n2 > 0 && n2 < 0.5) {
      i2 = t2 / (2 * n2);
    } else if (n2 >= 0.5 && n2 < 1) {
      i2 = t2 / (2 * (1 - n2));
    }
    return [e2[0], i2 * 100, n2 * 100];
  };
  u.hcg.hwb = function(e2) {
    const t2 = e2[1] / 100;
    const r2 = e2[2] / 100;
    const n2 = t2 + r2 * (1 - t2);
    return [e2[0], (n2 - t2) * 100, (1 - n2) * 100];
  };
  u.hwb.hcg = function(e2) {
    const t2 = e2[1] / 100;
    const r2 = e2[2] / 100;
    const n2 = 1 - r2;
    const i2 = n2 - t2;
    let o2 = 0;
    if (i2 < 1) {
      o2 = (n2 - i2) / (1 - i2);
    }
    return [e2[0], i2 * 100, o2 * 100];
  };
  u.apple.rgb = function(e2) {
    return [e2[0] / 65535 * 255, e2[1] / 65535 * 255, e2[2] / 65535 * 255];
  };
  u.rgb.apple = function(e2) {
    return [e2[0] / 255 * 65535, e2[1] / 255 * 65535, e2[2] / 255 * 65535];
  };
  u.gray.rgb = function(e2) {
    return [e2[0] / 100 * 255, e2[0] / 100 * 255, e2[0] / 100 * 255];
  };
  u.gray.hsl = function(e2) {
    return [0, 0, e2[0]];
  };
  u.gray.hsv = u.gray.hsl;
  u.gray.hwb = function(e2) {
    return [0, 100, e2[0]];
  };
  u.gray.cmyk = function(e2) {
    return [0, 0, 0, e2[0]];
  };
  u.gray.lab = function(e2) {
    return [e2[0], 0, 0];
  };
  u.gray.hex = function(e2) {
    const t2 = Math.round(e2[0] / 100 * 255) & 255;
    const r2 = (t2 << 16) + (t2 << 8) + t2;
    const n2 = r2.toString(16).toUpperCase();
    return "000000".slice(n2.length) + n2;
  };
  u.rgb.gray = function(e2) {
    const t2 = (e2[0] + e2[1] + e2[2]) / 3;
    return [t2 / 255 * 100];
  };
  function buildGraph() {
    const e2 = {};
    const t2 = Object.keys(p);
    for (let { length: r2 } = t2, n2 = 0; n2 < r2; n2++) {
      e2[t2[n2]] = { distance: -1, parent: null };
    }
    return e2;
  }
  function deriveBFS(e2) {
    const t2 = buildGraph();
    const r2 = [e2];
    t2[e2].distance = 0;
    while (r2.length > 0) {
      const e3 = r2.pop();
      const n2 = Object.keys(p[e3]);
      for (let { length: i2 } = n2, o2 = 0; o2 < i2; o2++) {
        const i3 = n2[o2];
        const s2 = t2[i3];
        if (s2.distance === -1) {
          s2.distance = t2[e3].distance + 1;
          s2.parent = e3;
          r2.unshift(i3);
        }
      }
    }
    return t2;
  }
  function link(e2, t2) {
    return function(r2) {
      return t2(e2(r2));
    };
  }
  function wrapConversion(e2, t2) {
    const r2 = [t2[e2].parent, e2];
    let n2 = p[t2[e2].parent][e2];
    let i2 = t2[e2].parent;
    while (t2[i2].parent) {
      r2.unshift(t2[i2].parent);
      n2 = link(p[t2[i2].parent][i2], n2);
      i2 = t2[i2].parent;
    }
    n2.conversion = r2;
    return n2;
  }
  function route(e2) {
    const t2 = deriveBFS(e2);
    const r2 = {};
    const n2 = Object.keys(t2);
    for (let { length: e3 } = n2, i2 = 0; i2 < e3; i2++) {
      const e4 = n2[i2];
      const o2 = t2[e4];
      if (o2.parent === null) {
        continue;
      }
      r2[e4] = wrapConversion(e4, t2);
    }
    return r2;
  }
  var m = route;
  var g = {};
  var b = Object.keys(p);
  function wrapRaw(e2) {
    const wrappedFn = function(...t2) {
      const r2 = t2[0];
      if (r2 === void 0 || r2 === null) {
        return r2;
      }
      if (r2.length > 1) {
        t2 = r2;
      }
      return e2(t2);
    };
    if ("conversion" in e2) {
      wrappedFn.conversion = e2.conversion;
    }
    return wrappedFn;
  }
  function wrapRounded(e2) {
    const wrappedFn = function(...t2) {
      const r2 = t2[0];
      if (r2 === void 0 || r2 === null) {
        return r2;
      }
      if (r2.length > 1) {
        t2 = r2;
      }
      const n2 = e2(t2);
      if (typeof n2 === "object") {
        for (let { length: e3 } = n2, t3 = 0; t3 < e3; t3++) {
          n2[t3] = Math.round(n2[t3]);
        }
      }
      return n2;
    };
    if ("conversion" in e2) {
      wrappedFn.conversion = e2.conversion;
    }
    return wrappedFn;
  }
  for (const e2 of b) {
    g[e2] = {};
    Object.defineProperty(g[e2], "channels", { value: p[e2].channels });
    Object.defineProperty(g[e2], "labels", { value: p[e2].labels });
    const t2 = m(e2);
    const r2 = Object.keys(t2);
    for (const n2 of r2) {
      const r3 = t2[n2];
      g[e2][n2] = wrapRounded(r3);
      g[e2][n2].raw = wrapRaw(r3);
    }
  }
  var w = g;
  var E = ["keyword", "gray", "hex"];
  var v = {};
  for (const e2 of Object.keys(w)) {
    v[[...w[e2].labels].sort().join("")] = e2;
  }
  var y = {};
  function Color(e2, t2) {
    if (!(this instanceof Color)) {
      return new Color(e2, t2);
    }
    if (t2 && t2 in E) {
      t2 = null;
    }
    if (t2 && !(t2 in w)) {
      throw new Error("Unknown model: " + t2);
    }
    let r2;
    let n2;
    if (e2 == null) {
      this.model = "rgb";
      this.color = [0, 0, 0];
      this.valpha = 1;
    } else if (e2 instanceof Color) {
      this.model = e2.model;
      this.color = [...e2.color];
      this.valpha = e2.valpha;
    } else if (typeof e2 === "string") {
      const t3 = c.get(e2);
      if (t3 === null) {
        throw new Error("Unable to parse color from string: " + e2);
      }
      this.model = t3.model;
      n2 = w[this.model].channels;
      this.color = t3.value.slice(0, n2);
      this.valpha = typeof t3.value[n2] === "number" ? t3.value[n2] : 1;
    } else if (e2.length > 0) {
      this.model = t2 || "rgb";
      n2 = w[this.model].channels;
      const r3 = Array.prototype.slice.call(e2, 0, n2);
      this.color = zeroArray(r3, n2);
      this.valpha = typeof e2[n2] === "number" ? e2[n2] : 1;
    } else if (typeof e2 === "number") {
      this.model = "rgb";
      this.color = [e2 >> 16 & 255, e2 >> 8 & 255, e2 & 255];
      this.valpha = 1;
    } else {
      this.valpha = 1;
      const t3 = Object.keys(e2);
      if ("alpha" in e2) {
        t3.splice(t3.indexOf("alpha"), 1);
        this.valpha = typeof e2.alpha === "number" ? e2.alpha : 0;
      }
      const n3 = t3.sort().join("");
      if (!(n3 in v)) {
        throw new Error("Unable to parse color from object: " + JSON.stringify(e2));
      }
      this.model = v[n3];
      const { labels: i2 } = w[this.model];
      const o2 = [];
      for (r2 = 0; r2 < i2.length; r2++) {
        o2.push(e2[i2[r2]]);
      }
      this.color = zeroArray(o2);
    }
    if (y[this.model]) {
      n2 = w[this.model].channels;
      for (r2 = 0; r2 < n2; r2++) {
        const e3 = y[this.model][r2];
        if (e3) {
          this.color[r2] = e3(this.color[r2]);
        }
      }
    }
    this.valpha = Math.max(0, Math.min(1, this.valpha));
    if (Object.freeze) {
      Object.freeze(this);
    }
  }
  Color.prototype = { toString() {
    return this.string();
  }, toJSON() {
    return this[this.model]();
  }, string(e2) {
    let t2 = this.model in c.to ? this : this.rgb();
    t2 = t2.round(typeof e2 === "number" ? e2 : 1);
    const r2 = t2.valpha === 1 ? t2.color : [...t2.color, this.valpha];
    return c.to[t2.model](...r2);
  }, percentString(e2) {
    const t2 = this.rgb().round(typeof e2 === "number" ? e2 : 1);
    const r2 = t2.valpha === 1 ? t2.color : [...t2.color, this.valpha];
    return c.to.rgb.percent(...r2);
  }, array() {
    return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha];
  }, object() {
    const e2 = {};
    const { channels: t2 } = w[this.model];
    const { labels: r2 } = w[this.model];
    for (let n2 = 0; n2 < t2; n2++) {
      e2[r2[n2]] = this.color[n2];
    }
    if (this.valpha !== 1) {
      e2.alpha = this.valpha;
    }
    return e2;
  }, unitArray() {
    const e2 = this.rgb().color;
    e2[0] /= 255;
    e2[1] /= 255;
    e2[2] /= 255;
    if (this.valpha !== 1) {
      e2.push(this.valpha);
    }
    return e2;
  }, unitObject() {
    const e2 = this.rgb().object();
    e2.r /= 255;
    e2.g /= 255;
    e2.b /= 255;
    if (this.valpha !== 1) {
      e2.alpha = this.valpha;
    }
    return e2;
  }, round(e2) {
    e2 = Math.max(e2 || 0, 0);
    return new Color([...this.color.map(roundToPlace(e2)), this.valpha], this.model);
  }, alpha(e2) {
    if (e2 !== void 0) {
      return new Color([...this.color, Math.max(0, Math.min(1, e2))], this.model);
    }
    return this.valpha;
  }, red: getset("rgb", 0, maxfn(255)), green: getset("rgb", 1, maxfn(255)), blue: getset("rgb", 2, maxfn(255)), hue: getset(["hsl", "hsv", "hsl", "hwb", "hcg"], 0, ((e2) => (e2 % 360 + 360) % 360)), saturationl: getset("hsl", 1, maxfn(100)), lightness: getset("hsl", 2, maxfn(100)), saturationv: getset("hsv", 1, maxfn(100)), value: getset("hsv", 2, maxfn(100)), chroma: getset("hcg", 1, maxfn(100)), gray: getset("hcg", 2, maxfn(100)), white: getset("hwb", 1, maxfn(100)), wblack: getset("hwb", 2, maxfn(100)), cyan: getset("cmyk", 0, maxfn(100)), magenta: getset("cmyk", 1, maxfn(100)), yellow: getset("cmyk", 2, maxfn(100)), black: getset("cmyk", 3, maxfn(100)), x: getset("xyz", 0, maxfn(95.047)), y: getset("xyz", 1, maxfn(100)), z: getset("xyz", 2, maxfn(108.833)), l: getset("lab", 0, maxfn(100)), a: getset("lab", 1), b: getset("lab", 2), keyword(e2) {
    if (e2 !== void 0) {
      return new Color(e2);
    }
    return w[this.model].keyword(this.color);
  }, hex(e2) {
    if (e2 !== void 0) {
      return new Color(e2);
    }
    return c.to.hex(...this.rgb().round().color);
  }, hexa(e2) {
    if (e2 !== void 0) {
      return new Color(e2);
    }
    const t2 = this.rgb().round().color;
    let r2 = Math.round(this.valpha * 255).toString(16).toUpperCase();
    if (r2.length === 1) {
      r2 = "0" + r2;
    }
    return c.to.hex(...t2) + r2;
  }, rgbNumber() {
    const e2 = this.rgb().color;
    return (e2[0] & 255) << 16 | (e2[1] & 255) << 8 | e2[2] & 255;
  }, luminosity() {
    const e2 = this.rgb().color;
    const t2 = [];
    for (const [r2, n2] of e2.entries()) {
      const e3 = n2 / 255;
      t2[r2] = e3 <= 0.04045 ? e3 / 12.92 : ((e3 + 0.055) / 1.055) ** 2.4;
    }
    return 0.2126 * t2[0] + 0.7152 * t2[1] + 0.0722 * t2[2];
  }, contrast(e2) {
    const t2 = this.luminosity();
    const r2 = e2.luminosity();
    if (t2 > r2) {
      return (t2 + 0.05) / (r2 + 0.05);
    }
    return (r2 + 0.05) / (t2 + 0.05);
  }, level(e2) {
    const t2 = this.contrast(e2);
    if (t2 >= 7) {
      return "AAA";
    }
    return t2 >= 4.5 ? "AA" : "";
  }, isDark() {
    const e2 = this.rgb().color;
    const t2 = (e2[0] * 2126 + e2[1] * 7152 + e2[2] * 722) / 1e4;
    return t2 < 128;
  }, isLight() {
    return !this.isDark();
  }, negate() {
    const e2 = this.rgb();
    for (let t2 = 0; t2 < 3; t2++) {
      e2.color[t2] = 255 - e2.color[t2];
    }
    return e2;
  }, lighten(e2) {
    const t2 = this.hsl();
    t2.color[2] += t2.color[2] * e2;
    return t2;
  }, darken(e2) {
    const t2 = this.hsl();
    t2.color[2] -= t2.color[2] * e2;
    return t2;
  }, saturate(e2) {
    const t2 = this.hsl();
    t2.color[1] += t2.color[1] * e2;
    return t2;
  }, desaturate(e2) {
    const t2 = this.hsl();
    t2.color[1] -= t2.color[1] * e2;
    return t2;
  }, whiten(e2) {
    const t2 = this.hwb();
    t2.color[1] += t2.color[1] * e2;
    return t2;
  }, blacken(e2) {
    const t2 = this.hwb();
    t2.color[2] += t2.color[2] * e2;
    return t2;
  }, grayscale() {
    const e2 = this.rgb().color;
    const t2 = e2[0] * 0.3 + e2[1] * 0.59 + e2[2] * 0.11;
    return Color.rgb(t2, t2, t2);
  }, fade(e2) {
    return this.alpha(this.valpha - this.valpha * e2);
  }, opaquer(e2) {
    return this.alpha(this.valpha + this.valpha * e2);
  }, rotate(e2) {
    const t2 = this.hsl();
    let r2 = t2.color[0];
    r2 = (r2 + e2) % 360;
    r2 = r2 < 0 ? 360 + r2 : r2;
    t2.color[0] = r2;
    return t2;
  }, mix(e2, t2) {
    if (!e2 || !e2.rgb) {
      throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof e2);
    }
    const r2 = e2.rgb();
    const n2 = this.rgb();
    const i2 = t2 === void 0 ? 0.5 : t2;
    const o2 = 2 * i2 - 1;
    const s2 = r2.alpha() - n2.alpha();
    const a2 = ((o2 * s2 === -1 ? o2 : (o2 + s2) / (1 + o2 * s2)) + 1) / 2;
    const l2 = 1 - a2;
    return Color.rgb(a2 * r2.red() + l2 * n2.red(), a2 * r2.green() + l2 * n2.green(), a2 * r2.blue() + l2 * n2.blue(), r2.alpha() * i2 + n2.alpha() * (1 - i2));
  } };
  for (const e2 of Object.keys(w)) {
    if (E.includes(e2)) {
      continue;
    }
    const { channels: t2 } = w[e2];
    Color.prototype[e2] = function(...t3) {
      if (this.model === e2) {
        return new Color(this);
      }
      if (t3.length > 0) {
        return new Color(t3, e2);
      }
      return new Color([...assertArray(w[this.model][e2].raw(this.color)), this.valpha], e2);
    };
    Color[e2] = function(...r2) {
      let n2 = r2[0];
      if (typeof n2 === "number") {
        n2 = zeroArray(r2, t2);
      }
      return new Color(n2, e2);
    };
  }
  function roundTo(e2, t2) {
    return Number(e2.toFixed(t2));
  }
  function roundToPlace(e2) {
    return function(t2) {
      return roundTo(t2, e2);
    };
  }
  function getset(e2, t2, r2) {
    e2 = Array.isArray(e2) ? e2 : [e2];
    for (const n2 of e2) {
      (y[n2] ||= [])[t2] = r2;
    }
    e2 = e2[0];
    return function(n2) {
      let i2;
      if (n2 !== void 0) {
        if (r2) {
          n2 = r2(n2);
        }
        i2 = this[e2]();
        i2.color[t2] = n2;
        return i2;
      }
      i2 = this[e2]().color[t2];
      if (r2) {
        i2 = r2(i2);
      }
      return i2;
    };
  }
  function maxfn(e2) {
    return function(t2) {
      return Math.max(0, Math.min(e2, t2));
    };
  }
  function assertArray(e2) {
    return Array.isArray(e2) ? e2 : [e2];
  }
  function zeroArray(e2, t2) {
    for (let r2 = 0; r2 < t2; r2++) {
      if (typeof e2[r2] !== "number") {
        e2[r2] = 0;
      }
    }
    return e2;
  }
  var x = Color;
}, 171: (e, t, r) => {
  e.exports = r(5446)["default"];
}, 7816: (e) => {
  e.exports = JSON.parse(`{"name":"sharp","description":"High performance Node.js image processing, the fastest module to resize JPEG, PNG, WebP, GIF, AVIF and TIFF images","version":"0.34.5","author":"Lovell Fuller <npm@lovell.info>","homepage":"https://sharp.pixelplumbing.com","contributors":["Pierre Inglebert <pierre.inglebert@gmail.com>","Jonathan Ong <jonathanrichardong@gmail.com>","Chanon Sajjamanochai <chanon.s@gmail.com>","Juliano Julio <julianojulio@gmail.com>","Daniel Gasienica <daniel@gasienica.ch>","Julian Walker <julian@fiftythree.com>","Amit Pitaru <pitaru.amit@gmail.com>","Brandon Aaron <hello.brandon@aaron.sh>","Andreas Lind <andreas@one.com>","Maurus Cuelenaere <mcuelenaere@gmail.com>","Linus Unneb\xE4ck <linus@folkdatorn.se>","Victor Mateevitsi <mvictoras@gmail.com>","Alaric Holloway <alaric.holloway@gmail.com>","Bernhard K. Weisshuhn <bkw@codingforce.com>","Chris Riley <criley@primedia.com>","David Carley <dacarley@gmail.com>","John Tobin <john@limelightmobileinc.com>","Kenton Gray <kentongray@gmail.com>","Felix B\xFCnemann <Felix.Buenemann@gmail.com>","Samy Al Zahrani <samyalzahrany@gmail.com>","Chintan Thakkar <lemnisk8@gmail.com>","F. Orlando Galashan <frulo@gmx.de>","Kleis Auke Wolthuizen <info@kleisauke.nl>","Matt Hirsch <mhirsch@media.mit.edu>","Matthias Thoemmes <thoemmes@gmail.com>","Patrick Paskaris <patrick@paskaris.gr>","J\xE9r\xE9my Lal <kapouer@melix.org>","Rahul Nanwani <r.nanwani@gmail.com>","Alice Monday <alice0meta@gmail.com>","Kristo Jorgenson <kristo.jorgenson@gmail.com>","YvesBos <yves_bos@outlook.com>","Guy Maliar <guy@tailorbrands.com>","Nicolas Coden <nicolas@ncoden.fr>","Matt Parrish <matt.r.parrish@gmail.com>","Marcel Bretschneider <marcel.bretschneider@gmail.com>","Matthew McEachen <matthew+github@mceachen.org>","Jarda Kot\u011B\u0161ovec <jarda.kotesovec@gmail.com>","Kenric D'Souza <kenric.dsouza@gmail.com>","Oleh Aleinyk <oleg.aleynik@gmail.com>","Marcel Bretschneider <marcel.bretschneider@gmail.com>","Andrea Bianco <andrea.bianco@unibas.ch>","Rik Heywood <rik@rik.org>","Thomas Parisot <hi@oncletom.io>","Nathan Graves <nathanrgraves+github@gmail.com>","Tom Lokhorst <tom@lokhorst.eu>","Espen Hovlandsdal <espen@hovlandsdal.com>","Sylvain Dumont <sylvain.dumont35@gmail.com>","Alun Davies <alun.owain.davies@googlemail.com>","Aidan Hoolachan <ajhoolachan21@gmail.com>","Axel Eirola <axel.eirola@iki.fi>","Freezy <freezy@xbmc.org>","Daiz <taneli.vatanen@gmail.com>","Julian Aubourg <j@ubourg.net>","Keith Belovay <keith@picthrive.com>","Michael B. Klein <mbklein@gmail.com>","Jordan Prudhomme <jordan@raboland.fr>","Ilya Ovdin <iovdin@gmail.com>","Andargor <andargor@yahoo.com>","Paul Neave <paul.neave@gmail.com>","Brendan Kennedy <brenwken@gmail.com>","Brychan Bennett-Odlum <git@brychan.io>","Edward Silverton <e.silverton@gmail.com>","Roman Malieiev <aromaleev@gmail.com>","Tomas Szabo <tomas.szabo@deftomat.com>","Robert O'Rourke <robert@o-rourke.org>","Guillermo Alfonso Varela Chouci\xF1o <guillevch@gmail.com>","Christian Flintrup <chr@gigahost.dk>","Manan Jadhav <manan@motionden.com>","Leon Radley <leon@radley.se>","alza54 <alza54@thiocod.in>","Jacob Smith <jacob@frende.me>","Michael Nutt <michael@nutt.im>","Brad Parham <baparham@gmail.com>","Taneli Vatanen <taneli.vatanen@gmail.com>","Joris Dugu\xE9 <zaruike10@gmail.com>","Chris Banks <christopher.bradley.banks@gmail.com>","Ompal Singh <ompal.hitm09@gmail.com>","Brodan <christopher.hranj@gmail.com>","Ankur Parihar <ankur.github@gmail.com>","Brahim Ait elhaj <brahima@gmail.com>","Mart Jansink <m.jansink@gmail.com>","Lachlan Newman <lachnewman007@gmail.com>","Dennis Beatty <dennis@dcbeatty.com>","Ingvar Stepanyan <me@rreverser.com>","Don Denton <don@happycollision.com>"],"scripts":{"build":"node install/build.js","install":"node install/check.js || npm run build","clean":"rm -rf src/build/ .nyc_output/ coverage/ test/fixtures/output.*","test":"npm run lint && npm run test-unit","lint":"npm run lint-cpp && npm run lint-js && npm run lint-types","lint-cpp":"cpplint --quiet src/*.h src/*.cc","lint-js":"biome lint","lint-types":"tsd --files ./test/types/sharp.test-d.ts","test-leak":"./test/leak/leak.sh","test-unit":"node --experimental-test-coverage test/unit.mjs","package-from-local-build":"node npm/from-local-build.js","package-release-notes":"node npm/release-notes.js","docs-build":"node docs/build.mjs","docs-serve":"cd docs && npm start","docs-publish":"cd docs && npm run build && npx firebase-tools deploy --project pixelplumbing --only hosting:pixelplumbing-sharp"},"type":"commonjs","main":"lib/index.js","types":"lib/index.d.ts","files":["install","lib","src/*.{cc,h,gyp}"],"repository":{"type":"git","url":"git://github.com/lovell/sharp.git"},"keywords":["jpeg","png","webp","avif","tiff","gif","svg","jp2","dzi","image","resize","thumbnail","crop","embed","libvips","vips"],"dependencies":{"@img/colour":"^1.0.0","detect-libc":"^2.1.2","semver":"^7.7.3"},"optionalDependencies":{"@img/sharp-darwin-arm64":"0.34.5","@img/sharp-darwin-x64":"0.34.5","@img/sharp-libvips-darwin-arm64":"1.2.4","@img/sharp-libvips-darwin-x64":"1.2.4","@img/sharp-libvips-linux-arm":"1.2.4","@img/sharp-libvips-linux-arm64":"1.2.4","@img/sharp-libvips-linux-ppc64":"1.2.4","@img/sharp-libvips-linux-riscv64":"1.2.4","@img/sharp-libvips-linux-s390x":"1.2.4","@img/sharp-libvips-linux-x64":"1.2.4","@img/sharp-libvips-linuxmusl-arm64":"1.2.4","@img/sharp-libvips-linuxmusl-x64":"1.2.4","@img/sharp-linux-arm":"0.34.5","@img/sharp-linux-arm64":"0.34.5","@img/sharp-linux-ppc64":"0.34.5","@img/sharp-linux-riscv64":"0.34.5","@img/sharp-linux-s390x":"0.34.5","@img/sharp-linux-x64":"0.34.5","@img/sharp-linuxmusl-arm64":"0.34.5","@img/sharp-linuxmusl-x64":"0.34.5","@img/sharp-wasm32":"0.34.5","@img/sharp-win32-arm64":"0.34.5","@img/sharp-win32-ia32":"0.34.5","@img/sharp-win32-x64":"0.34.5"},"devDependencies":{"@biomejs/biome":"^2.3.4","@cpplint/cli":"^0.1.0","@emnapi/runtime":"^1.7.0","@img/sharp-libvips-dev":"1.2.4","@img/sharp-libvips-dev-wasm32":"1.2.4","@img/sharp-libvips-win32-arm64":"1.2.4","@img/sharp-libvips-win32-ia32":"1.2.4","@img/sharp-libvips-win32-x64":"1.2.4","@types/node":"*","emnapi":"^1.7.0","exif-reader":"^2.0.2","extract-zip":"^2.0.1","icc":"^3.0.0","jsdoc-to-markdown":"^9.1.3","node-addon-api":"^8.5.0","node-gyp":"^11.5.0","tar-fs":"^3.1.1","tsd":"^0.33.0"},"license":"Apache-2.0","engines":{"node":"^18.17.0 || ^20.3.0 || >=21.0.0"},"config":{"libvips":">=8.17.3"},"funding":{"url":"https://opencollective.com/libvips"}}`);
} };
var __webpack_module_cache__ = {};
function __nccwpck_require2_(e) {
  var t = __webpack_module_cache__[e];
  if (t !== void 0) {
    return t.exports;
  }
  var r = __webpack_module_cache__[e] = { id: e, loaded: false, exports: {} };
  var n = true;
  try {
    __webpack_modules__[e](r, r.exports, __nccwpck_require2_);
    n = false;
  } finally {
    if (n) delete __webpack_module_cache__[e];
  }
  r.loaded = true;
  return r.exports;
}
(() => {
  __nccwpck_require2_.n = (e) => {
    var t = e && e.__esModule ? () => e["default"] : () => e;
    __nccwpck_require2_.d(t, { a: t });
    return t;
  };
})();
(() => {
  __nccwpck_require2_.d = (e, t) => {
    for (var r in t) {
      if (__nccwpck_require2_.o(t, r) && !__nccwpck_require2_.o(e, r)) {
        Object.defineProperty(e, r, { enumerable: true, get: t[r] });
      }
    }
  };
})();
(() => {
  __nccwpck_require2_.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
})();
(() => {
  __nccwpck_require2_.nmd = (e) => {
    e.paths = [];
    if (!e.children) e.children = [];
    return e;
  };
})();
if (typeof __nccwpck_require2_ !== "undefined") __nccwpck_require2_.ab = new URL(__nccwpck_require__(896), __nccwpck_require__.b).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
var __nested_webpack_exports__ = {};
__nccwpck_require2_.d(__nested_webpack_exports__, { $: () => config, A: () => handler });
var lib = __nccwpck_require2_(3491);
var lib_default = __nccwpck_require2_.n(lib);
var kMeans = __nccwpck_require2_(7586);
var kMeans_default = __nccwpck_require2_.n(kMeans);
var D65_REFERENCE = { Xn: 0.95047, Yn: 1, Zn: 1.08883 };
var RGB_TO_XYZ_MATRIX = [[0.4124564, 0.3575761, 0.1804375], [0.2126729, 0.7151522, 0.072175], [0.0193339, 0.119192, 0.9503041]];
var XYZ_TO_RGB_MATRIX = null;
function gammaExpand(e) {
  return e <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4);
}
function gammaCompress(e) {
  return e <= 31308e-7 ? e * 12.92 : 1.055 * Math.pow(e, 1 / 2.4) - 0.055;
}
function sRGBToLinearRGB(e) {
  return { R: gammaExpand(e.R / 255), G: gammaExpand(e.G / 255), B: gammaExpand(e.B / 255) };
}
function linearRGBToSRGB(e) {
  return { R: Math.round(gammaCompress(e.R) * 255), G: Math.round(gammaCompress(e.G) * 255), B: Math.round(gammaCompress(e.B) * 255) };
}
function linearRGBToXYZ(e) {
  const [t, r, n] = RGB_TO_XYZ_MATRIX;
  return { X: t[0] * e.R + t[1] * e.G + t[2] * e.B, Y: r[0] * e.R + r[1] * e.G + r[2] * e.B, Z: n[0] * e.R + n[1] * e.G + n[2] * e.B };
}
function xyzToLinearRGB(e) {
  const [t, r, n] = XYZ_TO_RGB_MATRIX;
  return { R: t[0] * e.X + t[1] * e.Y + t[2] * e.Z, G: r[0] * e.X + r[1] * e.Y + r[2] * e.Z, B: n[0] * e.X + n[1] * e.Y + n[2] * e.Z };
}
function f(e) {
  const t = 6 / 29;
  return e > Math.pow(t, 3) ? Math.pow(e, 1 / 3) : e / (3 * t * t) + 4 / 29;
}
function fInv(e) {
  const t = 6 / 29;
  return e > t ? Math.pow(e, 3) : 3 * t * t * (e - 4 / 29);
}
function xyzToLab(e) {
  const t = f(e.X / D65_REFERENCE.Xn);
  const r = f(e.Y / D65_REFERENCE.Yn);
  const n = f(e.Z / D65_REFERENCE.Zn);
  return { L: 116 * r - 16, a: 500 * (t - r), b: 200 * (r - n) };
}
function labToXYZ(e) {
  const t = (e.L + 16) / 116;
  const r = e.a / 500 + t;
  const n = t - e.b / 200;
  return { X: D65_REFERENCE.Xn * fInv(r), Y: D65_REFERENCE.Yn * fInv(t), Z: D65_REFERENCE.Zn * fInv(n) };
}
function sRGBToLab(e) {
  const t = sRGBToLinearRGB(e);
  const r = linearRGBToXYZ(t);
  return xyzToLab(r);
}
function labToSRGB(e) {
  const t = labToXYZ(e);
  const r = xyzToLinearRGB(t);
  return linearRGBToSRGB(r);
}
function hexToRGB(e) {
  const t = e.replace("#", "");
  const r = parseInt(t, 16);
  return { R: r >> 16 & 255, G: r >> 8 & 255, B: r & 255 };
}
function rgbToHex(e) {
  const t = Math.round(Math.max(0, Math.min(255, e.R)));
  const r = Math.round(Math.max(0, Math.min(255, e.G)));
  const n = Math.round(Math.max(0, Math.min(255, e.B)));
  return `#${((1 << 24) + (t << 16) + (r << 8) + n).toString(16).slice(1).toUpperCase()}`;
}
function clampRGB(e) {
  return { R: Math.max(0, Math.min(255, Math.round(e.R))), G: Math.max(0, Math.min(255, Math.round(e.G))), B: Math.max(0, Math.min(255, Math.round(e.B))) };
}
var RasterExtractor = class {
  constructor(e = {}) {
    this.options = { maxColours: e.maxColours ?? 20, minPercentage: e.minPercentage ?? 0.5, resampleSize: e.resampleSize ?? 400, iterations: e.iterations ?? 20 };
  }
  async extract(e, t) {
    const r = Date.now();
    try {
      const n = lib_default()(Buffer.from(e));
      const i = await n.metadata();
      if (!i.width || !i.height) {
        throw new Error("Invalid image dimensions");
      }
      const o = Math.max(i.width, i.height);
      const s = o > this.options.resampleSize ? this.options.resampleSize / o : 1;
      const a = Math.round(i.width * s);
      const l = Math.round(i.height * s);
      const { data: c, info: h } = await n.resize(a, l, { kernel: lib_default().kernel.lanczos3, fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      const u = [];
      for (let e2 = 0; e2 < c.length; e2 += 3) {
        u.push({ R: c[e2], G: c[e2 + 1], B: c[e2 + 2] });
      }
      const p = this.performKMeans(u, this.options.maxColours);
      const d = u.length;
      const m = p.map(((e2, t2) => {
        const r2 = e2.centroid;
        const n2 = { R: Math.round(Math.max(0, Math.min(255, r2[0]))), G: Math.round(Math.max(0, Math.min(255, r2[1]))), B: Math.round(Math.max(0, Math.min(255, r2[2]))) };
        const i2 = e2.cluster.length;
        const o2 = i2 / d * 100;
        return { rgb: n2, pixels: i2, percentage: o2 };
      })).filter(((e2) => e2.percentage >= this.options.minPercentage)).sort(((e2, t2) => t2.percentage - e2.percentage));
      const g = Date.now() - r;
      console.info(`Final palette: ${m.length} colors, top 5 areas: ${m.slice(0, 5).map(((e2) => e2.percentage.toFixed(1) + "%")).join(", ")}`);
      console.info(`Extraction completed in ${g}ms`);
      return { colours: m, metadata: { width: i.width, height: i.height, totalPixels: i.width * i.height, format: t } };
    } catch (e2) {
      throw new Error(`Raster extraction failed: ${e2.message}`);
    }
  }
  async extractFromCanvas(e) {
    try {
      const t = e.getContext("2d");
      if (!t) {
        throw new Error("Could not get canvas context");
      }
      const r = t.getImageData(0, 0, e.width, e.height);
      const n = [];
      for (let e2 = 0; e2 < r.data.length; e2 += 4) {
        n.push({ R: r.data[e2], G: r.data[e2 + 1], B: r.data[e2 + 2] });
      }
      const i = this.performKMeans(n, this.options.maxColours);
      const o = n.length;
      const s = i.map(((e2) => {
        const t2 = e2.centroid;
        const r2 = { R: Math.round(Math.max(0, Math.min(255, t2[0]))), G: Math.round(Math.max(0, Math.min(255, t2[1]))), B: Math.round(Math.max(0, Math.min(255, t2[2]))) };
        const n2 = e2.cluster.length;
        const i2 = n2 / o * 100;
        return { rgb: r2, pixels: n2, percentage: i2 };
      })).filter(((e2) => e2.percentage >= this.options.minPercentage)).sort(((e2, t2) => t2.percentage - e2.percentage));
      return { colours: s, metadata: { width: e.width, height: e.height, totalPixels: o, format: "canvas" } };
    } catch (e2) {
      throw new Error(`Canvas extraction failed: ${e2.message}`);
    }
  }
  performKMeans(e, t) {
    console.info(`K-means input: ${e.length} pixels, requesting ${t} clusters`);
    const r = [];
    let n = 0;
    for (const t2 of e) {
      try {
        const e2 = sRGBToLinearRGB(t2);
        const i2 = linearRGBToXYZ(e2);
        const o2 = xyzToLab(i2);
        if (isNaN(o2.L) || isNaN(o2.a) || isNaN(o2.b)) {
          n++;
          continue;
        }
        r.push(o2);
      } catch (e2) {
        n++;
        continue;
      }
    }
    if (n > 0) {
      console.info(`NaN dropped: ${n}`);
    }
    if (r.length === 0) {
      console.warn("No valid Lab pixels, using RGB fallback");
      return this.simpleDominantColors(e, t);
    }
    const i = Math.min(r.length, 5e3);
    const o = r.length > i ? this.sampleArray(r, i) : r;
    console.info(`Using ${o.length} sampled pixels`);
    const s = this.calculateOptimalK(o, t);
    console.info(`Adjusted k from ${t} to ${s}`);
    if (s <= 1) {
      const t2 = this.calculateAverageColor(e);
      console.info("Single color case, using average:", t2);
      return [{ centroid: [t2.R, t2.G, t2.B], cluster: e.map(((e2) => [e2.R, e2.G, e2.B])) }];
    }
    const a = 3;
    for (let t2 = 0; t2 < a; t2++) {
      try {
        console.info(`K-means attempt ${t2 + 1}/${a} with k=${s}`);
        const n2 = o.map(((e2) => [e2.L, e2.a, e2.b]));
        const i2 = kMeans_default()(n2, s, { maxIterations: this.options.iterations, tolerance: 1, seed: Date.now() + t2 * 1e3 });
        if (!i2 || i2.length === 0) {
          throw new Error(`K-means returned empty result on attempt ${t2 + 1}`);
        }
        console.info(`K-means attempt ${t2 + 1}: success with ${i2.length} clusters`);
        return this.convertLabClustersToRGB(i2, e, r);
      } catch (r2) {
        console.warn(`K-means attempt ${t2 + 1} failed:`, r2.message);
        if (t2 === a - 1) {
          console.warn("All k-means attempts failed, using fallback method");
          return this.simpleDominantColors(e, s);
        }
      }
    }
    return this.simpleDominantColors(e, s);
  }
  calculateOptimalK(e, t) {
    const r = /* @__PURE__ */ new Set();
    for (const t2 of e) {
      const e2 = Math.round(t2.L / 4) * 4;
      const n2 = Math.round(t2.a / 2) * 2;
      const i = Math.round(t2.b / 2) * 2;
      r.add(`${e2},${n2},${i}`);
    }
    const n = r.size;
    if (n < 64) {
      return Math.min(n, 10, t);
    } else {
      const e2 = Math.round(Math.sqrt(n / 2));
      return Math.max(6, Math.min(e2, 18, t));
    }
  }
  convertLabClustersToRGB(e, t, r) {
    const n = [];
    for (const i of e) {
      const [o, s, a] = i.centroid;
      try {
        const e2 = { X: 95.047 * Math.pow((o + 16) / 116 + s / 500, 3) / 100, Y: 100 * Math.pow((o + 16) / 116, 3) / 100, Z: 108.883 * Math.pow((o + 16) / 116 - a / 200, 3) / 100 };
        const i2 = e2.X * 3.2406 + e2.Y * -1.5372 + e2.Z * -0.4986;
        const l = e2.X * -0.9689 + e2.Y * 1.8758 + e2.Z * 0.0415;
        const c = e2.X * 0.0557 + e2.Y * -0.204 + e2.Z * 1.057;
        const toSRGB = (e3) => {
          e3 = Math.max(0, Math.min(1, e3));
          return e3 <= 31308e-7 ? 12.92 * e3 : 1.055 * Math.pow(e3, 1 / 2.4) - 0.055;
        };
        const h = { R: Math.round(toSRGB(i2) * 255), G: Math.round(toSRGB(l) * 255), B: Math.round(toSRGB(c) * 255) };
        const u = [];
        for (let e3 = 0; e3 < r.length; e3++) {
          const n2 = r[e3];
          const i3 = Math.sqrt(Math.pow(n2.L - o, 2) + Math.pow(n2.a - s, 2) + Math.pow(n2.b - a, 2));
          let l2 = Infinity;
          let c2 = 0;
          for (let e4 = 0; e4 < t.length; e4++) {
            const r2 = Math.sqrt(Math.pow(t[e4].R - h.R, 2) + Math.pow(t[e4].G - h.G, 2) + Math.pow(t[e4].B - h.B, 2));
            if (r2 < l2) {
              l2 = r2;
              c2 = e4;
            }
          }
          u.push([t[c2].R, t[c2].G, t[c2].B]);
        }
        n.push({ centroid: [h.R, h.G, h.B], cluster: u.length > 0 ? u : [[h.R, h.G, h.B]] });
      } catch (e2) {
        console.warn("Failed to convert Lab cluster to RGB:", e2);
        const r2 = this.calculateAverageColor(t);
        n.push({ centroid: [r2.R, r2.G, r2.B], cluster: t.map(((e3) => [e3.R, e3.G, e3.B])) });
      }
    }
    return n;
  }
  sampleArray(e, t) {
    if (e.length <= t) return e;
    const r = e.length / t;
    const n = [];
    for (let t2 = 0; t2 < e.length; t2 += r) {
      n.push(e[Math.floor(t2)]);
    }
    return n.slice(0, t);
  }
  findClosestCluster(e, t) {
    let r = Infinity;
    let n = t[0];
    for (const i of t) {
      const t2 = Math.sqrt(Math.pow(e[0][0] - i[0], 2) + Math.pow(e[0][1] - i[1], 2) + Math.pow(e[0][2] - i[2], 2));
      if (t2 < r) {
        r = t2;
        n = i;
      }
    }
    return n;
  }
  simpleDominantColors(e, t) {
    console.info("Using simple color quantization fallback");
    const r = /* @__PURE__ */ new Map();
    const n = e.length;
    for (const t2 of e) {
      const n2 = { R: Math.floor(t2.R / 6) * 6, G: Math.floor(t2.G / 6) * 6, B: Math.floor(t2.B / 6) * 6 };
      const i2 = `${n2.R},${n2.G},${n2.B}`;
      const o2 = r.get(i2);
      if (o2) {
        o2.count++;
      } else {
        let t3;
        try {
          const e2 = sRGBToLinearRGB(n2);
          const r2 = linearRGBToXYZ(e2);
          t3 = xyzToLab(r2);
        } catch (e2) {
        }
        r.set(i2, { count: 1, rgb: n2, lab: t3 });
      }
    }
    let i = Array.from(r.entries()).filter((([e2, t2]) => t2.lab !== void 0)).map((([e2, t2]) => ({ key: e2, rgb: t2.rgb, lab: t2.lab, count: t2.count, percentage: t2.count / n * 100 })));
    console.info(`Pre-merge: ${i.length} quantized colors`);
    i = this.mergeNearbyColors(i).filter(((e2) => e2.lab !== void 0));
    const o = i.sort(((e2, t2) => t2.count - e2.count)).slice(0, t);
    console.info(`Post-merge: ${o.length} final colors`);
    return o.map(((t2) => ({ centroid: [t2.rgb.R, t2.rgb.G, t2.rgb.B], cluster: e.filter(((e2) => {
      const r2 = { R: Math.floor(e2.R / 6) * 6, G: Math.floor(e2.G / 6) * 6, B: Math.floor(e2.B / 6) * 6 };
      return `${r2.R},${r2.G},${r2.B}` === t2.key;
    })).map(((e2) => [e2.R, e2.G, e2.B])) })));
  }
  mergeNearbyColors(e) {
    const t = 1.5;
    const r = 0.75;
    const n = 8;
    e.sort(((e2, t2) => t2.percentage - e2.percentage));
    const i = [];
    for (const o of e) {
      let e2 = false;
      if (o.percentage >= r) {
        i.push(o);
        continue;
      }
      for (const r2 of i) {
        if (!o.lab || !r2.lab) {
          continue;
        }
        const i2 = Math.sqrt(Math.pow(o.lab.L - r2.lab.L, 2) + Math.pow(o.lab.a - r2.lab.a, 2) + Math.pow(o.lab.b - r2.lab.b, 2));
        const s = Math.abs(o.lab.a - r2.lab.a);
        const a = Math.abs(o.lab.b - r2.lab.b);
        if (i2 <= t && s <= n && a <= n) {
          const t2 = r2.percentage + o.percentage;
          const n2 = r2.count + o.count;
          r2.rgb = { R: Math.round((r2.rgb.R * r2.count + o.rgb.R * o.count) / n2), G: Math.round((r2.rgb.G * r2.count + o.rgb.G * o.count) / n2), B: Math.round((r2.rgb.B * r2.count + o.rgb.B * o.count) / n2) };
          r2.lab = { L: (r2.lab.L * r2.percentage + o.lab.L * o.percentage) / t2, a: (r2.lab.a * r2.percentage + o.lab.a * o.percentage) / t2, b: (r2.lab.b * r2.percentage + o.lab.b * o.percentage) / t2 };
          r2.count = n2;
          r2.percentage = t2;
          e2 = true;
          break;
        }
      }
      if (!e2) {
        i.push(o);
      }
    }
    return i;
  }
  calculateAverageColor(e) {
    if (e.length === 0) {
      return { R: 0, G: 0, B: 0 };
    }
    const t = e.reduce(((e2, t2) => ({ R: e2.R + t2.R, G: e2.G + t2.G, B: e2.B + t2.B })), { R: 0, G: 0, B: 0 });
    return { R: Math.round(t.R / e.length), G: Math.round(t.G / e.length), B: Math.round(t.B / e.length) };
  }
};
var ColourSpaceConverter = class {
  constructor(e = {}) {
    this.options = { whitePoint: e.whitePoint ?? "D65", gamma: e.gamma ?? 2.4 };
  }
  rgbToLab(e) {
    return sRGBToLab(e);
  }
  rgbToHex(e) {
    const toHex = (e2) => Math.round(Math.max(0, Math.min(255, e2))).toString(16).padStart(2, "0");
    return `#${toHex(e.R)}${toHex(e.G)}${toHex(e.B)}`;
  }
  hexToRgb(e) {
    const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (!t) {
      throw new Error(`Invalid hex color: ${e}`);
    }
    return { R: parseInt(t[1], 16), G: parseInt(t[2], 16), B: parseInt(t[3], 16) };
  }
  calculateDeltaE(e, t) {
    const r = e.L - t.L;
    const n = e.a - t.a;
    const i = e.b - t.b;
    return Math.sqrt(r * r + n * n + i * i);
  }
  deduplicate(e, t = 5) {
    const r = [];
    for (const n of e) {
      const e2 = r.some(((e3) => this.calculateDeltaE(e3.lab, n.lab) < t));
      if (!e2) {
        r.push(n);
      } else {
        const e3 = r.find(((e4) => this.calculateDeltaE(e4.lab, n.lab) < t));
        if (e3) {
          e3.areaPct += n.areaPct;
          if (e3.pageIds && n.pageIds) {
            e3.pageIds = [.../* @__PURE__ */ new Set([...e3.pageIds, ...n.pageIds])];
          }
        }
      }
    }
    return r;
  }
  normalizeAreas(e) {
    const t = e.reduce(((e2, t2) => e2 + t2.areaPct), 0);
    if (t === 0) {
      return e;
    }
    return e.map(((e2) => ({ ...e2, areaPct: e2.areaPct / t * 100 })));
  }
  filterInsignificant(e, t = 1, r = true, n = true) {
    return e.filter(((e2) => {
      if (e2.areaPct < t) {
        return false;
      }
      if (r && e2.lab.L > 95) {
        return false;
      }
      if (n && e2.lab.L < 5) {
        return false;
      }
      return true;
    }));
  }
  sortByImportance(e) {
    return e.sort(((e2, t) => {
      if (Math.abs(e2.areaPct - t.areaPct) > 1) {
        return t.areaPct - e2.areaPct;
      }
      const r = Math.sqrt(e2.lab.a * e2.lab.a + e2.lab.b * e2.lab.b);
      const n = Math.sqrt(t.lab.a * t.lab.a + t.lab.b * t.lab.b);
      return n - r;
    }));
  }
};
function generateColourId(e, t) {
  const r = new ColourSpaceConverter().rgbToHex(e);
  const n = Array.from(r).reduce(((e2, t2) => {
    e2 = (e2 << 5) - e2 + t2.charCodeAt(0);
    return e2 & e2;
  }), 0);
  return `${t}_${Math.abs(n).toString(36)}`;
}
function combineColourSources(e, t, r = "merge") {
  const n = new ColourSpaceConverter();
  switch (r) {
    case "prefer-pdf":
      return e.length > 0 ? e : t;
    case "prefer-raster":
      return t.length > 0 ? t : e;
    case "merge":
    default:
      const r2 = [...e, ...t];
      const i = n.deduplicate(r2, 8);
      const o = n.normalizeAreas(i);
      const s = n.sortByImportance(o);
      return s;
  }
}
function validateFileType(e) {
  const t = e.toLowerCase().split(".").pop();
  if (!t) {
    return { isValid: false, type: null };
  }
  const r = ["png", "jpg", "jpeg", "svg", "webp"];
  const n = ["pdf"];
  if (n.includes(t)) {
    return { isValid: true, type: "pdf", format: t };
  }
  if (r.includes(t)) {
    return { isValid: true, type: "image", format: t };
  }
  return { isValid: false, type: null };
}
function estimateExtractionComplexity(e, t) {
  const r = 1024 * 1024;
  if (t === "pdf") {
    if (e < 2 * r) return "low";
    if (e < 10 * r) return "medium";
    return "high";
  }
  if (e < 1 * r) return "low";
  if (e < 5 * r) return "medium";
  return "high";
}
var MemoryCache = class {
  constructor(e = {}) {
    this.cache = /* @__PURE__ */ new Map();
    this.options = { defaultTTL: e.defaultTTL ?? 30 * 60 * 1e3, maxEntries: e.maxEntries ?? 100, cleanupInterval: e.cleanupInterval ?? 5 * 60 * 1e3 };
    this.startCleanup();
  }
  set(e, t, r) {
    const n = { data: t, timestamp: Date.now(), ttl: r ?? this.options.defaultTTL, hits: 0 };
    this.cache.set(e, n);
    this.evictOldest();
  }
  get(e) {
    const t = this.cache.get(e);
    if (!t) {
      return null;
    }
    const r = Date.now();
    const n = r - t.timestamp;
    if (n > t.ttl) {
      this.cache.delete(e);
      return null;
    }
    t.hits++;
    return t.data;
  }
  has(e) {
    const t = this.cache.get(e);
    if (!t) {
      return false;
    }
    const r = Date.now();
    const n = r - t.timestamp;
    if (n > t.ttl) {
      this.cache.delete(e);
      return false;
    }
    return true;
  }
  delete(e) {
    return this.cache.delete(e);
  }
  clear() {
    this.cache.clear();
  }
  size() {
    return this.cache.size;
  }
  getStats() {
    const e = Array.from(this.cache.values());
    const t = Date.now();
    const r = e.reduce(((e2, t2) => e2 + t2.hits), 0);
    const n = e.reduce(((e2, r2) => e2 + (t - r2.timestamp)), 0);
    const i = e.length > 0 ? n / e.length : 0;
    const o = e.length > 0 ? r / e.length : 0;
    return { entries: e.length, totalHits: r, averageAge: i, hitRate: o };
  }
  evictOldest() {
    if (this.cache.size <= this.options.maxEntries) {
      return;
    }
    let e = "";
    let t = Date.now();
    for (const [r, n] of this.cache) {
      if (n.timestamp < t) {
        t = n.timestamp;
        e = r;
      }
    }
    if (e) {
      this.cache.delete(e);
    }
  }
  startCleanup() {
    this.cleanupTimer = setInterval((() => {
      this.cleanup();
    }), this.options.cleanupInterval);
  }
  cleanup() {
    const e = Date.now();
    const t = [];
    for (const [r, n] of this.cache) {
      const i = e - n.timestamp;
      if (i > n.ttl) {
        t.push(r);
      }
    }
    for (const e2 of t) {
      this.cache.delete(e2);
    }
  }
  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
};
var extractionCache = null;
function getExtractionCache() {
  if (!extractionCache) {
    extractionCache = new MemoryCache({ defaultTTL: 60 * 60 * 1e3, maxEntries: 50, cleanupInterval: 10 * 60 * 1e3 });
  }
  return extractionCache;
}
function generateCacheKey(e, t, r = {}) {
  const n = JSON.stringify(r);
  const i = `${e}-${t}-${n}`;
  let o = 0;
  for (let e2 = 0; e2 < i.length; e2++) {
    const t2 = i.charCodeAt(e2);
    o = (o << 5) - o + t2;
    o = o & o;
  }
  return Math.abs(o).toString(36);
}
var ProgressiveLoader = class {
  constructor() {
    this.startTime = Date.now();
    this.currentStage = "uploading";
    this.listeners = [];
    this.startTime = Date.now();
  }
  onProgress(e) {
    this.listeners.push(e);
    return () => {
      const t = this.listeners.indexOf(e);
      if (t > -1) {
        this.listeners.splice(t, 1);
      }
    };
  }
  updateProgress(e, t, r, n) {
    this.currentStage = e;
    const i = Date.now() - this.startTime;
    const o = { stage: e, progress: Math.max(0, Math.min(100, t)), message: r, timeElapsed: i, estimatedTimeRemaining: n };
    for (const t2 of this.listeners) {
      try {
        t2(o);
      } catch (e2) {
        console.error("Progress listener error:", e2);
      }
    }
  }
  complete() {
    this.updateProgress("complete", 100, "Extraction complete");
  }
  error(e) {
    this.updateProgress("error", 0, e);
  }
};
var PaletteExtractor = class {
  constructor(e = {}) {
    this.options = { maxColours: e.maxColours ?? 15, minAreaPct: e.minAreaPct ?? 1, combineStrategy: e.combineStrategy ?? "merge", rasterFallback: e.rasterFallback ?? true, pdfOptions: { minFrequency: 3, tolerance: 8, ...e.pdfOptions }, rasterOptions: { resampleSize: 400, iterations: 15, ...e.rasterOptions } };
    this.converter = new ColourSpaceConverter();
    this.rasterExtractor = new RasterExtractor({ maxColours: this.options.maxColours, minPercentage: this.options.minAreaPct, ...this.options.rasterOptions });
  }
  async extract(e, t, r) {
    const n = Date.now();
    const i = validateFileType(t);
    const o = estimateExtractionComplexity(e.byteLength, i.type);
    const s = [];
    const a = [];
    if (!i.isValid) {
      throw new Error(`Unsupported file type: ${t}`);
    }
    const l = getExtractionCache();
    const c = generateCacheKey(t, e.byteLength, this.options);
    const h = l.get(c);
    if (h) {
      r?.updateProgress("complete", 100, "Using cached result");
      return h;
    }
    r?.updateProgress("extracting", 10, "Starting color extraction...");
    try {
      let h2 = [];
      let u = [];
      if (i.type === "pdf") {
        r?.updateProgress("extracting", 25, "Skipping server PDF processing - client handles extraction...");
        s.push("PDF processing handled client-side. Server extraction skipped to avoid canvas dependencies.");
        console.info("Skipping server-side PDF processing - relying on client-side extraction");
      }
      if (i.type === "image") {
        try {
          r?.updateProgress("extracting", 40, "Analyzing raster image colors...");
          const t2 = await this.rasterExtractor.extract(e, i.format);
          u = t2.colours.map(((e2) => ({ id: generateColourId(e2.rgb, "raster"), rgb: e2.rgb, lab: this.converter.rgbToLab(e2.rgb), areaPct: e2.percentage, source: "raster", metadata: { pixels: e2.pixels, percentage: e2.percentage } })));
          a.push("raster");
          if (u.length === 0) {
            s.push("No significant colors found in raster image");
          }
        } catch (e2) {
          throw new Error(`Image extraction failed: ${e2.message}`);
        }
      }
      r?.updateProgress("processing", 70, "Combining and filtering colors...");
      let p = combineColourSources(h2, u, this.options.combineStrategy);
      p = this.converter.filterInsignificant(p, this.options.minAreaPct);
      p = this.converter.sortByImportance(p);
      if (p.length > this.options.maxColours) {
        p = p.slice(0, this.options.maxColours);
        s.push(`Truncated to ${this.options.maxColours} most significant colors`);
      }
      if (p.length === 0) {
        s.push("No colors extracted, using fallback");
        p = [{ id: generateColourId({ R: 128, G: 128, B: 128 }, "fallback"), rgb: { R: 128, G: 128, B: 128 }, lab: this.converter.rgbToLab({ R: 128, G: 128, B: 128 }), areaPct: 100, source: "raster" }];
      }
      const d = { palette: p, metadata: { filename: t, fileSize: e.byteLength, fileType: i.type, extractionTime: Date.now() - n, complexity: o, sources: a, totalColours: { pdf: h2.length || void 0, raster: u.length || void 0, combined: p.length } }, warnings: s.length > 0 ? s : void 0 };
      r?.updateProgress("caching", 90, "Caching extraction result...");
      l.set(c, d, 60 * 60 * 1e3);
      r?.complete();
      return d;
    } catch (e2) {
      throw new Error(`Palette extraction failed: ${e2.message}`);
    }
  }
};
function deltaE2000(e, t) {
  const { L: r, a: n, b: i } = e;
  const { L: o, a: s, b: a } = t;
  const l = 1;
  const c = 1;
  const h = 1;
  const u = Math.sqrt(n * n + i * i);
  const p = Math.sqrt(s * s + a * a);
  const d = (u + p) / 2;
  const m = 0.5 * (1 - Math.sqrt(Math.pow(d, 7) / (Math.pow(d, 7) + Math.pow(25, 7))));
  const g = (1 + m) * n;
  const b = (1 + m) * s;
  const w = Math.sqrt(g * g + i * i);
  const E = Math.sqrt(b * b + a * a);
  let v = Math.atan2(i, g) * 180 / Math.PI;
  if (v < 0) v += 360;
  let y = Math.atan2(a, b) * 180 / Math.PI;
  if (y < 0) y += 360;
  const x = o - r;
  const _ = E - w;
  let R;
  if (w * E === 0) {
    R = 0;
  } else {
    let e2 = y - v;
    if (Math.abs(e2) <= 180) {
      R = e2;
    } else if (e2 > 180) {
      R = e2 - 360;
    } else {
      R = e2 + 360;
    }
  }
  const P = 2 * Math.sqrt(w * E) * Math.sin(R * Math.PI / 360);
  const k = (r + o) / 2;
  const M = (w + E) / 2;
  let O;
  if (w * E === 0) {
    O = v + y;
  } else {
    const e2 = Math.abs(v - y);
    const t2 = v + y;
    if (e2 <= 180) {
      O = t2 / 2;
    } else if (t2 < 360) {
      O = (t2 + 360) / 2;
    } else {
      O = (t2 - 360) / 2;
    }
  }
  const I = 1 - 0.17 * Math.cos((O - 30) * Math.PI / 180) + 0.24 * Math.cos(2 * O * Math.PI / 180) + 0.32 * Math.cos((3 * O + 6) * Math.PI / 180) - 0.2 * Math.cos((4 * O - 63) * Math.PI / 180);
  const B = 30 * Math.exp(-Math.pow((O - 275) / 25, 2));
  const j = 2 * Math.sqrt(Math.pow(M, 7) / (Math.pow(M, 7) + Math.pow(25, 7)));
  const L = 1 + 0.015 * Math.pow(k - 50, 2) / Math.sqrt(20 + Math.pow(k - 50, 2));
  const C = 1 + 0.045 * M;
  const A = 1 + 0.015 * M * I;
  const $ = -Math.sin(2 * B * Math.PI / 180) * j;
  const S = Math.sqrt(Math.pow(x / (l * L), 2) + Math.pow(_ / (c * C), 2) + Math.pow(P / (h * A), 2) + $ * (_ / (c * C)) * (P / (h * A)));
  return S;
}
function deltaE76(e, t) {
  const r = t.L - e.L;
  const n = t.a - e.a;
  const i = t.b - e.b;
  return Math.sqrt(r * r + n * n + i * i);
}
function enhanceTPVColours(e) {
  return e.map(((e2) => ({ ...e2, linearRGB: sRGBToLinearRGB({ R: e2.R, G: e2.G, B: e2.B }) })));
}
function mixLinearRGB(e) {
  let t = 0, r = 0, n = 0;
  let i = 0;
  for (const { color: o, weight: s } of e) {
    t += o.R * s;
    r += o.G * s;
    n += o.B * s;
    i += s;
  }
  if (i === 0) {
    return { R: 0, G: 0, B: 0 };
  }
  return { R: t / i, G: r / i, B: n / i };
}
function normalizeWeights(e) {
  const t = e.reduce(((e2, t2) => e2 + t2), 0);
  if (t === 0) return e;
  return e.map(((e2) => e2 / t));
}
function gcd(e, t) {
  return t === 0 ? Math.abs(e) : gcd(t, e % t);
}
function gcdArray(e) {
  if (e.length === 0) return 1;
  if (e.length === 1) return Math.abs(e[0]);
  return e.reduce(((e2, t) => gcd(e2, t)), 0) || 1;
}
function argmax(e) {
  return e.reduce(((e2, t, r, n) => t > n[e2] ? r : e2), 0);
}
function clamp(e, t, r) {
  return Math.max(t, Math.min(r, e));
}
function getRecipeKey(e) {
  return Object.entries(e).filter((([, e2]) => e2 > 1e-3)).sort((([e2], [t]) => e2.localeCompare(t))).map((([e2, t]) => `${e2}:${Math.round(t * 1e3)}`)).join("|");
}
function canonicalParts(e, t) {
  const r = gcdArray(e);
  const n = e.map(((e2) => Math.max(1, Math.round(e2 / r))));
  const i = t.map(((e2, t2) => ({ c: e2, w: n[t2] }))).sort(((e2, t2) => e2.c.localeCompare(t2.c)));
  const o = i.map(((e2) => e2.c));
  const s = i.map(((e2) => e2.w));
  const a = s.reduce(((e2, t2) => e2 + t2), 0);
  const l = `parts:${o.map(((e2, t2) => `${e2}:${s[t2]}`)).join("|")}`;
  return { codes: o, parts: s, total: a, key: l };
}
function canonicalPerc(e) {
  const t = 2400;
  const r = e.map((({ code: e2, pct: r2 }) => ({ c: e2, n: Math.round(r2 * t) }))).filter(((e2) => e2.n > 0));
  const n = gcdArray(r.map(((e2) => e2.n)));
  const i = r.map(((e2) => ({ c: e2.c, n: Math.max(1, Math.round(e2.n / n)) })));
  i.sort(((e2, t2) => e2.c.localeCompare(t2.c)));
  const o = `pct:${i.map(((e2) => `${e2.c}:${e2.n}`)).join("|")}`;
  const s = i.reduce(((e2, t2) => e2 + t2.n), 0);
  const a = i.map(((e2) => e2.n / s));
  const l = i.map(((e2) => e2.c));
  return { codes: l, weights: a, key: o };
}
function colourBucketKey(e) {
  const quantize = (e2, t) => Math.round(e2 / t);
  return `lab:${quantize(e.L, 0.75)}:${quantize(e.a, 1)}:${quantize(e.b, 1)}`;
}
function better(e, t) {
  const r = e.mode === "parts" && e.parts ? e.parts.codes.length : e.components.length;
  const n = t.mode === "parts" && t.parts ? t.parts.codes.length : t.components.length;
  if (r !== n) return r < n;
  const i = e.mode === "parts" && e.parts ? e.parts.total : Infinity;
  const o = t.mode === "parts" && t.parts ? t.parts.total : Infinity;
  if (i !== o) return i < o;
  return e.deltaE < t.deltaE;
}
function rank(e) {
  const t = e.mode === "parts" && e.parts ? e.parts.codes.length : e.components.length;
  const r = e.mode === "parts" && e.parts ? e.parts.total : 9999;
  return t * 1e3 + r + e.deltaE;
}
function deduplicateRecipes(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r2 of e) {
    const e2 = r2.mode === "parts" && r2.parts ? canonicalParts(r2.parts.parts, r2.parts.codes).key : canonicalPerc(r2.components).key;
    const n2 = t.get(e2);
    if (!n2 || better(r2, n2)) {
      t.set(e2, r2);
    }
  }
  const r = /* @__PURE__ */ new Map();
  for (const e2 of Array.from(t.values())) {
    const t2 = colourBucketKey(e2.lab);
    const n2 = r.get(t2) || [];
    n2.push(e2);
    r.set(t2, n2);
  }
  const n = [];
  for (const e2 of Array.from(r.values())) {
    e2.sort(((e3, t2) => rank(e3) - rank(t2)));
    n.push(e2[0]);
  }
  return n.sort(((e2, t2) => rank(e2) - rank(t2)));
}
function mmrSelect(e, t, r = 0.75) {
  const n = [];
  const i = [...e];
  const distance = (e2, t2) => Math.hypot(e2.lab.L - t2.lab.L, e2.lab.a - t2.lab.a, e2.lab.b - t2.lab.b);
  while (n.length < t && i.length > 0) {
    let e2 = 0;
    let t2 = Infinity;
    for (let o = 0; o < i.length; o++) {
      const s = i[o];
      const a = s.deltaE;
      const l = n.length > 0 ? Math.min(...n.map(((e3) => distance(s, e3)))) : 1e3;
      const c = r * a - (1 - r) * l;
      if (c < t2) {
        t2 = c;
        e2 = o;
      }
    }
    n.push(i.splice(e2, 1)[0]);
  }
  return n;
}
function deduplicateRecipesLegacy(e, t = 50) {
  const r = /* @__PURE__ */ new Map();
  for (const t2 of e) {
    const e2 = getRecipeKey(t2.weights);
    const n = r.get(e2);
    if (!n || t2.deltaE < n.deltaE) {
      r.set(e2, t2);
    }
  }
  return Array.from(r.values()).sort(((e2, t2) => e2.deltaE - t2.deltaE)).slice(0, t);
}
function oppositionPenalty(e, t, r, n = { separation: 45, closeness: 12, penalty: 2 }) {
  const i = deltaE2000(e, t);
  const o = deltaE2000(e, r);
  const s = deltaE2000(t, r);
  if (i > n.separation && Math.min(o, s) > n.closeness) {
    return n.penalty;
  }
  return 0;
}
function sparsityBonus(e, t = { dominant: 0.7, adjuster: 0.25, dominantBonus: -0.3, adjusterBonus: -0.2 }) {
  const r = [...e].sort(((e2, t2) => t2 - e2));
  let n = 0;
  if (r[0] >= t.dominant) {
    n += t.dominantBonus;
  }
  if (r.length > 1 && r[1] <= t.adjuster) {
    n += t.adjusterBonus;
  }
  return n;
}
function anchorBonus(e, t, r, n, i = { topN: 6, minWeight: 0.6, bonus: -0.5 }) {
  const o = deltaE2000(e, t);
  const s = [...n].sort(((e2, t2) => e2 - t2));
  const a = o <= s[i.topN - 1];
  if (a && r >= i.minWeight) {
    return i.bonus;
  }
  return 0;
}
function evaluateBlendPenalties(e, t, r) {
  let n = 0;
  if (e.length >= 2) {
    for (let r2 = 0; r2 < e.length; r2++) {
      for (let i2 = r2 + 1; i2 < e.length; i2++) {
        const o = oppositionPenalty(e[r2].lab, e[i2].lab, t);
        n += e.length === 3 ? o * 0.5 : o;
      }
    }
  }
  const i = e.map(((e2) => e2.weight));
  n += sparsityBonus(i);
  if (e.length > 0) {
    const i2 = e.reduce(((e2, t2) => t2.weight > e2.weight ? t2 : e2));
    n += anchorBonus(i2.lab, t, i2.weight, r);
  }
  return n;
}
function snapToParts(e, t, r, n) {
  const { total: i, minPer: o, maxAttempts: s = 3 } = n;
  const a = Object.keys(e).filter(((t2) => e[t2] > 0));
  if (a.length === 0) return null;
  let l = a.map(((t2) => Math.max(o, Math.round(e[t2] * i))));
  let c = l.reduce(((e2, t2) => e2 + t2), 0);
  let h = 0;
  while (c !== i && h < s * 10) {
    const t2 = i - c;
    if (t2 > 0) {
      const t3 = l.map(((t4, r3) => e[a[r3]] * i - t4));
      const r2 = argmax(t3);
      l[r2]++;
    } else {
      const t3 = l.map(((t4, r3) => t4 - e[a[r3]] * i));
      const r2 = argmax(t3);
      if (l[r2] > o) {
        l[r2]--;
      }
    }
    c = l.reduce(((e2, t3) => e2 + t3), 0);
    h++;
  }
  if (c !== i) {
    return null;
  }
  let u = [...l];
  let p = evaluatePartsAccuracy(a, l, t, r);
  for (let e2 = 0; e2 < 5; e2++) {
    let e3 = false;
    for (let n2 = 0; n2 < a.length; n2++) {
      for (let i2 = 0; i2 < a.length; i2++) {
        if (n2 === i2 || l[n2] <= o) continue;
        const s2 = [...l];
        s2[n2]--;
        s2[i2]++;
        const c2 = evaluatePartsAccuracy(a, s2, t, r);
        if (c2 < p) {
          u = [...s2];
          p = c2;
          e3 = true;
        }
      }
    }
    if (!e3) break;
    l = [...u];
  }
  const d = gcdArray(u);
  const m = u.map(((e2) => e2 / d));
  const g = m.reduce(((e2, t2) => e2 + t2), 0);
  const b = normalizeWeights(m);
  const w = {};
  const E = {};
  a.forEach(((e2, t2) => {
    w[e2] = m[t2];
    E[e2] = b[t2];
  }));
  const v = a.map(((e2, r2) => {
    const n2 = t.find(((t2) => t2.code === e2));
    return { color: n2.linearRGB, weight: b[r2] };
  }));
  const y = mixLinearRGB(v);
  const x = linearRGBToSRGB(y);
  const _ = linearRGBToXYZ(y);
  const R = xyzToLab(_);
  return { parts: w, weights: E, total: g, deltaE: deltaE2000(r, R), lab: R, rgb: x };
}
function evaluatePartsAccuracy(e, t, r, n) {
  const i = normalizeWeights(t);
  const o = e.map(((e2, t2) => {
    const n2 = r.find(((t3) => t3.code === e2));
    return { color: n2.linearRGB, weight: i[t2] };
  }));
  const s = mixLinearRGB(o);
  const a = linearRGBToXYZ(s);
  const l = xyzToLab(a);
  return deltaE2000(n, l);
}
function findOptimalParts(e, t, r, n = { totals: [9, 12, 15, 18], minPer: 1, maxDeltaEPenalty: 0.8 }) {
  let i = null;
  for (const o of n.totals) {
    const s = snapToParts(e, t, r, { total: o, minPer: n.minPer });
    if (!s) continue;
    if (!i || s.deltaE < n.maxDeltaEPenalty || s.deltaE < i.deltaE) {
      i = s;
    }
    if (s.deltaE < n.maxDeltaEPenalty) {
      break;
    }
  }
  return i;
}
var SmartBlendSolver = class {
  constructor(e, t) {
    this.colours = e;
    this.constraints = t;
    this.twoWayCache = [];
    this.singleDistances = [];
    this.enhancedColours = enhanceTPVColours(e);
    this.precomputeTwoWayBlends();
  }
  getHueSector(e) {
    const t = Math.atan2(e.b, e.a) * 180 / Math.PI;
    const r = (t % 360 + 360) % 360;
    return Math.floor(r / 60);
  }
  toDedupeRecipe(e) {
    return { components: e.components, mode: this.constraints.mode, parts: e.parts && e.total ? { codes: Object.keys(e.parts), parts: Object.values(e.parts), total: e.total } : void 0, lab: e.lab, deltaE: e.deltaE, weights: e.weights };
  }
  fromDedupeRecipe(e) {
    const t = e.parts ? e.parts.codes.reduce(((t2, r2, n) => {
      t2[r2] = e.parts.parts[n];
      return t2;
    }), {}) : void 0;
    const r = this.calculateRGBFromWeights(e.weights);
    return { components: e.components, weights: e.weights, parts: t, total: e.parts?.total, lab: e.lab, rgb: r, deltaE: e.deltaE, baseDeltaE: e.deltaE, note: e.mode === "parts" ? "Parts blend" : "Percentage blend", reasoning: "Generated by enhanced solver" };
  }
  calculateRGBFromWeights(e) {
    const t = Object.entries(e).map((([e2, t2]) => {
      const r2 = this.enhancedColours.find(((t3) => t3.code === e2));
      if (!r2) {
        return { color: { R: 0.5, G: 0.5, B: 0.5 }, weight: t2 };
      }
      return { color: r2.linearRGB, weight: t2 };
    }));
    if (t.length === 0) {
      return { R: 128, G: 128, B: 128 };
    }
    const r = mixLinearRGB(t);
    return linearRGBToSRGB(r);
  }
  solve(e, t = 5) {
    const r = [];
    this.singleDistances = this.enhancedColours.map(((t2) => deltaE2000(e, { L: t2.L, a: t2.a, b: t2.b })));
    if (this.constraints.maxComponents >= 1) {
      const t2 = this.solveSingleComponents(e);
      r.push(...t2);
    }
    if (this.constraints.maxComponents >= 2) {
      const t2 = this.solveTwoWayBlends(e);
      r.push(...t2);
    }
    if (this.constraints.maxComponents >= 3) {
      const t2 = this.solveThreeWayBlendsWithHueDiversity(e);
      r.push(...t2);
    }
    if (r.length < t * 3 && this.constraints.maxComponents < 3) {
      const n2 = this.autoExpandSearch(e, t * 2);
      r.push(...n2);
    }
    const n = r.map(((t2) => this.convertToPartsIfNeeded(t2, e)));
    const i = n.map(((e2) => this.toDedupeRecipe(e2)));
    const o = deduplicateRecipes(i);
    const s = mmrSelect(o, t * 2, 0.75);
    const a = s.slice(0, t).map(((e2) => this.fromDedupeRecipe(e2)));
    return a;
  }
  autoExpandSearch(e, t) {
    const r = [];
    if (this.constraints.maxComponents < 3) {
      const n = this.constraints.maxComponents;
      this.constraints.maxComponents = 3;
      const i = this.solveThreeWayBlendsWithHueDiversity(e);
      r.push(...i.slice(0, Math.ceil(t / 2)));
      this.constraints.maxComponents = n;
    }
    if (r.length < t) {
      const n = this.constraints.minPct;
      const i = Math.max(0.05, this.constraints.minPct - 0.03);
      this.constraints.minPct = i;
      for (const n2 of this.twoWayCache.slice(0, t * 2)) {
        if (n2.p >= i && 1 - n2.p >= i) {
          n2.deltaE = deltaE2000(e, n2.lab);
          const i2 = this.enhancedColours[n2.i];
          const o = this.enhancedColours[n2.j];
          const s = evaluateBlendPenalties([{ lab: { L: i2.L, a: i2.a, b: i2.b }, weight: n2.p }, { lab: { L: o.L, a: o.a, b: o.b }, weight: 1 - n2.p }], e, this.singleDistances);
          n2.adjustedDeltaE = n2.deltaE + s;
          const a = n2.p >= 0.6 ? i2 : n2.p <= 0.4 ? o : null;
          const l = a ? `Relaxed ${a.name} with ${a === i2 ? o.name : i2.name} adjustment` : `Relaxed balanced mix of ${i2.name} and ${o.name}`;
          r.push({ components: [{ code: i2.code, pct: n2.p }, { code: o.code, pct: 1 - n2.p }], weights: { [i2.code]: n2.p, [o.code]: 1 - n2.p }, lab: n2.lab, rgb: linearRGBToSRGB(mixLinearRGB([{ color: i2.linearRGB, weight: n2.p }, { color: o.linearRGB, weight: 1 - n2.p }])), deltaE: n2.adjustedDeltaE, baseDeltaE: n2.deltaE, note: "2-component expanded blend", reasoning: l });
          if (r.length >= t) break;
        }
      }
      this.constraints.minPct = n;
    }
    return r.slice(0, t);
  }
  precomputeTwoWayBlends() {
    const { minPct: e } = this.constraints;
    const t = 1 - e;
    const r = Math.max(0.04, this.constraints.stepPct * 2);
    for (let n = 0; n < this.enhancedColours.length; n++) {
      for (let i = n + 1; i < this.enhancedColours.length; i++) {
        const o = this.enhancedColours[n];
        const s = this.enhancedColours[i];
        for (let a = e; a <= t; a += r) {
          const e2 = mixLinearRGB([{ color: o.linearRGB, weight: a }, { color: s.linearRGB, weight: 1 - a }]);
          const t2 = linearRGBToXYZ(e2);
          const r2 = xyzToLab(t2);
          this.twoWayCache.push({ i: n, j: i, p: a, lab: r2, deltaE: 0, adjustedDeltaE: 0 });
        }
      }
    }
  }
  refineTopCandidates(e, t, r = 20) {
    const n = [];
    const i = Math.min(0.01, this.constraints.stepPct);
    for (const o of e.slice(0, r)) {
      const e2 = this.enhancedColours[o.i];
      const r2 = this.enhancedColours[o.j];
      const s = 0.08;
      const a = Math.max(this.constraints.minPct, o.p - s);
      const l = Math.min(1 - this.constraints.minPct, o.p + s);
      let c = o;
      for (let n2 = a; n2 <= l; n2 += i) {
        const i2 = mixLinearRGB([{ color: e2.linearRGB, weight: n2 }, { color: r2.linearRGB, weight: 1 - n2 }]);
        const s2 = linearRGBToXYZ(i2);
        const a2 = xyzToLab(s2);
        const l2 = deltaE2000(t, a2);
        const h = evaluateBlendPenalties([{ lab: { L: e2.L, a: e2.a, b: e2.b }, weight: n2 }, { lab: { L: r2.L, a: r2.a, b: r2.b }, weight: 1 - n2 }], t, this.singleDistances);
        const u = l2 + h;
        if (u < c.adjustedDeltaE) {
          c = { i: o.i, j: o.j, p: n2, lab: a2, deltaE: l2, adjustedDeltaE: u };
        }
      }
      n.push(c);
    }
    return n.sort(((e2, t2) => e2.adjustedDeltaE - t2.adjustedDeltaE));
  }
  solveSingleComponents(e) {
    const t = [];
    for (let r = 0; r < this.enhancedColours.length; r++) {
      const n = this.enhancedColours[r];
      const i = { L: n.L, a: n.a, b: n.b };
      const o = deltaE2000(e, i);
      t.push({ components: [{ code: n.code, pct: 1 }], weights: { [n.code]: 1 }, lab: i, rgb: { R: n.R, G: n.G, B: n.B }, deltaE: o, baseDeltaE: o, note: "Single component", reasoning: `Direct match with ${n.name}` });
    }
    return t.sort(((e2, t2) => e2.deltaE - t2.deltaE)).slice(0, 2);
  }
  solveTwoWayBlends(e) {
    for (const t2 of this.twoWayCache) {
      t2.deltaE = deltaE2000(e, t2.lab);
      const r2 = this.enhancedColours[t2.i];
      const n = this.enhancedColours[t2.j];
      const i = evaluateBlendPenalties([{ lab: { L: r2.L, a: r2.a, b: r2.b }, weight: t2.p }, { lab: { L: n.L, a: n.a, b: n.b }, weight: 1 - t2.p }], e, this.singleDistances);
      t2.adjustedDeltaE = t2.deltaE + i;
    }
    const t = this.twoWayCache.slice().sort(((e2, t2) => e2.adjustedDeltaE - t2.adjustedDeltaE)).slice(0, 30);
    const r = this.refineTopCandidates(t, e, 15);
    return r.slice(0, 10).map(((e2) => {
      const t2 = this.enhancedColours[e2.i];
      const r2 = this.enhancedColours[e2.j];
      const n = e2.p >= 0.6 ? t2 : e2.p <= 0.4 ? r2 : null;
      const i = n ? `Anchor ${n.name} with ${n === t2 ? r2.name : t2.name} adjustment` : `Balanced mix of ${t2.name} and ${r2.name}`;
      return { components: [{ code: t2.code, pct: e2.p }, { code: r2.code, pct: 1 - e2.p }], weights: { [t2.code]: e2.p, [r2.code]: 1 - e2.p }, lab: e2.lab, rgb: linearRGBToSRGB(mixLinearRGB([{ color: t2.linearRGB, weight: e2.p }, { color: r2.linearRGB, weight: 1 - e2.p }])), deltaE: e2.adjustedDeltaE, baseDeltaE: e2.deltaE, note: "2-component blend", reasoning: i };
    }));
  }
  solveThreeWayBlendsWithHueDiversity(e) {
    const t = [];
    const r = /* @__PURE__ */ new Map();
    for (const t2 of this.twoWayCache) {
      t2.deltaE = deltaE2000(e, t2.lab);
      const n2 = this.enhancedColours[t2.i];
      const i = this.enhancedColours[t2.j];
      const o = evaluateBlendPenalties([{ lab: { L: n2.L, a: n2.a, b: n2.b }, weight: t2.p }, { lab: { L: i.L, a: i.a, b: i.b }, weight: 1 - t2.p }], e, this.singleDistances);
      t2.adjustedDeltaE = t2.deltaE + o;
      const s = this.getHueSector(t2.lab);
      const a = r.get(s) || [];
      a.push(t2);
      r.set(s, a);
    }
    const n = [];
    for (const e2 of Array.from(r.values())) {
      e2.sort(((e3, t2) => e3.adjustedDeltaE - t2.adjustedDeltaE));
      n.push(...e2.slice(0, 4));
    }
    if (n.length < 24) {
      const e2 = Array.from(r.values()).flat();
      e2.sort(((e3, t3) => e3.adjustedDeltaE - t3.adjustedDeltaE));
      const t2 = 30 - n.length;
      n.push(...e2.slice(0, t2));
    }
    return this.generateThreeWayFromSeeds(n, e);
  }
  generateThreeWayFromSeeds(e, t) {
    const r = [];
    for (const n of e) {
      const e2 = [n.i, n.j];
      for (let i = 0; i < this.enhancedColours.length; i++) {
        if (e2.includes(i)) continue;
        const o = this.enhancedColours[i];
        for (let e3 = this.constraints.minPct; e3 <= 1 - 2 * this.constraints.minPct; e3 += this.constraints.stepPct * 2) {
          const i2 = 1 - e3;
          const s = Math.max(this.constraints.minPct, n.p * i2);
          const a = i2 - s;
          if (a < this.constraints.minPct) continue;
          const l = normalizeWeights([s, a, e3]);
          const [c, h, u] = l;
          const p = mixLinearRGB([{ color: this.enhancedColours[n.i].linearRGB, weight: c }, { color: this.enhancedColours[n.j].linearRGB, weight: h }, { color: o.linearRGB, weight: u }]);
          const d = linearRGBToXYZ(p);
          const m = xyzToLab(d);
          const g = deltaE2000(t, m);
          const b = evaluateBlendPenalties([{ lab: { L: this.enhancedColours[n.i].L, a: this.enhancedColours[n.i].a, b: this.enhancedColours[n.i].b }, weight: c }, { lab: { L: this.enhancedColours[n.j].L, a: this.enhancedColours[n.j].a, b: this.enhancedColours[n.j].b }, weight: h }, { lab: { L: o.L, a: o.a, b: o.b }, weight: u }], t, this.singleDistances);
          const w = g + b;
          r.push({ components: [{ code: this.enhancedColours[n.i].code, pct: c }, { code: this.enhancedColours[n.j].code, pct: h }, { code: o.code, pct: u }], weights: { [this.enhancedColours[n.i].code]: c, [this.enhancedColours[n.j].code]: h, [o.code]: u }, lab: m, rgb: linearRGBToSRGB(p), deltaE: w, baseDeltaE: g, note: "3-component blend", reasoning: "Refined blend with three components" });
        }
      }
    }
    return r.sort(((e2, t2) => e2.deltaE - t2.deltaE)).slice(0, 5);
  }
  convertToPartsIfNeeded(e, t) {
    if (this.constraints.mode !== "parts" || !this.constraints.parts?.enabled) {
      return e;
    }
    const r = findOptimalParts(e.weights, this.enhancedColours, t, { totals: this.constraints.parts.total ? [this.constraints.parts.total] : [9, 12, 15], minPer: this.constraints.parts.minPer || 1, maxDeltaEPenalty: 0.8 });
    if (r) {
      return { ...e, parts: r.parts, total: r.total, weights: r.weights, lab: r.lab, rgb: r.rgb, deltaE: r.deltaE, note: e.note + ` (${r.total} parts total)`, reasoning: e.reasoning + ` - Snapped to ${r.total} parts with \u0394E ${(r.deltaE - e.baseDeltaE).toFixed(2)} penalty` };
    }
    return e;
  }
};
var rosehill_tpv_21_colours_namespaceObject = JSON.parse('[{"code":"RH01","name":"Standard Red","hex":"#B71E2D","R":183,"G":30,"B":45,"L":39.4,"a":58.5,"b":29},{"code":"RH02","name":"Bright Red","hex":"#E31D25","R":227,"G":29,"B":37,"L":47.4,"a":70.1,"b":44},{"code":"RH10","name":"Standard Green","hex":"#006B3F","R":0,"G":107,"B":63,"L":40.5,"a":-42.2,"b":17.9},{"code":"RH11","name":"Bright Green","hex":"#4BAA34","R":75,"G":170,"B":52,"L":62.1,"a":-47.7,"b":47.2},{"code":"RH12","name":"Dark Green","hex":"#006747","R":0,"G":103,"B":71,"L":39.6,"a":-38.3,"b":13.1},{"code":"RH20","name":"Standard Blue","hex":"#1B4F9C","R":27,"G":79,"B":156,"L":36.4,"a":14.2,"b":-46.7},{"code":"RH21","name":"Purple","hex":"#662D91","R":102,"G":45,"B":145,"L":31.5,"a":41.9,"b":-40.9},{"code":"RH22","name":"Light Blue","hex":"#0091D7","R":0,"G":145,"B":215,"L":55.3,"a":-19.1,"b":-37.3},{"code":"RH23","name":"Azure","hex":"#0076B6","R":0,"G":118,"B":182,"L":47.7,"a":-4.8,"b":-34.8},{"code":"RH26","name":"Turquoise","hex":"#00A499","R":0,"G":164,"B":153,"L":58.8,"a":-38.4,"b":-3},{"code":"RH30","name":"Standard Beige","hex":"#D4B585","R":212,"G":181,"B":133,"L":75.2,"a":3.8,"b":24.8},{"code":"RH31","name":"Cream","hex":"#F2E6C8","R":242,"G":230,"B":200,"L":91.8,"a":-0.5,"b":12.5},{"code":"RH32","name":"Brown","hex":"#754C29","R":117,"G":76,"B":41,"L":40,"a":15.9,"b":27.1},{"code":"RH90","name":"Funky Pink","hex":"#e8457e","R":232,"G":69,"B":126,"L":55,"a":66.1,"b":4.9},{"code":"RH40","name":"Mustard Yellow","hex":"#C6972D","R":198,"G":151,"B":45,"L":66,"a":8.4,"b":56.3},{"code":"RH41","name":"Bright Yellow","hex":"#FFD100","R":255,"G":209,"B":0,"L":86.9,"a":-1,"b":90.6},{"code":"RH50","name":"Orange","hex":"#F47920","R":244,"G":121,"B":32,"L":63.2,"a":49.8,"b":60.2},{"code":"RH60","name":"Dark Grey","hex":"#4D4F53","R":77,"G":79,"B":83,"L":34.1,"a":-0.4,"b":-2.4},{"code":"RH61","name":"Light Grey","hex":"#A7A8AA","R":167,"G":168,"B":170,"L":69,"a":-0.5,"b":-1},{"code":"RH65","name":"Pale Grey","hex":"#DCDDDE","R":220,"G":221,"B":222,"L":87.6,"a":-0.2,"b":-0.7},{"code":"RH70","name":"Black","hex":"#101820","R":16,"G":24,"B":32,"L":9.1,"a":-0.3,"b":-6.3}]');
async function handler(e, t) {
  if (e.method !== "POST") {
    return t.status(405).json({ success: false, error: "Method not allowed. Use POST." });
  }
  try {
    const { svg_url: r, job_id: n, max_colors: i = 8, max_components: o = 2 } = e.body;
    if (!r) {
      return t.status(400).json({ success: false, error: "Missing required field: svg_url" });
    }
    console.log("[BLEND-RECIPES] Starting color extraction for job:", n);
    console.log("[BLEND-RECIPES] SVG URL:", r);
    console.log("[BLEND-RECIPES] Max colors:", i, "Max components:", o);
    const s = Date.now();
    console.log("[BLEND-RECIPES] Fetching SVG from URL...");
    const a = await fetch(r);
    if (!a.ok) {
      throw new Error(`Failed to fetch SVG: ${a.status} ${a.statusText}`);
    }
    const l = await a.arrayBuffer();
    console.log(`[BLEND-RECIPES] SVG fetched (${l.byteLength} bytes)`);
    console.log("[BLEND-RECIPES] Extracting colors...");
    const c = new PaletteExtractor({ maxColours: i, minAreaPct: 1, rasterOptions: { resampleSize: 400, iterations: 15 } });
    const h = await c.extract(l, "design.svg");
    const u = Date.now() - s;
    console.log(`[BLEND-RECIPES] Extracted ${h.palette.length} colors in ${u}ms`);
    if (h.palette.length === 0) {
      return t.status(200).json({ success: true, colors: [], recipes: [], message: "No significant colors found in SVG (all colors below 1% coverage)" });
    }
    console.log("[BLEND-RECIPES] Initializing blend solver...");
    const p = new SmartBlendSolver(rosehill_tpv_21_colours_namespaceObject, { maxComponents: o, stepPct: 0.04, minPct: 0.1, mode: "parts", parts: { enabled: true, total: 12, minPer: 1 }, preferAnchor: true });
    console.log("[BLEND-RECIPES] Generating blend recipes...");
    const d = [];
    const m = Date.now();
    for (let e2 = 0; e2 < h.palette.length; e2++) {
      const t2 = h.palette[e2];
      console.log(`[BLEND-RECIPES]   Color ${e2 + 1}/${h.palette.length}: RGB(${t2.rgb.R}, ${t2.rgb.G}, ${t2.rgb.B}) - ${t2.areaPct.toFixed(1)}%`);
      const r2 = p.solve(t2.lab, 3);
      const n2 = r2.map(((e3) => ({ parts: e3.parts || {}, total: e3.total || 0, deltaE: e3.deltaE, quality: e3.deltaE < 1 ? "Excellent" : e3.deltaE < 2 ? "Good" : "Fair", resultRgb: e3.rgb, components: e3.components.map(((t3) => ({ code: t3.code, name: rosehill_tpv_21_colours_namespaceObject.find(((e4) => e4.code === t3.code))?.name || t3.code, weight: t3.pct, parts: e3.parts ? e3.parts[t3.code] : null }))) })));
      console.log(`[BLEND-RECIPES]     Best \u0394E: ${r2[0].deltaE.toFixed(2)} (${n2[0].quality})`);
      d.push({ targetColor: { hex: blend_recipes_rgbToHex(t2.rgb), rgb: t2.rgb, lab: t2.lab, areaPct: t2.areaPct }, blends: n2 });
    }
    const g = Date.now() - m;
    const b = Date.now() - s;
    console.log(`[BLEND-RECIPES] Generated ${d.length} recipe sets in ${g}ms (total: ${b}ms)`);
    const w = h.palette.map(((e2) => ({ hex: blend_recipes_rgbToHex(e2.rgb), rgb: e2.rgb, lab: e2.lab, areaPct: e2.areaPct })));
    return t.status(200).json({ success: true, colors: w, recipes: d, metadata: { colorsExtracted: h.palette.length, extractionTime: u, solveTime: g, totalTime: b, maxComponents: o } });
  } catch (e2) {
    console.error("[BLEND-RECIPES] Error:", e2);
    console.error(e2.stack);
    return t.status(500).json({ success: false, error: e2.message || "Internal server error", stack: process.env.NODE_ENV === "development" ? e2.stack : void 0 });
  }
}
function blend_recipes_rgbToHex(e) {
  const toHex = (e2) => Math.round(e2).toString(16).padStart(2, "0");
  return `#${toHex(e.R)}${toHex(e.G)}${toHex(e.B)}`;
}
var config = { api: { bodyParser: { sizeLimit: "2mb" }, responseLimit: "4mb", externalResolver: false }, maxDuration: 60 };
var __webpack_exports__config = __nested_webpack_exports__.$;
var __webpack_exports__default = __nested_webpack_exports__.A;
var __webpack_exports__config = __webpack_exports__.$;
var __webpack_exports__default = __webpack_exports__.A;
export {
  __webpack_exports__config as config,
  __webpack_exports__default as default
};
/*!
  Copyright 2013 Lovell Fuller and others.
  SPDX-License-Identifier: Apache-2.0
*/
