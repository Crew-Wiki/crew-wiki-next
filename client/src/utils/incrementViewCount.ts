import {IncrementResult, ViewData} from '@type/viewCount.type';
import {withLock} from '@utils/fileLock';
import {readDataFile} from '@utils/readDataFile';
import {writeFile} from 'fs/promises';
import {join} from 'path';

const DATA_FILE_PATH = join(process.cwd(), process.env.VIEW_DATA_FILE_PATH);

export async function incrementViewCount(
  uuid: string,
  filePath: string = DATA_FILE_PATH,
  threshold: number,
): Promise<IncrementResult> {
  const lockPath = filePath.replace('.json', '.lock');

  return await withLock(lockPath, async () => {
    const data: ViewData = await readDataFile(filePath);
    data.accumulative_count[uuid] = (data.accumulative_count[uuid] || 0) + 1;

    await writeFile(filePath, JSON.stringify(data, null, 2));

    const totalAccumulativeCount = Object.values(data.accumulative_count).reduce((sum, count) => sum + count, 0);

    const shouldFlush = totalAccumulativeCount >= threshold;
    const result: IncrementResult = {
      accumulative_count: data.accumulative_count,
      shouldFlush,
    };

    if (shouldFlush) {
      result.total_views_to_flush = totalAccumulativeCount;
    }

    return result;
  });
}
