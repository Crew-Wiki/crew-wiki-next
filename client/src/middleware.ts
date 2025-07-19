import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const {pathname} = new URL(request.url);

  // TODO: 개발 완료 후 주석 해제
  // if (pathname === '/admin/login' && token) {
  //   return NextResponse.redirect(new URL('/admin/documents', request.url));
  // }
  //
  // if (pathname !== '/admin/login' && !token) {
  //   return NextResponse.redirect(new URL('/admin/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
