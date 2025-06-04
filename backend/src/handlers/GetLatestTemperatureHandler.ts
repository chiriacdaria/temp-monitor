import { TemperatureModel } from "../models/TemperatureModel";
import { GetLatestTemperatureQuery } from "../queries/GetLatestTemperatureQuery";


export const handleGetLatestTemperature = async (_query: GetLatestTemperatureQuery) => {
  const latest = await TemperatureModel.findOne().sort({ timestamp: -1 });

  if (!latest) {
    return {
      value: (20 + Math.random() * 10).toFixed(2),
      timestamp: new Date()
    };
  }

  return latest;
};