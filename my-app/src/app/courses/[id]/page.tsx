"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchCourseById } from "@/api/courses";
import { fetchReviewsById } from "@/api/review";
import { addCart, fetchCartById } from "@/api/cart";
import { addProgress } from "@/api/progress";

import Course from "@/interfaces/course";
import Review from "@/interfaces/review";
import { Video } from "@/components/ui/video";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const CourseDetail: React.FC = () => {
    const router = useRouter();
    const { id } = useParams();
    const user = useSelector((state: RootState) => state.user.user);

    const [course, setCourse] = useState<Course | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [visibleVideo, setVisibleVideo] = useState<number | null>(null);
    const [isInCart, setIsInCart] = useState<boolean>(false);
    const [isPurchased, setIsPurchased] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(true);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    // useEffect(() => {
    //     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    //         e.preventDefault();
    //         e.returnValue = "Nếu bạn rời khỏi trang, thay đổi hiện tại sẽ không được lưu lại.";
    //     };
    //     window.addEventListener("beforeunload", handleBeforeUnload);
    //     return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    // }, []);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        if (!user) {
            router.push("/auth/login");
            return;
        }
    }, [isMounted, user, router]);

    useEffect(() => {
        fetchCourseById(id).then(setCourse).catch(console.error);
        fetchReviewsById(id).then(setReviews).catch(console.error);
    }, [id]);

    useEffect(() => {
        if (user && course) {
            const checkPurchase = async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/purchase/check/${id}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    });
                    const data = await response.json();
                    if (data != null) setIsPurchased(true);
                } catch (error) {
                    console.error(error);
                }
            };
            checkPurchase();

            const checkCartStatus = async () => {
                try {
                    const cartItems = await fetchCartById(user.id);
                    const courseInCart = cartItems.some((item: any) => item.courseId === course.id);
                    setIsInCart(courseInCart);
                } catch (error) {
                    console.error("Lỗi khi kiểm tra giỏ hàng:", error);
                }
            };
            checkCartStatus();
        }
    }, [user, course, id]);

    const toggleVideoVisibility = (lessonId: number) => {
        setVisibleVideo((prev) => (prev === lessonId ? null : lessonId));
    };

    const formatCurrency = (price: number): string => {
        return price.toLocaleString("vi-VN");
    };

    const handleAddCart = async () => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
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
        if (!user) {
            router.push("/auth/login");
            return;
        }
        if (!course) return alert("Khóa học không tồn tại.");
        try {
            const response = await fetch(`${API_BASE_URL}/purchase/create_payment_url`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: course.newPrice || course.price,
                    orderDescription: `Thanh toán cho khóa học: ${course.title}`,
                    orderType: "education",
                    language: "vn",
                    userId: user.id,
                    courseId: id,
                }),
            });
            const data = await response.json();
            if (data.paymentUrl) {
                router.push(data.paymentUrl);
            } else {
                alert("Không thể tạo URL thanh toán. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi tạo thanh toán:", error);
            alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    };

    if (!course) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <img src="/icons/loading.gif" alt="Loading..." className="w-16 h-16" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div className="border border-gray-200 p-10 rounded-lg flex flex-col lg:flex-row gap-6">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full lg:w-80 h-40 lg:h-48 object-cover rounded-lg"
                />
                <div className="flex-1">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">{course.title}</h1>
                    <p className="text-gray-700">{course.description}</p>
                    <div className="flex gap-4 text-gray-500 mt-4">
                        <span>{course.lessons?.length || 0} Lessons</span>
                        <span>({course.reviews?.length} Reviews)</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="border border-gray-200 p-10 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Course Objectives</h2>
                        <ul className="list-disc ml-6 space-y-2 text-gray-700">
                            {course.objectives.split(". ").map((goal, i) => (
                                <li key={i}>{goal}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="border border-gray-200 p-10 rounded-lg bg-white shadow">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Course Content</h2>
                        <div className="space-y-4">
                            {course.lessons?.map((lesson, index) => (
                                <div key={lesson.id} className="border-b pb-4 last:border-none">
                                    <div
                                        onClick={() => {
                                            if (isPurchased || index < 3) {
                                                toggleVideoVisibility(lesson.id);
                                            }
                                        }}
                                        className={`flex justify-between items-center py-3 px-5 rounded-lg cursor-pointer transition duration-200 ${
                                            isPurchased || index < 3
                                                ? "bg-gray-100 hover:bg-gray-200"
                                                : "bg-gray-300 cursor-not-allowed"
                                        }`}
                                    >
                                        <span className="text-lg font-semibold text-gray-800 flex-1">
                                            {index + 1}. {lesson.title}
                                        </span>
                                        <span className="text-gray-600 text-sm">
                                            {isPurchased || index < 3 ? (
                                                visibleVideo === lesson.id ? (
                                                    "Hide Video"
                                                ) : (
                                                    "Show Video"
                                                )
                                            ) : (
                                                <img
                                                    className="w-5 h-5"
                                                    src="/icons/lock.png"
                                                    alt="Locked"
                                                />
                                            )}
                                        </span>
                                    </div>
                                    {visibleVideo === lesson.id && (isPurchased || index < 3) && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                            <Video
                                                videoUrl={lesson.videoUrl}
                                                isLocked={lesson.isLocked}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="border border-gray-200 p-10 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Course Rating</h2>
                        <ReviewForm
                            courseId={Number(id)}
                            onReviewAdded={() => fetchReviewsById(id).then(setReviews)}
                        />
                        {reviews.length > 0 ? (
                            <ReviewList reviews={reviews} />
                        ) : (
                            <p className="text-gray-500">No reviews yet.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="border border-gray-200 p-10 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Preview Video</h3>
                        <Video videoUrl="https://vimeo.com/1037130772" isLocked={false} />
                    </div>
                    <div className="border border-gray-200 p-10 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Course Price</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-green-600">
                                {formatCurrency(course.newPrice)}đ
                            </span>
                            {course.price && (
                                <span className="text-sm line-through text-gray-500">
                                    {formatCurrency(course.price)}đ
                                </span>
                            )}
                        </div>
                        <div className="mt-6 space-y-4">
                            {isPurchased ? (
                                <button className="w-full py-3 rounded-lg font-semibold bg-green-300">
                                    Purchased
                                </button>
                            ) : (
                                <>
                                    <button
                                        className="w-full py-3 rounded-lg font-semibold bg-blue-500 text-white transition hover:bg-blue-600"
                                        onClick={handleBuyNow}
                                    >
                                        Buy Now
                                    </button>
                                    <button
                                        disabled={isInCart}
                                        className={`w-full py-3 rounded-lg font-semibold transition ${
                                            isInCart
                                                ? "bg-yellow-200 text-gray-700"
                                                : "bg-yellow-500 text-white hover:bg-yellow-600"
                                        }`}
                                        onClick={handleAddCart}
                                    >
                                        {isInCart ? "Added to Cart" : "Add to Cart"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
