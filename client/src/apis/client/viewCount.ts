import {PostViewCountResponse} from '@app/api/post-view-count/route';
import {requestPostClient} from '@http/client';

export const postViewCount = async (uuid: string) => {
  const response = await requestPostClient<PostViewCountResponse>({
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
    endpoint: '/api/post-view-count',
    body: uuid,
  });

  return response;
};
