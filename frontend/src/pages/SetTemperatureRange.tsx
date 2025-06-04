// src/pages/SetTemperatureRange.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TempRange {
  min: number;
  max: number;
}

export default function SetTemperatureRange({ onSubmit }: { onSubmit: (range: TempRange) => void }) {
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const minVal = parseFloat(min);
    const maxVal = parseFloat(max);
  
    if (isNaN(minVal) || isNaN(maxVal) || minVal >= maxVal) {
      alert('Setează valori valide: Min trebuie să fie mai mic decât Max');
      return;
    }
  
    const range = { min: minVal, max: maxVal };
  
    localStorage.setItem('tempRange', JSON.stringify(range));
  
    onSubmit(range);

    fetch('http://localhost:3001/api/temperature/interval', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ min: minVal, max: maxVal }),
    });
    
    navigate('/display');
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200 font-extralight">
      <form className="p-6 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h2 className="mb-8 text-2xl font-thin">Setează intervalul de temperatură</h2>
        <div className="mb-4">
          <label className="block mb-1">Temperatura minimă (°C):</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            data-testid="input-min"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Temperatura maximă (°C):</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            data-testid="input-max"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          data-testid="btn-save"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Continuă
        </button>
      </form>
    </div>
  );
}
