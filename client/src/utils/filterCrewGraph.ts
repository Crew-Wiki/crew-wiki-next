import {GRAPH_FIELDS} from '@constants/graph';
import type {GraphCrew, GraphField} from '@type/Graph.type';
import type {GraphFilters} from '@utils/graphFilters';

export const filterCrewGraph = (crews: GraphCrew[], {selectedGenerations, selectedFields}: GraphFilters) => {
  const generationCrews = crews.filter(crew => selectedGenerations.includes(crew.generation));
  const visibleCrews = generationCrews.filter(
    crew => selectedFields.length === 0 || selectedFields.includes(crew.field),
  );

  const fields: GraphField[] = GRAPH_FIELDS.map(field => ({
    ...field,
    crewCount: generationCrews.filter(crew => crew.field === field.id).length,
    isSelected: selectedFields.includes(field.id),
  })).filter(field => field.crewCount > 0);

  return {crews: visibleCrews, fields};
};
