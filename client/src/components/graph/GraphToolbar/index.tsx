import {GENERATIONS, GRAPH_FIELDS} from '@constants/graph';
import type {FieldId, Generation} from '@type/Graph.type';

interface GraphToolbarProps {
  selectedGenerations: Generation[];
  selectedFields: FieldId[];
  onGenerationToggle: (generation: Generation) => void;
  onFieldToggle: (fieldId: FieldId) => void;
  onReset: () => void;
}

const chipClassName =
  'min-h-11 rounded-full border border-solid border-grayscale-200 px-4 py-2 text-sm text-grayscale-700 aria-pressed:border-primary-700 aria-pressed:bg-primary-50 aria-pressed:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-700';

const GraphToolbar = ({
  selectedGenerations,
  selectedFields,
  onGenerationToggle,
  onFieldToggle,
  onReset,
}: GraphToolbarProps) => (
  <div className="flex flex-col gap-4">
    <fieldset className="flex flex-wrap gap-2">
      <legend className="mb-2 font-bold text-grayscale-800">기수</legend>
      {GENERATIONS.map(generation => (
        <button
          key={generation}
          type="button"
          aria-pressed={selectedGenerations.includes(generation)}
          onClick={() => onGenerationToggle(generation)}
          className={chipClassName}
        >
          {generation}
        </button>
      ))}
    </fieldset>

    <fieldset className="flex flex-wrap gap-2" aria-describedby="graph-field-help">
      <legend className="mb-2 font-bold text-grayscale-800">분야</legend>
      {GRAPH_FIELDS.map(field => (
        <button
          key={field.id}
          type="button"
          aria-pressed={selectedFields.includes(field.id)}
          onClick={() => onFieldToggle(field.id)}
          className={chipClassName}
        >
          {field.name}
        </button>
      ))}
    </fieldset>
    <p id="graph-field-help" className="text-sm text-grayscale-600">
      분야를 선택하지 않으면 전체 분야를 표시합니다.
    </p>

    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="선택한 필터">
      {selectedGenerations.map(generation => (
        <button
          key={generation}
          type="button"
          aria-label={`${generation} 선택 해제`}
          onClick={() => onGenerationToggle(generation)}
          className="min-h-11 rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-700"
        >
          {generation} <span aria-hidden="true">×</span>
        </button>
      ))}
      {GRAPH_FIELDS.filter(field => selectedFields.includes(field.id)).map(field => (
        <button
          key={field.id}
          type="button"
          aria-label={`${field.name} 선택 해제`}
          onClick={() => onFieldToggle(field.id)}
          className="min-h-11 rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-700"
        >
          {field.name} <span aria-hidden="true">×</span>
        </button>
      ))}
      <button type="button" onClick={onReset} className="min-h-11 px-3 py-2 text-sm text-grayscale-600 underline">
        필터 초기화
      </button>
    </div>
  </div>
);

export default GraphToolbar;
