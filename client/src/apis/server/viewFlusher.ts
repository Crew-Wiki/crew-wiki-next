import {IncrementResult, ViewCountByUUID, ViewData} from '@type/viewCount.type';
import {withLock} from '@utils/fileLock';
import {writeFile} from 'fs/promises';
import {postViewsFlush} from './document';
import {readDataFile} from '@utils/readDataFile';

export async function flushViewCountIfNecessary(incrementResult: IncrementResult, filePath: string): Promise<void> {
  if (!incrementResult.shouldFlush || incrementResult.total_views_to_flush === undefined) {
    return;
  }

  const lockPath = filePath.replace('.json', '.lock');
  let dataToFlush: ViewCountByUUID = {};

  await withLock(lockPath, async () => {
    const data: ViewData = await readDataFile(filePath);

    dataToFlush = {...data.accumulative_count};

    data.accumulative_count = {};
    await writeFile(filePath, JSON.stringify(data, null, 2));
  });

  try {
    await postViewsFlush(dataToFlush);
  } catch (error) {
    console.error('백엔드 API 전송 중 오류:', error);

    await withLock(lockPath, async () => {
      // data를 비워주고 postViewsFlush를 수행하는 동안 조회수가 증가한 경우에 대비하기 위해 다시 file read
      const data: ViewData = await readDataFile(filePath);
      for (const uuid in dataToFlush) {
        data.accumulative_count[uuid] = (data.accumulative_count[uuid] || 0) + dataToFlush[uuid];
      }
      await writeFile(filePath, JSON.stringify(data, null, 2));
    });
  }
}
