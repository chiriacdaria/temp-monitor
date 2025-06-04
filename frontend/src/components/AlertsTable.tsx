import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export type Alert = {
  _id: string;
  timestamp: string;
  alert_type: string;
  current_value: number;
  threshold: number;
  status: string;
  message: string;
};

const socket: Socket = io('http://localhost:3001'); // Connect to WebSocket server

const AlertsTable: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/alert/all'); // Endpoint to fetch alerts
        const data = await response.json();
        setAlerts(data); // Set the alerts
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    socket.on('newAlert', (alert: Alert) => {
      setAlerts((prev) => [alert, ...prev]); // Add the new alert to the top
    });

    return () => {
      socket.off('newAlert');
    };
  }, []);

    return (
      <div className="flex flex-col h-full p-4 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-md font-medium text-[#4b0017]">Alerte de temperatură</h2>
    
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="text-sm font-thin text-left text-gray-800 bg-gray-300">
                  <th className="p-2 font-light border">Date</th>
                  <th className="p-2 font-light border">Tipul alertei</th>
                  <th className="p-2 font-light border">Valoarea curentă</th>
                  <th className="p-2 font-light border">Threshold(Limită)</th>
                  <th className="p-2 font-light border">Status</th>
                  <th className="p-2 font-light border">Mesaj</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert._id} className="text-sm text-gray-700 hover:bg-gray-50">
                    <td className="p-2 border">{new Date(alert.timestamp).toLocaleString()}</td>
                    <td className="p-2 capitalize border">{alert.alert_type.replace('_', ' ')}</td>
                    <td className="p-2 border">{alert.current_value.toFixed(2)} °C</td>
                    <td className="p-2 border">{alert.threshold.toFixed(2)} °C</td>
                    <td className="p-2 border">{alert.status}</td>
                    <td className="p-2 border">{alert.message}</td>
                  </tr>
                ))}
                {alerts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No alerts recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
    };

export default AlertsTable;
