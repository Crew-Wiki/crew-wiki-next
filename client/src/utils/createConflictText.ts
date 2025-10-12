export const createConflictText = (remoteContent: string, localContent: string): string => {
  const lineDiffs = myersLineDiff(localContent, remoteContent);
  return formatConflict(lineDiffs);
};

type DiffType = 'equal' | 'insert' | 'delete';
type Vector = Record<number, number>;

type LineDiff = {
  type: DiffType;
  value: string;
};

/**
 * myers diff algorithm
 *
 * A에서 문자를 삭제하거나 추가해서 B가 되었을 때 삭제, 추가가 최소가 되도록 하는 문자열 비교 알고리즘
 * 줄 단위로 처리하도록 수정
 */
const myersLineDiff = (oldText: string, newText: string): LineDiff[] => {
  const a = oldText.split('\n');
  const b = newText.split('\n');
  const N = a.length;
  const M = b.length;
  const MAX = N + M;

  /**
   * 대각선 k = x - y에서 가능한 가장 먼 x 좌표
   * k: 대각선 index
   * x: old index
   * y: new index (x - k)
   */
  const v: Vector = {1: 0};
  const trace: Vector[] = [];

  // D = 현재까지 편집 횟수 (삽입 + 삭제)
  for (let D = 0; D <= MAX; D++) {
    const vCopy = {...v};
    trace.push(vCopy);

    // 모든 대각선(k)에 대해 가장 멀리 전진 가능한 x 계산
    for (let k = -D; k <= D; k += 2) {
      let x: number;
      if (k === -D || (k !== D && v[k - 1] < v[k + 1])) {
        x = v[k + 1]; // insert
      } else {
        x = v[k - 1] + 1; // delete
      }
      let y = x - k;

      // 연속으로 같은 줄을 만나면 대각선 이동 (snake)
      while (x < N && y < M && a[x] === b[y]) {
        x++;
        y++;
      }

      v[k] = x;

      // 최소 편집 경로 도달 시 역추적
      if (x >= N && y >= M) {
        return backtrack(trace, a, b);
      }
    }
  }

  throw new Error('Diff did not converge');
};

/**
 * trace 기반 역추적
 *
 * forward 단계에서 저장한 trace를 사용하여 실제 diff sequence 생성
 * - equal: 공통 줄
 * - insert: newText에 추가된 줄
 * - delete: oldText에서 삭제된 줄
 *
 */
const backtrack = (trace: Vector[], a: string[], b: string[]) => {
  let x = a.length;
  let y = b.length;
  const result: LineDiff[] = [];

  for (let D = trace.length - 1; D >= 0; D--) {
    const v = trace[D];
    const k = x - y;

    let prevK: number;
    let prevX: number;

    if (k === -D || (k !== D && v[k - 1] < v[k + 1])) {
      prevK = k + 1;
      prevX = v[prevK];
    } else {
      prevK = k - 1;
      prevX = v[prevK] + 1;
    }

    const prevY = prevX - prevK;

    // equal 처리: 연속 공통 줄
    while (x > prevX && y > prevY) {
      result.push({type: 'equal', value: a[x - 1]});
      x--;
      y--;
    }

    if (D === 0) break;

    // insert / delete 처리
    if (x === prevX && y > prevY) {
      result.push({type: 'insert', value: b[y - 1]});
      y--;
    } else if (y === prevY && x > prevX) {
      result.push({type: 'delete', value: a[x - 1]});
      x--;
    }
  }

  // 남아 있는 줄 처리 (첫 줄 포함)
  while (x > 0) {
    result.push({type: 'delete', value: a[x - 1]});
    x--;
  }
  while (y > 0) {
    result.push({type: 'insert', value: b[y - 1]});
    y--;
  }

  return result.reverse();
};

/**
 * diff sequence를 conflict 형태로 포맷
 *
 * <<<<< 내 버전
 * 삭제된 줄
 * ──────────────
 * 추가된 줄
 * <<<<< 최신 버전
 */
const formatConflict = (diff: LineDiff[]) => {
  let result = '';
  let i = 0;

  while (i < diff.length) {
    const op = diff[i];

    if (op.type === 'equal') {
      result += op.value + '\n';
      i++;
      continue;
    }

    // conflict 구간 시작
    const deleted: string[] = [];
    const inserted: string[] = [];

    while (i < diff.length && diff[i].type !== 'equal') {
      if (diff[i].type === 'delete') deleted.push(diff[i].value);
      if (diff[i].type === 'insert') inserted.push(diff[i].value);
      i++;
    }

    // conflict 출력
    result += `<<<<< 내 버전\n`;
    if (deleted.length > 0) result += deleted.join('\n') + '\n';
    result += `──────────────\n`;
    if (inserted.length > 0) result += inserted.join('\n') + '\n';
    result += `<<<<< 최신 버전\n`;
  }

  return result.trimEnd();
};
