import React from 'react';
import { Radar } from 'recharts';

const data = [
  {
    subject: 'Focus',
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: 'Engagement',
    A: 130,
    B: 120,
    fullMark: 150,
  },
  {
    subject: 'Retention',
    A: 140,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Participation',
    A: 150,
    B: 140,
    fullMark: 150,
  },
  {
    subject: 'Satisfaction',
    A: 160,
    B: 150,
    fullMark: 150,
  },
];

const RadarChartComponent = () => {
  return (
    <RadarChart outerRadius={90} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <PolarRadiusAxis angle={30} domain={[0, 150]} />
      <Radar name="Your Metrics" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      <Radar name="Peer Median" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
    </RadarChart>
  );
};

export default RadarChartComponent;