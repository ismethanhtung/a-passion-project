"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import Review from "@/interfaces/review";
import { fetchReviews, deleteReview } from "@/utils/review";

function ReviewPage() {
    const [reviews, setReviews] = useState<Review[]>([]);

    const getReviews = async () => {
        try {
            const response = await fetchReviews();
            setReviews(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteReview = async (id: number) => {
        try {
            const response = await deleteReview(id);
            fetchReviews();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getReviews();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold">Quản lý Reviews</h1>

            <div className="container">
                <DBTable
                    data={reviews}
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "userId", label: "UserId" },
                        { key: "courseId", label: "CourseId" },
                        { key: "rating", label: "Rating" },
                        { key: "comment", label: "Comment" },
                    ]}
                    onDelete={handleDeleteReview}
                />
            </div>
        </div>
    );
}

export default ReviewPage;
