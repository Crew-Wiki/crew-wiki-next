'use server';

import type {OrganizationEventUpdateRequest, OrganizationEventUpdateResponse} from '@apis/generated/types';
import {CACHE} from '@constants/cache';
import {NextRequest, NextResponse} from 'next/server';
import {revalidateTag} from 'next/cache';
import {ApiResponseType} from '@type/http.type';
import {api} from '@apis/generated/server';

export const PUT = async (request: NextRequest) => {
  const {searchParams} = new URL(request.url);
  const organizationEventUuid = searchParams.get('uuid');
  const organizationDocumentUuid = searchParams.get('organizationDocumentUuid');

  if (!organizationEventUuid) {
    const response: ApiResponseType<null> = {
      data: null,
      code: 'ERROR',
      message: 'organizationEventUuid가 필요합니다.',
    };
    return NextResponse.json(response, {status: 400});
  }

  try {
    const eventData: OrganizationEventUpdateRequest = await request.json();
    const updatedEvent = await api.organizationEvents(organizationEventUuid).put(eventData);

    if (organizationDocumentUuid) {
      revalidateTag(CACHE.tag.getOrganizationDocumentByUUID(organizationDocumentUuid));
    }

    const response: ApiResponseType<OrganizationEventUpdateResponse> = {
      data: updatedEvent,
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
