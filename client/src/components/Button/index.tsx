import {twMerge} from 'tailwind-merge';

type ButtonStyle = 'primary' | 'secondary' | 'tertiary' | 'text';

interface ButtonProps {
  size: 'm' | 's' | 'xs' | 'xxs';
  style: ButtonStyle;
  type?: 'button' | 'reset' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}

const Button = ({size, type, style, children, disabled, onClick}: React.PropsWithChildren<ButtonProps>) => {
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
      'bg-white text-primary-primary border-primary-primary border-solid border disabled:bg-grayscale-50 disabled:text-grayscale-400 disabled:border-grayscale-100 disabled:border-solid disabled:border active:bg-grayscale-100',
    tertiary:
      'bg-white text-grayscale-lightText border-grayscale-border border-solid border disabled:bg-grayscale-50 disabled:text-grayscale-400 disabled:border-grayscale-100 disabled:border-grayscale-border disabled:border-solid disabled:border active:bg-grayscale-100',
    text: 'bg-white text-primary-primary shadow-md disabled:bg-grayscale-100 disabled:text-grayscale-400 disabled:shadow-md active:bg-grayscale-100',
  };

  return (
    <button
      type={type}
      className={twMerge('font-bm text-sm', BUTTON_SIZE[size], BUTTON_STYLE[style])}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
