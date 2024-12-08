"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import Course from "@/interfaces/course";
import renderEditModal from "@/components/editModal";
import {
    fetchCourses,
    addCourse,
    deleteCourse,
    updateCourse,
} from "@/utils/courses";

function CoursePage() {
    const template = `{
    "title": "English Foundation Course: Grammar and Speaking Upgrade",
    "description": "Become fluent by improving all your English Skills. Build a strong English foundation in grammar, speaking, and more!",
    "objectives": "Learn in-demand skills from university and industry experts. Master a subject or tool with hands-on projects. Develop a deep understanding of key concepts. Earn a career certificate from Georgia Institute of Technology.",
    "price": 1000,
    "newPrice": 0,
    "thumbnail": "https://res.cloudinary.com/dzbifaqwo/image/upload/v1732779661/samples/dessert-on-a-plate.jpg",
    "categoryId": 2,
    "creatorId": 1,
    "teacherId": 1
}`;
    const [courses, setCourses] = useState<Course[]>([]);
    const [jsonInput, setJsonInput] = useState(template);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const getCourses = async () => {
        try {
            const response = await fetchCourses();
            setCourses(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddCourse = async () => {
        try {
            const parsedInput = JSON.parse(jsonInput);
            await addCourse(parsedInput);

            fetchCourses();
            setJsonInput(template);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteCourse = async (id: number) => {
        try {
            await deleteCourse(id);
            getCourses();
        } catch (error) {
            console.log(error);
        }
    };

    const editCourse = (course: Course) => {
        setEditingCourse(course);
        setJsonInput(JSON.stringify(course, null, 2));
        setShowEditModal(true);
    };

    const handleUpdateCourse = async () => {
        try {
            const parsedInput = JSON.parse(jsonInput);

            if (editingCourse) {
                const response = await updateCourse(
                    parsedInput,
                    editingCourse.id
                );

                getCourses();
                setEditingCourse(null);
                setShowEditModal(false);
                setJsonInput(template);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCourses();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold py-8">Courses management</h1>

            <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="border w-full p-2 h-32"
            ></textarea>
            <div className="my-4">
                <button
                    onClick={handleAddCourse}
                    className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
                >
                    Thêm Course
                </button>
            </div>

            <div className="container">
                <DBTable
                    data={courses}
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "title", label: "Title" },
                        { key: "description", label: "Description" },
                        { key: "price", label: "Price" },
                        { key: "newPrice", label: "New Price" },
                        { key: "teacherId", label: "TeacherId" },
                        { key: "creatorId", label: "CreatorId" },
                        { key: "categoryId", label: "CategoryId" },
                    ]}
                    onEdit={editCourse}
                    onDelete={handleDeleteCourse}
                />
            </div>

            {showEditModal &&
                renderEditModal(
                    jsonInput,
                    setJsonInput,
                    handleUpdateCourse,
                    setShowEditModal
                )}
        </div>
    );
}

export default CoursePage;
