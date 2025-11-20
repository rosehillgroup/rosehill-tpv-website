import { RGB, Lab, linearRGBToSRGB, linearRGBToXYZ, xyzToLab } from './convert.js';
import { deltaE2000 } from './deltaE.js';
import { EnhancedTPVColour, mixLinearRGB, normalizeWeights, gcdArray, argmax, clamp } from './smartUtils.js';

export interface PartsResult {
  parts: Record<string, number>;
  weights: Record<string, number>;
  total: number;
  deltaE: number; // ΔE from continuous solution
  lab: Lab;
  rgb: RGB;
}

export interface PartsConfig {
  total: number;
  minPer: number;
  maxPer?: number;
  maxAttempts?: number;
}

/**
 * Snap continuous percentage weights to integer parts with minimal ΔE loss
 */
export function snapToParts(
  continuousWeights: Record<string, number>,
  colours: EnhancedTPVColour[],
  targetLab: Lab,
  config: PartsConfig
): PartsResult | null {
  const { total: T, minPer, maxPer, maxAttempts = 3 } = config;

  const codes = Object.keys(continuousWeights).filter(code => continuousWeights[code] > 0);
  if (codes.length === 0) return null;

  // Initial parts calculation
  let parts = codes.map(code => {
    const calculated = Math.max(minPer, Math.round(continuousWeights[code] * T));
    return maxPer ? Math.min(maxPer, calculated) : calculated;
  });
  
  // Ensure sum equals target total
  let currentSum = parts.reduce((a, b) => a + b, 0);
  let attempts = 0;
  
  while (currentSum !== T && attempts < maxAttempts * 10) {
    const diff = T - currentSum;
    
    if (diff > 0) {
      // Need to add parts - find component with largest deficit that hasn't hit maxPer
      const deficits = parts.map((p, i) => {
        if (maxPer && p >= maxPer) return -Infinity; // Can't add more
        return (continuousWeights[codes[i]] * T) - p;
      });
      const maxDeficitIdx = argmax(deficits);
      if (deficits[maxDeficitIdx] > -Infinity) {
        parts[maxDeficitIdx]++;
      } else {
        break; // Can't balance - all components at maxPer
      }
    } else {
      // Need to remove parts - find component with largest surplus
      const surpluses = parts.map((p, i) => 
        p - (continuousWeights[codes[i]] * T)
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
    return null; // Failed to balance
  }
  
  // Local hill-climbing refinement (±1 part adjustments)
  let bestParts = [...parts];
  let bestDeltaE = evaluatePartsAccuracy(codes, parts, colours, targetLab);
  
  for (let iteration = 0; iteration < 5; iteration++) {
    let improved = false;
    
    for (let i = 0; i < codes.length; i++) {
      for (let j = 0; j < codes.length; j++) {
        if (i === j || parts[i] <= minPer) continue;
        if (maxPer && parts[j] >= maxPer) continue; // Can't add to j

        // Try moving 1 part from i to j
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
  
  // Reduce to simplest form using GCD
  const g = gcdArray(bestParts);
  const reducedParts = bestParts.map(p => p / g);
  const reducedTotal = reducedParts.reduce((a, b) => a + b, 0);
  
  // Calculate final weights and color values
  const finalWeights = normalizeWeights(reducedParts);
  const partsRecord: Record<string, number> = {};
  const weightsRecord: Record<string, number> = {};
  
  codes.forEach((code, i) => {
    partsRecord[code] = reducedParts[i];
    weightsRecord[code] = finalWeights[i];
  });
  
  // Calculate final lab and rgb values
  const components = codes.map((code, i) => {
    const colour = colours.find(c => c.code === code)!;
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

/**
 * Evaluate ΔE accuracy of a parts recipe against target
 */
function evaluatePartsAccuracy(
  codes: string[],
  parts: number[],
  colours: EnhancedTPVColour[],
  targetLab: Lab
): number {
  const weights = normalizeWeights(parts);
  
  const components = codes.map((code, i) => {
    const colour = colours.find(c => c.code === code)!;
    return { color: colour.linearRGB, weight: weights[i] };
  });
  
  const mixedLinear = mixLinearRGB(components);
  const mixedXYZ = linearRGBToXYZ(mixedLinear);
  const mixedLab = xyzToLab(mixedXYZ);
  
  return deltaE2000(targetLab, mixedLab);
}

/**
 * Try multiple parts totals to find the best balance of simplicity and accuracy
 */
export function findOptimalParts(
  continuousWeights: Record<string, number>,
  colours: EnhancedTPVColour[],
  targetLab: Lab,
  options = {
    totals: [9, 12, 15, 18],
    minPer: 1,
    maxDeltaEPenalty: 0.8
  }
): PartsResult | null {
  let bestResult: PartsResult | null = null;
  
  for (const total of options.totals) {
    const result = snapToParts(
      continuousWeights,
      colours,
      targetLab,
      { total, minPer: options.minPer }
    );
    
    if (!result) continue;
    
    // Accept if ΔE penalty is acceptable, or if it's the best we've found
    if (!bestResult || 
        result.deltaE < options.maxDeltaEPenalty || 
        result.deltaE < bestResult.deltaE) {
      bestResult = result;
    }
    
    // If we found a good enough solution, use it
    if (result.deltaE < options.maxDeltaEPenalty) {
      break;
    }
  }
  
  return bestResult;
}