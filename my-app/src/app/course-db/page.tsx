"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";

interface Course {
    id: number;
    title: string;
    description: string;
    tag: string;
    teacherId: number;
}

function CoursePage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tag, setTag] = useState("");
    const [teacherId, setTeacherId] = useState("");

    const fetchCourses = async () => {
        const response = await fetch("http://localhost:5000/courses");
        const data: Course[] = await response.json();
        setCourses(data);
    };

    const addCourse = async () => {
        const response = await fetch("http://localhost:5000/courses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description, tag, teacherId }),
        });

        if (response.ok) {
            fetchCourses();
            setTitle("");
            setDescription("");
            setTag("");
            setTeacherId("");
        } else {
            alert("err");
        }
    };

    const deleteCourse = async (id: number) => {
        const response = await await fetch(
            `http://localhost:5000/courses/${id}`,
            {
                method: "DELETE",
            }
        );
        if (response.ok) fetchCourses();
        else alert("err");
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold">Quản lý Courses</h1>

            {/* Form thêm */}
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

            {/* Danh sách bài kiểm tra */}
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

export default CoursePage;
