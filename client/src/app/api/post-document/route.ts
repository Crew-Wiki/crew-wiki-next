'use server';

import {CACHE} from '@constants/cache';
import {PostDocumentContent} from '@type/Document.type';
import {revalidateTag} from 'next/cache';
import {NextRequest, NextResponse} from 'next/server';
import {postDocumentServer} from '@apis/server/document';

const postDocument = async (document: PostDocumentContent) => {
  const response = await postDocumentServer(document);

  revalidateTag(CACHE.tag.getDocumentsUUID);
  revalidateTag(CACHE.tag.getRecentlyDocuments);
  revalidateTag(CACHE.tag.getDocumentByUUID(document.uuid));
  revalidateTag(CACHE.tag.getDocumentLogsByUUID(document.uuid));

  return response;
};

export const POST = async (request: NextRequest) => {
  const document: PostDocumentContent = await request.json();

  try {
    const createdDocument = await postDocument(document);

    const response = {
      data: createdDocument,
      code: 'SUCCESS',
    };

    return NextResponse.json(response, {status: 200});
  } catch (error) {
    return NextResponse.json({error}, {status: 500});
  }
};
