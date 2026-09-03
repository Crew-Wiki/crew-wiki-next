'use server';

import type {CrewDocumentCreateRequest, DocumentResponse} from '@apis/generated/types';
import {CACHE} from '@constants/cache';
import {revalidateTag} from 'next/cache';
import {NextRequest, NextResponse} from 'next/server';
import {ApiResponseType} from '@type/http.type';
import {api} from '@apis/generated/server';

const postDocument = async (document: CrewDocumentCreateRequest) => {
  const response = await api.document.post(document);

  revalidateTag(CACHE.tag.getRecentlyDocuments);
  revalidateTag(CACHE.tag.getDocumentTitles);
  revalidateTag(CACHE.tag.getDocumentByUUID(document.uuid));
  revalidateTag(CACHE.tag.getDocumentLogsByUUID(document.uuid));
  revalidateTag(CACHE.tag.getOrganizationsByDocumentUUID(document.uuid));

  return response;
};

export const POST = async (request: NextRequest) => {
  const document: CrewDocumentCreateRequest = await request.json();

  try {
    const createdDocument = await postDocument(document);

    const response: ApiResponseType<DocumentResponse> = {
      data: createdDocument,
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
