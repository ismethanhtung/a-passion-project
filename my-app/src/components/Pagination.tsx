import React from "react";

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
    return (
        <div className="flex justify-center items-center mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-gray-500 bg-gray-200 rounded disabled:opacity-50"
            >
                Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i + 1}
                    onClick={() => onPageChange(i + 1)}
                    className={`px-3 py-1 text-sm ${
                        currentPage === i + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-600"
                    } rounded mx-1`}
                >
                    {i + 1}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm text-gray-500 bg-gray-200 rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
