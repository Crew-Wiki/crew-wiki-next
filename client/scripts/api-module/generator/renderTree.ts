import type {GeneratorConfig} from '../generator.config.ts';
import type {EndpointModel} from '../model/endpoint.ts';
import type {TreeNode} from '../model/tree.ts';
import {propertyKey} from '../utils/naming.ts';

export interface RenderContext {
  /** 'Server' 면 options 인자와 resolveServerOptions 스프레드가 붙는다 */
  target: 'Server' | 'Client';

  requestFunctions: GeneratorConfig['requestFunctions'];
}

export const requestFunctionOf = (endpoint: EndpointModel, context: RenderContext) => {
  const entry = context.requestFunctions[endpoint.method];
  return {name: context.target === 'Server' ? entry.server : entry.client, generic: entry.generic};
};

export const requestFunctionName = (endpoint: EndpointModel, context: RenderContext): string =>
  requestFunctionOf(endpoint, context).name;

export const queryTypeOf = (endpoint: EndpointModel): string | undefined => {
  const {has, objectType, inlineParams} = endpoint.query;
  if (!has) return undefined;

  const inline =
    inlineParams.length > 0
      ? `{${inlineParams.map(param => `${param.name}${param.required ? '' : '?'}: ${param.type}`).join('; ')}}`
      : undefined;

  if (objectType && inline) return `${objectType} & ${inline}`;

  return objectType ?? inline;
};

/** 경로 파라미터는 상위 화살표 함수에서 이미 같은 이름으로 바인딩되어 있다 */
const endpointTemplate = (endpoint: EndpointModel): string =>
  `\`${endpoint.path.replace(/\{([^}]+)\}/g, (_, name: string) => `\${${name}}`)}\``;

const argsObject = (endpoint: EndpointModel): string => {
  const entries = endpoint.pathParams.map(param => param.name);

  if (endpoint.query.has) entries.push('query');
  if (endpoint.body) entries.push('body');

  return entries.length > 0 ? `{${entries.join(', ')}}` : '{}';
};

const docComment = (endpoint: EndpointModel, indent: string): string => {
  const lines = [endpoint.summary, endpoint.description !== endpoint.summary ? endpoint.description : undefined]
    .filter(Boolean)
    .map(line => `${indent} * ${line}`);

  lines.push(`${indent} * \`${endpoint.key}\``);

  return `${indent}/**\n${lines.join('\n')}\n${indent} */`;
};

const renderOperation = (endpoint: EndpointModel, indent: number, context: RenderContext): string => {
  const pad = ' '.repeat(indent);
  const isServer = context.target === 'Server';

  const parameters: string[] = [];
  if (endpoint.body) parameters.push(`body${endpoint.body.required ? '' : '?'}: ${endpoint.body.type}`);

  const queryType = queryTypeOf(endpoint);
  if (queryType) {
    const allOptional = !endpoint.query.objectType && endpoint.query.inlineParams.every(param => !param.required);
    parameters.push(`query${allOptional ? '?' : ''}: ${queryType}`);
  }

  if (isServer) parameters.push('options?: ServerRequestOptions');

  const fetchArgs = [`${pad}    baseUrl: API_BASE_URL,`, `${pad}    endpoint: ${endpointTemplate(endpoint)},`];

  if (endpoint.query.has) fetchArgs.push(`${pad}    queryParams: toQueryParams(query),`);
  if (endpoint.body) fetchArgs.push(`${pad}    body,`);
  if (isServer) {
    fetchArgs.push(`${pad}    ...resolveServerOptions('${endpoint.key}', ${argsObject(endpoint)}, options),`);
  }

  const method = endpoint.method.toLowerCase();
  const {name: requestFunction, generic} = requestFunctionOf(endpoint, context);
  const typeArgument = generic ? `<${endpoint.responseType}>` : '';

  return [
    docComment(endpoint, pad),
    `${pad}${method}: async (${parameters.join(', ')}): Promise<${endpoint.responseType}> =>`,
    `${pad}  await ${requestFunction}${typeArgument}({`,
    fetchArgs.join('\n'),
    `${pad}  }),`,
  ].join('\n');
};

/**
 * 노드를 표현식 문자열로 렌더링한다.
 * 첫 줄은 들여쓰기 없이 반환하고, 닫는 괄호는 `indent` 에 맞춘다.
 */
export const renderNode = (node: TreeNode, indent: number, context: RenderContext): string => {
  const staticEntries = (depth: number) =>
    [
      ...node.operations.map(endpoint => renderOperation(endpoint, depth, context)),
      ...[...node.children.values()]
        .sort((a, b) => a.key.localeCompare(b.key))
        .map(child => `${' '.repeat(depth)}${propertyKey(child.key)}: ${renderNode(child, depth, context)},`),
    ].join('\n');

  const hasStatics = node.operations.length > 0 || node.children.size > 0;
  const pad = ' '.repeat(indent);

  if (!node.param) return hasStatics ? `{\n${staticEntries(indent + 2)}\n${pad}}` : '{}';

  const {name, type, node: paramNode} = node.param;

  if (!hasStatics) return `(${name}: ${type}) => (${renderNode(paramNode, indent, context)})`;

  // 경로 파라미터 자식과 자기 자신의 오퍼레이션/자식을 함께 가진 노드는
  // 호출 가능하면서 프로퍼티도 갖는 하이브리드가 된다.
  const inner = ' '.repeat(indent + 2);

  return [
    'Object.assign(',
    `${inner}(${name}: ${type}) => (${renderNode(paramNode, indent + 2, context)}),`,
    `${inner}{`,
    staticEntries(indent + 4),
    `${inner}},`,
    `${pad})`,
  ].join('\n');
};

/** 노드 아래의 모든 오퍼레이션 */
export const flattenOperations = (node: TreeNode): EndpointModel[] => [
  ...node.operations,
  ...[...node.children.values()].flatMap(flattenOperations),
  ...(node.param ? flattenOperations(node.param.node) : []),
];

/**
 * 생성 파일에서 실제로 참조하는 타입 이름만 추려낸다.
 * `include` 로 응답 타입 포함 여부를 고르는데, 인자 맵(operations.ts)에는 응답 타입이 등장하지 않는다.
 */
export const collectTypeNames = (
  endpoints: EndpointModel[],
  knownTypes: Set<string>,
  include: {response: boolean} = {response: true},
): string[] => {
  const used = new Set<string>();

  const scan = (expression: string | undefined) => {
    if (!expression) return;
    for (const token of expression.match(/[A-Za-z_$][A-Za-z0-9_$]*/g) ?? []) {
      if (knownTypes.has(token)) used.add(token);
    }
  };

  for (const endpoint of endpoints) {
    if (include.response) scan(endpoint.responseType);
    scan(endpoint.body?.type);
    scan(queryTypeOf(endpoint));
  }

  return [...used].sort();
};
