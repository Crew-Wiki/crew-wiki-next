import {CACHE} from '@constants/cache';
import {ENDPOINT} from '@constants/endpoint';
import {RecentlyDocument, WikiDocument} from '@type/Document.type';
import {http} from '@utils/http';

export const getDocumentByTitle = async (title: string) => {
  const docs = await http.get<WikiDocument>({
    endpoint: `${ENDPOINT.getDocumentByTitle}/${title}`,
    next: {revalidate: CACHE.time.revalidate, tags: [CACHE.tag.getDocumentByTitle]},
  });

  return docs;
};

export const getRandomDocument = async () => {
  const docs = await http.get<WikiDocument>({
    endpoint: `${ENDPOINT.getDocumentByTitle}`,
    next: {revalidate: CACHE.time.revalidate, tags: [CACHE.tag.getDocumentByTitle]},
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
