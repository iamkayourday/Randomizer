const GroupForm = ({
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
  themes,
  selectedTheme,
  setSelectedTheme,
  onCreateGroups,
  darkMode,
}) => {
  return (
    <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <h2 className="text-2xl font-bold mb-6">Create Random Groups</h2>

      <input
        className="w-full mb-4 p-3 rounded bg-gray-100"
        placeholder="Event title"
        value={eventTitle}
        onChange={(e) => setEventTitle(e.target.value)}
      />

      <textarea
        className="w-full min-h-[150px] p-3 rounded bg-gray-100"
        placeholder="Enter names..."
        value={participantNames}
        onChange={(e) => setParticipantNames(e.target.value)}
      />

      <p className="text-sm mt-2">{participantsCount} participants</p>

      <div className="flex gap-4 my-4">
        <button onClick={() => setGroupingMethod("groups")}>
          Number of Groups
        </button>
        <button onClick={() => setGroupingMethod("participants")}>
          Participants per Group
        </button>
      </div>

      <input
        type="number"
        min="1"
        value={groupingMethod === "groups" ? numberOfGroups : participantsPerGroup}
        onChange={(e) =>
          groupingMethod === "groups"
            ? setNumberOfGroups(+e.target.value)
            : setParticipantsPerGroup(+e.target.value)
        }
      />

      <div className="flex gap-4 my-4">
        {Object.entries(themes).map(([key, cls]) => (
          <button
            key={key}
            className={`w-8 h-8 rounded-full ${cls}`}
            onClick={() => setSelectedTheme(key)}
          />
        ))}
      </div>

      <button
        className={`w-full py-3 text-white rounded ${themes[selectedTheme]}`}
        onClick={onCreateGroups}
      >
        Create Groups
      </button>
    </div>
  );
};

export default GroupForm;
