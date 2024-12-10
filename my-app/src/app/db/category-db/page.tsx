"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import Category from "@/interfaces/category";
import {
    fetchCategories,
    addCategory,
    deleteCategory,
    updateCategory,
} from "@/utils/category";

function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);

    const getCategories = async () => {
        const response = await fetchCategories();
        setCategories(response);
    };

    const handleAddCategory = async (newCategory: Partial<Category>) => {
        try {
            await addCategory(newCategory);
            getCategories();
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

    const handleUpdateCategory = async (updatedCategory: Category) => {
        try {
            await updateCategory(updatedCategory.id, updatedCategory);
            getCategories();
        } catch (error) {
            alert("Dữ liệu JSON không hợp lệ.");
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-8">Categories management</h1>

            <div className="container">
                <DBTable
                    data={categories}
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "name", label: "Name" },
                        { key: "parentId", label: "ParentId" },
                    ]}
                    onCreate={handleAddCategory}
                    onUpdate={handleUpdateCategory}
                    onDelete={handleDeleteCategory}
                />
            </div>
        </div>
    );
}

export default CategoryPage;
