'use server';

import {getDocumentsUUIDServer} from '@apis/server/document';
import {NextResponse} from 'next/server';

export const GET = async () => {
  const documents = await getDocumentsUUIDServer();

  const response = {
    data: documents,
    code: 'SUCCESS',
  };

  try {
    return NextResponse.json(response, {status: 200});
  } catch (error) {
    return NextResponse.json({error}, {status: 500});
  }
};
