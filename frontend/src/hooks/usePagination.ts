import { useState, useCallback } from "react";

export interface PaginationState {
  currentPage: number;
  pageSize: number;
}

export interface PaginationHandlers {
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (newPageSize: number) => void;
  resetPagination: () => void;
}

export interface UsePaginationReturn
  extends PaginationState,
    PaginationHandlers {
  skip: number;
}

export const usePagination = (
  initialPageSize: number = 10
): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const skip = (currentPage - 1) * pageSize;

  return {
    currentPage,
    pageSize,
    skip,
    handlePageChange,
    handlePageSizeChange,
    resetPagination,
  };
};
