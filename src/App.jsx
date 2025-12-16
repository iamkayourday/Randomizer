// App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import SpinnerWheel from './components/SpinnerWheel';
import ResultsDisplay from './components/ResultsDisplay';
import HistoryModal from './components/HistoryModal';
import SavedListsModal from './components/SavedListsModal';
import { 
  loadFromStorage, 
  saveToStorage, 
  addToHistory, 
  saveList,
  deleteSavedList,
  deleteHistoryItem,
  clearAllHistory,
  storageKeys 
} from './utils/storage';
import { createGroups, getParticipantsList } from './utils/groupUtils';

const App = () => {
  // Load initial state from localStorage
  const [darkMode, setDarkMode] = useState(() => 
    loadFromStorage(storageKeys.DARK_MODE, false)
  );
  const [selectedTheme, setSelectedTheme] = useState(() => 
    loadFromStorage(storageKeys.SELECTED_THEME, 'blue')
  );
  const [eventTitle, setEventTitle] = useState('');
  const [participantNames, setParticipantNames] = useState('');
  const [groupingMethod, setGroupingMethod] = useState('groups');
  const [numberOfGroups, setNumberOfGroups] = useState(3);
  const [participantsPerGroup, setParticipantsPerGroup] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [groups, setGroups] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSavedLists, setShowSavedLists] = useState(false);
  
  const [history, setHistory] = useState(() => 
    loadFromStorage(storageKeys.HISTORY, [])
  );
  const [savedLists, setSavedLists] = useState(() => 
    loadFromStorage(storageKeys.SAVED_LISTS, [])
  );

  const participants = getParticipantsList(participantNames);

  // Save to localStorage when state changes
  useEffect(() => {
    saveToStorage(storageKeys.DARK_MODE, darkMode);
  }, [darkMode]);

  useEffect(() => {
    saveToStorage(storageKeys.SELECTED_THEME, selectedTheme);
  }, [selectedTheme]);

  useEffect(() => {
    if (participants.length > 0) {
      if (groupingMethod === 'groups') {
        setParticipantsPerGroup(Math.ceil(participants.length / numberOfGroups));
      } else {
        setNumberOfGroups(Math.ceil(participants.length / participantsPerGroup));
      }
    }
  }, [participants.length, numberOfGroups, participantsPerGroup, groupingMethod]);

  const createRandomGroups = () => {
    if (participants.length === 0) return;
    
    setSpinning(true);
    
    setTimeout(() => {
      const newGroups = createGroups(
        participants, 
        groupingMethod, 
        groupingMethod === 'groups' ? numberOfGroups : participantsPerGroup,
        true // Enable leader assignment
      );
      setGroups(newGroups);
      setSpinning(false);
      setShowResults(true);
      
      // Save to history
      const historyItem = {
        eventTitle,
        groups: newGroups,
        totalParticipants: participants.length,
        groupingMethod,
        numberOfGroups: groupingMethod === 'groups' ? numberOfGroups : newGroups.length,
        participantsPerGroup: groupingMethod === 'participants' ? participantsPerGroup : Math.ceil(participants.length / numberOfGroups),
        theme: selectedTheme,
      };
      const updatedHistory = addToHistory(historyItem);
      setHistory(updatedHistory);
    }, 3000);
  };

  const regenerateGroups = () => {
    createRandomGroups();
  };

  const handleSaveList = (listData) => {
    const newSavedLists = saveList({
      ...listData,
      name: listData.eventTitle || `List ${savedLists.length + 1}`,
      count: getParticipantsList(listData.participantNames).length,
    });
    setSavedLists(newSavedLists);
    alert('List saved successfully!');
  };

  const handleLoadList = (list) => {
    setEventTitle(list.eventTitle || '');
    setParticipantNames(list.participantNames || '');
    setShowSavedLists(false);
  };

  const handleLoadHistory = (historyItem) => {
    setEventTitle(historyItem.eventTitle || '');
    setGroupingMethod(historyItem.groupingMethod || 'groups');
    setNumberOfGroups(historyItem.numberOfGroups || 3);
    setParticipantsPerGroup(historyItem.participantsPerGroup || 4);
    setSelectedTheme(historyItem.theme || 'blue');
    setGroups(historyItem.groups || []);
    setShowResults(true);
    setShowHistory(false);
  };

  const handleDeleteHistory = (id) => {
    const updatedHistory = deleteHistoryItem(id);
    setHistory(updatedHistory);
  };

  const handleDeleteSavedList = (id) => {
    const updatedSavedLists = deleteSavedList(id);
    setSavedLists(updatedSavedLists);
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      const clearedHistory = clearAllHistory();
      setHistory(clearedHistory);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <Header 
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onShowHistory={() => setShowHistory(true)}
        onShowSavedLists={() => setShowSavedLists(true)}
        selectedTheme={selectedTheme}
        onThemeSelect={setSelectedTheme}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {!showResults ? (
          <>
            <InputSection 
              darkMode={darkMode}
              eventTitle={eventTitle}
              setEventTitle={setEventTitle}
              participantNames={participantNames}
              setParticipantNames={setParticipantNames}
              participantsCount={participants.length}
              groupingMethod={groupingMethod}
              setGroupingMethod={setGroupingMethod}
              numberOfGroups={numberOfGroups}
              setNumberOfGroups={setNumberOfGroups}
              participantsPerGroup={participantsPerGroup}
              setParticipantsPerGroup={setParticipantsPerGroup}
              selectedTheme={selectedTheme}
              onCreateGroups={createRandomGroups}
              participants={participants}
              onSaveList={handleSaveList}
              onLoadList={handleLoadList}
              savedLists={savedLists}
            />
            
            {spinning && (
              <div className="mt-6">
                <SpinnerWheel 
                  darkMode={darkMode}
                  participants={participants}
                  selectedTheme={selectedTheme}
                  soundEnabled={soundEnabled}
                  toggleSound={() => setSoundEnabled(!soundEnabled)}
                />
              </div>
            )}
          </>
        ) : (
          <ResultsDisplay 
            darkMode={darkMode}
            eventTitle={eventTitle}
            groups={groups}
            selectedTheme={selectedTheme}
            onBack={() => setShowResults(false)}
            onRegenerate={regenerateGroups}
          />
        )}
      </main>

      {showHistory && (
        <HistoryModal
          darkMode={darkMode}
          history={history}
          onLoadHistory={handleLoadHistory}
          onDeleteHistory={handleDeleteHistory}
          onClearAll={handleClearAllHistory}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showSavedLists && (
        <SavedListsModal
          darkMode={darkMode}
          savedLists={savedLists}
          onLoadList={handleLoadList}
          onDeleteList={handleDeleteSavedList}
          onClose={() => setShowSavedLists(false)}
        />
      )}
    </div>
  );
};

export default App;