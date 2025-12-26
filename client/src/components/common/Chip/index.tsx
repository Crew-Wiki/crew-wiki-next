import {ComponentProps} from 'react';

type ChipVariant = 'removable' | 'link';

type ChipProps = ComponentProps<'button'> & {
  text: string;
  variant?: ChipVariant;
};

export const Chip = ({text, variant = 'removable', ...buttonProps}: ChipProps) => {
  return (
    <button
      type="button"
      className="flex w-fit flex-row items-center gap-2 rounded-full border border-solid border-primary-300 bg-white px-3 py-1 active:bg-grayscale-100"
      {...buttonProps}
    >
      <span className="font-pretendard text-sm font-normal text-primary-300">{text}</span>
      {variant === 'removable' && (
        <div className="w-4 border-none bg-transparent">
          <svg
            className="h-full w-full"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 5L19 19M19 5L5 19" stroke="#25B4B9" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </button>
  );
};
