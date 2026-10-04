import {CrewGraphResponse, GenerationCrewResponse} from '@type/Graph.type';

// 2026-10-01 에 운영 API 에서 그대로 받아 온 응답이다. 순서까지 손대지 않았다.
//  - 34건 중 25건이 field: null (분야 미입력)
//  - '8기 크루' 조직 문서가 크루 목록에 섞여 들어온다
//  - 제목이 '카야' 인 문서와 '카야(8기)' 인 문서가 따로 있다. 제목이 다르면 다른 문서다.
//    문서 제목 형식이 강제되지 않고 일반 사용자는 제목을 고칠 수 없어, 실수로 만든 문서가 그대로 남는다.
//    라벨에서 기수를 떼면 둘 다 '카야' 가 되지만 합치지 않는다 — 노드의 정체성은 documentUuid 다.
//  - 문서 제목에 '(8기)' 가 붙은 것과 안 붙은 것이 섞여 있다. 제목에 기수가 없어도
//    소속(조직 문서)으로 기수를 알 수 있다 — 조직 문서 기능은 8기부터 생겼다.
// 깨끗한 가짜 데이터로만 개발하면 마지막에 처음 보는 화면을 만나게 되므로, 이 상태를 기본값으로 둔다.
// 데이터는 계속 채워지므로 수치가 달라지면 이 주석의 날짜와 함께 갱신한다.

// 문서 UUID. 간선이 어느 문서를 잇는지 읽히도록 문서 제목을 키로 달아 둔다.
// 크루 목록의 name 과 문서 제목이 다를 수 있으므로(예: '카야' ↔ '카야(8기)') 키는 문서 제목을 따른다.
const DOC_UUID = {
  '8기 크루': '14f20cdd-f8bd-4977-b79f-39d5ca91a25d',
  고래: '109370dc-c601-4d9a-9fff-2acdb1d98de9',
  '도넛(8기)': '64df39d4-8e79-4047-877c-e571ea195eb8',
  '디움(8기)': '7b088fef-e92b-45dc-9eeb-3cfd7689a7f1',
  '라이(8기)': '66ebeb28-b5de-4cfb-a0ce-623f1819c85e',
  '라텔(8기)': 'bf3726e3-687f-4ec2-9c61-5c9c155346c3',
  '레스(8기)': '34629300-1996-4bd0-b0d0-43ad95608154',
  '루멘(8기)': '6a29ffde-c3f8-4d59-9039-cc7f1184ddaa',
  '마이찬(8기)': '54023777-3cb4-46f7-a086-ad96fb138e3d',
  '맥스(8기)': '766b4bba-c5b0-4c7a-b698-8331b105b622',
  '모아(8기)': 'eaedca4b-9dbf-468f-acb0-492e2ffa12da',
  '바니(8기)': '93552f8f-ad35-4c0f-8d13-3ec52041a5fb',
  '밤밤(8기)': '3796392b-f093-4dc1-ae1e-71b92fe8158d',
  '보예(8기)': '117817bf-d7b1-433e-9b5f-b9735a4c90a9',
  스마일: '2a1be8b7-aa02-4ba0-94d2-29d70773d04b',
  '아론(8기)': '07cc95e8-6719-430b-8d3a-6d3d6005f3be',
  '아오(8기)': 'c268fb6f-9e29-4438-9451-e4eabd396b35',
  '아지(8기)': 'b79f62ed-b2ba-4766-86b6-c52364bc2f96',
  '아키(8기)': 'a769e207-dde3-4568-9242-e93a71259b15',
  '에버(8기)': 'ce7bb7bc-8fd1-408e-8c23-8c62a8663e00',
  '요크(8기)': '3cf33a0c-c0cd-45a9-8e4b-cc8d7e852676',
  '유월(8기)': '13244cba-20b5-43a5-9249-e65512da0988',
  '은오(8기)': '483408c3-3e30-497f-94e6-aa78f1247d62',
  이프: '33b4a29c-7a19-4a4b-93dc-96c3647fb66f',
  '이현(8기)': 'f6490817-36a9-42e0-a65f-21884b45b120',
  카야: '1e680520-a92f-405b-9e40-5ed4ea1d1eaa',
  '카야(8기)': '41ee3f00-49f8-4ba7-9dbd-e93a53dd92a1',
  '커비(8기)': 'fb793c88-3a59-46b0-ad93-7de0f24e53e5',
  '코브(8기)': 'adb10f2a-ac5c-4018-a192-83aae1bb2f7d',
  티뉴: '787c9590-b192-4931-9ee0-4d5581d4eebe',
  '티모(8기)': '8391653f-87b3-41c9-abe0-a26b0061aaec',
  '포도(8기)': '0b1f11a1-3c3a-4365-96f6-5d67ef2b1e11',
  '피트(8기)': '2e8073ed-4eec-499c-9db4-a5d93b09a48f',
  흑곰: 'b5f3ad1e-4e83-4f91-b34b-76fe91637b46',
} as const;

