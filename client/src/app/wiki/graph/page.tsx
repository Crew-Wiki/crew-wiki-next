'use client';

import GraphResults from '@components/graph/GraphResults';
import GraphToolbar from '@components/graph/GraphToolbar';
import {route} from '@constants/route';
import {useGetCrewGraph} from '@hooks/fetch/useGetCrewGraph';
import {useGraphFilters} from '@hooks/useGraphFilters';
import useAmplitude from '@hooks/useAmplitude';
import {filterCrewGraph} from '@utils/filterCrewGraph';
import {useRouter} from 'next/navigation';
import {Suspense, useEffect, useRef} from 'react';

const GraphContents = () => {
  const router = useRouter();
  const {trackGraphView, trackGraphCrewClick} = useAmplitude();
  const hasTrackedView = useRef(false);
  const {selectedGenerations, selectedFields, toggleGeneration, toggleField, resetFilters} = useGraphFilters();
  const {data, isLoading, errorMessage, refetch} = useGetCrewGraph(selectedGenerations);
  const {crews, fields} = filterCrewGraph(data, {selectedGenerations, selectedFields});

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    trackGraphView(selectedGenerations);
  }, [selectedGenerations, trackGraphView]);

  return (
    <section className="flex w-full flex-col items-center gap-6">
      <div className="flex h-fit min-h-[864px] w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-md:gap-2 max-md:p-4">
        <h1 className="font-bm text-2xl text-grayscale-800">크루 관계 그래프</h1>
        <GraphToolbar
          selectedGenerations={selectedGenerations}
          selectedFields={selectedFields}
          onGenerationToggle={toggleGeneration}
          onFieldToggle={toggleField}
          onReset={resetFilters}
        />
        <GraphResults
          hasSelectedGeneration={selectedGenerations.length > 0}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onRetry={() => void refetch()}
          onReset={resetFilters}
          crews={crews}
          fields={fields}
          references={[]}
          showReferences={false}
          isMultiGeneration={selectedGenerations.length > 1}
          onCrewActivate={crew => {
            trackGraphCrewClick(crew.title, crew.documentUuid, crew.field);
            router.push(route.goWiki(crew.documentUuid));
          }}
          onFieldToggle={toggleField}
        />
      </div>
    </section>
  );
};

const GraphPage = () => (
  <Suspense fallback={<p role="status">그래프 필터를 불러오는 중입니다.</p>}>
    <GraphContents />
  </Suspense>
);

export default GraphPage;
