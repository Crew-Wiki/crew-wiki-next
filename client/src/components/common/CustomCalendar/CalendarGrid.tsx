import {JSX} from 'react';

interface CalendarGridProps {
  calendarDays: JSX.Element[];
}

const CalendarGrid = ({calendarDays}: CalendarGridProps) => {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center font-pretendard text-sm text-grayscale-500">
        {weekdays.map((day, i) => (
          <div key={day} className={`${i === 0 ? 'text-error-error' : ''} ${i === 6 ? 'text-primary-700' : ''}`}>
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 place-items-center gap-1">{calendarDays}</div>
    </>
  );
};

export default CalendarGrid;
