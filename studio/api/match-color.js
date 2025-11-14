// TPV Studio API - Match Color Endpoint
// Built from TypeScript sources with esbuild

// api/_utils/colour/convert.ts
var D65_REFERENCE = { Xn: 0.95047, Yn: 1, Zn: 1.08883 };
var RGB_TO_XYZ_MATRIX = [
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.072175],
  [0.0193339, 0.119192, 0.9503041]
];
var XYZ_TO_RGB_MATRIX = [
  [3.2404542, -1.5371385, -0.4985314],
  [-0.969266, 1.8760108, 0.041556],
  [0.0556434, -0.2040259, 1.0572252]
];
function gammaExpand(value) {
  return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}
function gammaCompress(value) {
  return value <= 31308e-7 ? value * 12.92 : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
}
function sRGBToLinearRGB(rgb) {
  return {
    R: gammaExpand(rgb.R / 255),
    G: gammaExpand(rgb.G / 255),
    B: gammaExpand(rgb.B / 255)
  };
}
function linearRGBToSRGB(linear) {
  return {
    R: Math.round(gammaCompress(linear.R) * 255),
    G: Math.round(gammaCompress(linear.G) * 255),
    B: Math.round(gammaCompress(linear.B) * 255)
  };
}
function linearRGBToXYZ(rgb) {
  const [row0, row1, row2] = RGB_TO_XYZ_MATRIX;
  return {
    X: row0[0] * rgb.R + row0[1] * rgb.G + row0[2] * rgb.B,
    Y: row1[0] * rgb.R + row1[1] * rgb.G + row1[2] * rgb.B,
    Z: row2[0] * rgb.R + row2[1] * rgb.G + row2[2] * rgb.B
  };
}
function xyzToLinearRGB(xyz) {
  const [row0, row1, row2] = XYZ_TO_RGB_MATRIX;
  return {
    R: row0[0] * xyz.X + row0[1] * xyz.Y + row0[2] * xyz.Z,
    G: row1[0] * xyz.X + row1[1] * xyz.Y + row1[2] * xyz.Z,
    B: row2[0] * xyz.X + row2[1] * xyz.Y + row2[2] * xyz.Z
  };
}
function f(t) {
  const delta = 6 / 29;
  return t > Math.pow(delta, 3) ? Math.pow(t, 1 / 3) : t / (3 * delta * delta) + 4 / 29;
}
function fInv(t) {
  const delta = 6 / 29;
  return t > delta ? Math.pow(t, 3) : 3 * delta * delta * (t - 4 / 29);
}
function xyzToLab(xyz) {
  const fx = f(xyz.X / D65_REFERENCE.Xn);
  const fy = f(xyz.Y / D65_REFERENCE.Yn);
  const fz = f(xyz.Z / D65_REFERENCE.Zn);
  return {
    L: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz)
  };
}
function labToXYZ(lab) {
  const fy = (lab.L + 16) / 116;
  const fx = lab.a / 500 + fy;
  const fz = fy - lab.b / 200;
  return {
    X: D65_REFERENCE.Xn * fInv(fx),
    Y: D65_REFERENCE.Yn * fInv(fy),
    Z: D65_REFERENCE.Zn * fInv(fz)
  };
}
function sRGBToLab(rgb) {
  const linear = sRGBToLinearRGB(rgb);
  const xyz = linearRGBToXYZ(linear);
  return xyzToLab(xyz);
}
function labToSRGB(lab) {
  const xyz = labToXYZ(lab);
  const linear = xyzToLinearRGB(xyz);
  return linearRGBToSRGB(linear);
}

// api/_utils/colour/deltaE.ts
function deltaE2000(lab1, lab2) {
  const { L: L1, a: a1, b: b1 } = lab1;
  const { L: L2, a: a2, b: b2 } = lab2;
  const kL = 1;
  const kC = 1;
  const kH = 1;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const Cbar = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cbar, 7) / (Math.pow(Cbar, 7) + Math.pow(25, 7))));
  const a1Prime = (1 + G) * a1;
  const a2Prime = (1 + G) * a2;
  const C1Prime = Math.sqrt(a1Prime * a1Prime + b1 * b1);
  const C2Prime = Math.sqrt(a2Prime * a2Prime + b2 * b2);
  let h1Prime = Math.atan2(b1, a1Prime) * 180 / Math.PI;
  if (h1Prime < 0) h1Prime += 360;
  let h2Prime = Math.atan2(b2, a2Prime) * 180 / Math.PI;
  if (h2Prime < 0) h2Prime += 360;
  const deltaLPrime = L2 - L1;
  const deltaCPrime = C2Prime - C1Prime;
  let deltahPrime;
  if (C1Prime * C2Prime === 0) {
    deltahPrime = 0;
  } else {
    let diff = h2Prime - h1Prime;
    if (Math.abs(diff) <= 180) {
      deltahPrime = diff;
    } else if (diff > 180) {
      deltahPrime = diff - 360;
    } else {
      deltahPrime = diff + 360;
    }
  }
  const deltaHPrime = 2 * Math.sqrt(C1Prime * C2Prime) * Math.sin(deltahPrime * Math.PI / 360);
  const LPrimeBar = (L1 + L2) / 2;
  const CPrimeBar = (C1Prime + C2Prime) / 2;
  let hPrimeBar;
  if (C1Prime * C2Prime === 0) {
    hPrimeBar = h1Prime + h2Prime;
  } else {
    const diff = Math.abs(h1Prime - h2Prime);
    const sum = h1Prime + h2Prime;
    if (diff <= 180) {
      hPrimeBar = sum / 2;
    } else if (sum < 360) {
      hPrimeBar = (sum + 360) / 2;
    } else {
      hPrimeBar = (sum - 360) / 2;
    }
  }
  const T = 1 - 0.17 * Math.cos((hPrimeBar - 30) * Math.PI / 180) + 0.24 * Math.cos(2 * hPrimeBar * Math.PI / 180) + 0.32 * Math.cos((3 * hPrimeBar + 6) * Math.PI / 180) - 0.2 * Math.cos((4 * hPrimeBar - 63) * Math.PI / 180);
  const deltaTheta = 30 * Math.exp(-Math.pow((hPrimeBar - 275) / 25, 2));
  const RC = 2 * Math.sqrt(Math.pow(CPrimeBar, 7) / (Math.pow(CPrimeBar, 7) + Math.pow(25, 7)));
  const SL = 1 + 0.015 * Math.pow(LPrimeBar - 50, 2) / Math.sqrt(20 + Math.pow(LPrimeBar - 50, 2));
  const SC = 1 + 0.045 * CPrimeBar;
  const SH = 1 + 0.015 * CPrimeBar * T;
  const RT = -Math.sin(2 * deltaTheta * Math.PI / 180) * RC;
  const deltaE = Math.sqrt(
    Math.pow(deltaLPrime / (kL * SL), 2) + Math.pow(deltaCPrime / (kC * SC), 2) + Math.pow(deltaHPrime / (kH * SH), 2) + RT * (deltaCPrime / (kC * SC)) * (deltaHPrime / (kH * SH))
  );
  return deltaE;
}

