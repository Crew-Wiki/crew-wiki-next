import {getDocumentByUUIDServer} from '@apis/server/document';
import {Metadata} from 'next';

export async function generateDocumentMetadata(uuid: string): Promise<Metadata> {
  try {
    const document = await getDocumentByUUIDServer(uuid);
    const documentTitle = document?.title;

    return {
      title: documentTitle,
      description: `${documentTitle}에 대한 정보(논란)를 확인하세요.`,
      openGraph: {
        title: `크루위키 ${documentTitle}의 문서`,
        description: `${documentTitle}에 대한 정보(논란)를 확인하세요.`,
        images: `${process.env.NEXT_PUBLIC_CDN_DOMAIN}/images/daemoon.png`,
      },
    };
  } catch (error) {
    return {
      title: '크루위키',
      description: '존재하지 않는 문서입니다.',
      openGraph: {
        title: '크루위키',
        description: '존재하지 않는 문서입니다.',
        images: `${process.env.NEXT_PUBLIC_CDN_DOMAIN}/images/daemoon.png`,
      },
    };
  }
}
