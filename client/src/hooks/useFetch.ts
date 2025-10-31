'use client';

import {useCallback, useEffect, useState} from 'react';

type UseFetchOptions = {
  enabled?: boolean;
};

export const useFetch = <T>(fetchFunction: () => Promise<T>, options: UseFetchOptions = {enabled: true}) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchFunction();
      setData(response);
      setErrorMessage(null);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (options?.enabled) {
      fetchData();
    }
  }, [fetchData, fetchFunction, options?.enabled]);

  return {data, isLoading, errorMessage, refetch: fetchData, setData};
};
