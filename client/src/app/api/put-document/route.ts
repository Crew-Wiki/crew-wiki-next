'use server';

import {PostDocumentContent, WikiDocument} from '@type/Document.type';
import {NextRequest, NextResponse} from 'next/server';
import {revalidateTag} from 'next/cache';
import {CACHE} from '@constants/cache';
import {putDocumentServer} from '@apis/server/document';
import {ApiResponseType} from '@type/http.type';

const putDocument = async (document: PostDocumentContent) => {
  const response = await putDocumentServer(document);

  revalidateTag(CACHE.tag.getDocumentsUUID);
  revalidateTag(CACHE.tag.getRecentlyDocuments);
  revalidateTag(CACHE.tag.getDocumentLogsByUUID(document.uuid));

  return response;
};

export const PUT = async (request: NextRequest) => {
  const document: PostDocumentContent = await request.json();

  try {
    const updatedDocument = await putDocument(document);

    const response: ApiResponseType<WikiDocument> = {
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
