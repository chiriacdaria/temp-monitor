import React from 'react';
interface FanControlButtonProps {
  onClick: () => void;
  text: string;
  color: string;
  disabled?: boolean;
  dataTestId?: string;  // adaugă prop optional pentru data-testid
}

const FanControlButton: React.FC<FanControlButtonProps> = ({ onClick, text, color, disabled, dataTestId }) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      data-testid={dataTestId}   // setează aici atributul data-testid dacă este primit
      className={`w-full py-3 text-white  font-medium rounded-lg ${color} ${
        !disabled ? 'hover:opacity-90' : 'cursor-not-allowed opacity-60'
      } transition duration-300`}
    >
      {text}
    </button>
  );
};

export default FanControlButton;
