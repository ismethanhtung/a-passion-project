"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import { title } from "process";

interface Blog {
    id: number;
    title: string;
    content: string;
    authorId: number;
    published: boolean;
}

function UserPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [authorId, setAuthorId] = useState("");
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null); // Dữ liệu user đang chỉnh sửa
    const [showEditModal, setShowEditModal] = useState(false);

    const fetchBlogs = async () => {
        const response = await fetch("http://localhost:5000/blogs");
        const data: Blog[] = await response.json();
        setBlogs(data);
    };

    const addBlog = async () => {
        const response = await fetch("http://localhost:5000/blogs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content, authorId }),
        });

        if (response.ok) {
            fetchBlogs();
            setTitle("");
            setContent("");
            setAuthorId("");
        } else {
            alert("Không thể thêm blog.");
        }
    };

    const deleteBlog = async (id: number) => {
        const response = await fetch(`http://localhost:5000/Blogs/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            fetchBlogs();
        } else {
            alert("Không thể xóa blog.");
        }
    };

    const editBlog = (blog: Blog) => {
        setEditingBlog(blog);
        setTitle(blog.title);
        setContent(blog.content);
        setShowEditModal(true);
    };

    const updateBlog = async () => {
        if (editingBlog) {
            const response = await fetch(
                `http://localhost:5000/users/${editingBlog.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ title, content }),
                }
            );

            if (response.ok) {
                fetchBlogs();
                setEditingBlog(null);
                setShowEditModal(false);
                setTitle("");
                setContent("");
            } else {
                alert("Không thể cập nhật.");
            }
        }
    };

    const renderEditModal = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">Chỉnh Sửa Blog</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Tên"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>
                <button
                    onClick={updateBlog}
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
        fetchBlogs();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold">Quản lý Blog</h1>

            <div className="my-4">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2"
                />
                <input
                    type="text"
                    placeholder="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border p-2 ml-2"
                />
                <input
                    type="text"
                    placeholder="authorId"
                    value={authorId}
                    onChange={(e) => setAuthorId(e.target.value)}
                    className="border p-2 ml-2"
                />
                <button
                    onClick={addBlog}
                    className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
                >
                    Thêm Blog
                </button>
            </div>

            <div className="container">
                <DBTable
                    data={blogs}
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "title", label: "Title" },
                        { key: "content", label: "Content" },
                    ]}
                    onEdit={editBlog}
                    onDelete={deleteBlog}
                />
            </div>

            {showEditModal && renderEditModal()}
        </div>
    );
}

export default UserPage;
