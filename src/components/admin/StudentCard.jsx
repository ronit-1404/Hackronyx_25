import React from 'react';

const StudentCard = ({ 
  name, 
  photoUrl, 
  engagementScore, 
  lastSessionTags, 
  parentLinked, 
  onViewAnalytics 
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
      <img src={photoUrl} alt={`${name}'s photo`} className="w-16 h-16 rounded-full mr-4" />
      <div className="flex-grow">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-600">Engagement Score: {engagementScore}</p>
        <p className="text-sm text-gray-600">Last Session Tags: {lastSessionTags.join(', ')}</p>
        <p className="text-sm text-gray-600">Parent Linked: {parentLinked ? 'Yes' : 'No'}</p>
      </div>
      <button 
        onClick={onViewAnalytics} 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        View Analytics
      </button>
    </div>
  );
};

export default StudentCard;
