// components/HistoryModal.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faTrash, faEye, faCopy, faCalendar, faUsers } from '@fortawesome/free-solid-svg-icons';

const HistoryModal = ({ darkMode, history, onLoadHistory, onDeleteHistory, onClearAll, onClose }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                <FontAwesomeIcon icon={faHistory} className="text-blue-500 text-xl" />
                <h3 className="text-xl font-bold">History</h3>
              </div>
              <div className="flex items-center space-x-2">
                {history.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className={`px-3 py-1.5 rounded text-sm font-medium ${
                      darkMode 
                        ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' 
                        : 'text-red-500 hover:text-red-600 hover:bg-gray-100'
                    }`}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                    Clear All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg ${
                    darkMode 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                  <FontAwesomeIcon icon={faHistory} className="text-2xl text-gray-400" />
                </div>
                <h4 className="text-lg font-medium mb-2">No History Yet</h4>
                <p className="opacity-75">
                  Your group randomization history will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-lg border p-4 ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">
                          {item.eventTitle || 'Untitled Session'}
                        </h4>
                        <div className="flex items-center space-x-3 mt-1 text-sm opacity-75">
                          <span className="flex items-center">
                            <FontAwesomeIcon icon={faCalendar} className="mr-1 text-xs" />
                            {formatDate(item.timestamp)}
                          </span>
                          <span className="flex items-center">
                            <FontAwesomeIcon icon={faUsers} className="mr-1 text-xs" />
                            {item.totalParticipants} participants
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.groups?.length > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''
                          }`}>
                            {item.groups?.length} groups
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onLoadHistory(item)}
                          className={`px-3 py-1.5 rounded text-sm font-medium ${
                            darkMode 
                              ? 'bg-blue-600 hover:bg-blue-700' 
                              : 'bg-blue-500 hover:bg-blue-600'
                          } text-white`}
                          title="Load this session"
                        >
                          <FontAwesomeIcon icon={faEye} className="mr-1" />
                          Load
                        </button>
                        <button
                          onClick={() => onDeleteHistory(item.id)}
                          className={`p-1.5 rounded ${
                            darkMode 
                              ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
                              : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'
                          }`}
                          title="Delete from history"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                    
                    {item.groups && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                        {item.groups.slice(0, 4).map((group, index) => (
                          <div
                            key={index}
                            className={`px-3 py-2 rounded text-sm ${
                              darkMode ? 'bg-gray-800' : 'bg-gray-100'
                            }`}
                          >
                            <div className="font-medium">Group {index + 1}</div>
                            <div className="opacity-75 truncate">{group.length} members</div>
                          </div>
                        ))}
                        {item.groups.length > 4 && (
                          <div className={`px-3 py-2 rounded text-sm text-center ${
                            darkMode ? 'bg-gray-800' : 'bg-gray-100'
                          }`}>
                            +{item.groups.length - 4} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;