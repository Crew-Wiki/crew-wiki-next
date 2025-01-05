import {useCallback, useState} from 'react';

/**
 * useInput
 * @param {T} init 초기값
 * @returns useState와 유사하게 만들어놓음
 *
 * setValue를 onChange에 넣어도 되고 직접 값을 변경해도 된다.
 */
function useInput<T>(init: T) {
  const [value, setValue] = useState<T>(init);

  const onChange = useCallback((state: React.ChangeEvent<HTMLInputElement> | T) => {
    if (state instanceof Object && 'currentTarget' in state) {
      setValue(state.currentTarget.value as T);
    } else {
      setValue(state as T);
    }
  }, []);

  return [value, onChange] as const;
}

export default useInput;
