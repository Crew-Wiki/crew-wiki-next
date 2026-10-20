/**
 * Next.js 15 App Router 가 페이지/레이아웃에 넘기는 params 형태.
 * 프레임워크 규약 타입이라 프론트에서 선언한다.
 */
export type UUIDParams = {
  params: Promise<{uuid: string}>;
};

export type UUIDLogParams = {
  params: Promise<{uuid: string; logId: string}>;
};
