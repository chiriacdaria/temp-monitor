import mongoose from 'mongoose';

const TemperatureSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  alertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alert',
    default: null
  }
});

export const TemperatureModel = mongoose.model('Temperature', TemperatureSchema);
