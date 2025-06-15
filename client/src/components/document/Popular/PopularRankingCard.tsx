'use client';

import Link from 'next/link';
import {PopularDocument} from '@type/Document.type';

interface PopularRankingCardProps {
  document: PopularDocument;
  rank: number;
  sortType: 'views' | 'edits';
}

const rankEmojis = ['🥇', '🥈', '🥉'];

const PopularRankingCard = ({document, rank, sortType}: PopularRankingCardProps) => {
  const displayCount = sortType === 'views' ? document.viewCount : document.editCount;
  const countLabel = sortType === 'views' ? '조회수' : '수정수';

  return (
    <Link href={`/wiki/${encodeURIComponent(document.title)}`}>
      <li className="h-full rounded-lg border border-primary-100 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-3xl">{rankEmojis[rank - 1]}</span>
          <span className="text-lg font-semibold text-gray-600">{rank}위</span>
        </div>

        <h3 className="mb-3 line-clamp-2 text-lg font-bold text-gray-800">{document.title}</h3>

        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>{countLabel}</span>
            <span className="font-semibold">{displayCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>{sortType === 'views' ? '수정수' : '조회수'}</span>
            <span className="text-gray-500">
              {sortType === 'views' ? document.editCount.toLocaleString() : document.viewCount.toLocaleString()}
            </span>
          </div>
        </div>
      </li>
    </Link>
  );
};

export default PopularRankingCard;