// api/_utils/colour/smartUtils.ts
function enhanceTPVColours(colours) {
  return colours.map((colour) => ({
    ...colour,
    linearRGB: sRGBToLinearRGB({
      R: colour.R,
      G: colour.G,
      B: colour.B
    })
  }));
}
function mixLinearRGB(components) {
  let R = 0, G = 0, B = 0;
  let totalWeight = 0;
  for (const { color, weight } of components) {
    R += color.R * weight;
    G += color.G * weight;
    B += color.B * weight;
    totalWeight += weight;
  }
  if (totalWeight === 0) {
    return { R: 0, G: 0, B: 0 };
  }
  return {
    R: R / totalWeight,
    G: G / totalWeight,
    B: B / totalWeight
  };
}
function normalizeWeights(weights) {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0) return weights;
  return weights.map((w) => w / sum);
}
function gcd(a, b) {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}
function gcdArray(numbers) {
  if (numbers.length === 0) return 1;
  if (numbers.length === 1) return Math.abs(numbers[0]);
  return numbers.reduce((result, num) => gcd(result, num), 0) || 1;
}
function argmax(arr) {
  return arr.reduce(
    (maxIdx, current, idx, array) => current > array[maxIdx] ? idx : maxIdx,
    0
  );
}
function canonicalParts(parts, codes) {
  const g = gcdArray(parts);
  const reducedParts = parts.map((x) => Math.max(1, Math.round(x / g)));
  const zipped = codes.map((c, i) => ({ c, w: reducedParts[i] })).sort((a, b) => a.c.localeCompare(b.c));
  const sortedCodes = zipped.map((z) => z.c);
  const sortedParts = zipped.map((z) => z.w);
  const total = sortedParts.reduce((a, b) => a + b, 0);
  const key = `parts:${sortedCodes.map((c, i) => `${c}:${sortedParts[i]}`).join("|")}`;
  return { codes: sortedCodes, parts: sortedParts, total, key };
}
function canonicalPerc(components) {
  const DEN = 2400;
  const zipped = components.map(({ code, pct }) => ({
    c: code,
    n: Math.round(pct * DEN)
  })).filter((z) => z.n > 0);
  const g = gcdArray(zipped.map((z) => z.n));
  const reduced = zipped.map((z) => ({
    c: z.c,
    n: Math.max(1, Math.round(z.n / g))
  }));
  reduced.sort((a, b) => a.c.localeCompare(b.c));
  const key = `pct:${reduced.map((z) => `${z.c}:${z.n}`).join("|")}`;
  const totalN = reduced.reduce((a, b) => a + b.n, 0);
  const weights = reduced.map((z) => z.n / totalN);
  const codes = reduced.map((z) => z.c);
  return { codes, weights, key };
}
function colourBucketKey(lab) {
  const quantize = (x, step) => Math.round(x / step);
  return `lab:${quantize(lab.L, 0.75)}:${quantize(lab.a, 1)}:${quantize(lab.b, 1)}`;
}
function better(a, b) {
  const compA = a.mode === "parts" && a.parts ? a.parts.codes.length : a.components.length;
  const compB = b.mode === "parts" && b.parts ? b.parts.codes.length : b.components.length;
  if (compA !== compB) return compA < compB;
  const totA = a.mode === "parts" && a.parts ? a.parts.total : Infinity;
  const totB = b.mode === "parts" && b.parts ? b.parts.total : Infinity;
  if (totA !== totB) return totA < totB;
  return a.deltaE < b.deltaE;
}
function rank(r) {
  const comp = r.mode === "parts" && r.parts ? r.parts.codes.length : r.components.length;
  const tot = r.mode === "parts" && r.parts ? r.parts.total : 9999;
  return comp * 1e3 + tot + r.deltaE;
}
function deduplicateRecipes(recipes) {
  const byComp = /* @__PURE__ */ new Map();
  for (const r of recipes) {
    const compKey = r.mode === "parts" && r.parts ? canonicalParts(r.parts.parts, r.parts.codes).key : canonicalPerc(r.components).key;
    const cur = byComp.get(compKey);
    if (!cur || better(r, cur)) {
      byComp.set(compKey, r);
    }
  }
  const byColour = /* @__PURE__ */ new Map();
  for (const r of Array.from(byComp.values())) {
    const colorKey = colourBucketKey(r.lab);
    const arr = byColour.get(colorKey) || [];
    arr.push(r);
    byColour.set(colorKey, arr);
  }
  const out = [];
  for (const group of Array.from(byColour.values())) {
    group.sort((a, b) => rank(a) - rank(b));
    out.push(group[0]);
  }
  return out.sort((a, b) => rank(a) - rank(b));
}
function mmrSelect(candidates, k, lambda = 0.75) {
  const selected = [];
  const remaining = [...candidates];
  const distance = (x, y) => {
    return Math.hypot(
      x.lab.L - y.lab.L,
      x.lab.a - y.lab.a,
      x.lab.b - y.lab.b
    );
  };
  while (selected.length < k && remaining.length > 0) {
    let bestIdx = 0;
    let bestScore = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      const relevance = candidate.deltaE;
      const diversity = selected.length > 0 ? Math.min(...selected.map((s) => distance(candidate, s))) : 1e3;
      const score = lambda * relevance - (1 - lambda) * diversity;
      if (score < bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }
    selected.push(remaining.splice(bestIdx, 1)[0]);
  }
  return selected;
}

