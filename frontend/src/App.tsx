import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TemperatureDisplay from './pages/TemperatureDisplay';
import SetTemperatureRange from './pages/SetTemperatureRange';

function App() {
  const [tempRange, setTempRange] = useState<{ min: number; max: number } | null>(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<SetTemperatureRange onSubmit={(range) => setTempRange(range)} />}
        />
        <Route
          path="/display"
          element={tempRange ? <TemperatureDisplay /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
