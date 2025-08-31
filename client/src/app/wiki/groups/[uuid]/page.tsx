import DocumentContents from '@components/document/layout/DocumentContents';
import DocumentFooter from '@components/document/layout/DocumentFooter';
import DocumentHeader from '@components/document/layout/DocumentHeader';
import MobileDocumentHeader from '@components/document/layout/MobileDocumentHeader';
import type {UUIDParams} from '@type/PageParams.type';
import {GroupDocumentResponse} from '@type/Group.type';
import markdownToHtml from '@utils/markdownToHtml';
import {Metadata} from 'next';
import {notFound} from 'next/navigation';

export const dynamicParams = true;

export async function generateMetadata({params}: UUIDParams): Promise<Metadata> {
  const {uuid} = await params;
  // TODO: 실제 API 연동 시 그룹 문서 메타데이터 생성
  return {
    title: '그룹 문서',
    description: '그룹 문서 페이지입니다',
  };
}

// 그룹 문서 데이터 가져오기 (임시 Mock 데이터)
const getGroupDocumentByUUID = async (uuid: string): Promise<GroupDocumentResponse | null> => {
  // TODO: 실제 API 연동
  // const response = await getGroupDocumentByUUIDServer(uuid);

  // 임시 Mock 데이터
  const mockData: GroupDocumentResponse = {
    organizationDocumentId: 1,
    organizationDocumentUuid: uuid,
    title: '크칠',
    contents: `# 그룹 정보

**결성일:** 2025.04.14

**그룹 설명:** 크루위키 7기 모임

# 구성원

- 루나, 밍트, 칼리, 체체

# 타임라인

## 크칠 결성

**날짜:** 2025.04.14

크루위키 7기 팀 결성

## 첫 회의

**날짜:** 2025.05.01

프로젝트 킥오프 미팅`,
    writer: '관리자',
    generateTime: '2025-04-14T00:00:00Z',
  };

  return mockData;
};

const GroupPage = async ({params}: UUIDParams) => {
  const {uuid} = await params;
  const groupDocument = await getGroupDocumentByUUID(uuid);

  if (!groupDocument) {
    notFound();
  }

  const contents = await markdownToHtml(groupDocument.contents);

  return (
    <div className="flex w-full flex-col gap-6 max-[768px]:gap-2">
      <MobileDocumentHeader uuid={groupDocument.organizationDocumentUuid} />
      <section className="flex h-fit min-h-[864px] w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-md:gap-2 max-md:p-4 max-[768px]:gap-2">
        <DocumentHeader title={groupDocument.title} uuid={groupDocument.organizationDocumentUuid} />
        <DocumentContents contents={contents} />
      </section>
      <DocumentFooter generateTime={groupDocument.generateTime} />
    </div>
  );
};

export default GroupPage;