// api/_utils/colour/penalties.ts
function oppositionPenalty(colorA, colorB, target, thresholds = { separation: 45, closeness: 12, penalty: 2 }) {
  const separationAB = deltaE2000(colorA, colorB);
  const closenessA = deltaE2000(colorA, target);
  const closenessB = deltaE2000(colorB, target);
  if (separationAB > thresholds.separation && Math.min(closenessA, closenessB) > thresholds.closeness) {
    return thresholds.penalty;
  }
  return 0;
}
function sparsityBonus(weights, thresholds = { dominant: 0.7, adjuster: 0.25, dominantBonus: -0.3, adjusterBonus: -0.2 }) {
  const sortedWeights = [...weights].sort((a, b) => b - a);
  let bonus = 0;
  if (sortedWeights[0] >= thresholds.dominant) {
    bonus += thresholds.dominantBonus;
  }
  if (sortedWeights.length > 1 && sortedWeights[1] <= thresholds.adjuster) {
    bonus += thresholds.adjusterBonus;
  }
  return bonus;
}
function anchorBonus(mainComponentLab, target, mainWeight, allSingleDistances, thresholds = { topN: 6, minWeight: 0.6, bonus: -0.5 }) {
  const mainDistance = deltaE2000(mainComponentLab, target);
  const sortedDistances = [...allSingleDistances].sort((a, b) => a - b);
  const isTopAnchor = mainDistance <= sortedDistances[thresholds.topN - 1];
  if (isTopAnchor && mainWeight >= thresholds.minWeight) {
    return thresholds.bonus;
  }
  return 0;
}
function evaluateBlendPenalties(components, target, allSingleDistances) {
  let totalPenalty = 0;
  if (components.length >= 2) {
    for (let i = 0; i < components.length; i++) {
      for (let j = i + 1; j < components.length; j++) {
        const penalty = oppositionPenalty(
          components[i].lab,
          components[j].lab,
          target
        );
        totalPenalty += components.length === 3 ? penalty * 0.5 : penalty;
      }
    }
  }
  const weights = components.map((c) => c.weight);
  totalPenalty += sparsityBonus(weights);
  if (components.length > 0) {
    const mainComponent = components.reduce(
      (prev, current) => current.weight > prev.weight ? current : prev
    );
    totalPenalty += anchorBonus(
      mainComponent.lab,
      target,
      mainComponent.weight,
      allSingleDistances
    );
  }
  return totalPenalty;
}

// api/_utils/colour/smartParts.ts
function snapToParts(continuousWeights, colours, targetLab, config) {
  const { total: T, minPer, maxAttempts = 3 } = config;
  const codes = Object.keys(continuousWeights).filter((code) => continuousWeights[code] > 0);
  if (codes.length === 0) return null;
  let parts = codes.map(
    (code) => Math.max(minPer, Math.round(continuousWeights[code] * T))
  );
  let currentSum = parts.reduce((a, b) => a + b, 0);
  let attempts = 0;
  while (currentSum !== T && attempts < maxAttempts * 10) {
    const diff = T - currentSum;
    if (diff > 0) {
      const deficits = parts.map(
        (p, i) => continuousWeights[codes[i]] * T - p
      );
      const maxDeficitIdx = argmax(deficits);
      parts[maxDeficitIdx]++;
    } else {
      const surpluses = parts.map(
        (p, i) => p - continuousWeights[codes[i]] * T
      );
      const maxSurplusIdx = argmax(surpluses);
      if (parts[maxSurplusIdx] > minPer) {
        parts[maxSurplusIdx]--;
      }
    }
    currentSum = parts.reduce((a, b) => a + b, 0);
    attempts++;
  }
  if (currentSum !== T) {
    return null;
  }
  let bestParts = [...parts];
  let bestDeltaE = evaluatePartsAccuracy(codes, parts, colours, targetLab);
  for (let iteration = 0; iteration < 5; iteration++) {
    let improved = false;
    for (let i = 0; i < codes.length; i++) {
      for (let j = 0; j < codes.length; j++) {
        if (i === j || parts[i] <= minPer) continue;
        const testParts = [...parts];
        testParts[i]--;
        testParts[j]++;
        const testDeltaE = evaluatePartsAccuracy(codes, testParts, colours, targetLab);
        if (testDeltaE < bestDeltaE) {
          bestParts = [...testParts];
          bestDeltaE = testDeltaE;
          improved = true;
        }
      }
    }
    if (!improved) break;
    parts = [...bestParts];
  }
  const g = gcdArray(bestParts);
  const reducedParts = bestParts.map((p) => p / g);
  const reducedTotal = reducedParts.reduce((a, b) => a + b, 0);
  const finalWeights = normalizeWeights(reducedParts);
  const partsRecord = {};
  const weightsRecord = {};
  codes.forEach((code, i) => {
    partsRecord[code] = reducedParts[i];
    weightsRecord[code] = finalWeights[i];
  });
  const components = codes.map((code, i) => {
    const colour = colours.find((c) => c.code === code);
    return { color: colour.linearRGB, weight: finalWeights[i] };
  });
  const mixedLinear = mixLinearRGB(components);
  const mixedSRGB = linearRGBToSRGB(mixedLinear);
  const mixedXYZ = linearRGBToXYZ(mixedLinear);
  const mixedLab = xyzToLab(mixedXYZ);
  return {
    parts: partsRecord,
    weights: weightsRecord,
    total: reducedTotal,
    deltaE: deltaE2000(targetLab, mixedLab),
    lab: mixedLab,
    rgb: mixedSRGB
  };
}
function evaluatePartsAccuracy(codes, parts, colours, targetLab) {
  const weights = normalizeWeights(parts);
  const components = codes.map((code, i) => {
    const colour = colours.find((c) => c.code === code);
    return { color: colour.linearRGB, weight: weights[i] };
  });
  const mixedLinear = mixLinearRGB(components);
  const mixedXYZ = linearRGBToXYZ(mixedLinear);
  const mixedLab = xyzToLab(mixedXYZ);
  return deltaE2000(targetLab, mixedLab);
}
function findOptimalParts(continuousWeights, colours, targetLab, options = {
  totals: [9, 12, 15, 18],
  minPer: 1,
  maxDeltaEPenalty: 0.8
}) {
  let bestResult = null;
  for (const total of options.totals) {
    const result = snapToParts(
      continuousWeights,
      colours,
      targetLab,
      { total, minPer: options.minPer }
    );
    if (!result) continue;
    if (!bestResult || result.deltaE < options.maxDeltaEPenalty || result.deltaE < bestResult.deltaE) {
      bestResult = result;
    }
    if (result.deltaE < options.maxDeltaEPenalty) {
      break;
    }
  }
  return bestResult;
}

