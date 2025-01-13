'use server';

import {CACHE} from '@constants/cache';
import {ENDPOINT} from '@constants/endpoint';
import {RecentlyDocument, WikiDocument} from '@type/Document.type';
import {http} from '@utils/http';
import {revalidateTag} from 'next/cache';

export const getDocumentByTitle = async (title: string) => {
  const docs = await http.get<WikiDocument>({
    endpoint: `${ENDPOINT.getDocumentByTitle}/${title}`,
    next: {revalidate: CACHE.time.revalidate, tags: [CACHE.tag.getDocumentByTitle]},
  });

  return docs;
};

export const getRandomDocument = async () => {
  const docs = await http.get<WikiDocument>({
    endpoint: ENDPOINT.getRandomDocument,
    next: {revalidate: CACHE.time.revalidate, tags: [CACHE.tag.getRandomDocument]},
  });

  return docs.title;
};

interface RecentlyDocumentsResponse {
  documents: RecentlyDocument[];
}

export const getRecentlyDocuments = async () => {
  const {documents} = await http.get<RecentlyDocumentsResponse>({
    endpoint: ENDPOINT.getRecentlyDocuments,
    next: {revalidate: CACHE.time.revalidate, tags: [CACHE.tag.getRecentlyDocuments]},
  });

  return documents;
};

// 요청할 때 필요한 데이터
export interface PostDocumentContent {
  title: string;
  contents: string;
  writer: string;
  documentBytes: number;
}

export const postDocument = async (document: PostDocumentContent) => {
  const response = await http.post<WikiDocument>({
    endpoint: ENDPOINT.postDocument,
    body: document,
  });
  revalidateTag(CACHE.tag.getRecentlyDocuments);

  return response;
};

export const searchDocument = async (referQuery: string) => {
  const titles = await http.get<string[]>({
    endpoint: ENDPOINT.getDocumentSearch,
    queryParams: {
      keyWord: referQuery,
    },
  });

  return titles;
};
