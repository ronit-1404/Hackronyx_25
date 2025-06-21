import React from 'react';

const ResourceEffectiveness = () => {
    const retentionRates = {
        video: 70,
        article: 60,
        quiz: 80,
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Resource Effectiveness</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="font-semibold">Videos</h3>
                    <p className="text-lg">{retentionRates.video}% Retention Rate</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="font-semibold">Articles</h3>
                    <p className="text-lg">{retentionRates.article}% Retention Rate</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="font-semibold">Quizzes</h3>
                    <p className="text-lg">{retentionRates.quiz}% Retention Rate</p>
                </div>
            </div>
        </div>
    );
};

export default ResourceEffectiveness;