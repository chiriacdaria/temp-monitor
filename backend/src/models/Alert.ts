import mongoose, { Schema, Document } from 'mongoose';

interface Alert extends Document {
  sensor_id: string;
  alert_type: string;
  threshold: number;
  current_value: number;
  status: string;
  timestamp: Date;
  message: string;
}

const AlertSchema: Schema = new Schema({
  sensor_id: { type: String, required: true },
  alert_type: { type: String, required: true },
  threshold: { type: Number, required: true },
  current_value: { type: Number, required: true },
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  message: { type: String, required: true },
});

const AlertModel = mongoose.model<Alert>('Alert', AlertSchema);

export default AlertModel;
