import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {URLS} from '@constants/urls';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const {pathname} = new URL(request.url);

  if (!pathname.startsWith(URLS.admin)) {
    return NextResponse.next();
  }

  if (pathname !== URLS.login && !token) {
    return NextResponse.redirect(new URL(URLS.login, request.url));
  }

  if (pathname === URLS.login && token) {
    return NextResponse.redirect(new URL(URLS.documents, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
