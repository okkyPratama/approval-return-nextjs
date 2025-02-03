import { ArrowDown, ArrowUp } from "lucide-react";

interface SortableHeaderProps<T> {
  column: keyof T;
  label: string;
  sortColumn: keyof T | null;
  sortDirection: "asc" | "desc";
  onSort: (column: keyof T) => void;
}

export function SortableHeader<T>({
  column,
  label,
  sortColumn,
  sortDirection,
  onSort,
}: SortableHeaderProps<T>) {
  const isSorted = sortColumn === column;

  return (
    <th className="px-4 py-2 text-left cursor-pointer" onClick={() => onSort(column)}>
      <div className="flex justify-between items-center">
        {label}
        <div className="flex items-center ml-2">
          <ArrowUp
            className={`w-4 h-4 ml-1 ${isSorted && sortDirection === "asc" ? "text-black font-bold" : "text-gray-400"}`}
          />
          <ArrowDown
            className={`w-4 h-4 ml-1 ${isSorted && sortDirection === "desc" ? "text-black font-bold" : "text-gray-400"}`}
          />
        </div>
      </div>
    </th>
  );
}
