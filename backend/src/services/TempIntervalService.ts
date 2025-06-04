// services/TempIntervalService.ts

export interface TempRange {
  min: number;
  max: number;
}

let temperatureRange: TempRange | null = null;

export function setTemperatureRange(range: TempRange) {
  temperatureRange = range;
}

export function getTemperatureRange(): TempRange | null {
  return temperatureRange;
}
