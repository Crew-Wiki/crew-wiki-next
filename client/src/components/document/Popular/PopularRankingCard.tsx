'use client';

import Link from 'next/link';
import {PopularDocument, SortType} from '@type/Document.type';
import {SORT_OPTIONS} from '@constants/popular';

interface PopularRankingCardProps {
  document: PopularDocument;
  rank: number;
  sortType: SortType;
}

const rankEmojis = ['🥇', '🥈', '🥉'];

const PopularRankingCard = ({document, rank, sortType}: PopularRankingCardProps) => {
  const primaryCount = sortType === SORT_OPTIONS.views.label ? document.viewCount : document.editCount;
  const primaryLabel =
    sortType === SORT_OPTIONS.views.label ? SORT_OPTIONS.views.displayName : SORT_OPTIONS.edits.displayName;

  const secondaryCount = sortType === SORT_OPTIONS.views.label ? document.editCount : document.viewCount;
  const secondaryLabel =
    sortType === SORT_OPTIONS.views.label ? SORT_OPTIONS.edits.displayName : SORT_OPTIONS.views.displayName;

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
            <span>{primaryLabel}</span>
            <span className="font-semibold">{primaryCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>{secondaryLabel}</span>
            <span className="text-gray-500">{secondaryCount.toLocaleString()}</span>
          </div>
        </div>
      </li>
    </Link>
  );
};

export default PopularRankingCard;
