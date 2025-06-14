'use client';

import Button from '@components/common/Button';

interface PopularFilterButtonsProps {
  sortType: 'views' | 'edits';
  onSortTypeChange: (type: 'views' | 'edits') => void;
}

const PopularFilterButtons = ({sortType, onSortTypeChange}: PopularFilterButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button size="xs" style={sortType === 'views' ? 'primary' : 'tertiary'} onClick={() => onSortTypeChange('views')}>
        조회수 기준
      </Button>
      <Button size="xs" style={sortType === 'edits' ? 'primary' : 'tertiary'} onClick={() => onSortTypeChange('edits')}>
        수정수 기준
      </Button>
    </div>
  );
};

export default PopularFilterButtons;
