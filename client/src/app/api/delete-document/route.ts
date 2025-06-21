import {deleteDocument} from '@apis/admin';
import {NextResponse} from 'next/server';

export const DELETE = async (request: Request) => {
  try {
    const {documentId} = await request.json();

    const response = await deleteDocument(documentId);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('문서 삭제 실패: 존재하지 않는 document ID입니다.');
      } else if (response.status === 403) {
        throw new Error('문서 삭제 실패: admin 권한이 없습니다.');
      }
      throw new Error(`문서 삭제 실패하였습니다. 상태 코드: ${response.status}`);
    }

    return NextResponse.json({message: '문서가 성공적으로 삭제되었습니다.'});
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({error: error.message}, {status: 500});
    } else {
      return NextResponse.json({error: '알 수 없는 오류가 발생했습니다.'}, {status: 500});
    }
  }
};
