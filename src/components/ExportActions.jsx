const ExportActions = ({
  onPDF,
  onPNG,
  onCSV,
  onCopy,
  onPrint,
}) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <button onClick={onPDF}>PDF</button>
      <button onClick={onPNG}>PNG</button>
      <button onClick={onCSV}>CSV</button>
      <button onClick={onCopy}>Copy</button>
      <button onClick={onPrint}>Print</button>
    </div>
  );
};

export default ExportActions;
