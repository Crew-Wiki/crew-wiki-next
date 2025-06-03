export type HeadingLevel = 1 | 2 | 3;

interface HeadingCount {
  level: HeadingLevel;
  count: number;
}

export const generateTOCNumber = (headings: HeadingCount[]): string[] => {
  type Acc = {counts: number[]; numbers: string[]};
  const initial: Acc = {counts: [0, 0, 0], numbers: []};

  return headings.reduce((acc, {level}) => {
    const newCounts = acc.counts.map((count, idx) => (idx < level - 1 ? count : idx === level - 1 ? count + 1 : 0));
    const number = newCounts.slice(0, level).join('.');
    return {
      counts: newCounts,
      numbers: [...acc.numbers, number],
    };
  }, initial).numbers;
};
