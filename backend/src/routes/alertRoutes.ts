import express, { Request, Response } from 'express';
import AlertModel from '../models/Alert';

const router = express.Router();


router.get('/latest', async (req: Request, res: Response) => {
  try {
    const latestAlert = await AlertModel.findOne().sort({ timestamp: -1 });
    res.json(latestAlert);
  } catch (error) {
    console.error('Eroare la obținerea ultimei alerte:', error);
    res.status(500).json({ message: 'Eroare la obținerea ultimei alerte.' });
  }
});


// Ruta pentru obținerea tuturor alertelor
router.get('/all', async (req: Request, res: Response) => {
  try {
    const alerts = await AlertModel.find().sort({ timestamp: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Eroare la preluarea alertelor' });
  }
});

// Ruta pentru adăugarea unei alerte
router.post('/', async (req: Request, res: Response) => {
  const { sensor_id, alert_type, threshold, current_value, status, message } = req.body;
  console.log('Received alert data:', req.body);
  try {
    const alert = new AlertModel({ sensor_id, alert_type, threshold, current_value, status, message });
   console.log('Alert created:', alert);
    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Error creating alert', error });
  }
});

// Ruta pentru obținerea unei alerte după ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const alert = await AlertModel.findById(req.params.id);
    if (!alert) {
       res.status(404).json({ message: 'Alertă negăsită' });
    }
    res.json(alert);
  } catch (error) {
    console.error('Eroare la obținerea alertei:', error);
    res.status(500).json({ message: 'Eroare la obținerea alertei.' });
  }
});


export default router;
