import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
  { name: 'Frustrated', value: 25, color: '#ff4d4d' },
  { name: 'Bored', value: 25, color: '#ffcc00' },
  { name: 'Confused', value: 25, color: '#66b3ff' },
  { name: 'Focused', value: 25, color: '#99ff99' },
];

const EmotionWheel = () => {
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        labelLine={false}
        label={({ name }) => name}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default EmotionWheel;