// api/_utils/colour/smartSolver.ts
var SmartBlendSolver = class {
  constructor(colours, constraints) {
    this.colours = colours;
    this.constraints = constraints;
    this.twoWayCache = [];
    this.singleDistances = [];
    this.enhancedColours = enhanceTPVColours(colours);
    this.precomputeTwoWayBlends();
  }
  /**
   * Get hue sector (0-5) for a Lab color in a*-b* plane
   */
  getHueSector(lab) {
    const angle = Math.atan2(lab.b, lab.a) * 180 / Math.PI;
    const normalizedAngle = (angle % 360 + 360) % 360;
    return Math.floor(normalizedAngle / 60);
  }
  /**
   * Convert SmartRecipe to DedupeRecipe format
   */
  toDedupeRecipe(recipe) {
    return {
      components: recipe.components,
      mode: this.constraints.mode,
      parts: recipe.parts && recipe.total ? {
        codes: Object.keys(recipe.parts),
        parts: Object.values(recipe.parts),
        total: recipe.total
      } : void 0,
      lab: recipe.lab,
      deltaE: recipe.deltaE,
      weights: recipe.weights
    };
  }
  /**
   * Convert DedupeRecipe back to SmartRecipe format
   */
  fromDedupeRecipe(dedupeRecipe) {
    const partsObj = dedupeRecipe.parts ? dedupeRecipe.parts.codes.reduce((obj, code, i) => {
      obj[code] = dedupeRecipe.parts.parts[i];
      return obj;
    }, {}) : void 0;
    const rgb = this.calculateRGBFromWeights(dedupeRecipe.weights);
    return {
      components: dedupeRecipe.components,
      weights: dedupeRecipe.weights,
      parts: partsObj,
      total: dedupeRecipe.parts?.total,
      lab: dedupeRecipe.lab,
      rgb,
      deltaE: dedupeRecipe.deltaE,
      baseDeltaE: dedupeRecipe.deltaE,
      // Approximation
      note: dedupeRecipe.mode === "parts" ? "Parts blend" : "Percentage blend",
      reasoning: "Generated by enhanced solver"
    };
  }
  /**
   * Calculate RGB from weights using the color mixing system
   */
  calculateRGBFromWeights(weights) {
    const components = Object.entries(weights).map(([code, weight]) => {
      const colour = this.enhancedColours.find((c) => c.code === code);
      if (!colour) {
        return { color: { R: 0.5, G: 0.5, B: 0.5 }, weight };
      }
      return { color: colour.linearRGB, weight };
    });
    if (components.length === 0) {
      return { R: 128, G: 128, B: 128 };
    }
    const mixedLinear = mixLinearRGB(components);
    return linearRGBToSRGB(mixedLinear);
  }
  /**
   * Solve for best blends matching target color with enhanced deduplication
   */
  solve(targetLab, maxResults = 5) {
    const results = [];
    this.singleDistances = this.enhancedColours.map(
      (colour) => deltaE2000(targetLab, { L: colour.L, a: colour.a, b: colour.b })
    );
    if (this.constraints.maxComponents >= 1) {
      const singleResults = this.solveSingleComponents(targetLab);
      results.push(...singleResults);
    }
    if (this.constraints.maxComponents >= 2) {
      const twoWayResults = this.solveTwoWayBlends(targetLab);
      results.push(...twoWayResults);
    }
    if (this.constraints.maxComponents >= 3) {
      const threeWayResults = this.solveThreeWayBlendsWithHueDiversity(targetLab);
      results.push(...threeWayResults);
    }
    if (results.length < maxResults * 3 && this.constraints.maxComponents < 3) {
      const expandedResults = this.autoExpandSearch(targetLab, maxResults * 2);
      results.push(...expandedResults);
    }
    const partsConvertedResults = results.map((recipe) => this.convertToPartsIfNeeded(recipe, targetLab));
    const dedupeRecipes = partsConvertedResults.map((r) => this.toDedupeRecipe(r));
    const uniqueRecipes = deduplicateRecipes(dedupeRecipes);
    const diverseRecipes = mmrSelect(uniqueRecipes, maxResults * 2, 0.75);
    const finalResults = diverseRecipes.slice(0, maxResults).map((dedupeRecipe) => {
      return this.fromDedupeRecipe(dedupeRecipe);
    });
    return finalResults;
  }
  /**
   * Auto-expand search constraints when results are limited (simplified approach)
   */
  autoExpandSearch(targetLab, neededCount) {
    const expandedResults = [];
    if (this.constraints.maxComponents < 3) {
      const savedMaxComponents = this.constraints.maxComponents;
      this.constraints.maxComponents = 3;
      const threeWayResults = this.solveThreeWayBlendsWithHueDiversity(targetLab);
      expandedResults.push(...threeWayResults.slice(0, Math.ceil(neededCount / 2)));
      this.constraints.maxComponents = savedMaxComponents;
    }
    if (expandedResults.length < neededCount) {
      const savedMinPct = this.constraints.minPct;
      const relaxedMinPct = Math.max(0.05, this.constraints.minPct - 0.03);
      this.constraints.minPct = relaxedMinPct;
      for (const blend of this.twoWayCache.slice(0, neededCount * 2)) {
        if (blend.p >= relaxedMinPct && 1 - blend.p >= relaxedMinPct) {
          blend.deltaE = deltaE2000(targetLab, blend.lab);
          const c1 = this.enhancedColours[blend.i];
          const c2 = this.enhancedColours[blend.j];
          const penalty = evaluateBlendPenalties(
            [
              { lab: { L: c1.L, a: c1.a, b: c1.b }, weight: blend.p },
              { lab: { L: c2.L, a: c2.a, b: c2.b }, weight: 1 - blend.p }
            ],
            targetLab,
            this.singleDistances
          );
          blend.adjustedDeltaE = blend.deltaE + penalty;
          const dominant = blend.p >= 0.6 ? c1 : blend.p <= 0.4 ? c2 : null;
          const reasoning = dominant ? `Relaxed ${dominant.name} with ${dominant === c1 ? c2.name : c1.name} adjustment` : `Relaxed balanced mix of ${c1.name} and ${c2.name}`;
          expandedResults.push({
            components: [
              { code: c1.code, pct: blend.p },
              { code: c2.code, pct: 1 - blend.p }
            ],
            weights: { [c1.code]: blend.p, [c2.code]: 1 - blend.p },
            lab: blend.lab,
            rgb: linearRGBToSRGB(mixLinearRGB([
              { color: c1.linearRGB, weight: blend.p },
              { color: c2.linearRGB, weight: 1 - blend.p }
            ])),
            deltaE: blend.adjustedDeltaE,
            baseDeltaE: blend.deltaE,
            note: "2-component expanded blend",
            reasoning
          });
          if (expandedResults.length >= neededCount) break;
        }
      }
      this.constraints.minPct = savedMinPct;
    }
    return expandedResults.slice(0, neededCount);
  }
  /**
   * Precompute all 2-way blends with multi-step strategy
   */
  precomputeTwoWayBlends() {
    const { minPct } = this.constraints;
    const maxPct = 1 - minPct;
    const coarseStep = Math.max(0.04, this.constraints.stepPct * 2);
    for (let i = 0; i < this.enhancedColours.length; i++) {
      for (let j = i + 1; j < this.enhancedColours.length; j++) {
        const c1 = this.enhancedColours[i];
        const c2 = this.enhancedColours[j];
        for (let p = minPct; p <= maxPct; p += coarseStep) {
          const mixedLinear = mixLinearRGB([
            { color: c1.linearRGB, weight: p },
            { color: c2.linearRGB, weight: 1 - p }
          ]);
          const mixedXYZ = linearRGBToXYZ(mixedLinear);
          const lab = xyzToLab(mixedXYZ);
          this.twoWayCache.push({
            i,
            j,
            p,
            lab,
            deltaE: 0,
            // Will be calculated per target
            adjustedDeltaE: 0
          });
        }
      }
    }
  }
  /**
   * Refine top candidates with fine step size
   */
  refineTopCandidates(candidates, targetLab, count = 20) {
    const refined = [];
    const fineStep = Math.min(0.01, this.constraints.stepPct);
    for (const candidate of candidates.slice(0, count)) {
      const c1 = this.enhancedColours[candidate.i];
      const c2 = this.enhancedColours[candidate.j];
      const searchRange = 0.08;
      const minP = Math.max(this.constraints.minPct, candidate.p - searchRange);
      const maxP = Math.min(1 - this.constraints.minPct, candidate.p + searchRange);
      let bestRefined = candidate;
      for (let p = minP; p <= maxP; p += fineStep) {
        const mixedLinear = mixLinearRGB([
          { color: c1.linearRGB, weight: p },
          { color: c2.linearRGB, weight: 1 - p }
        ]);
        const mixedXYZ = linearRGBToXYZ(mixedLinear);
        const lab = xyzToLab(mixedXYZ);
        const deltaE = deltaE2000(targetLab, lab);
        const penalty = evaluateBlendPenalties(
          [
            { lab: { L: c1.L, a: c1.a, b: c1.b }, weight: p },
            { lab: { L: c2.L, a: c2.a, b: c2.b }, weight: 1 - p }
          ],
          targetLab,
          this.singleDistances
        );
        const adjustedDeltaE = deltaE + penalty;
        if (adjustedDeltaE < bestRefined.adjustedDeltaE) {
          bestRefined = {
            i: candidate.i,
            j: candidate.j,
            p,
            lab,
            deltaE,
            adjustedDeltaE
          };
        }
      }
      refined.push(bestRefined);
    }
    return refined.sort((a, b) => a.adjustedDeltaE - b.adjustedDeltaE);
  }
  /**
   * Find best single component matches
   */
  solveSingleComponents(targetLab) {
    const results = [];
    for (let i = 0; i < this.enhancedColours.length; i++) {
      const colour = this.enhancedColours[i];
      const colourLab = { L: colour.L, a: colour.a, b: colour.b };
      const deltaE = deltaE2000(targetLab, colourLab);
      results.push({
        components: [{ code: colour.code, pct: 1 }],
        weights: { [colour.code]: 1 },
        lab: colourLab,
        rgb: { R: colour.R, G: colour.G, B: colour.B },
        deltaE,
        baseDeltaE: deltaE,
        note: "Single component",
        reasoning: `Direct match with ${colour.name}`
      });
    }
    return results.sort((a, b) => a.deltaE - b.deltaE).slice(0, 2);
  }
  /**
   * Find best two-way blends with smart penalties and refinement
   */
  solveTwoWayBlends(targetLab) {
    for (const blend of this.twoWayCache) {
      blend.deltaE = deltaE2000(targetLab, blend.lab);
      const c1 = this.enhancedColours[blend.i];
      const c2 = this.enhancedColours[blend.j];
      const penalty = evaluateBlendPenalties(
        [
          { lab: { L: c1.L, a: c1.a, b: c1.b }, weight: blend.p },
          { lab: { L: c2.L, a: c2.a, b: c2.b }, weight: 1 - blend.p }
        ],
        targetLab,
        this.singleDistances
      );
      blend.adjustedDeltaE = blend.deltaE + penalty;
    }
    const coarseCandidates = this.twoWayCache.slice().sort((a, b) => a.adjustedDeltaE - b.adjustedDeltaE).slice(0, 30);
    const refined = this.refineTopCandidates(coarseCandidates, targetLab, 15);
    return refined.slice(0, 10).map((blend) => {
      const c1 = this.enhancedColours[blend.i];
      const c2 = this.enhancedColours[blend.j];
      const dominant = blend.p >= 0.6 ? c1 : blend.p <= 0.4 ? c2 : null;
      const reasoning = dominant ? `Anchor ${dominant.name} with ${dominant === c1 ? c2.name : c1.name} adjustment` : `Balanced mix of ${c1.name} and ${c2.name}`;
      return {
        components: [
          { code: c1.code, pct: blend.p },
          { code: c2.code, pct: 1 - blend.p }
        ],
        weights: { [c1.code]: blend.p, [c2.code]: 1 - blend.p },
        lab: blend.lab,
        rgb: linearRGBToSRGB(mixLinearRGB([
          { color: c1.linearRGB, weight: blend.p },
          { color: c2.linearRGB, weight: 1 - blend.p }
        ])),
        deltaE: blend.adjustedDeltaE,
        baseDeltaE: blend.deltaE,
        note: "2-component blend",
        reasoning
      };
    });
  }
  /**
   * Find best three-way blends with hue-diverse seeding
   */
  solveThreeWayBlendsWithHueDiversity(targetLab) {
    const results = [];
    const sectorBlends = /* @__PURE__ */ new Map();
    for (const blend of this.twoWayCache) {
      blend.deltaE = deltaE2000(targetLab, blend.lab);
      const c1 = this.enhancedColours[blend.i];
      const c2 = this.enhancedColours[blend.j];
      const penalty = evaluateBlendPenalties(
        [
          { lab: { L: c1.L, a: c1.a, b: c1.b }, weight: blend.p },
          { lab: { L: c2.L, a: c2.a, b: c2.b }, weight: 1 - blend.p }
        ],
        targetLab,
        this.singleDistances
      );
      blend.adjustedDeltaE = blend.deltaE + penalty;
      const sector = this.getHueSector(blend.lab);
      const sectorList = sectorBlends.get(sector) || [];
      sectorList.push(blend);
      sectorBlends.set(sector, sectorList);
    }
    const seedBlends = [];
    for (const sectorList of Array.from(sectorBlends.values())) {
      sectorList.sort((a, b) => a.adjustedDeltaE - b.adjustedDeltaE);
      seedBlends.push(...sectorList.slice(0, 4));
    }
    if (seedBlends.length < 24) {
      const allBlends = Array.from(sectorBlends.values()).flat();
      allBlends.sort((a, b) => a.adjustedDeltaE - b.adjustedDeltaE);
      const needed = 30 - seedBlends.length;
      seedBlends.push(...allBlends.slice(0, needed));
    }
    return this.generateThreeWayFromSeeds(seedBlends, targetLab);
  }
  /**
   * Generate three-way blends from seed two-way blends
   */
  generateThreeWayFromSeeds(seeds, targetLab) {
    const results = [];
    for (const seed of seeds) {
      const usedIndices = [seed.i, seed.j];
      for (let k = 0; k < this.enhancedColours.length; k++) {
        if (usedIndices.includes(k)) continue;
        const c3 = this.enhancedColours[k];
        for (let p3 = this.constraints.minPct; p3 <= 1 - 2 * this.constraints.minPct; p3 += this.constraints.stepPct * 2) {
          const remainingWeight = 1 - p3;
          const p1 = Math.max(this.constraints.minPct, seed.p * remainingWeight);
          const p2 = remainingWeight - p1;
          if (p2 < this.constraints.minPct) continue;
          const weights = normalizeWeights([p1, p2, p3]);
          const [w1, w2, w3] = weights;
          const mixedLinear = mixLinearRGB([
            { color: this.enhancedColours[seed.i].linearRGB, weight: w1 },
            { color: this.enhancedColours[seed.j].linearRGB, weight: w2 },
            { color: c3.linearRGB, weight: w3 }
          ]);
          const mixedXYZ = linearRGBToXYZ(mixedLinear);
          const lab = xyzToLab(mixedXYZ);
          const baseDeltaE = deltaE2000(targetLab, lab);
          const penalty = evaluateBlendPenalties(
            [
              { lab: { L: this.enhancedColours[seed.i].L, a: this.enhancedColours[seed.i].a, b: this.enhancedColours[seed.i].b }, weight: w1 },
              { lab: { L: this.enhancedColours[seed.j].L, a: this.enhancedColours[seed.j].a, b: this.enhancedColours[seed.j].b }, weight: w2 },
              { lab: { L: c3.L, a: c3.a, b: c3.b }, weight: w3 }
            ],
            targetLab,
            this.singleDistances
          );
          const adjustedDeltaE = baseDeltaE + penalty;
          results.push({
            components: [
              { code: this.enhancedColours[seed.i].code, pct: w1 },
              { code: this.enhancedColours[seed.j].code, pct: w2 },
              { code: c3.code, pct: w3 }
            ],
            weights: {
              [this.enhancedColours[seed.i].code]: w1,
              [this.enhancedColours[seed.j].code]: w2,
              [c3.code]: w3
            },
            lab,
            rgb: linearRGBToSRGB(mixedLinear),
            deltaE: adjustedDeltaE,
            baseDeltaE,
            note: "3-component blend",
            reasoning: "Refined blend with three components"
          });
        }
      }
    }
    return results.sort((a, b) => a.deltaE - b.deltaE).slice(0, 5);
  }
  /**
   * Convert recipe to parts format if requested
   */
  convertToPartsIfNeeded(recipe, targetLab) {
    if (this.constraints.mode !== "parts" || !this.constraints.parts?.enabled) {
      return recipe;
    }
    const partsResult = findOptimalParts(
      recipe.weights,
      this.enhancedColours,
      targetLab,
      {
        totals: this.constraints.parts.total ? [this.constraints.parts.total] : [9, 12, 15],
        minPer: this.constraints.parts.minPer || 1,
        maxDeltaEPenalty: 0.8
      }
    );
    if (partsResult) {
      return {
        ...recipe,
        parts: partsResult.parts,
        total: partsResult.total,
        weights: partsResult.weights,
        // Updated normalized weights
        lab: partsResult.lab,
        rgb: partsResult.rgb,
        deltaE: partsResult.deltaE,
        note: recipe.note + ` (${partsResult.total} parts total)`,
        reasoning: recipe.reasoning + ` - Snapped to ${partsResult.total} parts with \u0394E ${(partsResult.deltaE - recipe.baseDeltaE).toFixed(2)} penalty`
      };
    }
    return recipe;
  }
};

