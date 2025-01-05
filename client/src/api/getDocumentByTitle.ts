import {CACHE} from '@constants/cache';
import {ENDPOINT} from '@constants/endpoint';
import {WikiDocument} from '@type/Document.type';
import {http} from '@utils/http';

export const getDocumentByTitle = async (title: string) => {
  const docs = await http.get<WikiDocument>({
    endpoint: `${ENDPOINT.getDocumentByTitle}/${title}`,
    next: {revalidate: CACHE.time.revalidate, tags: [CACHE.tag.getDocumentByTitle]},
  });

  return docs;
};
