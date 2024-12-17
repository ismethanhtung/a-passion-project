"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import User from "@/interfaces/user";
import { fetchUsers, deleteUser, updateUser } from "@/utils/user";

function UserPage() {
    const [users, setUsers] = useState<User[]>([]);

    const loadUsers = async () => {
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            await deleteUser(id);
            loadUsers();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateUser = async (updatedUser: User) => {
        try {
            await updateUser(updatedUser.id, updatedUser);
            loadUsers();
        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error);
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
                        roleName: JSON.stringify(user.role),
                    }))}
                    columns={[
                        { key: "id" },
                        { key: "name" },
                        { key: "email" },
                        { key: "roleName" },
                        { key: "isDeleted" },
                    ]}
                    onUpdate={handleUpdateUser}
                    onDelete={handleDeleteUser}
                />
            </div>
        </div>
    );
}

export default UserPage;
