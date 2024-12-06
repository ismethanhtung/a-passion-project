"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";

// Định nghĩa interface cho người dùng
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    roleId: number;
}

function UserPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [editingUser, setEditingUser] = useState<User | null>(null); // Dữ liệu user đang chỉnh sửa
    const [showEditModal, setShowEditModal] = useState(false);

    const fetchUsers = async () => {
        const response = await fetch("http://localhost:5000/users");
        const data: User[] = await response.json();
        setUsers(data);
    };

    // Xóa người dùng
    const deleteUser = async (id: number) => {
        const response = await fetch(`http://localhost:5000/users/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (response.ok) {
            fetchUsers();
        } else {
            alert("Không thể xóa người dùng.");
        }
    };

    // Bắt đầu chỉnh sửa
    const editUser = (user: User) => {
        setEditingUser(user);
        setName(user.name);
        setEmail(user.email);
        setShowEditModal(true);
    };

    // Cập nhật người dùng
    const updateUser = async () => {
        if (editingUser) {
            const response = await fetch(
                `http://localhost:5000/users/${editingUser.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email }),
                }
            );

            if (response.ok) {
                fetchUsers();
                setEditingUser(null);
                setShowEditModal(false);
                setName("");
                setEmail("");
            } else {
                alert("Không thể cập nhật người dùng.");
            }
        }
    };

    const renderEditModal = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">Chỉnh Sửa Người Dùng</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Tên"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>
                <button
                    onClick={updateUser}
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                    Cập nhật
                </button>
                <button
                    onClick={() => setShowEditModal(false)}
                    className="ml-2 bg-red-500 text-white px-4 py-1 rounded"
                >
                    Đóng
                </button>
            </div>
        </div>
    );

    // Gọi hàm khi trang được load
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold">User management</h1>

            {/* Danh sách người dùng */}
            <div className="container">
                <DBTable
                    data={users}
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "name", label: "Tên" },
                        { key: "email", label: "Email" },
                        { key: "password", label: "Password" },
                        { key: "roleId", label: "RoleId" },
                    ]}
                    onEdit={editUser}
                    onDelete={deleteUser}
                />
            </div>

            {showEditModal && renderEditModal()}
        </div>
    );
}

export default UserPage;
