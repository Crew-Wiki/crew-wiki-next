import DocumentTitle from '@components/document/layout/DocumentTitle';
import PopularFilterButtons from './PopularFilterButtons';
import {SortType} from '@type/Document.type';

interface PopularHeaderProps {
  sortType: SortType;
  onSortTypeChange: (type: SortType) => void;
}

const PopularHeader = ({sortType, onSortTypeChange}: PopularHeaderProps) => {
  return (
    <header className="mb-6 flex w-full items-center justify-between max-md:flex-col max-md:gap-4">
      <DocumentTitle title="인기문서" />
      <PopularFilterButtons sortType={sortType} onSortTypeChange={onSortTypeChange} />
    </header>
  );
};

export default PopularHeader;
