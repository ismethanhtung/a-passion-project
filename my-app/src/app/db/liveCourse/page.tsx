"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import LiveCourse from "@/interfaces/liveCourse";
import {
    fetchLiveCourses,
    addLiveCourse,
    deleteLiveCourse,
    updateLiveCourse,
} from "@/utils/liveCourse";

function LiveCoursePage() {
    const [liveLiveCourses, setLiveCourses] = useState<LiveCourse[]>([]);

    const getLiveCourses = async () => {
        try {
            const response = await fetchLiveCourses();
            setLiveCourses(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddLiveCourse = async (newLiveCourse: Partial<LiveCourse>) => {
        try {
            await addLiveCourse(newLiveCourse);
            getLiveCourses();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteLiveCourse = async (id: number) => {
        try {
            await deleteLiveCourse(id);
            console.log(11);
            getLiveCourses();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateLiveCourse = async (updatedLiveCourse: LiveCourse) => {
        try {
            await updateLiveCourse(updatedLiveCourse.id, updatedLiveCourse);
            getLiveCourses();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getLiveCourses();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold py-8">LiveCourses management</h1>

            <div className="container">
                <DBTable
                    data={liveLiveCourses}
                    columns={[
                        { key: "id" },
                        { key: "title" },
                        { key: "description" },
                        { key: "instructorId" },
                        { key: "createdAt" },
                    ]}
                    onCreate={handleAddLiveCourse}
                    onUpdate={handleUpdateLiveCourse}
                    onDelete={handleDeleteLiveCourse}
                />
            </div>
        </div>
    );
}

export default LiveCoursePage;
