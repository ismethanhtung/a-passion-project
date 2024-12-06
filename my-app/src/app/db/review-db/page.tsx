"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import Review from "@/interfaces/review";

function ReviewPage() {
    const [reviews, setReviews] = useState<Review[]>([]);

    const fetchReviews = async () => {
        const response = await fetch("http://localhost:5000/reviews");
        const data: Review[] = await response.json();
        setReviews(data);
    };

    const deleteReview = async (id: number) => {
        const response = await await fetch(
            `http://localhost:5000/reviews/${id}`,
            {
                method: "DELETE",
            }
        );
        if (response.ok) fetchReviews();
        else alert("err");
    };

    useEffect(() => {
        fetchReviews();
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
                    onDelete={deleteReview}
                />
            </div>
        </div>
    );
}

export default ReviewPage;
