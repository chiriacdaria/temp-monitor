import mongoose, { Schema, Document } from 'mongoose';

interface Device extends Document {
  device_id: string;
  type: string;
  status: string;
  location: string;
  last_controlled: Date;
}

const DeviceSchema: Schema = new Schema({
  device_id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  location: { type: String, required: true },
  last_controlled: { type: Date, default: Date.now },
});

const DeviceModel = mongoose.model<Device>('Device', DeviceSchema);

export default DeviceModel;
