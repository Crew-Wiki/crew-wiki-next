'use server';

import {PostDocumentContent} from '@type/Document.type';
import {NextRequest, NextResponse} from 'next/server';
import {revalidateTag} from 'next/cache';
import {CACHE} from '@constants/cache';
import {clearDocumentsCache} from '@utils/documentCache';
import {putDocumentServer} from '@apis/server/document';

const putDocument = async (document: PostDocumentContent) => {
  const response = await putDocumentServer(document);

  revalidateTag(CACHE.tag.getAllDocuments);
  revalidateTag(CACHE.tag.getRecentlyDocuments);
  revalidateTag(CACHE.tag.getDocumentByUUID(document.uuid));
  revalidateTag(CACHE.tag.getDocumentLogsByUUID(document.uuid));
  clearDocumentsCache();

  return response;
};

export const PUT = async (request: NextRequest) => {
  const document: PostDocumentContent = await request.json();

  try {
    await putDocument(document);

    return NextResponse.json(document, {status: 200});
  } catch (error) {
    return NextResponse.json({error}, {status: 500});
  }
};
