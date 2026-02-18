// src/utils/vitalsClassifier.js

export function classifyBP(bp) {
  if (bp < 90) return { label: "Low BP", color: "blue" };
  if (bp <= 120) return { label: "Normal BP", color: "green" };
  return { label: "High BP", color: "red" };
}

export function classifyHR(hr) {
  if (hr < 60) return { label: "Low HR", color: "blue" };
  if (hr <= 100) return { label: "Normal HR", color: "green" };
  return { label: "High HR", color: "red" };
}

export function classifySugar(sugar) {
  if (sugar < 140) return { label: "Normal Sugar", color: "green" };
  if (sugar <= 200) return { label: "Pre-Diabetic", color: "orange" };
  return { label: "Diabetic", color: "red" };
}
