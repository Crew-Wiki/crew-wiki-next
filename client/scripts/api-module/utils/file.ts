import fs from 'fs';
import path from 'path';

export const AUTO_GENERATED_BANNER = [
  '/**',
  ' * 이 파일은 api-module 제너레이터가 자동 생성한 파일입니다.',
  ' * 직접 수정하지 마세요. `yarn api:generate` 로 다시 생성됩니다.',
  ' */',
  '',
].join('\n');

export const writeFile = (filePath: string, contents: string) => {
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, contents.endsWith('\n') ? contents : `${contents}\n`, 'utf8');
};

/** 생성 결과물 디렉터리를 통째로 비운다 (수기 파일은 이 디렉터리 밖에 둘 것) */
export const cleanDirectory = (dirPath: string) => {
  fs.rmSync(dirPath, {recursive: true, force: true});
  fs.mkdirSync(dirPath, {recursive: true});
};

export const exists = (filePath: string) => fs.existsSync(filePath);

export const readJson = <T>(filePath: string): T => JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
