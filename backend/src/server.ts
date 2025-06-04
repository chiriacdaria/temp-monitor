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
import { getTemperatureRange } from './services/TempIntervalService';

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
let simulationInterval: NodeJS.Timeout | null = null;

connectToDB();

function startSimulation() {
  console.log('▶️ Pornirea simulării temperaturii...');
  if (simulationInterval) return; // simularea rulează deja

  simulationInterval = setInterval(async () => {
    const range = getTemperatureRange();
    if (!range) {
      console.log('⏳ Intervalul de temperatură nu este setat încă.');
      return;
    }

    const { min: MIN_TEMP, max: MAX_TEMP } = range;

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
      timestamp: new Date().toISOString(),
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

  console.log('▶️ Simularea temperaturii a pornit.');
}

// Socket.IO - conexiune cu frontend
io.on('connection', (socket) => {
  console.log('🟢 Client conectat:', socket.id);

  // Trimitem starea actuală la conectare
  socket.emit('fanStatusUpdated', { fanStatus });

  socket.on('startFan', () => {
    fanStatus = true;
    console.log('🌀 Ventilator PORNIT de utilizator.');
    io.emit('fanStatusUpdated', { fanStatus });
  });

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

server.listen(3001, () => {
  console.log('✅ Serverul rulează pe http://localhost:3001');
});

export { startSimulation };
