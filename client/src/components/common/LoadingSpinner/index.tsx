import {FC} from 'react';
import {twMerge} from 'tailwind-merge';

type SpinnerSize = 'xxs' | 'xs' | 's' | 'm';

interface Props {
  size?: SpinnerSize;
  thickness?: 'thin' | 'normal' | 'thick';
  color?: string;
  className?: string;
}

const SIZE_MAP: Record<SpinnerSize, string> = {
  xxs: 'h-2 w-2',
  xs: 'h-4 w-4',
  s: 'h-6 w-6',
  m: 'h-10 w-10',
};

const THICKNESS_MAP = {
  thin: 'border',
  normal: 'border-2',
  thick: 'border-4',
};

export const LoadingSpinner: FC<Props> = ({
  size = 's',
  thickness = 'normal',
  color = 'text-primary-primary',
  className,
}) => {
  return (
    <div
      className={twMerge(
        SIZE_MAP[size],
        THICKNESS_MAP[thickness],
        'animate-spin rounded-full border-gray-300 border-t-current',
        color,
        className,
      )}
    />
  );
};
