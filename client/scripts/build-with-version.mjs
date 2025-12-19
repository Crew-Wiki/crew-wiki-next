import {execSync} from 'child_process';
import path from 'path';
import {fileURLToPath} from 'url';
import pkg from '../package.json' assert {type: 'json'};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const version = pkg.version;

if (!version) {
  console.error('❌ package.json version을 찾을 수 없습니다.');
  process.exit(1);
}

console.log(`🛠️  Build with version: ${version}`);

execSync(
  process.platform === 'win32' ? 'node node_modules/next/dist/bin/next build' : 'node ./node_modules/.bin/next build',
  {
    stdio: 'inherit',
    cwd: ROOT,
    env: {
      ...process.env,
      NEXT_PUBLIC_APP_VERSION: version,
    },
  },
);
