import React from "react";
import Link from "next/link";
import ForumThread from "@/interfaces/forum/forumThread";

interface ForumCardProps {
    thread: ForumThread;
}

const ForumCard: React.FC<ForumCardProps> = ({ thread }) => {
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

    // Format date to relative time (e.g., "2 days ago")
    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor(
            (now.getTime() - date.getTime()) / 1000
        );

        if (diffInSeconds < 60) {
            return `${diffInSeconds} giây trước`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} phút trước`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} giờ trước`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return `${diffInDays} ngày trước`;
        }

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `${diffInMonths} tháng trước`;
        }

        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears} năm trước`;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-indigo-300 transition-all overflow-hidden">
            <div className="p-6">
                {/* Category badge */}
                <div className="flex items-center justify-between mb-4">
                    <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                            thread.category
                        )}`}
                    >
                        {thread.category || "Chung"}
                    </div>
                    {thread.isPin && (
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-indigo-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M5 5a5 5 0 0110 0v2A5 5 0 015 7V5zM0 16.68A19.9 19.9 0 0110 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" />
                            </svg>
                            <span className="ml-1 text-xs font-medium text-indigo-500">
                                Ghim
                            </span>
                        </div>
                    )}
                </div>

                {/* Title */}
                <Link href={`/forum/${thread.id}`}>
                    <h2 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                        {thread.title}
                    </h2>
                </Link>

                {/* Content preview */}
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {thread.content}
                </p>

                {/* Author and stats */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img
                            src="/images/avatar/avatar2.png"
                            alt="Author"
                            className="w-8 h-8 rounded-full mr-3 object-cover"
                        />
                        <div>
                            <div className="text-sm font-medium text-gray-900">
                                {thread.author?.name ||
                                    `User ${thread.authorId || ""}`}
                            </div>
                            <div className="text-xs text-gray-500">
                                {getRelativeTime(thread.createdAt)}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
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
                                    Math.floor(Math.random() * 200) + 10}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>{thread.forumPosts?.length || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            <Link href={`/forum/${thread.id}`}>
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 hover:bg-indigo-50 transition-colors text-center">
                    <span className="text-sm font-medium text-indigo-600">
                        Xem chi tiết
                    </span>
                </div>
            </Link>
        </div>
    );
};

export default ForumCard;
