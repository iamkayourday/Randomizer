import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRandom, faSun, faMoon, faSyncAlt, 
  faVolumeUp, faVolumeMute, faArrowLeft, 
  faFilePdf, faFileImage, faFileCsv, 
  faCopy, faPrint, faInfoCircle, faTimes
} from '@fortawesome/free-solid-svg-icons';
import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [participantNames, setParticipantNames] = useState('');
  const [groupingMethod, setGroupingMethod] = useState('groups'); // 'groups' or 'participants'
  const [numberOfGroups, setNumberOfGroups] = useState(2);
  const [participantsPerGroup, setParticipantsPerGroup] = useState(2);
  const [selectedTheme, setSelectedTheme] = useState('blue');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [groups, setGroups] = useState([]);
  const [showResults, setShowResults] = useState(false);
   const [showInstructions, setShowInstructions] = useState(true);

  const themes = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
  };

  const getParticipantsList = () => {
    if (!participantNames.trim()) return [];
    return participantNames
      .split(/[\n,]/)
      .map(name => name.trim())
      .filter(name => name !== '');
  };

  const participants = getParticipantsList();

  useEffect(() => {
    if (participants.length > 0) {
      if (groupingMethod === 'groups' && numberOfGroups > 0) {
        setParticipantsPerGroup(Math.ceil(participants.length / numberOfGroups));
      } else if (groupingMethod === 'participants' && participantsPerGroup > 0) {
        setNumberOfGroups(Math.ceil(participants.length / participantsPerGroup));
      }
    }
  }, [participants.length, numberOfGroups, participantsPerGroup, groupingMethod]);

  const createGroups = () => {
    if (participants.length === 0) return;
    
    setSpinning(true);
    
    // Shuffle participants
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    
    // Calculate groups based on selected method
    const calculatedGroups = groupingMethod === 'groups' 
      ? numberOfGroups 
      : Math.ceil(participants.length / participantsPerGroup);
    
    // Create groups
    const newGroups = [];
    for (let i = 0; i < calculatedGroups; i++) {
      newGroups.push([]);
    }
    
    // Distribute participants
    shuffled.forEach((participant, index) => {
      const groupIndex = index % calculatedGroups;
      newGroups[groupIndex].push(participant);
    });
    
    // Simulate spinning animation
    setTimeout(() => {
      setGroups(newGroups);
      setSpinning(false);
      setShowResults(true);
    }, 2000);
  };

  const regenerateGroups = () => {
    createGroups();
  };

  // Export functions
  const exportAsPDF = () => {
    const input = document.getElementById('groups-results');
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('groups.pdf');
    });
  };

  const exportAsImage = async (type = 'png') => {
    const element = document.getElementById('groups-results');
    const dataUrl = type === 'png' 
      ? await toPng(element) 
      : await toJpeg(element);
      
    const link = document.createElement('a');
    link.download = `groups.${type}`;
    link.href = dataUrl;
    link.click();
  };

  const exportAsCSV = () => {
    let csvContent = "Group,Member\n";
    groups.forEach((group, i) => {
      group.forEach(member => {
        csvContent += `Group ${i+1},${member}\n`;
      });
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'groups.csv';
    link.click();
  };

  const copyToClipboard = () => {
    let textContent = eventTitle ? `${eventTitle}\n\n` : '';
    groups.forEach((group, i) => {
      textContent += `Group ${i+1}:\n${group.join('\n')}\n\n`;
    });
    
    navigator.clipboard.writeText(textContent);
    alert('Groups copied to clipboard!');
  };

  const printGroups = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${eventTitle || 'Group Results'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            .group { margin-bottom: 20px; }
            .group-title { font-weight: bold; margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <h1>${eventTitle || 'Group Results'}</h1>
          ${groups.map((group, i) => `
            <div class="group">
              <div class="group-title">Group ${i+1}</div>
              <div>${group.join('<br>')}</div>
            </div>
          `).join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // Initialize wheel chart
  useEffect(() => {
    if (spinning && participants.length > 0) {
      const chartDom = document.getElementById('wheel-chart');
      if (!chartDom) return;
      
      const myChart = echarts.init(chartDom);
      const data = participants.map(name => ({
        name,
        value: 1
      }));
      
      const option = {
        animation: false,
        series: [
          {
            type: 'pie',
            radius: ['30%', '80%'],
            data,
            roseType: 'area',
            label: {
              show: true,
              formatter: '{b}'
            },
            itemStyle: {
              borderRadius: 8
            }
          }
        ]
      };
      
      myChart.setOption(option);
      
      return () => {
        myChart.dispose();
      };
    }
  }, [spinning, participants]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      {/* Header */}
      <header className={`px-4 sm:px-8 py-4 flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm sticky top-0 z-10`}>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faRandom} className={`text-2xl mr-2 ${themes[selectedTheme].text}`} />
          <h1 className="text-xl font-bold">Group Randomizer</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            aria-label="Instructions"
          >
            <FontAwesomeIcon icon={showInstructions ? faTimes : faInfoCircle} />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm flex items-center p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
          </button>
        </div>
      </header>

      {/* Instructions Panel */}
      {showInstructions && (
        <div className={`mx-4 sm:mx-auto max-w-5xl p-6 rounded-lg shadow-md mb-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">How to Use Group Randomizer</h2>
            <button 
              onClick={() => setShowInstructions(false)}
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
      )}

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {!showResults ? (
          <>
            {/* Input Section */}
            <div className={`p-6 rounded-lg shadow-md mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-2xl font-bold mb-6">Create Random Groups</h2>
              
              <div className="mb-6">
                <label htmlFor="event-title" className="block mb-2 font-medium">Event Title</label>
                <input
                  id="event-title"
                  type="text"
                  placeholder="Enter event name (optional)"
                  className={`w-full px-4 py-3 rounded-lg border-none ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="participant-names" className="block mb-2 font-medium">
                  Participant Names <span className="text-sm text-gray-500 ml-2">({participants.length} participants)</span>
                </label>
                <textarea
                  id="participant-names"
                  placeholder="Enter names separated by commas or new lines"
                  className={`w-full px-4 py-3 rounded-lg border-none min-h-[150px] ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  value={participantNames}
                  onChange={(e) => setParticipantNames(e.target.value)}
                ></textarea>
                <p className="text-sm mt-2 text-gray-500">Enter one name per line or separate with commas</p>
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 font-medium">Grouping Method</label>
                <div className="flex space-x-4">
                  <button
                    className={`px-4 py-2 rounded-lg ${groupingMethod === 'groups' ? themes[selectedTheme] + ' text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                    onClick={() => setGroupingMethod('groups')}
                  >
                    Number of Groups
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg ${groupingMethod === 'participants' ? themes[selectedTheme] + ' text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                    onClick={() => setGroupingMethod('participants')}
                  >
                    Participants per Group
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor={groupingMethod === 'groups' ? 'number-of-groups' : 'participants-per-group'} className="block mb-2 font-medium">
                    {groupingMethod === 'groups' ? 'Number of Groups' : 'Participants per Group'}
                  </label>
                  <input
                    id={groupingMethod === 'groups' ? 'number-of-groups' : 'participants-per-group'}
                    type="number"
                    min="1"
                    className={`w-full px-4 py-3 rounded-lg border-none ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                    value={groupingMethod === 'groups' ? numberOfGroups : participantsPerGroup}
                    // For Number of Groups input
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value) || 1);
                      if (groupingMethod === 'groups') {
                        setNumberOfGroups(value);
                      } else {
                        setParticipantsPerGroup(value);
                      }
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="calculated-value" className="block mb-2 font-medium">
                    {groupingMethod === 'groups' ? 'Participants per Group' : 'Number of Groups'}
                  </label>
                  <input
                    id="calculated-value"
                    type="number"
                    className={`w-full px-4 py-3 rounded-lg border-none ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                    value={groupingMethod === 'groups' ? participantsPerGroup : numberOfGroups}
                    disabled
                  />
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block mb-2 font-medium">Color Theme</label>
                <div className="flex space-x-4">
                  {Object.entries(themes).map(([theme, bgClass]) => (
                    <button
                      key={theme}
                      className={`w-10 h-10 rounded-full cursor-pointer !rounded-button whitespace-nowrap ${bgClass} ${selectedTheme === theme ? 'ring-2 ring-offset-2' : ''}`}
                      onClick={() => setSelectedTheme(theme)}
                    ></button>
                  ))}
                </div>
              </div>
              
              <button
                className={`w-full py-3 text-white font-bold rounded-lg transition duration-300 cursor-pointer !rounded-button whitespace-nowrap ${themes[selectedTheme]} hover:opacity-90`}
                onClick={createGroups}
                disabled={participants.length === 0}
              >
                Create Groups
              </button>
            </div>
            
            {/* Spinner Component */}
            {spinning && (
              <div className={`p-8 rounded-lg shadow-md text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="relative w-full max-w-md mx-auto aspect-square">
                  <div id="wheel-chart" className="w-full h-full"></div>
                  <button
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full ${themes[selectedTheme]} text-white flex items-center justify-center animate-pulse cursor-pointer !rounded-button whitespace-nowrap`}
                  >
                    <FontAwesomeIcon icon={faSyncAlt} className="text-xl" />
                  </button>
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer !rounded-button whitespace-nowrap"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    <FontAwesomeIcon icon={soundEnabled ? faVolumeUp : faVolumeMute} className="text-xl" />
                  </button>
                </div>
                <p className="mt-4 text-lg">Randomizing groups...</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Results Display */}
            <div className="mb-8" id="groups-results">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{eventTitle || 'Group Results'}</h2>
                <button
                  className={`px-4 py-2 text-white rounded-lg cursor-pointer !rounded-button whitespace-nowrap ${themes[selectedTheme]}`}
                  onClick={() => setShowResults(false)}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back to Editor
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {groups.map((group, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg shadow-md transition-transform hover:shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                  >
                    <div className={`w-full h-2 rounded-t-lg -mt-6 -mx-6 mb-4 ${themes[selectedTheme]}`}></div>
                    <h3 className="text-xl font-bold mb-4">Group {index + 1}</h3>
                    <ul className="space-y-2">
                      {group.map((participant, pIndex) => (
                        <li key={pIndex} className="flex items-center">
                          <span className={`w-8 h-8 rounded-full ${themes[selectedTheme]} text-white flex items-center justify-center mr-3`}>
                            {pIndex + 1}
                          </span>
                          {participant}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="text-center mb-8">
                <button
                  className={`px-6 py-3 text-white font-bold rounded-lg cursor-pointer !rounded-button whitespace-nowrap ${themes[selectedTheme]}`}
                  onClick={regenerateGroups}
                >
                  <FontAwesomeIcon icon={faRandom} className="mr-2" /> Regenerate Groups
                </button>
              </div>
            </div>
            
            {/* Export Options */}
            <div className={`p-4 rounded-lg shadow-md flex flex-wrap justify-center gap-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <button 
                onClick={exportAsPDF}
                className="flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer !rounded-button whitespace-nowrap"
              >
                <FontAwesomeIcon icon={faFilePdf} className="mr-2 text-red-500" /> PDF
              </button>
              <button 
                onClick={() => exportAsImage('png')}
                className="flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer !rounded-button whitespace-nowrap"
              >
                <FontAwesomeIcon icon={faFileImage} className="mr-2 text-blue-500" /> PNG
              </button>
              <button 
                onClick={() => exportAsImage('jpeg')}
                className="flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer !rounded-button whitespace-nowrap"
              >
                <FontAwesomeIcon icon={faFileImage} className="mr-2 text-purple-500" /> JPEG
              </button>
              <button 
                onClick={exportAsCSV}
                className="flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer !rounded-button whitespace-nowrap"
              >
                <FontAwesomeIcon icon={faFileCsv} className="mr-2 text-green-500" /> CSV
              </button>
              <button 
                onClick={copyToClipboard}
                className="flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer !rounded-button whitespace-nowrap"
              >
                <FontAwesomeIcon icon={faCopy} className="mr-2" /> Copy
              </button>
              <button 
                onClick={printGroups}
                className="flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer !rounded-button whitespace-nowrap"
              >
                <FontAwesomeIcon icon={faPrint} className="mr-2" /> Print
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;