import React from 'react';
import { ResponsiveContainer, HeatMap, XAxis, YAxis, Tooltip } from 'recharts';

const EngagementHeatmap = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <HeatMap
                data={data}
                xKey="hour"
                yKey="day"
                dataKey="engagement"
                gradient={['#f0f0f0', '#ff0000']}
                tooltip={<Tooltip />}
            >
                <XAxis dataKey="hour" />
                <YAxis dataKey="day" />
            </HeatMap>
        </ResponsiveContainer>
    );
};

export default EngagementHeatmap;