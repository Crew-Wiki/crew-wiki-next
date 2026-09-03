'use server';

import type {OrganizationEventCreateRequest, OrganizationEventCreateResponse} from '@apis/generated/types';
import {CACHE} from '@constants/cache';
import {NextRequest, NextResponse} from 'next/server';
import {revalidateTag} from 'next/cache';
import {ApiResponseType} from '@type/http.type';
import {api} from '@apis/generated/server';

export const POST = async (request: NextRequest) => {
  const eventData: OrganizationEventCreateRequest = await request.json();

  try {
    const createdEvent = await api.organizationEvents.post(eventData);

    revalidateTag(CACHE.tag.getOrganizationDocumentByUUID(eventData.organizationDocumentUuid));

    const response: ApiResponseType<OrganizationEventCreateResponse> = {
      data: createdEvent,
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
