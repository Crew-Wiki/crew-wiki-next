import path from 'path';
import {generatorConfig} from './generator.config.ts';
import {buildTree, topLevelNodes} from './generator/buildTree.ts';
import {generateClientIndex, generateClientResource} from './generator/generateClient.ts';
import {generateOperations} from './generator/generateOperations.ts';
import {generateRuntimeConfig} from './generator/generateRuntimeConfig.ts';
import {generateServerIndex, generateServerResource} from './generator/generateServer.ts';
import {generateTypes} from './generator/generateTypes.ts';
import type {OpenApiDocument} from './model/openapi.ts';
import {parseOpenApi} from './parser/parseOpenApi.ts';
import {cleanDirectory, exists, readJson, writeFile} from './utils/file.ts';

// client/scripts/api-module -> client
const projectRoot = path.resolve(import.meta.dirname, '../..');
const resolve = (relativePath: string) => path.join(projectRoot, relativePath);

const main = () => {
  const config = generatorConfig;
  const inputPath = resolve(config.input);

  if (!exists(inputPath)) throw new Error(`OpenAPI 문서를 찾을 수 없습니다: ${inputPath}`);

  const document = readJson<OpenApiDocument>(inputPath);
  const model = parseOpenApi(document, config);

  const outputDir = resolve(config.outputDir);
  cleanDirectory(outputDir);

  writeFile(path.join(outputDir, 'types.ts'), generateTypes(model, config));
  writeFile(path.join(outputDir, 'operations.ts'), generateOperations(model, './types'));

  const knownTypes = new Set(Object.keys(model.schemas));

  if (config.emitServer) {
    const endpoints = model.endpoints.filter(endpoint => !config.excludeFromServer.includes(endpoint.key));
    const nodes = topLevelNodes(buildTree(endpoints, model.warnings));

    for (const node of nodes) {
      writeFile(path.join(outputDir, 'server', `${node.key}.ts`), generateServerResource(node, knownTypes, config));
    }
    writeFile(path.join(outputDir, 'server', 'index.ts'), generateServerIndex(nodes));
  }

  if (config.emitClient) {
    const endpoints = model.endpoints.filter(endpoint => !config.excludeFromClient.includes(endpoint.key));
    const nodes = topLevelNodes(buildTree(endpoints, model.warnings));

    for (const node of nodes) {
      writeFile(path.join(outputDir, 'client', `${node.key}.ts`), generateClientResource(node, knownTypes, config));
    }
    writeFile(path.join(outputDir, 'client', 'index.ts'), generateClientIndex(nodes));
  }

  // 수기 관리 파일이라 없을 때만 스캐폴딩한다 (있으면 조용히 넘어감)
  const runtimeConfigPath = resolve(config.runtimeConfigPath);
  if (!exists(runtimeConfigPath)) {
    writeFile(runtimeConfigPath, generateRuntimeConfig(config));
    console.log(`+ ${config.runtimeConfigPath} 를 생성했습니다`);
  }

  console.log(
    `✓ 엔드포인트 ${model.endpoints.length}개 / 타입 ${Object.keys(model.schemas).length}개 를 ` +
      `${config.outputDir} 에 생성했습니다`,
  );

  for (const warning of [...new Set(model.warnings)]) {
    console.warn(`⚠ ${warning}`);
  }
};

main();
