"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import Lesson from "@/interfaces/lesson";
import { fetchLessons, addLesson, deleteLesson, updateLesson } from "@/api/lesson";

function LessonPage() {
    const [lessons, setLessons] = useState<Lesson[]>([]);

    const getLessons = async () => {
        try {
            const response = await fetchLessons();
            setLessons(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCreateLesson = async (newLesson: Partial<Lesson>) => {
        try {
            await addLesson(newLesson);
            getLessons();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteLesson = async (id: number) => {
        try {
            await deleteLesson(id);
            getLessons();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateLesson = async (updatedLesson: Lesson) => {
        try {
            await updateLesson(updatedLesson.id, updatedLesson);
            getLessons();
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

            <div className="container">
                <DBTable
                    data={lessons}
                    columns={[
                        { key: "id" },
                        { key: "title" },
                        { key: "content" },
                        { key: "videoUrl" },
                        { key: "courseId" },
                    ]}
                    onCreate={handleCreateLesson}
                    onUpdate={handleUpdateLesson}
                    onDelete={handleDeleteLesson}
                />
            </div>
        </div>
    );
}

export default LessonPage;
