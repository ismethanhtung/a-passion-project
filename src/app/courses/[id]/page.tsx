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

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        // if (!user) {
        //     router.push("/auth/login");
        //     return;
        // }
    }, [isMounted, user, router]);

    useEffect(() => {
        fetchCourseById(id).then(setCourse).catch(console.error);
        fetchReviewsById(id).then(setReviews).catch(console.error);
    }, [id]);

    useEffect(() => {
        if (user && course) {
            const checkPurchase = async () => {
                try {
                    const response = await fetch(
                        `${API_BASE_URL}/purchase/check/${id}`,
                        {
                            method: "GET",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                        }
                    );
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
                    const courseInCart = cartItems.some(
                        (item: any) => item.courseId === course.id
                    );
                    setIsInCart(courseInCart);
                } catch (error) {
                    console.error("Error checking cart:", error);
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
        if (!course) return alert("Course not found");
        try {
            await addCart({
                userId: user.id,
                courseId: course.id,
                quantity: 1,
            });
            setIsInCart(true);
            alert("Course added to cart!");
        } catch (error) {
            console.error(error);
        }
    };

    const handleBuyNow = async () => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
        if (!course) return alert("Course not found");
        try {
            const response = await fetch(
                `${API_BASE_URL}/purchase/create_payment_url`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: course.newPrice || course.price,
                        orderDescription: `Payment for course: ${course.title}`,
                        orderType: "education",
                        language: "vn",
                        userId: user.id,
                        courseId: id,
                    }),
                }
            );
            const data = await response.json();
            if (data.paymentUrl) {
                router.push(data.paymentUrl);
            } else {
                alert("Cannot create payment URL. Please try again!");
            }
        } catch (error) {
            console.error("Error creating payment:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    if (!course) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="w-16 h-16 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading course...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="lg:w-2/3">
                            <div className="flex items-center space-x-2 text-blue-100 mb-4">
                                <span
                                    onClick={() => router.push("/courses")}
                                    className="cursor-pointer hover:text-white"
                                >
                                    Courses
                                </span>
                                <span>›</span>
                                <span className="font-medium">
                                    {course.category}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                {course.title}
                            </h1>
                            <p className="text-blue-100 text-lg mb-6">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 mb-8">
                                <div className="flex items-center">
                                    <div className="bg-blue-400/30 p-2 rounded-lg mr-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm text-blue-200">
                                            Duration
                                        </div>
                                        <div className="font-medium">
                                            {course.duration ||
                                                `${
                                                    course.lessons?.length || 0
                                                } lessons`}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="bg-blue-400/30 p-2 rounded-lg mr-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm text-blue-200">
                                            Rating
                                        </div>
                                        <div className="font-medium flex items-center">
                                            {course.averageRating || "4.8"}
                                            <div className="flex ml-2">
                                                {Array(5)
                                                    .fill(0)
                                                    .map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className={`h-4 w-4 ${
                                                                i <
                                                                Math.floor(
                                                                    course.averageRating ||
                                                                        4.8
                                                                )
                                                                    ? "text-yellow-300"
                                                                    : "text-blue-300"
                                                            }`}
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                            </div>
                                            <span className="ml-1">
                                                ({course.reviews?.length || 0})
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="bg-blue-400/30 p-2 rounded-lg mr-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm text-blue-200">
                                            Level
                                        </div>
                                        <div className="font-medium">
                                            {course.level || "Trung cấp"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {isPurchased ? (
                                    <button className="px-8 py-3 rounded-lg font-semibold bg-green-500 hover:bg-green-600 transition text-white flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Continue learning
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="px-8 py-3 rounded-lg font-semibold bg-white text-indigo-600 hover:bg-blue-50 transition flex items-center"
                                            onClick={handleBuyNow}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                            </svg>
                                            Buy now
                                        </button>
                                        <button
                                            disabled={isInCart}
                                            className={`px-8 py-3 rounded-lg font-semibold flex items-center ${
                                                isInCart
                                                    ? "bg-blue-400/30 text-blue-100 cursor-not-allowed"
                                                    : "bg-blue-400/30 text-white hover:bg-blue-400/50 transition"
                                            }`}
                                            onClick={handleAddCart}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                />
                                            </svg>
                                            {isInCart
                                                ? "Added to cart"
                                                : "Add to cart"}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="lg:w-1/3">
                            <div className="relative">
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white/90 rounded-full p-4 cursor-pointer hover:bg-white transition">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-indigo-600"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                {course.discount && (
                                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        -{course.discount}%
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 bg-white rounded-xl p-6 shadow-md">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <span className="text-3xl font-bold text-gray-900">
                                            {formatCurrency(
                                                course.newPrice || course.price
                                            )}
                                            ₫
                                        </span>
                                        {course.price &&
                                            course.newPrice &&
                                            course.price > course.newPrice && (
                                                <span className="ml-2 text-lg line-through text-gray-400">
                                                    {formatCurrency(
                                                        course.price
                                                    )}
                                                    ₫
                                                </span>
                                            )}
                                    </div>
                                    {course.discount && (
                                        <div className="text-red-500 font-medium text-lg">
                                            -{course.discount}%
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-700">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-3 text-green-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span>Unlimited access</span>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-3 text-green-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span>Completed certificate</span>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-3 text-green-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span>24/7 support</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Course nav tabs */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex overflow-x-auto">
                                <button className="px-6 py-4 font-medium text-indigo-600 border-b-2 border-indigo-600 whitespace-nowrap">
                                    Overview
                                </button>
                                <button className="px-6 py-4 font-medium text-gray-600 hover:text-indigo-600 whitespace-nowrap">
                                    Course content
                                </button>
                                <button className="px-6 py-4 font-medium text-gray-600 hover:text-indigo-600 whitespace-nowrap">
                                    Rating
                                </button>
                                <button className="px-6 py-4 font-medium text-gray-600 hover:text-indigo-600 whitespace-nowrap">
                                    Instructor
                                </button>
                            </div>
                        </div>

                        {/* Course Description */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Introduction to course
                            </h2>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed">
                                    {course.full_description ||
                                        course.description}
                                </p>

                                {/* Nếu có mô tả chi tiết hơn, thì hiển thị ở đây */}
                                {course.highlights && (
                                    <div className="mt-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                            Highlights
                                        </h3>
                                        <ul className="space-y-2 text-gray-700">
                                            {course.highlights
                                                .split(". ")
                                                .map((point, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-start"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5 text-indigo-500 mr-2 mt-1 shrink-0"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                        <span>{point}</span>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Course Objectives */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 mr-3 text-indigo-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                                Course objectives
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {course.objectives
                                    .split(". ")
                                    .map((goal, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start"
                                        >
                                            <div className="bg-indigo-100 rounded-full p-2 mr-4 mt-1 shrink-0">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-indigo-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-gray-700">
                                                    {goal}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Learning Outcomes */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 mr-3 text-indigo-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                                Learning outcomes
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {course.learning_outcomes
                                    .split(". ")
                                    .map((outcome, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start"
                                        >
                                            <div className="bg-green-100 rounded-full p-2 mr-4 mt-1 shrink-0">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-green-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-gray-700">
                                                    {outcome}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Course Content */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 mr-3 text-indigo-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                    Course content
                                </h2>
                                <div className="text-gray-600 text-sm">
                                    <span className="font-medium">
                                        {course.lessons?.length || 0}
                                    </span>{" "}
                                    lessons •
                                    <span className="font-medium ml-1">
                                        {course.duration ||
                                            "16 hours 40 minutes"}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                {course.lessons?.map((lesson, index) => (
                                    <div
                                        key={lesson.id}
                                        className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div
                                            onClick={() => {
                                                if (isPurchased || index < 3) {
                                                    toggleVideoVisibility(
                                                        lesson.id
                                                    );
                                                }
                                            }}
                                            className={`flex justify-between items-center p-4 cursor-pointer ${
                                                isPurchased || index < 3
                                                    ? "hover:bg-gray-50"
                                                    : "bg-gray-50/50 cursor-not-allowed"
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                <div className="mr-4 flex-shrink-0">
                                                    {isPurchased ||
                                                    index < 3 ? (
                                                        visibleVideo ===
                                                        lesson.id ? (
                                                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4 text-indigo-600"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4 text-indigo-600"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        )
                                                    ) : (
                                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 text-gray-500"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-base font-medium text-gray-900 flex items-center">
                                                        {index + 1}.{" "}
                                                        {lesson.title}
                                                        {index < 3 &&
                                                            !isPurchased && (
                                                                <span className="ml-2 text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                                                    Free
                                                                </span>
                                                            )}
                                                    </div>
                                                    {lesson.duration && (
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            {lesson.duration}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                {isPurchased || index < 3 ? (
                                                    <div className="text-sm font-medium text-indigo-600">
                                                        {visibleVideo ===
                                                        lesson.id
                                                            ? "Ẩn nội dung"
                                                            : "Xem bài học"}
                                                    </div>
                                                ) : (
                                                    <div className="bg-gray-100 p-1.5 rounded-full">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4 text-gray-500"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {visibleVideo === lesson.id &&
                                            (isPurchased || index < 3) && (
                                                <div className="p-4 border-t border-gray-100 bg-gray-50">
                                                    <Video
                                                        videoUrl={
                                                            lesson.videoUrl
                                                        }
                                                        isLocked={
                                                            lesson.isLocked
                                                        }
                                                    />
                                                </div>
                                            )}
                                    </div>
                                ))}
                            </div>

                            {!isPurchased && (
                                <div className="bg-indigo-50 rounded-lg p-6 flex flex-col sm:flex-row justify-between items-center">
                                    <div className="mb-4 sm:mb-0 text-center sm:text-left">
                                        <h3 className="text-lg font-semibold text-indigo-900 mb-1">
                                            Unlock all content
                                        </h3>
                                        <p className="text-indigo-700">
                                            Register now to access unlimited
                                            content
                                        </p>
                                    </div>
                                    <button
                                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
                                        onClick={handleBuyNow}
                                    >
                                        Register now
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 mr-3 text-indigo-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                    />
                                </svg>
                                Student reviews
                            </h2>
                            <ReviewForm
                                courseId={Number(id)}
                                onReviewAdded={() =>
                                    fetchReviewsById(id).then(setReviews)
                                }
                            />
                            {reviews.length > 0 ? (
                                <ReviewList reviews={reviews} />
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 mx-auto text-gray-400 mb-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                    <p className="text-gray-500 text-lg">
                                        No reviews yet
                                    </p>
                                    <p className="text-gray-400 mt-2">
                                        Be the first to review this course
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Course Price Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-3xl font-bold text-gray-900">
                                        {formatCurrency(
                                            course.newPrice || course.price
                                        )}
                                        ₫
                                    </span>
                                    {course.price &&
                                        course.newPrice &&
                                        course.price > course.newPrice && (
                                            <span className="ml-2 text-lg line-through text-gray-400">
                                                {formatCurrency(course.price)}₫
                                            </span>
                                        )}
                                </div>
                                {course.discount && (
                                    <div className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                                        Discount {course.discount}%
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center text-gray-700">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-3 text-green-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span>Lifetime access</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-3 text-green-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span>
                                        {course.lessons?.length || 0} lessons
                                        detailed
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-3 text-green-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span>Practice exercises</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-3 text-green-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span>Completed certificate</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-3 text-green-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span>24/7 support</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {isPurchased ? (
                                    <button className="w-full py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Continue learning
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="w-full py-3 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center justify-center"
                                            onClick={handleBuyNow}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                            </svg>
                                            Buy now
                                        </button>
                                        <button
                                            disabled={isInCart}
                                            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center ${
                                                isInCart
                                                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                                    : "bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
                                            }`}
                                            onClick={handleAddCart}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 mr-2"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                            </svg>
                                            {isInCart
                                                ? "Added to cart"
                                                : "Add to cart"}
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-gray-500 text-sm">
                                    Guarantee refund within 30 days
                                </p>
                            </div>
                        </div>

                        {/* Certificate */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2 text-indigo-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                    />
                                </svg>
                                Certificate
                            </h3>
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center mb-4">
                                <img
                                    src="/icons/certificate.png"
                                    alt="Certificate"
                                    className="w-14 h-14 mr-4"
                                />
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-1">
                                        Completed course certificate
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                        Receive certificate after completing all
                                        lessons
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Course Tags */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2 text-indigo-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                    />
                                </svg>
                                Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {course.tags ? (
                                    course.tags.split(",").map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                                        >
                                            {tag.trim()}
                                        </span>
                                    ))
                                ) : (
                                    <>
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                                            {course.category || "English"}
                                        </span>
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                                            {course.level || "Intermediate"}
                                        </span>
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                                            Learning
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Instructor */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2 text-indigo-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                Instructor
                            </h3>
                            <div className="flex items-center mb-4">
                                <img
                                    src="/images/avatar/avatar3.png"
                                    alt="Instructor"
                                    className="w-14 h-14 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        {course.instructorName ||
                                            "Sarah Johnson"}
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                        {course.instructorTitle ||
                                            "English Teacher & IELTS Trainer"}
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm">
                                {course.instructorBio ||
                                    "Sarah is a certified English teacher with over 10 years of experience teaching students at all levels, specializing in IELTS preparation and conversational English."}
                            </p>
                        </div>

                        {/* Share */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2 text-indigo-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                    />
                                </svg>
                                Share
                            </h3>
                            <div className="flex space-x-2">
                                <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                                    </svg>
                                </button>
                                <button className="p-2 bg-blue-400 hover:bg-blue-500 text-white rounded-full transition">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 1 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                                    </svg>
                                </button>
                                <button className="p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full transition">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                                    </svg>
                                </button>
                                <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
