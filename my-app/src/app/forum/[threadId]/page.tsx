"use client";
import React, { useEffect, useState } from "react";
import { fetchForumPosts, addForumPost, fetchForumPostById } from "@/api/forumPost";
import { useParams } from "next/navigation";
import PostCard from "@/components/forum/PostCard";
import ForumPost from "@/interfaces/forum/forumPost";
import { fetchForumThreadById } from "@/api/forumThread";

const ThreadDetail: React.FC<{ params: { threadId: number } }> = ({ params }) => {
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [newPostContent, setNewPostContent] = useState("");
    const { threadId } = useParams();

    const getPosts = async () => {
        const response = await fetchForumThreadById(threadId);
        console.log(response);
        setPosts(response.forumPosts);
    };

    const handleAddPost = async () => {
        await addForumPost({ content: newPostContent, threadId: threadId });
        setNewPostContent("");
        getPosts();
    };

    useEffect(() => {
        getPosts();
    }, [threadId]);

    return (
        <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold mb-6">Thread Posts</h1>
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
