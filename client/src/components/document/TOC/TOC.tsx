import {generateTOCNumber, HeadingLevel} from '@utils/tocUtils';
import {twMerge} from 'tailwind-merge';

interface TOCProps {
  headTags: string[];
}

const LEVEL_DEPTH: Record<number, string> = {
  1: 'pl-[0px]',
  2: 'pl-[15px]',
  3: 'pl-[30px]',
};

const getHTagOrder = (heading: string): HeadingLevel | null => {
  const match = heading.match(/^<h([1-3])/);
  return match ? (parseInt(match[1], 10) as HeadingLevel) : null;
};

const TOC = ({headTags}: TOCProps) => {
  const tocList = headTags.flatMap(headTag => {
    const text = headTag.replace(/<[^>]*>/g, '').trim();
    const level = getHTagOrder(headTag);
    return level ? [{text, level}] : [];
  });

  const headingCounts = tocList.map(({level}) => ({level, count: 0}));
  const tocNumber = generateTOCNumber(headingCounts);

  return (
    <aside
      className={twMerge(
        'flex w-fit flex-col gap-2 rounded-xl border border-grayscale-100 px-6 py-4',
        tocList.length === 0 ? 'hidden' : '',
      )}
    >
      <h2 className="font-pretendard text-lg font-bold text-grayscale-800">목차</h2>
      <ul>
        {tocList.map(({text, level}, index) => (
          <li key={index} className={`cursor-pointer text-sm font-normal text-grayscale-800 ${LEVEL_DEPTH[level]}`}>
            <a href={`#${tocNumber[index]}`}>
              <span className="text-primary-primary">{tocNumber[index]}</span>
              {` ${text}`}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default TOC;
