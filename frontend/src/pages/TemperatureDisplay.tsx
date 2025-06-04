import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CurrentTemperature } from '../components/CurrentTemperature';
import TemperatureChart from '../components/TemperatureChart';
import TemperatureHistoryTable from '../components/TemperatureHistoryTable';
import { Temperature } from '../types/Temperature';
import VentilatorControl from '../components/VentilatorControl';
import AlertsTable from '../components/AlertsTable';

export default function TemperatureDisplay() {
  const [currentTemp, setCurrentTemp] = useState<Temperature | null>(null);
  const [allTemps, setAllTemps] = useState<Temperature[]>([]);
  const [desiredTemperature, setDesiredTemperature] = useState<{ min: number; max: number } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('tempRange');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (typeof parsed.min === 'number' && typeof parsed.max === 'number') {
          setDesiredTemperature(parsed);
        }
      } catch (err) {
        console.error('Eroare la parsarea temperaturii dorite:', err);
      }
    }
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch latest temperature
        const latestRes = await fetch('http://localhost:3001/api/temperature/latest');
        const latestData = await latestRes.json();
        console.log('Latest temperature data:', latestData);
        setCurrentTemp(latestData);

        // Fetch all temperatures and sort them by timestamp
        const allTempsRes = await fetch('http://localhost:3001/api/temperature/all');
        const allTempsData = await allTempsRes.json();
        setAllTemps(
          allTempsData.sort((a: Temperature, b: Temperature) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const interval = setInterval(fetchData, 2000); // Re-fetch every 2 seconds
    fetchData(); // Also call it immediately to load data on component mount

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []); // Empty dependency array ensures this only runs once on mount

  return (
    <div className="w-full h-screen p-6 bg-gray-100 font-extralight">
      <div className="flex h-full">
        {/* Left Column */}
        <div className="flex flex-col flex-1 mr-2 overflow-auto">
          <div className="flex flex-col gap-6" style={{ height: '60%' }}>
          <CurrentTemperature temp={currentTemp} desiredTemperature={desiredTemperature} />

            <TemperatureHistoryTable allTemps={allTemps} />
          </div>
          <div className="mt-4" style={{ height: '40%' }}>
            <TemperatureChart data={allTemps} />
          </div>
        </div>

        {/* Right Column */}
       {/* Right Column */}
       <div className="flex flex-col flex-1 h-full ml-2 overflow-auto">
          <div className="flex flex-col flex-1" style={{ height: '60%' }}>
            <VentilatorControl temp={currentTemp} />
          </div>
          <div className="flex-1 overflow-auto" style={{ height: '40%' }}>
            <AlertsTable />
          </div>
      </div>
      </div>
      
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeButton={false}
        rtl={false}
      />
    </div>
  );
}
