import {flushViewCountIfNecessary} from '@apis/server/viewFlusher';
import {incrementViewCount} from '@utils/incrementViewCount';
import {NextResponse} from 'next/server';
import {join} from 'path';

const DATA_FILE_PATH = join(process.cwd(), 'src', 'data', 'view_data.json');

const THRESHOLD = 50;

export async function POST(request: Request) {
  try {
    const uuid = await request.json();
    const incrementResult = await incrementViewCount(uuid, DATA_FILE_PATH, THRESHOLD);

    if (incrementResult.shouldFlush) {
      flushViewCountIfNecessary(incrementResult, DATA_FILE_PATH);
    }

    return NextResponse.json({message: '조회수 증가 완료'}, {status: 202});
  } catch (error) {
    console.error('frontend server error:', error);
    return NextResponse.json({message: 'Internal Server Error'}, {status: 500});
  }
}
