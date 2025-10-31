import Image from 'next/image';
import {twMerge} from 'tailwind-merge';

interface CalendarInputProps {
  value: string;
  placeholder?: string;
  className?: string;
  invalid?: boolean;
  onClick: () => void;
}

const CalendarInput = ({value, placeholder, className, invalid, onClick}: CalendarInputProps) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        readOnly
        onClick={onClick}
        className={twMerge(
          'w-full font-pretendard text-base font-normal text-grayscale-800 outline-none placeholder:text-grayscale-lightText focus:border-secondary-400 disabled:border-grayscale-200 disabled:text-grayscale-400',
          className,
          invalid ? 'border-error-error hover:border-error-error focus:border-error-error' : '',
        )}
      />
      <button onClick={onClick} className="absolute inset-y-0 right-0 flex items-center pr-3" aria-label="달력 열기">
        <Image
          src={`${process.env.NEXT_PUBLIC_CDN_DOMAIN}/images/calendar-icon.svg`}
          width={24}
          height={24}
          alt="calendar icon"
          className="h-6 w-6"
        />
      </button>
    </div>
  );
};

export default CalendarInput;
