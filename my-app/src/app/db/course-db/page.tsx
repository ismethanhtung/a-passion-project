"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import Course from "@/interfaces/course";
import {
    fetchCourses,
    addCourse,
    deleteCourse,
    updateCourse,
} from "@/utils/courses";

function CoursePage() {
    const [courses, setCourses] = useState<Course[]>([]);

    const getCourses = async () => {
        try {
            const response = await fetchCourses();
            setCourses(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddCourse = async (newCourse: Partial<Course>) => {
        try {
            await addCourse(newCourse);
            getCourses();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteCourse = async (id: number) => {
        try {
            await deleteCourse(id);
            console.log(11);
            getCourses();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateCourse = async (updatedCourse: Course) => {
        try {
            await updateCourse(updatedCourse.id, updatedCourse);
            getCourses();
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
                    onCreate={handleAddCourse}
                    onUpdate={handleUpdateCourse}
                    onDelete={handleDeleteCourse}
                />
            </div>
        </div>
    );
}

export default CoursePage;
