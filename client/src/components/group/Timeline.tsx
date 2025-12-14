'use client';

import React from 'react';
import {Chrono} from 'react-chrono';
import {OrganizationEvent} from '@type/Event.type';
import './Timeline.css';

interface TimelineProps {
  events: OrganizationEvent[];
}

// TODO: 이미지 없을 때 기본 fallback 이미지 표시하기

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
    </div>
  );
};

export default Timeline;
