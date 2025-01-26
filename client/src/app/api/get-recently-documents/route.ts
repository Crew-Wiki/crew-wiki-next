'use server';

import {getRecentlyDocuments} from '@apis/document';
import {NextResponse} from 'next/server';

export const GET = async () => {
  try {
    const document = await getRecentlyDocuments();

    return NextResponse.json(document, {status: 200});
  } catch (error) {
    return NextResponse.json({error}, {status: 500});
  }
};
