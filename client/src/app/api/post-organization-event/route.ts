'use server';

import {EventFormData, OrganizationEventCreateResponse} from '@type/Event.type';
import {NextRequest, NextResponse} from 'next/server';
import {postOrganizationEventServer} from '@apis/server/organizationEvent';
import {ApiResponseType} from '@type/http.type';

export const POST = async (request: NextRequest) => {
  const eventData: EventFormData = await request.json();

  try {
    const createdEvent = await postOrganizationEventServer(eventData);

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
