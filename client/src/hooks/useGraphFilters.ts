'use client';

import {CURRENT_GENERATION} from '@constants/graph';
import type {FieldId, Generation} from '@type/Graph.type';
import {parseGraphFilters, serializeGraphFilters} from '@utils/graphFilters';
import type {GraphFilters} from '@utils/graphFilters';
import {useSearchParams} from 'next/navigation';
import {useCallback} from 'react';

export const useGraphFilters = () => {
  const searchParams = useSearchParams();
  const filters = parseGraphFilters(new URLSearchParams(searchParams.toString()));

  const updateFilters = useCallback((update: (current: GraphFilters) => GraphFilters) => {
    const url = new URL(window.location.href);
    const current = parseGraphFilters(url.searchParams);
    const next = serializeGraphFilters(update(current), url.searchParams);
    if (next.toString() === url.searchParams.toString()) return;

    url.search = next.toString();
    window.history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }, []);

  const toggleGeneration = useCallback(
    (generation: Generation) => {
      updateFilters(current => ({
        ...current,
        selectedGenerations: current.selectedGenerations.includes(generation)
          ? current.selectedGenerations.filter(value => value !== generation)
          : [...current.selectedGenerations, generation],
      }));
    },
    [updateFilters],
  );

  const toggleField = useCallback(
    (fieldId: FieldId) => {
      updateFilters(current => ({
        ...current,
        selectedFields: current.selectedFields.includes(fieldId)
          ? current.selectedFields.filter(value => value !== fieldId)
          : [...current.selectedFields, fieldId],
      }));
    },
    [updateFilters],
  );

  const resetFilters = useCallback(() => {
    updateFilters(() => ({selectedGenerations: [CURRENT_GENERATION], selectedFields: []}));
  }, [updateFilters]);

  return {...filters, toggleGeneration, toggleField, resetFilters};
};
