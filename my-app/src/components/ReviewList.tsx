import React, { useState } from "react";
import Review from "@/interfaces/review";

interface ReviewListProps {
    reviews: Review[];
}

function formatTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

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
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
    const sortedReviews = [...reviews].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const [likedReviews, setLikedReviews] = useState<number[]>([]);

    const handleLike = (id: number) => {
        if (likedReviews.includes(id)) {
            setLikedReviews(likedReviews.filter((reviewId) => reviewId !== id));
        } else {
            setLikedReviews([...likedReviews, id]);
        }
    };

    const handleReply = (id: number) => {
        console.log(`Replying to review ID: ${id}`);
    };

    const handleReport = (id: number) => {
        console.log(`Reporting review ID: ${id}`);
    };

    return (
        <div className="space-y-6">
            {sortedReviews.length > 0 ? (
                sortedReviews.map((review) => (
                    <div
                        key={review.id}
                        className="p-4 bg-white rounded-lg border-2 border-gray-200 flex flex-col space-y-2"
                    >
                        <div className="flex items-center space-x-4">
                            <img
                                className="w-10 h-10 rounded-full p-0.5 border-2 border-gray-200"
                                src="/images/avatar/avatar3.png"
                                alt="User Avatar"
                            />
                            <div>
                                <p className="font-semibold text-gray-800">{review.user.name}</p>
                                <small className="text-xs text-gray-500">
                                    <span>{formatTimeAgo(review.createdAt)}</span>
                                </small>
                            </div>
                        </div>

                        <div className="flex items-center space-x-1">
                            {Array.from({ length: review.rating }).map((_, index) => (
                                <img key={index} src="/icons/star.png" className="size-3" />
                            ))}
                        </div>

                        <p className="text-gray-700">{review.comment}</p>

                        {/* Like, Reply, Report Buttons */}
                        <div className="flex space-x-4 text-sm text-gray-600 pt-3">
                            <button
                                onClick={() => handleLike(review.id)}
                                className={`flex items-center space-x-1 ${
                                    likedReviews.includes(review.id)
                                        ? "text-blue-500"
                                        : "text-gray-500"
                                }`}
                            >
                                <img className="size-4" src="/icons/like.png" alt="like" />
                                <span>{likedReviews.includes(review.id) ? "Liked" : "Like"}</span>
                            </button>

                            <button
                                onClick={() => handleReply(review.id)}
                                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
                            >
                                <img className="size-4" src="/icons/comment.png" alt="comment" />
                                <span>Reply</span>
                            </button>

                            <button
                                onClick={() => handleReport(review.id)}
                                className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                            >
                                <img className="size-5" src="/icons/problem.png" alt="problem" />
                                <span>Report</span>
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-center">Chưa có đánh giá nào.</p>
            )}
        </div>
    );
};

export default ReviewList;
