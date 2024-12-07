"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import Lesson from "@/interfaces/lesson";
import renderEditModal from "@/components/editModal";

function LessonPage() {
    const template = `{
    "title": "Lesson for Course ",
    "content": "Learn the basics of JavaScript programming.",
    "videoUrl": "https://www.youtube.com/watch?v=pxyqABze27A&list=RDpxyqABze27A&start_radio=1",
    "courseId": 
    }`;
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [jsonInput, setJsonInput] = useState(template);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const fetchLessons = async () => {
        const response = await fetch("http://localhost:5000/lessons");
        const data: Lesson[] = await response.json();
        setLessons(data);
    };

    const addLesson = async () => {
        const parsedInput = JSON.parse(jsonInput);
        const response = await fetch("http://localhost:5000/lessons", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parsedInput),
        });

        if (response.ok) {
            fetchLessons();
            setJsonInput(template);
        } else {
            alert("err");
        }
    };

    const deleteLesson = async (id: number) => {
        const response = await await fetch(
            `http://localhost:5000/lessons/${id}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );
        if (response.ok) fetchLessons();
        else alert("err");
    };

    const editLesson = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setShowEditModal(true);
    };

    const updateLesson = async () => {
        try {
            const parsedInput = JSON.parse(jsonInput);

            if (editingLesson) {
                const response = await fetch(
                    `http://localhost:5000/lessons/${editingLesson.id}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(parsedInput),
                        credentials: "include",
                    }
                );

                if (response.ok) {
                    fetchLessons();
                    setEditingLesson(null);
                    setShowEditModal(false);
                    setJsonInput(template);
                } else {
                    alert("Không thể cập nhật.");
                }
            }
        } catch (error) {
            alert("Dữ liệu JSON không hợp lệ.");
        }
    };

    useEffect(() => {
        fetchLessons();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold">Quản lý Lessons</h1>

            <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="border w-full p-2 h-32"
            ></textarea>
            <div className="my-4">
                <button
                    onClick={addLesson}
                    className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
                >
                    Thêm Course
                </button>
            </div>

            <div className="container">
                <DBTable
                    data={lessons}
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "title", label: "Tiêu đề" },
                        { key: "content", label: "Content" },
                        { key: "videoUrl", label: "video" },
                        { key: "courseId", label: "CourseId" },
                    ]}
                    onEdit={editLesson}
                    onDelete={deleteLesson}
                />
            </div>

            {showEditModal &&
                renderEditModal(
                    jsonInput,
                    setJsonInput,
                    updateLesson,
                    setShowEditModal
                )}
        </div>
    );
}

export default LessonPage;
