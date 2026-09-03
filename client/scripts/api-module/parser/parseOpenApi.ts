import type {GeneratorConfig} from '../generator.config.ts';
import type {ApiModel, BodyModel, EndpointModel, ParamModel, QueryModel} from '../model/endpoint.ts';
import type {HttpMethod, OpenApiDocument, OperationObject, ParameterObject, SchemaObject} from '../model/openapi.ts';
import {groupOf} from '../utils/naming.ts';
import {convertType, type ConvertOptions} from './convertType.ts';
import {collectWrapperNames, refName, resolveRef, unwrapResponse} from './resolveSchema.ts';

const HTTP_METHODS: HttpMethod[] = ['get', 'post', 'put', 'patch', 'delete'];

const pickResponseSchema = (operation: OperationObject): SchemaObject | undefined => {
  const responses = operation.responses ?? {};
  const successKey = Object.keys(responses).find(code => code.startsWith('2'));
  if (!successKey) return undefined;

  const content = responses[successKey].content;
  if (!content) return undefined;

  // `*/*`, `application/json` 등 첫 번째 미디어 타입을 사용한다
  const [first] = Object.values(content);
  return first?.schema;
};

const parseBody = (operation: OperationObject, options: ConvertOptions): BodyModel | undefined => {
  const content = operation.requestBody?.content;
  if (!content) return undefined;

  const [mediaType, media] = Object.entries(content)[0] ?? [];
  if (!media) return undefined;

  const isFormData = mediaType === 'multipart/form-data';

  return {
    type: isFormData ? 'FormData' : convertType(media.schema, options),
    required: operation.requestBody?.required ?? true,
    isFormData,
  };
};

const parseQuery = (
  parameters: ParameterObject[],
  schemas: Record<string, SchemaObject>,
  options: ConvertOptions,
): QueryModel => {
  const queryParams = parameters.filter(parameter => parameter.in === 'query');
  if (queryParams.length === 0) return {has: false, inlineParams: []};

  // 스프링은 DTO 로 받는 쿼리를 `$ref` 하나로 내려준다 (ex. pageRequestDto: PagingRequest)
  const objectParam = queryParams.find(parameter => {
    const resolved = resolveRef(schemas, parameter.schema);
    return Boolean(refName(parameter.schema)) && Boolean(resolved?.properties);
  });

  const inlineParams = queryParams
    .filter(parameter => parameter !== objectParam)
    .map<ParamModel>(parameter => ({
      name: parameter.name,
      type: convertType(parameter.schema, options),
      required: parameter.required ?? false,
      description: parameter.description,
    }));

  return {
    has: true,
    objectType: objectParam ? refName(objectParam.schema) : undefined,
    inlineParams,
  };
};

export const parseOpenApi = (document: OpenApiDocument, config: GeneratorConfig): ApiModel => {
  const schemas = document.components?.schemas ?? {};
  const options: ConvertOptions = {treatPropertiesAsRequired: config.treatPropertiesAsRequired};

  const endpoints: EndpointModel[] = [];
  const warnings: string[] = [];

  for (const [path, pathItem] of Object.entries(document.paths)) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (!operation) continue;

      const key = `${method.toUpperCase()} ${path}`;

      const parameters = (operation.parameters ?? []).filter(
        parameter => !config.ignoreParamIn.includes(parameter.in as 'header' | 'cookie'),
      );

      const responseSchema = pickResponseSchema(operation);
      const unwrapped = unwrapResponse(schemas, responseSchema);

      if (responseSchema && !unwrapped.wrapped) {
        warnings.push(
          `${key}: 응답이 SuccessBody 래퍼가 아닙니다 (${unwrapped.wrapperName ?? 'inline schema'}). ` +
            `http 레이어는 항상 \`.data\` 를 반환하므로 런타임 값과 타입이 어긋날 수 있습니다.`,
        );
      }

      const responseType =
        unwrapped.wrapperName === 'SuccessBodyVoid' ? 'void' : convertType(unwrapped.schema, options);

      endpoints.push({
        key,
        method: method.toUpperCase() as EndpointModel['method'],
        path,
        group: groupOf(path),
        summary: operation.summary,
        description: operation.description,
        pathParams: parameters
          .filter(parameter => parameter.in === 'path')
          .map(parameter => ({
            name: parameter.name,
            type: convertType(parameter.schema, options),
            required: true,
            description: parameter.description,
          })),
        query: parseQuery(parameters, schemas, options),
        body: parseBody(operation, options),
        responseType,
      });
    }
  }

  const wrapperNames = collectWrapperNames(schemas);
  const emittedSchemas = Object.fromEntries(Object.entries(schemas).filter(([name]) => !wrapperNames.has(name)));

  endpoints.sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));

  return {endpoints, schemas: emittedSchemas, warnings};
};
