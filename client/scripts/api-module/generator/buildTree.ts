import type {EndpointModel} from '../model/endpoint.ts';
import type {TreeNode} from '../model/tree.ts';
import {camelCase, isPathParamSegment, paramNameOf, pathSegments} from '../utils/naming.ts';

/** 메서드 프로퍼티(`get`, `post`…)와 충돌하면 안 되는 이름들 */
export const METHOD_KEYS = new Set(['get', 'post', 'put', 'patch', 'delete']);

const createNode = (segment: string): TreeNode => ({
  segment,
  key: camelCase(segment),
  children: new Map(),
  operations: [],
});

const paramTypeOf = (endpoint: EndpointModel, paramName: string): string =>
  endpoint.pathParams.find(param => param.name === paramName)?.type ?? 'string';

export const buildTree = (endpoints: EndpointModel[], warnings: string[]): TreeNode => {
  const root = createNode('');

  for (const endpoint of endpoints) {
    let node = root;

    for (const segment of pathSegments(endpoint.path)) {
      if (isPathParamSegment(segment)) {
        const paramName = paramNameOf(segment);

        if (!node.param) {
          node.param = {name: paramName, type: paramTypeOf(endpoint, paramName), node: createNode(segment)};
        } else if (node.param.name !== paramName) {
          warnings.push(
            `${endpoint.key}: 같은 위치의 경로 파라미터 이름이 서로 다릅니다 ` +
              `(\`${node.param.name}\` vs \`${paramName}\`). 먼저 등장한 이름을 사용합니다.`,
          );
        }

        node = node.param.node;
        continue;
      }

      const key = camelCase(segment);

      if (METHOD_KEYS.has(key)) {
        throw new Error(
          `${endpoint.key}: 경로 세그먼트 \`${segment}\` 가 HTTP 메서드 프로퍼티와 충돌합니다. ` +
            `트리에서 \`.${key}\` 는 메서드 호출로 예약되어 있습니다.`,
        );
      }

      const child = node.children.get(key) ?? createNode(segment);
      node.children.set(key, child);
      node = child;
    }

    node.operations.push(endpoint);
  }

  return root;
};

/** 최상위 자식들만 떼어내 파일 단위로 나눈다 */
export const topLevelNodes = (root: TreeNode): TreeNode[] =>
  [...root.children.values()].sort((a, b) => a.key.localeCompare(b.key));
