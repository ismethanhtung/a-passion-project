"use client";

import React, { useEffect, useState } from "react";
import { fetchCourses } from "@/api/courses";
import Course from "@/interfaces/course";
import CourseCard from "@/components/courseCard";
import {
    ArrowRight,
    Check,
    ChevronRight,
    Globe,
    Library,
    Users,
} from "lucide-react";
import Link from "next/link";

interface LanguageCategory {
    id: number;
    name: string;
    icon: string;
    color: string;
    courseCount: number;
    courses: Course[];
}

const PopularLanguagesPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [languageCategories, setLanguageCategories] = useState<
        LanguageCategory[]
    >([]);
    const [selectedLanguage, setSelectedLanguage] = useState<number | null>(
        null
    );

    // Danh sách ngôn ngữ phổ biến
    const popularLanguages = [
        { id: 1, name: "English", icon: "🇬🇧", color: "bg-blue-500" },
    ];

    useEffect(() => {
        const fetchLanguageCourses = async () => {
            setIsLoading(true);
            try {
                const allCourses = await fetchCourses();

                // Tạo categorias ngôn ngữ với các khóa học
                const categories = popularLanguages.map((language) => {
                    // Lọc các khóa học theo ngôn ngữ (giả định dựa trên tiêu đề hoặc tags)
                    let languageCourses: Course[] = [];

                    if (language.name === "Tiếng Anh") {
                        languageCourses = allCourses.filter(
                            (course) =>
                                course.title.includes("English") ||
                                course.title.includes("TOEIC") ||
                                course.title.includes("IELTS") ||
                                (course.tags && course.tags.includes("English"))
                        );
                    } else if (language.name === "Tiếng Nhật") {
                        languageCourses = allCourses.filter(
                            (course) =>
                                course.title.includes("Japanese") ||
                                course.title.includes("Nhật") ||
                                (course.tags &&
                                    course.tags.includes("Japanese"))
                        );
                    } else if (language.name === "Tiếng Hàn") {
                        languageCourses = allCourses.filter(
                            (course) =>
                                course.title.includes("Korean") ||
                                course.title.includes("Hàn") ||
                                (course.tags && course.tags.includes("Korean"))
                        );
                    } else {
                        // Lấy một số khóa học ngẫu nhiên cho các ngôn ngữ khác
                        const randomCourses = [...allCourses]
                            .sort(() => 0.5 - Math.random())
                            .slice(0, 4 + Math.floor(Math.random() * 4));
                        languageCourses = randomCourses;
                    }

                    return {
                        ...language,
                        courseCount: languageCourses.length,
                        courses: languageCourses.slice(0, 8), // Giới hạn 8 khóa học mỗi ngôn ngữ
                    };
                });

                setLanguageCategories(categories);
                // Mặc định chọn ngôn ngữ đầu tiên
                setSelectedLanguage(categories[0].id);
            } catch (error) {
                console.error("Error fetching language courses:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLanguageCourses();
    }, []);

    // Lấy thông tin ngôn ngữ đang được chọn
    const selectedLanguageData = languageCategories.find(
        (lang) => lang.id === selectedLanguage
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-green-500 via-green-600 to-teal-700 text-white py-16">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center bg-white/10 text-white rounded-full px-4 py-2 mb-4">
                            <Globe className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium">
                                Popular Languages
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Popular Languages
                        </h1>
                        <p className="text-lg md:text-xl opacity-90 mb-8">
                            Discover courses for various languages worldwide
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-12">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, index) => (
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
                        {/* Language Selection */}
                        <div className="mb-12">
                            <div className="mt-16 bg-white rounded-2xl shadow-md p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                    Why Learn a New Language?
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                            <Globe className="h-8 w-8 text-green-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Expanding Opportunities
                                        </h3>
                                        <p className="text-gray-600">
                                            Learning a new language opens up new
                                            opportunities for your career and
                                            learning globally
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                            <Users className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Connecting Cultures
                                        </h3>
                                        <p className="text-gray-600">
                                            Understanding and experiencing
                                            different cultures deeply
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                                            <Check className="h-8 w-8 text-purple-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Developing Thinking
                                        </h3>
                                        <p className="text-gray-600">
                                            Learning a new language improves
                                            memory and multi-dimensional
                                            thinking
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Selected Language Courses */}
                        {selectedLanguageData && (
                            <div className="mb-16">
                                <div className="flex justify-between items-center mb-6">
                                    <Link
                                        href="/courses"
                                        className="text-green-600 hover:text-green-800 flex items-center text-sm font-medium"
                                    >
                                        View all{" "}
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Link>
                                </div>

                                {selectedLanguageData.courses.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {selectedLanguageData.courses.map(
                                            (course, index) => (
                                                <CourseCard
                                                    key={index}
                                                    id={course.id}
                                                    title={course.title}
                                                    description={
                                                        course.description
                                                    }
                                                    thumbnail={course.thumbnail}
                                                    price={course.price}
                                                    newPrice={course.newPrice}
                                                    tags={course.tags}
                                                    rating={
                                                        course.rating || 4.5
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl p-8 text-center shadow-md">
                                        <Library className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            No courses available
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            Currently, we do not have any
                                            courses for this language.
                                        </p>
                                        <Link href="/courses">
                                            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                                Explore other courses
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Why Learn Languages Section */}

                        {/* Navigation */}
                        <div className="flex justify-center mt-12 space-x-4">
                            <Link href="/courses">
                                <button className="px-6 py-2 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors">
                                    All Courses
                                </button>
                            </Link>
                            <Link href="/courses/featured">
                                <button className="px-6 py-2 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors">
                                    Featured Courses
                                </button>
                            </Link>
                            <Link href="/courses/new">
                                <button className="px-6 py-2 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors">
                                    New Courses
                                </button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PopularLanguagesPage;