export const crewListFixture: GenerationCrewResponse[] = [
  {name: '8기 크루', documentUuid: DOC_UUID['8기 크루'], field: null},
  {name: '고래', documentUuid: DOC_UUID.고래, field: null},
  {name: '도넛', documentUuid: DOC_UUID['도넛(8기)'], field: 'FRONTEND'},
  {name: '디움', documentUuid: DOC_UUID['디움(8기)'], field: null},
  {name: '라이', documentUuid: DOC_UUID['라이(8기)'], field: null},
  {name: '라텔', documentUuid: DOC_UUID['라텔(8기)'], field: null},
  {name: '레스', documentUuid: DOC_UUID['레스(8기)'], field: null},
  {name: '루멘', documentUuid: DOC_UUID['루멘(8기)'], field: null},
  {name: '마이찬', documentUuid: DOC_UUID['마이찬(8기)'], field: null},
  {name: '맥스', documentUuid: DOC_UUID['맥스(8기)'], field: null},
  {name: '모아', documentUuid: DOC_UUID['모아(8기)'], field: null},
  {name: '바니', documentUuid: DOC_UUID['바니(8기)'], field: 'BACKEND'},
  {name: '밤밤', documentUuid: DOC_UUID['밤밤(8기)'], field: null},
  {name: '보예', documentUuid: DOC_UUID['보예(8기)'], field: null},
  {name: '스마일', documentUuid: DOC_UUID.스마일, field: 'ANDROID'},
  {name: '아론', documentUuid: DOC_UUID['아론(8기)'], field: 'BACKEND'},
  {name: '아오', documentUuid: DOC_UUID['아오(8기)'], field: 'ANDROID'},
  {name: '아지', documentUuid: DOC_UUID['아지(8기)'], field: null},
  {name: '아키', documentUuid: DOC_UUID['아키(8기)'], field: 'ANDROID'},
  {name: '에버', documentUuid: DOC_UUID['에버(8기)'], field: null},
  {name: '요크', documentUuid: DOC_UUID['요크(8기)'], field: 'BACKEND'},
  {name: '유월', documentUuid: DOC_UUID['유월(8기)'], field: null},
  {name: '은오', documentUuid: DOC_UUID['은오(8기)'], field: null},
  {name: '이프', documentUuid: DOC_UUID.이프, field: null},
  {name: '이현', documentUuid: DOC_UUID['이현(8기)'], field: null},
  {name: '카야', documentUuid: DOC_UUID.카야, field: 'BACKEND'}, // 제목은 '카야'
  {name: '카야', documentUuid: DOC_UUID['카야(8기)'], field: null}, // 제목은 '카야(8기)' — 위와 다른 문서
  {name: '커비', documentUuid: DOC_UUID['커비(8기)'], field: 'ANDROID'},
  {name: '코브', documentUuid: DOC_UUID['코브(8기)'], field: null},
  {name: '티뉴', documentUuid: DOC_UUID.티뉴, field: null},
  {name: '티모', documentUuid: DOC_UUID['티모(8기)'], field: null},
  {name: '포도', documentUuid: DOC_UUID['포도(8기)'], field: null},
  {name: '피트', documentUuid: DOC_UUID['피트(8기)'], field: null},
  {name: '흑곰', documentUuid: DOC_UUID.흑곰, field: null},
];

