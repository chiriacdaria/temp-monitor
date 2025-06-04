import React, { useEffect, useState } from 'react';
import { Alert } from './AlertsTable'; 
interface Temperature {
  value: number;
  timestamp: string;
  alertId?: Alert | null;  // obiect alert complet, nu doar id
}

interface Props {
  allTemps: Temperature[];
}

const TemperatureHistoryTable: React.FC<Props> = ({ allTemps }) => {
  const [alertsMap, setAlertsMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAlert = async (alertId: string) => {
      try {
        console.log('Fetching alert for ID:', alertId);
        const response = await fetch(`http://localhost:3001/api/alert/${alertId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const alertData: Alert = await response.json();
        setAlertsMap(prev => ({
          ...prev,
          [alertId]: alertData.message,
        }));
        console.log('Alert fetched:', alertData.message);
      } catch (error) {
        console.error('Error fetching alert:', error);
      }
    };
  
    // Extrage ID-urile unice din alertId (obiect), dacă există
    const uniqueAlertIds = Array.from(
      new Set(
        allTemps
          .map(t => t.alertId?._id)  // extrag _id din obiect alertId
          .filter((id): id is string => typeof id === 'string')
      )
    );
  
    uniqueAlertIds.forEach(alertId => {
      if (!alertsMap[alertId]) {
        fetchAlert(alertId);
      }
    });
  }, [allTemps, alertsMap]);
  

  return (
<div className="w-full overflow-auto bg-white shadow-md rounded-xl">
<table className="min-w-full text-sm table-auto">
        <thead className="sticky top-0 bg-[#004e48] text-white">
          <tr>
            <th className="px-4 py-2 font-light text-left">Valoare (°C)</th>
            <th className="px-4 py-2 font-light text-left">Timp</th>
            <th className="px-4 py-2 font-light text-left ">Stare</th>
            <th className="px-4 py-2 font-light text-left ">Alertă</th>
          </tr>
        </thead>
        <tbody>
          {allTemps.map((t, index) => (
            <tr key={index} className={`${t.alertId ? 'bg-[#fee5ed] hover:bg-[#feccdb]' : 'bg-white hover:bg-[#e5f5f3]'} `}>
              <td className="px-4 py-2">{t.value.toFixed(2)}</td>
              <td className="px-4 py-2">{new Date(t.timestamp).toLocaleString()}</td>
              <td className="px-4 py-2">
                {t.alertId ? (
                  <span className="font-thin text-[#fc014d]">Avertisment</span>
                ) : (
                  <span className="font-thin text-[#009d90]">OK</span>
                )}
              </td>
              <td className="px-4 py-2">
              {t.alertId ? (
  <span className="font-thin text-[#fc014d]">
    {alertsMap[t.alertId._id] ?? 'Alertă necunoscută'}
  </span>
) : (
  <span className="font-thin text-[#009d90]">Fără alertă</span>
)}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TemperatureHistoryTable;
