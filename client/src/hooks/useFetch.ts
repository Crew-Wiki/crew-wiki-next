'use client';

import {useCallback, useEffect, useState} from 'react';

type UseFetchOptions = {
  enabled?: boolean;
};

export const useFetch = <T>(fetchFunction: () => Promise<T>, options?: UseFetchOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchFunction();
      setData(response);
      setErrorMessage(null);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (options?.enabled === true) {
      fetchData();
    }
  }, [fetchData, fetchFunction, options?.enabled]);

  return {data, isLoading, errorMessage, refetch: fetchData, setData};
};
