"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import renderEditModal from "@/components/editModal";
import User from "@/interfaces/user";

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

    const fetchUsers = async () => {
        const response = await fetch("http://localhost:5000/users");
        const data: User[] = await response.json();
        setUsers(data);
    };

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

    const editUser = (user: User) => {
        setEditingUser(user);
        setJsonInput(JSON.stringify(user, null, 2));
        setShowEditModal(true);
    };

    const updateUser = async () => {
        if (editingUser) {
            const parsedInput = JSON.parse(jsonInput);

            const response = await fetch(
                `http://localhost:5000/users/${editingUser.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(parsedInput),
                    credentials: "include",
                }
            );

            if (response.ok) {
                fetchUsers();
                setEditingUser(null);
                setShowEditModal(false);
                setJsonInput(template);
            } else {
                alert("Không thể cập nhật người dùng.");
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold">User management</h1>

            <div className="container">
                <DBTable
                    data={users}
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "name", label: "Tên" },
                        { key: "email", label: "Email" },
                        // { key: "password", label: "Password" },
                        { key: "roleId", label: "RoleId" },
                    ]}
                    onEdit={editUser}
                    onDelete={deleteUser}
                />
            </div>

            {showEditModal &&
                renderEditModal(
                    jsonInput,
                    setJsonInput,
                    updateUser,
                    setShowEditModal
                )}
        </div>
    );
}

export default UserPage;
