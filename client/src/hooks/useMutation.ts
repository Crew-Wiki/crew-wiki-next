'use client';

import {useState} from 'react';

type MutationFn<TVariables, TData> = (variables: TVariables) => Promise<TData>;
type OnSuccess<TData> = (data: TData) => void;
type OnError = (error: unknown) => void;

interface UseMutationArgs<TVariables, TData> {
  mutationFn: MutationFn<TVariables, TData>;
  onSuccess?: OnSuccess<TData>;
  onError?: OnError;
}

const useMutation = <TVariables = void, TData = unknown>({
  mutationFn,
  onSuccess,
  onError,
}: UseMutationArgs<TVariables, TData>) => {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const mutate = async (variables: TVariables) => {
    setIsPending(true);
    setErrorMessage(null);

    try {
      const data = await mutationFn(variables);
      setData(data);
      if (onSuccess) onSuccess(data);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
        if (onError) onError(err);
      }
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutate,
    data,
    isPending,
    errorMessage,
  };
};

export default useMutation;
