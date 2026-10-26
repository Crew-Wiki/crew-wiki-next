import {CURRENT_GENERATION, GENERATIONS, GRAPH_FIELDS} from '@constants/graph';
import type {FieldId, Generation} from '@type/Graph.type';

export interface GraphFilters {
  selectedGenerations: Generation[];
  selectedFields: FieldId[];
}

export const parseGraphFilters = (searchParams: URLSearchParams): GraphFilters => {
  const generations = searchParams.getAll('generations').flatMap(value => value.split(','));
  const fields = searchParams.getAll('fields').flatMap(value => value.split(','));

  return {
    selectedGenerations: searchParams.has('generations')
      ? GENERATIONS.filter(generation => generations.includes(generation))
      : [CURRENT_GENERATION],
    selectedFields: GRAPH_FIELDS.filter(field => fields.includes(field.id)).map(field => field.id),
  };
};

export const serializeGraphFilters = (filters: GraphFilters, searchParams = new URLSearchParams()): URLSearchParams => {
  const result = new URLSearchParams(searchParams);
  const generations = GENERATIONS.filter(generation => filters.selectedGenerations.includes(generation));
  const fields = GRAPH_FIELDS.filter(field => filters.selectedFields.includes(field.id)).map(field => field.id);

  result.delete('generations');
  result.delete('fields');

  if (generations.length !== 1 || generations[0] !== CURRENT_GENERATION) {
    result.set('generations', generations.join(','));
  }
  if (fields.length > 0) {
    result.set('fields', fields.join(','));
  }

  return result;
};
