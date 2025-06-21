import React, { useEffect, useState } from 'react';
import EmotionWheel from '../charts/EmotionWheel';

const LiveSentimentFeed = () => {
    const [sentimentData, setSentimentData] = useState({
        frustrated: 0,
        bored: 0,
        confused: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate fetching real-time sentiment data
            const newSentimentData = {
                frustrated: Math.floor(Math.random() * 100),
                bored: Math.floor(Math.random() * 100),
                confused: Math.floor(Math.random() * 100),
            };
            setSentimentData(newSentimentData);
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Live Sentiment Feed</h2>
            <EmotionWheel sentimentData={sentimentData} />
            <div className="mt-4">
                <h3 className="text-lg">Current Sentiment Levels:</h3>
                <ul>
                    <li>Frustrated: {sentimentData.frustrated}</li>
                    <li>Bored: {sentimentData.bored}</li>
                    <li>Confused: {sentimentData.confused}</li>
                </ul>
            </div>
        </div>
    );
};

export default LiveSentimentFeed;