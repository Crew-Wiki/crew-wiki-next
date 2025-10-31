const findFirstDiffIndex = (remoteLines: string[], localLines: string[]): number => {
  let i = 0;
  while (i < remoteLines.length && i < localLines.length && remoteLines[i] === localLines[i]) {
    i++;
  }
  return i;
};

const findLastDiffIndex = (remoteLines: string[], localLines: string[]): {remoteIndex: number; localIndex: number} => {
  let i = remoteLines.length - 1;
  let j = localLines.length - 1;
  while (i >= 0 && j >= 0 && remoteLines[i] === localLines[j]) {
    i--;
    j--;
  }
  return {remoteIndex: i, localIndex: j};
};

export const createConflictText = (remoteContent: string, localContent: string): string => {
  if (remoteContent === localContent) {
    return remoteContent;
  }

  const remoteLines = remoteContent.split('\n');
  const localLines = localContent.split('\n');

  const firstDiffIndex = findFirstDiffIndex(remoteLines, localLines);
  const {remoteIndex: lastRemoteDiffIndex, localIndex: lastLocalDiffIndex} = findLastDiffIndex(remoteLines, localLines);

  const commonPrefix = remoteLines.slice(0, firstDiffIndex).join('\n');
  const commonSuffix = remoteLines.slice(lastRemoteDiffIndex + 1).join('\n');

  const remoteDiff = remoteLines.slice(firstDiffIndex, lastRemoteDiffIndex + 1).join('\n');
  const localDiff = localLines.slice(firstDiffIndex, lastLocalDiffIndex + 1).join('\n');

  let conflictText = '';

  if (commonPrefix) {
    conflictText += `${commonPrefix}\n`;
  }

  conflictText += '<<<<< 최신 버전\n';
  conflictText += `${remoteDiff}\n`;
  conflictText += '──────────────\n';
  conflictText += `${localDiff}\n`;
  conflictText += '<<<<< 내 작업\n';

  if (commonSuffix) {
    conflictText += `${commonSuffix}\n`;
  }

  return conflictText.trim();
};
