interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
      <div className="flex">
        <button
          className={`px-3 py-1 border rounded mr-1 ${
            currentPage === 1
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-[var(--primary-blue)] text-white"
          }`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-3 py-1 border rounded mr-1 ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  }