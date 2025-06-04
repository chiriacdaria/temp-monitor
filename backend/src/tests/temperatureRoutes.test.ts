import express from 'express';
import request from 'supertest';

jest.mock('../server', () => ({
  startSimulation: jest.fn(),
}));

jest.mock('../models/TemperatureModel', () => ({
  TemperatureModel: {
    find: jest.fn(() => ({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue([]),
    })),
    findOne: jest.fn(() => ({
      sort: jest.fn().mockReturnValue(Promise.resolve({
        _id: '123',
        value: 23.5,
        timestamp: new Date().toISOString(),
        alertId: null,
      })),
    })),
  },
}));

import temperatureRoutes from '../routes/temperatureRoutes';

const app = express();
app.use(express.json());
app.use('/api/temperature', temperatureRoutes);

describe('Temperature Routes', () => {
  it('GET /api/temperature/all returns 200 and array', async () => {
    const res = await request(app).get('/api/temperature/all');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/temperature/latest returns 200 and an object', async () => {
    const res = await request(app).get('/api/temperature/latest');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('value');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('POST /api/temperature/interval', () => {
  it('salvează corect intervalul și pornește simularea', async () => {
    const res = await request(app)
      .post('/api/temperature/interval')
      .send({ min: 20, max: 30 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Interval salvat cu succes');
  });

  it('returnează eroare 400 dacă lipsesc valorile min sau max', async () => {
    const res = await request(app)
      .post('/api/temperature/interval')
      .send({ min: 20 }); // fără max

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Min și Max trebuie specificate.');
  });
});

