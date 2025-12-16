import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilePdf, faFileImage, faFileCsv, 
  faCopy, faPrint 
} from '@fortawesome/free-solid-svg-icons';
import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { exportAsCSV, copyToClipboard } from '../utils/groupUtils';

const ExportOptions = ({ darkMode, groups, eventTitle }) => {
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

  return (
    <div className={`p-4 rounded-lg shadow-md flex flex-wrap justify-center gap-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <button 
        onClick={exportAsPDF}
        className="flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
      >
        <FontAwesomeIcon icon={faFilePdf} className="mr-2 text-red-500" /> PDF
      </button>
      <button 
        onClick={() => exportAsImage('png')}
        className="flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
      >
        <FontAwesomeIcon icon={faFileImage} className="mr-2 text-blue-500" /> PNG
      </button>
      <button 
        onClick={() => exportAsImage('jpeg')}
        className="flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
      >
        <FontAwesomeIcon icon={faFileImage} className="mr-2 text-purple-500" /> JPEG
      </button>
      <button 
        onClick={() => exportAsCSV(groups)}
        className="flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
      >
        <FontAwesomeIcon icon={faFileCsv} className="mr-2 text-green-500" /> CSV
      </button>
      <button 
        onClick={() => copyToClipboard(groups, eventTitle)}
        className="flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
      >
        <FontAwesomeIcon icon={faCopy} className="mr-2" /> Copy
      </button>
      <button 
        onClick={printGroups}
        className="flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
      >
        <FontAwesomeIcon icon={faPrint} className="mr-2" /> Print
      </button>
    </div>
  );
};

export default ExportOptions;