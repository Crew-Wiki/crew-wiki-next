'use server';

import {TAG_PREFIX} from '@constants/cache';
import {ApiResponseType} from '@type/http.type';
import {revalidateTag} from 'next/cache';
import {NextResponse} from 'next/server';

export const DELETE = async () => {
  try {
    revalidateTag(TAG_PREFIX);
    return new Response(null, {status: 204});
  } catch (error) {
    const response: ApiResponseType<null> = {
      data: null,
      code: 'ERROR',
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
    return NextResponse.json(response, {status: 500});
  }
};
