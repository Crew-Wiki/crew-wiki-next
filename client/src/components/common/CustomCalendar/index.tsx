'use client';

import {formatDateDotted} from '@utils/date';
import {JSX, useEffect, useMemo, useRef, useState} from 'react';
import CalendarPopup from './CalendarPopUp';
import CalendarInput from './CalendarInput';
import {twMerge} from 'tailwind-merge';

interface CustomCalendarProps {
  value: Date | null;
  className?: string;
  placeholder?: string;
  invalid?: boolean;
  isClickableNextDays: boolean;
  onChange: (date: Date | null) => void;
}

const CustomCalendar = ({
  value,
  className,
  placeholder,
  invalid = false,
  isClickableNextDays,
  onChange,
}: CustomCalendarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayDate, setDisplayDate] = useState(value || new Date());
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changeMonth = (offset: number) => {
    setDisplayDate(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
      return newDate;
    });
  };

  const toggleCalendar = () => setIsOpen(prev => !prev);
  const handleResetToToday = () => setDisplayDate(new Date());
  const handleNextMonthClick = () => changeMonth(1);
  const handlePrevMonthClick = () => changeMonth(-1);

  const calendarDays = useMemo(() => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
    const days: JSX.Element[] = [];

    const handlePrevMonthDateClick = () => {
      changeMonth(-1);
    };

    const handleNextMonthDateClick = () => {
      changeMonth(1);
    };

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = lastDayOfPrevMonth - i;
      days.push(
        <div
          key={`prev-${day}`}
          className="flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded-full text-sm text-grayscale-300"
          onClick={handlePrevMonthDateClick}
        >
          {day}
        </div>,
      );
    }

    for (let day = 1; day <= lastDateOfMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = formatDateDotted(date) === formatDateDotted(new Date());
      const isSelected = value && value.getFullYear() === year && value.getMonth() === month && value.getDate() === day;

      const baseClasses = 'flex items-center justify-center h-10 w-10 text-sm rounded-full cursor-pointer select-none';
      const todayClasses = 'font-bold bg-grayscale-50';
      const selectedClasses = 'bg-primary-primary text-white font-bold';
      const defaultClickableClasses = 'text-grayscale-700 active:bg-primary-container md:hover:bg-primary-container';
      const disabledClasses = 'text-grayscale-300 cursor-default active:bg-transparent md:hover:bg-transparent';

      let dayClasses = '';
      if (isSelected) {
        dayClasses = selectedClasses;
      } else if (isToday) {
        dayClasses = todayClasses;
      } else {
        dayClasses = defaultClickableClasses;
      }

      const isFutureDate = date > new Date();
      const isClickable = isClickableNextDays || !isFutureDate;
      const classes = twMerge(baseClasses, isClickable ? dayClasses : disabledClasses);

      const handleDateChange = (selectedDay: number) => {
        if (!isClickable) return;
        const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), selectedDay);

        if (value && formatDateDotted(newDate) === formatDateDotted(value)) {
          onChange(null);
        } else {
          onChange(newDate);
        }
        setIsOpen(false);
      };

      days.push(
        <div key={day} onClick={() => handleDateChange(day)} className={classes}>
          {day}
        </div>,
      );
    }

    if (
      !isClickableNextDays &&
      displayDate.getMonth() === new Date().getMonth() &&
      displayDate.getFullYear() === new Date().getFullYear()
    ) {
      return days;
    }

    const totalDaysRendered = firstDayOfMonth + lastDateOfMonth;
    const totalSlots = Math.ceil(totalDaysRendered / 7) * 7;
    const remainingDays = totalSlots - totalDaysRendered;

    for (let i = 1; i <= remainingDays; i++) {
      const day = i;
      days.push(
        <div
          key={`next-${day}`}
          className="flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded-full text-sm text-grayscale-300"
          onClick={handleNextMonthDateClick}
        >
          {day}
        </div>,
      );
    }

    return days;
  }, [displayDate, value, isClickableNextDays, onChange]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <CalendarInput
        value={value ? formatDateDotted(value) : ''}
        placeholder={placeholder}
        className={className}
        invalid={invalid}
        onClick={toggleCalendar}
      />

      {isOpen && (
        <CalendarPopup
          displayDate={displayDate}
          calendarDays={calendarDays}
          isClickableNextDays={isClickableNextDays}
          onPrevMonthClick={handlePrevMonthClick}
          onNextMonthClick={handleNextMonthClick}
          onResetToToday={handleResetToToday}
        />
      )}
    </div>
  );
};

export default CustomCalendar;
