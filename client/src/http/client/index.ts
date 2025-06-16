'use client';

import {objectToQueryString} from '../common';
import {ClientCreateRequestInitProps, ClientHttpArgs, ClientHttpMethodArgs, FetchType} from '@type/http.type';

const requestGet = async <T>({headers = {}, ...args}: ClientHttpMethodArgs): Promise<T> => {
  return await request<T>({
    ...args,
    method: 'GET',
    headers,
  });
};

const requestPost = async <T>({headers = {}, ...args}: ClientHttpMethodArgs): Promise<T> => {
  return await request<T>({
    ...args,
    method: 'POST',
    headers,
  });
};

const requestPut = async <T>({headers = {}, ...args}: ClientHttpMethodArgs): Promise<T> => {
  return await request<T>({
    ...args,
    method: 'PUT',
    headers,
  });
};

export const httpClient = {
  get: requestGet,
  post: requestPost,
  put: requestPut,
};

const prepareRequest = ({baseUrl, method, endpoint, headers, body, queryParams}: ClientHttpArgs) => {
  let url = `${baseUrl}${endpoint}`;
  if (queryParams) url += `?${objectToQueryString(queryParams)}`;

  const requestInit = createRequestInit({method, headers, body});

  return {url, requestInit};
};

const createRequestInit = ({method, headers, body}: ClientCreateRequestInitProps) => {
  const requestInit: RequestInit = {
    credentials: 'include',
    method,
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

const request = async <T>(args: ClientHttpArgs) => {
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
