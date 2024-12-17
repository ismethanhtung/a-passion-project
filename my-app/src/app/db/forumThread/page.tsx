"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import ForumThread from "@/interfaces/forum/forumThread";
import {
    fetchForumThreads,
    addForumThread,
    deleteForumThread,
    updateForumThread,
} from "@/utils/forumThread";

function ForumThreadPage() {
    const [forumThreads, setForumThreads] = useState<ForumThread[]>([]);

    const getForumThreads = async () => {
        try {
            const response = await fetchForumThreads();
            setForumThreads(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddForumThread = async (newForumThread: Partial<ForumThread>) => {
        try {
            await addForumThread(newForumThread);
            getForumThreads();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteForumThread = async (id: number) => {
        try {
            await deleteForumThread(id);
            console.log(11);
            getForumThreads();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateForumThread = async (updatedForumThread: ForumThread) => {
        try {
            await updateForumThread(updatedForumThread.id, updatedForumThread);
            getForumThreads();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getForumThreads();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold py-8">ForumThreads management</h1>

            <div className="container">
                <DBTable
                    data={forumThreads}
                    columns={[
                        { key: "id" },
                        { key: "title" },
                        { key: "content" },
                        { key: "authorId" },
                    ]}
                    onCreate={handleAddForumThread}
                    onUpdate={handleUpdateForumThread}
                    onDelete={handleDeleteForumThread}
                />
            </div>
        </div>
    );
}

export default ForumThreadPage;
