import Image from 'next/image';

interface CalendarHeaderProps {
  displayDate: Date;
  isClickableNextDays: boolean;
  onPrevMonthClick: () => void;
  onNextMonthClick: () => void;
  onResetToToday: () => void;
}

const CalendarHeader = ({
  displayDate,
  isClickableNextDays,
  onPrevMonthClick,
  onNextMonthClick,
  onResetToToday,
}: CalendarHeaderProps) => {
  const canGoNext =
    isClickableNextDays ||
    !(displayDate.getMonth() === new Date().getMonth() && displayDate.getFullYear() === new Date().getFullYear());

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex-1">
        <button
          onClick={onPrevMonthClick}
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
        onClick={onResetToToday}
        className="flex-1 cursor-pointer rounded-lg p-1 active:bg-grayscale-50 md:hover:bg-grayscale-50"
      >
        <h2 className="max-[768px]:text-md text-center text-lg font-bold text-grayscale-800">
          {`${displayDate.getFullYear()}년 ${displayDate.getMonth() + 1}월`}
        </h2>
      </div>
      <div className="flex flex-1 justify-end">
        {canGoNext && (
          <button
            onClick={onNextMonthClick}
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
  );
};

export default CalendarHeader;
