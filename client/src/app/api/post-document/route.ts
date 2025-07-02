'use server';

import {CACHE} from '@constants/cache';
import {PostDocumentContent} from '@type/Document.type';
import {revalidateTag} from 'next/cache';
import {NextRequest, NextResponse} from 'next/server';
import {postDocumentServer} from '@apis/server/document';
import {addDocumentCache} from '@utils/documentCache';

const postDocument = async (document: PostDocumentContent) => {
  const response = await postDocumentServer(document);

  revalidateTag(CACHE.tag.getAllDocuments);
  revalidateTag(CACHE.tag.getRecentlyDocuments);
  revalidateTag(CACHE.tag.getDocumentLogsByUUID(document.uuid));

  await addDocumentCache({
    title: response.title,
    contents: response.contents,
    writer: response.writer,
    documentBytes: document.documentBytes,
    generateTime: response.generateTime,
    uuid: response.documentUUID,
    id: response.documentId,
  });

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
