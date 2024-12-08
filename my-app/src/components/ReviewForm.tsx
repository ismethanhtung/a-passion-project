"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { addReview } from "@/utils/review";

interface ReviewFormProps {
    courseId: number;
    onReviewAdded: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ courseId, onReviewAdded }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const { user } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (comment.trim() === "") {
                alert("Please add comment");
                return;
            }
            const response = await addReview(courseId, rating, comment);
            if (response.ok) {
                setRating(5);
                setComment("");
                onReviewAdded();
            }
        } catch (error) {
            console.error("Lỗi khi thêm đánh giá:", error);
        }
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            return (
                <span
                    key={starValue}
                    onClick={() => setRating(starValue)}
                    onMouseOver={() => setRating(starValue)}
                    className={`cursor-pointer ${
                        starValue <= rating
                            ? "text-yellow-500"
                            : "text-gray-400"
                    }`}
                >
                    ★
                </span>
            );
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <div className="flex space-x-1">{renderStars()}</div>
            </div>
            <div>
                <textarea
                    id="comment"
                    placeholder="Your comment here"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border p-2 rounded"
                />
            </div>
            <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Submit
            </button>
        </form>
    );
};

export default ReviewForm;
