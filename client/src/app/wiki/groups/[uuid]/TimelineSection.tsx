'use client';

import {useState} from 'react';
import dynamic from 'next/dynamic';
import Button from '@components/common/Button';
import {useModal} from '@components/common/Modal/useModal';
import EventModal from '@components/group/EventModal';
import {EventInput, EventFormData, OrganizationEventUpdateRequest} from '@type/Event.type';
import {OrganizationEventResponse} from '@type/Group.type';
import {useRouter} from 'next/navigation';
import {formatDate} from '@utils/date';
import {CLIENT_ENDPOINT} from '@constants/endpoint';
import {requestPostClientWithoutResponse, requestPutClientWithoutResponse} from '@http/client';
import * as Sentry from '@sentry/nextjs';

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
  const [editingEvent, setEditingEvent] = useState<OrganizationEventResponse | null>(null);

  const handleAddEvent = async (data: EventInput) => {
    const occurredAt = formatDate(data.date, '-');

    const eventData: EventFormData = {
      title: data.title,
      contents: data.contents,
      writer: data.writer,
      occurredAt,
      organizationDocumentUuid,
    };

    try {
      await requestPostClientWithoutResponse({
        baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
        endpoint: CLIENT_ENDPOINT.postOrganizationEvent,
        body: eventData,
      });

      closeAddModal();
      router.refresh();
    } catch (error) {
      Sentry.captureException(error, {
        tags: {action: 'add-organization-event'},
        extra: {eventData},
      });
      alert('이벤트 추가에 실패했습니다.');
    }
  };

  const handleEditEvent = async (data: EventInput) => {
    if (!editingEvent) return;

    const occurredAt = formatDate(data.date, '-');

    const eventData: OrganizationEventUpdateRequest = {
      title: data.title,
      contents: data.contents,
      writer: data.writer,
      occurredAt,
    };

    try {
      await requestPutClientWithoutResponse({
        baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
        endpoint: CLIENT_ENDPOINT.putOrganizationEvent,
        queryParams: {uuid: editingEvent.organizationEventUuid, organizationDocumentUuid},
        body: eventData,
      });

      closeEditModal();
      router.refresh();
    } catch (error) {
      Sentry.captureException(error, {
        tags: {action: 'edit-organization-event'},
        extra: {eventData, organizationEventUuid: editingEvent.organizationEventUuid},
      });
      alert('이벤트 수정에 실패했습니다.');
    }
  };

  const handleOpenEditModal = (event: OrganizationEventResponse) => {
    setEditingEvent(event);
    openEditModal();
  };

  const {
    open: openAddModal,
    close: closeAddModal,
    component: addModalComponent,
  } = useModal(<EventModal mode="add" onCancel={() => closeAddModal()} onSubmit={handleAddEvent} />);

  const {
    open: openEditModal,
    close: closeEditModal,
    component: editModalComponent,
  } = useModal(
    editingEvent ? (
      <EventModal mode="edit" event={editingEvent} onCancel={() => closeEditModal()} onSubmit={handleEditEvent} />
    ) : (
      <></>
    ),
    {
      onClose: () => setEditingEvent(null),
    },
  );

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 id="3" className="font-bm text-2xl text-grayscale-text">
          타임라인
        </h1>
        <Button style="primary" size="xs" onClick={openAddModal}>
          이벤트 추가
        </Button>
      </div>
      <Timeline events={events} onEdit={handleOpenEditModal} />
      {addModalComponent}
      {editModalComponent}
    </div>
  );
};

export default TimelineSection;
