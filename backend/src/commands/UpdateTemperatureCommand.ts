import { TemperatureDTO } from '../types/TemperatureDTO';

export class UpdateTemperatureCommand {
  constructor(public payload: TemperatureDTO) {}
}
