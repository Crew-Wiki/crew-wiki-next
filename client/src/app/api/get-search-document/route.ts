'use server';

import {searchDocument} from '@apis/document';
import {NextRequest, NextResponse} from 'next/server';

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const referQuery = searchParams.get('referQuery');

  try {
    const result = await searchDocument(referQuery ?? '');

    return NextResponse.json(result, {status: 200});
  } catch (error) {
    return NextResponse.json({error}, {status: 500});
  }
};
