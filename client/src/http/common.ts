import {ObjectQueryParams} from '@type/http.type';

/** undefined / null 인 값을 제거해 쿼리 파라미터 객체로 정규화한다 */
export const toQueryParams = (params: object | undefined): ObjectQueryParams => {
  if (!params) return {};

  return Object.entries(params).reduce<ObjectQueryParams>((acc, [key, value]) => {
    if (value === undefined || value === null) return acc;

    acc[key] = value as string | number | boolean;
    return acc;
  }, {});
};

export const objectToQueryString = (params: ObjectQueryParams): string => {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};
