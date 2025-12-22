'use client';

import dynamic from 'next/dynamic';
import Button from '@components/common/Button';
import {useModal} from '@components/common/Modal/useModal';
import EventAddModal from '@components/group/EventAddModal';
import {EventFormData} from '@type/Event.type';
import {OrganizationEventResponse} from '@type/Group.type';
import {useRouter} from 'next/navigation';

// react-chrono 라이브러리 때문에 hydration 오류가 발생(라이브러리가 내부적으로 브라우저 전용 API를 사용해서 서버 렌더링 결과와 클라이언트 렌더링 결과가 다름)
// Timeline 컴포넌트를 동적 import해서 SSR을 비활성화
const Timeline = dynamic(() => import('@components/group/Timeline'), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-lg bg-grayscale-50">
      <p className="font-pretendard text-sm text-grayscale-lightText">타임라인 로딩 중...</p>
    </div>
  ),
});

interface TimelineSectionProps {
  events: OrganizationEventResponse[];
  organizationDocumentUuid: string;
}

const TimelineSection = ({events, organizationDocumentUuid}: TimelineSectionProps) => {
  const router = useRouter();

  const handleAddEvent = async (data: {date: Date; title: string; contents: string; writer: string}) => {
    const year = data.date.getFullYear();
    const month = String(data.date.getMonth() + 1).padStart(2, '0');
    const day = String(data.date.getDate()).padStart(2, '0');
    const occurredAt = `${year}-${month}-${day}`;

    const eventData: EventFormData = {
      title: data.title,
      contents: data.contents,
      writer: data.writer,
      occurredAt,
      organizationDocumentUuid,
    };

    try {
      const response = await fetch('/api/post-organization-event', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        closeModal();
        router.refresh();
      } else {
        console.error('이벤트 추가 실패');
      }
    } catch (error) {
      console.error('이벤트 추가 중 오류:', error);
    }
  };

  const {
    open: openModal,
    close: closeModal,
    component: modalComponent,
  } = useModal(<EventAddModal onCancel={() => closeModal()} onSubmit={handleAddEvent} />);

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 id="3" className="font-bm text-2xl text-grayscale-text">
          타임라인
        </h1>
        <Button style="primary" size="xs" onClick={openModal}>
          이벤트 추가
        </Button>
      </div>
      <Timeline events={events} />
      {modalComponent}
    </div>
  );
};

export default TimelineSection;
