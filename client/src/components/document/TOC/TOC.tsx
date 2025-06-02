import {generateTOCNumber, HeadingCount, HeadingLevel} from '@utils/tocUtils';
import {twMerge} from 'tailwind-merge';

interface TOCProps {
  headTags: string[];
}

type Result<T> = {
  isError: boolean;
  data: T;
};

const LEVEL_DEPTH: Record<number, string> = {
  1: 'pl-[0px]',
  2: 'pl-[15px]',
  3: 'pl-[30px]',
};

const getHTagOrder = (heading: string): Result<HeadingLevel> => {
  const match = heading.match(/^<h(\d)/);
  const level = match ? parseInt(match[1], 10) : null;

  if (!level || level < 1 || level > 3) {
    return {
      isError: true,
      data: 1,
    };
  }

  return {
    isError: false,
    data: level as HeadingLevel,
  };
};

const TOC = ({headTags}: TOCProps) => {
  const tocList = headTags
    .map(headTag => {
      const text = headTag.replace(/<[^>]*>/g, '').trim();
      const {isError, data: level} = getHTagOrder(headTag);
      return isError ? null : {text, level};
    })
    .filter((item): item is {text: string; level: HeadingLevel} => item !== null);

  const headingCounts: HeadingCount[] = tocList.map(({level}) => ({
    level,
    count: 0,
  }));

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
