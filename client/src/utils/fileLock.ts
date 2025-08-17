import {open, unlink, readFile} from 'fs/promises';

export class FileLockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileLockError';
  }
}

export enum LockResult {
  SUCCESS = 'success',
  BUSY = 'busy',
  ZOMBIE_CLEANED = 'zombie',
  PERMISSION_ERROR = 'permission',
  UNKNOWN_ERROR = 'error',
}

export async function acquireLock(lockFilePath: string): Promise<LockResult> {
  try {
    const fileHandle = await open(lockFilePath, 'wx');
    await fileHandle.writeFile(String(process.pid));
    await fileHandle.close();
    return LockResult.SUCCESS;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'EEXIST') {
      // lock이 이미 존재하는 경우
      return handleExistingLock(lockFilePath);
    }
    if (err.code === 'EACCES') {
      // 권한이 없는 경우
      return LockResult.PERMISSION_ERROR;
    }
    return LockResult.UNKNOWN_ERROR;
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
  }
}

async function handleExistingLock(lockFilePath: string): Promise<LockResult> {
  let pidInLock: string;
  try {
    pidInLock = await readFile(lockFilePath, 'utf-8');
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      // lock 파일이 있어서 실행됐지만, 이 문장이 실행될 때 파일이 없는 경우 zombie_clean과 동일
      return LockResult.ZOMBIE_CLEANED;
    }
    if (err.code === 'EACCES') {
      return LockResult.PERMISSION_ERROR; // 읽을 권한이 없는 경우
    }
    return LockResult.UNKNOWN_ERROR;
  }

  try {
    process.kill(Number(pidInLock), 0); // 해당 pid의 프로세스가 살아있는지 체크
    return LockResult.BUSY;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ESRCH') {
      // 죽은 프로세스(zombie)
      await releaseLock(lockFilePath);
      return LockResult.ZOMBIE_CLEANED;
    }
    return LockResult.UNKNOWN_ERROR;
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function lock(lockFilePath: string, timeoutMs = 30000): Promise<void> {
  const startTime = Date.now();

  while (true) {
    const result = await acquireLock(lockFilePath);

    switch (result) {
      case LockResult.SUCCESS:
        return; // 성공했으면 loop 빠져나옴
      case LockResult.PERMISSION_ERROR:
        throw new FileLockError(`Permission error on lock file: ${lockFilePath}`);
      case LockResult.UNKNOWN_ERROR:
        throw new FileLockError(`Unknown error with lock file: ${lockFilePath}`);
      case LockResult.ZOMBIE_CLEANED:
      case LockResult.BUSY:
        break; // zombie clean 상황 or busy라면 delay를 하도록 유도
    }

    if (Date.now() - startTime > timeoutMs) {
      // 영원히 대기하는 상황을 탈출할 수 있도록 timeout 체크
      throw new FileLockError(`Lock acquisition timed out after ${timeoutMs}ms for: ${lockFilePath}`);
    }

    await delay(50);
  }
}

export async function release(lockFilePath: string): Promise<void> {
  return releaseLock(lockFilePath);
}

export async function withLock<T>(lockFilePath: string, callback: () => Promise<T>): Promise<T> {
  await lock(lockFilePath);
  try {
    return await callback();
  } finally {
    await release(lockFilePath);
  }
}
