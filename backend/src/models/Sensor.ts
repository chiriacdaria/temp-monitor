import mongoose, { Schema, Document } from 'mongoose';

interface Sensor extends Document {
  sensor_id: string;
  type: string;
  location: string;
  unit: string;
  last_updated: Date;
}

const SensorSchema: Schema = new Schema({
  sensor_id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  unit: { type: String, required: true },
  last_updated: { type: Date, default: Date.now },
});

const SensorModel = mongoose.model<Sensor>('Sensor', SensorSchema);

export default SensorModel;
