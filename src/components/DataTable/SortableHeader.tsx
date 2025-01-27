import { ChevronDown, ChevronUp } from "lucide-react";

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
    onSort 
  }: SortableHeaderProps<T>) {
    return (
      <th className="px-4 py-2 text-left cursor-pointer" onClick={() => onSort(column)}>
        <div className="flex items-center">
          {label}
          {sortColumn === column && (
            sortDirection === "asc" ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )
          )}
        </div>
      </th>
    );
  }