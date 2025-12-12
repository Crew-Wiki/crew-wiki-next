'use client';

import {useState, useEffect} from 'react';
import {useParams} from 'next/navigation';
import DocumentHeader from '@components/document/layout/DocumentHeader';
import DocumentFooter from '@components/document/layout/DocumentFooter';
import MobileDocumentHeader from '@components/document/layout/MobileDocumentHeader';
import Timeline from '@components/group/Timeline';
import Button from '@components/common/Button';
import {GroupDocumentResponse} from '@type/Group.type';
import {OrganizationEvent} from '@type/Event.type';
import markdownToHtml from '@utils/markdownToHtml';
import {processHtmlContent} from '@utils/processHtmlContent';
import TOC from '@components/document/TOC/TOC';
import '@components/document/layout/toastui-editor-viewer.css';

const GroupPage = () => {
  const {uuid} = useParams();
  const [groupDocument, setGroupDocument] = useState<GroupDocumentResponse | null>(null);
  const [events, setEvents] = useState<OrganizationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [htmlContents, setHtmlContents] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: 실제 API 연동
        // const [groupResponse, eventsResponse] = await Promise.all([
        //   getGroupDocumentByUUIDServer(uuid as string),
        //   getOrganizationEventsByDocumentUUID(uuid as string)
        // ]);

        const mockGroupData: GroupDocumentResponse = {
          organizationDocumentId: 1,
          organizationDocumentUuid: uuid as string,
          title: '크칠',
          contents: `# 그룹 정보

## 결성일

2025.04.14

## 그룹 설명

크루위키 7기 모임

# 구성원

루나, 밍트, 칼리, 체체`,

          writer: '관리자',
          generateTime: '2025-04-14T00:00:00Z',
        };

        const mockEvents: OrganizationEvent[] = [
          {
            id: 1,
            uuid: 'event-1',
            title: '크칠 결성',
            contents: '크루위키 7기 팀 결성',
            writer: '관리자',
            occurredAt: '2025-04-14',
            organizationDocumentId: 1,
            imageUrl:
              'data:image/jpeg;base64,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',
          },
          {
            id: 2,
            uuid: 'event-2',
            title: '첫 회의',
            contents: '프로젝트 킥오프 미팅을 진행',
            writer: '관리자',
            occurredAt: '2025-05-01',
            organizationDocumentId: 1,
          },
          {
            id: 3,
            uuid: 'event-3',
            title: '기획 완료',
            contents:
              '프로젝트 기획 및 개발 시작프로젝트 기획 및 개발 시작프로젝트 기획 및 개발 시작프로젝트 기획 및 개발 시작프로젝트 기획 및 개발 시작프로젝트 기획 및 개발 시작프로젝트 기획 및 개발 시작프로젝트 기획 및 개발 시작프로젝트 기획 및 개발 시작프로젝트 기획 및 개발 시작',
            writer: '관리자',
            occurredAt: '2025-05-15',
            organizationDocumentId: 1,
          },
          {
            id: 4,
            uuid: 'event-2',
            title: '회식',
            contents: '맛있는 회식을 했다',
            writer: '관리자',
            occurredAt: '2025-05-01',
            organizationDocumentId: 1,
            imageUrl:
              'data:image/jpeg;base64,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',
          },
          // {
          //   id: 5,
          //   uuid: 'event-3',
          //   title: '방학',
          //   contents: '방학이다',
          //   writer: '관리자',
          //   occurredAt: '2025-05-15',
          //   organizationDocumentId: 1,
          // },
          // {
          //   id: 6,
          //   uuid: 'event-3',
          //   title: '방학',
          //   contents: '방학이다',
          //   writer: '관리자',
          //   occurredAt: '2025-05-15',
          //   organizationDocumentId: 1,
          // },
        ];

        setGroupDocument(mockGroupData);
        setEvents(mockEvents);

        const html = await markdownToHtml(mockGroupData.contents);
        const processedHtml = processHtmlContent(html);
        setHtmlContents(processedHtml);
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uuid]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-grayscale-lightText">그룹 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (!groupDocument) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-grayscale-lightText">그룹을 찾을 수 없습니다.</div>
      </div>
    );
  }

  const extractHeadings = (html: string) => {
    const headings = html.split('\n').filter(str => str.includes('id'));
    headings.push('<h1 id="3">타임라인</h1>');
    return headings;
  };

  return (
    <div className="flex w-full flex-col gap-6 max-[768px]:gap-2">
      <MobileDocumentHeader uuid={groupDocument.organizationDocumentUuid} />
      <section className="flex h-fit min-h-[864px] w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-md:gap-2 max-md:p-4 max-[768px]:gap-2">
        <DocumentHeader title={groupDocument.title} uuid={groupDocument.organizationDocumentUuid} />
        <TOC headTags={extractHeadings(htmlContents)} />
        <div className="toastui-editor-contents" dangerouslySetInnerHTML={{__html: htmlContents}} />

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h1 id="3" className="font-bm text-2xl text-grayscale-text">
              타임라인
            </h1>
            <Button style="primary" size="xs">
              이벤트 추가
            </Button>
          </div>
          <Timeline events={events} />
        </div>
      </section>
      <DocumentFooter generateTime={groupDocument.generateTime} />
    </div>
  );
};

export default GroupPage;
