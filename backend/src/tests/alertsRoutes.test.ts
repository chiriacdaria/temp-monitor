import express from 'express';
import request from 'supertest';
import alertRoutes from '../routes/alertRoutes';
import AlertModel from '../models/Alert';

jest.mock('../models/Alert'); 

const app = express();
app.use(express.json());
app.use('/api/alerts', alertRoutes);

describe('GET /api/alerts/all', () => {
  it('returnează toate alertele', async () => {
    const alerts = [
      {
        _id: '1',
        timestamp: new Date().toISOString(),
        alert_type: 'high_temp',
        current_value: 32,
        threshold: 30,
        status: 'active',
        message: 'Temperatura este prea mare!',
      },
    ];

    (AlertModel.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue(Promise.resolve(alerts)),
    });

    const res = await request(app).get('/api/alerts/all');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(alerts);
  });

  it('returnează eroare 500 la eșec', async () => {
    (AlertModel.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error('DB error')),
    });

    const res = await request(app).get('/api/alerts/all');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Eroare la preluarea alertelor');
  });
});

describe('GET /api/alert/:id', () => {
  it('returnează alerta pentru ID valid', async () => {
    const alert = {
      _id: '123',
      timestamp: new Date().toISOString(),
      alert_type: 'low_temp',
      current_value: 5,
      threshold: 10,
      status: 'active',
      message: 'Temperatura este prea mică!',
    };

    // Mockăm findById să returneze alerta
    (AlertModel.findById as jest.Mock).mockResolvedValue(alert);

    const res = await request(app).get('/api/alerts/123');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(alert);
  });

  it('returnează 404 dacă alerta nu există', async () => {
    (AlertModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/api/alerts/unknown-id');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Alertă negăsită');
  });

  it('returnează 500 dacă apare o eroare internă', async () => {
    (AlertModel.findById as jest.Mock).mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/alerts/123');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Eroare la obținerea alertei.');
  });
});


