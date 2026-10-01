// 관계 그래프 상수. 배치 파라미터는 기획안의 동작 데모에서 그대로 옮긴 값이다.
// 이 파일은 그래프(A)와 데이터·조작(B)이 함께 쓰는 계약이므로, 머지 뒤에는 둘이 같이 고친다.

export const FIELD_ID = {
  Backend: 'backend',
  Frontend: 'frontend',
  Android: 'android',
  Unassigned: 'unassigned',
} as const;

// API 응답의 field 값. 분야를 입력하지 않은 크루는 null 로 내려온다.
export const CREW_FIELD = {
  Backend: 'BACKEND',
  Frontend: 'FRONTEND',
  Android: 'ANDROID',
} as const;

// API 응답 field → 그래프 그룹. null 은 이 표에 없으므로 Unassigned 로 접힌다.
export const CREW_FIELD_TO_FIELD_ID = {
  BACKEND: FIELD_ID.Backend,
  FRONTEND: FIELD_ID.Frontend,
  ANDROID: FIELD_ID.Android,
} as const;

// 미지정은 항상 배열 마지막. 좁은 화면 세로 스택이 이 순서를 그대로 따르므로,
// 순서를 바꾸면 미지정이 세 분야 위로 올라간다.
export const GRAPH_FIELDS = [
  {id: FIELD_ID.Backend, name: 'Backend'},
  {id: FIELD_ID.Frontend, name: 'Frontend'},
  {id: FIELD_ID.Android, name: 'Android'},
  {id: FIELD_ID.Unassigned, name: '미지정'},
] as const;

// generation 은 숫자가 아니라 '8기' 형식 문자열이다.
// generation=8 로 보내면 오류 없이 빈 배열이 오므로 리터럴 유니온으로 막는다.
// 쿼리스트링 인코딩은 objectToQueryString 이 하므로 여기에 미리 인코딩한 값을 넣지 않는다.
export const GENERATIONS = ['6기', '7기', '8기', '9기'] as const;
export const CURRENT_GENERATION = '8기';

export const GRAPH_STAGE = {
  width: 1160,
  height: 734,
  centerX: 580, // width / 2
  centerY: 367, // height / 2
} as const;

export const GRAPH_NODE = {
  fieldPillWidth: 118, // 인원수·분야명 길이와 무관하게 고정
  fieldPillHeight: 42,
  fieldPillRadius: 10, // 둥근 사각형. 높이의 절반을 주면 알약이 되는데 그러면 글자가 좁아 보인다
  fieldPillEdgeClamp: 27, // 간선 끝점을 알약에 붙일 때 쓰는 반지름 상한
  fieldPillFontSize: 14,
  fieldPillCountFontSize: 11, // 인원수는 이름보다 작고 흐리게 — 읽는 순서를 이름 → 숫자로 만든다
  fieldPillCountGap: 7,
  crewLabelFontSize: 12,
  crewRadius: 11, // 알약 높이의 절반. 데모가 쓰는 비율이다
  crewLabelOffsetY: 29, // 라벨은 노드 아래에 상시 표시. 점 반지름의 2.6배
  edgeGap: 3, // 간선이 노드에 닿지 않게 띄우는 여유

  // 크루 노드는 여러 겹이다. 비율은 기획안 데모를 따랐다(점 10 · 후광 15 · 라벨 26 기준).
  // 점은 알약보다 확실히 작아야 분야 알약이 그룹의 중심으로 읽힌다.
  crewHaloRadius: 17, // 점 반지름의 1.5배
  crewHaloWidth: 7, // 점을 감싸는 도넛 두께. 점 반지름의 0.6배
  crewHitRadius: 22, // 투명한 클릭·호버 영역. 지름 44 로 터치 타깃 권장치를 맞췄다
  pastGenerationStrokeWidth: 3, // 지난 기수는 연하게 채우고 테두리로 형태를 세운다
} as const;

