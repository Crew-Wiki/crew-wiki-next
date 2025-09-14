import {ViewData} from '@type/viewCount.type';
import {readFile} from 'fs/promises';

export async function readDataFile(filePath: string): Promise<ViewData> {
  try {
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      return {current_count: {}, failed_count: {}};
    }
    throw err;
  }
}
