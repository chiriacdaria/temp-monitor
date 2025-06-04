// handlers/GetTempIntervalHandler.ts
import { getTemperatureRange } from '../TemperatureIntervalStore';

export async function handleGetTempInterval() {
  return getTemperatureRange();
}
