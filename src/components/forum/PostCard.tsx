import React, { useState } from "react";
import ForumPost from "@/interfaces/forum/forumPost";

interface PostCardProps {
    post: ForumPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    // Format time to relative format
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

    // Handle reply submission
    const handleReply = () => {
        // This would be implemented with API calls in a real application
        alert("Trả lời đã được gửi: " + replyContent);
        setReplyContent("");
        setShowReplyBox(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex p-6">
                {/* Author avatar column */}
                <div className="mr-6 flex flex-col items-center">
                    <img
                        src="/images/avatar/avatar2.png"
                        alt="Author"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="mt-3 flex flex-col items-center space-y-1">
                        <button
                            onClick={() => setLiked(!liked)}
                            className={`p-1.5 rounded-full ${
                                liked
                                    ? "text-red-500 bg-red-50"
                                    : "text-gray-400 hover:text-red-500 hover:bg-gray-100"
                            } transition-colors`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <span className="text-xs font-medium">
                            {post.likes || 0}
                        </span>
                    </div>
                </div>

                {/* Post content */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h3 className="font-medium text-gray-900">
                                {post.author?.name ||
                                    `User ${post.authorId || ""}`}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {getRelativeTime(post.createdAt)}
                            </p>
                        </div>

                        {post.isAnswer && (
                            <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Giải pháp
                            </div>
                        )}
                    </div>

                    <div className="text-gray-800 whitespace-pre-line mb-4">
                        {post.content}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4 text-sm">
                        <button
                            onClick={() => setShowReplyBox(!showReplyBox)}
                            className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                />
                            </svg>
                            <span>Trả lời</span>
                        </button>

                        <button className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                />
                            </svg>
                            <span>Chia sẻ</span>
                        </button>

                        <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <span>Báo cáo</span>
                        </button>
                    </div>

                    {/* Reply box */}
                    {showReplyBox && (
                        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <textarea
                                value={replyContent}
                                onChange={(e) =>
                                    setReplyContent(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px] resize-y"
                                placeholder="Viết trả lời của bạn..."
                            ></textarea>
                            <div className="flex justify-end mt-3 space-x-3">
                                <button
                                    onClick={() => setShowReplyBox(false)}
                                    className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleReply}
                                    disabled={!replyContent.trim()}
                                    className={`px-4 py-2 rounded-lg font-medium ${
                                        !replyContent.trim()
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                                    }`}
                                >
                                    Gửi trả lời
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Comments to the post (if any) */}
            {post.comments && post.comments.length > 0 && (
                <div className="border-t border-gray-100 bg-gray-50 p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Trả lời ({post.comments.length})
                    </h4>
                    <div className="space-y-4">
                        {post.comments.map((comment, index) => (
                            <div key={index} className="flex">
                                <img
                                    src="/images/avatar/avatar2.png"
                                    alt="Author"
                                    className="w-8 h-8 rounded-full mr-3 object-cover"
                                />
                                <div>
                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                        <div className="flex items-center mb-1">
                                            <span className="font-medium text-sm text-gray-900">
                                                {comment.author?.name ||
                                                    `User ${comment.authorId}`}
                                            </span>
                                            <span className="mx-2 text-gray-400">
                                                •
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {getRelativeTime(
                                                    comment.createdAt
                                                )}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-800">
                                            {comment.content}
                                        </p>
                                    </div>
                                    <div className="flex mt-1 ml-1 space-x-4 text-xs">
                                        <button className="text-gray-500 hover:text-indigo-600 transition-colors">
                                            Thích
                                        </button>
                                        <button className="text-gray-500 hover:text-indigo-600 transition-colors">
                                            Trả lời
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;
