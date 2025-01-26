'use server';

import {getDocumentByTitle} from '@apis/document';
import {NextRequest, NextResponse} from 'next/server';

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get('title');

  try {
    const document = await getDocumentByTitle(title ?? '');

    return NextResponse.json(document, {status: 200});
  } catch (error) {
    return NextResponse.json({error}, {status: 500});
  }
};
