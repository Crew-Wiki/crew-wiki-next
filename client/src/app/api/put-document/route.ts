'use server';

import type {DocumentResponse, DocumentUpdateRequest} from '@apis/generated/types';
import {NextRequest, NextResponse} from 'next/server';
import {revalidateTag} from 'next/cache';
import {CACHE} from '@constants/cache';
import {ApiResponseType} from '@type/http.type';
import {api} from '@apis/generated/server';

const putDocument = async (document: DocumentUpdateRequest) => {
  const response = await api.document.put(document);

  revalidateTag(CACHE.tag.getRecentlyDocuments);
  revalidateTag(CACHE.tag.getDocumentByUUID(document.uuid));
  revalidateTag(CACHE.tag.getDocumentLogsByUUID(document.uuid));
  revalidateTag(CACHE.tag.getOrganizationsByDocumentUUID(document.uuid));

  return response;
};

export const PUT = async (request: NextRequest) => {
  const document: DocumentUpdateRequest = await request.json();

  try {
    const updatedDocument = await putDocument(document);

    const response: ApiResponseType<DocumentResponse> = {
      data: updatedDocument,
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
