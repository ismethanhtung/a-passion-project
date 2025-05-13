"use client";

import React, { useEffect, useState } from "react";
import { fetchCourses } from "@/api/courses";
import Course from "@/interfaces/course";
import CourseCard from "@/components/courseCard";
import { ArrowRight, CalendarDays, Clock, Star, Users } from "lucide-react";
import Link from "next/link";

const NewReleasesPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchNewCourses = async () => {
            setIsLoading(true);
            try {
                const allCourses = await fetchCourses();
                // Giả lập khóa học mới bằng cách sắp xếp ngẫu nhiên và lấy 12 khóa học
                const shuffled = [...allCourses].sort(
                    () => 0.5 - Math.random()
                );
                const newCourses = shuffled.slice(0, 12);
                setCourses(newCourses);
            } catch (error) {
                console.error("Error fetching new courses:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNewCourses();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 text-white py-16">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center bg-white/10 text-white rounded-full px-4 py-2 mb-4">
                            <CalendarDays className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium">
                                Mới cập nhật
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Newest Courses
                        </h1>
                        <p className="text-lg md:text-xl opacity-90 mb-8">
                            Latest courses with updated content and modern
                            teaching methods
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
                        {/* New Courses Grid */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Newest Courses
                                </h2>
                                <div className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                                    <span className="text-sm font-medium">
                                        Updated this month
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {courses.slice(0, 8).map((course, index) => (
                                    <CourseCard
                                        key={index}
                                        id={course.id}
                                        title={course.title}
                                        description={course.description}
                                        thumbnail={course.thumbnail}
                                        price={course.price}
                                        newPrice={course.newPrice}
                                        tags={course.tags}
                                        rating={course.rating || 4.5}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Coming Soon */}
                        <div className="mt-16 mb-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Coming Soon
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {courses.slice(8, 12).map((course, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow"
                                    >
                                        <div className="md:w-1/3 relative">
                                            <img
                                                src={
                                                    course.thumbnail ||
                                                    "/images/course-placeholder.jpg"
                                                }
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                                style={{ minHeight: "200px" }}
                                            />
                                            <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
                                                <span className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
                                                    Coming Soon in{" "}
                                                    {Math.floor(
                                                        Math.random() * 30
                                                    ) + 1}{" "}
                                                    days
                                                </span>
                                            </div>
                                        </div>
                                        <div className="md:w-2/3 p-6">
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                {course.description}
                                            </p>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="flex items-center">
                                                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                                    <span className="text-sm text-gray-700">
                                                        Expected{" "}
                                                        {(
                                                            4 + Math.random()
                                                        ).toFixed(1)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 text-green-500 mr-1" />
                                                    <span className="text-sm text-gray-700">
                                                        {Math.floor(
                                                            Math.random() * 20
                                                        ) + 5}{" "}
                                                        hours
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 text-blue-500 mr-1" />
                                                    <span className="text-sm text-gray-700">
                                                        {Math.floor(
                                                            Math.random() * 100
                                                        )}{" "}
                                                        registrations
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                                                Register for Notification
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-center mt-12 space-x-4">
                            <Link href="/courses">
                                <button className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                                    All Courses
                                </button>
                            </Link>
                            <Link href="/courses/featured">
                                <button className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                                    Featured Courses
                                </button>
                            </Link>
                            <Link href="/courses/popular">
                                <button className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
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

export default NewReleasesPage;
