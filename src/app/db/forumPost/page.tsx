"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import ForumPost from "@/interfaces/forum/forumPost";
import { fetchForumPosts, addForumPost, deleteForumPost, updateForumPost } from "@/api/forumPost";

function ForumPostPage() {
    const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);

    const getForumPosts = async () => {
        try {
            const response = await fetchForumPosts();
            setForumPosts(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddForumPost = async (newForumPost: Partial<ForumPost>) => {
        try {
            await addForumPost(newForumPost);
            getForumPosts();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteForumPost = async (id: number) => {
        try {
            await deleteForumPost(id);
            console.log(11);
            getForumPosts();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateForumPost = async (updatedForumPost: ForumPost) => {
        try {
            await updateForumPost(updatedForumPost.id, updatedForumPost);
            getForumPosts();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getForumPosts();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold py-8">ForumPosts management</h1>

            <div className="container">
                <DBTable
                    data={forumPosts}
                    columns={[
                        { key: "id" },
                        { key: "content" },
                        { key: "threadId" },
                        { key: "authorId" },
                        { key: "createdAt" },
                    ]}
                    onCreate={handleAddForumPost}
                    onUpdate={handleUpdateForumPost}
                    onDelete={handleDeleteForumPost}
                />
            </div>
        </div>
    );
}

export default ForumPostPage;
