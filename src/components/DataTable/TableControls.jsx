import React from "react";

export function TableControls({ itemsPerPage,
    onItemsPerPageChange,
    searchTerm,
    onSearchChange,
}) {

    const handleItemsPerPageChange = (e) => {
      onItemsPerPageChange(Number(e.target.value));
    };

    return (
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <span className="mr-2">Show</span>
            <select
              className="border rounded px-2 py-1"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="ml-2">entries</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Search:</span>
            <input
              type="text"
              className="border-gray-400 border-b px-2 py-1 outline-none focus:ring-0 focus:border-gray-400"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      );
    
    
}