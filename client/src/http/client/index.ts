'use client';

import {objectToQueryString} from '../common';
import {
  ClientCreateRequestInitProps,
  ClientHttpArgs,
  ClientHttpMethodArgs,
  FetchType,
  ResponseType,
} from '@type/http.type';

export const requestGetClient = async <T>({headers = {}, ...args}: ClientHttpMethodArgs): Promise<T> => {
  const response = await request<ResponseType<T>>({
    ...args,
    method: 'GET',
    headers,
  });

  return response.data;
};

export const requestPostClient = async <T>({headers = {}, ...args}: ClientHttpMethodArgs): Promise<T> => {
  const response = await request<ResponseType<T>>({
    ...args,
    method: 'POST',
    headers,
  });

  return response.data;
};

export const requestPutClient = async <T>({headers = {}, ...args}: ClientHttpMethodArgs): Promise<T> => {
  const response = await request<ResponseType<T>>({
    ...args,
    method: 'PUT',
    headers,
  });

  return response.data;
};

export const requestPutClientWithoutResponse = async ({headers = {}, ...args}: ClientHttpMethodArgs): Promise<void> => {
  await requestWithoutResponse({
    ...args,
    method: 'PUT',
    headers,
  });
};

export const requestDeleteClient = async ({headers = {}, ...args}: ClientHttpMethodArgs): Promise<void> => {
  await requestWithoutResponse({
    ...args,
    method: 'DELETE',
    headers,
  });
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

const requestWithoutResponse = async (args: ClientHttpArgs) => {
  const {url, requestInit} = prepareRequest(args);
  await executeRequest({url, requestInit});
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
