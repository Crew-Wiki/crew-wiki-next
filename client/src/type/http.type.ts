export type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type HeadersType = [string, string][] | Record<string, string> | Headers;
export type ObjectQueryParams = Record<string, string | number | boolean>;

export type BaseCreateRequestInitProps = {
  body?: BodyInit | object | null;
  method: Method;
  headers?: HeadersType;
};

export type BaseHttpArgs = BaseCreateRequestInitProps & {
  baseUrl: string;
  endpoint: string;
  queryParams?: ObjectQueryParams;
};

type ServerCache = {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export type ClientHttpArgs = BaseHttpArgs;
export type ServerHttpArgs = BaseHttpArgs & ServerCache;

export type ClientHttpMethodArgs = Omit<ClientHttpArgs, 'method'>;
export type ServerHttpMethodArgs = Omit<ServerHttpArgs, 'method'>;

export type ClientCreateRequestInitProps = BaseCreateRequestInitProps;
export type ServerCreateRequestInitProps = BaseCreateRequestInitProps & ServerCache;

export type FetchType = {
  url: string;
  requestInit: RequestInit;
};

export type ResponseType<T> = {
  data: T;
  code: string;
};

export type ErrorType = {
  code: string;
  message: string;
};

export type ApiResponseType<T> = {
  data: T;
  code: 'SUCCESS' | 'ERROR';
  message?: string;
};
