export type HeadingLevel = 1 | 2 | 3;

interface HeadingCount {
  level: HeadingLevel;
  count: number;
}

export const generateTOCNumber = (headings: HeadingCount[]): string[] => {
  return headings.reduce<{numbers: string[]; counts: Record<HeadingLevel, number>}>(
    (acc, {level}) => {
      const {numbers, counts} = acc;

      counts[level] = (counts[level] || 0) + 1;

      if (level === 1) {
        counts[2] = 0;
        counts[3] = 0;
      } else if (level === 2) {
        counts[3] = 0;
      }

      const number = [
        counts[1] ? `${counts[1]}` : '',
        counts[2] ? `.${counts[2]}` : '',
        counts[3] ? `.${counts[3]}` : '',
      ].join('');

      return {
        numbers: [...numbers, number],
        counts,
      };
    },
    {numbers: [], counts: {1: 0, 2: 0, 3: 0}},
  ).numbers;
};
