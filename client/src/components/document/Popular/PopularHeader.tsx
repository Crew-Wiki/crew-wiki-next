import DocumentTitle from '@components/document/layout/DocumentTitle';
import PopularFilterButtons from './PopularFilterButtons';

interface PopularHeaderProps {
  sortType: 'views' | 'edits';
  onSortTypeChange: (type: 'views' | 'edits') => void;
}

const PopularHeader = ({sortType, onSortTypeChange}: PopularHeaderProps) => {
  return (
    <header className="mb-6 flex w-full items-center justify-between max-md:flex-col max-md:gap-4">
      <DocumentTitle title="인기문서" />
      <nav className="flex gap-2">
        <PopularFilterButtons sortType={sortType} onSortTypeChange={onSortTypeChange} />
      </nav>
    </header>
  );
};

export default PopularHeader;
