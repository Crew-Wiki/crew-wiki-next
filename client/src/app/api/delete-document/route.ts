'use server';

import {CACHE} from '@constants/cache';
import {NextRequest, NextResponse} from 'next/server';
import {revalidateTag} from 'next/cache';
import {cookies} from 'next/headers';
import {deleteDocumentServer} from '@apis/server/document';
import {ApiResponseType} from '@type/http.type';

const deleteDocument = async (uuid: string, cookieHeader?: string) => {
  const response = await deleteDocumentServer(uuid, cookieHeader);

  revalidateTag(CACHE.tag.getDocumentsUUID);
  revalidateTag(CACHE.tag.getRecentlyDocuments);
  revalidateTag(CACHE.tag.getDocumentByUUID(uuid));

  return response;
};

export const DELETE = async (request: NextRequest) => {
  const {searchParams} = new URL(request.url);
  const uuid = searchParams.get('uuid');

  if (!uuid) {
    const response: ApiResponseType<null> = {
      data: null,
      code: 'ERROR',
      message: 'UUID가 필요합니다.',
    };
    return NextResponse.json(response, {status: 400});
  }

  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

    await deleteDocument(uuid, cookieHeader);

    const response: ApiResponseType<null> = {
      data: null,
      code: 'SUCCESS',
    };

    return NextResponse.json(response, {status: 200});
  } catch (error) {
    console.error('Delete document error:', error);
    const response: ApiResponseType<null> = {
      data: null,
      code: 'ERROR',
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
    return NextResponse.json(response, {status: 500});
  }
};
