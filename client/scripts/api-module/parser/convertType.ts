import type {SchemaObject} from '../model/openapi.ts';
import {propertyKey} from '../utils/naming.ts';
import {refName} from './resolveSchema.ts';

export interface ConvertOptions {
  /** 모든 프로퍼티를 필수로 취급할지 */
  treatPropertiesAsRequired: boolean;

  /** 인라인 오브젝트를 몇 칸 들여쓸지 (내부 재귀용) */
  indent?: number;
}

const primitiveOf = (schema: SchemaObject): string => {
  switch (schema.type) {
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'string':
      // date-time / uuid / binary 모두 JSON 위에서는 문자열로 내려온다
      return 'string';
    default:
      return 'unknown';
  }
};

/** OpenAPI 스키마를 TypeScript 타입 표현식 문자열로 변환한다 */
export const convertType = (schema: SchemaObject | undefined, options: ConvertOptions): string => {
  if (!schema) return 'void';

  const ref = refName(schema);
  if (ref) return ref;

  if (schema.enum?.length) {
    return schema.enum.map(value => (typeof value === 'string' ? `'${value}'` : String(value))).join(' | ');
  }

  const composed = schema.allOf ?? schema.oneOf ?? schema.anyOf;
  if (composed?.length) {
    const separator = schema.allOf ? ' & ' : ' | ';
    return composed.map(item => convertType(item, options)).join(separator);
  }

  if (schema.type === 'array') {
    const itemType = convertType(schema.items, options);
    return /[|&\s]/.test(itemType) ? `(${itemType})[]` : `${itemType}[]`;
  }

  if (schema.properties) return convertObject(schema, options);

  if (schema.type === 'object') {
    if (typeof schema.additionalProperties === 'object') {
      return `Record<string, ${convertType(schema.additionalProperties, options)}>`;
    }
    return 'Record<string, unknown>';
  }

  return primitiveOf(schema);
};

export const convertObject = (schema: SchemaObject, options: ConvertOptions): string => {
  const indent = options.indent ?? 0;
  const pad = ' '.repeat(indent + 2);
  const properties = schema.properties ?? {};

  const lines = Object.entries(properties).map(([key, value]) => {
    const isRequired = options.treatPropertiesAsRequired || (schema.required?.includes(key) ?? false);

    const type = convertType(value, {...options, indent: indent + 2});
    const comment = value.description ? `${pad}/** ${value.description} */\n` : '';

    return `${comment}${pad}${propertyKey(key)}${isRequired ? '' : '?'}: ${type};`;
  });

  if (lines.length === 0) return 'Record<string, unknown>';

  return `{\n${lines.join('\n')}\n${' '.repeat(indent)}}`;
};

/** 최상위 스키마를 `export interface Name {...}` 로 방출한다 */
export const declareInterface = (name: string, schema: SchemaObject, options: ConvertOptions): string => {
  const doc = schema.description ? `/** ${schema.description} */\n` : '';

  if (schema.properties) {
    return `${doc}export interface ${name} ${convertObject(schema, {...options, indent: 0})}\n`;
  }

  return `${doc}export type ${name} = ${convertType(schema, {...options, indent: 0})};\n`;
};
