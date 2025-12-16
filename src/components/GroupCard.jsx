// components/GroupCard.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faUser } from '@fortawesome/free-solid-svg-icons';

const GroupCard = ({ group, index, selectedTheme, darkMode }) => {
  const themes = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    violet: 'bg-violet-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    indigo: 'bg-indigo-500',
  };

  const theme = themes[selectedTheme] || themes.blue;

  return (
    <div className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className={`px-4 py-3 ${theme} text-white rounded-t-lg`}>
        <div className="flex justify-between items-center">
          <h3 className="font-bold">Group {index + 1}</h3>
          <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
            {group.length} members
          </span>
        </div>
      </div>
      <div className="p-4">
        <ul className="space-y-2">
          {group.map((participant, pIndex) => (
            <li key={pIndex} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                pIndex === 0 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'
              }`}>
                <FontAwesomeIcon icon={pIndex === 0 ? faCrown : faUser} />
              </div>
              <span className={pIndex === 0 ? 'font-bold text-amber-600' : ''}>
                {participant}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupCard;
