'use server';

import {PostDocumentContent} from '@apis/document';

import {WikiDocument} from '@type/Document.type';
import {ENDPOINT} from '@constants/endpoint';
import {httpServer} from '@http/server';
import {NextRequest, NextResponse} from 'next/server';
import {revalidateTag} from 'next/cache';
import {CACHE} from '@constants/cache';

const putDocument = async (document: PostDocumentContent) => {
  const response = await httpServer.put<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    endpoint: `${ENDPOINT.updateDocument}/${document.title}`,
    body: {
      writer: document.writer,
      contents: document.contents,
      documentBytes: document.documentBytes,
    },
  });

  revalidateTag(CACHE.tag.getRecentlyDocuments);
  revalidateTag(CACHE.tag.getDocumentByTitle(document.title));
  revalidateTag(CACHE.tag.getDocumentLogsByTitle(document.title));

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
