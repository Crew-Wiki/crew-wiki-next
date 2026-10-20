import type {ApiModel} from '../model/endpoint.ts';
import {declareInterface} from '../parser/convertType.ts';
import {AUTO_GENERATED_BANNER} from '../utils/file.ts';

export interface GenerateTypesOptions {
  treatPropertiesAsRequired: boolean;
}

export const generateTypes = (model: ApiModel, options: GenerateTypesOptions): string => {
  const declarations = Object.entries(model.schemas)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, schema]) =>
      declareInterface(name, schema, {treatPropertiesAsRequired: options.treatPropertiesAsRequired}),
    );

  return `${AUTO_GENERATED_BANNER}\n${declarations.join('\n')}`;
};
