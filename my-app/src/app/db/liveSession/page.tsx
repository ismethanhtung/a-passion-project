"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import LiveSession from "@/interfaces/liveSession";
import {
    fetchLiveSessions,
    addLiveSession,
    deleteLiveSession,
    updateLiveSession,
} from "@/utils/liveSession";

function LiveSessionPage() {
    const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);

    const getLiveSessions = async () => {
        try {
            const response = await fetchLiveSessions();
            setLiveSessions(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddLiveSession = async (newLiveSession: Partial<LiveSession>) => {
        try {
            await addLiveSession(newLiveSession);
            getLiveSessions();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteLiveSession = async (id: number) => {
        try {
            await deleteLiveSession(id);
            console.log(11);
            getLiveSessions();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateLiveSession = async (updatedLiveSession: LiveSession) => {
        try {
            await updateLiveSession(updatedLiveSession.id, updatedLiveSession);
            getLiveSessions();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getLiveSessions();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold py-8">LiveSessions management</h1>

            <div className="container">
                <DBTable
                    data={liveSessions}
                    columns={[
                        { key: "id" },
                        { key: "liveCourseId" },
                        { key: "sessionDate" },
                        { key: "topic" },
                        { key: "courseId" },
                    ]}
                    onCreate={handleAddLiveSession}
                    onUpdate={handleUpdateLiveSession}
                    onDelete={handleDeleteLiveSession}
                />
            </div>
        </div>
    );
}

export default LiveSessionPage;
