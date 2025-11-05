"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;          // total number of filtered items
  pageSize?: number;           // optional – defaults to 10
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
}: PaginationProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Generate page numbers (max 5 visible, ellipsis when needed)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <nav
      aria-label="Table navigation"
      className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
    >
      {/* ---- Showing X-Y of Z ---- */}
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalItems === 0 ? 0 : start}-{end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalItems}
        </span>
      </span>

      {/* ---- Page buttons ---- */}
      <ul className="inline-flex items-stretch -space-x-px">
        {/* Prev */}
        <li>
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`
              flex items-center justify-center h-full py-1.5 px-3 ml-0 rounded-l-lg
              border border-gray-300
              ${currentPage === 1
                ? "text-gray-400 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700"
                : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
            aria-label="Previous"
          >
            <span className="material-symbols-outlined text-base">
              chevron_left
            </span>
          </button>
        </li>

        {/* Page numbers */}
        {getPageNumbers().map((page, idx) =>
          typeof page === "string" ? (
            <li key={`ellipsis-${idx}`} className="flex items-center px-3">
              <span className="text-gray-500 dark:text-gray-400">…</span>
            </li>
          ) : (
            <li key={page}>
              <button
                onClick={() => onPageChange(page)}
                className={`
                  flex items-center justify-center px-3 py-2 text-sm leading-tight
                  ${page === currentPage
                    ? "text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/30 hover:bg-[var(--primary)]/20 hover:text-[var(--primary)] dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  }`}
              >
                {page}
              </button>
            </li>
          )
        )}

        {/* Next */}
        <li>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`
              flex items-center justify-center h-full py-1.5 px-3 leading-tight rounded-r-lg
              border border-gray-300
              ${currentPage === totalPages
                ? "text-gray-400 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700"
                : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
            aria-label="Next"
          >
            <span className="material-symbols-outlined text-base">
              chevron_right
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
}