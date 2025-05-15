import React from 'react';

interface FanControlButtonProps {
  onClick: () => void;
  text: string;
  color: string;
  disabled?: boolean;
}

const FanControlButton: React.FC<FanControlButtonProps> = ({ onClick, text, color, disabled }) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`w-full py-3 text-white font-semibold rounded-lg ${color} ${
        !disabled ? 'hover:opacity-90' : 'cursor-not-allowed opacity-60'
      } transition duration-300`}
    >
      {text}
    </button>
  );
};

export default FanControlButton;
