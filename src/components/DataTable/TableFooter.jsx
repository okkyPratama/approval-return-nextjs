import React from "react";
import { Pagination } from "./Pagination";

export function TableFooter({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange,
  }) {
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
    const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);
  
    return (
      <div className="flex justify-between mt-4">
        <div>
          Showing {indexOfFirstItem} to {indexOfLastItem} of {totalItems} entries
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    );
  }