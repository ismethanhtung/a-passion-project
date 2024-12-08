"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import Category from "@/interfaces/category";
import { fetchCategories, addCategory, deleteCategory } from "@/utils/category";

function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState<string>("");

    const getCategories = async () => {
        const response = await fetchCategories();
        setCategories(response);
    };

    const handleAddCategory = async () => {
        try {
            await addCategory(name);
            getCategories();
            setName("");
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        try {
            await deleteCategory(id);
            getCategories();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCategories();
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
                    onClick={handleAddCategory}
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
                    onDelete={handleDeleteCategory}
                />
            </div>
        </div>
    );
}

export default CategoryPage;
