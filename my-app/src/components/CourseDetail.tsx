"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Course from "@/interfaces/course";

const CourseDetail: React.FC = () => {
    const { id } = useParams(); // Lấy `id` khóa học từ URL
    const [course, setCourse] = useState<Course | null>(null);
    const [isPurchased, setIsPurchased] = useState(false);

    const fetchCourseDetail = async () => {
        const response = await fetch(`http://localhost:5000/courses/${id}`);
        const data = await response.json();
        setCourse(data);
    };

    const handlePurchase = async () => {
        const response = await fetch(
            `http://localhost:5000/courses/${id}/purchase`,
            { method: "POST" }
        );
        if (response.ok) {
            setIsPurchased(true);
        }
    };

    useEffect(() => {
        fetchCourseDetail();
    }, [id]);

    if (!course) {
        return <div>404</div>;
    }

    return (
        <div className="container mx-auto p-6">
            {/* Phần thông tin khóa học */}
            <div className="bg-gray-100 p-4 rounded-lg">
                <h1 className="text-3xl font-bold">{course.title}</h1>
                <p className="text-gray-600 mt-2">{course.description}</p>
                <div className="mt-4">
                    <h2 className="font-semibold">Mục tiêu khóa học:</h2>
                    <ul className="list-disc ml-6 mt-2">
                        {course.goals.map((goal, index) => (
                            <li key={index}>{goal}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Phần giá cả và thanh toán */}
            <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-bold">Giá khóa học</h2>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-green-600">
                        ${course.newPrice}
                    </span>
                    <span className="text-sm line-through text-gray-500">
                        ${course.price}
                    </span>
                </div>
                {isPurchased ? (
                    <button
                        className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg"
                        disabled
                    >
                        Đã Mua
                    </button>
                ) : (
                    <button
                        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg"
                        onClick={handlePurchase}
                    >
                        Mua ngay
                    </button>
                )}
            </div>

            {/* Danh sách bài học */}
            <div className="mt-6">
                <h2 className="text-xl font-bold">Danh sách bài học</h2>
                <ul className="mt-4 space-y-2">
                    {course.lessons.map((lesson, index) => (
                        <li
                            key={index}
                            className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                        >
                            <span className="font-semibold">
                                {index + 1}. {lesson.title}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Đánh giá */}
            <div className="mt-6">
                <h2 className="text-xl font-bold">Đánh giá từ người học</h2>
                <div className="mt-4 space-y-4">
                    {course.reviews.map((review, index) => (
                        <div key={index} className="p-4 bg-gray-100 rounded-lg">
                            <p className="font-semibold">{review.userName}</p>
                            <p className="text-gray-600">{review.comment}</p>
                            <div className="text-yellow-500">
                                {"★".repeat(review.rating)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
