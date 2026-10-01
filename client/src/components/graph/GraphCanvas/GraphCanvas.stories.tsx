import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import GraphCanvas from '@components/graph/GraphCanvas';
import {
  crewListFixture,
  emptyCrewListFixture,
  filledCrewListFixture,
  graphFixture,
  unassignedCrewListFixture,
} from '@components/graph/graphFixture';
import {
  CREW_FIELD_TO_FIELD_ID,
  FIELD_ID,
  GRAPH_FIELDS,
  GRAPH_FIELD_STYLE,
  GRAPH_NODE,
  GRAPH_STAGE,
} from '@constants/graph';
import {calculateGraphLayout, fieldNodeKey, fitGraphViewBox} from '@utils/calculateGraphLayout';
import {toGraphLabel} from '@utils/toGraphLabel';
import type {GenerationCrewResponse, GraphCrew, GraphField} from '@type/Graph.type';

// 스토리에서만 쓰는 최소 변환이다. 실제 정제 — 조직 문서 걸러내기, 소속으로 기수 판별하기 등 —
// 은 데이터·조작 담당의 다음 PR 에서 만든다. 여기서는 배치와 껍데기를 눈으로 보는 것이 목적이다.
const toCrews = (list: GenerationCrewResponse[]): GraphCrew[] =>
  list.map(crew => {
    const node = graphFixture.nodes.find(graphNode => graphNode.documentUuid === crew.documentUuid);
    const title = node?.title ?? crew.name;

    return {
      id: `crew:${crew.documentUuid}`,
      title,
      label: toGraphLabel(title),
      documentUuid: crew.documentUuid,
      documentType: node?.type ?? 'CREW',
      field: crew.field ? CREW_FIELD_TO_FIELD_ID[crew.field] : FIELD_ID.Unassigned,
      generation: '8기',
    };
  });

const toFields = (crews: GraphCrew[]): GraphField[] =>
  GRAPH_FIELDS.map(field => ({
    id: field.id,
    name: field.name,
    crewCount: crews.filter(crew => crew.field === field.id).length,
    isSelected: false,
  }));

// 배치 함수가 낸 좌표를 그대로 그린다. 이 레포에는 테스트 러너가 없어서,
// 네 그룹이 겹치지 않고 미지정이 아래에 오는지는 이 그림으로 확인한다.
const LayoutPreview = ({crews, isNarrow = false}: {crews: GraphCrew[]; isNarrow?: boolean}) => {
  const fields = toFields(crews);
  const layout = calculateGraphLayout({crews, fields, isMultiGeneration: false, isNarrow});
  const stageWidth = isNarrow ? 420 : GRAPH_STAGE.width;
  const viewBox = fitGraphViewBox(layout, stageWidth, isNarrow);

  return (
    <svg
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
      width={stageWidth}
      className="max-w-full rounded-xl border border-solid border-grayscale-200 bg-white"
    >
      {crews.map(crew => {
        const position = layout[crew.id];
        const style = GRAPH_FIELD_STYLE[crew.field];

        return (
          <g key={crew.id}>
            <circle cx={position.x} cy={position.y} r={GRAPH_NODE.crewRadius} strokeWidth={2} className={style.dot} />
            <text
              x={position.x}
              y={position.y + GRAPH_NODE.crewLabelOffsetY}
              textAnchor="middle"
              fontSize={12}
              className={style.label}
            >
              {crew.label}
            </text>
          </g>
        );
      })}

      {fields.map(field => {
        const position = layout[fieldNodeKey(field.id)];
        const style = GRAPH_FIELD_STYLE[field.id];

        return (
          <g key={field.id}>
            <rect
              x={position.x - GRAPH_NODE.fieldPillWidth / 2}
              y={position.y - GRAPH_NODE.fieldPillHeight / 2}
              width={GRAPH_NODE.fieldPillWidth}
              height={GRAPH_NODE.fieldPillHeight}
              rx={GRAPH_NODE.fieldPillRadius}
              className={style.pill}
            />
            <text x={position.x} y={position.y + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="#ffffff">
              {field.name} {field.crewCount}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const meta: Meta<typeof GraphCanvas> = {
  title: 'Graph/GraphCanvas',
  component: GraphCanvas,
  parameters: {layout: 'fullscreen'},
};
export default meta;

type Story = StoryObj<typeof meta>;

const baseArgs = {
  references: [],
  showReferences: false,
  isMultiGeneration: false,
  onCrewActivate: () => {},
  onFieldToggle: () => {},
};

// 2026-10-01 실측 그대로. 34명 중 25명이 미지정이다.
export const Default: Story = {
  args: {...baseArgs, crews: toCrews(crewListFixture), fields: toFields(toCrews(crewListFixture))},
};

// 분야가 전부 채워졌을 때
export const FieldsFilled: Story = {
  args: {...baseArgs, crews: toCrews(filledCrewListFixture), fields: toFields(toCrews(filledCrewListFixture))},
};

// 분야 개념이 없던 기수를 켰을 때
export const AllUnassigned: Story = {
  args: {...baseArgs, crews: toCrews(unassignedCrewListFixture), fields: toFields(toCrews(unassignedCrewListFixture))},
};

// 6기·7기는 실제로 0건이다
export const Empty: Story = {
  args: {...baseArgs, crews: toCrews(emptyCrewListFixture), fields: toFields([])},
};

// 네 그룹의 좌표. 미지정이 세 분야 아래에 오는지 여기서 확인한다.
export const Layout: Story = {
  render: () => <LayoutPreview crews={toCrews(crewListFixture)} />,
};

// 분야가 다 찼을 때의 배치
export const LayoutFieldsFilled: Story = {
  render: () => <LayoutPreview crews={toCrews(filledCrewListFixture)} />,
};

// 좁은 화면에서는 네 그룹이 세로로 쌓인다. 미지정이 맨 아래 단이다.
export const LayoutNarrow: Story = {
  render: () => <LayoutPreview crews={toCrews(crewListFixture)} isNarrow />,
};
