import type {GeneratorConfig} from '../generator.config.ts';
import type {TreeNode} from '../model/tree.ts';
import {AUTO_GENERATED_BANNER} from '../utils/file.ts';
import {
  collectTypeNames,
  flattenOperations,
  renderNode,
  requestFunctionName,
  type RenderContext,
} from './renderTree.ts';

export const generateClientResource = (node: TreeNode, knownTypes: Set<string>, config: GeneratorConfig): string => {
  const endpoints = flattenOperations(node);
  const context: RenderContext = {target: 'Client', requestFunctions: config.requestFunctions};
  const requestFunctions = [...new Set(endpoints.map(endpoint => requestFunctionName(endpoint, context)))].sort();
  const typeImports = collectTypeNames(endpoints, knownTypes);
  const hasQuery = endpoints.some(endpoint => endpoint.query.has);

  const lines = [
    AUTO_GENERATED_BANNER,
    "'use client';",
    '',
    `import {${requestFunctions.join(', ')}} from '${config.modules.httpClient}';`,
  ];

  if (hasQuery) lines.push(`import {toQueryParams} from '${config.modules.httpCommon}';`);

  lines.push(`import {API_BASE_URL} from '${config.modules.runtimeConfig}';`);

  if (typeImports.length > 0) {
    lines.push(`import type {${typeImports.join(', ')}} from '${config.modules.types}';`);
  }

  lines.push('', `export const ${node.key} = ${renderNode(node, 0, context)};`, '');

  return lines.join('\n');
};

export const generateClientIndex = (nodes: TreeNode[]): string => {
  const imports = nodes.map(node => `import {${node.key}} from './${node.key}';`);
  const members = nodes.map(node => `  ${node.key},`);

  return [
    AUTO_GENERATED_BANNER,
    "'use client';",
    '',
    imports.join('\n'),
    '',
    '/** 클라이언트 컴포넌트에서 쓰는 API 트리 */',
    'export const api = {',
    members.join('\n'),
    '};',
    '',
  ].join('\n');
};
