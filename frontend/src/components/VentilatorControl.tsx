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

  const [minTemp, setMinTemp] = useState(22.5);
  const [maxTemp, setMaxTemp] = useState(25);
  
  useEffect(() => {
    const storedRange = localStorage.getItem('tempRange');
    console.log('Stored tempRange:', storedRange);
    if (storedRange) {
      try {
        const { min, max } = JSON.parse(storedRange);
        if (typeof min === 'number') setMinTemp(min);
        if (typeof max === 'number') setMaxTemp(max);
      } catch (error) {
        console.warn('tempRange in localStorage is invalid JSON');
      }
    }
  }, []);
  
  // Dacă vrei să vezi când se schimbă minTemp și maxTemp, un alt useEffect:
  useEffect(() => {
    console.log(`Praguri de temperatură actualizate: min=${minTemp}, max=${maxTemp}`);
  }, [minTemp, maxTemp]);
  

  const isTemperatureHigh = (t: number) => t > maxTemp;
  const isTemperatureLow = (t: number) => t <= minTemp;

  const handleFanToggle = () => {
    const newStatus = !fanStatus;
    socket?.emit(newStatus ? 'startFan' : 'stopFan');
    setFanStatus(newStatus);
    setAutoFanSuggested(false);
  };

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

  useEffect(() => {
    if (temp?.value != null) {
      const currentTemp = temp.value;

      if (isTemperatureHigh(currentTemp) && !fanStatus) {
        setAutoFanSuggested(true);
      } else {
        setAutoFanSuggested(false);
      }

      if (fanStatus && isTemperatureLow(currentTemp)) {
        setFanStatus(false);
        socket?.emit('stopFan');
      }
    }
  }, [temp, fanStatus, socket, minTemp, maxTemp]);

  useEffect(() => {
    if (animationRef.current) {
      fanStatus ? animationRef.current.play() : animationRef.current.stop();
    }
  }, [fanStatus]);

  const getButtonText = () => {
    if (fanStatus && isTemperatureLow(temp?.value || 0)) return 'Oprește ventilatorul';
    if (!fanStatus && isTemperatureHigh(temp?.value || 0)) return 'Pornește ventilatorul';
    return fanStatus ? 'Ventilator pornit. Apasă pentru a opri ventilatorul.' : 'Ventilator oprit';
  };

  const getButtonColor = () => {
    if (!fanStatus && autoFanSuggested) return 'bg-[#fc014d] animate-pulse';
    if (fanStatus && isTemperatureLow(temp?.value || 0)) return 'bg-blue-600 animate-pulse';
    return fanStatus ? 'bg-[#004e48]' : 'bg-gray-500';
  };

  return (
    <div className="flex flex-col items-center h-1/2">
      <FanControlButton
        onClick={handleFanToggle}
        text={getButtonText()}
        color={getButtonColor()}
        disabled={!autoFanSuggested && !fanStatus}
        dataTestId={`btn-temp-${temp?.value?.toFixed(0)}`} 
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
