// components/SavedListsModal.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookmark, 
  faTrash, 
  faDownload, 
  faEdit, 
  faUsers,
  faCalendar,
  faSearch,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const SavedListsModal = ({ darkMode, savedLists, onLoadList, onDeleteList, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const filteredLists = savedLists.filter(list => 
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (list.eventTitle && list.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleEdit = (list) => {
    setEditingId(list.id);
    setEditName(list.name);
  };

  const handleSaveEdit = (id) => {
    const listToUpdate = savedLists.find(list => list.id === id);
    if (listToUpdate) {
      const updatedList = { ...listToUpdate, name: editName };
      // Here you would typically update in localStorage
      // For now, we'll just close edit mode
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50" 
          onClick={onClose}
        />

        {/* Modal */}
        <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`px-6 py-4 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faBookmark} className="text-amber-500 text-xl" />
                <h3 className="text-xl font-bold">Saved Lists</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {savedLists.length} lists
                </span>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg ${
                  darkMode 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="mt-4">
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search saved lists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-900 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                      : 'bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {savedLists.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                  <FontAwesomeIcon icon={faBookmark} className="text-2xl text-gray-400" />
                </div>
                <h4 className="text-lg font-medium mb-2">No Saved Lists</h4>
                <p className="opacity-75 mb-4">
                  Save your participant lists for quick access later
                </p>
                <button
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  Start Creating Lists
                </button>
              </div>
            ) : filteredLists.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                  <FontAwesomeIcon icon={faSearch} className="text-2xl text-gray-400" />
                </div>
                <h4 className="text-lg font-medium mb-2">No Results Found</h4>
                <p className="opacity-75">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLists.map((list) => (
                  <div
                    key={list.id}
                    className={`rounded-lg border p-4 hover:border-blue-400 transition-colors ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        {editingId === list.id ? (
                          <div className="flex items-center space-x-2 mb-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className={`flex-1 px-3 py-1.5 rounded border ${
                                darkMode 
                                  ? 'bg-gray-800 border-gray-600' 
                                  : 'bg-white border-gray-300'
                              }`}
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(list.id)}
                              className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className={`px-3 py-1.5 rounded ${
                                darkMode 
                                  ? 'bg-gray-700 hover:bg-gray-600' 
                                  : 'bg-gray-200 hover:bg-gray-300'
                              }`}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <h4 className="font-medium truncate">{list.name}</h4>
                        )}
                        
                        <div className="flex items-center space-x-3 mt-1 text-sm opacity-75">
                          {list.eventTitle && (
                            <span className="truncate max-w-[200px]" title={list.eventTitle}>
                              {list.eventTitle}
                            </span>
                          )}
                          <span className="flex items-center whitespace-nowrap">
                            <FontAwesomeIcon icon={faUsers} className="mr-1 text-xs" />
                            {list.count || 0} participants
                          </span>
                          <span className="flex items-center whitespace-nowrap">
                            <FontAwesomeIcon icon={faCalendar} className="mr-1 text-xs" />
                            {list.date || formatDate(list.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4 flex-shrink-0">
                        <button
                          onClick={() => onLoadList(list)}
                          className={`px-3 py-1.5 rounded text-sm font-medium ${
                            darkMode 
                              ? 'bg-blue-600 hover:bg-blue-700' 
                              : 'bg-blue-500 hover:bg-blue-600'
                          } text-white`}
                          title="Load this list"
                        >
                          <FontAwesomeIcon icon={faDownload} className="mr-1" />
                          Load
                        </button>
                        <button
                          onClick={() => handleEdit(list)}
                          className={`p-1.5 rounded ${
                            darkMode 
                              ? 'text-gray-400 hover:text-amber-400 hover:bg-gray-700' 
                              : 'text-gray-500 hover:text-amber-500 hover:bg-gray-100'
                          }`}
                          title="Edit list name"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => onDeleteList(list.id)}
                          className={`p-1.5 rounded ${
                            darkMode 
                              ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
                              : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'
                          }`}
                          title="Delete list"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                    
                    {/* List Preview */}
                    {list.participantNames && (
                      <div className={`mt-3 p-3 rounded text-sm ${
                        darkMode ? 'bg-gray-800' : 'bg-gray-100'
                      }`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Preview:</span>
                          <span className="text-xs opacity-75">
                            {list.participantNames.split('\n').slice(0, 3).length} of {list.count} shown
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {list.participantNames
                            .split('\n')
                            .slice(0, 5)
                            .filter(name => name.trim())
                            .map((name, index) => (
                              <span
                                key={index}
                                className={`px-2 py-1 rounded text-xs ${
                                  darkMode 
                                    ? 'bg-gray-700 text-gray-300' 
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                {name.trim()}
                              </span>
                            ))}
                          {list.participantNames.split('\n').filter(name => name.trim()).length > 5 && (
                            <span className={`px-2 py-1 rounded text-xs ${
                              darkMode 
                                ? 'bg-gray-700 text-gray-300' 
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              +{list.participantNames.split('\n').filter(name => name.trim()).length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {savedLists.length > 0 && (
            <div className={`px-6 py-4 border-t ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-75">
                  {filteredLists.length} of {savedLists.length} lists shown
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete all saved lists?')) {
                        // Clear all saved lists
                        localStorage.removeItem('groupRandomizer_savedLists');
                        window.location.reload();
                      }
                    }}
                    className={`px-3 py-1.5 rounded font-medium ${
                      darkMode 
                        ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' 
                        : 'text-red-500 hover:text-red-600 hover:bg-gray-100'
                    }`}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedListsModal;