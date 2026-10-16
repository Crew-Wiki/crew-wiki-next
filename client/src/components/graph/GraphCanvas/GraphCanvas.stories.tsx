import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {fn} from 'storybook/test';
import {useState} from 'react';
import GraphCanvas from '@components/graph/GraphCanvas';
import {
  crewListFixture,
  emptyCrewListFixture,
  filledCrewListFixture,
  graphFixture,
  unassignedCrewListFixture,
} from '@components/graph/graphFixture';
import {CREW_FIELD_TO_FIELD_ID, FIELD_ID, GRAPH_FIELDS} from '@constants/graph';
import {toGraphLabel} from '@utils/toGraphLabel';
import type {
  FieldId,
  GenerationCrewResponse,
  GraphCanvasProps,
  GraphCrew,
  GraphField,
  GraphReference,
} from '@type/Graph.type';

// 스토리에서만 쓰는 최소 변환이다. 실제 정제 — 조직 문서 걸러내기, 소속으로 기수 판별하기 등 —
// 은 데이터·조작 담당의 다음 PR 에서 만든다. 여기서는 그래프가 그리는 모습을 눈으로 보는 것이 목적이다.
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

// 실측 그래프 응답의 참조 간선을 크루 id 쌍으로 바꾼다. 양 끝이 모두 크루 목록에 있는 것만 남긴다.
const toReferences = (crews: GraphCrew[]): GraphReference[] => {
  const crewIds = new Set(crews.map(crew => crew.id));

  return graphFixture.edges
    .map(edge => ({
      sourceCrewId: `crew:${edge.sourceDocumentUuid}`,
      targetCrewId: `crew:${edge.targetDocumentUuid}`,
    }))
    .filter(reference => crewIds.has(reference.sourceCrewId) && crewIds.has(reference.targetCrewId));
};

// 픽스처가 전부 8기라 세 명 중 한 명을 7기로 돌려 두 스타일을 나란히 본다.
const withMixedGenerations = (crews: GraphCrew[]): GraphCrew[] =>
  crews.map((crew, index) => (index % 3 === 0 ? {...crew, generation: '7기' as const} : crew));

const meta: Meta<typeof GraphCanvas> = {
  title: 'Graph/GraphCanvas',
  component: GraphCanvas,
  parameters: {layout: 'fullscreen'},
};
export default meta;

type Story = StoryObj<typeof meta>;

// 두 콜백은 fn() 이라 Actions 패널에 호출이 찍힌다. 크루 클릭·알약 클릭이 어떤 인자로 올라오는지 거기서 본다.
const baseArgs = {
  references: [],
  showReferences: false,
  isMultiGeneration: false,
  onCrewActivate: fn(),
  onFieldToggle: fn(),
};

const defaultCrews = toCrews(crewListFixture);
const filledCrews = toCrews(filledCrewListFixture);

// 2026-10-01 실측 그대로. 34명 중 25명이 미지정이다.
export const Default: Story = {
  args: {...baseArgs, crews: defaultCrews, fields: toFields(defaultCrews)},
};

// 분야가 전부 채워졌을 때
export const FieldsFilled: Story = {
  args: {...baseArgs, crews: filledCrews, fields: toFields(filledCrews)},
};

// 분야 하나만 골라 봤을 때. 그룹이 하나면 크루가 알약을 빙 둘러싼다.
export const SingleField: Story = {
  args: {
    ...baseArgs,
    crews: filledCrews.filter(crew => crew.field === FIELD_ID.Backend),
    fields: toFields(filledCrews)
      .filter(field => field.id === FIELD_ID.Backend)
      .map(field => ({...field, isSelected: true})),
  },
};

// 분야 개념이 없던 기수를 켰을 때
export const AllUnassigned: Story = {
  args: {...baseArgs, crews: toCrews(unassignedCrewListFixture), fields: toFields(toCrews(unassignedCrewListFixture))},
};

// 여러 기수를 함께 볼 때. 지금 기수는 꽉 찬 점, 지난 기수는 연한 점에 테두리만 남고 이름 뒤에 기수가 붙는다.
export const MixedGenerations: Story = {
  args: {
    ...baseArgs,
    crews: withMixedGenerations(filledCrews),
    fields: toFields(filledCrews),
    isMultiGeneration: true,
  },
};

// 참조 간선을 켰을 때. 점선이 노드 아래 겹으로 깔리고, 크루를 호버하면 참조로 이어진 크루도 함께 밝아진다.
export const WithReferences: Story = {
  args: {
    ...baseArgs,
    crews: defaultCrews,
    fields: toFields(defaultCrews),
    references: toReferences(defaultCrews),
    showReferences: true,
  },
};

// 좁은 화면. 자리 너비가 700 미만이면 네 그룹이 세로로 쌓이고 미지정이 맨 아래 단이다.
export const Narrow: Story = {
  args: {...baseArgs, crews: defaultCrews, fields: toFields(defaultCrews)},
  decorators: [
    Story => (
      <div style={{width: 420}}>
        <Story />
      </div>
    ),
  ],
};

// 6기·7기는 실제로 0건이다
export const Empty: Story = {
  args: {...baseArgs, crews: toCrews(emptyCrewListFixture), fields: toFields([])},
};

// 알약을 눌러 그 분야의 크루를 껐다 켤 수 있다. 움직임을 보기 위한 스토리 전용 동작이고,
// 실제로 알약 클릭이 무엇을 거르는지는 데이터·조작 쪽이 정한다.
// 켤 때 크루들이 알약에서 퍼져 나오고, 남은 그룹은 새 자리로 스프링 이동한다.
const PlaygroundGraph = ({crews: allCrews, fields: allFields, onFieldToggle, ...args}: GraphCanvasProps) => {
  const [hiddenFieldIds, setHiddenFieldIds] = useState<FieldId[]>([]);

  const handleFieldToggle = (fieldId: FieldId) => {
    setHiddenFieldIds(current =>
      current.includes(fieldId) ? current.filter(id => id !== fieldId) : [...current, fieldId],
    );
    onFieldToggle(fieldId);
  };

  return (
    <GraphCanvas
      {...args}
      crews={allCrews.filter(crew => !hiddenFieldIds.includes(crew.field))}
      fields={allFields.map(field => ({...field, isSelected: !hiddenFieldIds.includes(field.id)}))}
      onFieldToggle={handleFieldToggle}
    />
  );
};

export const Playground: Story = {
  args: {...baseArgs, crews: filledCrews, fields: toFields(filledCrews)},
  render: args => <PlaygroundGraph {...args} />,
};
