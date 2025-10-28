import {JSX} from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';

interface CalendarPopupProps {
  displayDate: Date;
  calendarDays: JSX.Element[];
  isClickableNextDays: boolean;
  onPrevMonthClick: () => void;
  onNextMonthClick: () => void;
  onResetToToday: () => void;
}

const CalendarPopup = ({
  displayDate,
  calendarDays,
  isClickableNextDays,
  onPrevMonthClick,
  onNextMonthClick,
  onResetToToday,
}: CalendarPopupProps) => {
  return (
    <div className="absolute top-full z-10 mt-2 w-full rounded-xl bg-white p-4 shadow-lg max-[768px]:p-6">
      <CalendarHeader
        displayDate={displayDate}
        isClickableNextDays={isClickableNextDays}
        onPrevMonthClick={onPrevMonthClick}
        onNextMonthClick={onNextMonthClick}
        onResetToToday={onResetToToday}
      />
      <CalendarGrid calendarDays={calendarDays} />
    </div>
  );
};

export default CalendarPopup;
