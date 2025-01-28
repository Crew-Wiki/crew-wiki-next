'use client';

interface RelativeSearchTermsProps {
  style?: React.CSSProperties;
  show?: boolean;
  searchTerms: string[];
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
      <aside style={style} className="absolute rounded-xl shadow-2xl px-2 py-2 left-0 top-12 w-full bg-white">
        {searchTerms.map((search, index) => (
          <button
            id={search}
            onClick={onClick}
            className="w-full px-2 py-2 hover:bg-primary-50 rounded-lg cursor-pointer text-left font-pretendard text-base font-normal text-grayscale-800"
            key={index}
          >
            {search}
          </button>
        ))}
      </aside>
    )
  );
};

export default RelativeSearchTerms;
