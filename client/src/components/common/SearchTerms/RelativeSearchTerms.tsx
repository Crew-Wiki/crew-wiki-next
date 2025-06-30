'use client';

import {SearchDocumentResponse} from '@hooks/fetch/useSearchDocumentByQuery';

interface RelativeSearchTermsProps {
  style?: React.CSSProperties;
  show?: boolean;
  searchTerms: SearchDocumentResponse[];
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const RelativeSearchTerms = ({
  style,
  searchTerms,
  show = searchTerms.length > 0,
  onClick,
}: RelativeSearchTermsProps) => {
  return (
    show && (
      <aside style={style} className="absolute left-0 top-12 w-full rounded-xl bg-white px-2 py-2 shadow-2xl">
        {searchTerms.map(({title, uuid}) => (
          <button
            id={uuid}
            data-title={title}
            onClick={onClick}
            className="w-full cursor-pointer rounded-lg px-2 py-2 text-left font-pretendard text-base font-normal text-grayscale-800 hover:bg-primary-50"
            key={uuid}
          >
            {title}
          </button>
        ))}
      </aside>
    )
  );
};

export default RelativeSearchTerms;
