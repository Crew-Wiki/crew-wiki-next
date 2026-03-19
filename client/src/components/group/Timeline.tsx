'use client';

import React from 'react';
import {Chrono} from 'react-chrono';
import {OrganizationEventResponse} from '@type/Group.type';
import {colors} from '@constants/colors';
import './Timeline.css';

interface TimelineProps {
  events: OrganizationEventResponse[];
  onEdit?: (event: OrganizationEventResponse) => void;
}

// TODO: 이미지 없을 때 기본 fallback 이미지 표시하기
const Timeline = ({events, onEdit}: TimelineProps) => {
  const handleEditClick = (e: React.MouseEvent, event: OrganizationEventResponse) => {
    e.stopPropagation();
    onEdit?.(event);
  };

  const sortedEvents = [...events].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));

  const timelineItems = sortedEvents.map(event => ({
    id: event.organizationEventUuid,
    title: event.occurredAt,
  }));

  if (events.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-grayscale-50">
        <p className="font-pretendard text-sm text-grayscale-lightText">등록된 이벤트가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="timeline-container overflow-hidden">
      <Chrono
        items={timelineItems}
        mode="HORIZONTAL"
        cardHeight={200}
        scrollable={{scrollbar: true}}
        theme={{
          primary: colors.primary.primary,
          secondary: colors.grayscale[50],
          cardBgColor: colors.white,
          titleColor: colors.grayscale.text,
          titleColorActive: colors.primary.primary,
        }}
        fontSizes={{
          title: '0.875rem',
        }}
        hideControls
        disableClickOnCircle
        useReadMore={false}
        lineWidth={3}
        cardWidth={200}
        itemWidth={220}
        textDensity="HIGH"
        disableToolbar={true}
        showAllCardsHorizontal={true}
        mediaHeight={80}
      >
        {sortedEvents.map(event => (
          <div key={event.organizationEventUuid} className="flex h-full flex-col font-pretendard">
            <h3 className="m-0 mb-2 text-base font-semibold text-grayscale-text">{event.title}</h3>
            <p className="m-0 mb-2 text-sm font-bold text-grayscale-500">{event.writer}</p>
            <p className="m-0 break-words text-sm leading-normal text-grayscale-600">{event.contents}</p>
            {onEdit && (
              <button type="button" className="timeline-card-edit-button" onClick={e => handleEditClick(e, event)}>
                수정
              </button>
            )}
          </div>
        ))}
      </Chrono>
    </div>
  );
};

export default Timeline;
