'use server';

import {CACHE} from '@constants/cache';
import {ApiResponseType} from '@type/http.type';
import {revalidateTag} from 'next/cache';
import {NextRequest, NextResponse} from 'next/server';

export const POST = async (request: NextRequest) => {
  try {
    const {organizationDocumentUuids}: {organizationDocumentUuids: string[]} = await request.json();

    organizationDocumentUuids.forEach(uuid => {
      revalidateTag(CACHE.tag.getOrganizationDocumentByUUID(uuid));
    });

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
