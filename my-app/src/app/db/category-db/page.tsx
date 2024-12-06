"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import Category from "@/interfaces/category";

function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState<string>("");

    const fetchCategories = async () => {
        const response = await fetch("http://localhost:5000/categories");
        const data: Category[] = await response.json();
        setCategories(data);
    };

    const addCategory = async () => {
        const response = await fetch("http://localhost:5000/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        });

        if (response.ok) {
            fetchCategories();
        } else {
            alert("err");
        }
    };

    const deleteCategory = async (id: number) => {
        const response = await await fetch(
            `http://localhost:5000/categories/${id}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );
        if (response.ok) fetchCategories();
        else alert("err");
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-8">Categories management</h1>
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2"
                />
                <button
                    onClick={addCategory}
                    className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
                >
                    Thêm Category
                </button>
            </div>
            <div className="container">
                <DBTable
                    data={categories}
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "name", label: "Name" },
                        { key: "parentId", label: "ParentId" },
                    ]}
                    onDelete={deleteCategory}
                />
            </div>
        </div>
    );
}

export default CategoryPage;
