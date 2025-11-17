'use server';

import {objectToQueryString} from '@http/common';
import {
  FetchType,
  ServerHttpArgs,
  ServerHttpMethodArgs,
  ServerCreateRequestInitProps,
  ResponseType,
} from '@type/http.type';

export const requestGetServer = async <T>({headers = {}, ...args}: ServerHttpMethodArgs): Promise<T> => {
  const response = await request<ResponseType<T>>({
    ...args,
    method: 'GET',
    headers,
    cache: args.cache ?? 'force-cache',
  });

  return response.data;
};

export const requestPostServer = async <T>({headers = {}, ...args}: ServerHttpMethodArgs): Promise<T> => {
  const response = await request<ResponseType<T>>({
    ...args,
    method: 'POST',
    headers,
  });

  return response.data;
};

export const requestPutServer = async <T>({headers = {}, ...args}: ServerHttpMethodArgs): Promise<T> => {
  const response = await request<ResponseType<T>>({
    ...args,
    method: 'PUT',
    headers,
  });

  return response.data;
};

export const requestDeleteServer = async ({headers = {}, ...args}: ServerHttpMethodArgs): Promise<void> => {
  const {url, requestInit} = prepareRequest({
    ...args,
    method: 'DELETE',
    headers,
  });

  const response = await executeRequest({url, requestInit});

  if (response && response.status !== 204) {
    await response.json();
  }
};

const prepareRequest = ({baseUrl, method, endpoint, headers, body, queryParams, next, cache}: ServerHttpArgs) => {
  let url = `${baseUrl}${endpoint}`;
  if (queryParams) url += `?${objectToQueryString(queryParams)}`;

  const requestInit = createRequestInit({method, headers, body, next, cache});

  return {url, requestInit};
};

const createRequestInit = ({method, headers, body, cache, next}: ServerCreateRequestInitProps) => {
  const requestInit: RequestInit = {
    credentials: 'include',
    method,
    next,
    cache,
  };

  if (body instanceof FormData) {
    return {...requestInit, body};
  } else {
    return {
      ...requestInit,
      headers: {...headers, 'Content-Type': 'application/json'},
      body: body ? JSON.stringify(body) : null,
    };
  }
};

const request = async <T>(args: ServerHttpArgs) => {
  const {url, requestInit} = prepareRequest(args);
  const response = await executeRequest({url, requestInit});

  const data: T = await response!.json();
  return data;
};

const executeRequest = async ({url, requestInit}: FetchType) => {
  try {
    const response: Response = await fetch(url, requestInit);

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.message || JSON.stringify(errorData) || 'API 요청 실패';
      throw new Error(errorMessage);
    }
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('알 수 없는 오류 발생');
    }
  }
};
