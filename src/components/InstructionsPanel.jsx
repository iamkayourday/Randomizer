import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const InstructionsPanel = ({ darkMode, onClose }) => {
  return (
    <div className={`mx-4 sm:mx-auto max-w-5xl p-6 rounded-lg shadow-md mb-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">How to Use Group Randomizer</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">1. Enter Participant Names</h3>
          <p className="text-sm">Type or paste names separated by commas or new lines. Example:</p>
          <pre className={`p-2 rounded mt-1 text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            John Doe, Jane Smith{'\n'}Mike Johnson{'\n'}Sarah Williams
          </pre>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-2">2. Choose Grouping Method</h3>
          <p className="text-sm">Select either:</p>
          <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
            <li><strong>Number of Groups</strong> - Specify how many groups you want</li>
            <li><strong>Participants per Group</strong> - Specify how many people in each group</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-2">3. Create Groups</h3>
          <p className="text-sm">Click "Create Groups" to randomly distribute participants. Watch the spinning animation!</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-2">4. Export Results</h3>
          <p className="text-sm">After groups are created, you can:</p>
          <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
            <li>Save as PDF/Image/CSV</li>
            <li>Copy to clipboard</li>
            <li>Print directly</li>
            <li>Regenerate groups if needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPanel;