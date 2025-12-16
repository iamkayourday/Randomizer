// utils/groupUtils.js
export const createGroups = (participants, groupingMethod, value, enableLeader = true) => {
  // Shuffle participants
  const shuffled = [...participants].sort(() => Math.random() - 0.5);
  
  // Calculate number of groups
  const calculatedGroups = groupingMethod === 'groups' 
    ? value 
    : Math.ceil(participants.length / value);
  
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
  
  // Mark first person as leader if enabled
  if (enableLeader) {
    newGroups.forEach(group => {
      if (group.length > 0) {
        group[0] = `${group[0]} (L)`;
      }
    });
  }
  
  return newGroups;
};

export const getParticipantsList = (participantNames) => {
  if (!participantNames.trim()) return [];
  return participantNames
    .split(/[\n,]/)
    .map(name => name.trim())
    .filter(name => name !== '');
};

export const exportAsCSV = (groups, eventTitle = '') => {
  let csvContent = "Group,Member,Role\n";
  groups.forEach((group, i) => {
    group.forEach((member, j) => {
      const role = j === 0 ? 'Leader' : 'Member';
      csvContent += `Group ${i+1},${member.replace(' (L)', '')},${role}\n`;
    });
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${eventTitle || 'groups'}.csv`;
  link.click();
};

export const copyToClipboard = (groups, eventTitle = '') => {
  let textContent = eventTitle ? `${eventTitle}\n\n` : '';
  groups.forEach((group, i) => {
    textContent += `Group ${i+1}:\n${group.join('\n')}\n\n`;
  });
  
  navigator.clipboard.writeText(textContent);
  return true;
};