// 분야가 전부 채워졌을 때의 그림. 완성 후 모습을 늘 볼 수 있게 둔다.
export const filledCrewListFixture: GenerationCrewResponse[] = [
  {name: '8기 크루', documentUuid: DOC_UUID['8기 크루'], field: 'BACKEND'},
  {name: '고래', documentUuid: DOC_UUID.고래, field: 'FRONTEND'},
  {name: '도넛', documentUuid: DOC_UUID['도넛(8기)'], field: 'FRONTEND'},
  {name: '디움', documentUuid: DOC_UUID['디움(8기)'], field: 'ANDROID'},
  {name: '라이', documentUuid: DOC_UUID['라이(8기)'], field: 'BACKEND'},
  {name: '라텔', documentUuid: DOC_UUID['라텔(8기)'], field: 'FRONTEND'},
  {name: '레스', documentUuid: DOC_UUID['레스(8기)'], field: 'ANDROID'},
  {name: '루멘', documentUuid: DOC_UUID['루멘(8기)'], field: 'BACKEND'},
  {name: '마이찬', documentUuid: DOC_UUID['마이찬(8기)'], field: 'FRONTEND'},
  {name: '맥스', documentUuid: DOC_UUID['맥스(8기)'], field: 'ANDROID'},
  {name: '모아', documentUuid: DOC_UUID['모아(8기)'], field: 'BACKEND'},
  {name: '바니', documentUuid: DOC_UUID['바니(8기)'], field: 'BACKEND'},
  {name: '밤밤', documentUuid: DOC_UUID['밤밤(8기)'], field: 'FRONTEND'},
  {name: '보예', documentUuid: DOC_UUID['보예(8기)'], field: 'ANDROID'},
  {name: '스마일', documentUuid: DOC_UUID.스마일, field: 'ANDROID'},
  {name: '아론', documentUuid: DOC_UUID['아론(8기)'], field: 'BACKEND'},
  {name: '아오', documentUuid: DOC_UUID['아오(8기)'], field: 'ANDROID'},
  {name: '아지', documentUuid: DOC_UUID['아지(8기)'], field: 'BACKEND'},
  {name: '아키', documentUuid: DOC_UUID['아키(8기)'], field: 'ANDROID'},
  {name: '에버', documentUuid: DOC_UUID['에버(8기)'], field: 'FRONTEND'},
  {name: '요크', documentUuid: DOC_UUID['요크(8기)'], field: 'BACKEND'},
  {name: '유월', documentUuid: DOC_UUID['유월(8기)'], field: 'ANDROID'},
  {name: '은오', documentUuid: DOC_UUID['은오(8기)'], field: 'BACKEND'},
  {name: '이프', documentUuid: DOC_UUID.이프, field: 'FRONTEND'},
  {name: '이현', documentUuid: DOC_UUID['이현(8기)'], field: 'ANDROID'},
  {name: '카야', documentUuid: DOC_UUID.카야, field: 'BACKEND'},
  {name: '카야', documentUuid: DOC_UUID['카야(8기)'], field: 'BACKEND'},
  {name: '커비', documentUuid: DOC_UUID['커비(8기)'], field: 'ANDROID'},
  {name: '코브', documentUuid: DOC_UUID['코브(8기)'], field: 'FRONTEND'},
  {name: '티뉴', documentUuid: DOC_UUID.티뉴, field: 'ANDROID'},
  {name: '티모', documentUuid: DOC_UUID['티모(8기)'], field: 'BACKEND'},
  {name: '포도', documentUuid: DOC_UUID['포도(8기)'], field: 'FRONTEND'},
  {name: '피트', documentUuid: DOC_UUID['피트(8기)'], field: 'ANDROID'},
  {name: '흑곰', documentUuid: DOC_UUID.흑곰, field: 'BACKEND'},
];

// 전원 미지정. 분야 개념이 없던 기수를 켰을 때 보이는 화면이다.
export const unassignedCrewListFixture: GenerationCrewResponse[] = crewListFixture.map(crew => ({
  ...crew,
  field: null,
}));

// 6기·7기는 실제로 0건이다 (2026-10-01 확인). 빈 상태 UI 가 이 값을 받는다.
export const emptyCrewListFixture: GenerationCrewResponse[] = [];

