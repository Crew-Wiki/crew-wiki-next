'use client';

import GraphCanvas from '@components/graph/GraphCanvas';
import GraphToolbar from '@components/graph/GraphToolbar';
import {route} from '@constants/route';
import {useGetCrewGraph} from '@hooks/fetch/useGetCrewGraph';
import {useGraphFilters} from '@hooks/useGraphFilters';
import {filterCrewGraph} from '@utils/filterCrewGraph';
import {useRouter} from 'next/navigation';
import {Suspense} from 'react';

const GraphContents = () => {
  const router = useRouter();
  const {selectedGenerations, selectedFields, toggleGeneration, toggleField, resetFilters} = useGraphFilters();
  const {data} = useGetCrewGraph(selectedGenerations);
  const {crews, fields} = filterCrewGraph(data, {selectedGenerations, selectedFields});

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
        <GraphCanvas
          crews={crews}
          fields={fields}
          references={[]}
          showReferences={false}
          isMultiGeneration={selectedGenerations.length > 1}
          onCrewActivate={crew => router.push(route.goWiki(crew.documentUuid))}
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
