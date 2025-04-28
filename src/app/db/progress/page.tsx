"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import Progress from "@/interfaces/progress";
import { fetchProgress, addProgress, deleteProgress, updateProgress } from "@/api/progress";

function ProgressPage() {
    const [progresss, setProgresss] = useState<Progress[]>([]);

    const getProgresss = async () => {
        try {
            const response = await fetchProgress();
            setProgresss(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddProgress = async (newProgress: Partial<Progress>) => {
        try {
            await addProgress(newProgress);
            getProgresss();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteProgress = async (id: number) => {
        try {
            await deleteProgress(id);
            console.log(11);
            getProgresss();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateProgress = async (updatedProgress: Progress) => {
        try {
            await updateProgress(updatedProgress.id, updatedProgress);
            getProgresss();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getProgresss();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold py-8">Progresss management</h1>

            <div className="container">
                <DBTable
                    data={progresss}
                    columns={[
                        { key: "id" },
                        { key: "userId" },
                        { key: "enrollmentId" },
                        { key: "status" },
                        { key: "score" },
                        { key: "feedback" },
                    ]}
                    onCreate={handleAddProgress}
                    onUpdate={handleUpdateProgress}
                    onDelete={handleDeleteProgress}
                />
            </div>
        </div>
    );
}

export default ProgressPage;
