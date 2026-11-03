import {LoadingSpinner} from '@components/common/LoadingSpinner';
import GraphCanvas from '@components/graph/GraphCanvas';
import GraphCrewList from '@components/graph/GraphCrewList';
import type {GraphCanvasProps} from '@type/Graph.type';

interface GraphResultsProps extends GraphCanvasProps {
  hasSelectedGeneration: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  onReset: () => void;
}

const GraphResults = ({
  hasSelectedGeneration,
  isLoading,
  errorMessage,
  onRetry,
  onReset,
  ...canvasProps
}: GraphResultsProps) => {
  if (!hasSelectedGeneration) {
    return <p role="status">표시할 기수를 선택해 주세요.</p>;
  }

  if (isLoading) {
    return (
      <div role="status" className="flex min-h-40 items-center justify-center gap-3 text-grayscale-600">
        <span aria-hidden="true">
          <LoadingSpinner />
        </span>
        크루 관계 데이터를 불러오는 중입니다.
      </div>
    );
  }

  if (errorMessage !== null) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p role="alert">크루 관계 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
        <button
          type="button"
          onClick={onRetry}
          className="min-h-11 rounded-lg border border-solid border-primary-700 px-4 py-2 text-primary-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (canvasProps.crews.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p role="status">선택한 조건에 해당하는 크루가 없습니다.</p>
        <button type="button" onClick={onReset} className="min-h-11 px-3 py-2 text-primary-700 underline">
          필터 초기화
        </button>
      </div>
    );
  }

  return (
    <>
      <p role="status" className="text-sm text-grayscale-600">
        선택한 조건의 크루 {canvasProps.crews.length}명
      </p>
      <GraphCanvas {...canvasProps} />
      <GraphCrewList crews={canvasProps.crews} />
    </>
  );
};

export default GraphResults;