// GET /graph 응답. 노드 34 · 간선 34 이고 간선은 전부 REFERENCE 다. 응답 순서 그대로 둔다.
// 주의: '8기 크루' 는 조직 문서인데도 type 이 CREW 로 내려온다 — type 으로 조직을 가려낼 수 없다.
// 간선 34개 중 30개가 '8기 크루' 문서 하나에 붙어 있어(15 in · 15 out) 별 모양이 된다.
// 크루끼리의 참조는 아래 표시한 4개뿐이라, 참조 간선을 기본으로 켜면 관계를 오해하게 된다.
export const graphFixture: CrewGraphResponse = {
  nodes: [
    {documentUuid: DOC_UUID['8기 크루'], title: '8기 크루', type: 'CREW'},
    {documentUuid: DOC_UUID.고래, title: '고래', type: 'CREW'},
    {documentUuid: DOC_UUID['도넛(8기)'], title: '도넛(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['디움(8기)'], title: '디움(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['라이(8기)'], title: '라이(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['라텔(8기)'], title: '라텔(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['레스(8기)'], title: '레스(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['루멘(8기)'], title: '루멘(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['마이찬(8기)'], title: '마이찬(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['맥스(8기)'], title: '맥스(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['모아(8기)'], title: '모아(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['바니(8기)'], title: '바니(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['밤밤(8기)'], title: '밤밤(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['보예(8기)'], title: '보예(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID.스마일, title: '스마일', type: 'CREW'},
    {documentUuid: DOC_UUID['아론(8기)'], title: '아론(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['아오(8기)'], title: '아오(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['아지(8기)'], title: '아지(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['아키(8기)'], title: '아키(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['에버(8기)'], title: '에버(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['요크(8기)'], title: '요크(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['유월(8기)'], title: '유월(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['은오(8기)'], title: '은오(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID.이프, title: '이프', type: 'CREW'},
    {documentUuid: DOC_UUID['이현(8기)'], title: '이현(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID.카야, title: '카야', type: 'CREW'},
    {documentUuid: DOC_UUID['카야(8기)'], title: '카야(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['커비(8기)'], title: '커비(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['코브(8기)'], title: '코브(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID.티뉴, title: '티뉴', type: 'CREW'},
    {documentUuid: DOC_UUID['티모(8기)'], title: '티모(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['포도(8기)'], title: '포도(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID['피트(8기)'], title: '피트(8기)', type: 'CREW'},
    {documentUuid: DOC_UUID.흑곰, title: '흑곰', type: 'CREW'},
  ],
  edges: [
    {sourceDocumentUuid: DOC_UUID['티모(8기)'], targetDocumentUuid: DOC_UUID['에버(8기)'], type: 'REFERENCE'}, // 크루 ↔ 크루
    {sourceDocumentUuid: DOC_UUID['티모(8기)'], targetDocumentUuid: DOC_UUID['8기 크루'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['티모(8기)'], targetDocumentUuid: DOC_UUID['라이(8기)'], type: 'REFERENCE'}, // 크루 ↔ 크루
    {sourceDocumentUuid: DOC_UUID['바니(8기)'], targetDocumentUuid: DOC_UUID['8기 크루'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['아키(8기)'], targetDocumentUuid: DOC_UUID['8기 크루'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['코브(8기)'], targetDocumentUuid: DOC_UUID['8기 크루'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['아지(8기)'], targetDocumentUuid: DOC_UUID['8기 크루'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['라텔(8기)'], targetDocumentUuid: DOC_UUID['8기 크루'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['아오(8기)'], targetDocumentUuid: DOC_UUID['8기 크루'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['에버(8기)'], targetDocumentUuid: DOC_UUID['8기 크루'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['에버(8기)'], targetDocumentUuid: DOC_UUID['라이(8기)'], type: 'REFERENCE'}, // 크루 ↔ 크루
    {sourceDocumentUuid: DOC_UUID['모아(8기)'], targetDocumentUuid: DOC_UUID['8기 크루'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['이현(8기)'], targetDocumentUuid: DOC_UUID['8기 크루'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['커비(8기)'], targetDocumentUuid: DOC_UUID['8기 크루'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['아론(8기)'], targetDocumentUuid: DOC_UUID['8기 크루'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['포도(8기)'], targetDocumentUuid: DOC_UUID['8기 크루'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID.고래, targetDocumentUuid: DOC_UUID['보예(8기)'], type: 'REFERENCE'}, // 크루 ↔ 크루
    {sourceDocumentUuid: DOC_UUID['보예(8기)'], targetDocumentUuid: DOC_UUID['8기 크루'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['유월(8기)'], targetDocumentUuid: DOC_UUID['8기 크루'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['8기 크루'], targetDocumentUuid: DOC_UUID.스마일, type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['8기 크루'], targetDocumentUuid: DOC_UUID['피트(8기)'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['8기 크루'], targetDocumentUuid: DOC_UUID.이프, type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['8기 크루'], targetDocumentUuid: DOC_UUID['레스(8기)'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['8기 크루'], targetDocumentUuid: DOC_UUID['밤밤(8기)'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['8기 크루'], targetDocumentUuid: DOC_UUID['요크(8기)'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['8기 크루'], targetDocumentUuid: DOC_UUID['카야(8기)'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['8기 크루'], targetDocumentUuid: DOC_UUID['은오(8기)'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['8기 크루'], targetDocumentUuid: DOC_UUID['마이찬(8기)'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['8기 크루'], targetDocumentUuid: DOC_UUID['도넛(8기)'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['8기 크루'], targetDocumentUuid: DOC_UUID['라이(8기)'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['8기 크루'], targetDocumentUuid: DOC_UUID['루멘(8기)'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['8기 크루'], targetDocumentUuid: DOC_UUID['맥스(8기)'], type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['8기 크루'], targetDocumentUuid: DOC_UUID.티뉴, type: 'REFERENCE'},
    {sourceDocumentUuid: DOC_UUID['8기 크루'], targetDocumentUuid: DOC_UUID['디움(8기)'], type: 'REFERENCE'},
  ],
};

export const emptyGraphFixture: CrewGraphResponse = {nodes: [], edges: []};
