import express from 'express';
import DeviceModel from '../models/Device';

const router = express.Router();

// Ruta pentru adăugarea unui dispozitiv
router.post('/', async (req, res) => {
  const { device_id, type, status, location } = req.body;
  try {
    const device = new DeviceModel({ device_id, type, status, location });
    await device.save();
    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ message: 'Error creating device', error });
  }
});

export default router;
