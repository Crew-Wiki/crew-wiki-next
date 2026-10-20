/** 이벤트 작성/수정 모달의 폼 값 (Date 객체를 그대로 다룬다) */
export interface EventInput {
  date: Date;
  title: string;
  contents: string;
  writer: string;
}
