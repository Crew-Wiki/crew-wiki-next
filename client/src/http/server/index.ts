'use server';

import {objectToQueryString} from '@http/common';
import {FetchType, ServerHttpArgs, ServerHttpMethodArgs, ServerCreateRequestInitProps} from '@type/http.type';

export const requestGet = async <T>({headers = {}, ...args}: ServerHttpMethodArgs): Promise<T> => {
  return await request<T>({
    ...args,
    method: 'GET',
    headers,
    cache: args.cache ?? 'force-cache',
  });
};

export const requestPost = async <T>({headers = {}, ...args}: ServerHttpMethodArgs): Promise<T> => {
  return await request<T>({
    ...args,
    method: 'POST',
    headers,
  });
};

export const requestPut = async <T>({headers = {}, ...args}: ServerHttpMethodArgs): Promise<T> => {
  return await request<T>({
    ...args,
    method: 'PUT',
    headers,
  });
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
