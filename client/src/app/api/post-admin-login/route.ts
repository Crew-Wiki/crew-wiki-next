import {NextResponse} from 'next/server';
import {postAdminLogin} from '@apis/server/admin';
import {cookies} from 'next/headers';

export const POST = async (request: Request) => {
  try {
    const {loginId, password} = await request.json();

    if (!loginId || !password) {
      return NextResponse.json({error: 'Login ID 또는 password가 존재하지 않습니다.'}, {status: 400});
    }

    const response = await postAdminLogin({loginId, password});

    if (!response.ok) {
      switch (response.status) {
        case 400:
          return NextResponse.json({error: '잘못된 요청입니다. 입력 값을 확인해주세요.'}, {status: 400});
        case 401:
          return NextResponse.json({error: '아이디 또는 비밀번호가 올바르지 않습니다.'}, {status: 401});
        case 403:
          return NextResponse.json({error: '접근 권한이 없습니다.'}, {status: 403});
        case 500:
          return NextResponse.json({error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}, {status: 500});
        default:
          return NextResponse.json({error: '알 수 없는 오류가 발생했습니다.'}, {status: response.status});
      }
    }

    const setCookieHeader = response.headers.get('set-cookie');

    if (!setCookieHeader) {
      return NextResponse.json({error: '로그인 토큰이 없습니다.'}, {status: 401});
    }

    const [tokenKey, rest] = setCookieHeader.split('=');
    const tokenValue = rest?.split(';')[0];

    if (!tokenKey || !tokenValue) {
      return NextResponse.json({error: '로그인 토큰이 유효하지 않습니다.'}, {status: 401});
    }

    const cookieStore = await cookies();
    cookieStore.set({
      name: tokenKey.trim(),
      value: tokenValue.split(';')[0].trim(),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return NextResponse.json({message: '로그인 성공'});
  } catch (error) {
    console.error('로그인 처리 중 서버 오류:', error);
    return NextResponse.json({error: '로그인 처리 중 오류'}, {status: 500});
  }
};
