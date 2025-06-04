import { UpdateTemperatureCommand } from "../commands/UpdateTemperatureCommand";
import AlertModel from "../models/Alert";
import { TemperatureModel } from "../models/TemperatureModel";
import { getTemperatureRange } from "../services/TempIntervalService";

export const handleUpdateTemperature = async (command: UpdateTemperatureCommand) => {
  try {
    // Limitare număr de înregistrări în DB
    const count = await TemperatureModel.countDocuments();
    if (count >= 200) {
      await TemperatureModel.findOneAndDelete({}).sort({ timestamp: 1 });
    }

    const { value, timestamp } = command.payload;

    // Obținem intervalul de temperatură în try/catch
    let MIN_TEMP = -Infinity;
    let MAX_TEMP = Infinity;

    try {
      const range = getTemperatureRange();
      if (!range) throw new Error("Range not set");
      MIN_TEMP = range.min;
      MAX_TEMP = range.max;
    } catch (e) {
      console.warn("⚠️ Intervalul de temperatură nu este setat. Se ignoră validarea.");
    }

    console.log(`Intervalul de temperatură în handler: ${MIN_TEMP} °C - ${MAX_TEMP} °C`);

    // Pregătim datele de temperatură
    const temperatureData: any = {
      value,
      timestamp: new Date(timestamp),
    };

    // Verificăm dacă temperatura e în afara intervalului
    if (value < MIN_TEMP || value > MAX_TEMP) {
      console.log(`⚠️ Alertă generată pentru temperatura: ${value} °C`);
      const alertType = value < MIN_TEMP ? "low_temperature" : "high_temperature";

      const alert = new AlertModel({
        sensor_id: "temperatureSensor",
        alert_type: alertType,
        threshold: value < MIN_TEMP ? MIN_TEMP : MAX_TEMP,
        current_value: value,
        status: "Active",
        timestamp: new Date(timestamp),
        message:
          value < MIN_TEMP
            ? `Temperatura prea mică: ${value} °C`
            : `Temperatura prea mare: ${value} °C`,
      });

      await alert.save();
      temperatureData.alertId = alert._id;
      console.log("⚠️ Alertă salvată:", alert);
    }

    // Salvăm temperatura
    const temperature = new TemperatureModel(temperatureData);
    await temperature.save();

    console.log("🌡️ Temperatură salvată:", value);

    // Returnăm alerta dacă a fost creată
    return temperatureData.alertId ? await AlertModel.findById(temperatureData.alertId) : null;
  } catch (error) {
    console.error("❌ Eroare la salvarea temperaturii:", error);
  }
};
