import type {CrewGraphResponse, GenerationCrewResponse} from '@apis/generated/types';
import {DOCUMENT_TYPE} from '@constants/document';
import {CREW_FIELD_TO_FIELD_ID, FIELD_ID} from '@constants/graph';
import type {Generation, GraphCrew} from '@type/Graph.type';
import {toGraphLabel} from '@utils/toGraphLabel';

interface GenerationGraphData {
  generation: Generation;
  crews: (Omit<GenerationCrewResponse, 'field'> & {field: GenerationCrewResponse['field'] | null})[];
  graph: CrewGraphResponse;
}

export const normalizeCrewGraph = (generations: GenerationGraphData[]): GraphCrew[] => {
  const crewsByUuid = new Map<string, GraphCrew>();

  generations.forEach(({generation, crews, graph}) => {
    const crewUuids = new Set(
      graph.nodes.filter(node => node.type === DOCUMENT_TYPE.Crew).map(node => node.documentUuid),
    );

    crews.forEach(crew => {
      if (!crewUuids.has(crew.documentUuid) || crewsByUuid.has(crew.documentUuid)) return;

      crewsByUuid.set(crew.documentUuid, {
        id: `crew:${crew.documentUuid}`,
        title: crew.name,
        label: toGraphLabel(crew.name),
        documentUuid: crew.documentUuid,
        documentType: DOCUMENT_TYPE.Crew,
        field: (crew.field && CREW_FIELD_TO_FIELD_ID[crew.field]) || FIELD_ID.Unassigned,
        generation,
      });
    });
  });

  return [...crewsByUuid.values()];
};
