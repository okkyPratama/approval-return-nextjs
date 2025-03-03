import { useCallback, useMemo, useState } from "react";

export function usePagination(data, itemsPerPage) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / itemsPerPage);
  
    const currentItems = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      return data.slice(start, start + itemsPerPage);
    }, [data, currentPage, itemsPerPage]);
  
    const handlePageChange = useCallback((page) => {
      setCurrentPage(page);
    }, []);
    return {
      currentItems,
      currentPage,
      totalPages,
      handlePageChange
    };
  }