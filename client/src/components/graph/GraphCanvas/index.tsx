import {GraphCanvasProps} from '@type/Graph.type';

// 1번 PR 의 빈 껍데기다. 받은 props 를 숫자로 찍고 콜백을 눌러 볼 수 있게만 해 둔다.
// 데이터·조작 담당이 그래프 완성을 기다리지 않고 첫날부터 필터·툴바 배선을 검증하는 용도이고,
// SVG 3계층·배치·스프링 애니메이션은 그래프 담당의 다음 PR 에서 이 자리에 들어온다.
const GraphCanvas = ({
  crews,
  fields,
  references,
  showReferences,
  isMultiGeneration,
  onCrewActivate,
  onFieldToggle,
}: GraphCanvasProps) => (
  <div className="flex flex-col gap-4 rounded-xl border border-solid border-primary-100 p-6">
    <p className="text-grayscale-600">
      크루 {crews.length}명 · 분야 {fields.length}개 · 참조 {references.length}개{showReferences ? '' : ' (숨김)'}
      {isMultiGeneration ? ' · 여러 기수' : ''}
    </p>

    <div className="flex flex-wrap gap-2">
      {fields.map(field => (
        <button
          key={field.id}
          type="button"
          aria-pressed={field.isSelected}
          onClick={() => onFieldToggle(field.id)}
          className="rounded-full border border-solid border-grayscale-200 px-3 py-1 aria-pressed:border-primary-700"
        >
          {field.name} {field.crewCount}
        </button>
      ))}
    </div>

    <div className="flex flex-wrap gap-2">
      {crews.map(crew => (
        <button key={crew.id} type="button" onClick={() => onCrewActivate(crew)} className="text-primary-700 underline">
          {crew.label}
        </button>
      ))}
    </div>
  </div>
);

export default GraphCanvas;