// api/_utils/colour/blendColor.ts
function calculateBlendColor(components, tpvColors) {
  if (components.length === 0) {
    throw new Error("Cannot calculate blend color: no components provided");
  }
  const totalWeight = components.reduce((sum, c) => sum + c.pct, 0);
  if (totalWeight === 0) {
    throw new Error("Cannot calculate blend color: total weight is zero");
  }
  const normalizedComponents = components.map((c) => ({
    code: c.code,
    pct: c.pct / totalWeight
  }));
  let weightedL = 0;
  let weightedA = 0;
  let weightedB = 0;
  for (const component of normalizedComponents) {
    const tpvColor = tpvColors.find((tc) => tc.code === component.code);
    if (!tpvColor) {
      console.warn(`TPV color not found for code: ${component.code}, using fallback`);
      continue;
    }
    const lab = {
      L: tpvColor.L,
      a: tpvColor.a,
      b: tpvColor.b
    };
    weightedL += lab.L * component.pct;
    weightedA += lab.a * component.pct;
    weightedB += lab.b * component.pct;
  }
  const blendLab = {
    L: weightedL,
    a: weightedA,
    b: weightedB
  };
  const blendRgb = labToSRGB(blendLab);
  const blendHex = rgbToHex(blendRgb);
  return {
    hex: blendHex,
    rgb: blendRgb,
    lab: blendLab
  };
}
function rgbToHex(rgb) {
  const toHex = (n) => {
    const clamped = Math.round(Math.max(0, Math.min(255, n)));
    return clamped.toString(16).padStart(2, "0");
  };
  return `#${toHex(rgb.R)}${toHex(rgb.G)}${toHex(rgb.B)}`;
}

