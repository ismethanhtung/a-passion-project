import React, { useState } from "react";

interface TableProps<T> {
    data: T[];
    columns: { key: keyof T; label: string }[];
    onEdit?: (row: T) => void;
    onDelete?: (id: number) => void;
}

function DBTable<T extends { [key: string]: any }>({
    data,
    columns,
    onEdit,
    onDelete,
}: TableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 15;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(data.length / rowsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key as string} className="px-6 py-4">
                                {col.label}
                            </th>
                        ))}
                        {(onEdit || onDelete) && (
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((row, index) => (
                        <tr key={index} className="bg-white hover:bg-gray-50">
                            {columns.map((col) => (
                                <td
                                    key={col.key as string}
                                    className="px-6 py-4 text-gray-700 truncate max-w-[200px] overflow-hidden"
                                >
                                    {row[col.key]}
                                </td>
                            ))}
                            {(onEdit || onDelete) && (
                                <td className="flex items-center px-6 py-4">
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(row)}
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            Sửa
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(row.id)}
                                            className="font-medium text-red-600 hover:underline ml-3"
                                        >
                                            Xoá
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
                <span className="text-sm text-gray-600">
                    Trang {currentPage} / {totalPages}
                </span>
                <div className="flex space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm text-gray-500 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 text-sm ${
                                currentPage === i + 1
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-500 bg-gray-200"
                            } rounded`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm text-gray-500 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DBTable;
