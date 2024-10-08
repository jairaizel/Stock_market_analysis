import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StockChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={['dataMin', 'dataMax']} />
        <Tooltip />
        <Line type="monotone" dataKey="close" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StockChart;