// api/_utils/extraction/utils.ts
var ColourSpaceConverter = class {
  constructor(options = {}) {
    this.options = {
      whitePoint: options.whitePoint ?? "D65",
      gamma: options.gamma ?? 2.4
    };
  }
  rgbToLab(rgb) {
    return sRGBToLab(rgb);
  }
  rgbToHex(rgb) {
    const toHex = (n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0");
    return `#${toHex(rgb.R)}${toHex(rgb.G)}${toHex(rgb.B)}`;
  }
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      throw new Error(`Invalid hex color: ${hex}`);
    }
    return {
      R: parseInt(result[1], 16),
      G: parseInt(result[2], 16),
      B: parseInt(result[3], 16)
    };
  }
  /**
   * Calculate perceptual color difference using CIEDE2000
   */
  calculateDeltaE(lab1, lab2) {
    const dL = lab1.L - lab2.L;
    const da = lab1.a - lab2.a;
    const db = lab1.b - lab2.b;
    return Math.sqrt(dL * dL + da * da + db * db);
  }
  /**
   * Remove similar colors within tolerance
   */
  deduplicate(colours, tolerance = 5) {
    const result = [];
    for (const color of colours) {
      const isSimilar = result.some(
        (existing) => this.calculateDeltaE(existing.lab, color.lab) < tolerance
      );
      if (!isSimilar) {
        result.push(color);
      } else {
        const similar = result.find(
          (existing) => this.calculateDeltaE(existing.lab, color.lab) < tolerance
        );
        if (similar) {
          similar.areaPct += color.areaPct;
          if (similar.pageIds && color.pageIds) {
            similar.pageIds = [.../* @__PURE__ */ new Set([...similar.pageIds, ...color.pageIds])];
          }
        }
      }
    }
    return result;
  }
  /**
   * Normalize area percentages to sum to 100%
   */
  normalizeAreas(colours) {
    const totalArea = colours.reduce((sum, c) => sum + c.areaPct, 0);
    if (totalArea === 0) {
      return colours;
    }
    return colours.map((color) => ({
      ...color,
      areaPct: color.areaPct / totalArea * 100
    }));
  }
  /**
   * Filter out colors that are too small or too similar to white/black
   */
  filterInsignificant(colours, minAreaPct = 1, excludeNearWhite = true, excludeNearBlack = true) {
    return colours.filter((color) => {
      if (color.areaPct < minAreaPct) {
        return false;
      }
      if (excludeNearWhite && color.lab.L > 95) {
        return false;
      }
      if (excludeNearBlack && color.lab.L < 5) {
        return false;
      }
      return true;
    });
  }
  /**
   * Sort colors by perceptual importance (area + distinctiveness)
   */
  sortByImportance(colours) {
    return colours.sort((a, b) => {
      if (Math.abs(a.areaPct - b.areaPct) > 1) {
        return b.areaPct - a.areaPct;
      }
      const aSaturation = Math.sqrt(a.lab.a * a.lab.a + a.lab.b * a.lab.b);
      const bSaturation = Math.sqrt(b.lab.a * b.lab.a + b.lab.b * b.lab.b);
      return bSaturation - aSaturation;
    });
  }
};

