"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { addReview } from "@/api/review";

interface ReviewFormProps {
    courseId: number;
    onReviewAdded: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ courseId, onReviewAdded }) => {
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState("");
    const user = useSelector((state: RootState) => state.user.user);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (comment.trim() === "") {
                alert("Please add a comment.");
                return;
            }
            const rate = rating === null ? 0 : rating;
            const response = await addReview(courseId, rate, comment);
            if (response.ok) {
                setRating(null);
                setComment("");
                onReviewAdded();
            }
        } catch (error) {
            console.error("Error adding review:", error);
        }
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            return (
                <span
                    key={starValue}
                    onClick={() => setRating(starValue)}
                    className={`cursor-pointer ${
                        rating !== null && starValue <= rating
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
        <form onSubmit={handleSubmit}>
            <div>
                <div className="flex space-x-1 py-3">{renderStars()}</div>
                <p className="text-sm text-gray-500">
                    {rating === null
                        ? "No rating selected."
                        : `Rating: ${rating}/5`}
                </p>
            </div>
            <div className="py-3">
                <textarea
                    id="comment"
                    placeholder="Write your comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={1}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height = target.scrollHeight + "px";
                    }}
                    className="w-full border-gray-200 border-2 border rounded-lg p-3 resize-none"
                />
            </div>
            <button
                type="submit"
                className="px-4 py-2 mb-6 bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-200"
            >
                Submit
            </button>
        </form>
    );
};

export default ReviewForm;
