'use client';

import {useGetPopularDocuments} from '@hooks/fetch/useGetPopularDocuments';
import PopularRankingCard from '@components/document/Popular/PopularRankingCard';
import PopularDocumentList from '@components/document/Popular/PopularDocumentList';
import PopularHeader from '@components/document/Popular/PopularHeader';

export default function PopularPage() {
  const {data, sortType, changeSortType} = useGetPopularDocuments();

  const topThreeDocuments = data.slice(0, 3);
  const remainDocuments = data.slice(3);

  return (
    <div className="flex w-full flex-col gap-6 max-[768px]:gap-2">
      <section className="flex h-fit min-h-[864px] w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-md:p-4">
        <PopularHeader sortType={sortType} onSortTypeChange={changeSortType} />

        {/* 상위 3개 항목 - 금/은/동 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {topThreeDocuments.map((document, index) => (
            <PopularRankingCard key={document.title} document={document} rank={index + 1} sortType={sortType} />
          ))}
        </div>

        <PopularDocumentList documents={remainDocuments} sortType={sortType} />
      </section>
    </div>
  );
}
