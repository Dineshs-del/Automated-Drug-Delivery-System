export const safeRanges = {
  bp: { low: 90, high: 140 },
  sugar: { low: 80, high: 160 },
  hr: { low: 60, high: 100 },
};

export function classify(value, range) {
  if (value === null || value === undefined || isNaN(value)) return "NA";
  if (value < range.low) return "LOW";
  if (value > range.high) return "HIGH";
  return "NORMAL";
}

export function simpleLinearPrediction(values) {
  if (!values || values.length < 3) return null;
  const n = values.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }
  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return null;
  const m = (n * sumXY - sumX * sumY) / denom;
  const b = (sumY - m * sumX) / n;
  const nextX = n;
  return m * nextX + b;
}
