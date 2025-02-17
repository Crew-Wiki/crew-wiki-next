'use server';

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

type HeadersType = [string, string][] | Record<string, string> | Headers;
type ObjectQueryParams = Record<string, string | number | boolean>;

type httpArgs = CreateRequestInitProps & {
  baseUrl?: string;
  endpoint: string;
  queryParams?: ObjectQueryParams;
};

type HttpMethodArgs = Omit<httpArgs, 'method'>;

type FetchType = {
  url: string;
  requestInit: RequestInit;
};

type CreateRequestInitProps = {
  body?: BodyInit | object | null;
  method: Method;
  headers?: HeadersType;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const requestGet = async <T>({headers = {}, ...args}: HttpMethodArgs): Promise<T> => {
  return await request<T>({
    ...args,
    method: 'GET',
    headers,
    cache: args.cache ?? 'force-cache',
  });
};

export const requestPost = async <T>({headers = {}, ...args}: HttpMethodArgs): Promise<T> => {
  return await request<T>({
    ...args,
    method: 'POST',
    headers,
  });
};

export const requestPut = async <T>({headers = {}, ...args}: HttpMethodArgs): Promise<T> => {
  return await request<T>({
    ...args,
    method: 'PUT',
    headers,
  });
};

const objectToQueryString = (params: ObjectQueryParams): string => {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};

const prepareRequest = ({
  baseUrl = API_BASE_URL,
  method,
  endpoint,
  headers,
  body,
  queryParams,
  next,
  cache,
}: httpArgs) => {
  let url = `${baseUrl}${endpoint}`;
  if (queryParams) url += `?${objectToQueryString(queryParams)}`;

  const requestInit = createRequestInit({method, headers, body, next, cache});

  return {url, requestInit};
};

const createRequestInit = ({method, headers, body, cache, next}: CreateRequestInitProps) => {
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

const request = async <T>(args: httpArgs) => {
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
