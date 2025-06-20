'use client';

import Link from 'next/link';
import {PopularDocument, SortType} from '@type/Document.type';

interface PopularDocumentItemProps {
  document: PopularDocument;
  rank: number;
  sortType: SortType;
}

const PopularDocumentItem = ({document, rank, sortType}: PopularDocumentItemProps) => {
  const primaryCount = sortType === 'views' ? document.viewCount : document.editCount;
  const secondaryCount = sortType === 'views' ? document.editCount : document.viewCount;

  return (
    <Link href={`/wiki/${encodeURIComponent(document.title)}`}>
      <li className="group flex cursor-pointer items-center border-b border-grayscale-100 px-2 py-4 transition-colors hover:bg-primary-50/30 md:px-4">
        <div className="w-8 text-center text-sm font-semibold text-grayscale-600 md:w-12 md:text-base">{rank}</div>
        <div className="min-w-0 flex-1 px-3 md:px-4">
          <h3 className="truncate font-medium text-grayscale-800 transition-colors group-hover:text-primary-primary">
            {document.title}
          </h3>
        </div>
        {/* 주요 통계 (조회수 or 수정수) */}
        <div className="mr-3 text-right md:mr-6">
          <div className="font-semibold text-grayscale-800">{primaryCount.toLocaleString()}</div>
          <div className="text-xs text-grayscale-500">{sortType === 'views' ? '조회' : '수정'}</div>
        </div>
        {/* 보조 통계 - 데스크탑에서만 표시됨 */}
        <div className="hidden text-right md:block">
          <div className="text-sm text-grayscale-600">{secondaryCount.toLocaleString()}</div>
          <div className="text-xs text-grayscale-500">{sortType === 'views' ? '수정' : '조회'}</div>
        </div>
      </li>
    </Link>
  );
};

export default PopularDocumentItem;
