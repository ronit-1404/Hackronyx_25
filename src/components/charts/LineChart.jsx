import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const LineChart = ({ data }) => {
  return (
    <RechartsLineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="engagement"
        stroke="#8884d8"
        strokeWidth={2}
        dot={false}
        activeDot={{ r: 8 }}
      />
    </RechartsLineChart>
  );
};

export default LineChart;
