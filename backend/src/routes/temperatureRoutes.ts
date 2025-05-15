import express from 'express';
import { UpdateTemperatureCommand } from '../commands/UpdateTemperatureCommand';
import { handleGetLatestTemperature } from '../handlers/GetLatestTemperatureHandler';
import { handleUpdateTemperature } from '../handlers/UpdateTemperatureHandler';
import { GetLatestTemperatureQuery } from '../queries/GetLatestTemperatureQuery';
import { TemperatureModel } from '../models/TemperatureModel';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { value, timestamp } = req.body;
    console.log('Received temperature update:', value, timestamp);
    const command = new UpdateTemperatureCommand({ value, timestamp });
    await handleUpdateTemperature(command);
    res.status(201).json({ message: 'Temperature updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Error updating temperature', error });
  }
});

router.get('/all', async (req, res) => {
  try {
    const temps = await TemperatureModel.find()
      .sort({ timestamp: -1 })
      .limit(30)
      .populate('alertId'); // <- aici legătura cu alerta

    res.json(temps);
  } catch (error) {
    res.status(500).json({ error: 'Eroare la preluarea temperaturilor' });
  }
});

router.get('/latest', async (req, res) => {
  try {
    // Creăm o instanță goală a clasei GetLatestTemperatureQuery
    const query = new GetLatestTemperatureQuery();
    const latestTemperature = await handleGetLatestTemperature(query); // Trimitem instanța ca argument
    res.status(200).json(latestTemperature);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest temperature', error });
  }
});


export default router;
