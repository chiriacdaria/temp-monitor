import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface TemperatureChartProps {
  data: {
    value: number;
    timestamp: string;
  }[];
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ data }) => {
  // Format the data for the chart (you might want to limit to the last N values)
  const chartData = data
    .map((item) => ({
      value: item.value,
      time: new Date(item.timestamp).toLocaleTimeString(),
    }))
    .reverse(); // optional: reverse to show oldest -> newest

	return (
		
<div className="w-full h-full p-4 bg-white shadow-md rounded-xl">
	<h2 className="mb-2 text-md font-medium text-[#002f2b]">Evoluția Temperaturii</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" minTickGap={20} />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#009d90" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
			</div>
  );
};

export default TemperatureChart;
