import { useCallback, useMemo, useState } from "react";

export function useTableSort(
    data, 
    initialSortColumn, 
    initialDirection
  ) {
    const [sortColumn, setSortColumn] = useState(initialSortColumn);
    const [sortDirection, setSortDirection] = useState(initialDirection);
  
    const handleSort = useCallback((column) => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortColumn(column);
        setSortDirection('asc');
      }
    }, [sortColumn, sortDirection]);
  
    const sortedData = useMemo(() => {
      if (!sortColumn) return [...data];
      
      return [...data].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }, [data, sortColumn, sortDirection]);
  
    return {
      sortedData,
      sortColumn,
      sortDirection,
      handleSort
    };
  }