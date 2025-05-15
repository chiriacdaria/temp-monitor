import React, { useEffect, useState } from 'react';

interface Alert {
  _id: string;
  message: string;
  // Include other fields from the alert object if needed
}

interface Temperature {
  value: number;
  timestamp: string;
  alertId?: string | number | null; // alertId refers to an ID of an alert, not the entire Alert object
}

interface Props {
  allTemps: Temperature[];
}

const TemperatureHistoryTable: React.FC<Props> = ({ allTemps }) => {
  const [alertsMap, setAlertsMap] = useState<Record<string | number, string>>({});

  useEffect(() => {
    const fetchAlerts = async (alertId: string | number) => {
      try {
        const response = await fetch(`http://localhost:3001/api/alert/latest`);
        console.log('alalala', response)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const alertData: Alert = await response.json();
        setAlertsMap((prevAlerts) => ({
          ...prevAlerts,
          [alertId]: alertData.message,
        }));
      } catch (error) {
        console.error('Error fetching alert:', error);
      }
    };

    const uniqueAlertIds = Array.from(
      new Set(allTemps.map(t => t.alertId).filter((alertId): alertId is string | number => alertId != null))
    );

    uniqueAlertIds.forEach(alertId => {
      if (!alertsMap[alertId]) {
        fetchAlerts(alertId);
      }
    });
  }, [allTemps, alertsMap]);

  return (
<div className="w-full overflow-auto bg-white shadow-md rounded-xl">
<table className="min-w-full text-sm table-auto">
        <thead className="sticky top-0 bg-[#004e48] text-white">
          <tr>
            <th className="px-4 py-2 text-left">Valoare (°C)</th>
            <th className="px-4 py-2 text-left">Timp</th>
            <th className="px-4 py-2 text-left">Stare</th>
            <th className="px-4 py-2 text-left">Alertă</th>
          </tr>
        </thead>
        <tbody>
          {allTemps.map((t, index) => (
            <tr key={index} className={`${t.alertId ? 'bg-[#fee5ed] hover:bg-[#feccdb]' : 'bg-white hover:bg-[#e5f5f3]'} `}>
              <td className="px-4 py-2">{t.value.toFixed(2)}</td>
              <td className="px-4 py-2">{new Date(t.timestamp).toLocaleString()}</td>
              <td className="px-4 py-2">
                {t.alertId ? (
                  <span className="font-semibold text-[#fc014d]">Avertisment</span>
                ) : (
                  <span className="font-semibold text-[#009d90]">OK</span>
                )}
              </td>
              <td className="px-4 py-2">
                {t.alertId ? (
                  <span className="font-semibold text-[#fc014d]">
                    {alertsMap[t.alertId] ?? 'Alertă necunoscută'}
                  </span>
                ) : (
                  <span className="font-semibold text-[#009d90]">Fără alertă</span>
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
