import {generateTOCNumber, HeadingCount, HeadingLevel} from '@utils/tocUtils';
import {twMerge} from 'tailwind-merge';

interface TOCProps {
  headTags: string[];
}

interface IToc {
  text: string | null;
  level: number;
}

const LEVEL_DEPTH: Record<number, string> = {
  1: 'pl-[0px]',
  2: 'pl-[15px]',
  3: 'pl-[30px]',
};

const getHTagOrder = (heading: string) => {
  const match = heading.match(/^<h(\d)/);

  if (!match) {
    console.error('Invalid heading:', heading);
    return -1;
  }

  return parseInt(match[1], 10);
};

const TOC = ({headTags}: TOCProps) => {
  const tocList: IToc[] = [];
  const headTagsToNumber = headTags.map(heading => getHTagOrder(heading));
  
  const headingCounts: HeadingCount[] = headTagsToNumber.map(level => ({
    level: level as HeadingLevel,
    count: 0,
  }));

  const tocNumber = generateTOCNumber(headingCounts);
  
  headTags.forEach(heading => {
    const text = heading.replace(/<[^>]*>/g, '').trim();
    const level = getHTagOrder(heading);
    tocList.push({text, level});
  });

  return (
    <aside
      className={twMerge(
        'flex flex-col gap-2 w-fit px-6 py-4 border rounded-xl border-grayscale-100',
        tocList.length === 0 ? 'hidden' : '',
      )}
    >
      <h2 className="font-pretendard text-lg font-bold text-grayscale-800">목차</h2>
      <ul>
        {tocList.map((element, index) => (
          <li
            key={index}
            className={`font-normal text-sm text-grayscale-800 cursor-pointer ${LEVEL_DEPTH[element.level]}`}
          >
            <a href={`#${tocNumber[index]}`}>
              <span className="text-primary-primary">{tocNumber[index]}</span>
              {` ${element.text}`}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default TOC;
