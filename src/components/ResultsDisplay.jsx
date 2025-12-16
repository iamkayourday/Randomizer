// components/ResultsDisplay.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faRandom, 
  faFilePdf, 
  faFileImage, 
  faFileCsv, 
  faCopy, 
  faPrint,
  faCrown,
  faUser,
  faShareAlt
} from '@fortawesome/free-solid-svg-icons';
import { exportAsCSV, copyToClipboard } from '../utils/groupUtils';

const ResultsDisplay = ({ 
  darkMode, 
  eventTitle, 
  groups, 
  selectedTheme, 
  onBack, 
  onRegenerate 
}) => {
  const themes = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    violet: 'bg-violet-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    indigo: 'bg-indigo-500',
  };

  const theme = themes[selectedTheme] || themes.blue;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${eventTitle || 'Group Results'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h1 { color: #2d3748; margin-bottom: 20px; }
            .groups-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
            .group-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .group-header { border-bottom: 3px solid #4a90e2; padding-bottom: 10px; margin-bottom: 15px; }
            .leader { color: #d69e2e; font-weight: bold; }
            .member { color: #4a5568; }
            @media print {
              body { padding: 10px; }
              .group-card { break-inside: avoid; page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>${eventTitle || 'Group Results'}</h1>
          <div class="groups-container">
            ${groups.map((group, i) => `
              <div class="group-card">
                <div class="group-header">
                  <h2 style="margin: 0; color: #2d3748;">Group ${i + 1}</h2>
                  <p style="margin: 5px 0 0 0; color: #718096;">${group.length} members</p>
                </div>
                <ul style="margin: 0; padding-left: 20px;">
                  ${group.map((member, j) => `
                    <li style="margin-bottom: 8px; ${j === 0 ? 'color: #d69e2e; font-weight: bold;' : 'color: #4a5568;'}">
                      ${member}
                    </li>
                  `).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #718096;">
            Generated with Group Randomizer • ${new Date().toLocaleDateString()}
          </div>
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

  const handleExportImage = async () => {
    try {
      alert('Image export feature requires html2canvas library to be installed.');
      // Uncomment and install html2canvas to use:
      /*
      import html2canvas from 'html2canvas';
      const element = document.getElementById('groups-results');
      const canvas = await html2canvas(element);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'groups.png';
      link.href = image;
      link.click();
      */
    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Error exporting image. Please try again.');
    }
  };

  const handleExportPDF = async () => {
    try {
      alert('PDF export feature requires jsPDF library to be installed.');
      // Uncomment and install jsPDF to use:
      /*
      import jsPDF from 'jspdf';
      import html2canvas from 'html2canvas';
      const element = document.getElementById('groups-results');
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
      pdf.save('groups.pdf');
      */
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    }
  };

  const handleShare = async () => {
    const text = `${eventTitle || 'Group Results'}\n\n${groups.map((group, i) => 
      `Group ${i + 1}:\n${group.join('\n')}`
    ).join('\n\n')}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: eventTitle || 'Group Results',
          text: text,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        fallbackShare(text);
      }
    } else {
      fallbackShare(text);
    }
  };

  const fallbackShare = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Results copied to clipboard! You can now paste them anywhere.');
      });
    } else {
      prompt('Copy the following text to share:', text);
    }
  };

  const getGroupStats = (group) => {
    const leaderCount = group.filter(p => p.includes('(L)')).length;
    const memberCount = group.length - leaderCount;
    return { leaderCount, memberCount };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{eventTitle || 'Group Results'}</h2>
          <p className="opacity-75">
            {groups.length} groups created with {groups.reduce((total, group) => total + group.length, 0)} total participants
          </p>
        </div>
        <button
          onClick={onBack}
          className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Editor</span>
        </button>
      </div>

      {/* Groups Display */}
      <div id="groups-results" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, index) => {
          const stats = getGroupStats(group);
          
          return (
            <div
              key={index}
              className={`rounded-xl border overflow-hidden transition-transform hover:scale-[1.02] ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* Group Header */}
              <div className={`px-6 py-4 ${theme} text-white`}>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Group {index + 1}</h3>
                  <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                    <FontAwesomeIcon icon={faUser} className="text-sm" />
                    <span className="font-bold ml-1">{group.length}</span>
                  </div>
                </div>
                <p className="text-sm opacity-90 mt-1">
                  {group.length} members • {stats.leaderCount} leader{stats.leaderCount !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Participants List */}
              <div className="p-6">
                <ul className="space-y-3">
                  {group.map((participant, pIndex) => (
                    <li key={pIndex} className="flex items-center space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        pIndex === 0 
                          ? 'bg-amber-500 text-white' 
                          : darkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {pIndex === 0 ? (
                          <FontAwesomeIcon icon={faCrown} className="text-sm" />
                        ) : (
                          <FontAwesomeIcon icon={faUser} className="text-sm" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium truncate ${
                          pIndex === 0 ? 'text-amber-500' : ''
                        }`}>
                          {participant}
                        </div>
                        <div className="text-xs opacity-75">
                          {pIndex === 0 ? 'Leader' : 'Member'}
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        #{pIndex + 1}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Group Stats */}
              <div className={`px-6 py-3 border-t ${
                darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${theme}`}></div>
                    <span>Group {index + 1}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {stats.leaderCount > 0 && (
                      <span className="flex items-center">
                        <FontAwesomeIcon icon={faCrown} className="text-amber-500 mr-1 text-xs" />
                        <span>{stats.leaderCount}</span>
                      </span>
                    )}
                    <span className="flex items-center">
                      <FontAwesomeIcon icon={faUser} className="mr-1 text-xs opacity-75" />
                      <span>{group.length}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="space-y-6">
        {/* Regenerate Button */}
        <div className="text-center">
          <button
            onClick={onRegenerate}
            className={`px-6 py-3 rounded-lg font-bold text-white ${theme} hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 mx-auto shadow-lg`}
          >
            <FontAwesomeIcon icon={faRandom} className="animate-pulse" />
            <span>Regenerate Groups</span>
          </button>
          <p className="text-sm opacity-75 mt-2">
            Click to create new random groups with the same participants
          </p>
        </div>

        {/* Export Options */}
        <div className={`rounded-xl border p-4 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h4 className="font-bold mb-4 text-center">Export & Share Results</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <button
              onClick={handleExportPDF}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all hover:scale-105 ${
                darkMode 
                  ? 'border-gray-600 hover:border-red-500 hover:bg-gray-700' 
                  : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
              }`}
              title="Export as PDF"
            >
              <FontAwesomeIcon icon={faFilePdf} className="text-red-500 text-xl mb-2" />
              <span className="text-sm font-medium">PDF</span>
            </button>
            
            <button
              onClick={handleExportImage}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all hover:scale-105 ${
                darkMode 
                  ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-700' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
              title="Export as Image"
            >
              <FontAwesomeIcon icon={faFileImage} className="text-blue-500 text-xl mb-2" />
              <span className="text-sm font-medium">Image</span>
            </button>
            
            <button
              onClick={() => exportAsCSV(groups, eventTitle)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all hover:scale-105 ${
                darkMode 
                  ? 'border-gray-600 hover:border-green-500 hover:bg-gray-700' 
                  : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
              }`}
              title="Export as CSV"
            >
              <FontAwesomeIcon icon={faFileCsv} className="text-green-500 text-xl mb-2" />
              <span className="text-sm font-medium">CSV</span>
            </button>
            
            <button
              onClick={() => {
                copyToClipboard(groups, eventTitle);
                alert('Groups copied to clipboard!');
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all hover:scale-105 ${
                darkMode 
                  ? 'border-gray-600 hover:border-purple-500 hover:bg-gray-700' 
                  : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
              }`}
              title="Copy to Clipboard"
            >
              <FontAwesomeIcon icon={faCopy} className="text-purple-500 text-xl mb-2" />
              <span className="text-sm font-medium">Copy</span>
            </button>
            
            <button
              onClick={handlePrint}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all hover:scale-105 ${
                darkMode 
                  ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              title="Print Results"
            >
              <FontAwesomeIcon icon={faPrint} className="text-gray-500 text-xl mb-2" />
              <span className="text-sm font-medium">Print</span>
            </button>
            
            <button
              onClick={handleShare}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all hover:scale-105 ${
                darkMode 
                  ? 'border-gray-600 hover:border-amber-500 hover:bg-gray-700' 
                  : 'border-gray-300 hover:border-amber-400 hover:bg-gray-50'
              }`}
              title="Share Results"
            >
              <FontAwesomeIcon icon={faShareAlt} className="text-amber-500 text-xl mb-2" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
          <p className="text-xs text-center mt-4 opacity-75">
            Export your groups for printing, sharing, or future reference
          </p>
        </div>

        {/* Summary Stats */}
        <div className={`rounded-xl border p-4 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h4 className="font-bold mb-3">Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold">{groups.length}</div>
              <div className="text-sm opacity-75">Total Groups</div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold">
                {groups.reduce((total, group) => total + group.length, 0)}
              </div>
              <div className="text-sm opacity-75">Total Participants</div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold">
                {Math.round(groups.reduce((total, group) => total + group.length, 0) / groups.length)}
              </div>
              <div className="text-sm opacity-75">Avg. per Group</div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold">
                {groups.filter(group => group.some(p => p.includes('(L)'))).length}
              </div>
              <div className="text-sm opacity-75">Groups with Leaders</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;