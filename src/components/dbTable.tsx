import React, { useState } from "react";
import Pagination from "./Pagination";
import CourseContextMenu from "./CourseContextMenu";

interface TableProps<T> {
    data: T[];
    columns: { key: keyof T }[];
    rowsPerPage?: number;
    onUpdate?: (updatedRow: T) => void;
    onDelete?: (id: number) => void;
    onCreate?: (newRow: Partial<T>) => void;
    onEditInForm?: (row: T) => void;
}

function DBTable<T extends { [key: string]: any }>({
    data,
    columns,
    rowsPerPage = 9,
    onUpdate,
    onDelete,
    onCreate,
    onEditInForm,
}: TableProps<T>) {
    const [editingRow, setEditingRow] = useState<T | null>(null);
    const [newRow, setNewRow] = useState<Partial<T>>({});
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);

    const handleEditClick = (row: T) => {
        setEditingRow(row);
    };

    const handleSaveClick = () => {
        if (editingRow && onUpdate) {
            onUpdate(editingRow);
            setEditingRow(null);
        }
    };

    const handleInputChange = (key: keyof T, value: any) => {
        if (editingRow) {
            setEditingRow({ ...editingRow, [key]: value });
        }
    };

    const handleInputChangeNewRow = (key: keyof T, value: any) => {
        setNewRow({ ...newRow, [key]: value });
    };

    const handleCreateClick = () => {
        if (onCreate) {
            onCreate(newRow);
            setNewRow({});
        }
    };

    const filteredData = data.filter((row) => {
        const matchesSearch = Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="mt-12">
            <div className="items-center justify-between">
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="border-2 border-gray-200 rounded-lg py-2 px-4 w-1/2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key as string}
                                    className="px-6 py-4"
                                >
                                    {String(col.key)}
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {columns.map((col) => (
                                <td
                                    key={col.key as string}
                                    className="px-6 py-2"
                                >
                                    <input
                                        className="border w-full py-1 text-gray-700"
                                        value={newRow[col.key] || ""}
                                        onChange={(e) =>
                                            handleInputChangeNewRow(
                                                col.key,
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                            ))}
                            <td className="px-6 py-4">
                                <button
                                    onClick={handleCreateClick}
                                    className="text-green-600 hover:underline"
                                >
                                    Thêm
                                </button>
                            </td>
                        </tr>
                        {paginatedData.map((row, index) => (
                            <tr
                                key={index}
                                className="bg-white hover:bg-gray-50"
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key as string}
                                        className="px-6 py-4 text-gray-700"
                                    >
                                        {editingRow &&
                                        editingRow.id === row.id ? (
                                            <input
                                                className="border w-full py-1 text-gray-700"
                                                value={editingRow[col.key]}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        col.key,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            row[col.key]
                                        )}
                                    </td>
                                ))}
                                <td className="flex items-center px-6 py-4 space-x-2">
                                    {editingRow && editingRow.id === row.id ? (
                                        <button
                                            onClick={handleSaveClick}
                                            className="text-green-600 hover:underline"
                                        >
                                            Xác nhận
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleEditClick(row)
                                                }
                                                className="text-blue-600 hover:underline"
                                            >
                                                Sửa nhanh
                                            </button>
                                            {onEditInForm && (
                                                <button
                                                    onClick={() =>
                                                        onEditInForm(row)
                                                    }
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Sửa đầy đủ
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    const jsonStr =
                                                        JSON.stringify(
                                                            row,
                                                            null,
                                                            2
                                                        );
                                                    const blob = new Blob(
                                                        [jsonStr],
                                                        {
                                                            type: "application/json",
                                                        }
                                                    );
                                                    const url =
                                                        URL.createObjectURL(
                                                            blob
                                                        );
                                                    const a =
                                                        document.createElement(
                                                            "a"
                                                        );
                                                    a.href = url;
                                                    a.download = `${
                                                        row.id || "data"
                                                    }.json`;
                                                    document.body.appendChild(
                                                        a
                                                    );
                                                    a.click();
                                                    document.body.removeChild(
                                                        a
                                                    );
                                                    URL.revokeObjectURL(url);
                                                }}
                                                className="text-green-600 hover:underline"
                                            >
                                                Xuất JSON
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => onDelete?.(row.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Xoá
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
}

export default DBTable;
