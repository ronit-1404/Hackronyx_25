import React from 'react';

const roles = [
  { id: 'learner', name: 'Learner' },
  { id: 'educator', name: 'Educator/Admin' },
  { id: 'parent', name: 'Parent' },
];

const RoleSelector = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Select Your Role</h2>
      <div className="grid grid-cols-1 gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            onClick={() => onSelect(role.id)}
          >
            {role.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;