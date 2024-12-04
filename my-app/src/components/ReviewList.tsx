import React from "react";
import { Review } from "@/interfaces/review";

interface ReviewListProps {
    reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
    return (
        <div className="space-y-6">
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div
                        key={review.id}
                        className="p-4 bg-white rounded-lg border-2 border-gray-200 flex flex-col space-y-2"
                    >
                        {/* Thông tin người dùng */}
                        <div className="flex items-center space-x-4">
                            <img
                                className="w-10 h-10 rounded-full border-2 border-gray-200"
                                src="/images/200.jpg"
                                alt="User Avatar"
                            />
                            <div>
                                <p className="text-lg font-semibold text-gray-800">
                                    {review.user.name}
                                </p>
                                <small className="text-sm text-gray-500">
                                    {new Date(
                                        review.createdAt
                                    ).toLocaleDateString()}
                                </small>
                            </div>
                        </div>
                        {/* Xếp hạng sao */}
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <span
                                    key={index}
                                    className={`text-lg text-yellow-500`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        {/* Nội dung đánh giá */}
                        <p className="text-gray-700">{review.comment}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-center">
                    Chưa có đánh giá nào.
                </p>
            )}
        </div>
    );
};

export default ReviewList;
