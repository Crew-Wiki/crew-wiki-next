import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {ApiResponseType} from '@type/http.type';

export const POST = async () => {
  try {
    const cookieStore = await cookies();

    cookieStore.delete('token');

    return NextResponse.json({message: '로그아웃 성공'});
  } catch (error) {
    console.error('로그아웃 처리 중 서버 오류:', error);
    const response: ApiResponseType<null> = {
      data: null,
      code: 'ERROR',
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
    return NextResponse.json(response, {status: 500});
  }
};
