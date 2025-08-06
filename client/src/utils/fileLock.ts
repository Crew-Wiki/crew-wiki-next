import {open, unlink, readFile} from 'fs/promises';

export async function acquireLock(lockFilePath: string): Promise<boolean> {
  try {
    const fileHandle = await open(lockFilePath, 'wx');
    await fileHandle.writeFile(String(process.pid));
    await fileHandle.close();
    return true;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'EEXIST') {
      return await handleExistingLock(lockFilePath);
    }
    throw error;
  }
}

export async function releaseLock(lockFilePath: string): Promise<void> {
  try {
    await unlink(lockFilePath);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      return;
    }
    throw error;
  }
}

async function handleExistingLock(lockFilePath: string): Promise<boolean> {
  try {
    const pidInLock = await readFile(lockFilePath, 'utf-8');
    process.kill(Number(pidInLock), 0);
    return false;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ESRCH') {
      await releaseLock(lockFilePath);
      return await acquireLock(lockFilePath);
    }
    return false;
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function lock(lockFilePath: string): Promise<void> {
  while (!(await acquireLock(lockFilePath))) {
    await delay(50);
  }
}

export async function release(lockFilePath: string): Promise<void> {
  return await releaseLock(lockFilePath);
}

export async function withLock<T>(lockFilePath: string, callback: () => Promise<T>): Promise<T> {
  await lock(lockFilePath);
  try {
    return await callback();
  } finally {
    await release(lockFilePath);
  }
}
