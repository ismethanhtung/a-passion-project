"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Course from "@/interfaces/course";
import { Video } from "@/components/ui/video";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";
import Review from "@/interfaces/review";

const CourseDetail: React.FC = () => {
    const { id } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [isPurchased, setIsPurchased] = useState(false);
    const [visibleVideo, setVisibleVideo] = useState<number | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);

    const fetchCourseDetails = async () => {
        const response = await fetch(`http://localhost:5000/courses/${id}`);
        const data = await response.json();
        setCourse(data);
    };

    const handlePurchase = async () => {
        const response = await fetch(
            `http://localhost:5000/courses/${id}/purchase`,
            { method: "POST" }
        );
        if (response.ok) setIsPurchased(true);
    };
    const fetchReviews = async () => {
        const response = await fetch(`http://localhost:5000/reviews/${id}`);
        const data = await response.json();
        setReviews(data);
    };

    const toggleVideoVisibility = (lessonId: number) => {
        setVisibleVideo((prev) => (prev === lessonId ? null : lessonId));
    };

    useEffect(() => {
        fetchCourseDetails();
        fetchReviews();
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
            {/* Khung thông tin khóa học */}
            <div className="border-2 border-gray-200 p-6 rounded-lg">
                <div className="flex flex-col lg:flex-row gap-4">
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full lg:w-80 h-40 lg:h-48 object-cover rounded-lg"
                    />
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold">
                            {course.title}
                        </h1>
                        <p className="mt-2">{course.description}</p>
                        <div className="flex gap-4 text-gray-500 mt-4">
                            <span className="flex">
                                <img
                                    src="/icons/clock.png"
                                    className="size-4 mt-1"
                                />{" "}
                                {course.duration}
                            </span>
                            <span>{course.lessons?.length || 0} Lessons</span>
                            <span className="flex">
                                <img
                                    src="/icons/star.png"
                                    className="size-4 mt-1"
                                />
                                {course.rating} ({course.reviews?.length}{" "}
                                Reviews)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="border-2 border-gray-200 p-10 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">
                            Course Objectives
                        </h2>
                        <ul className="list-disc ml-6 space-y-2 text-gray-700">
                            {course.objectives
                                .split(". ")
                                .map((goal, index) => (
                                    <li key={index}>{goal}</li>
                                ))}
                        </ul>
                    </div>
                    <div className="border-2 border-gray-200 p-10 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">
                            Danh sách bài học
                        </h2>
                        {course.lessons?.map((lesson) => (
                            <div key={lesson.id} className="">
                                <h3
                                    onClick={() =>
                                        toggleVideoVisibility(lesson.id)
                                    }
                                    className="py-3 font-semibold text-lg bg-gray-200 cursor-pointer text-blue-600"
                                >
                                    {lesson.title}
                                </h3>

                                <div
                                    className={` ${
                                        lesson.isLocked
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {visibleVideo === lesson.id && (
                                        <Video
                                            videoUrl={lesson.videoUrl}
                                            isLocked={lesson.isLocked}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-2 border-gray-200 p-10 rounded-lg">
                        <h2 className="text-xl font-semibold">
                            Đánh giá từ người học
                        </h2>
                        <div className="container mx-auto py-8">
                            <ReviewForm
                                courseId={Number(id)}
                                onReviewAdded={fetchReviews}
                            />
                        </div>
                        {reviews?.length > 0 ? (
                            <div className="container mx-auto py-8">
                                <ReviewList reviews={reviews} />
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                Chưa có đánh giá nào
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className=" border-2 border-gray-200 rounded-lg p-10">
                            <h3 className="text-lg font-semibold mb-4">
                                Course Review
                            </h3>
                            <Video
                                videoUrl={
                                    "https://www.youtube.com/watch?v=YmykOwljr0k&list=RDMMYmykOwljr0k&start_radio=1"
                                }
                                isLocked={false}
                            />
                        </div>
                    </div>
                    <div className="border-2 border-gray-200 p-10 rounded-lg">
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
                        <div className="mt-6 space-y-4">
                            <button
                                className={`w-full py-3 rounded-lg font-semibold ${
                                    isPurchased
                                        ? "bg-green-300 text-white cursor-not-allowed"
                                        : "bg-blue-400 text-white"
                                }`}
                                onClick={handlePurchase}
                                disabled={isPurchased}
                            >
                                {isPurchased ? "Sold" : "Buy Now"}
                            </button>
                            <button
                                className="w-full py-3 rounded-lg font-semibold bg-yellow-400 text-white"
                                onClick={() =>
                                    alert("Khóa học đã được thêm vào giỏ hàng!")
                                }
                            >
                                Add to cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
