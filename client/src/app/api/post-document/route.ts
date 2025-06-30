'use server';

import {CACHE} from '@constants/cache';
import {PostDocumentContent} from '@type/Document.type';
import {revalidateTag} from 'next/cache';
import {NextRequest, NextResponse} from 'next/server';
import {clearDocumentsCache} from '@utils/documentCache';
import {postDocumentServer} from '@apis/server/document';

const postDocument = async (document: PostDocumentContent) => {
  const response = await postDocumentServer(document);

  revalidateTag(CACHE.tag.getAllDocuments);
  revalidateTag(CACHE.tag.getRecentlyDocuments);
  revalidateTag(CACHE.tag.getDocumentLogsByUUID(document.uuid));
  clearDocumentsCache();
  return response;
};

export const POST = async (request: NextRequest) => {
  const document: PostDocumentContent = await request.json();

  try {
    await postDocument(document);

    return NextResponse.json(document, {status: 200});
  } catch (error) {
    return NextResponse.json({error}, {status: 500});
  }
};
