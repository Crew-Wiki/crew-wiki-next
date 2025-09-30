'use server';

import {TitleAndUUID} from '@apis/client/document';
import {getDocumentsUUIDServer} from '@apis/server/document';
import {ApiResponseType} from '@type/http.type';
import {NextResponse} from 'next/server';

export const GET = async () => {
  const documents = await getDocumentsUUIDServer();

  const response: ApiResponseType<TitleAndUUID[]> = {
    data: documents.map(({title, uuid}) => ({title, uuid})),
    code: 'SUCCESS',
  };

  try {
    return NextResponse.json(response, {status: 200});
  } catch (error) {
    const response: ApiResponseType<null> = {
      data: null,
      code: 'ERROR',
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
    return NextResponse.json(response, {status: 500});
  }
};
