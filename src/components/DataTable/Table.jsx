import { SortableHeader } from "./SortableHeader";
import { Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDate } from "../../helper/date";



export function ReturnTable({
  items,
  sortColumn,
  sortDirection,
  onSort,
  onActionClick,
}) {
  const columns = [
    { key: "application_no", label: "No. Aplikasi" },
    { key: "application_date", label: "Tanggal Aplikasi" },
    { key: "customer_name", label: "Nama Customer" },
    { key: "return_request_form", label: "Process" },
    { key: "return_request_process", label: "Request Return" },
  ];

  const defaultSortColumn = "application_no";
  const [sortedItems, setSortedItems] = useState([]);
  const [currentSortColumn, setCurrentSortColumn] = useState("application_no");
  const [currentSortDirection, setCurrentSortDirection] = useState("asc")

  useEffect(() => {
    const activeSortColumn = currentSortColumn ?? defaultSortColumn;
  
    const sortedData = [...items].sort((a, b) => {
      const valueA = a[activeSortColumn]?.trim().toLowerCase() || "";
      const valueB = b[activeSortColumn]?.trim().toLowerCase() || "";
  
      return currentSortDirection === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
    });
    
    setSortedItems(sortedData);
  }, [items, currentSortColumn, currentSortDirection]);

  const handleSort = (column) => {
    setCurrentSortColumn(column);
    setCurrentSortDirection((prev) => (column === currentSortColumn && prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
          {columns.map((column) => (
          <SortableHeader
            key={column.key}
            column={column.key}
            label={column.label}
            sortColumn={currentSortColumn}
            sortDirection={currentSortDirection}
            onSort={handleSort}
          />
        ))}
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="uppercase">
          {sortedItems.length > 0 ? (
            sortedItems.map((item, index) => (
              <tr key={index} className="border-b hover:bg-[var(--hover-blue)] text-sm">
                <td className="px-4 py-2">{item.application_no}</td>
                <td className="px-4 py-2">{formatDate(item.application_date)}</td>
                <td className="px-4 py-2">{item.customer_name}</td>
                <td className="px-4 py-2">{item.return_request_form}</td>
                <td className="px-4 py-2">{item.return_request_process}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-[var(--primary-blue)] hover:text-[var(--accent-gold)]"
                    onClick={() => onActionClick(item.contract_no)}
                  >
                    <Edit2 className="w-4 h-4" fill="currentColor" strokeWidth={1} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-4 py-2 text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
