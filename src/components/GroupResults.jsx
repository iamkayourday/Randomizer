const GroupResults = ({ groups, themeClass, eventTitle, onBack }) => {
  return (
    <div id="groups-results">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">{eventTitle || "Results"}</h2>
        <button onClick={onBack}>← Back</button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {groups.map((group, index) => (
          <div key={index} className="p-4 bg-white rounded shadow">
            <div className={`h-2 ${themeClass} mb-4`} />
            <h3 className="font-bold mb-2">Group {index + 1}</h3>
            <ul>
              {group.map((name, i) => (
                <li key={i}>{name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupResults;
