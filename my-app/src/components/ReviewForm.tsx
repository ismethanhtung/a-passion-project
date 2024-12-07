"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
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
            const response = await fetch("http://localhost:5000/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId, rating, comment }),
                credentials: "include",
            });
            if (response.ok) {
                setRating(5);
                setComment("");
                onReviewAdded();
            }
        } catch (error) {
            console.error("Lỗi khi thêm đánh giá:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="rating" className="block font-medium">
                    Rating (1-5):
                </label>
                <input
                    type="number"
                    id="rating"
                    min={1}
                    max={5}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full border p-2 rounded"
                />
            </div>
            <div>
                <label htmlFor="comment" className="block font-medium">
                    Comment:
                </label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border p-2 rounded"
                />
            </div>
            <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Gửi đánh giá
            </button>
        </form>
    );
};

export default ReviewForm;
