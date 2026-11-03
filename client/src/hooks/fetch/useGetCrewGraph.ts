'use client';

import {api} from '@apis/generated/client';
import {GENERATIONS} from '@constants/graph';
import {useFetch} from '@hooks/useFetch';
import type {Generation} from '@type/Graph.type';
import {normalizeCrewGraph} from '@utils/normalizeCrewGraph';
import {useCallback} from 'react';

export const useGetCrewGraph = (generations: readonly Generation[]) => {
  const generationKey = GENERATIONS.filter(generation => generations.includes(generation)).join(',');

  const getData = useCallback(async () => {
    const selectedGenerations = GENERATIONS.filter(generation => generationKey.split(',').includes(generation));
    const results = await Promise.all(
      selectedGenerations.map(async generation => {
        const [crews, graph] = await Promise.all([api.document.crews.get({generation}), api.graph.get({generation})]);

        return {generation, crews, graph};
      }),
    );

    return {generationKey, crews: normalizeCrewGraph(results)};
  }, [generationKey]);

  const {data, isLoading, errorMessage, refetch} = useFetch(getData, {enabled: Boolean(generationKey)});

  return {
    data: data?.crews ?? [],
    dataGenerations: GENERATIONS.filter(generation => data?.generationKey.split(',').includes(generation)),
    isInitialLoading: Boolean(generationKey) && data === null && (isLoading || !errorMessage),
    errorMessage: generationKey && !isLoading ? errorMessage : null,
    refetch,
  };
};
