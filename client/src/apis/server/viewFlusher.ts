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
  let apiSuccess = false;
  const combinedDataToFlush: ViewCountByUUID = {};

  await withLock(lockPath, async () => {
    const data: ViewData = await readDataFile(filePath);

    // current_count와 failed_count를 합쳐서 플러싱할 데이터를 만듭니다.
    for (const uuid in data.current_count) {
      combinedDataToFlush[uuid] = (combinedDataToFlush[uuid] || 0) + data.current_count[uuid];
    }
    for (const uuid in data.failed_count) {
      combinedDataToFlush[uuid] = (combinedDataToFlush[uuid] || 0) + data.failed_count[uuid];
    }

    // 파일에서 current_count와 failed_count를 모두 초기화합니다.
    data.current_count = {};
    data.failed_count = {};
    await writeFile(filePath, JSON.stringify(data, null, 2));
  });

  try {
    await postViewsFlush(combinedDataToFlush);
    apiSuccess = true;
  } catch (error) {
    console.error('백엔드 API 전송 중 오류:', error);
    apiSuccess = false;
  }

  // API 호출 결과에 따라 파일 데이터를 업데이트합니다. (다시 Lock 획득)
  await withLock(lockPath, async () => {
    const data: ViewData = await readDataFile(filePath);
    if (!apiSuccess) {
      // API 호출 실패 시: 이전에 플러싱하려던 데이터를 failed_count에 다시 병합
      for (const uuid in combinedDataToFlush) {
        data.failed_count[uuid] = (data.failed_count[uuid] || 0) + combinedDataToFlush[uuid];
      }
    }
    await writeFile(filePath, JSON.stringify(data, null, 2));
  });
}
