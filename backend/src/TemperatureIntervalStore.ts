// TemperatureIntervalStore.ts

export interface DesiredTemperatureRange {
  min: number;
  max: number;
}

// Fără valori presetate inițial
let tempRange: DesiredTemperatureRange | null = null;

export function getTemperatureRange(): DesiredTemperatureRange | null {
  return tempRange;
}

export function setTemperatureRange(newRange: DesiredTemperatureRange) {
  tempRange = newRange;
}
