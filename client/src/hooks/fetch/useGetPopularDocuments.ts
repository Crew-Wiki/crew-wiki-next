import {useState} from 'react';
import {PopularDocument} from '@type/Document.type';

export const mockData: PopularDocument[] = [
  {
    title: '잠실캠 주변 맛집',
    viewCount: 15234,
    editCount: 342,
  },
  {
    title: '루나(7기)',
    viewCount: 12456,
    editCount: 287,
  },
  {
    title: '리바이(7기)',
    viewCount: 11789,
    editCount: 256,
  },
  {
    title: '선릉캠 주변 맛집',
    viewCount: 9876,
    editCount: 198,
  },
  {
    title: '칼리(7기)',
    viewCount: 8765,
    editCount: 176,
  },
  {
    title: '밍트 (7기)',
    viewCount: 7654,
    editCount: 154,
  },
  {
    title: '체체(7기)',
    viewCount: 6543,
    editCount: 132,
  },
  {
    title: 'TypeScript 타입 시스템',
    viewCount: 5432,
    editCount: 110,
  },
  {
    title: 'JPA 성능 최적화',
    viewCount: 4321,
    editCount: 98,
  },
  {
    title: '도커 컨테이너 활용법',
    viewCount: 3210,
    editCount: 76,
  },
  {
    title: '애자일 스크럼 가이드',
    viewCount: 2987,
    editCount: 65,
  },
];

type SortType = 'views' | 'edits';

export const useGetPopularDocuments = () => {
  const [sortType, setSortType] = useState<SortType>('views');
  const [isLoading, setIsLoading] = useState(false);

  const sortedData = [...mockData].sort((a, b) => {
    if (sortType === 'views') {
      return b.viewCount - a.viewCount;
    }
    return b.editCount - a.editCount;
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
