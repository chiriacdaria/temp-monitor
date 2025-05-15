import { UpdateTemperatureCommand } from "../commands/UpdateTemperatureCommand";
import AlertModel from "../models/Alert";
import { TemperatureModel } from "../models/TemperatureModel";

export const handleUpdateTemperature = async (command: UpdateTemperatureCommand) => {
  try {
    const count = await TemperatureModel.countDocuments();
    if (count >= 200) {
      await TemperatureModel.findOneAndDelete({}).sort({ timestamp: 1 });
    }

    const { value, timestamp } = command.payload;
    const temperatureData: any = {
      value,
      timestamp: new Date(timestamp),
    };

    // Folosim pragurile reale
    const MIN_TEMP = 21.5;
    const MAX_TEMP = 22.5;

    if (value < MIN_TEMP || value > MAX_TEMP) {
      const alertType = value < MIN_TEMP ? "low_temperature" : "high_temperature";

      const alert = new AlertModel({
        sensor_id: "temperatureSensor",
        alert_type: alertType,
        threshold: value < MIN_TEMP ? MIN_TEMP : MAX_TEMP,
        current_value: value,
        status: "Active",
        timestamp: new Date(timestamp),
        message: value < MIN_TEMP
          ? `Temperatura prea mică: ${value} °C`
          : `Temperatura prea mare: ${value} °C`
      });

      await alert.save();
      temperatureData.alertId = alert._id;
    }

    const temperature = new TemperatureModel(temperatureData);
    await temperature.save();

    console.log("🌡️ Temperatură salvată:", value);

    return temperatureData.alertId ? await AlertModel.findById(temperatureData.alertId) : null;
  } catch (error) {
    console.error("❌ Eroare la salvarea temperaturii:", error);
  }
};
