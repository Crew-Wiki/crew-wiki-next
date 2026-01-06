import {diffLines} from 'diff';

export const createConflictText = (remoteContent: string, localContent: string): string => {
  const diffs = diffLines(localContent, remoteContent);
  let result = '';
  let buffer: {local?: string; remote?: string} = {};

  const flush = () => {
    if (buffer.local || buffer.remote) {
      result += `<<<<<<< 내 버전
${buffer.local ?? ''}
-=-=-=-=-=-=-=-=
${buffer.remote ?? ''}
<<<<<<< 최신 버전
`;
      buffer = {};
    }
  };

  for (const part of diffs) {
    if (part.removed) {
      buffer.local = (buffer.local ?? '') + part.value;
    } else if (part.added) {
      buffer.remote = (buffer.remote ?? '') + part.value;
    } else {
      flush();
      result += part.value;
    }
  }

  flush();
  return result;
};
