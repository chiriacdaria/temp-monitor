import express from 'express';
import SensorModel from '../models/Sensor';
import SensorDataModel from '../models/SensorData';

const router = express.Router();

// Ruta pentru adăugarea unui senzor
router.post('/', async (req, res) => {
  const { sensor_id, type, location, unit } = req.body;
  try {
    const sensor = new SensorModel({ sensor_id, type, location, unit });
    await sensor.save();
    res.status(201).json(sensor);
  } catch (error) {
    res.status(500).json({ message: 'Error creating sensor', error });
  }
});

// Ruta pentru adăugarea unui senzor de date
router.post('/data', async (req, res) => {
  const { sensor_id, value } = req.body;
  try {
    const sensorData = new SensorDataModel({ sensor_id, value });
    await sensorData.save();
    res.status(201).json(sensorData);
  } catch (error) {
    res.status(500).json({ message: 'Error creating sensor data', error });
  }
});

export default router;

