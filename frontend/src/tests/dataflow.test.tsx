import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SetTemperatureRange from '../pages/SetTemperatureRange';
import { MemoryRouter } from 'react-router-dom';

beforeEach(() => {
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Interval salvat cu succes' }),
    })
  ) as jest.Mock;
});

test('validare form: min < max și trimitere request', async () => {
  const mockOnSubmit = jest.fn();

  render(
    <MemoryRouter>
      <SetTemperatureRange onSubmit={mockOnSubmit} />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/temperatura minimă/i), { target: { value: '20' } });
  fireEvent.change(screen.getByLabelText(/temperatura maximă/i), { target: { value: '28' } });

  fireEvent.click(screen.getByRole('button', { name: /continuă/i }));

  // Verifică dacă onSubmit a fost apelat cu valorile corecte
  expect(mockOnSubmit).toHaveBeenCalledWith({ min: 20, max: 28 });

  // Verifică fetch apelat corect
  expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/api/temperature/interval', expect.objectContaining({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ min: 20, max: 28 }),
  }));

  // Așteaptă navigarea - în test e greu să verifici direct, dar poți verifica efectele așteptate

});

test('validare eșuată dacă min >= max', () => {
  render(
    <MemoryRouter>
      <SetTemperatureRange onSubmit={jest.fn()} />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/temperatura minimă/i), { target: { value: '30' } });
  fireEvent.change(screen.getByLabelText(/temperatura maximă/i), { target: { value: '20' } });

  fireEvent.click(screen.getByRole('button', { name: /continuă/i }));

  expect(window.alert).toHaveBeenCalledWith('Setează valori valide: Min trebuie să fie mai mic decât Max');
});
