'use server';

import {PostDocumentContent} from '@apis/document';
import {CACHE} from '@constants/cache';
import {ENDPOINT} from '@constants/endpoint';
import {WikiDocument} from '@type/Document.type';
import {httpServer} from '@http/server';
import {revalidateTag} from 'next/cache';
import {NextRequest, NextResponse} from 'next/server';

const postDocument = async (document: PostDocumentContent) => {
  const response = await httpServer.post<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    endpoint: ENDPOINT.postDocument,
    body: document,
  });

  revalidateTag(CACHE.tag.getRecentlyDocuments);
  revalidateTag(CACHE.tag.getDocumentLogsByTitle(document.title));
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
