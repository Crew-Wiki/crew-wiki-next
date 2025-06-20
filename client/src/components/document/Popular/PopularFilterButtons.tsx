'use client';

import Button from '@components/common/Button';
import {SortType} from '@type/Document.type';
import {SORT_OPTIONS} from '@constants/popular';

interface PopularFilterButtonsProps {
  sortType: SortType;
  onSortTypeChange: (type: SortType) => void;
}

const PopularFilterButtons = ({sortType, onSortTypeChange}: PopularFilterButtonsProps) => {
  const sortTypes = Object.keys(SORT_OPTIONS) as SortType[];

  return (
    <div className="flex gap-2">
      {sortTypes.map(type => (
        <Button
          key={type}
          size="xs"
          style={sortType === type ? 'primary' : 'tertiary'}
          onClick={() => onSortTypeChange(type)}
        >
          {SORT_OPTIONS[type].displayName}
        </Button>
      ))}
    </div>
  );
};

export default PopularFilterButtons;
