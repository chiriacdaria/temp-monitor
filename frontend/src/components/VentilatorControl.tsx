import React, { useState, useEffect, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import ventilatorAnimation from '../assets/animations/ventilator-animation.json';
import FanControlButton from './FanControlButton';
import { Temperature } from '../types/Temperature';
import { io, Socket } from 'socket.io-client';

interface VentilatorControlProps {
  temp: Temperature | null;
}

const VentilatorControl: React.FC<VentilatorControlProps> = ({ temp }) => {
  const [fanStatus, setFanStatus] = useState(false);
  const [autoFanSuggested, setAutoFanSuggested] = useState(false);
  const animationRef = useRef<LottieRefCurrentProps>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Functii pentru verificarea temperaturii
  const isTemperatureHigh = (t: number) => t > 22.5;
  const isTemperatureLow = (t: number) => t <= 21.5;

  // Toggle pentru ventilator
  const handleFanToggle = () => {
    const newStatus = !fanStatus;
    socket?.emit(newStatus ? 'startFan' : 'stopFan');
    setFanStatus(newStatus);
    setAutoFanSuggested(false); // Resetăm sugestia când utilizatorul ia decizia
  };

  // Conectare la socket
  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('fanStatusUpdated', (data) => {
      setFanStatus(data.fanStatus);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Actualizarea stării ventilatorului pe baza temperaturii
  useEffect(() => {
    if (temp?.value != null) {
      const currentTemp = temp.value;

      // Sugestie vizuală: pornește ventilatorul dacă temperatura este prea mare și ventilatorul este oprit
      if (isTemperatureHigh(currentTemp) && !fanStatus) {
        setAutoFanSuggested(true);
      } else {
        setAutoFanSuggested(false);
      }

      // Oprire automată a ventilatorului când temperatura scade sub 21.5
      if (fanStatus && isTemperatureLow(currentTemp)) {
        setFanStatus(false);
        socket?.emit('stopFan');
      }
    }
  }, [temp, fanStatus, socket]);

  // Actualizare animație în funcție de starea ventilatorului
  useEffect(() => {
    if (animationRef.current) {
      fanStatus ? animationRef.current.play() : animationRef.current.stop();
    }
  }, [fanStatus]);

  // Determinarea textului butonului
  const getButtonText = () => {
    if (fanStatus && isTemperatureLow(temp?.value || 0)) return 'Oprește ventilatorul';
    if (!fanStatus && isTemperatureHigh(temp?.value || 0)) return 'Pornește ventilatorul';
    return fanStatus ? 'Ventilator pornit. Apasă pentru a opri ventilatorul.' : 'Ventilator oprit';
  };

  // Determinarea culorii butonului
  const getButtonColor = () => {
    if (!fanStatus && autoFanSuggested) return 'bg-[#fc014d] animate-pulse';  // sugestie de pornire
    if (fanStatus && isTemperatureLow(temp?.value || 0)) return 'bg-blue-600 animate-pulse'; // sugestie de oprire
    return fanStatus ? 'bg-[#004e48]' : 'bg-gray-500';
  };

  return (
    <div className="flex flex-col items-center h-1/2">
      <FanControlButton
        onClick={handleFanToggle}
        text={getButtonText()}
        color={getButtonColor()}
        disabled={!autoFanSuggested && !fanStatus} // Buton activ doar dacă se sugerează acțiunea
      />

      <div className="mt-8">
        <Lottie
          animationData={ventilatorAnimation}
          loop
          autoplay={false}
          style={{ height: 200, width: 200 }}
          lottieRef={animationRef}
        />
      </div>
    </div>
  );
};

export default VentilatorControl;
