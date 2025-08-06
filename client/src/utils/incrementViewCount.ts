import {IncrementResult, ViewData} from '@type/viewCount.type';
import {withLock} from '@utils/fileLock';
import {readDataFile} from '@utils/readDataFile';
import {writeFile} from 'fs/promises';
import {join} from 'path';

const DATA_FILE_PATH = join(process.cwd(), 'src', 'data', 'view_data.json');

export async function incrementViewCount(
  uuid: string,
  filePath: string = DATA_FILE_PATH,
  threshold: number,
): Promise<IncrementResult> {
  const lockPath = filePath.replace('.json', '.lock');

  return await withLock(lockPath, async () => {
    const data: ViewData = await readDataFile(filePath);
    data.current_count[uuid] = (data.current_count[uuid] || 0) + 1;

    await writeFile(filePath, JSON.stringify(data, null, 2));

    const totalCurrentCount = Object.values(data.current_count).reduce((sum, count) => sum + count, 0);
    const totalFailedCount = Object.values(data.failed_count).reduce((sum, count) => sum + count, 0);
    const totalCurrentAndFailedCount = totalCurrentCount + totalFailedCount;

    const shouldFlush = totalCurrentAndFailedCount >= threshold;
    const result: IncrementResult = {
      current_count: data.current_count,
      failed_count: data.failed_count,
      shouldFlush,
      incremented_uuid: uuid,
      incremented_count: data.current_count[uuid],
    };

    if (shouldFlush) {
      result.total_views_to_flush = totalCurrentAndFailedCount;
    }

    return result;
  });
}
