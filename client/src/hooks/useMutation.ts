'use client';

import {useState} from 'react';

type MutationFn<TVariables, TData> = (variables: TVariables) => Promise<TData>;
type OnMutate<TVariables> = (variables: TVariables) => void;
type OnSuccess<TData, TVariables> = (data: TData, variables: TVariables) => void;
type OnError<TVariables> = (error: unknown, variables: TVariables) => void;
type OnSettled<TData, TVariables> = (data: TData, variables: TVariables) => void;

interface UseMutationArgs<TVariables, TData> {
  mutationFn: MutationFn<TVariables, TData>;
  onMutate?: OnMutate<TVariables>;
  onSuccess?: OnSuccess<TData, TVariables>;
  onError?: OnError<TVariables>;
  onSettled?: OnSettled<TData | null, TVariables>;
}

const useMutation = <TVariables = void, TData = unknown>({
  mutationFn,
  onMutate,
  onSuccess,
  onError,
  onSettled,
}: UseMutationArgs<TVariables, TData>) => {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const mutate = async (variables: TVariables) => {
    if (onMutate) onMutate(variables);
    setIsPending(true);
    setErrorMessage(null);

    try {
      const data = await mutationFn(variables);
      setData(data);
      if (onSuccess) onSuccess(data, variables);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
        if (onError) onError(err, variables);
      }
    } finally {
      setIsPending(false);
      if (onSettled) onSettled(data, variables);
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
