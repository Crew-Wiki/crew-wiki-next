'use server';

import {api} from '@apis/generated/server';
import {DocumentSearchResponse} from '@apis/generated/types';
import {allDocumentsParams} from '@constants/params';
import {ApiResponseType} from '@type/http.type';
import {NextResponse} from 'next/server';

export const GET = async () => {
  const documents = await api.document.get(allDocumentsParams);

  const response: ApiResponseType<DocumentSearchResponse[]> = {
    data: documents.data.map(({title, uuid, documentType}) => ({title, uuid, documentType})),
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
