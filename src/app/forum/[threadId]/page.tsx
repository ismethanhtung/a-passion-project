"use client";
import React, { useEffect, useState } from "react";
import {
    fetchForumPosts,
    addForumPost,
    fetchForumPostById,
} from "@/api/forumPost";
import PostCard from "@/components/forum/PostCard";
import ForumPost from "@/interfaces/forum/forumPost";
import { fetchForumThreadById } from "@/api/forumThread";
import ForumThread from "@/interfaces/forum/forumThread";
import Link from "next/link";

interface ThreadDetailProps {
    params: Promise<{ threadId: string }>;
}

const ThreadDetail: React.FC<ThreadDetailProps> = ({ params }) => {
    const [thread, setThread] = useState<ForumThread | null>(null);
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [newPostContent, setNewPostContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<"posts" | "participants">(
        "posts"
    );

    useEffect(() => {
        const fetchThreadDetails = async () => {
            try {
                setIsLoading(true);
                const { threadId } = await params;
                const response = await fetchForumThreadById(threadId);
                setThread(response);
                setPosts(response.forumPosts || []);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching thread:", error);
                setIsLoading(false);
            }
        };

        fetchThreadDetails();
    }, [params]);

    const handleAddPost = async () => {
        if (!newPostContent.trim()) return;

        try {
            setIsSubmitting(true);
            const { threadId } = await params;
            await addForumPost({
                content: newPostContent,
                threadId: parseInt(threadId, 10),
            });
            setNewPostContent("");

            // Fetch updated thread data
            const response = await fetchForumThreadById(threadId);
            setThread(response);
            setPosts(response.forumPosts || []);
            setIsSubmitting(false);
        } catch (error) {
            console.error("Error adding post:", error);
            setIsSubmitting(false);
        }
    };

    // Get unique participants from posts
    const participants =
        posts.length > 0
            ? Array.from(new Set(posts.map((post) => post.authorId))).map(
                  (authorId) => {
                      const post = posts.find((p) => p.authorId === authorId);
                      return {
                          id: authorId,
                          name: post?.author?.name || `User ${authorId}`,
                          avatar:
                              post?.author?.avatar ||
                              "/images/avatar/avatar2.png",
                          postCount: posts.filter(
                              (p) => p.authorId === authorId
                          ).length,
                      };
                  }
              )
            : [];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải chủ đề...</p>
                </div>
            </div>
        );
    }

    if (!thread) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md px-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mx-auto text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Không tìm thấy chủ đề
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Chủ đề bạn đang tìm kiếm không tồn tại hoặc đã bị xóa
                    </p>
                    <Link href="/forum">
                        <button className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
                            Quay lại Diễn đàn
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center text-sm text-gray-600">
                    <Link
                        href="/forum"
                        className="hover:text-indigo-600 transition-colors"
                    >
                        Diễn đàn
                    </Link>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mx-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                    <span className="text-gray-800 font-medium">
                        {thread.category || "Chung"}
                    </span>
                </div>

                {/* Thread Header */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                    thread.category
                                )}`}
                            >
                                {thread.category || "Chung"}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>
                                    {new Date(
                                        thread.createdAt
                                    ).toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            {thread.title}
                        </h1>
                        <div className="flex items-center">
                            <img
                                src="/images/avatar/avatar2.png"
                                alt="Author"
                                className="w-10 h-10 rounded-full mr-4 object-cover"
                            />
                            <div>
                                <div className="font-medium text-gray-900">
                                    {thread.author?.name ||
                                        `User ${thread.authorId || ""}`}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Chủ đề • {posts.length} bài viết
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50">
                        <p className="text-gray-800 whitespace-pre-line">
                            {thread.content}
                        </p>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-white">
                        <div className="flex space-x-6 text-sm">
                            <button className="flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                </svg>
                                <span>Thích</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                </svg>
                                <span>Chia sẻ</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>Báo cáo</span>
                            </button>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path
                                    fillRule="evenodd"
                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>
                                {thread.views ||
                                    Math.floor(Math.random() * 500) + 50}{" "}
                                lượt xem
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab("posts")}
                        className={`px-6 py-3 font-medium text-sm ${
                            activeTab === "posts"
                                ? "text-indigo-600 border-b-2 border-indigo-600"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Bài viết ({posts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("participants")}
                        className={`px-6 py-3 font-medium text-sm ${
                            activeTab === "participants"
                                ? "text-indigo-600 border-b-2 border-indigo-600"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Người tham gia ({participants.length})
                    </button>
                </div>

                {activeTab === "posts" ? (
                    <div className="space-y-6 mb-8">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 mx-auto text-gray-400 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Chưa có bài viết nào
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Hãy là người đầu tiên tham gia thảo luận
                                </p>
                            </div>
                        )}

                        {/* Reply Box */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900">
                                    Viết bài mới
                                </h3>
                            </div>
                            <div className="p-6">
                                <textarea
                                    value={newPostContent}
                                    onChange={(e) =>
                                        setNewPostContent(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[120px] resize-y"
                                    placeholder="Nhập nội dung bài viết của bạn..."
                                ></textarea>
                                <div className="flex justify-between mt-4">
                                    <div className="flex space-x-2">
                                        <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded transition-colors">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                        <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded transition-colors">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                        <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded transition-colors">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddPost}
                                        disabled={
                                            isSubmitting ||
                                            !newPostContent.trim()
                                        }
                                        className={`px-6 py-2 font-medium rounded-lg ${
                                            isSubmitting ||
                                            !newPostContent.trim()
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                                        } transition-colors flex items-center`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Đang gửi...
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 mr-1.5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                Đăng bài
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Participants tab
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">
                                Người tham gia ({participants.length})
                            </h3>
                        </div>
                        <div className="p-6">
                            {participants.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {participants.map((participant) => (
                                        <div
                                            key={participant.id}
                                            className="flex items-center p-4 border border-gray-200 rounded-lg"
                                        >
                                            <img
                                                src={participant.avatar}
                                                alt={participant.name}
                                                className="w-12 h-12 rounded-full mr-4 object-cover"
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {participant.name}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {participant.postCount} bài
                                                    viết
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">
                                        Chưa có người tham gia nào
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Function to get category badge color
const getCategoryColor = (category?: string) => {
    const categories: Record<string, string> = {
        general: "bg-blue-100 text-blue-800",
        grammar: "bg-green-100 text-green-800",
        vocabulary: "bg-yellow-100 text-yellow-800",
        pronunciation: "bg-purple-100 text-purple-800",
        speaking: "bg-pink-100 text-pink-800",
        listening: "bg-indigo-100 text-indigo-800",
        writing: "bg-red-100 text-red-800",
        resources: "bg-orange-100 text-orange-800",
    };

    return categories[category || "general"] || "bg-gray-100 text-gray-800";
};

export default ThreadDetail;
