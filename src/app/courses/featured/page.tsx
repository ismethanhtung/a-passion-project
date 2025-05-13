"use client";

import React, { useEffect, useState } from "react";
import { fetchCourses } from "@/api/courses";
import Course from "@/interfaces/course";
import CourseCard from "@/components/courseCard";
import { ArrowRight, Bookmark, Clock, Star, Users } from "lucide-react";
import Link from "next/link";

const FeaturedCoursesPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchFeaturedCourses = async () => {
            setIsLoading(true);
            try {
                const allCourses = await fetchCourses();
                // Lọc các khóa học nổi bật (Ở đây ta giả định các khóa học nổi bật là các khóa học có rating cao)
                const featured = allCourses
                    .sort((a, b) => {
                        const ratingA = a.rating || 4.5;
                        const ratingB = b.rating || 4.5;
                        return ratingB - ratingA;
                    })
                    .slice(0, 9); // Lấy 9 khóa học nổi bật nhất
                setCourses(featured);
            } catch (error) {
                console.error("Error fetching featured courses:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeaturedCourses();
    }, []);

    // Lấy khóa học nổi bật nhất nếu có
    const topCourse = courses.length > 0 ? courses[0] : null;
    const remainingCourses = courses.slice(1);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white py-16">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Featured Courses
                        </h1>
                        <p className="text-lg md:text-xl opacity-90 mb-8">
                            Explore top-rated courses by learners
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-12">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md p-4 animate-pulse"
                            >
                                <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
                                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                                <div className="flex justify-between">
                                    <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                                    <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Featured Course Highlight */}
                        {topCourse && (
                            <div className="mb-16 bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
                                <div className="flex flex-col lg:flex-row">
                                    <div className="lg:w-1/2 relative overflow-hidden">
                                        <div className="absolute top-4 left-4 z-10 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                            Featured
                                        </div>
                                        <img
                                            src={
                                                topCourse.thumbnail ||
                                                "/images/course-placeholder.jpg"
                                            }
                                            alt={topCourse.title}
                                            className="w-full h-full object-cover object-center"
                                            style={{ minHeight: "300px" }}
                                        />
                                    </div>
                                    <div className="lg:w-1/2 p-8 flex flex-col justify-between">
                                        <div>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {topCourse.tags &&
                                                    topCourse.tags
                                                        .split(",")
                                                        .map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-md"
                                                            >
                                                                {tag.trim()}
                                                            </span>
                                                        ))}
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                                {topCourse.title}
                                            </h2>
                                            <p className="text-gray-600 mb-6">
                                                {topCourse.description}
                                            </p>
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="flex items-center">
                                                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                                                    <span className="text-gray-700">
                                                        {topCourse.rating ||
                                                            "4.8"}{" "}
                                                        star
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="h-5 w-5 text-blue-500 mr-2" />
                                                    <span className="text-gray-700">
                                                        {Math.floor(
                                                            Math.random() * 1000
                                                        ) + 500}{" "}
                                                        students
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-5 w-5 text-green-500 mr-2" />
                                                    <span className="text-gray-700">
                                                        {topCourse.time ||
                                                            Math.floor(
                                                                Math.random() *
                                                                    20
                                                            ) +
                                                                5 +
                                                                " hours"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Bookmark className="h-5 w-5 text-purple-500 mr-2" />
                                                    <span className="text-gray-700">
                                                        {Math.floor(
                                                            Math.random() * 30
                                                        ) + 10}{" "}
                                                        lessons
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="text-2xl font-bold text-purple-600">
                                                    {topCourse.newPrice
                                                        ? `${topCourse.newPrice.toLocaleString()}đ`
                                                        : "Free"}
                                                </span>
                                                {topCourse.newPrice &&
                                                    topCourse.price && (
                                                        <span className="ml-2 text-lg text-gray-500 line-through">
                                                            {topCourse.price.toLocaleString()}
                                                            đ
                                                        </span>
                                                    )}
                                            </div>
                                            <Link
                                                href={`/courses/${topCourse.id}`}
                                            >
                                                <button className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                                                    View Details
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* More Featured Courses */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-8">
                            Other Featured Courses
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {remainingCourses.map((course, index) => (
                                <CourseCard
                                    key={index}
                                    id={course.id}
                                    title={course.title}
                                    description={course.description}
                                    thumbnail={course.thumbnail}
                                    price={course.price}
                                    newPrice={course.newPrice}
                                    tags={course.tags}
                                    rating={
                                        course.rating ||
                                        4.5 + Math.random() * 0.5
                                    }
                                    time={
                                        course.time ||
                                        Math.floor(Math.random() * 20) + 5
                                    }
                                />
                            ))}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-center mt-12 space-x-4">
                            <Link href="/courses">
                                <button className="px-6 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                                    All Courses
                                </button>
                            </Link>
                            <Link href="/courses/new">
                                <button className="px-6 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                                    New Courses
                                </button>
                            </Link>
                            <Link href="/courses/popular">
                                <button className="px-6 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                                    Popular Languages
                                </button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FeaturedCoursesPage;