// 노드 크기를 인원수나 연결 수에 따라 바꾸지 않는다.
// 크기와 굵기는 이후 로드맵(관계 가중치 · 노드 가중치)을 위해 아껴 둔 표현 수단이다.
export const GRAPH_LAYOUT = {
  narrowBreakpoint: 700, // stage 너비가 이보다 작으면 세로 스택

  // 앵커 — 넓은 화면
  twoGroupOffsetX: 238,
  anchorRadiusX: 286,
  anchorRadiusY: 142,
  assignedShiftY: -130, // 그룹이 4개일 때 세 분야를 위로 올리는 양
  unassignedOffsetY: 250, // 그룹이 4개일 때 미지정을 아래로 내리는 양

  // 앵커 — 좁은 화면 세로 스택
  narrowStackGap: 90, // 그룹 반경은 링 기준이라 라벨 높이가 빠져 있다. 그만큼 여기서 더 벌린다
  narrowClusterThreshold: 7,
  narrowClusterRadiusMax: 136,
  narrowClusterRadiusBase: 62,
  narrowClusterRadiusStep: 4.4,

  // 그룹 안에서 크루를 링에 배치
  ringLimitWide: 9, // 이보다 많으면 두 링으로 쪼갠다
  ringLimitNarrow: 7,
  ringSplitRatio: 0.42, // 앞 42% 가 안쪽 링
  ringSpanWide: 4.9, // rad. 그룹이 하나거나 좁은 화면이면 2π
  ringRadiusWideBase: 72,
  ringRadiusWideStep: 5,
  ringRadiusWideInner: 96,
  ringRadiusWideOuter: 158,
  ringRadiusNarrowInner: 82,
  ringRadiusNarrowOuter: 136,

  // 반발 완화 — 겹친 노드를 밀어내는 반복 루프
  relaxIterations: 90,
  minGapSingleGeneration: 48,
  minGapMultiGeneration: 58, // 라벨에 기수를 병기하므로 더 벌린다
  pillClearance: 26, // 알약이 끼어 있는 쌍의 추가 여유
  labelBaseWidth: 14, // 라벨 좌우 여백
  labelCharWidth: 12, // 12px 한글 한 글자의 실제 폭에 맞춘 값
  labelRowThreshold: 26, // y 차이가 이보다 작으면 같은 줄로 보고 라벨 폭까지 확보한다
  labelPadding: 8,
  pillRelaxWeight: 0.1, // 알약은 거의 밀리지 않는다
  pillRelaxPushRatio: 0.5, // 겹친 거리의 절반씩 양쪽으로 민다
  multiGenerationLabelPad: 2, // '8기' 병기 시 라벨 길이 보정

  // 뷰박스 맞춤 — 라벨이 노드 아래로 나가므로 크루의 세로 여백은 비대칭이다
  fitPadding: 22,
  fitCrewBoundsX: 36,
  fitCrewBoundsTop: 11,
  fitCrewBoundsBottom: 34,
  fitHeightNarrowMin: 360,
  fitHeightNarrowMax: 1500,
  fitHeightWideMin: 420,
  fitHeightWideMax: 560,
  fitHeightWideRatio: 0.55,
} as const;

// 배치 함수가 목표 좌표만 내고, 실제 이동은 렌더 루프의 스프링이 맡는다.
export const GRAPH_MOTION = {
  stiffness: 0.14,
  damping: 0.76,
  scaleLerp: 0.18, // 등장 스케일
  viewBoxLerp: 0.14,
  settleVelocity: 0.05, // 이 값들 아래로 떨어지면 루프를 멈춘다
  settleScale: 0.995,
  settleViewBox: 0.4,
} as const;

// 분야별 색 계약. B의 필터 칩도 같은 맵을 쓴다.
// 클래스를 문자열로 박아 두는 이유: Tailwind JIT 는 `fill-${id}-500` 같은 동적 조합을 찾지 못한다.
//
// 점은 기수에 따라 두 가지다.
//  - dot : 지금 기수. 팀이 정한 기준색(500)으로 꽉 채운다
//  - pastDot : 지난 기수. 100 으로 연하게 채우고 500 테두리로 형태만 세운다.
//    100 단계는 흰 배경과 거의 구분되지 않으므로 테두리가 없으면 점이 사라진다
// 알약은 흰 글자가 올라가므로 대비 4.5:1 을 넘는 단계를 쓴다. 주황만 500 이 2.98:1 이라 700 을 쓴다.
// 미지정은 분야가 아니라 '아직 비어 있음' 이므로 가장 연하게 두어 세 분야보다 뒤로 물러나게 한다.
export const GRAPH_FIELD_STYLE = {
  [FIELD_ID.Backend]: {
    pill: 'fill-backend-500',
    dot: 'fill-backend-500',
    pastDot: 'fill-backend-100 stroke-backend-500',
    halo: 'stroke-backend-500',
  },
  [FIELD_ID.Frontend]: {
    pill: 'fill-frontend-500',
    dot: 'fill-frontend-500',
    pastDot: 'fill-frontend-100 stroke-frontend-500',
    halo: 'stroke-frontend-500',
  },
  [FIELD_ID.Android]: {
    pill: 'fill-android-700',
    dot: 'fill-android-500',
    pastDot: 'fill-android-100 stroke-android-500',
    halo: 'stroke-android-500',
  },
  [FIELD_ID.Unassigned]: {
    pill: 'fill-grayscale-600',
    dot: 'fill-grayscale-400',
    pastDot: 'fill-grayscale-100 stroke-grayscale-400',
    halo: 'stroke-grayscale-400',
  },
} as const;

// 크루 이름은 분야와 무관하게 한 가지 색이다.
// 점이 이미 분야를 말하고 있어서 글자까지 물들이면 화면이 시끄럽고, 이름끼리 비교하기도 어려워진다.
export const GRAPH_CREW_LABEL_CLASS = 'fill-grayscale-800';
