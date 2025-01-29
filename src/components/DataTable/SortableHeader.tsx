import { ArrowDown, ArrowUp, ChevronDown, ChevronUp } from "lucide-react";

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
    <th
      className="px-4 py-2 text-left cursor-pointer"
      onClick={() => onSort(column)}
    >
      <div className="flex justify-between" >
        {label}
        <div className="flex items-center">
        {isSorted ? (
          sortDirection === "asc" ? (
            <>
            <ArrowUp className="w-4 h-4 ml-1" color="#000000" />
            <ArrowDown className="w-4 h-4 ml-1" color="#D3D3D3" />
            </>
          ) : (
            <>
            <ArrowDown className="w-4 h-4 ml-1" color="#000000" />
            <ArrowUp className="w-4 h-4 ml-1" color="#D3D3D3" />
            </>
          )
        ) : (
          <>
            <ArrowUp className="w-4 h-4 ml-1" color="#D3D3D3" />
            <ArrowDown className="w-4 h-4 ml-1" color="#D3D3D3" />
          </>
        )}

        </div>
      </div>
    </th>
  );
}
