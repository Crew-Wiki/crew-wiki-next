'use server';

import {CACHE} from '@constants/cache';
import {PostDocumentContent, WikiDocument} from '@type/Document.type';
import {revalidateTag} from 'next/cache';
import {NextRequest, NextResponse} from 'next/server';
import {postDocumentServer} from '@apis/server/document';
import {ApiResponseType} from '@type/http.type';

const postDocument = async (document: PostDocumentContent) => {
  const response = await postDocumentServer(document);

  revalidateTag(CACHE.tag.getRecentlyDocuments);
  revalidateTag(CACHE.tag.getDocumentByUUID(document.uuid));
  revalidateTag(CACHE.tag.getDocumentLogsByUUID(document.uuid));

  return response;
};

export const POST = async (request: NextRequest) => {
  const document: PostDocumentContent = await request.json();

  try {
    const createdDocument = await postDocument(document);

    const response: ApiResponseType<WikiDocument> = {
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
