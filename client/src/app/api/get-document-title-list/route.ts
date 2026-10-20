'use server';

import {api} from '@apis/generated/server';
import {DocumentTitleListResponse} from '@apis/generated/types';
import {ApiResponseType} from '@type/http.type';
import {NextResponse} from 'next/server';

export const GET = async () => {
  try {
    const documents = await api.document.titles.get();

    const response: ApiResponseType<DocumentTitleListResponse[]> = {
      data: documents,
      code: 'SUCCESS',
    };

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
