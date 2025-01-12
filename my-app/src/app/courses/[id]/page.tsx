"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchCourseById } from "@/api/courses";
import { fetchReviewsById } from "@/api/review";
import { addCart } from "@/api/cart";
import Course from "@/interfaces/course";
import Review from "@/interfaces/review";
import { Video } from "@/components/ui/video";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";
import handler from "@/api/payment";

const CourseDetail: React.FC = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const { id } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [visibleVideo, setVisibleVideo] = useState<number | null>(null);
    const [isInCart, setIsInCart] = useState(false);
    const [isPurchased, setIsPurchased] = useState(false);

    useEffect(() => {
        fetchCourseById(id).then(setCourse).catch(console.error);
        fetchReviewsById(id).then(setReviews).catch(console.error);
    }, [id]);

    const handleAddCart = async () => {
        if (!user) return alert("Bạn cần đăng nhập.");
        if (!course) return alert("Khóa học không tồn tại.");
        try {
            await addCart({ userId: user.id, courseId: course.id, quantity: 1 });
            setIsInCart(true);
            alert("Khóa học đã được thêm vào giỏ hàng!");
        } catch (error) {
            console.error(error);
        }
    };

    const handleBuyNow = async () => {
        if (!user) return alert("Bạn cần đăng nhập.");
        if (!course) return alert("Khóa học không tồn tại.");
        try {
            const response = await fetch("http://localhost:5000/purchase/create_payment_url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: course.newPrice || course.price,
                    orderDescription: `Thanh toán cho khóa học: ${course.title}`,
                    orderType: "education",
                    language: "vn",
                }),
            });
            const data = await response.json();

            console.log("238471293847123412", data);

            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                alert("Không thể tạo URL thanh toán. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi tạo thanh toán:", error);
            alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    };

    const toggleVideoVisibility = (lessonId: number) => {
        setVisibleVideo((prev) => (prev === lessonId ? null : lessonId));
    };

    if (!course)
        return (
            <div className="text-center text-red-500 text-2xl mt-20">
                404 - Khóa học không tồn tại
            </div>
        );

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div className="border-2 border-gray-200 p-10 rounded-lg flex flex-col lg:flex-row gap-4">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full lg:w-80 h-40 lg:h-48 object-cover rounded-lg"
                />
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold">{course.title}</h1>
                    <p className="mt-2">{course.description}</p>
                    <div className="flex gap-4 text-gray-500 mt-4">
                        <span>{course.lessons?.length || 0} Lessons</span>
                        <span>({course.reviews?.length} Reviews)</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="border-2 border-gray-200 p-10 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Course Objectives</h2>
                        <ul className="list-disc ml-6 space-y-2 text-gray-700">
                            {course.objectives.split(". ").map((goal, i) => (
                                <li key={i}>{goal}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="border-2 border-gray-200 p-10 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Course Content</h2>
                        {course.lessons?.map((lesson) => (
                            <div key={lesson.id}>
                                <h3
                                    onClick={() => toggleVideoVisibility(lesson.id)}
                                    className="py-1 text-sm cursor-pointer text-blue-600"
                                >
                                    {lesson.title}
                                </h3>
                                {visibleVideo === lesson.id && (
                                    <Video videoUrl={lesson.videoUrl} isLocked={lesson.isLocked} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="border-2 border-gray-200 p-10 rounded-lg">
                        <h2 className="text-xl font-semibold">Course Rating</h2>
                        <ReviewForm
                            courseId={Number(id)}
                            onReviewAdded={() => fetchReviewsById(id).then(setReviews)}
                        />
                        {reviews.length > 0 ? (
                            <ReviewList reviews={reviews} />
                        ) : (
                            <p className="text-gray-500">Chưa có đánh giá</p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="border-2 border-gray-200 rounded-lg p-10">
                        <h3 className="text-lg font-semibold mb-4">Course Review</h3>
                        <Video videoUrl="https://vimeo.com/1037130772" isLocked={false} />
                    </div>

                    <div className="border-2 border-gray-200 p-10 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Course Price</h2>
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
                                    isPurchased ? "bg-green-300" : "bg-blue-400"
                                }`}
                                disabled={isPurchased}
                                onClick={handleBuyNow}
                            >
                                {isPurchased ? "Sold" : "Buy Now"}
                            </button>
                            <button
                                className={`w-full py-3 rounded-lg font-semibold ${
                                    isInCart ? "bg-green-300" : "bg-yellow-400"
                                }`}
                                onClick={!isInCart ? handleAddCart : undefined}
                                disabled={isInCart}
                            >
                                {isInCart ? "Added to Cart" : "Add to Cart"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
