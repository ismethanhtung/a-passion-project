"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";

interface Test {
    id: number;
    title: string;
    description: string;
    creatorId: number;
    createdAt: string;
    updatedAt: string;
}

function TestPage() {
    const [tests, setTests] = useState<Test[]>([]);

    const fetchTests = async () => {
        const response = await fetch(`${API_BASE_URL}/tests`);
        const data: Test[] = await response.json();
        setTests(data);
    };

    const addTest = async () => {
        const response = await fetch(`${API_BASE_URL}/tests`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // body: JSON.stringify({ title, description, creatorId }),
        });

        if (response.ok) {
            fetchTests();
        } else {
            alert("Không thể thêm bài kiểm tra.");
        }
    };

    const deleteTest = async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/tests/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            fetchTests();
        } else {
            alert("Không thể xóa bài kiểm tra.");
        }
    };

    const updateTest = async () => {};

    useEffect(() => {
        fetchTests();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold">Quản lý Bài Kiểm Tra</h1>

            <div className="container">
                <DBTable
                    data={tests}
                    columns={[
                        { key: "id" },
                        { key: "title" },
                        { key: "description" },
                        { key: "creatorId" },
                    ]}
                    onDelete={deleteTest}
                />
            </div>
        </div>
    );
}

export default TestPage;
