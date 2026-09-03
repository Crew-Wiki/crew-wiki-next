const splitWords = (value: string): string[] => value.split(/[^a-zA-Z0-9]+/).filter(Boolean);

export const pascalCase = (value: string): string =>
  splitWords(value)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

export const camelCase = (value: string): string => {
  const pascal = pascalCase(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

export const isPathParamSegment = (segment: string) => segment.startsWith('{') && segment.endsWith('}');

export const paramNameOf = (segment: string) => segment.slice(1, -1);

export const pathSegments = (path: string): string[] => path.split('/').filter(Boolean);

/** 파일 분리 기준이 되는 최상위 경로 세그먼트 (`/document/search` -> `document`) */
export const groupOf = (path: string): string => {
  const [first] = pathSegments(path);
  return first && !isPathParamSegment(first) ? camelCase(first) : 'root';
};

/** 식별자로 쓸 수 없는 프로퍼티 이름은 따옴표로 감싼다 */
export const propertyKey = (key: string): string => (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : `'${key}'`);
