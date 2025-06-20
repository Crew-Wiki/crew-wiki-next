import {useState} from 'react';
import {PopularDocument, SortType} from '@type/Document.type';
import {SORT_OPTIONS} from '@constants/popular';

export const mockData: PopularDocument[] = [
  {
    id: 1,
    title: '잠실캠 주변 맛집',
    viewCount: 15234,
    editCount: 342,
  },
  {
    id: 2,
    title: '루나(7기)',
    viewCount: 12456,
    editCount: 287,
  },
  {
    id: 3,
    title: '리바이(7기)',
    viewCount: 11789,
    editCount: 256,
  },
  {
    id: 4,
    title: '선릉캠 주변 맛집',
    viewCount: 9876,
    editCount: 198,
  },
  {
    id: 5,
    title: '칼리(7기)',
    viewCount: 8765,
    editCount: 176,
  },
  {
    id: 6,
    title: '밍트 (7기)',
    viewCount: 7654,
    editCount: 154,
  },
  {
    id: 7,
    title: '체체(7기)',
    viewCount: 6543,
    editCount: 132,
  },
  {
    id: 8,
    title: 'TypeScript 타입 시스템',
    viewCount: 5432,
    editCount: 110,
  },
  {
    id: 9,
    title: 'JPA 성능 최적화',
    viewCount: 4321,
    editCount: 98,
  },
  {
    id: 10,
    title: '도커 컨테이너 활용법',
    viewCount: 3210,
    editCount: 76,
  },
];

export const useGetPopularDocuments = () => {
  const [sortType, setSortType] = useState<SortType>(SORT_OPTIONS.views.label as SortType);
  const [isLoading, setIsLoading] = useState(false);

  const sortedData = [...mockData].sort((a, b) => {
    const aValue = sortType === SORT_OPTIONS.views.label ? a.viewCount : a.editCount;
    const bValue = sortType === SORT_OPTIONS.views.label ? b.viewCount : b.editCount;
    return bValue - aValue;
  });

  const showLoadingEffect = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const changeSortType = (newSortType: SortType) => {
    if (newSortType !== sortType) {
      showLoadingEffect();
      setSortType(newSortType);
    }
  };

  return {
    data: sortedData,
    isLoading,
    error: null,
    sortType,
    changeSortType,
  };
};
