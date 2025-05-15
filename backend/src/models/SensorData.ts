import mongoose, { Schema, Document } from 'mongoose';

interface SensorData extends Document {
  sensor_id: string;
  value: number;
  timestamp: Date;
}

const SensorDataSchema: Schema = new Schema({
  sensor_id: { type: String, required: true },
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const SensorDataModel = mongoose.model<SensorData>('SensorData', SensorDataSchema);

export default SensorDataModel;
