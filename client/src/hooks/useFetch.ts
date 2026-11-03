'use client';

import {useCallback, useEffect, useRef, useState} from 'react';

type UseFetchOptions = {
  enabled?: boolean;
};

export const useFetch = <T>(fetchFunction: () => Promise<T>, options: UseFetchOptions = {enabled: true}) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const latestRequestId = useRef(0);

  const fetchData = useCallback(async () => {
    const requestId = ++latestRequestId.current;

    try {
      setIsLoading(true);
      const response = await fetchFunction();
      if (requestId === latestRequestId.current) {
        setData(response);
        setErrorMessage(null);
      }
      return response;
    } catch (error) {
      if (requestId === latestRequestId.current && error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      if (requestId === latestRequestId.current) {
        setIsLoading(false);
      }
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (options?.enabled) {
      fetchData();
    }
  }, [fetchData, fetchFunction, options?.enabled]);

  return {data, isLoading, errorMessage, refetch: fetchData, setData};
};
