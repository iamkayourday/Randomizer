// components/Header.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRandom, 
  faSun, 
  faMoon, 
  faHistory, 
  faSave,
  faBookmark,
  faPalette
} from '@fortawesome/free-solid-svg-icons';

const Header = ({ 
  darkMode, 
  toggleDarkMode, 
  onShowHistory, 
  onShowSavedLists,
  selectedTheme,
  onThemeSelect 
}) => {
  const themes = [
    { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
    { id: 'emerald', name: 'Emerald', color: 'bg-emerald-500' },
    { id: 'violet', name: 'Violet', color: 'bg-violet-500' },
    { id: 'amber', name: 'Amber', color: 'bg-amber-500' },
    { id: 'rose', name: 'Rose', color: 'bg-rose-500' },
    { id: 'indigo', name: 'Indigo', color: 'bg-indigo-500' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-800 border-b border-gray-700' 
        : 'bg-white border-b border-gray-200'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-lg ${themes.find(t => t.id === selectedTheme)?.color} text-white`}>
              <FontAwesomeIcon icon={faRandom} className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">GroupRandomizer</h1>
              <p className="text-xs opacity-75">Create balanced teams instantly</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Selector Dropdown */}
            <div className="relative group">
              <button className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}>
                <FontAwesomeIcon icon={faPalette} />
              </button>
              <div className={`absolute right-0 top-full mt-2 py-2 w-48 rounded-lg shadow-lg border transform opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Select Theme
                </div>
                <div className="grid grid-cols-3 gap-2 p-3">
                  {themes.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => onThemeSelect(theme.id)}
                      className={`h-8 rounded-md flex items-center justify-center ${
                        selectedTheme === theme.id 
                          ? 'ring-2 ring-offset-1 ring-gray-400' 
                          : ''
                      }`}
                    >
                      <div className={`w-6 h-6 rounded ${theme.color} transition-transform hover:scale-110`}></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* History Button */}
            <button
              onClick={onShowHistory}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="View History"
            >
              <FontAwesomeIcon icon={faHistory} />
              <span className="text-sm hidden sm:inline">History</span>
            </button>

            {/* Saved Lists Button */}
            <button
              onClick={onShowSavedLists}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Saved Lists"
            >
              <FontAwesomeIcon icon={faBookmark} />
              <span className="text-sm hidden sm:inline">Saved</span>
            </button>

            {/* Save Current Button */}
            <button
              onClick={() => {/* Will be implemented */}}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Save Current List"
            >
              <FontAwesomeIcon icon={faSave} />
              <span className="text-sm hidden sm:inline">Save</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;