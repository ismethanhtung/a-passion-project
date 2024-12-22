"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import AssistantRequest from "@/interfaces/assistantRequest";
import {
    fetchAssistantRequests,
    addAssistantRequest,
    deleteAssistantRequest,
    updateAssistantRequest,
} from "@/api/assistantRequest";

function AssistantRequestPage() {
    const [assistantRequests, setAssistantRequests] = useState<AssistantRequest[]>([]);

    const getAssistantRequests = async () => {
        try {
            const response = await fetchAssistantRequests();
            setAssistantRequests(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddAssistantRequest = async (newAssistantRequest: Partial<AssistantRequest>) => {
        try {
            await addAssistantRequest(newAssistantRequest);
            getAssistantRequests();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteAssistantRequest = async (id: number) => {
        try {
            await deleteAssistantRequest(id);
            console.log(11);
            getAssistantRequests();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateAssistantRequest = async (updatedAssistantRequest: AssistantRequest) => {
        try {
            await updateAssistantRequest(updatedAssistantRequest.id, updatedAssistantRequest);
            getAssistantRequests();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAssistantRequests();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold py-8">AssistantRequests management</h1>

            <div className="container">
                <DBTable
                    data={assistantRequests}
                    columns={[{ key: "id" }]}
                    onCreate={handleAddAssistantRequest}
                    onUpdate={handleUpdateAssistantRequest}
                    onDelete={handleDeleteAssistantRequest}
                />
            </div>
        </div>
    );
}

export default AssistantRequestPage;
