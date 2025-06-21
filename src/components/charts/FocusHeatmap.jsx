import React from 'react';
import { HeatMap } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, Tooltip, Legend, Title);

const FocusHeatmap = ({ data }) => {
    const heatmapData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Focus Level',
                data: data.values,
                backgroundColor: (context) => {
                    const value = context.dataset.data[context.dataIndex];
                    const alpha = value ? value / 10 : 0; // Adjust the divisor based on your scale
                    return `rgba(75, 192, 192, ${alpha})`;
                },
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Hourly Focus Patterns',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Hour of the Day',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Days',
                },
            },
        },
    };

    return <HeatMap data={heatmapData} options={options} />;
};

export default FocusHeatmap;