import {twMerge} from 'tailwind-merge';

interface InputProps<T extends string | number | readonly string[] | undefined>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  input: T;
  handleChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  invalid?: boolean;
}

const Input = <T extends string | number | readonly string[] | undefined>({
  type,
  input,
  handleChangeInput,
  className,
  invalid,
  ...props
}: InputProps<T>) => {
  return (
    <input
      className={twMerge(
        'w-full outline-none font-pretendard text-base font-normal text-grayscale-800 placeholder:text-grayscale-lightText focus:border-secondary-400 active:border-secondary-400 disabled:text-grayscale-400 disabled:border-grayscale-200',
        className,
        invalid ? 'border-error-error focus:border-error-error active:border-error-error' : '',
      )}
      {...props}
      type={type}
      onChange={handleChangeInput}
      value={input}
    />
  );
};

export default Input;
