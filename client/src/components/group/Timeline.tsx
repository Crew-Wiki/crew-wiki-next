'use client';

import React from 'react';
import { Chrono } from 'react-chrono';
import { OrganizationEvent } from '@type/Event.type';

interface TimelineProps {
  events: OrganizationEvent[];
}

const Timeline = ({ events }: TimelineProps) => {
  const timelineItems = events.map(event => ({
    title: event.occurredAt,
    cardTitle: event.title,
    cardSubtitle: event.writer,
    cardDetailedText: event.contents,
    media: event.imageUrl
      ? {
          source: {
            url: event.imageUrl,
          },
          type: 'IMAGE',
          name: event.title,
        }
      : undefined,
  }));

  if (events.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-grayscale-50">
        <p className="font-pretendard text-sm text-grayscale-lightText">
          등록된 이벤트가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="timeline-container w-full overflow-x-auto overflow-y-hidden">
      <Chrono
        items={timelineItems}
        mode="HORIZONTAL"
        cardHeight={200}
        scrollable={{ scrollbar: true }}
        theme={{
          primary: '#25B4B9', // primary-primary
          secondary: '#F5F5F5', // grayscale-50
          cardBgColor: '#FFFFFF',
          titleColor: '#1A1A1A', // grayscale-text
          titleColorActive: '#25B4B9',
          cardTitleColor: '#1A1A1A',
          cardSubtitleColor: '#888888', // grayscale-500
          cardDetailsColor: '#555555', // grayscale-600
        }}
        fontSizes={{
          title: '0.875rem',
          cardTitle: '1rem',
          cardSubtitle: '0.75rem',
          cardText: '0.875rem',
        }}
        classNames={{
          card: 'shadow-md border border-grayscale-200 rounded-lg',
          cardTitle: 'font-pretendard font-semibold',
          cardSubTitle: 'font-pretendard text-grayscale-500',
          cardText: 'font-pretendard',
        }}
        hideControls
        disableClickOnCircle
        useReadMore={false}
        lineWidth={3}
        cardWidth={280}
        textDensity="HIGH"
        disableToolbar={true}
        enableLayoutSwitch={true}
      />

      <style jsx global>{`
        .timeline-container {
          padding: 1rem;
          min-height: 400px;
          max-width: 100%;
          overflow-y: hidden;
        }

        .timeline-container .timeline-main-wrapper {
          padding-bottom: 2rem;
          max-width: 100%;
          overflow-y: hidden;
        }

        .timeline-container .timeline-horizontal-container {
          padding: 1rem 0;
          max-width: 100%;
          overflow-y: hidden;
        }

        /* 카드 3개씩 보이도록 너비 조정 */
        .timeline-container .rct-chrono-timeline-container {
          max-width: 100% !important;
        }

        .timeline-container .rct-chrono-timeline-wrapper {
          max-width: 900px !important;
        }

        .timeline-container .timeline-card-content {
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e5e5;
          border-radius: 0.5rem;
          padding: 1rem;
          background: white;
        }

        .timeline-container .timeline-item-title {
          color: #888888;
          font-family: 'Pretendard', sans-serif;
          font-size: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .timeline-container .timeline-circle {
          background: #25b4b9;
          border: 3px solid #ffffff;
          box-shadow: 0 0 0 2px #25b4b9;
        }

        .timeline-container .timeline-circle.active {
          background: #25b4b9;
          transform: scale(1.2);
        }

        .timeline-container h3 {
          font-family: 'Pretendard', sans-serif;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .timeline-container h4 {
          font-family: 'Pretendard', sans-serif;
          font-size: 0.75rem;
          color: #888888;
          margin-bottom: 0.5rem;
        }

        .timeline-container p {
          font-family: 'Pretendard', sans-serif;
          color: #555555;
          line-height: 1.5;
          font-size: 0.875rem;
        }

        .timeline-container img {
          width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          object-fit: cover;
          max-height: 200px;
        }
      `}</style>
    </div>
  );
};

export default Timeline;
