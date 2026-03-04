import {PostViewCountResponse} from '@app/api/post-view-count/route';
import {CLIENT_ENDPOINT} from '@constants/endpoint';
import {requestPostClient} from '@http/client';

export const postViewCount = async (uuid: string) => {
  const response = await requestPostClient<PostViewCountResponse>({
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
    endpoint: CLIENT_ENDPOINT.postViewCount,
    body: uuid,
  });

  return response;
};
