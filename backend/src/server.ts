import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import { UpdateTemperatureCommand } from './commands/UpdateTemperatureCommand';
import { connectToDB } from './config/db';
import { handleUpdateTemperature } from './handlers/UpdateTemperatureHandler';
import temperatureRoutes from './routes/temperatureRoutes';
import alertRoutes from './routes/alertRoutes';
import sensorRoutes from './routes/sensorRoutes';
import deviceRoutes from './routes/deviceRoutes';
import AlertModel from './models/Alert'; // presupunând că ai un model pentru Alert

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

let recordCount = 0;
let temperature = 22;
let fanStatus = false;

const MIN_TEMP = 21.5;
const MAX_TEMP = 22.5;

connectToDB();

setInterval(async () => {
  let tempValue: number;

  if (fanStatus) {
    tempValue = Math.max(temperature - 0.05, MIN_TEMP);
  } else {
    tempValue = temperature < MAX_TEMP ? temperature + 0.05 : temperature + 0.02;
  }

  temperature = parseFloat(tempValue.toFixed(2));
  console.log(`🌡️ Temperatura curentă: ${temperature.toFixed(2)}°C`);

  const command = new UpdateTemperatureCommand({
    value: temperature,
    timestamp: new Date().toISOString()
  });

  const alert = await handleUpdateTemperature(command);

  io.emit('temperatureUpdate', {
    temperature: temperature.toFixed(2),
    fanStatus,
  });

  if (alert) {
    console.log('⚠️ Alertă generată:', alert.message);
    io.emit('newAlert', alert);
  }

  recordCount++;
}, 2000);


// Socket.IO - conexiune cu frontend
io.on('connection', (socket) => {
  console.log('🟢 Client conectat:', socket.id);

  // Trimitem starea actuală la conectare
  socket.emit('fanStatusUpdated', { fanStatus });

  // Pornire ventilator de la frontend
  socket.on('startFan', () => {
    fanStatus = true;
    console.log('🌀 Ventilator PORNIT de utilizator.');
    io.emit('fanStatusUpdated', { fanStatus });
  });

  // Oprire ventilator de la frontend
  socket.on('stopFan', () => {
    fanStatus = false;
    console.log('🛑 Ventilator OPRIT de utilizator.');
    io.emit('fanStatusUpdated', { fanStatus });
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client deconectat:', socket.id);
  });
});

// Rute REST
app.use('/api/temperature', temperatureRoutes);
app.use('/api/alert', alertRoutes);
app.use('/api/sensor', sensorRoutes);
app.use('/api/device', deviceRoutes);

// Pornim serverul
server.listen(3001, () => {
  console.log('✅ Serverul rulează pe http://localhost:3001');
});
