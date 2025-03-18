"use client";
import React, { useEffect, useState } from "react";
import { fetchForumPosts, addForumPost, fetchForumPostById } from "@/api/forumPost";
import PostCard from "@/components/forum/PostCard";
import ForumPost from "@/interfaces/forum/forumPost";
import { fetchForumThreadById } from "@/api/forumThread";

interface ThreadDetailProps {
    params: Promise<{ threadId: string }>;
}

const ThreadDetail: React.FC<ThreadDetailProps> = ({ params }) => {
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [newPostContent, setNewPostContent] = useState("");

    useEffect(() => {
        const getPosts = async () => {
            const { threadId } = await params;
            const response = await fetchForumThreadById(threadId);
            console.log(response);
            setPosts(response.forumPosts);
        };

        getPosts();
    }, [params]);

    const handleAddPost = async () => {
        const { threadId } = await params;
        await addForumPost({ content: newPostContent, threadId: parseInt(threadId, 10) });
        setNewPostContent("");
        const response = await fetchForumThreadById(threadId);
        setPosts(response.forumPosts);
    };

    return (
        <div className="container mx-auto px-6">
            <h1 className="text-4xl font-bold mb-6 text-center py-10 text-green-300">
                Thread Posts
            </h1>
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}

            <div className="mt-8">
                <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Write a new post..."
                />
                <button
                    onClick={handleAddPost}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                    Add Post
                </button>
            </div>
        </div>
    );
};

export default ThreadDetail;
