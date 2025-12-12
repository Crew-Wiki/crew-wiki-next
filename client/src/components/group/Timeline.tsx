'use client';

import React from 'react';
import {Chrono} from 'react-chrono';
import {OrganizationEvent} from '@type/Event.type';

interface TimelineProps {
  events: OrganizationEvent[];
}

const Timeline = ({events}: TimelineProps) => {
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
        <p className="font-pretendard text-sm text-grayscale-lightText">등록된 이벤트가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="timeline-container overflow-hidden">
      <Chrono
        items={timelineItems}
        mode="HORIZONTAL"
        cardHeight={120}
        scrollable={{scrollbar: true}}
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
          card: 'shadow-md rounded-lg',
          cardTitle: 'font-pretendard font-semibold',
          cardSubTitle: 'font-pretendard text-grayscale-500',
          cardText: 'font-pretendard',
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
      />
      <style jsx global>{`
        .timeline-container {
          min-height: 400px;
          min-width: 0;
          max-width: 100%;
          overflow: hidden !important;
          contain: inline-size;
        }

        .timeline-container > div,
        .timeline-container > div > div,
        .timeline-container [class*='Wrapper'],
        .timeline-container [class*='Timeline'],
        .timeline-container [class*='Main'],
        .timeline-container [class*='Horizontal'],
        .timeline-container [class*='ContentRender'] {
          min-width: 0 !important;
          max-width: 100% !important;
        }

        .timeline-container > div {
          overflow-x: auto !important;
          overflow-y: hidden !important;
        }

        /* 타임라인 아이템/카드 shrink 방지 */
        .timeline-container [class*='TimelineItemWrapper'] {
          flex-shrink: 0 !important;
          max-width: none !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }

        .timeline-container [class*='TimelineContentContainer'] {
          flex-shrink: 0 !important;
          max-width: none !important;
          outline: none !important;
        }

        .timeline-container .timeline-horz-card-wrapper {
          justify-content: center !important;
        }

        /* 타임라인 선/포인트 영역의 max-width 제한 해제 */
        .timeline-container [class*='Outline'],
        .timeline-container [class*='TimelineMain'],
        .timeline-container [class*='TimelineHorizontalWrapper'] {
          max-width: none !important;
        }

        /* 카드 간의 가로 간격 */
        .timeline-container [class*='TimelineMain'] > div {
          gap: 20px !important;
        }

        /* 카드 영역 화면에 맞춰서 스크롤 */
        .timeline-container [class*='TimelineContentRender'] {
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          overflow-y: visible !important;
          display: flex !important;
          flex-wrap: nowrap !important;
        }

        /* 카드 영역 상위 컨테이너 overflow 제어 */
        .timeline-container [class*='TimelineCardContent'],
        .timeline-container [class*='CardContainer'] {
          min-width: 0 !important;
          max-width: 100% !important;
          overflow: hidden !important;
        }

        /* 모든 카드 표시 */
        .timeline-container .timeline-card-content,
        .timeline-container [class*='TimelineItemContentWrapper'] {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e5e5;
          border-radius: 0.5rem;
          padding: 1rem;
          background: white;
          min-width: 180px !important;
          max-width: 200px !important;
          width: 200px !important;
        }

        .timeline-container .timeline-card-content.active,
        .timeline-container [class*='TimelineItemContentWrapper'].active {
          border: 1.5px solid #25b4b9 !important;
          border-radius: 0.5rem !important;
          outline: none !important;
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

        /* 이미지 없는 카드 title 스타일 */
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
          margin: 0 0 0.5rem 0;
          padding: 0;
        }

        .timeline-container p,
        .timeline-container [class*='CardDetails'],
        .timeline-container [class*='CardText'],
        .timeline-container [class*='DetailText'],
        .timeline-container [class*='DetailsText'] {
          font-family: 'Pretendard', sans-serif;
          color: #555555;
          line-height: 1.5;
          font-size: 0.875rem;
          white-space: normal !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
        }

        .timeline-container img {
          width: 100% !important;
          object-fit: cover !important;
          margin: 0 !important;
        }

        /* 카드 내부 요소 스타일 통일 (이미지 유무 관계없이) */
        .timeline-container [class*='MediaWrapper'] {
          background: transparent !important;
          border: none !important;
          margin: 0 0 8px 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: auto !important;
        }

        .timeline-container [class*='ImageWrapper'] {
          background: transparent !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100px !important;
          overflow: hidden !important;
        }

        .timeline-container [class*='MediaDetailsWrapper'],
        .timeline-container [class*='CardMediaHeader'],
        .timeline-container [class*='CardHeader'],
        .timeline-container [class*='CardTitle'] {
          background: transparent !important;
          border: none !important;
          margin: 0 0 8px 0 !important;
          padding: 0 !important;
        }

        // HTML 구조를 react-chrono 라이브러리 내부에서 렌더링하기 때문에 변경 불가
        // 라이브러리가 이미지 유무에 따라 다른 컴포넌트를 사용해서 개별 CSS 적용 필요
        /* active일 때 title 색상 변경 (이미지 유무 관계없이) */
        .timeline-container [class*='TimelineItemContentWrapper'].active h3,
        .timeline-container [class*='TimelineItemContentWrapper'].active [class*='CardTitle'] {
          color: #25b4b9;
        }

        /* 이미지 있는 카드의 writer(subtitle) 스타일 통일 */
        .timeline-container [class*='CardSubTitle'],
        .timeline-container [class*='CardMediaHeader'] [class*='SubTitle'],
        .timeline-container [class*='MediaDetailsWrapper'] span {
          margin: 0 !important;
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default Timeline;
