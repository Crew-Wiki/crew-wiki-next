'use server';

import {CACHE} from '@constants/cache';
import {NextRequest, NextResponse} from 'next/server';
import {revalidateTag} from 'next/cache';
import {putOrganizationDocumentServer} from '@apis/server/organizationDocument';
import {ApiResponseType} from '@type/http.type';
import {GroupDocumentResponse, OrganizationDocumentUpdateRequest} from '@type/Group.type';

export const PUT = async (request: NextRequest) => {
  const documentData: OrganizationDocumentUpdateRequest = await request.json();

  if (!documentData.uuid) {
    const response: ApiResponseType<null> = {
      data: null,
      code: 'ERROR',
      message: 'uuid가 필요합니다.',
    };
    return NextResponse.json(response, {status: 400});
  }

  try {
    const updatedDocument = await putOrganizationDocumentServer(documentData);

    revalidateTag(CACHE.tag.getOrganizationDocumentByUUID(documentData.uuid));
    revalidateTag(CACHE.tag.getRecentlyDocuments);

    const response: ApiResponseType<GroupDocumentResponse> = {
      data: updatedDocument,
      code: 'SUCCESS',
    };

    return NextResponse.json(response, {status: 200});
  } catch (error) {
    const response: ApiResponseType<null> = {
      data: null,
      code: 'ERROR',
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
    return NextResponse.json(response, {status: 500});
  }
};
