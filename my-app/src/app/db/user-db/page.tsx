"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import renderEditModal from "@/components/editModal";
import User from "@/interfaces/user";
import { fetchUsers, deleteUser, updateUser } from "@/utils/user";

function UserPage() {
    const template = `{
        "name": "",
        "email": "",
        "role": ""
    }`;
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [jsonInput, setJsonInput] = useState(template);

    const loadUsers = async () => {
        const data = await fetchUsers();
        setUsers(data);
    };

    const handleDeleteUser = async (id: number) => {
        try {
            await deleteUser(id);
            loadUsers();
        } catch (error) {
            console.log(error);
        }
    };

    const editUser = (user: User) => {
        setEditingUser(user);
        setJsonInput(JSON.stringify(user, null, 2));
        setShowEditModal(true);
    };

    const handleUpdateUser = async () => {
        try {
            if (editingUser) {
                const parsedInput = JSON.parse(jsonInput);
                await updateUser(editingUser.id, parsedInput);
                loadUsers();
                setEditingUser(null);
                setShowEditModal(false);
                setJsonInput(template);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error);
            alert(error || "Không thể cập nhật người dùng.");
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold">User management</h1>

            <div className="container">
                <DBTable
                    data={users.map((user) => ({
                        ...user,
                        roleName: user.role ? user.role.name : "",
                    }))}
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "name", label: "Tên" },
                        { key: "email", label: "Email" },
                        // { key: "password", label: "Password" },
                        { key: "roleName", label: "Role" },
                    ]}
                    onEdit={editUser}
                    onDelete={handleDeleteUser}
                />
            </div>

            {showEditModal &&
                renderEditModal(
                    jsonInput,
                    setJsonInput,
                    handleUpdateUser,
                    setShowEditModal
                )}
        </div>
    );
}

export default UserPage;