// api/_utils/data/rosehill_tpv_21_colours.json
var rosehill_tpv_21_colours_default = [
  {
    code: "RH01",
    name: "Standard Red",
    hex: "#B71E2D",
    R: 183,
    G: 30,
    B: 45,
    L: 39.4,
    a: 58.5,
    b: 29
  },
  {
    code: "RH02",
    name: "Bright Red",
    hex: "#E31D25",
    R: 227,
    G: 29,
    B: 37,
    L: 47.4,
    a: 70.1,
    b: 44
  },
  {
    code: "RH10",
    name: "Standard Green",
    hex: "#006B3F",
    R: 0,
    G: 107,
    B: 63,
    L: 40.5,
    a: -42.2,
    b: 17.9
  },
  {
    code: "RH11",
    name: "Bright Green",
    hex: "#4BAA34",
    R: 75,
    G: 170,
    B: 52,
    L: 62.1,
    a: -47.7,
    b: 47.2
  },
  {
    code: "RH12",
    name: "Dark Green",
    hex: "#006747",
    R: 0,
    G: 103,
    B: 71,
    L: 39.6,
    a: -38.3,
    b: 13.1
  },
  {
    code: "RH20",
    name: "Standard Blue",
    hex: "#1B4F9C",
    R: 27,
    G: 79,
    B: 156,
    L: 36.4,
    a: 14.2,
    b: -46.7
  },
  {
    code: "RH21",
    name: "Purple",
    hex: "#662D91",
    R: 102,
    G: 45,
    B: 145,
    L: 31.5,
    a: 41.9,
    b: -40.9
  },
  {
    code: "RH22",
    name: "Light Blue",
    hex: "#0091D7",
    R: 0,
    G: 145,
    B: 215,
    L: 55.3,
    a: -19.1,
    b: -37.3
  },
  {
    code: "RH23",
    name: "Azure",
    hex: "#0076B6",
    R: 0,
    G: 118,
    B: 182,
    L: 47.7,
    a: -4.8,
    b: -34.8
  },
  {
    code: "RH26",
    name: "Turquoise",
    hex: "#00A499",
    R: 0,
    G: 164,
    B: 153,
    L: 58.8,
    a: -38.4,
    b: -3
  },
  {
    code: "RH30",
    name: "Standard Beige",
    hex: "#D4B585",
    R: 212,
    G: 181,
    B: 133,
    L: 75.2,
    a: 3.8,
    b: 24.8
  },
  {
    code: "RH31",
    name: "Cream",
    hex: "#F2E6C8",
    R: 242,
    G: 230,
    B: 200,
    L: 91.8,
    a: -0.5,
    b: 12.5
  },
  {
    code: "RH32",
    name: "Brown",
    hex: "#754C29",
    R: 117,
    G: 76,
    B: 41,
    L: 40,
    a: 15.9,
    b: 27.1
  },
  {
    code: "RH90",
    name: "Funky Pink",
    hex: "#e8457e",
    R: 232,
    G: 69,
    B: 126,
    L: 55,
    a: 66.1,
    b: 4.9
  },
  {
    code: "RH40",
    name: "Mustard Yellow",
    hex: "#C6972D",
    R: 198,
    G: 151,
    B: 45,
    L: 66,
    a: 8.4,
    b: 56.3
  },
  {
    code: "RH41",
    name: "Bright Yellow",
    hex: "#FFD100",
    R: 255,
    G: 209,
    B: 0,
    L: 86.9,
    a: -1,
    b: 90.6
  },
  {
    code: "RH50",
    name: "Orange",
    hex: "#F47920",
    R: 244,
    G: 121,
    B: 32,
    L: 63.2,
    a: 49.8,
    b: 60.2
  },
  {
    code: "RH60",
    name: "Dark Grey",
    hex: "#4D4F53",
    R: 77,
    G: 79,
    B: 83,
    L: 34.1,
    a: -0.4,
    b: -2.4
  },
  {
    code: "RH61",
    name: "Light Grey",
    hex: "#A7A8AA",
    R: 167,
    G: 168,
    B: 170,
    L: 69,
    a: -0.5,
    b: -1
  },
  {
    code: "RH65",
    name: "Pale Grey",
    hex: "#DCDDDE",
    R: 220,
    G: 221,
    B: 222,
    L: 87.6,
    a: -0.2,
    b: -0.7
  },
  {
    code: "RH70",
    name: "Black",
    hex: "#101820",
    R: 16,
    G: 24,
    B: 32,
    L: 9.1,
    a: -0.3,
    b: -6.3
  }
];

