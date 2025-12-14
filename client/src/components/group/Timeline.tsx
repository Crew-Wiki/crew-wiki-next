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
          overflow-x: hidden !important;
          overflow-y: visible !important;
          contain: inline-size;
          padding-bottom: 30px;

          & > div {
            overflow-x: auto !important;
            overflow-y: visible !important;
            min-width: 0 !important;
            max-width: 100% !important;
          }

          & > div > div,
          & [class*='Wrapper'],
          & [class*='Timeline'],
          & [class*='Main'],
          & [class*='Horizontal'],
          & [class*='ContentRender'] {
            min-width: 0 !important;
            max-width: 100% !important;
          }

          /* 타임라인 아이템/카드 shrink 방지 */
          & [class*='TimelineItemWrapper'] {
            flex-shrink: 0 !important;
            max-width: none !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            overflow: visible !important;
            padding-bottom: 30px !important;
          }

          & [class*='TimelineContentContainer'] {
            flex-shrink: 0 !important;
            max-width: none !important;
            outline: none !important;
            overflow: visible !important;
          }

          /* 타임라인 선/포인트 영역의 max-width 제한 해제 */
          & [class*='Outline'],
          & [class*='TimelineMain'],
          & [class*='TimelineHorizontalWrapper'] {
            max-width: none !important;
          }

          /* 카드 간의 가로 간격 */
          & [class*='TimelineMain'] > div {
            gap: 20px !important;
          }

          /* 카드 영역 화면에 맞춰서 스크롤 */
          & [class*='TimelineContentRender'] {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: auto !important;
            overflow-y: visible !important;
            display: flex !important;
            flex-wrap: nowrap !important;
          }

          /* 카드 영역 상위 컨테이너 overflow 제어 */
          & [class*='TimelineCardContent'],
          & [class*='CardContainer'] {
            min-width: 0 !important;
            max-width: 100% !important;
            overflow: hidden !important;
          }

          /* 모든 카드 표시 */
          & [class*='TimelineItemContentWrapper'] {
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
            position: relative !important;
            overflow: visible !important;

            &.active {
              border: 1.5px solid #25b4b9 !important;
              border-radius: 0.5rem !important;
              outline: none !important;

              & h3,
              & [class*='CardTitle'] {
                color: #25b4b9;
              }
            }
          }

          /* 날짜 스타일 */
          & .timeline-item-title {
            color: #888888;
            font-family: 'Pretendard', sans-serif;
            font-size: 0.75rem;
            margin-bottom: 0.5rem;
          }

          /* 이미지 없는 카드 title 스타일 */
          & h3 {
            font-family: 'Pretendard', sans-serif;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 0.5rem;
          }

          & h4 {
            font-family: 'Pretendard', sans-serif;
            font-size: 0.75rem;
            color: #888888;
            margin: 0 0 0.5rem 0;
            padding: 0;
          }

          & p,
          & [class*='CardDetails'],
          & [class*='CardText'],
          & [class*='DetailText'],
          & [class*='DetailsText'] {
            font-family: 'Pretendard', sans-serif;
            color: #555555;
            line-height: 1.5;
            font-size: 0.875rem;
            white-space: normal !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }

          & img {
            width: 100% !important;
            object-fit: cover !important;
            margin: 0 !important;
          }

          /* 카드 내부 요소 스타일 통일 (이미지 유무 관계없이) */
          & [class*='MediaWrapper'] {
            background: transparent !important;
            border: none !important;
            margin: 0 0 8px 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
          }

          & [class*='ImageWrapper'] {
            background: transparent !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100px !important;
            overflow: hidden !important;
          }

          & [class*='MediaDetailsWrapper'],
          & [class*='CardMediaHeader'],
          & [class*='CardHeader'],
          & [class*='CardTitle'] {
            background: transparent !important;
            border: none !important;
            margin: 0 0 8px 0 !important;
            padding: 0 !important;
          }

          // HTML 구조를 react-chrono 라이브러리 내부에서 렌더링하기 때문에 변경 불가
          // 라이브러리가 이미지 유무에 따라 다른 컴포넌트를 사용해서 개별 CSS 적용 필요
          /* 이미지 있는 카드의 writer(subtitle) 스타일 통일 */
          & [class*='CardSubTitle'],
          & [class*='CardMediaHeader'] [class*='SubTitle'],
          & [class*='MediaDetailsWrapper'] span {
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Timeline;
