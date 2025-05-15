import { TemperatureDTO } from '../types/TemperatureDTO';

export let latestTemperature: TemperatureDTO = {
  value: 0, 
  timestamp: new Date().toISOString()
};

export function updateTemperature(newTemp: TemperatureDTO) {
  latestTemperature = newTemp;
}
