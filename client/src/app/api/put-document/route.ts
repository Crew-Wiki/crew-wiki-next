'use server';

import {PostDocumentContent} from '@type/Document.type';
import {NextRequest, NextResponse} from 'next/server';
import {revalidateTag} from 'next/cache';
import {CACHE} from '@constants/cache';
import {putDocumentServer} from '@apis/server/document';
import {updateDocumentCache} from '@utils/documentCache';

const putDocument = async (document: PostDocumentContent) => {
  const response = await putDocumentServer(document);

  revalidateTag(CACHE.tag.getAllDocuments);
  revalidateTag(CACHE.tag.getRecentlyDocuments);
  revalidateTag(CACHE.tag.getDocumentByUUID(document.uuid));
  revalidateTag(CACHE.tag.getDocumentLogsByUUID(document.uuid));

  await updateDocumentCache({
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

export const PUT = async (request: NextRequest) => {
  const document: PostDocumentContent = await request.json();

  try {
    await putDocument(document);

    return NextResponse.json(document, {status: 200});
  } catch (error) {
    return NextResponse.json({error}, {status: 500});
  }
};
