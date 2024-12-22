"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import AssistantLog from "@/interfaces/assistantLog";
import {
    fetchAssistantLogs,
    addAssistantLog,
    deleteAssistantLog,
    updateAssistantLog,
} from "@/api/assistantLog";

function AssistantLogPage() {
    const [assistantLogs, setAssistantLogs] = useState<AssistantLog[]>([]);

    const getAssistantLogs = async () => {
        try {
            const response = await fetchAssistantLogs();
            setAssistantLogs(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddAssistantLog = async (newAssistantLog: Partial<AssistantLog>) => {
        try {
            await addAssistantLog(newAssistantLog);
            getAssistantLogs();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteAssistantLog = async (id: number) => {
        try {
            await deleteAssistantLog(id);
            console.log(11);
            getAssistantLogs();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateAssistantLog = async (updatedAssistantLog: AssistantLog) => {
        try {
            await updateAssistantLog(updatedAssistantLog.id, updatedAssistantLog);
            getAssistantLogs();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAssistantLogs();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold py-8">AssistantLogs management</h1>

            <div className="container">
                <DBTable
                    data={assistantLogs}
                    columns={[{ key: "id" }]}
                    onCreate={handleAddAssistantLog}
                    onUpdate={handleUpdateAssistantLog}
                    onDelete={handleDeleteAssistantLog}
                />
            </div>
        </div>
    );
}

export default AssistantLogPage;
