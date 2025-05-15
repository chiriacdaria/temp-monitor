// CurrentTemperature.tsx
import React from 'react';

interface Temperature {
  value: number;
  timestamp: string;
}

interface CurrentTemperatureProps {
  temp: Temperature | null;
}

const CurrentTemperature: React.FC<CurrentTemperatureProps> = ({ temp }) => {
  return (
    <div className="p-4 text-center bg-white shadow-md rounded-xl">
      <h2 className="mb-2 text-lg font-bold text-[#002f2b]">Temperatură curentă</h2>
      <p className="text-2xl text-[#009d90]">{temp?.value ?? '...'} °C</p>
      <p className="mt-2 text-sm text-gray-500">
        Ultima actualizare: {temp?.timestamp ? new Date(temp.timestamp).toLocaleString() : '...'}
      </p>
    </div>
  );
};

export default CurrentTemperature;
