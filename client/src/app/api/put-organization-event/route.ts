'use server';

import {OrganizationEventUpdateRequest, OrganizationEvent} from '@type/Event.type';
import {NextRequest, NextResponse} from 'next/server';
import {putOrganizationEventServer} from '@apis/server/organizationEvent';
import {ApiResponseType} from '@type/http.type';

export const PUT = async (request: NextRequest) => {
  const {searchParams} = new URL(request.url);
  const organizationEventUuid = searchParams.get('uuid');

  if (!organizationEventUuid) {
    const response: ApiResponseType<null> = {
      data: null,
      code: 'ERROR',
      message: 'organizationEventUuid가 필요합니다.',
    };
    return NextResponse.json(response, {status: 400});
  }

  const eventData: OrganizationEventUpdateRequest = await request.json();

  try {
    const updatedEvent = await putOrganizationEventServer(organizationEventUuid, eventData);

    const response: ApiResponseType<OrganizationEvent> = {
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
