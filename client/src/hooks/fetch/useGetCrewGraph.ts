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
  const isCurrentGeneration = data?.generationKey === generationKey;

  return {
    data: generationKey && isCurrentGeneration && !isLoading && !errorMessage ? data.crews : [],
    isLoading: Boolean(generationKey) && isLoading,
    errorMessage: generationKey ? errorMessage : null,
    refetch,
  };
};
