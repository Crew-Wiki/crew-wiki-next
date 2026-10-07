import type {EndpointModel} from './endpoint.ts';

/**
 * 경로를 그대로 옮긴 트라이 노드.
 *
 * `/document/title/{title}/uuid` 는
 * document -> title -> (param: title) -> uuid 로 이어지고,
 * 마지막 노드에 GET 오퍼레이션이 달린다.
 */
export interface TreeNode {
  /** 원본 경로 세그먼트. 루트는 '' */
  segment: string;

  /** 프로퍼티로 노출될 이름 (camelCase) */
  key: string;

  /** 정적 세그먼트 자식들 */
  children: Map<string, TreeNode>;

  /** `{param}` 세그먼트 자식. 함수 호출로 내려간다 */
  param?: ParamChild;

  /** 이 노드에 달린 HTTP 오퍼레이션들 */
  operations: EndpointModel[];
}

export interface ParamChild {
  name: string;

  type: string;

  node: TreeNode;
}
