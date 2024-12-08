"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import Lesson from "@/interfaces/lesson";
import renderEditModal from "@/components/editModal";
import {
    fetchLessons,
    addLesson,
    deleteLesson,
    updateLesson,
} from "@/utils/lesson";

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

    const getLessons = async () => {
        try {
            const response = await fetchLessons();
            setLessons(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddLesson = async () => {
        try {
            const parsedInput = JSON.parse(jsonInput);
            await addLesson(parsedInput);

            getLessons();
            setJsonInput(template);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteLesson = async (id: number) => {
        try {
            await deleteLesson(id);
            fetchLessons();
        } catch (error) {
            console.log(error);
        }
    };

    const editLesson = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setShowEditModal(true);
    };

    const handleUpdateLesson = async () => {
        try {
            const parsedInput = JSON.parse(jsonInput);

            if (editingLesson) {
                const response = await updateLesson(
                    parsedInput,
                    editingLesson.id
                );

                getLessons();
                setEditingLesson(null);
                setShowEditModal(false);
                setJsonInput(template);
            }
        } catch (error) {
            alert("Dữ liệu JSON không hợp lệ.");
        }
    };

    useEffect(() => {
        getLessons();
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
                    onClick={handleAddLesson}
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
                    onDelete={handleDeleteLesson}
                />
            </div>

            {showEditModal &&
                renderEditModal(
                    jsonInput,
                    setJsonInput,
                    handleUpdateLesson,
                    setShowEditModal
                )}
        </div>
    );
}

export default LessonPage;
