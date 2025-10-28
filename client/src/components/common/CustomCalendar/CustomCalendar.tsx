'use client';

import {formatDate} from '@utils/date';
import Image from 'next/image';
import {JSX, useEffect, useMemo, useRef, useState} from 'react';
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

  const toggleCalendar = () => {
    setIsOpen(prev => !prev);
  };

  const handleResetToToday = () => {
    const today = new Date();
    setDisplayDate(today);
  };

  const handleNextMonthClick = () => {
    changeMonth(1);
  };

  const handlePrevMonthClick = () => {
    changeMonth(-1);
  };

  const calendarDays = useMemo(() => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const days: JSX.Element[] = [];

    const isPrevMonthDate =
      value && (value.getFullYear() < year || (value.getFullYear() === year && value.getMonth() < month));
    const isNextMonthDate =
      value && (value.getFullYear() > year || (value.getFullYear() === year && value.getMonth() > month));

    const handleOtherMonthDateClick = () => {
      if (isPrevMonthDate) {
        changeMonth(-1);
      } else if (isNextMonthDate) {
        changeMonth(1);
      }
    };

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`prev-${i}`} className="h-10 w-10" onClick={handleOtherMonthDateClick} />);
    }

    for (let day = 1; day <= lastDateOfMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = formatDate(date) === formatDate(new Date());
      const isSelected = value && value.getFullYear() === year && value.getMonth() === month && value.getDate() === day;

      const baseClasses = 'flex items-center justify-center h-10 w-10 text-sm rounded-full cursor-pointer select-none';
      const todayClasses = isToday ? 'font-bold bg-grayscale-50' : '';
      const selectedClasses = isSelected
        ? 'bg-primary text-white font-bold'
        : 'text-grayscale-700 active:bg-primary-container md:hover:bg-primary-container';
      const isFutureDate = date > new Date();
      const isClickable = isClickableNextDays || !isFutureDate;
      const disabledClasses = !isClickable
        ? 'text-grayscale-300 cursor-default active:bg-transparent md:hover:bg-transparent'
        : '';
      const classes = `${baseClasses} ${isSelected ? selectedClasses : `${todayClasses} ${selectedClasses}`} ${disabledClasses}`;

      const handleDateChange = (day: number) => {
        if (!isClickable) return;
        const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);

        if (value && formatDate(newDate) === formatDate(value)) {
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

    return days;
  }, [displayDate, value, isClickableNextDays, onChange]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={value ? formatDate(value) : ''}
          placeholder={placeholder}
          readOnly
          onClick={toggleCalendar}
          className={twMerge(
            'w-full font-pretendard text-base font-normal text-grayscale-800 outline-none placeholder:text-grayscale-lightText focus:border-secondary-400 disabled:border-grayscale-200 disabled:text-grayscale-400',
            className,
            invalid ? 'border-error-error hover:border-error-error focus:border-error-error' : '',
          )}
        />
        <button
          onClick={toggleCalendar}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          aria-label="달력 열기"
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_CDN_DOMAIN}/images/calendar-icon.svg`}
            width={24}
            height={24}
            alt="calendar icon"
            className="h-6 w-6"
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full z-10 mt-2 w-full rounded-xl bg-white p-4 shadow-lg max-[768px]:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex-1">
              <button
                onClick={handlePrevMonthClick}
                className="rounded-full p-2 transition-colors active:bg-primary-container md:hover:bg-primary-container"
                aria-label="이전 달"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_CDN_DOMAIN}/images/chevron-left-icon.svg`}
                  width={24}
                  height={24}
                  alt="chevron left icon"
                  className="h-6 w-6"
                />
              </button>
            </div>
            <div
              onClick={handleResetToToday}
              className="flex-1 cursor-pointer rounded-lg p-1 active:bg-grayscale-50 md:hover:bg-grayscale-50"
            >
              <h2 className="max-[768px]:text-md text-center text-lg font-bold text-grayscale-800">
                {`${displayDate.getFullYear()}년 ${displayDate.getMonth() + 1}월`}
              </h2>
            </div>
            <div className="flex flex-1 justify-end">
              {!isClickableNextDays &&
              displayDate.getMonth() === new Date().getMonth() &&
              displayDate.getFullYear() === new Date().getFullYear() ? null : (
                <button
                  onClick={handleNextMonthClick}
                  className="rounded-full p-2 transition-colors active:bg-primary-container md:hover:bg-primary-container"
                  aria-label="다음 달"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_CDN_DOMAIN}/images/chevron-right-icon.svg`}
                    width={24}
                    height={24}
                    alt="chevron right icon"
                    className="h-6 w-6"
                  />
                </button>
              )}
            </div>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1 text-center font-pretendard text-sm text-grayscale-500">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
              <div key={day} className={`${i === 0 ? 'text-error-error' : ''} ${i === 6 ? 'text-primary-700' : ''}`}>
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 place-items-center gap-1">{calendarDays}</div>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;
