'use client';

import GraphCanvas from '@components/graph/GraphCanvas';

// 1번 PR 의 페이지 스텁. 주소가 열리고 클라이언트 경계가 잡히는 것까지만 한다.
// 데이터 페치 · 필터 상태 · 툴바 · 로딩 / 빈 상태 / 오류와 재시도 · 텍스트 대체 목록은
// 데이터·조작 담당의 다음 PR 에서 이 자리에 들어온다. 머지 뒤 이 파일은 그쪽 단독 소유다.
const GraphPage = () => {
  return (
    <section className="flex w-full flex-col items-center gap-6">
      <div className="flex h-fit min-h-[864px] w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-md:gap-2 max-md:p-4">
        <h1 className="font-bm text-2xl text-grayscale-800">크루 관계 그래프</h1>
        <GraphCanvas
          crews={[]}
          fields={[]}
          references={[]}
          showReferences={false}
          isMultiGeneration={false}
          onCrewActivate={() => {}}
          onFieldToggle={() => {}}
        />
      </div>
    </section>
  );
};

export default GraphPage;
