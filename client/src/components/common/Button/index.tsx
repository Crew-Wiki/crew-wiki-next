import {twMerge} from 'tailwind-merge';
import {LoadingSpinner} from '../LoadingSpinner';

type ButtonStyle = 'primary' | 'secondary' | 'tertiary' | 'text';

interface ButtonProps {
  size: 'm' | 's' | 'xs' | 'xxs';
  style: ButtonStyle;
  type?: 'button' | 'reset' | 'submit';
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}

const Button = ({
  size,
  type = 'button',
  style,
  children,
  disabled,
  isLoading = false,
  onClick,
}: React.PropsWithChildren<ButtonProps>) => {
  const BUTTON_SIZE = {
    xxs: 'h-6 rounded-[1.125rem] px-5 whitespace-nowrap',
    xs: 'h-9 rounded-[1.125rem] px-3',
    s: 'h-11 rounded-[1.375rem] px-4',
    m: 'h-14 rounded-[1.75rem] px-4',
  };

  const BUTTON_STYLE: Record<ButtonStyle, string> = {
    primary:
      'bg-primary-primary text-white disabled:bg-grayscale-100 disabled:text-grayscale-400 active:bg-grayscale-100',
    secondary:
      'bg-white text-primary-primary border-primary-primary border disabled:bg-grayscale-50 disabled:text-grayscale-400 disabled:border-grayscale-100 active:bg-grayscale-100',
    tertiary:
      'bg-white text-grayscale-lightText border-grayscale-border border disabled:bg-grayscale-50 disabled:text-grayscale-400 disabled:border-grayscale-100 active:bg-grayscale-100',
    text: 'bg-white text-primary-primary shadow-md disabled:bg-grayscale-100 disabled:text-grayscale-400 active:bg-grayscale-100',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={!isLoading ? onClick : undefined}
      className={twMerge(
        'relative flex items-center justify-center font-bm text-sm transition-all',
        BUTTON_SIZE[size],
        BUTTON_STYLE[style],
      )}
    >
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>{children}</span>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size={size} />
        </div>
      )}
    </button>
  );
};

export default Button;
