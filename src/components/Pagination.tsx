import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];

        // Always show first page
        pageNumbers.push(1);

        // Calculate range around current page
        let rangeStart = Math.max(2, currentPage - 1);
        let rangeEnd = Math.min(totalPages - 1, currentPage + 1);

        // Adjust range to always show 3 pages if possible
        if (rangeEnd - rangeStart < 2 && totalPages > 4) {
            if (currentPage < totalPages / 2) {
                rangeEnd = Math.min(totalPages - 1, rangeStart + 2);
            } else {
                rangeStart = Math.max(2, rangeEnd - 2);
            }
        }

        // Add ellipsis before range if needed
        if (rangeStart > 2) {
            pageNumbers.push("ellipsis1");
        }

        // Add range pages
        for (let i = rangeStart; i <= rangeEnd; i++) {
            pageNumbers.push(i);
        }

        // Add ellipsis after range if needed
        if (rangeEnd < totalPages - 1) {
            pageNumbers.push("ellipsis2");
        }

        // Always show last page if there is more than one page
        if (totalPages > 1) {
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav
            className="flex justify-center items-center my-6"
            aria-label="Pagination"
        >
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                    aria-label="Previous page"
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="flex items-center space-x-1">
                    {pageNumbers.map((page, index) => {
                        if (page === "ellipsis1" || page === "ellipsis2") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="flex items-center justify-center w-10 h-10 text-gray-400"
                                >
                                    <MoreHorizontal size={18} />
                                </span>
                            );
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => onPageChange(page as number)}
                                className={`flex items-center justify-center w-10 h-10 rounded-md text-sm font-medium transition-colors ${
                                    currentPage === page
                                        ? "bg-indigo-600 text-white shadow-sm"
                                        : "bg-white border border-gray-200 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                }`}
                                aria-current={
                                    currentPage === page ? "page" : undefined
                                }
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                    aria-label="Next page"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </nav>
    );
};

export default Pagination;
