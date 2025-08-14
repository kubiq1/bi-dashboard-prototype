import { useMemo } from 'react';
import { mockProjects } from '@/lib/data';
import { Project, FilterState, SortDirection } from '@/lib/types';
import { filterProjects, sortProjects } from '@/lib/shared-utils';

interface UseProjectsOptions {
  filters: FilterState;
  sortField: string | null;
  sortDirection: SortDirection;
  currentPage: number;
  itemsPerPage: number;
}

export function useProjects({
  filters,
  sortField,
  sortDirection,
  currentPage,
  itemsPerPage
}: UseProjectsOptions) {
  // Memoize filtered and sorted projects
  const filteredAndSortedProjects = useMemo(() => {
    const filtered = filterProjects(mockProjects, filters);
    return sortField ? sortProjects(filtered, sortField, sortDirection) : filtered;
  }, [filters, sortField, sortDirection]);

  // Memoize pagination data
  const paginationData = useMemo(() => {
    const totalItems = filteredAndSortedProjects.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageProjects = filteredAndSortedProjects.slice(startIndex, endIndex);

    return {
      totalItems,
      totalPages,
      currentPageProjects,
      startIndex,
      endIndex
    };
  }, [filteredAndSortedProjects, currentPage, itemsPerPage]);

  return {
    allProjects: filteredAndSortedProjects,
    ...paginationData
  };
}
