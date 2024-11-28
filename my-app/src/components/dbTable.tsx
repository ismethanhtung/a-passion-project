import React from "react";

// Định nghĩa kiểu dữ liệu chung cho bảng
interface TableProps<T> {
    data: T[]; // Dữ liệu cần hiển thị (mảng các đối tượng)
    columns: { key: keyof T; label: string }[]; // Cấu hình cột (key và label)
    onEdit?: (row: T) => void; // Hàm callback cho sửa
    onDelete?: (id: number) => void; // Hàm callback cho xóa
}

// Component bảng tái sử dụng
function DBTable<T extends { [key: string]: any }>({
    data,
    columns,
    onEdit,
    onDelete,
}: TableProps<T>) {
    return (
        <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th
                            key={col.key as string}
                            className="border px-4 py-2"
                        >
                            {col.label}
                        </th>
                    ))}
                    {(onEdit || onDelete) && (
                        <th className="border px-4 py-2">Hành Động</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
                    <tr key={row.id}>
                        {columns.map((col) => (
                            <td
                                key={col.key as string}
                                className="border px-4 py-2"
                            >
                                {row[col.key]}
                            </td>
                        ))}
                        {(onEdit || onDelete) && (
                            <td className="border px-4 py-2">
                                {onEdit && (
                                    <button
                                        onClick={() => onEdit(row)}
                                        className="bg-green-500 text-white px-4 py-1 rounded mr-2"
                                    >
                                        Sửa
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={() => onDelete(row.id)}
                                        className="bg-red-500 text-white px-4 py-1 rounded"
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
    );
}

export default DBTable;
