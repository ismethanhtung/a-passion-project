"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import Enrollment from "@/interfaces/enrollment";
import {
    fetchEnrollments,
    addEnrollment,
    deleteEnrollment,
    updateEnrollment,
} from "@/utils/enrollment";

function EnrollmentPage() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

    const getEnrollments = async () => {
        try {
            const response = await fetchEnrollments();
            setEnrollments(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddEnrollment = async (newEnrollment: Partial<Enrollment>) => {
        try {
            await addEnrollment(newEnrollment);
            getEnrollments();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteEnrollment = async (id: number) => {
        try {
            await deleteEnrollment(id);
            console.log(11);
            getEnrollments();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateEnrollment = async (updatedEnrollment: Enrollment) => {
        try {
            await updateEnrollment(updatedEnrollment.id, updatedEnrollment);
            getEnrollments();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getEnrollments();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold py-8">Enrollments management</h1>

            <div className="container">
                <DBTable
                    data={enrollments}
                    columns={[
                        { key: "id" },
                        { key: "userId" },
                        { key: "courseId" },
                        { key: "enrolledAt" },
                    ]}
                    onCreate={handleAddEnrollment}
                    onUpdate={handleUpdateEnrollment}
                    onDelete={handleDeleteEnrollment}
                />
            </div>
        </div>
    );
}

export default EnrollmentPage;
