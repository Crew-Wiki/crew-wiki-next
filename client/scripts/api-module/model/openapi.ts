export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface SchemaObject {
  $ref?: string;
  type?: string;
  format?: string;
  enum?: (string | number)[];
  items?: SchemaObject;
  properties?: Record<string, SchemaObject>;
  required?: string[];
  additionalProperties?: boolean | SchemaObject;
  nullable?: boolean;
  description?: string;
  allOf?: SchemaObject[];
  oneOf?: SchemaObject[];
  anyOf?: SchemaObject[];
}

export interface ParameterObject {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  required?: boolean;
  description?: string;
  schema: SchemaObject;
}

export interface MediaTypeObject {
  schema: SchemaObject;
}

export interface RequestBodyObject {
  required?: boolean;
  content: Record<string, MediaTypeObject>;
}

export interface ResponseObject {
  description?: string;
  content?: Record<string, MediaTypeObject>;
}

export interface OperationObject {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: ParameterObject[];
  requestBody?: RequestBodyObject;
  responses?: Record<string, ResponseObject>;
}

export type PathItemObject = Partial<Record<HttpMethod, OperationObject>>;

export interface OpenApiDocument {
  openapi: string;
  info: {title: string; description?: string; version: string};
  servers?: {url: string}[];
  paths: Record<string, PathItemObject>;
  components?: {schemas?: Record<string, SchemaObject>};
}
