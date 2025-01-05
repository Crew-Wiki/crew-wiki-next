/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { MouseEvent } from 'react';
import { twMerge } from 'tailwind-merge';

interface TOCProps {
  headTags: Element[];
}

interface IToc {
  text: string | null;
  level: number;
  index: string;
}

const LEVEL_DEPTH: Record<number, string> = {
  1: 'pl-[0px]',
  2: 'pl-[15px]',
  3: 'pl-[30px]',
};

function convertToTOCNumber(list: number[]) {
  const result: string[] = [];
  let h1Count = 0;
  let h2Count = 0;
  let h3Count = 0;

  list.forEach((num) => {
    switch (num) {
      case 1:
        h1Count += 1;
        h2Count = 0;
        h3Count = 0;
        break;
      case 2:
        h2Count += 1;
        h3Count = 0;
        break;
      case 3:
        h3Count += 1;
        break;
      default:
        break;
    }

    result.push(
      `${h1Count !== 0 ? `${h1Count}` : ''}${h2Count !== 0 ? `.${h2Count}` : ''}${h3Count !== 0 ? `.${h3Count}` : ''}`,
    );
  });

  return result;
}

const TOC = ({ headTags }: TOCProps) => {
  const tocList: IToc[] = [];

  const headTagsToNumber = headTags.map((heading) => parseInt(heading.tagName.substring(1), 10));
  const tocNumber = convertToTOCNumber(headTagsToNumber);

  headTags.forEach((heading) => {
    const text = heading.textContent;
    const level = parseInt(heading.tagName.substring(1), 10);
    tocList.push({ text, level, index: '' });
  });

  const moveHeadTag = (event: MouseEvent<HTMLLIElement | HTMLSpanElement>) => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }
    const index = Number(event.target.dataset.index);
    headTags[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

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
            data-index={index}
            onClick={(event) => moveHeadTag(event)}
            key={index}
            className={`font-normal text-sm text-grayscale-800 cursor-pointer ${LEVEL_DEPTH[element.level]}`}
          >
            <span data-index={index} onClick={(event) => moveHeadTag(event)} className="text-primary-primary">
              {tocNumber[index]}
            </span>
            {` ${element.text}`}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default TOC;
