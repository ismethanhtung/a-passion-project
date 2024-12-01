"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Course from "@/interfaces/course";
import { Video } from "@/components/video";

const CourseDetail: React.FC = () => {
    const { id } = useParams();
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
        return (
            <div className="text-center text-red-500 text-2xl mt-20">
                404 - Khóa học không tồn tại
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div className="bg-gray-100 text-black p-6 rounded-lg shadow-lg">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full lg:w-80 h-40 lg:h-48 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                        <h1 className="text-3xl lg:text-4xl font-bold text-black">
                            {course.title}
                        </h1>
                        <p className="text-black mt-2">{course.description}</p>
                        <div className="flex items-center gap-4 text-gray-300 mt-4">
                            <span>⏱ {course.duration}</span>
                            <span>
                                📚 {course.lessons?.length || 16} Lessons
                            </span>
                            <span>
                                ⭐ {course.rating} (
                                {course.reviews && course.reviews.length}{" "}
                                Reviews)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Objectives */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">
                            Mục tiêu khóa học
                        </h2>
                        <ul className="list-disc ml-6 space-y-2 text-gray-700">
                            {course.objectives
                                .split(". ")
                                .map((goal, index) => (
                                    <li key={index}>{goal}</li>
                                ))}
                        </ul>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">
                            Danh sách bài học
                        </h2>
                        {course.lessons &&
                            course.lessons.map((module, moduleIndex) => (
                                <div key={moduleIndex} className="mb-4">
                                    <h3 className="font-semibold text-lg bg-gray-200 p-3 rounded-t-md">
                                        {module.title}
                                    </h3>
                                    <ul className="divide-y divide-gray-200">
                                        {course.lessons.map((lesson) => (
                                            <li
                                                key={lesson.id}
                                                className={`p-4 hover:bg-gray-100 cursor-pointer ${
                                                    lesson.isLocked
                                                        ? "text-gray-400 cursor-not-allowed"
                                                        : "text-gray-700"
                                                }`}
                                            >
                                                {lesson.title}{" "}
                                                <span className="text-sm">
                                                    ({lesson.duration})
                                                </span>
                                                <video
                                                    src={lesson.videoUrl}
                                                ></video>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                    </div>

                    {/* Reviews */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">
                            Đánh giá từ người học
                        </h2>
                        {course.reviews && course.reviews.length > 0 ? (
                            course.reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="p-4 bg-gray-100 rounded-lg mb-4"
                                >
                                    <p className="font-bold">{review.userId}</p>
                                    <p className="text-gray-600">
                                        {review.comment}
                                    </p>
                                    <div className="text-yellow-500">
                                        {"★".repeat(review.rating)}{" "}
                                        {"☆".repeat(5 - review.rating)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">
                                Chưa có đánh giá nào
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Pricing Section */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">
                            Giá khóa học
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-green-600">
                                ${course.newPrice || course.price}
                            </span>
                            {course.newPrice && (
                                <span className="text-sm line-through text-gray-500">
                                    ${course.price}
                                </span>
                            )}
                        </div>
                        <button
                            className={`w-full mt-6 py-3 rounded-lg font-semibold ${
                                isPurchased
                                    ? "bg-green-500 text-white cursor-not-allowed"
                                    : "bg-blue-500 text-white"
                            }`}
                            onClick={handlePurchase}
                            disabled={isPurchased}
                        >
                            {isPurchased ? "Đã Mua" : "Mua ngay"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
