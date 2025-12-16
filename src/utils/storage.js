// utils/storage.js
export const storageKeys = {
  DARK_MODE: 'groupRandomizer_darkMode',
  SELECTED_THEME: 'groupRandomizer_selectedTheme',
  HISTORY: 'groupRandomizer_history',
  SAVED_LISTS: 'groupRandomizer_savedLists',
  LAST_USED: 'groupRandomizer_lastUsed',
};

export const loadFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return defaultValue;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

export const addToHistory = (result) => {
  const history = loadFromStorage(storageKeys.HISTORY, []);
  const newHistory = [
    {
      ...result,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      formattedDate: new Date().toLocaleString(),
    },
    ...history.slice(0, 49), // Keep only last 50 items
  ];
  saveToStorage(storageKeys.HISTORY, newHistory);
  return newHistory;
};

// Update the saveList function in utils/storage.js
export const saveList = (listData) => {
  const savedLists = loadFromStorage(storageKeys.SAVED_LISTS, []);
  const newList = {
    id: Date.now(),
    name: listData.name || `List ${savedLists.length + 1}`,
    eventTitle: listData.eventTitle || '',
    participantNames: listData.participantNames || '',
    count: listData.count || 0,
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
  };
  
  const newSavedLists = [newList, ...savedLists];
  saveToStorage(storageKeys.SAVED_LISTS, newSavedLists);
  return newSavedLists;
};

export const deleteSavedList = (id) => {
  const savedLists = loadFromStorage(storageKeys.SAVED_LISTS, []);
  const newSavedLists = savedLists.filter(list => list.id !== id);
  saveToStorage(storageKeys.SAVED_LISTS, newSavedLists);
  return newSavedLists;
};

export const deleteHistoryItem = (id) => {
  const history = loadFromStorage(storageKeys.HISTORY, []);
  const newHistory = history.filter(item => item.id !== id);
  saveToStorage(storageKeys.HISTORY, newHistory);
  return newHistory;
};

export const clearAllHistory = () => {
  saveToStorage(storageKeys.HISTORY, []);
  return [];
};

