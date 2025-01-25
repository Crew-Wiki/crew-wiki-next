import {ErrorInfo, ErrorMessage} from '@type/Document.type';
import {useState} from 'react';

type UseInputArgs = {
  initialValue?: string;
  validateOnChange?: (value: string) => ErrorInfo;
  validateOnBlur?: (value: string) => ErrorInfo | Promise<ErrorInfo>;
};

export function useInput({initialValue, validateOnChange, validateOnBlur}: UseInputArgs) {
  const [value, setValue] = useState(initialValue ?? '');
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(null);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;

    if (typeof validateOnChange === 'undefined') {
      setValue(value);
      return;
    }

    const {errorMessage, reset} = validateOnChange(value);
    setErrorMessage(errorMessage);

    if (errorMessage !== null) {
      setValue(reset!(value));
    } else {
      setValue(value);
    }
  };

  const onBlur = async (event: React.FocusEvent<HTMLInputElement, Element>) => {
    const {value} = event.target;
    if (typeof validateOnBlur === 'undefined') return;

    const {errorMessage} = await validateOnBlur(value);
    setErrorMessage(errorMessage);
  };

  const directlyChangeValue = (value: string) => {
    setValue(value);
  };

  return {value, onChange, onBlur, errorMessage, directlyChangeValue};
}