// api/match-color.ts
async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST."
    });
  }
  try {
    const { hex, max_components = 2 } = req.body;
    if (!hex) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: hex"
      });
    }
    const hexPattern = /^#?[0-9A-Fa-f]{6}$/;
    if (!hexPattern.test(hex)) {
      return res.status(400).json({
        success: false,
        error: "Invalid hex color format. Expected #RRGGBB or RRGGBB"
      });
    }
    console.log("[MATCH-COLOR] Matching color:", hex, "with max components:", max_components);
    const startTime = Date.now();
    const cleanHex = hex.replace("#", "");
    const rgb = {
      R: parseInt(cleanHex.substring(0, 2), 16),
      G: parseInt(cleanHex.substring(2, 4), 16),
      B: parseInt(cleanHex.substring(4, 6), 16)
    };
    const converter = new ColourSpaceConverter();
    const lab = converter.rgbToLab(rgb);
    console.log(`[MATCH-COLOR] Target RGB(${rgb.R}, ${rgb.G}, ${rgb.B}) -> LAB(${lab.L.toFixed(1)}, ${lab.a.toFixed(1)}, ${lab.b.toFixed(1)})`);
    const solver = new SmartBlendSolver(rosehill_tpv_21_colours_default, {
      maxComponents: max_components,
      stepPct: 0.04,
      minPct: 0.1,
      mode: "parts",
      parts: {
        enabled: true,
        total: 12,
        minPer: 1
      },
      preferAnchor: true
    });
    const colorRecipes = solver.solve(lab, 5);
    console.log(`[MATCH-COLOR] Found ${colorRecipes.length} recipes`);
    const recipes = colorRecipes.map((recipe, idx) => {
      const blendComponents = recipe.components.map((c) => ({
        code: c.code,
        pct: c.pct
      }));
      const blendColor = calculateBlendColor(blendComponents, rosehill_tpv_21_colours_default);
      const parts = recipe.parts || {};
      const totalParts = recipe.total || 0;
      const components = recipe.components.map((comp) => {
        const tpvColor = rosehill_tpv_21_colours_default.find((tc) => tc.code === comp.code);
        return {
          code: comp.code,
          name: tpvColor?.name || comp.code,
          weight: comp.pct,
          parts: parts[comp.code] || null
        };
      });
      return {
        id: `recipe_${idx + 1}`,
        deltaE: recipe.deltaE,
        quality: recipe.deltaE < 1 ? "Excellent" : recipe.deltaE < 2 ? "Good" : "Fair",
        components,
        parts: totalParts > 0 ? parts : null,
        total: totalParts > 0 ? totalParts : null,
        resultRgb: recipe.rgb,
        blendColor: {
          hex: blendColor.hex,
          rgb: blendColor.rgb,
          lab: blendColor.lab
        }
      };
    });
    const solveTime = Date.now() - startTime;
    console.log(`[MATCH-COLOR] Completed in ${solveTime}ms, best \u0394E: ${recipes[0].deltaE.toFixed(2)}`);
    return res.status(200).json({
      success: true,
      targetColor: {
        hex: `#${cleanHex}`,
        rgb,
        lab
      },
      recipes,
      metadata: {
        solveTime,
        recipesFound: recipes.length
      }
    });
  } catch (err) {
    console.error("[MATCH-COLOR] Error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error"
    });
  }
}
export {
  handler as default
};
