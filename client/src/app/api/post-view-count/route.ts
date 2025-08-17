import {flushViewCountIfNecessary} from '@apis/server/viewFlusher';
import {FileLockError} from '@utils/fileLock';
import {incrementViewCount} from '@utils/incrementViewCount';
import {NextResponse} from 'next/server';
import {join} from 'path';

const DATA_FILE_PATH = join(process.cwd(), process.env.VIEW_DATA_FILE_PATH);
const THRESHOLD = Number(process.env.VIEW_DATA_FLUSH_THRESHOLD);

export type PostViewCountResponse = {success: boolean; message: string};

export async function POST(request: Request) {
  try {
    const uuid = await request.json();
    const incrementResult = await incrementViewCount(uuid, DATA_FILE_PATH, THRESHOLD);

    if (incrementResult.shouldFlush) {
      flushViewCountIfNecessary(incrementResult, DATA_FILE_PATH);
    }

    return NextResponse.json<PostViewCountResponse>({success: true, message: '조회수 증가 완료'}, {status: 202});
  } catch (error) {
    if (error instanceof FileLockError) {
      console.warn('조회수 업데이트 실패:', error.message);
      return NextResponse.json<PostViewCountResponse>(
        {success: false, message: '조회수 업데이트 건너뜀'},
        {status: 200},
      );
    }

    console.error('프론트엔드 서버 에러:', error);
    return NextResponse.json<PostViewCountResponse>({success: false, message: 'Internal Server Error'}, {status: 500});
  }
}
