import {FC} from 'react';
import {twMerge} from 'tailwind-merge';

type SpinnerSize = 'xs' | 's';

interface Props {
  size: SpinnerSize;
}

const SPINNER_SIZE: Record<SpinnerSize, string> = {
  xs: 'h-6 w-6',
  s: 'h-10 w-10',
};

export const LoadingSpinner: FC<Props> = ({size = 's'}) => {
  return (
    <div
      className={twMerge(
        SPINNER_SIZE[size],
        'animate-spin rounded-full border-4 border-gray-300 border-t-primary-primary',
      )}
    />
  );
};
