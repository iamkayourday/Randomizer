// components/InputSection.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRandom, 
  faUsers, 
  faUserPlus, 
  faDownload, 
  faUpload, 
  faTrash,
  faLightbulb,
  faShuffle,
  faCrown,
  faBookmark,
  faSearch,
  faTimes,
  faCopy,
  faPaste
} from '@fortawesome/free-solid-svg-icons';

const InputSection = ({
  darkMode,
  eventTitle,
  setEventTitle,
  participantNames,
  setParticipantNames,
  participantsCount,
  groupingMethod,
  setGroupingMethod,
  numberOfGroups,
  setNumberOfGroups,
  participantsPerGroup,
  setParticipantsPerGroup,
  selectedTheme,
  onCreateGroups,
  participants,
  onSaveList,
  onLoadList,
  savedLists
}) => {
  const themes = {
    blue: { bg: 'bg-blue-500', text: 'text-blue-500', hover: 'hover:bg-blue-600' },
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-500', hover: 'hover:bg-emerald-600' },
    violet: { bg: 'bg-violet-500', text: 'text-violet-500', hover: 'hover:bg-violet-600' },
    amber: { bg: 'bg-amber-500', text: 'text-amber-500', hover: 'hover:bg-amber-600' },
    rose: { bg: 'bg-rose-500', text: 'text-rose-500', hover: 'hover:bg-rose-600' },
    indigo: { bg: 'bg-indigo-500', text: 'text-indigo-500', hover: 'hover:bg-indigo-600' },
  };

  const theme = themes[selectedTheme] || themes.blue;
  const [showSavedLists, setShowSavedLists] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddText, setQuickAddText] = useState('');
  const [searchSaved, setSearchSaved] = useState('');
  const [copied, setCopied] = useState(false);

  // Sample name sets for quick add
  const sampleSets = [
    { name: 'Class Students', count: 25, emoji: '👨‍🎓', description: 'Perfect for classroom activities' },
    { name: 'Team Members', count: 12, emoji: '👥', description: 'Workshop or team building' },
    { name: 'Conference', count: 30, emoji: '🎤', description: 'Conference breakout sessions' },
    { name: 'Sports Team', count: 15, emoji: '⚽', description: 'Sports or game teams' },
    { name: 'Book Club', count: 10, emoji: '📚', description: 'Small group discussions' },
    { name: 'Workshop', count: 20, emoji: '🎨', description: 'Creative workshop groups' },
  ];

  const getCalculatedValue = () => {
    if (participants.length === 0) return 0;
    return groupingMethod === 'groups' 
      ? Math.ceil(participants.length / numberOfGroups)
      : Math.ceil(participants.length / participantsPerGroup);
  };

  const addSampleSet = (count, type) => {
    let sampleNames = [];
    switch(type) {
      case 'class':
        sampleNames = Array.from({ length: count }, (_, i) => 
          `Student ${String.fromCharCode(65 + Math.floor(i / 10))}${(i % 10) + 1}`
        );
        break;
      case 'team':
        sampleNames = Array.from({ length: count }, (_, i) => 
          `Team Member ${i + 1}`
        );
        break;
      case 'conference':
        sampleNames = Array.from({ length: count }, (_, i) => 
          `Attendee ${i + 1}`
        );
        break;
      case 'sports':
        sampleNames = Array.from({ length: count }, (_, i) => 
          `Player ${i + 1}`
        );
        break;
      default:
        sampleNames = Array.from({ length: count }, (_, i) => 
          `Participant ${i + 1}`
        );
    }
    setParticipantNames(prev => prev ? `${prev}\n${sampleNames.join('\n')}` : sampleNames.join('\n'));
    setShowQuickAdd(false);
  };

  const handleQuickAdd = () => {
    if (quickAddText.trim()) {
      const names = quickAddText.split('\n')
        .map(name => name.trim())
        .filter(name => name)
        .join('\n');
      setParticipantNames(prev => prev ? `${prev}\n${names}` : names);
      setQuickAddText('');
      setShowQuickAdd(false);
    }
  };

  const shuffleNames = () => {
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    setParticipantNames(shuffled.join('\n'));
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all fields?')) {
      setEventTitle('');
      setParticipantNames('');
      setNumberOfGroups(3);
      setParticipantsPerGroup(4);
    }
  };

  const handleSaveCurrentList = () => {
    if (participants.length === 0) {
      alert('Please add participants before saving the list');
      return;
    }

    const defaultName = eventTitle || `List ${savedLists.length + 1}`;
    const listName = window.prompt('Enter a name for this list:', defaultName);
    if (listName) {
      onSaveList({
        name: listName,
        eventTitle,
        participantNames,
        count: participants.length
      });
    }
  };

  const handleCopyNames = () => {
    navigator.clipboard.writeText(participantNames);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasteNames = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        setParticipantNames(prev => prev ? `${prev}\n${text}` : text);
      }
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  const filteredSavedLists = savedLists.filter(list =>
    list.name.toLowerCase().includes(searchSaved.toLowerCase()) ||
    (list.eventTitle && list.eventTitle.toLowerCase().includes(searchSaved.toLowerCase()))
  );

  return (
    <div className={`rounded-xl border transition-colors ${
      darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${theme.bg} bg-opacity-10`}>
              <FontAwesomeIcon icon={faUsers} className={theme.text} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Create Random Groups</h2>
              <p className="text-sm opacity-75">Configure settings and manage participants</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={clearAll}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode 
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              title="Clear all fields"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              Clear All
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-6">
        {/* Event Title */}
        <div>
          <label className="block mb-2 font-medium">
            <FontAwesomeIcon icon={faCrown} className="mr-2 text-amber-500" />
            Event Title
            <span className="ml-2 text-xs font-normal opacity-75">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="Team Building Workshop, Classroom Activity..."
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              darkMode 
                ? 'bg-gray-900 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                : 'bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            }`}
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
        </div>

        {/* Participants Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium">
              Participants
              <span className={`ml-3 px-2 py-1 rounded text-xs font-bold ${theme.bg} text-white`}>
                {participantsCount}
              </span>
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSavedLists(!showSavedLists)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
                title="Load saved lists"
              >
                <FontAwesomeIcon icon={faBookmark} className="mr-2" />
                Saved Lists
              </button>
              <button
                onClick={handleSaveCurrentList}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
                title="Save current list"
              >
                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                Save List
              </button>
              <button
                onClick={shuffleNames}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
                title="Shuffle participants"
              >
                <FontAwesomeIcon icon={faShuffle} className="mr-2" />
                Shuffle
              </button>
              <button
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${theme.bg} ${theme.hover} text-white`}
                title="Quick add participants"
              >
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                Quick Add
              </button>
            </div>
          </div>

          {/* Quick Add Modal */}
          {showQuickAdd && (
            <div className={`mb-4 p-4 rounded-lg border ${
              darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-300'
            }`}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">
                  <FontAwesomeIcon icon={faLightbulb} className="mr-2 text-amber-500" />
                  Quick Add Participants
                </h4>
                <button
                  onClick={() => setShowQuickAdd(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm opacity-75 mb-3">Select a template or enter custom names:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {sampleSets.map(set => (
                    <button
                      key={set.name}
                      onClick={() => addSampleSet(set.count, set.name.toLowerCase().replace(' ', ''))}
                      className={`p-3 rounded-lg border text-left transition-all hover:scale-[1.02] ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-600 hover:border-blue-500' 
                          : 'bg-white border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">{set.emoji}</span>
                        <div>
                          <div className="font-medium">{set.name}</div>
                          <div className="text-xs opacity-75">{set.description}</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{set.count} participants</span>
                        <span className={`text-xs px-2 py-1 rounded ${theme.bg} text-white`}>
                          Add
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Or enter custom names:</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePasteNames}
                      className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                      title="Paste from clipboard"
                    >
                      <FontAwesomeIcon icon={faPaste} className="mr-1" />
                      Paste
                    </button>
                  </div>
                </div>
                <textarea
                  placeholder="Enter names, one per line or separated by commas..."
                  className={`w-full px-4 py-2 rounded-lg border mb-3 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 focus:border-blue-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500'
                  }`}
                  rows="3"
                  value={quickAddText}
                  onChange={(e) => setQuickAddText(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <div className="text-xs opacity-75">
                    {quickAddText.split(/[\n,]/).filter(n => n.trim()).length} names entered
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowQuickAdd(false)}
                      className={`px-4 py-2 rounded-lg ${
                        darkMode 
                          ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleQuickAdd}
                      className={`px-4 py-2 rounded-lg ${theme.bg} ${theme.hover} text-white`}
                      disabled={!quickAddText.trim()}
                    >
                      Add Participants
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Saved Lists Modal */}
          {showSavedLists && (
            <div className={`mb-4 p-4 rounded-lg border ${
              darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-300'
            }`}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faBookmark} className="mr-2 text-amber-500" />
                  <h4 className="font-medium">Saved Lists</h4>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {savedLists.length} saved
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {savedLists.length > 0 && (
                    <div className="relative">
                      <FontAwesomeIcon 
                        icon={faSearch} 
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      />
                      <input
                        type="text"
                        placeholder="Search lists..."
                        className={`pl-10 pr-4 py-1.5 rounded-lg border text-sm ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-600' 
                            : 'bg-white border-gray-300'
                        }`}
                        value={searchSaved}
                        onChange={(e) => setSearchSaved(e.target.value)}
                      />
                    </div>
                  )}
                  <button
                    onClick={() => setShowSavedLists(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </div>
              
              {savedLists.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <FontAwesomeIcon icon={faBookmark} className="text-2xl text-gray-400" />
                  </div>
                  <p className="opacity-75 mb-4">No saved lists yet</p>
                  <button
                    onClick={handleSaveCurrentList}
                    className={`px-4 py-2 rounded-lg ${theme.bg} ${theme.hover} text-white text-sm`}
                  >
                    Save Current List
                  </button>
                </div>
              ) : filteredSavedLists.length === 0 ? (
                <div className="text-center py-8">
                  <p className="opacity-75">No lists found for "{searchSaved}"</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {filteredSavedLists.map((list, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer hover:border-blue-500 transition-colors group ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-600' 
                          : 'bg-white border-gray-200'
                      }`}
                      onClick={() => {
                        onLoadList(list);
                        setShowSavedLists(false);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{list.name || 'Unnamed List'}</div>
                          <div className="flex items-center space-x-3 mt-1 text-sm opacity-75">
                            {list.eventTitle && (
                              <span className="truncate max-w-[150px]" title={list.eventTitle}>
                                {list.eventTitle}
                              </span>
                            )}
                            <span className="flex items-center">
                              <FontAwesomeIcon icon={faUsers} className="mr-1 text-xs" />
                              {list.count || 0} participants
                            </span>
                            {list.date && (
                              <span className="text-xs">{list.date}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onLoadList(list);
                              setShowSavedLists(false);
                            }}
                            className={`px-2 py-1 rounded text-xs ${theme.bg} text-white`}
                          >
                            Load
                          </button>
                        </div>
                      </div>
                      {list.participantNames && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {list.participantNames
                            .split('\n')
                            .slice(0, 3)
                            .filter(name => name.trim())
                            .map((name, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded text-xs ${
                                  darkMode 
                                    ? 'bg-gray-700 text-gray-300' 
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {name.trim()}
                              </span>
                            ))}
                          {list.participantNames.split('\n').filter(name => name.trim()).length > 3 && (
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              darkMode 
                                ? 'bg-gray-700 text-gray-300' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              +{list.participantNames.split('\n').filter(name => name.trim()).length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Main Textarea with Copy/Paste */}
          <div className="relative">
            <div className="absolute right-3 top-3 z-10 flex space-x-2">
              <button
                onClick={handleCopyNames}
                className={`p-1.5 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                title="Copy names to clipboard"
              >
                <FontAwesomeIcon icon={faCopy} className="text-sm" />
              </button>
              <button
                onClick={handlePasteNames}
                className={`p-1.5 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                title="Paste names from clipboard"
              >
                <FontAwesomeIcon icon={faPaste} className="text-sm" />
              </button>
            </div>
            <textarea
              placeholder={`Enter participant names:\n\nExamples:\n• John Doe\n• Jane Smith\n• Alex Johnson\n\nOr separate by commas:\nJohn, Jane, Alex, Maria, David`}
              className={`w-full px-4 py-3 rounded-lg border transition-colors min-h-[180px] pr-20 ${
                darkMode 
                  ? 'bg-gray-900 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                  : 'bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              }`}
              value={participantNames}
              onChange={(e) => setParticipantNames(e.target.value)}
            />
            {copied && (
              <div className={`absolute bottom-3 right-3 px-2 py-1 rounded text-xs ${
                darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
              }`}>
                Copied!
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm opacity-75">
              {participantsCount} names entered • {participantsCount > 0 ? 'Ready to group!' : 'Add participants to begin'}
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">
                {participantsCount} total
              </div>
              {participantsCount > 0 && (
                <button
                  onClick={shuffleNames}
                  className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <FontAwesomeIcon icon={faShuffle} className="mr-1" />
                  Shuffle
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Group Configuration */}
        <div className={`p-4 rounded-lg border ${
          darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-300'
        }`}>
          <h3 className="font-bold mb-4">Group Configuration</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">Grouping Method</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setGroupingMethod('groups')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    groupingMethod === 'groups' 
                      ? `${theme.bg} text-white shadow-md` 
                      : darkMode 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Number of Groups
                </button>
                <button
                  onClick={() => setGroupingMethod('participants')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    groupingMethod === 'participants' 
                      ? `${theme.bg} text-white shadow-md` 
                      : darkMode 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Group Size
                </button>
              </div>
            </div>
            
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">
                    {groupingMethod === 'groups' ? 'Number of Groups' : 'Participants per Group'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max={groupingMethod === 'groups' ? participants.length : 100}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-600 focus:border-blue-500' 
                          : 'bg-white border-gray-300 focus:border-blue-500'
                      }`}
                      value={groupingMethod === 'groups' ? numberOfGroups : participantsPerGroup}
                      onChange={(e) => {
                        const value = Math.max(1, parseInt(e.target.value) || 1);
                        if (groupingMethod === 'groups') {
                          setNumberOfGroups(value);
                        } else {
                          setParticipantsPerGroup(value);
                        }
                      }}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm opacity-75">
                      {groupingMethod === 'groups' ? 'groups' : 'each'}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-medium">
                    {groupingMethod === 'groups' ? 'Participants per Group' : 'Number of Groups'}
                  </label>
                  <div className={`px-4 py-3 rounded-lg border ${
                    darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">{getCalculatedValue()}</span>
                      <span className="text-sm opacity-75">
                        {groupingMethod === 'groups' ? 'each' : 'groups'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          {participantsCount > 0 && (
            <div className="pt-4 mt-4 border-t border-gray-700/30 dark:border-gray-600/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-75">Distribution Preview</span>
                <span className="text-sm font-medium">{participantsCount} participants</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div 
                  className={`h-full ${theme.bg} transition-all duration-500`}
                  style={{ 
                    width: `${Math.min(100, (getCalculatedValue() * 20))}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1 opacity-75">
                <span>
                  {groupingMethod === 'groups' 
                    ? `${numberOfGroups} groups`
                    : `${participantsPerGroup} per group`
                  }
                </span>
                <span>
                  {groupingMethod === 'groups'
                    ? `~${Math.ceil(participantsCount / numberOfGroups)} each`
                    : `${getCalculatedValue()} groups`
                  }
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Create Groups Button */}
        <div className="space-y-3">
          <button
            onClick={onCreateGroups}
            disabled={participantsCount === 0}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${theme.bg} ${theme.hover} text-white flex items-center justify-center space-x-3 shadow-lg`}
          >
            <FontAwesomeIcon icon={faRandom} className="text-xl animate-pulse" />
            <span>Generate Random Groups</span>
          </button>
          
          {/* Stats */}
          {participantsCount > 0 && (
            <div className={`text-center p-3 rounded-lg text-sm ${
              darkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="font-medium">
                    {groupingMethod === 'groups' ? numberOfGroups : getCalculatedValue()}
                  </div>
                  <div className="text-xs opacity-75">
                    {groupingMethod === 'groups' ? 'Groups' : 'Total Groups'}
                  </div>
                </div>
                <div className={`p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="font-medium">
                    {groupingMethod === 'groups' 
                      ? Math.ceil(participantsCount / numberOfGroups)
                      : participantsPerGroup
                    }
                  </div>
                  <div className="text-xs opacity-75">
                    {groupingMethod === 'groups' ? 'Per Group' : 'Per Group'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputSection;