"use client";
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
    const [title, setTitle] = useState("");
    const [creatorId, setCreatorId] = useState("");
    const [description, setDescription] = useState("");
    const [editingTest, setEditingTest] = useState<Test | null>(null); // Dữ liệu bài kiểm tra đang chỉnh sửa
    const [showEditModal, setShowEditModal] = useState(false);

    const fetchTests = async () => {
        const response = await fetch("http://localhost:5000/tests");
        const data: Test[] = await response.json();
        setTests(data);
    };

    const addTest = async () => {
        const response = await fetch("http://localhost:5000/tests", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description, creatorId }),
        });

        if (response.ok) {
            fetchTests();
            setTitle("");
            setDescription("");
        } else {
            alert("Không thể thêm bài kiểm tra.");
        }
    };

    const deleteTest = async (id: number) => {
        const response = await fetch(`http://localhost:5000/tests/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            fetchTests();
        } else {
            alert("Không thể xóa bài kiểm tra.");
        }
    };

    const editTest = (test: Test) => {
        setEditingTest(test);
        setTitle(test.title);
        setDescription(test.description);
        setShowEditModal(true);
    };

    const updateTest = async () => {
        if (editingTest) {
            const response = await fetch(
                `http://localhost:5000/tests/${editingTest.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ title, description }),
                }
            );

            if (response.ok) {
                fetchTests();
                setEditingTest(null);
                setShowEditModal(false);
                setTitle("");
                setDescription("");
            } else {
                alert("Không thể cập nhật bài kiểm tra.");
            }
        }
    };

    const renderEditModal = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">
                    Chỉnh Sửa Bài Kiểm Tra
                </h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Tiêu đề"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <textarea
                        placeholder="Mô tả"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border p-2 w-full"
                    ></textarea>
                </div>
                <button
                    onClick={updateTest}
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

    useEffect(() => {
        fetchTests();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold">Quản lý Bài Kiểm Tra</h1>

            <div className="my-4">
                <input
                    type="text"
                    placeholder="Tiêu đề"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2"
                />

                <textarea
                    placeholder="Mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 ml-2"
                ></textarea>
                <input
                    type="text"
                    placeholder="creatorId"
                    value={creatorId}
                    onChange={(e) => setCreatorId(e.target.value)}
                    className="border p-2"
                />
                <button
                    onClick={addTest}
                    className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
                >
                    Thêm Bài Kiểm Tra
                </button>
            </div>

            <div className="container">
                <DBTable
                    data={tests}
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "title", label: "Tiêu đề" },
                        { key: "description", label: "Mô tả" },
                    ]}
                    onEdit={editTest}
                    onDelete={deleteTest}
                />
            </div>

            {showEditModal && renderEditModal()}
        </div>
    );
}

export default TestPage;
