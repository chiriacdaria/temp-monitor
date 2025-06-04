import React from 'react';

interface Temperature {
  value: number;
  timestamp: string;
}

interface DesiredTemperatureRange {
  min: number;
  max: number;
}

interface CurrentTemperatureProps {
  temp: Temperature | null;
  desiredTemperature?: DesiredTemperatureRange | null;
}

export const CurrentTemperature: React.FC<CurrentTemperatureProps> = ({ temp, desiredTemperature }) => {
  return (
    <div className="relative p-4 text-center bg-white shadow-md rounded-xl">
      {/* Badge */}
      {desiredTemperature && (
        <div className="absolute px-2 py-1 text-xs font-semibold text-white bg-[#009d90] rounded-full top-2 right-2">
        Limite:  {desiredTemperature.min}°C - {desiredTemperature.max}°C
        </div>
      )}

      <h2 className="mb-2 text-lg font-medium text-[#002f2b]">Temperatură curentă</h2>
      <p className="text-2xl text-[#009d90]">{temp?.value ?? '...'} °C</p>
      <p className="mt-2 text-sm text-gray-500">
        {temp?.timestamp ? `Ultima actualizare: ${new Date(temp.timestamp).toLocaleString()}` : 'Așteaptă date...'}
      </p>
    </div>
  );
};
